import "server-only";

import fs from "fs";
import tar from "tar-stream";
import Docker from "dockerode";
import { Readable } from "stream";
import { Writable } from "stream";
import type { DockerConfig } from "@/generated/client";

const isRemote = process.env.DOCKER_HOST_MODE === "remote";

// Docker client initialization
export const docker: Docker = isRemote
  ? new Docker({
      protocol: process.env.DOCKER_REMOTE_PROTOCOL as
        | "https"
        | "http"
        | "ssh"
        | undefined,
      host: process.env.DOCKER_REMOTE_HOST,
      port: process.env.DOCKER_REMOTE_PORT,
      ca: fs.readFileSync(process.env.DOCKER_REMOTE_CA_PATH || "/certs/ca.pem"),
      cert: fs.readFileSync(
        process.env.DOCKER_REMOTE_CERT_PATH || "/certs/cert.pem"
      ),
      key: fs.readFileSync(
        process.env.DOCKER_REMOTE_KEY_PATH || "/certs/key.pem"
      ),
    })
  : new Docker({ socketPath: "/var/run/docker.sock" });

// Prepare Docker image environment
export const prepareEnvironment = async (
  image: string,
  tag: string
): Promise<boolean> => {
  try {
    const reference = `${image}:${tag}`;
    const filters = { reference: [reference] };
    const images = await docker.listImages({ filters });
    return images.length !== 0;
  } catch (error) {
    console.error("Error checking Docker images:", error);
    return false;
  }
};

// Create Docker container with keep-alive
export const createContainer = async (
  config: DockerConfig,
  memoryLimit: number
): Promise<Docker.Container> => {
  const { image, tag, workingDir } = config;
  const container = await docker.createContainer({
    Image: `${image}:${tag}`,
    Cmd: ["tail", "-f", "/dev/null"],
    WorkingDir: workingDir,
    HostConfig: {
      Memory: memoryLimit,
      MemorySwap: memoryLimit,
    },
    NetworkDisabled: true,
  });

  await container.start();
  return container;
};

// Create tar stream for submission
export const createTarStream = (fileName: string, fileContent: string) => {
  const pack = tar.pack();
  pack.entry({ name: fileName }, fileContent);
  pack.finalize();
  return Readable.from(pack);
};

export const createLimitedStream = (maxSize: number) => {
  const buffers: string[] = [];
  let totalLength = 0;

  const stream = new Writable({
    write(chunk, _encoding, callback) {
      const text = chunk.toString();
      const remaining = maxSize - totalLength;

      if (remaining <= 0) {
        callback();
        return;
      }

      if (text.length > remaining) {
        buffers.push(text.slice(0, remaining));
        totalLength = maxSize;
      } else {
        buffers.push(text);
        totalLength += text.length;
      }

      callback();
    },
  });

  return {
    stream,
    buffers,
  };
};
