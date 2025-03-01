"use server";

import tar from "tar-stream";
import Docker from "dockerode";
import { Readable } from "stream";
import { LanguageConfigs } from "@/config/judge";

const docker = new Docker({ socketPath: "/var/run/docker.sock" });

async function prepareEnvironment(image: string, tag: string) {
  const reference = `${image}:${tag}`;
  const filters = { reference: [reference] };
  const images = await docker.listImages({ filters });

  if (images.length === 0) {
    await docker.pull(reference);
  }
}

async function createContainer(image: string, tag: string, workingDir: string) {
  const container = await docker.createContainer({
    Image: `${image}:${tag}`,
    Tty: true,
    WorkingDir: workingDir,
  });

  await container.start();
  return container;
}

function createTarStream(filePath: string, value: string) {
  const pack = tar.pack();
  pack.entry({ name: filePath }, value);
  pack.finalize();
  return Readable.from(pack);
}

async function compileCode(container: Docker.Container, filePath: string, fileName: string) {
  const compileExec = await container.exec({
    Cmd: ["gcc", filePath, "-o", fileName],
    AttachStdout: true,
    AttachStderr: true,
  });

  return new Promise<string>((resolve, reject) => {
    compileExec.start({}, (error, stream) => {
      if (error) {
        return reject(error);
      }
      if (!stream) {
        return reject(new Error("Stream is undefined"));
      }

      let data = "";
      stream.on("data", (chunk) => (data += chunk.toString()));
      stream.on("end", () => resolve(data));
      stream.on("error", (error) => reject(error));
    });
  });
}

async function runCode(container: Docker.Container, fileName: string) {
  const runExec = await container.exec({
    Cmd: [`./${fileName}`],
    AttachStdout: true,
    AttachStderr: true,
  });

  return new Promise<string>((resolve, reject) => {
    runExec.start({}, (error, stream) => {
      if (error) {
        return reject(error);
      }
      if (!stream) {
        return reject(new Error("Stream is undefined"));
      }

      let data = "";
      stream.on("data", (chunk) => (data += chunk.toString()));
      stream.on("end", () => resolve(data));
      stream.on("error", (error) => reject(error));
    });
  });
}

async function cleanupContainer(container: Docker.Container) {
  try {
    await container.stop({ t: 0 });
    await container.remove();
  } catch (error) {
    console.error("Container cleanup failed:", error);
  }
}

export async function judge(language: string, value: string) {
  const { image, tag, fileName, extension, workingDir } = LanguageConfigs[language];
  const filePath = `${fileName}.${extension}`;
  let container: Docker.Container | undefined;

  try {
    await prepareEnvironment(image, tag);
    container = await createContainer(image, tag, workingDir);

    const tarStream = createTarStream(filePath, value);
    await container.putArchive(tarStream, { path: workingDir });

    const compileOutput = await compileCode(container, filePath, fileName);
    if (compileOutput) {
      return compileOutput;
    }

    const runOutput = await runCode(container, fileName);
    return runOutput;
  } catch (error) {
    console.error("Error during judging:", error);
    throw error;
  } finally {
    if (container) {
      cleanupContainer(container).catch(() => {});
    }
  }
}
