import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Load environment variables
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
		seed: "tsx prisma/seed.ts",
	},
	datasource: {
		// Use direct URL for schema changes (non-pooled connection)
		url: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL!,
	},
});
