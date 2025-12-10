import Queue from "bull";
import { env } from "../env";

const redisHost = env.UPSTASH_REDIS_HOST || "localhost";
const redisPort = Number(env.UPSTASH_REDIS_PORT) || 6379;
const redisPassword = env.UPSTASH_REDIS_REST_TOKEN || "";

const formProcessingQueue = new Queue("form-processing-queue", {
  redis: {
    host: redisHost,
    port: redisPort,
    password: redisPassword,
  },
  limiter: {
    max: 10, // maximum 10 jobs
    duration: 6000, // 6 seconds
  },
});

export default formProcessingQueue;
