import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

/**
 * Page Content Type
 * Maps to every static page on the frontend
 * Allows editing hero content, meta tags, and section components via prompts
 */
export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    // ============================================
    // PAGE IDENTIFICATION
    // ============================================
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      description: "Internal title for this page (e.g., 'Homepage', 'About Us')",
      validation: (Rule) => Rule.required().max(100),
    }),

    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      description:
        "URL path for this page. Use '/' for homepage, '/about' for about page, etc.",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "pageType",
      title: "Page Type",
      type: "string",
      description: "Select the type of page this represents",
      options: {
        list: [
          { title: "Homepage", value: "homepage" },
          { title: "About", value: "about" },
          { title: "Contact", value: "contact" },
          { title: "Services Overview", value: "services" },
          { title: "Blog Listing", value: "blog" },
          { title: "Vehicles Listing", value: "vehicles" },
          { title: "Parts Catalog", value: "parts" },
          { title: "Merchandise", value: "merchandise" },
          { title: "Sell Your Car", value: "sell" },
          { title: "Search", value: "search" },
          { title: "Privacy Policy", value: "privacy" },
          { title: "Terms of Service", value: "terms" },
          { title: "Custom", value: "custom" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),

    // ============================================
    // SEO METADATA
    // ============================================
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "object",
      description: "Search engine optimization metadata",
      fields: [
        {
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
          description:
            "Page title for search engines and browser tabs (50-60 chars optimal)",
          validation: (Rule) => Rule.required().max(60),
        },
        {
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          description:
            "Page description for search results (150-160 chars optimal)",
          rows: 3,
          validation: (Rule) => Rule.required().max(160),
        },
        {
          name: "ogTitle",
          title: "Open Graph Title",
          type: "string",
          description: "Title for social media shares (defaults to Meta Title)",
          validation: (Rule) => Rule.max(60),
        },
        {
          name: "ogDescription",
          title: "Open Graph Description",
          type: "text",
          description:
            "Description for social shares (defaults to Meta Description)",
          rows: 2,
          validation: (Rule) => Rule.max(160),
        },
        {
          name: "ogImage",
          title: "Open Graph Image",
          type: "image",
          description: "Image for social media shares (1200x630px recommended)",
          options: {
            hotspot: true,
          },
        },
        {
          name: "keywords",
          title: "Keywords",
          type: "array",
          description: "SEO keywords for this page",
          of: [{ type: "string" }],
          options: {
            layout: "tags",
          },
        },
        {
          name: "noIndex",
          title: "No Index",
          type: "boolean",
          description: "Prevent search engines from indexing this page",
          initialValue: false,
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    // ============================================
    // HERO SECTION
    // ============================================
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      description: "Main hero section at the top of the page",
      fields: [
        {
          name: "enabled",
          title: "Show Hero",
          type: "boolean",
          description: "Toggle hero section on/off",
          initialValue: true,
        },
        {
          name: "size",
          title: "Hero Size",
          type: "string",
          description: "Height of the hero section",
          options: {
            list: [
              { title: "Small (400px)", value: "small" },
              { title: "Medium (500px)", value: "medium" },
              { title: "Large (600px)", value: "large" },
              { title: "Full Screen", value: "full" },
            ],
            layout: "radio",
          },
          initialValue: "medium",
          hidden: ({ parent }) => !parent?.enabled,
        },
        {
          name: "eyebrow",
          title: "Eyebrow Text",
          type: "string",
          description: "Small text above the main title (optional)",
          validation: (Rule) => Rule.max(50),
          hidden: ({ parent }) => !parent?.enabled,
        },
        {
          name: "title",
          title: "Hero Title",
          type: "text",
          description: "Main headline text (supports line breaks)",
          rows: 3,
          validation: (Rule) => Rule.max(200),
          hidden: ({ parent }) => !parent?.enabled,
        },
        {
          name: "titleHighlight",
          title: "Title Highlight Text",
          type: "string",
          description:
            "Optional text to highlight in blue (e.g., 'For Enthusiasts')",
          validation: (Rule) => Rule.max(100),
          hidden: ({ parent }) => !parent?.enabled,
        },
        {
          name: "subtitle",
          title: "Subtitle",
          type: "text",
          description: "Supporting text below the title",
          rows: 3,
          validation: (Rule) => Rule.max(300),
          hidden: ({ parent }) => !parent?.enabled,
        },
        {
          name: "backgroundImage",
          title: "Background Image",
          type: "image",
          description: "Hero background image (1920x1080px recommended)",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
            },
          ],
          hidden: ({ parent }) => !parent?.enabled,
        },
        {
          name: "backgroundImageUrl",
          title: "Background Image URL",
          type: "url",
          description:
            "Alternative: Use external image URL (e.g., Unsplash) instead of uploading",
          hidden: ({ parent }) => !parent?.enabled,
        },
        {
          name: "overlay",
          title: "Overlay Opacity",
          type: "number",
          description: "Dark overlay opacity (0-100)",
          validation: (Rule) => Rule.min(0).max(100),
          initialValue: 50,
          hidden: ({ parent }) => !parent?.enabled,
        },
        {
          name: "ctas",
          title: "Call-to-Action Buttons",
          type: "array",
          description: "Up to 2 CTA buttons",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "label",
                  title: "Button Label",
                  type: "string",
                  validation: (Rule) => Rule.required().max(30),
                },
                {
                  name: "href",
                  title: "Link URL",
                  type: "string",
                  description: "Internal path (e.g., /vehicles) or external URL",
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: "variant",
                  title: "Button Style",
                  type: "string",
                  options: {
                    list: [
                      { title: "Primary (Red)", value: "primary" },
                      { title: "Outline (White)", value: "outline" },
                      { title: "Ghost (Transparent)", value: "ghost" },
                    ],
                    layout: "radio",
                  },
                  initialValue: "primary",
                },
              ],
              preview: {
                select: {
                  title: "label",
                  subtitle: "href",
                  variant: "variant",
                },
                prepare({ title, subtitle, variant }) {
                  return {
                    title: title || "Untitled Button",
                    subtitle: `${variant} → ${subtitle || "No link"}`,
                  };
                },
              },
            },
          ],
          validation: (Rule) => Rule.max(2),
          hidden: ({ parent }) => !parent?.enabled,
        },
      ],
    }),

    // ============================================
    // PAGE SECTIONS (PROMPT-BASED)
    // ============================================
    defineField({
      name: "sections",
      title: "Page Sections",
      type: "array",
      description:
        "Define which sections appear on this page using natural language prompts",
      of: [
        {
          type: "object",
          name: "section",
          title: "Section",
          fields: [
            {
              name: "sectionId",
              title: "Section ID",
              type: "string",
              description:
                "Unique identifier for this section (e.g., 'featured-vehicles', 'services-grid')",
              validation: (Rule) =>
                Rule.required()
                  .regex(/^[a-z0-9-]+$/, {
                    name: "kebab-case",
                    invert: false,
                  })
                  .error("Use lowercase letters, numbers, and hyphens only"),
            },
            {
              name: "component",
              title: "Component Name",
              type: "string",
              description:
                "React component to render (e.g., 'FeaturedVehicles', 'ServicesSection', 'AboutSection')",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "prompt",
              title: "Section Prompt",
              type: "text",
              description:
                "Natural language description of what this section should display and how it should behave",
              rows: 4,
              placeholder:
                "Example: Display the 4 most recent featured vehicles in a grid layout with image, title, price, and key features. Show a 'View All' button linking to /vehicles.",
              validation: (Rule) => Rule.required().min(20).max(500),
            },
            {
              name: "enabled",
              title: "Enabled",
              type: "boolean",
              description: "Toggle this section on/off",
              initialValue: true,
            },
            {
              name: "backgroundColor",
              title: "Background Color",
              type: "string",
              description: "Section background color",
              options: {
                list: [
                  { title: "White", value: "white" },
                  { title: "Light Gray (Neutral 50)", value: "neutral-50" },
                  { title: "Dark Blue Primary", value: "dark-blue-primary" },
                  { title: "Navy Primary", value: "navy-primary" },
                  { title: "Navy Secondary", value: "navy-secondary" },
                ],
                layout: "dropdown",
              },
              initialValue: "white",
            },
            {
              name: "paddingY",
              title: "Vertical Padding",
              type: "string",
              description: "Top and bottom padding",
              options: {
                list: [
                  { title: "None", value: "none" },
                  { title: "Small (py-12)", value: "small" },
                  { title: "Medium (py-16 sm:py-20)", value: "medium" },
                  { title: "Large (py-16 sm:py-20 lg:py-24)", value: "large" },
                ],
                layout: "radio",
              },
              initialValue: "large",
            },
            {
              name: "sortOrder",
              title: "Sort Order",
              type: "number",
              description: "Order in which sections appear (lower = higher)",
              validation: (Rule) => Rule.required().min(0),
              initialValue: 0,
            },
          ],
          preview: {
            select: {
              title: "component",
              subtitle: "prompt",
              enabled: "enabled",
              sortOrder: "sortOrder",
            },
            prepare({ title, subtitle, enabled, sortOrder }) {
              return {
                title: `${sortOrder}: ${title || "Untitled Section"}`,
                subtitle: enabled
                  ? subtitle?.substring(0, 80) || "No prompt"
                  : "⚠️ DISABLED",
              };
            },
          },
        },
      ],
    }),

    // ============================================
    // STRUCTURED DATA (JSON-LD)
    // ============================================
    defineField({
      name: "structuredData",
      title: "Structured Data (JSON-LD)",
      type: "text",
      description:
        "Optional: Custom JSON-LD schema markup for rich search results",
      rows: 10,
      options: {
        language: "json",
      },
    }),

    // ============================================
    // PAGE STATUS
    // ============================================
    defineField({
      name: "isPublished",
      title: "Published",
      type: "boolean",
      description: "Toggle to publish/unpublish this page",
      initialValue: true,
    }),

    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      description: "When this page was first published",
    }),

    defineField({
      name: "updatedAt",
      title: "Last Updated",
      type: "datetime",
      description: "Last time this page was modified",
      readOnly: true,
    }),
  ],

  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      pageType: "pageType",
      isPublished: "isPublished",
      metaTitle: "seo.metaTitle",
    },
    prepare({ title, slug, pageType, isPublished, metaTitle }) {
      const pageTypeLabels: Record<string, string> = {
        homepage: "Homepage",
        about: "About",
        contact: "Contact",
        services: "Services",
        blog: "Blog",
        vehicles: "Vehicles",
        parts: "Parts",
        merchandise: "Merchandise",
        sell: "Sell",
        search: "Search",
        privacy: "Privacy",
        terms: "Terms",
        custom: "Custom",
      };

      return {
        title: title || "Untitled Page",
        subtitle: `${isPublished ? "✓" : "⚠️ Draft"} ${pageTypeLabels[pageType] || pageType} • ${slug || "no-slug"} • ${metaTitle || "No meta title"}`,
      };
    },
  },

  orderings: [
    {
      title: "Page Type",
      name: "pageType",
      by: [{ field: "pageType", direction: "asc" }],
    },
    {
      title: "Title A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
    {
      title: "Recently Updated",
      name: "updatedAtDesc",
      by: [{ field: "updatedAt", direction: "desc" }],
    },
  ],
});
