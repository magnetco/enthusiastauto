import { StickyHeader } from "./StickyHeader";
import { HeaderContent } from "./HeaderContent";

/**
 * Main Header component with two-row layout on desktop
 * and simplified single row with hamburger menu on mobile
 */
export function Header() {
  return (
    <StickyHeader>
      <HeaderContent />
    </StickyHeader>
  );
}

