import pino from "pino";

const logger =
  process.env["NODE_ENV"] === "production"
    ? // JSON in production
    pino({ level: "info" })
    : // Pretty print in development
    pino({
      level: "debug",
      transport: {
        target: "pino-pretty",
        options: {
          levelFirst: true,
          colorize: true,
          ignore: "hostname,pid",
          translateTime: "yyyy-mm-dd HH:MM:ss",
        },
      },
    });

export { logger };
