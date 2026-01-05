import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Load environment variables from .env.local
config({ path: ".env.local" });

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
	},
	engine: "classic",
	datasource: {
		url: env("POSTGRES_PRISMA_URL"),
		directUrl: env("POSTGRES_URL_NON_POOLING"),
	},
});
