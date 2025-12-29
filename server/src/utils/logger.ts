import { env } from "../env.js";
import pino from "pino";

const LOG_DATE = new Date().toISOString().split("T")[0];

const targets: any[] = [];

if (env.NODE_ENV === "dev") {
  targets.push({
    target: "pino-pretty",
    options: { colorize: true, ignore: "hostname" },
  });
  targets.push({
    target: "pino/file",
    options: {
      destination: `${env.LOG_DIR}/${LOG_DATE}.log`,
      mkdir: true,
    },
  });
}

const transport =
  targets.length > 0
    ? pino.transport({
      targets,
    })
    : undefined;

const customLogger = pino(
  {
    level: env.LOG_LEVEL || "info",
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
);

export default customLogger;
