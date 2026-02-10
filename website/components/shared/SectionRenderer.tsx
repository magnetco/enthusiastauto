/**
 * Section Renderer Component
 * Dynamically renders page sections based on Sanity CMS configuration
 */

import type { PageSection } from "@/lib/sanity/queries/pages";

// Import all available section components
import { FeaturedVehicles } from "./FeaturedVehicles";
import { ServicesSection } from "./ServicesSection";
import { FeaturedBlogPostsWrapper } from "./FeaturedBlogPostsWrapper";
import { AboutSection } from "./AboutSection";

/**
 * Component mapping
 * Maps component names from Sanity to actual React components
 * Add new components here as they're created
 */
const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  FeaturedVehicles,
  ServicesSection,
  FeaturedBlogPostsWrapper,
  AboutSection,
  // Add more components as needed:
  // AboutStorySection,
  // AboutMissionSection,
  // ContactForm,
  // etc.
};

/**
 * Background color mapping
 * Maps Sanity color values to Tailwind classes
 */
const BG_COLOR_MAP: Record<string, string> = {
  white: "bg-white",
  "neutral-50": "bg-neutral-50",
  "dark-blue-primary": "bg-[#0a0c10]",
  "navy-primary": "bg-[#141721]",
  "navy-secondary": "bg-[#1f2233]",
};

/**
 * Padding mapping
 * Maps Sanity padding values to Tailwind classes
 */
const PADDING_MAP: Record<string, string> = {
  none: "py-0",
  small: "py-12",
  medium: "py-16 sm:py-20",
  large: "py-16 sm:py-20 lg:py-24",
};

interface SectionRendererProps {
  section: PageSection;
}

/**
 * SectionRenderer
 * Renders a single page section with appropriate styling
 */
export function SectionRenderer({ section }: SectionRendererProps) {
  // Get the component from the map
  const Component = COMPONENT_MAP[section.component];

  // Warn if component not found (dev mode)
  if (!Component) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `Component "${section.component}" not found in COMPONENT_MAP. Available components:`,
        Object.keys(COMPONENT_MAP)
      );
    }
    return null;
  }

  // Get styling classes
  const bgColor = BG_COLOR_MAP[section.backgroundColor] || BG_COLOR_MAP.white;
  const padding = PADDING_MAP[section.paddingY] || PADDING_MAP.large;

  return (
    <section
      id={section.sectionId}
      className={`${bgColor} ${padding}`}
      data-section={section.component}
      data-prompt={section.prompt}
    >
      <Component />
    </section>
  );
}

/**
 * SectionList
 * Renders multiple sections, filtering out disabled ones
 */
interface SectionListProps {
  sections?: PageSection[];
}

export function SectionList({ sections }: SectionListProps) {
  if (!sections || sections.length === 0) {
    return null;
  }

  // Filter enabled sections and sort by sortOrder
  const enabledSections = sections
    .filter((section) => section.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      {enabledSections.map((section) => (
        <SectionRenderer key={section.sectionId} section={section} />
      ))}
    </>
  );
}
