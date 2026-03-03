// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prismaClient = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
});

const globalForPrisma = globalThis as unknown as {
  prisma: typeof prismaClient;
};

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaClient;
}

export const db = globalForPrisma.prisma || prismaClient;


// src/lib/prisma.ts

// import { PrismaClient } from "../generated/prisma";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { Pool } from "pg";

// const connectionString = process.env.DATABASE_URL;

// if (!connectionString) {
//   throw new Error("DATABASE_URL is not set");
// }

// const pool = new Pool({ connectionString });
// const adapter = new PrismaPg(pool);

// const prismaClient = new PrismaClient({
//   adapter, // ← THIS IS REQUIRED in Prisma 7+
//   log:
//     process.env.NODE_ENV === "development"
//       ? ["query", "info", "warn", "error"]
//       : ["error"],
// });

// // Singleton for Next.js hot reloading
// const globalForPrisma = globalThis as unknown as {
//   prisma: typeof prismaClient;
// };

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prismaClient;
// }

// export const db = globalForPrisma.prisma || prismaClient;
