/**
 * Navigation configuration for the header
 * Contains all nav items and inventory/services menu structure
 */

export type SubmenuType = "inventory" | "services";

export interface NavItem {
  title: string;
  href: string;
  hasSubmenu?: boolean;
  submenuType?: SubmenuType;
}

export interface InventoryQuickLink {
  title: string;
  href: string;
}

export interface ChassisColumn {
  items: string[];
}

export interface InventoryMenuConfig {
  quickLinks: InventoryQuickLink[];
  chassisCodes: ChassisColumn[];
}

export interface ServiceMenuItem {
  title: string;
  href: string;
  description: string;
  icon: "sparkles" | "refresh" | "settings" | "wrench";
}

export interface ServicesMenuConfig {
  quickLinks: InventoryQuickLink[];
  services: ServiceMenuItem[];
}

/**
 * Main navigation items for the header
 */
export const NAV_ITEMS: NavItem[] = [
  { title: "About EAG", href: "/about" },
  { title: "Inventory", href: "/vehicles", hasSubmenu: true, submenuType: "inventory" },
  { title: "Services", href: "/services", hasSubmenu: true, submenuType: "services" },
  { title: "Sell your car", href: "/sell" },
  { title: "Under the hood", href: "/blog" },
  { title: "Parts", href: "/search" },
  { title: "Merchandise", href: "/merch" },
  { title: "Contact", href: "/contact" },
];

/**
 * Inventory mega-menu configuration
 */
export const INVENTORY_MENU: InventoryMenuConfig = {
  quickLinks: [
    { title: "Current inventory", href: "/vehicles" },
    { title: "Previously sold", href: "/vehicles?status=sold" },
    { title: "Incoming", href: "/vehicles?status=incoming" },
    { title: "Sell your car", href: "/sell" },
  ],
  chassisCodes: [
    { items: ["G8X", "F87", "E46", "E30"] },
    { items: ["Z8", "F8X", "E39", "E28"] },
    { items: ["Z4", "E9X", "E36", "E24"] },
    { items: ["Z3", "E60", "E34"] },
  ],
};

/**
 * Services mega-menu configuration
 */
export const SERVICES_MENU: ServicesMenuConfig = {
  quickLinks: [
    { title: "All Services", href: "/services" },
  ],
  services: [
    {
      title: "Conditioning & Protection",
      href: "/services/conditioning",
      description: "Paint correction, ceramic coating, and preservation treatments",
      icon: "sparkles",
    },
    {
      title: "Full Rejuvenation",
      href: "/services/rejuvenation",
      description: "Complete restoration to better-than-factory condition",
      icon: "refresh",
    },
    {
      title: "Mechanical Services",
      href: "/services/mechanical",
      description: "Maintenance, repairs, and performance upgrades",
      icon: "settings",
    },
    {
      title: "Cosmetic Repairs",
      href: "/services/cosmetic",
      description: "Collision repair, paint matching, and dent removal",
      icon: "wrench",
    },
  ],
};

/**
 * Mobile inventory menu with model categories
 * Used for the nested mobile inventory panel
 */
export const MOBILE_INVENTORY_MENU = {
  quickLinks: INVENTORY_MENU.quickLinks,
  modelCategories: [
    {
      name: "M1",
      chassis: [] as string[],
    },
    {
      name: "M2",
      chassis: ["F87 M2", "G87 M2"],
    },
    {
      name: "M3",
      chassis: ["E30 M3", "E36 M3", "E46 M3", "E9X M3", "F8X M3"],
    },
    {
      name: "M5",
      chassis: ["E24 M5", "E34 M5", "E39 M5", "E60 M5"],
    },
    {
      name: "Z3/Z4",
      chassis: ["Z3 M", "Z4 M", "Z8"],
    },
  ],
};

/**
 * Mobile services menu configuration
 */
export const MOBILE_SERVICES_MENU = {
  quickLinks: SERVICES_MENU.quickLinks,
  services: SERVICES_MENU.services,
};
