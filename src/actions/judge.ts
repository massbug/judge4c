"use server";

import fs from "fs";
import tar from "tar-stream";
import Docker from "dockerode";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Readable, Writable } from "stream";
import { Status } from "@/generated/client";
import { revalidatePath } from "next/cache";
import type { ProblemWithTestcases, TestcaseWithDetails } from "@/types/prisma";
import type { EditorLanguage, Submission, TestcaseResult } from "@/generated/client";

const isRemote = process.env.DOCKER_HOST_MODE === "remote";

// Docker client initialization
const docker = isRemote
  ? new Docker({
    protocol: process.env.DOCKER_REMOTE_PROTOCOL as "https" | "http" | "ssh" | undefined,
    host: process.env.DOCKER_REMOTE_HOST,
    port: process.env.DOCKER_REMOTE_PORT,
    ca: fs.readFileSync(process.env.DOCKER_REMOTE_CA_PATH || "/certs/ca.pem"),
    cert: fs.readFileSync(process.env.DOCKER_REMOTE_CERT_PATH || "/certs/cert.pem"),
    key: fs.readFileSync(process.env.DOCKER_REMOTE_KEY_PATH || "/certs/key.pem"),
  })
  : new Docker({ socketPath: "/var/run/docker.sock" });

// Prepare Docker image environment
async function prepareEnvironment(image: string, tag: string): Promise<boolean> {
  try {
    const reference = `${image}:${tag}`;
    const filters = { reference: [reference] };
    const images = await docker.listImages({ filters });
    return images.length !== 0;
  } catch (error) {
    console.error("Error checking Docker images:", error);
    return false;
  }
}

// Create Docker container with keep-alive
async function createContainer(
  image: string,
  tag: string,
  workingDir: string,
  memoryLimit?: number
) {
  const container = await docker.createContainer({
    Image: `${image}:${tag}`,
    Cmd: ["tail", "-f", "/dev/null"], // Keep container alive
    WorkingDir: workingDir,
    HostConfig: {
      Memory: memoryLimit ? memoryLimit * 1024 * 1024 : undefined,
      MemorySwap: memoryLimit ? memoryLimit * 1024 * 1024 : undefined,
    },
    NetworkDisabled: true,
  });

  await container.start();
  return container;
}

// Create tar stream for code submission
function createTarStream(file: string, value: string) {
  const pack = tar.pack();
  pack.entry({ name: file }, value);
  pack.finalize();
  return Readable.from(pack);
}

export async function judge(
  language: EditorLanguage,
  code: string,
  problemId: string,
): Promise<Submission> {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const userId = session.user.id;
  let container: Docker.Container | null = null;
  let submission: Submission | null = null;

  try {
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: {
        testcases: {
          include: {
            data: true,
          },
        },
      },
    }) as ProblemWithTestcases | null;

    if (!problem) {
      submission = await prisma.submission.create({
        data: {
          language,
          code,
          status: Status.SE,
          userId,
          problemId,
          message: "Problem not found",
        },
      });
      return submission;
    }

    const config = await prisma.editorLanguageConfig.findUnique({
      where: { language },
      include: {
        dockerConfig: true,
      },
    });

    if (!config?.dockerConfig) {
      submission = await prisma.submission.create({
        data: {
          language,
          code,
          status: Status.SE,
          userId,
          problemId,
          message: " Missing editor or docker configuration",
        },
      });
      return submission;
    }

    const testcases = problem.testcases;

    if (!testcases || testcases.length === 0) {
      submission = await prisma.submission.create({
        data: {
          language,
          code,
          status: Status.SE,
          userId,
          problemId,
          message: "Testcases not found",
        },
      });
      return submission;
    }

    const {
      image,
      tag,
      workingDir,
      compileOutputLimit,
      runOutputLimit,
    } = config.dockerConfig;
    const { fileName, fileExtension } = config;
    const file = `${fileName}.${fileExtension}`;

    // Prepare the environment and create a container
    if (await prepareEnvironment(image, tag)) {
      container = await createContainer(image, tag, workingDir, problem.memoryLimit);
    } else {
      console.error("Docker image not found:", image, ":", tag);
      submission = await prisma.submission.create({
        data: {
          language,
          code,
          status: Status.SE,
          userId,
          problemId,
          message: "The docker environment is not ready",
        },
      });
      return submission;
    }

    submission = await prisma.submission.create({
      data: {
        language,
        code,
        status: Status.PD,
        userId,
        problemId,
        message: "",
      },
    });

    // Upload code to the container
    const tarStream = createTarStream(file, code);
    await container.putArchive(tarStream, { path: workingDir });

    // Compile the code
    const compileResult = await compile(container, file, fileName, compileOutputLimit, submission.id);
    if (compileResult.status === Status.CE) {
      return compileResult;
    }

    // Run the code
    const runResult = await run(container, fileName, problem.timeLimit, runOutputLimit, submission.id, testcases);
    return runResult;
  } catch (error) {
    console.error(error);
    if (submission) {
      const updatedSubmission = await prisma.submission.update({
        where: { id: submission.id },
        data: {
          status: Status.SE,
          message: "System Error",
        }
      })
      return updatedSubmission;
    } else {
      submission = await prisma.submission.create({
        data: {
          language,
          code,
          status: Status.PD,
          userId,
          problemId,
          message: "",
        },
      })
      return submission;
    }
  } finally {
    revalidatePath(`/problems/${problemId}`);
    if (container) {
      try {
        await container.kill();
        await container.remove();
      } catch (error) {
        console.error("Container cleanup failed:", error);
      }
    }
  }
}

async function compile(
  container: Docker.Container,
  file: string,
  fileName: string,
  compileOutputLimit: number = 1 * 1024 * 1024,
  submissionId: string,
): Promise<Submission> {
  const compileExec = await container.exec({
    Cmd: ["gcc", "-O2", file, "-o", fileName],
    AttachStdout: true,
    AttachStderr: true,
  });

  return new Promise<Submission>((resolve, reject) => {
    compileExec.start({}, (error, stream) => {
      if (error || !stream) {
        return reject({ message: "System Error", Status: Status.SE });
      }

      const stdoutChunks: string[] = [];
      let stdoutLength = 0;
      const stdoutStream = new Writable({
        write(chunk, _encoding, callback) {
          let text = chunk.toString();
          if (stdoutLength + text.length > compileOutputLimit) {
            text = text.substring(0, compileOutputLimit - stdoutLength);
            stdoutChunks.push(text);
            stdoutLength = compileOutputLimit;
            callback();
            return;
          }
          stdoutChunks.push(text);
          stdoutLength += text.length;
          callback();
        },
      });

      const stderrChunks: string[] = [];
      let stderrLength = 0;
      const stderrStream = new Writable({
        write(chunk, _encoding, callback) {
          let text = chunk.toString();
          if (stderrLength + text.length > compileOutputLimit) {
            text = text.substring(0, compileOutputLimit - stderrLength);
            stderrChunks.push(text);
            stderrLength = compileOutputLimit;
            callback();
            return;
          }
          stderrChunks.push(text);
          stderrLength += text.length;
          callback();
        },
      });

      docker.modem.demuxStream(stream, stdoutStream, stderrStream);

      stream.on("end", async () => {
        const stdout = stdoutChunks.join("");
        const stderr = stderrChunks.join("");
        const exitCode = (await compileExec.inspect()).ExitCode;

        let updatedSubmission: Submission;

        if (exitCode !== 0 || stderr) {
          updatedSubmission = await prisma.submission.update({
            where: { id: submissionId },
            data: {
              status: Status.CE,
              message: stderr || "Compilation Error",
            },
          });
        } else {
          updatedSubmission = await prisma.submission.update({
            where: { id: submissionId },
            data: {
              status: Status.CS,
              message: stdout,
            },
          });
        }

        resolve(updatedSubmission);
      });

      stream.on("error", () => {
        reject({ message: "System Error", Status: Status.SE });
      });
    });
  });
}

// Run code and implement timeout
async function run(
  container: Docker.Container,
  fileName: string,
  timeLimit: number = 1000,
  maxOutput: number = 1 * 1024 * 1024,
  submissionId: string,
  testcases: TestcaseWithDetails,
): Promise<Submission> {
  let finalSubmission: Submission | null = null;
  let maxExecutionTime = 0;

  for (const testcase of testcases) {
    const sortedData = testcase.data.sort((a, b) => a.index - b.index);
    const inputData = sortedData.map(d => d.value).join("\n");

    const runExec = await container.exec({
      Cmd: [`./${fileName}`],
      AttachStdout: true,
      AttachStderr: true,
      AttachStdin: true,
    });

    const result = await new Promise<Submission | TestcaseResult>((resolve, reject) => {
      // Start the exec stream
      runExec.start({ hijack: true }, async (error, stream) => {
        if (error || !stream) {
          const submission = await prisma.submission.update({
            where: { id: submissionId },
            data: {
              status: Status.SE,
              message: "System Error",
            }
          })
          return resolve(submission);
        }

        stream.write(inputData);
        stream.end();

        const stdoutChunks: string[] = [];
        const stderrChunks: string[] = [];
        let stdoutLength = 0;
        let stderrLength = 0;

        const stdoutStream = new Writable({
          write: (chunk, _, callback) => {
            const text = chunk.toString();
            if (stdoutLength + text.length > maxOutput) {
              stdoutChunks.push(text.substring(0, maxOutput - stdoutLength));
              stdoutLength = maxOutput;
            } else {
              stdoutChunks.push(text);
              stdoutLength += text.length;
            }
            callback();
          }
        });

        const stderrStream = new Writable({
          write: (chunk, _, callback) => {
            const text = chunk.toString();
            if (stderrLength + text.length > maxOutput) {
              stderrChunks.push(text.substring(0, maxOutput - stderrLength));
              stderrLength = maxOutput;
            } else {
              stderrChunks.push(text);
              stderrLength += text.length;
            }
            callback();
          }
        });

        docker.modem.demuxStream(stream, stdoutStream, stderrStream);

        const startTime = Date.now();

        // Timeout mechanism
        const timeoutId = setTimeout(async () => {
          stream.destroy(); // Destroy the stream to stop execution
          const updatedSubmission = await prisma.submission.update({
            where: { id: submissionId },
            data: {
              status: Status.TLE,
              message: "Time Limit Exceeded",
            }
          })
          resolve(updatedSubmission);
        }, timeLimit);

        stream.on("end", async () => {
          clearTimeout(timeoutId); // Clear the timeout if the program finishes before the time limit
          const stdout = stdoutChunks.join("");
          const stderr = stderrChunks.join("");
          const exitCode = (await runExec.inspect()).ExitCode;
          const executionTime = Date.now() - startTime;

          // Exit code 0 means successful execution
          if (exitCode === 0) {
            const expectedOutput = testcase.expectedOutput;
            const testcaseResult = await prisma.testcaseResult.create({
              data: {
                isCorrect: stdout.trim() === expectedOutput.trim(),
                output: stdout,
                executionTime,
                submissionId,
                testcaseId: testcase.id,
              }
            })
            resolve(testcaseResult);
          } else if (exitCode === 137) {
            await prisma.testcaseResult.create({
              data: {
                isCorrect: false,
                output: stdout,
                executionTime,
                submissionId,
                testcaseId: testcase.id,
              }
            })
            const updatedSubmission = await prisma.submission.update({
              where: { id: submissionId },
              data: {
                status: Status.MLE,
                message: stderr || "Memory Limit Exceeded",
              }
            })
            resolve(updatedSubmission);
          } else {
            await prisma.testcaseResult.create({
              data: {
                isCorrect: false,
                output: stdout,
                executionTime,
                submissionId,
                testcaseId: testcase.id,
              }
            })
            const updatedSubmission = await prisma.submission.update({
              where: { id: submissionId },
              data: {
                status: Status.RE,
                message: stderr || "Runtime Error",
              }
            })
            resolve(updatedSubmission);
          }
        });

        stream.on("error", () => {
          clearTimeout(timeoutId); // Clear timeout in case of error
          reject({ message: "System Error", Status: Status.SE });
        });
      });
    });

    if ('status' in result) {
      return result;
    } else {
      if (!result.isCorrect) {
        finalSubmission = await prisma.submission.update({
          where: { id: submissionId },
          data: {
            status: Status.WA,
            message: "Wrong Answer",
          },
          include: {
            TestcaseResult: true,
          }
        });
        return finalSubmission;
      } else {
        maxExecutionTime = Math.max(maxExecutionTime, result.executionTime ?? 0);
      }
    }
  }
  finalSubmission = await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: Status.AC,
      message: "All testcases passed",
      executionTime: maxExecutionTime,
    },
    include: {
      TestcaseResult: true,
    }
  });
  return finalSubmission;
}
