/**
 * Sanity Studio Configuration for Enthusiast Auto
 * Standalone studio running at localhost:3333
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./env";
import { schema } from "./schemaTypes";
import { structure } from "./structure";
import { vehicleTemplates } from "./lib/templates/vehicles";

export default defineConfig({
  name: "default",
  projectId,
  dataset,

  // Studio title and branding
  title: "Enthusiast Auto Content Studio",

  // Custom studio icon
  icon: () => "🚗",

  // Schema and template configuration
  schema: {
    ...schema,
    templates: (prev) => [...prev, ...vehicleTemplates],
  },

  // Preview configuration for vehicle documents
  document: {
    productionUrl: async (prev, context) => {
      const { document } = context;

      // Only configure preview for vehicle documents
      if (document._type === "vehicle") {
        const slug = (document as any).slug?.current;
        if (!slug) return prev;

        const baseUrl =
          process.env.SANITY_STUDIO_SITE_URL || "http://localhost:3000";
        const previewSecret =
          process.env.SANITY_STUDIO_PREVIEW_SECRET || "preview-secret";

        // Generate preview URL
        return `${baseUrl}/api/preview?secret=${previewSecret}&slug=${slug}`;
      }

      return prev;
    },
  },

  plugins: [
    structureTool({
      structure,
      title: "Vehicles",
    }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
