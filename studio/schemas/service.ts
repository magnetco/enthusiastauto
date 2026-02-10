import { defineField, defineType } from "sanity";
import { WrenchIcon } from "@sanity/icons";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  icon: WrenchIcon,
  fields: [
    defineField({
      name: "title",
      title: "Service Title",
      type: "string",
      description: "e.g., 'Conditioning & Protection', 'Full Rejuvenation'",
      validation: (Rule) => Rule.required().max(100),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-friendly version of the service title",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      description: "Brief description for cards and navigation (max 200 chars)",
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),

    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Icon identifier for navigation menus",
      options: {
        list: [
          { title: "Sparkles (Detailing/Protection)", value: "sparkles" },
          { title: "Refresh (Restoration)", value: "refresh" },
          { title: "Settings (Mechanical)", value: "settings" },
          { title: "Wrench (Repairs)", value: "wrench" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      description: "Main image for service page header",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
          description: "Describe the image for accessibility and SEO",
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "gallery",
      title: "Gallery Images",
      type: "array",
      description: "Additional images showcasing this service",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(20),
    }),

    defineField({
      name: "overview",
      title: "Overview",
      type: "array",
      description: "Detailed description of the service",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "features",
      title: "Key Features",
      type: "array",
      description: "Bullet points highlighting what's included",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),

    defineField({
      name: "pricing",
      title: "Pricing Information",
      type: "object",
      fields: [
        {
          name: "displayType",
          title: "Display Type",
          type: "string",
          options: {
            list: [
              { title: "Starting Price", value: "starting" },
              { title: "Price Range", value: "range" },
              { title: "Request Quote", value: "quote" },
            ],
            layout: "radio",
          },
          initialValue: "quote",
        },
        {
          name: "startingPrice",
          title: "Starting Price",
          type: "number",
          description: "USD amount (for 'Starting Price' display type)",
          hidden: ({ parent }) => parent?.displayType !== "starting",
        },
        {
          name: "minPrice",
          title: "Minimum Price",
          type: "number",
          description: "USD amount (for 'Price Range' display type)",
          hidden: ({ parent }) => parent?.displayType !== "range",
        },
        {
          name: "maxPrice",
          title: "Maximum Price",
          type: "number",
          description: "USD amount (for 'Price Range' display type)",
          hidden: ({ parent }) => parent?.displayType !== "range",
        },
      ],
    }),

    defineField({
      name: "duration",
      title: "Typical Duration",
      type: "string",
      description: "e.g., '2-3 days', '1-2 weeks', 'Varies by project'",
    }),

    defineField({
      name: "featured",
      title: "Featured Service",
      type: "boolean",
      description: "Show in featured services section",
      initialValue: false,
    }),

    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first (1, 2, 3...)",
      initialValue: 999,
    }),

    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      description: "Toggle off to hide this service from the website",
      initialValue: true,
    }),

    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "object",
      description: "Optional custom SEO metadata",
      fields: [
        {
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
          description: "Custom page title (defaults to service title)",
          validation: (Rule) => Rule.max(60),
        },
        {
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          description: "Custom meta description for search results",
          rows: 3,
          validation: (Rule) => Rule.max(160),
        },
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "shortDescription",
      media: "heroImage",
      active: "isActive",
      sortOrder: "sortOrder",
    },
    prepare({ title, subtitle, media, active, sortOrder }) {
      return {
        title: title || "Untitled Service",
        subtitle: `${active ? "Active" : "Inactive"} • Order: ${sortOrder} • ${subtitle?.substring(0, 50) || "No description"}`,
        media,
      };
    },
  },

  orderings: [
    {
      title: "Sort Order",
      name: "sortOrder",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
    {
      title: "Title A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
});
