import { defineType, defineField } from "sanity";

export const vehicle = defineType({
  name: "vehicle",
  title: "Vehicle",
  type: "document",
  fields: [
    // ============================================
    // TASK 1: Basic Information Fields
    // ============================================
    defineField({
      name: "listingTitle",
      title: "Listing Title",
      type: "string",
      description:
        'SEO IMPORTANT: Include year, make, chassis, and model (e.g., "2003 BMW E39 M5"). This appears in search results and page titles. Keep it concise but descriptive (10-100 characters).',
      validation: (Rule) =>
        Rule.required()
          .min(10)
          .max(100)
          .error("Title must be between 10-100 characters"),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-friendly version of the listing title",
      options: {
        source: "listingTitle",
        maxLength: 200,
      },
      validation: (Rule) => Rule.required().error("Slug is required"),
    }),

    defineField({
      name: "stockNumber",
      title: "Stock Number",
      type: "string",
      description: "Last 7 of VIN - Required for CarsForSale",
      validation: (Rule) => Rule.required().error("Stock number is required"),
    }),

    defineField({
      name: "vin",
      title: "VIN",
      type: "string",
      description:
        "Required for CarsForSale - 17-character Vehicle Identification Number",
      validation: (Rule) =>
        Rule.required()
          .length(17)
          .regex(/^[A-HJ-NPR-Z0-9]{17}$/, {
            name: "VIN",
            invert: false,
          })
          .error(
            "VIN must be exactly 17 alphanumeric characters (excluding I, O, Q)",
          ),
    }),

    defineField({
      name: "chassis",
      title: "Chassis Code",
      type: "string",
      description: "BMW chassis code (e.g., E39, E46, F30)",
      options: {
        list: [
          { title: "E39", value: "E39" },
          { title: "E46", value: "E46" },
          { title: "E90", value: "E90" },
          { title: "E92", value: "E92" },
          { title: "F30", value: "F30" },
          { title: "F80", value: "F80" },
          { title: "G80", value: "G80" },
          { title: "X3", value: "X3" },
          { title: "X5", value: "X5" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required().error("Chassis code is required"),
    }),

    defineField({
      name: "mileage",
      title: "Mileage",
      type: "number",
      description: "Required for CarsForSale - Current odometer reading",
      validation: (Rule) =>
        Rule.required()
          .min(0)
          .integer()
          .error("Mileage must be a positive integer"),
    }),

    defineField({
      name: "bodyStyle",
      title: "Body Style",
      type: "string",
      description: "Vehicle body configuration",
      options: {
        list: [
          { title: "Sedan", value: "Sedan" },
          { title: "Coupe", value: "Coupe" },
          { title: "Convertible", value: "Convertible" },
          { title: "SUV", value: "SUV" },
          { title: "Wagon", value: "Wagon" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required().error("Body style is required"),
    }),

    defineField({
      name: "drive",
      title: "Drive Type",
      type: "string",
      description: "Drivetrain configuration",
      options: {
        list: [
          { title: "Rear-Wheel Drive", value: "Rear-Wheel Drive" },
          { title: "All-Wheel Drive", value: "All-Wheel Drive" },
          { title: "Front-Wheel Drive", value: "Front-Wheel Drive" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required().error("Drive type is required"),
    }),

    // ============================================
    // TASK 2: Color and Pricing Fields
    // ============================================
    defineField({
      name: "exteriorColor",
      title: "Exterior Color",
      type: "string",
      description: 'Required for CarsForSale - e.g., "Jet Black"',
      validation: (Rule) => Rule.required().error("Exterior color is required"),
    }),

    defineField({
      name: "interiorColor",
      title: "Interior Color",
      type: "string",
      description: 'Required for CarsForSale - e.g., "Caramel Leather"',
      validation: (Rule) => Rule.required().error("Interior color is required"),
    }),

    defineField({
      name: "listingPrice",
      title: "Listing Price",
      type: "number",
      description: "Required for CarsForSale - USD price",
      validation: (Rule) =>
        Rule.required()
          .min(0)
          .precision(2)
          .error("Price must be a positive number with up to 2 decimal places"),
    }),

    defineField({
      name: "showCallForPrice",
      title: 'Show "Call For Price"',
      type: "boolean",
      description:
        'Toggle to show "Call For Price" instead of the price amount',
      initialValue: false,
    }),

    defineField({
      name: "availabilityDate",
      title: "Availability Date",
      type: "datetime",
      description:
        "Optional. If set in the future, listing won't be shown until then",
    }),

    // ============================================
    // TASK 3: Status and Visibility Fields
    // ============================================
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description:
        "Mark as Sold when vehicle is no longer available. Updates trigger real-time website revalidation.",
      options: {
        list: [
          { title: "Current", value: "current" },
          { title: "Sold", value: "sold" },
        ],
        layout: "radio",
      },
      initialValue: "current",
      validation: (Rule) => Rule.required().error("Status is required"),
    }),

    defineField({
      name: "inventoryStatus",
      title: "Inventory Status",
      type: "string",
      description: "Current availability status of the vehicle",
      options: {
        list: [
          { title: "Current Inventory", value: "Current Inventory" },
          { title: "Sold", value: "Sold" },
        ],
        layout: "radio",
      },
      initialValue: "Current Inventory",
      validation: (Rule) =>
        Rule.required().error("Inventory status is required"),
    }),

    defineField({
      name: "statusTag",
      title: "Status Tag",
      type: "string",
      description:
        'Badge shown on listing (e.g., "New Arrival", "Reduced Price")',
      options: {
        list: [
          { title: "New Arrival", value: "New Arrival" },
          { title: "Reduced Price", value: "Reduced Price" },
          { title: "Sold", value: "Sold" },
        ],
        layout: "dropdown",
      },
    }),

    defineField({
      name: "isLive",
      title: "Is Live",
      type: "boolean",
      description: "Toggle to on to show the listing on the site",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "featuredVehicle",
      title: "Featured Vehicle",
      type: "boolean",
      description: 'Toggle to show on inventory "Featured Vehicle" section',
      initialValue: false,
    }),

    defineField({
      name: "featuredInventory",
      title: "Featured Inventory",
      type: "boolean",
      description: "Toggle to show listing on the featured carousel only",
      initialValue: false,
    }),

    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description:
        "Manual sort order for featured lists (higher number = higher priority)",
    }),

    // ============================================
    // TASK 4: Engine and Transmission Fields
    // ============================================
    defineField({
      name: "engineCodes",
      title: "Engine Code",
      type: "string",
      description: "BMW engine code (e.g., S62, N54, B58)",
      options: {
        list: [
          { title: "S62", value: "S62" },
          { title: "S54", value: "S54" },
          { title: "S65", value: "S65" },
          { title: "N54", value: "N54" },
          { title: "N55", value: "N55" },
          { title: "B58", value: "B58" },
          { title: "S58", value: "S58" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required().error("Engine code is required"),
    }),

    defineField({
      name: "engineType",
      title: "Engine Type",
      type: "string",
      description: "Required for CarsForSale - Fuel type",
      options: {
        list: [
          { title: "Gasoline", value: "Gasoline" },
          { title: "Diesel", value: "Diesel" },
          { title: "Electric", value: "Electric" },
          { title: "Hybrid", value: "Hybrid" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required().error("Engine type is required"),
    }),

    defineField({
      name: "engineSize",
      title: "Engine Size",
      type: "string",
      description: "Required for CarsForSale - Engine configuration",
      options: {
        list: [
          { title: "V8 Engine", value: "V8 Engine" },
          { title: "I6 Engine", value: "I6 Engine" },
          { title: "V10 Engine", value: "V10 Engine" },
          { title: "I4 Engine", value: "I4 Engine" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required().error("Engine size is required"),
    }),

    defineField({
      name: "transmission",
      title: "Transmission",
      type: "string",
      description: "Required for CarsForSale - Transmission type",
      options: {
        list: [
          { title: "Manual Transmission", value: "Manual Transmission" },
          { title: "Automatic Transmission", value: "Automatic Transmission" },
          { title: "6-Speed Manual", value: "6-Speed Manual" },
          { title: "7-Speed DCT", value: "7-Speed DCT" },
          { title: "8-Speed Automatic", value: "8-Speed Automatic" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required().error("Transmission is required"),
    }),

    // ============================================
    // TASK 5: Image Fields Separated by Category
    // ============================================
    defineField({
      name: "signatureShot",
      title: "Signature Shot",
      type: "image",
      description:
        'REQUIRED: Hero & thumbnail image for "Current Inventory" vehicles. Best practice: 3/4 front angle, clean background, high-res (min 1920x1080). Click the image to set focal point (hotspot) for cropping.',
      options: {
        hotspot: true,
        accept: "image/*",
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
          description:
            'SEO & Accessibility: Describe the image (e.g., "Silver 2003 BMW M5 parked outdoors"). Screen readers use this text.',
        },
      ],
      validation: (Rule) => Rule.required().error("Signature shot is required"),
    }),

    defineField({
      name: "soldShot",
      title: "Sold Shot",
      type: "image",
      description: 'Hero & thumbnail image for vehicles with "Sold" status',
      options: {
        hotspot: true,
        accept: "image/*",
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
          description: "Optional - Improves SEO and accessibility",
        },
      ],
    }),

    defineField({
      name: "secondaryShot",
      title: "Secondary Shot",
      type: "image",
      description: "Secondary hero shot",
      options: {
        hotspot: true,
        accept: "image/*",
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
          description: "Optional - Improves SEO and accessibility",
        },
      ],
    }),

    defineField({
      name: "galleryExterior1",
      title: "Gallery Exterior 1",
      type: "array",
      description:
        "BULK UPLOAD SUPPORTED: Drag and drop multiple exterior photos (max 25). Cover all angles: front, rear, sides, details, wheels, badges. Tip: Select all images in your file browser and drag into this field at once.",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
            accept: "image/*",
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
              description:
                'Optional but recommended for SEO: Describe each image (e.g., "Front view of BMW M5", "M5 rear quarter panel")',
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
              description:
                "Optional: Add context if needed (e.g., \"Recently detailed\", \"New wheels installed\")",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(25).error("Maximum 25 images allowed"),
    }),

    defineField({
      name: "galleryExterior2",
      title: "Gallery Exterior 2",
      type: "array",
      description:
        "Additional exterior gallery photos (up to 25 images) - Supports bulk upload",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
            accept: "image/*",
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
              description: "Optional - Improves SEO and accessibility",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
              description: "Optional image caption",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(25).error("Maximum 25 images allowed"),
    }),

    defineField({
      name: "galleryExterior3",
      title: "Gallery Exterior 3",
      type: "array",
      description:
        "More exterior gallery photos (up to 25 images) - Supports bulk upload",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
            accept: "image/*",
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
              description: "Optional - Improves SEO and accessibility",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
              description: "Optional image caption",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(25).error("Maximum 25 images allowed"),
    }),

    defineField({
      name: "galleryInterior1",
      title: "Gallery Interior 1",
      type: "array",
      description:
        "Interior gallery photos (up to 25 images) - Supports bulk upload",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
            accept: "image/*",
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
              description: "Optional - Improves SEO and accessibility",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
              description: "Optional image caption",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(25).error("Maximum 25 images allowed"),
    }),

    defineField({
      name: "galleryInterior2",
      title: "Gallery Interior 2",
      type: "array",
      description:
        "Additional interior gallery photos (up to 25 images) - Supports bulk upload",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
            accept: "image/*",
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
              description: "Optional - Improves SEO and accessibility",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
              description: "Optional image caption",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(25).error("Maximum 25 images allowed"),
    }),

    // ============================================
    // TASK 6: Content Fields
    // ============================================
    defineField({
      name: "listingThumbnailFeatures",
      title: "Listing Thumbnail Features",
      type: "array",
      description:
        'Bullet points for listing card preview. Click "+ Add item" to add each feature. Examples: "One-Owner Enthusiast Owned!", "Extensive service history since new", "Rare Factory Options". Keep each point concise (under 50 characters).',
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),

    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      description:
        "KEY SELLING POINTS: Use bullet or numbered lists to highlight features, modifications, and condition. Click the list icon in the toolbar to format. Use Bold (Ctrl+B) for emphasis on key terms.",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [],
          },
        },
      ],
    }),

    defineField({
      name: "overview",
      title: "Overview",
      type: "array",
      description:
        "DETAILED DESCRIPTION: Full vehicle story including history, condition, modifications, and why it's special. Use H2/H3 headings to organize sections (e.g., 'Condition', 'Service History', 'Modifications'). SEO TIP: Include relevant keywords naturally (model names, features, condition descriptors).",
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
            annotations: [],
          },
        },
      ],
    }),

    defineField({
      name: "history",
      title: "History",
      type: "text",
      description:
        'PLAIN TEXT ONLY (no formatting): Brief history summary for "Featured Vehicle" carousel. Example: "One-owner example with full service history. Recent major service including engine work, transmission rebuild, and suspension refresh. Clean Carfax."',
      rows: 5,
    }),

    // ============================================
    // TASK 7: Featured Vehicle Fields
    // ============================================
    defineField({
      name: "featuredVehicleThumbnailText",
      title: "Featured Vehicle Thumbnail Text",
      type: "array",
      description: "Rich text for featured vehicle carousel description",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [],
          },
        },
      ],
    }),

    // ============================================
    // TASK 8: Metadata and Preview
    // ============================================
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),

    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      readOnly: true,
    }),
  ],

  preview: {
    select: {
      title: "listingTitle",
      chassis: "chassis",
      price: "listingPrice",
      status: "inventoryStatus",
      media: "signatureShot",
    },
    prepare({ title, chassis, price, status, media }) {
      return {
        title: title || "Untitled Vehicle",
        subtitle: `$${price?.toLocaleString() || "0"} - ${status || "Unknown"} - ${chassis || "N/A"}`,
        media: media,
      };
    },
  },
});
