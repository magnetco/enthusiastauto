import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
	// Prisma 7 requires a driver adapter to be passed at runtime
	const url = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

	if (!url) {
		throw new Error(
			"Missing database connection string. Please ensure POSTGRES_PRISMA_URL or DATABASE_URL is set in your .env.local file."
		);
	}

	// Create the PostgreSQL adapter with the connection string
	const adapter = new PrismaPg({
		connectionString: url,
	});

	return new PrismaClient({ adapter });
};

declare const globalThis: {
	prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
