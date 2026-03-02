import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // fallback so generate works even if .env is missing
    url:
      process.env.DATABASE_URL ||
      "postgresql://ethmane.dev@localhost:5432/focusflow?schema=public",
  },
});
