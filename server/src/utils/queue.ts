import Queue from "bull";
import { env } from "../env.js";

const redisHost = env.UPSTASH_REDIS_HOST || "localhost";
const redisPort = Number(env.UPSTASH_REDIS_PORT) || 6379;
const redisPassword = env.UPSTASH_REDIS_REST_TOKEN || "";

const queueConfig = {
  stalledInterval: 300000, // How often check for stalled jobs (use 0 for never checking).
  guardInterval: 5000, // Poll interval for delayed jobs and added jobs.
  drainDelay: 300, // A timeout for when the queue is in drained state (empty waiting for jobs).
};

const formProcessingQueue = new Queue("form-processing-queue", {
  redis: {
    host: redisHost,
    port: redisPort,
    password: redisPassword,
  },
  limiter: {
    max: 100, // maximum 100 jobs
    duration: 1000, // 1 second
  },
  ...queueConfig,
});

export default formProcessingQueue;
