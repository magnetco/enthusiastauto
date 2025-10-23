"use client";

/**
 * Sanity Studio Configuration for Enthusiast Auto
 * Studio is mounted at /studio route in the Next.js app
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { vehicleTemplates } from "./sanity/lib/templates/vehicles";

export default defineConfig({
  name: "default",
  basePath: "/studio",
  projectId,
  dataset,

  // Studio title and branding
  title: "Enthusiast Auto Content Studio",

  // Custom branding (Story 3.6)
  // Custom studio icon
  icon: () => "🚗",

  // Add and edit the content schema in the './sanity/schemaTypes' folder
  // Template configuration (Story 3.6)
  schema: {
    ...schema,
    templates: (prev) => [...prev, ...vehicleTemplates],
  },

  // Preview configuration (Story 3.6)
  document: {
    productionUrl: async (prev, context) => {
      const { document } = context;

      // Only configure preview for vehicle documents
      if (document._type === "vehicle") {
        const slug = (document as any).slug?.current;
        if (!slug) return prev;

        const baseUrl =
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const previewSecret =
          process.env.SANITY_PREVIEW_SECRET || "preview-secret";

        // Generate preview URL
        return `${baseUrl}/api/preview?secret=${previewSecret}&slug=${slug}`;
      }

      return prev;
    },
  },

  plugins: [
    // Note: Using deskTool (deprecated) due to TypeScript module resolution issue
    // TODO: Migrate to structureTool from 'sanity/structure' when resolved
    deskTool({
      structure,
      title: "Vehicles",
    }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
