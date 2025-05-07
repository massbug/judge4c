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
import type { EditorLanguage, Submission, TestcaseResult } from "@/generated/client";
import RandExp from "randexp";

const isRemote = process.env.DOCKER_HOST_MODE === "remote";
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

async function prepareEnvironment(image: string, tag: string): Promise<boolean> {
  try {
    const reference = `${image}:${tag}`;
    const filters = { reference: [reference] };
    const images = await docker.listImages({ filters });
    return images.length > 0;
  } catch (error) {
    console.error("Error checking Docker images:", error);
    return false;
  }
}

async function createContainer(
    image: string,
    tag: string,
    workingDir: string,
    memoryLimit?: number
) {
  const container = await docker.createContainer({
    Image: `${image}:${tag}`,
    Cmd: ["tail", "-f", "/dev/null"],
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

function createTarStream(file: string, value: string) {
  const pack = tar.pack();
  pack.entry({ name: file }, value);
  pack.finalize();
  return Readable.from(pack);
}

// Generate random input cases based on TestcaseDataConfig
async function generateRandomCases(problemId: string, count: number) {
  const configs = await prisma.testcaseDataConfig.findMany({
    where: { testcaseData: { testcase: { problemId } } },
    include: { testcaseData: true },
  });
  const grouped: Record<number, typeof configs> = {};
  configs.forEach(cfg => {
    const idx = cfg.testcaseData.index;
    grouped[idx] = grouped[idx] || [];
    grouped[idx].push(cfg);
  });
  const cases: { id: string; data: { index: number; value: string }[] }[] = [];
  for (let i = 0; i < count; i++) {
    const inputs: { index: number; value: string }[] = [];
    Object.keys(grouped)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach(idx => {
          grouped[idx].forEach(cfg => {
            let value: string;
            switch (cfg.type.toUpperCase()) {
              case "INT":
                value = String(
                    Math.floor(
                        Math.random() * ((cfg.max ?? 100) - (cfg.min ?? 0) + 1)
                    ) + (cfg.min ?? 0)
                );
                break;
              case "FLOAT": {
                const lo = cfg.min ?? 0;
                const hi = cfg.max ?? lo + 1;
                value = (Math.random() * (hi - lo) + lo).toFixed(3);
                break;
              }
              case "BOOLEAN":
                value = String(Math.random() < 0.5);
                break;
              case "STRING":
                if (cfg.pattern) value = new RandExp(cfg.pattern).gen();
                else {
                  const len = cfg.length ?? 10;
                  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                  value = Array.from({ length: len })
                      .map(() =>
                          chars.charAt(Math.floor(Math.random() * chars.length))
                      )
                      .join('');
                }
                break;
              default:
                value = '';
            }
            inputs.push({ index: idx, value });
          });
        });
    cases.push({ id: String(i), data: inputs });
  }
  return cases;
}

export async function judge(
    language: EditorLanguage,
    code: string,
    problemId: string,
    randomCount: number = 10
): Promise<Submission> {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  const userId = session.user.id;

  let container: Docker.Container | null = null;
  let submission: Submission | null = null;
  try {
    const problem = await prisma.problem.findUnique({ where: { id: problemId } });
    if (!problem) {
      return prisma.submission.create({
        data: { language, code, status: Status.SE, userId, problemId, message: "Problem not found" },
      });
    }
    const config = await prisma.editorLanguageConfig.findUnique({
      where: { language },
      include: { dockerConfig: true },
    });
    if (!config?.dockerConfig) {
      return prisma.submission.create({
        data: { language, code, status: Status.SE, userId, problemId, message: "Missing docker configuration" },
      });
    }
    const { image, tag, workingDir, compileOutputLimit, runOutputLimit } = config.dockerConfig;
    const { fileName, fileExtension } = config;
    const file = `${fileName}.${fileExtension}`;

    if (!(await prepareEnvironment(image, tag))) {
      return prisma.submission.create({
        data: { language, code, status: Status.SE, userId, problemId, message: "Docker environment not ready" },
      });
    }
    container = await createContainer(image, tag, workingDir, problem.memoryLimit);
    submission = await prisma.submission.create({
      data: { language, code, status: Status.PD, userId, problemId, message: "" },
    });

    // Upload code
    const tarStream = createTarStream(file, code);
    await container.putArchive(tarStream, { path: workingDir });

    // Compile
    const compileResult = await compile(
        container,
        file,
        fileName,
        compileOutputLimit,
        submission.id,
        language
    );
    if (compileResult.status === Status.CE) return compileResult;

    // Generate random test cases
    const testcases = await generateRandomCases(problemId, randomCount);

    // Run
    const runResult = await run(
        container,
        fileName,
        problem.timeLimit,
        runOutputLimit,
        submission.id,
        testcases
    );
    return runResult;
  } catch (error) {
    console.error(error);
    if (submission) {
      return prisma.submission.update({
        where: { id: submission.id },
        data: { status: Status.SE, message: "System Error" },
      });
    }
    return prisma.submission.create({
      data: { language, code, status: Status.SE, userId, problemId, message: "System Error" },
    });
  } finally {
    revalidatePath(`/problems/${problemId}`);
    if (container) {
      try {
        await container.kill();
        await container.remove();
      } catch {}
    }
  }
}

async function compile(
    container: Docker.Container,
    file: string,
    fileName: string,
    compileOutputLimit: number,
    submissionId: string,
    language: EditorLanguage
): Promise<Submission> {
  const compileCmd =
      language === "c"
          ? ["gcc", "-O2", file, "-o", fileName]
          : language === "cpp"
              ? ["g++", "-O2", file, "-o", fileName]
              : null;
  if (!compileCmd) {
    return prisma.submission.update({
      where: { id: submissionId },
      data: { status: Status.SE, message: "Unsupported language" },
    });
  }

  const exec = await container.exec({
    Cmd: compileCmd,
    AttachStdout: true,
    AttachStderr: true,
  });

  return new Promise<Submission>((resolve, reject) => {
    exec.start({}, (err, stream) => {
      if (err || !stream) return reject(err || "No stream");

      const stdoutChunks: string[] = [];
      const stderrChunks: string[] = [];
      let stdoutLen = 0;
      let stderrLen = 0;

      const out = new Writable({
        write(chunk, _, cb) {
          let txt = chunk.toString();
          if (stdoutLen + txt.length > compileOutputLimit) {
            txt = txt.slice(0, compileOutputLimit - stdoutLen);
          }
          stdoutLen += txt.length;
          stdoutChunks.push(txt);
          cb();
        },
      });
      const errOut = new Writable({
        write(chunk, _, cb) {
          let txt = chunk.toString();
          if (stderrLen + txt.length > compileOutputLimit) {
            txt = txt.slice(0, compileOutputLimit - stderrLen);
          }
          stderrLen += txt.length;
          stderrChunks.push(txt);
          cb();
        },
      });

      docker.modem.demuxStream(stream, out, errOut);
      stream.on("end", async () => {
        const { ExitCode } = await exec.inspect();
        const stdout = stdoutChunks.join("");
        const stderr = stderrChunks.join("");
        if (ExitCode !== 0 || stderr) {
          resolve(
              prisma.submission.update({
                where: { id: submissionId },
                data: { status: Status.CE, message: stderr || stdout },
              })
          );
        } else {
          resolve(
              prisma.submission.update({
                where: { id: submissionId },
                data: { status: Status.CS, message: stdout },
              })
          );
        }
      });
    });
  });
}

async function run(
    container: Docker.Container,
    fileName: string,
    timeLimit: number,
    maxOutput: number,
    submissionId: string,
    testcases: { id: string; data: { index: number; value: string }[] }[]
): Promise<Submission> {
  let maxTime = 0;
  for (const tc of testcases) {
    const input = tc.data.map(d => d.value).join("\n");
    const exec = await container.exec({
      Cmd: [`./${fileName}`],
      AttachStdout: true,
      AttachStderr: true,
      AttachStdin: true,
    });
    const result = await new Promise<Submission>((resolve) => {
      exec.start({ hijack: true }, (err, stream) => {
        if (err || !stream) {
          return resolve(
              prisma.submission.update({
                where: { id: submissionId },
                data: { status: Status.SE, message: "System Error" },
              })
          );
        }
        const stdoutChunks: string[] = [];
        const stderrChunks: string[] = [];
        let outLen = 0;
        let errLen = 0;
        const out = new Writable({ write(chunk, _, cb) {
            const txt = chunk.toString();
            if (outLen + txt.length > maxOutput) {
              stdoutChunks.push(txt.slice(0, maxOutput - outLen));
              outLen = maxOutput;
            } else {
              stdoutChunks.push(txt);
              outLen += txt.length;
            }
            cb();
          }});
        const errOut = new Writable({ write(chunk, _, cb) {
            const txt = chunk.toString();
            if (errLen + txt.length > maxOutput) {
              stderrChunks.push(txt.slice(0, maxOutput - errLen));
              errLen = maxOutput;
            } else {
              stderrChunks.push(txt);
              errLen += txt.length;
            }
            cb();
          }});
        docker.modem.demuxStream(stream, out, errOut);

        stream.write(input);
        stream.end();
        const start = Date.now();
        const timeout = setTimeout(async () => {
          stream.destroy();
          resolve(
              prisma.submission.update({
                where: { id: submissionId },
                data: { status: Status.TLE, message: "Time Limit Exceeded" },
              })
          );
        }, timeLimit);

        stream.on("end", async () => {
          clearTimeout(timeout);
          const execInfo = await exec.inspect();
          const elapsed = Date.now() - start;
          const stdout = stdoutChunks.join("");
          const stderr = stderrChunks.join("");
          switch (execInfo.ExitCode) {
            case 0:
              maxTime = Math.max(maxTime, elapsed);
              break;
            case 137:
              return resolve(
                  prisma.submission.update({
                    where: { id: submissionId },
                    data: { status: Status.MLE, message: stderr || "Memory Limit Exceeded" },
                  })
              );
            default:
              return resolve(
                  prisma.submission.update({
                    where: { id: submissionId },
                    data: { status: Status.RE, message: stderr || stdout },
                  })
              );
          }
          resolve(
              prisma.submission.update({
                where: { id: submissionId },
                data: {},
              })
          );
        });
      });
    });
    if (result.status !== Status.CS) return result;
  }
  return prisma.submission.update({
    where: { id: submissionId },
    data: { status: Status.AC, message: "Random tests passed", executionTime: maxTime },
  });
}
