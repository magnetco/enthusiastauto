import { Template } from "sanity";

/**
 * Document Templates for Vehicle Creation
 * Story 3.6: Pre-populated templates for common vehicle types
 * https://www.sanity.io/docs/initial-value-templates
 */

// BMW Sedan Template
const sedanTemplate: Template = {
  id: "vehicle-sedan",
  title: "BMW Sedan",
  description: "Create a new BMW sedan listing with pre-populated fields",
  schemaType: "vehicle",
  icon: () => "🚗",
  parameters: [],
  value: {
    // Pre-populate common fields
    status: "current",
    bodyStyle: "Sedan",
    drive: "Rear-Wheel Drive",
    engineType: "Gasoline",
    transmission: "Manual Transmission",
    isLive: true,
    featuredVehicle: false,
    featuredInventory: false,
    showCallForPrice: false,
  },
};

// BMW Coupe Template
const coupeTemplate: Template = {
  id: "vehicle-coupe",
  title: "BMW Coupe",
  description: "Create a new BMW coupe listing with pre-populated fields",
  schemaType: "vehicle",
  icon: () => "🏎️",
  parameters: [],
  value: {
    // Pre-populate common fields
    status: "current",
    inventoryStatus: "Current Inventory",
    bodyStyle: "Coupe",
    drive: "Rear-Wheel Drive",
    engineType: "Gasoline",
    transmission: "Manual Transmission",
    isLive: true,
    featuredVehicle: false,
    featuredInventory: false,
    showCallForPrice: false,
  },
};

// BMW SUV Template
const suvTemplate: Template = {
  id: "vehicle-suv",
  title: "BMW SUV",
  description: "Create a new BMW SUV listing with pre-populated fields",
  schemaType: "vehicle",
  icon: () => "🚙",
  parameters: [],
  value: {
    // Pre-populate common fields
    status: "current",
    inventoryStatus: "Current Inventory",
    bodyStyle: "SUV",
    drive: "All-Wheel Drive",
    engineType: "Gasoline",
    transmission: "Automatic Transmission",
    isLive: true,
    featuredVehicle: false,
    featuredInventory: false,
    showCallForPrice: false,
  },
};

// BMW Convertible Template
const convertibleTemplate: Template = {
  id: "vehicle-convertible",
  title: "BMW Convertible",
  description:
    "Create a new BMW convertible listing with pre-populated fields",
  schemaType: "vehicle",
  icon: () => "🌤️",
  parameters: [],
  value: {
    // Pre-populate common fields
    status: "current",
    inventoryStatus: "Current Inventory",
    bodyStyle: "Convertible",
    drive: "Rear-Wheel Drive",
    engineType: "Gasoline",
    transmission: "Manual Transmission",
    isLive: true,
    featuredVehicle: false,
    featuredInventory: false,
    showCallForPrice: false,
  },
};

// BMW Wagon Template
const wagonTemplate: Template = {
  id: "vehicle-wagon",
  title: "BMW Wagon",
  description: "Create a new BMW wagon listing with pre-populated fields",
  schemaType: "vehicle",
  icon: () => "🚐",
  parameters: [],
  value: {
    // Pre-populate common fields
    status: "current",
    inventoryStatus: "Current Inventory",
    bodyStyle: "Wagon",
    drive: "Rear-Wheel Drive",
    engineType: "Gasoline",
    transmission: "Manual Transmission",
    isLive: true,
    featuredVehicle: false,
    featuredInventory: false,
    showCallForPrice: false,
  },
};

// Export all templates
export const vehicleTemplates: Template[] = [
  sedanTemplate,
  coupeTemplate,
  suvTemplate,
  convertibleTemplate,
  wagonTemplate,
];
