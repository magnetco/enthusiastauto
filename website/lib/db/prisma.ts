import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
	// Prisma 7 requires a driver adapter to be passed at runtime
	const url = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

	if (!url) {
		// Log warning but create client with a minimal valid connection string format
		// This allows the app to start; database operations will fail at runtime
		console.warn(
			"Missing database connection string. Database operations will fail. Please ensure POSTGRES_PRISMA_URL or DATABASE_URL is set in your .env.local file."
		);
		try {
			// Try to create client with a placeholder - may fail but won't crash module load
			const adapter = new PrismaPg({
				connectionString: "postgresql://user:pass@localhost:5432/db",
			});
			return new PrismaClient({ adapter });
		} catch (error) {
			// If adapter creation fails, return a basic client
			// Operations will fail at runtime with connection errors
			console.error("Failed to create Prisma client:", error);
			return new PrismaClient();
		}
	}

	// Create the PostgreSQL adapter with the connection string
	const adapter = new PrismaPg({
		connectionString: url,
	});

	return new PrismaClient({ adapter });
};

declare const globalThis: {
	prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
