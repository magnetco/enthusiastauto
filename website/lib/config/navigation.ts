/**
 * Navigation configuration for the header
 * Contains all nav items and inventory/services menu structure
 */

export type SubmenuType = "about" | "inventory" | "services" | "contact";

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

export interface AboutMenuItem {
  title: string;
  href: string;
  description: string;
}

export interface AboutMenuConfig {
  items: AboutMenuItem[];
}

export interface ContactMenuItem {
  title: string;
  href: string;
  description: string;
}

export interface ContactMenuConfig {
  items: ContactMenuItem[];
}

/**
 * Main navigation items for the header with dropdown menus
 */
export const NAV_ITEMS: NavItem[] = [
  { title: "About EAG", href: "/about" },
  { title: "Inventory", href: "/vehicles", hasSubmenu: true, submenuType: "inventory" },
  { title: "Parts", href: "/parts" },
  { title: "Services", href: "/services", hasSubmenu: true, submenuType: "services" },
  { title: "Under The Hood", href: "/blog" },
  { title: "Sell Your Car", href: "/sell" },
  { title: "Contact", href: "/contact", hasSubmenu: true, submenuType: "contact" },
];

/**
 * About mega-menu configuration
 */
export const ABOUT_MENU: AboutMenuConfig = {
  items: [
    {
      title: "About EAG",
      href: "/about",
      description: "Learn about our BMW preservation facility and expertise",
    },
    {
      title: "Under the Hood",
      href: "/blog",
      description: "Stories, insights, and BMW knowledge from our team",
    },
  ],
};

/**
 * Inventory mega-menu configuration
 */
export const INVENTORY_MENU: InventoryMenuConfig = {
  quickLinks: [
    { title: "Cars", href: "/vehicles" },
    { title: "Parts", href: "/search" },
    { title: "Previously sold", href: "/vehicles?status=sold" },
    { title: "Incoming", href: "/vehicles?status=incoming" },
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
    { title: "Sell Your Car", href: "/sell" },
  ],
  services: [
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
    {
      title: "Conditioning & Protection",
      href: "/services/conditioning",
      description: "Paint correction, ceramic coating, and preservation treatments",
      icon: "sparkles",
    },
  ],
};

/**
 * Contact mega-menu configuration
 */
export const CONTACT_MENU: ContactMenuConfig = {
  items: [
    {
      title: "Contact Us",
      href: "/contact",
      description: "Get in touch with our team for inquiries and support",
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
 * Mobile about menu configuration
 */
export const MOBILE_ABOUT_MENU = {
  items: ABOUT_MENU.items,
};

/**
 * Mobile services menu configuration
 */
export const MOBILE_SERVICES_MENU = {
  quickLinks: SERVICES_MENU.quickLinks,
  services: SERVICES_MENU.services,
};

/**
 * Mobile contact menu configuration
 */
export const MOBILE_CONTACT_MENU = {
  items: CONTACT_MENU.items,
};
