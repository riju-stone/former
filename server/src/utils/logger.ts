import { env } from "env";
import pino from "pino";

const LOG_DATE = new Date().toISOString().split("T")[0];

const transport = pino.transport({
  targets: [
    {
      target: "pino-pretty",
      options: { colorize: true, ignore: "hostname" },
    },
    {
      target: "pino/file",
      options: {
        destination: `${env.LOG_DIR}/${LOG_DATE}.log`,
        mkdir: true,
      },
    },
  ],
});

const customLogger = pino(
  {
    level: env.LOG_LEVEL || "info",
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
);

export default customLogger;
