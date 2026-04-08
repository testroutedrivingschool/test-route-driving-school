import { createClient } from "redis";

const globalForRedis = globalThis;

export const redis =
  globalForRedis.redis ||
  createClient({
    url: process.env.REDIS_URL ,
  });

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

if (!redis.isOpen) {
  redis.connect().catch((err) => {
    console.error("Redis connect error:", err);
  });
}

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}