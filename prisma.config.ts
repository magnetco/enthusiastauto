import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Load environment variables from .env.local (takes precedence) then .env
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
		seed: "tsx prisma/seed.ts",
	},
	datasource: {
		// Use process.env directly to avoid errors when DATABASE_URL isn't set
		// (e.g., during `prisma generate` in CI where only types are needed)
		url: process.env.POSTGRES_PRISMA_URL!,
	},
});
