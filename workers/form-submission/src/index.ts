import Queue from "bull";
import { db } from "./lib/db";
import { formSubmissionsTable } from "./db/schema";
import customLogger from "./utils/logger";

const redisHost = process.env.UPSTASH_REDIS_HOST || "localhost";
const redisPort = Number(process.env.UPSTASH_REDIS_PORT) || 6379;
const redisPassword = process.env.UPSTASH_REDIS_REST_TOKEN || "";

const queueConfig = {
  stalledInterval: 300000,
  guardInterval: 5000,
  drainDelay: 300,
};

const formProcessingQueue = new Queue("form-processing-queue", {
  redis: {
    host: redisHost,
    port: redisPort,
    password: redisPassword,
  },
  limiter: {
    max: 100,
    duration: 1000,
  },
  ...queueConfig,
});

customLogger.info("Worker started. Listening for jobs...");

formProcessingQueue.process(async (job) => {
  customLogger.info(`Processing job ${job.id}`);
  try {
    const { event } = job.data;
    const submissionData = JSON.parse(event);

    await db.insert(formSubmissionsTable).values({
      id: submissionData.id,
      user_email: submissionData.user_email,
      formId: submissionData.formId,
      submissionData: submissionData.submissionData,
    });

    customLogger.info(`Job ${job.id} completed successfully`);
  } catch (error) {
    customLogger.error(`Job ${job.id} failed: ${error}`);
    throw error;
  }
});

const shutdown = async () => {
  customLogger.info("Shutting down worker...");
  await formProcessingQueue.close();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
