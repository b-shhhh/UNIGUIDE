import dotenv from "dotenv";

dotenv.config();

const parsePort = (value: string | undefined, fallback: number) => {
  const parsed = value ? Number.parseInt(value, 10) : fallback;
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseOrigins = (value: string | undefined) => {
  if (!value) {
    return ["http://localhost:3000", "http://localhost:3003"];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const NODE_ENV = process.env.NODE_ENV || "development";
export const IS_PRODUCTION = NODE_ENV === "production";
export const PORT = parsePort(process.env.PORT, 5050);
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/university_guide";
export const JWT_SECRET = process.env.JWT_SECRET || "";
export const ALLOWED_ORIGINS = parseOrigins(process.env.ALLOWED_ORIGINS);
export const RATE_LIMIT_WINDOW_MS = parsePort(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000);
export const RATE_LIMIT_MAX = parsePort(process.env.RATE_LIMIT_MAX, 250);
export const COOKIE_SECURE = IS_PRODUCTION;

if (IS_PRODUCTION && (!JWT_SECRET || JWT_SECRET.length < 32)) {
  throw new Error("JWT_SECRET must be set and at least 32 characters in production");
}
