import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  // Note: In Prisma 7+, connection URL should be passed here via accelerateUrl or adapter
  // For Prisma 6, the URL is read from schema.prisma
  // When upgrading to Prisma 7, remove url from schema.prisma and uncomment below:
  // return new PrismaClient({
  //   accelerateUrl: process.env.POSTGRES_PRISMA_URL,
  // });
  
  // Validate that the database URL is available
  if (!process.env.POSTGRES_PRISMA_URL && !process.env.DATABASE_URL) {
    throw new Error(
      "Missing database connection string. Please ensure POSTGRES_PRISMA_URL or DATABASE_URL is set in your .env.local file."
    );
  }
  
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
