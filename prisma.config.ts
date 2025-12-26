// Prisma Config - Order Service (Prisma 7)
// Loads environment variables from .env file before applying config

import * as dotenv from "dotenv";
import * as path from "path";

// Explicitly load .env from service root
dotenv.config({ path: path.resolve(__dirname, '.env') });

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
