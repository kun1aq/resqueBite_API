const dotenv = require("dotenv");
const { z } = require("zod");

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(20),
  JWT_REFRESH_SECRET: z.string().min(20),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGIN: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().min(1),
  APP_URL: z.string().url(),
  RESEND_ALLOWED_EMAIL: z.string().email()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}
console.log("DATABASE_URL:", parsed.data.DATABASE_URL);

module.exports = parsed.data;