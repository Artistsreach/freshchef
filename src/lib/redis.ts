import { createClient } from "redis";

const createRedisClient = async () => {
  if (process.env.REDIS_URL) {
    const client = await createClient({
      url: process.env.REDIS_URL,
    })
      .on("error", (err) => console.log("Redis Client Error", err))
      .connect();
    return client;
  }
  return null;
};

export const redis = await createRedisClient();

export const redisPublisher = await createRedisClient();
