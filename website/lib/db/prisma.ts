import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
	// #region agent log
	fetch('http://127.0.0.1:7243/ingest/277d85c7-ac6c-45cc-89d6-a194307a4c56',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'prisma.ts:5',message:'prismaClientSingleton called',data:{hasPostgresUrl:!!process.env.POSTGRES_PRISMA_URL,hasDatabaseUrl:!!process.env.DATABASE_URL},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3-H4'})}).catch(()=>{});
	// #endregion
	
	// Prisma 7 requires a driver adapter to be passed at runtime
	const url = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

	if (!url) {
		// #region agent log
		fetch('http://127.0.0.1:7243/ingest/277d85c7-ac6c-45cc-89d6-a194307a4c56',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'prisma.ts:12',message:'ERROR: Missing database URL',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3-H4'})}).catch(()=>{});
		// #endregion
		throw new Error(
			"Missing database connection string. Please ensure POSTGRES_PRISMA_URL or DATABASE_URL is set in your .env.local file."
		);
	}

	// Create the PostgreSQL adapter with the connection string
	const adapter = new PrismaPg({
		connectionString: url,
	});

	// #region agent log
	fetch('http://127.0.0.1:7243/ingest/277d85c7-ac6c-45cc-89d6-a194307a4c56',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'prisma.ts:24',message:'PrismaClient created successfully',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3-H4'})}).catch(()=>{});
	// #endregion
	return new PrismaClient({ adapter });
};

declare const globalThis: {
	prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
