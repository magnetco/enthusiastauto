/**
 * BMW Knowledge Base Context
 * Curated information about BMW models, chassis codes, and specifications
 */

export const BMW_CHASSIS_CODES = {
  // E-Series (1980s-2010s)
  E30: {
    generation: "2nd Gen 3 Series",
    years: "1982-1994",
    models: ["318i", "325i", "M3"],
    notes: "Iconic boxy design, first M3 generation",
  },
  E36: {
    generation: "3rd Gen 3 Series",
    years: "1990-2000",
    models: ["318i", "323i", "325i", "328i", "M3"],
    notes: "Rounded design, popular tuner platform",
  },
  E46: {
    generation: "4th Gen 3 Series",
    years: "1998-2006",
    models: ["323i", "325i", "330i", "M3"],
    notes: "Last naturally aspirated M3, highly collectible",
  },
  E90: {
    generation: "5th Gen 3 Series Sedan",
    years: "2005-2013",
    models: ["325i", "328i", "330i", "335i", "M3"],
    notes: "First turbocharged 3 Series, V8 M3",
  },
  E92: {
    generation: "5th Gen 3 Series Coupe",
    years: "2006-2013",
    models: ["328i", "335i", "M3"],
    notes: "V8 M3 with 414 hp, ZCP package available",
  },
  E93: {
    generation: "5th Gen 3 Series Convertible",
    years: "2007-2013",
    models: ["328i", "335i", "M3"],
    notes: "Hardtop convertible, V8 M3 variant",
  },
  E39: {
    generation: "4th Gen 5 Series",
    years: "1995-2004",
    models: ["525i", "528i", "530i", "540i", "M5"],
    notes: "V8 M5 with 394 hp, considered best 5 Series",
  },
  E60: {
    generation: "5th Gen 5 Series",
    years: "2003-2010",
    models: ["525i", "530i", "545i", "550i", "M5"],
    notes: "V10 M5 with 500 hp, controversial styling",
  },
  
  // F-Series (2010s)
  F30: {
    generation: "6th Gen 3 Series Sedan",
    years: "2012-2019",
    models: ["320i", "328i", "335i", "340i", "M3"],
    notes: "Turbocharged inline-6, modern tech",
  },
  F80: {
    generation: "6th Gen M3 Sedan",
    years: "2014-2020",
    models: ["M3"],
    notes: "Twin-turbo S55 engine, 425-503 hp",
  },
  F82: {
    generation: "6th Gen M4 Coupe",
    years: "2014-2020",
    models: ["M4"],
    notes: "First M4 designation, GTS variant available",
  },
  F10: {
    generation: "6th Gen 5 Series",
    years: "2010-2016",
    models: ["528i", "535i", "550i", "M5"],
    notes: "Twin-turbo V8 M5 with 560 hp",
  },
  F90: {
    generation: "7th Gen M5",
    years: "2018-present",
    models: ["M5"],
    notes: "AWD M5, 600-627 hp, Competition package",
  },
  F22: {
    generation: "2 Series Coupe",
    years: "2014-2021",
    models: ["228i", "230i", "M235i", "M240i", "M2"],
    notes: "Compact coupe, M2 highly praised",
  },
  
  // G-Series (2018-present)
  G20: {
    generation: "7th Gen 3 Series Sedan",
    years: "2019-present",
    models: ["330i", "M340i"],
    notes: "Modern platform, mild hybrid available",
  },
  G80: {
    generation: "7th Gen M3",
    years: "2021-present",
    models: ["M3"],
    notes: "Controversial grille, 473-503 hp, AWD available",
  },
  G82: {
    generation: "7th Gen M4 Coupe",
    years: "2021-present",
    models: ["M4"],
    notes: "Matches M3 specs, CSL variant available",
  },
  G87: {
    generation: "2nd Gen M2",
    years: "2023-present",
    models: ["M2"],
    notes: "453 hp, manual transmission available",
  },
};

export const BMW_M_MODELS = {
  E30_M3: {
    chassis: "E30",
    years: "1986-1991",
    engine: "S14 2.3L I4",
    power: "192-238 hp",
    transmission: "5-speed manual",
    notes: "First M3, homologation special, highly collectible",
    options: ["Sport Evolution (Evo III)"],
  },
  E36_M3: {
    chassis: "E36",
    years: "1992-1999",
    engine: "S50/S52 3.0-3.2L I6",
    power: "240-321 hp",
    transmission: "5-speed manual, 6-speed manual",
    notes: "US models detuned, Euro models more powerful",
    options: ["Lightweight package"],
  },
  E46_M3: {
    chassis: "E46",
    years: "2001-2006",
    engine: "S54 3.2L I6",
    power: "333 hp",
    transmission: "6-speed manual, SMG II",
    notes: "Last naturally aspirated M3, 8,000 RPM redline",
    options: ["ZCP (Competition Package)", "CSL (Europe only)"],
  },
  E90_E92_M3: {
    chassis: "E90/E92/E93",
    years: "2008-2013",
    engine: "S65 4.0L V8",
    power: "414 hp",
    transmission: "6-speed manual, 7-speed DCT",
    notes: "Only V8 M3, derived from F1 technology",
    options: ["ZCP (Competition Package)", "Frozen paint colors"],
  },
  F80_M3: {
    chassis: "F80",
    years: "2014-2020",
    engine: "S55 3.0L twin-turbo I6",
    power: "425-503 hp",
    transmission: "6-speed manual, 7-speed DCT",
    notes: "Return to inline-6, Competition package adds 28 hp",
    options: ["Competition Package", "CS variant"],
  },
  F82_M4: {
    chassis: "F82",
    years: "2014-2020",
    engine: "S55 3.0L twin-turbo I6",
    power: "425-503 hp",
    transmission: "6-speed manual, 7-speed DCT",
    notes: "First M4 designation, GTS variant with 493 hp",
    options: ["Competition Package", "GTS", "CS"],
  },
  G80_M3: {
    chassis: "G80",
    years: "2021-present",
    engine: "S58 3.0L twin-turbo I6",
    power: "473-503 hp",
    transmission: "6-speed manual, 8-speed auto",
    notes: "Controversial vertical grille, AWD option",
    options: ["Competition xDrive", "Manual RWD"],
  },
  G82_M4: {
    chassis: "G82",
    years: "2021-present",
    engine: "S58 3.0L twin-turbo I6",
    power: "473-543 hp",
    transmission: "6-speed manual, 8-speed auto",
    notes: "CSL variant with 543 hp, carbon fiber body panels",
    options: ["Competition xDrive", "CSL (limited production)"],
  },
  E39_M5: {
    chassis: "E39",
    years: "1998-2003",
    engine: "S62 4.9L V8",
    power: "394 hp",
    transmission: "6-speed manual",
    notes: "Considered best M5 ever, naturally aspirated V8",
    options: ["Individual colors"],
  },
  E60_M5: {
    chassis: "E60",
    years: "2005-2010",
    engine: "S85 5.0L V10",
    power: "500 hp",
    transmission: "7-speed SMG III",
    notes: "Only V10 M5, Formula 1-derived engine",
    options: ["Individual colors", "Competition Package"],
  },
  F10_M5: {
    chassis: "F10",
    years: "2011-2016",
    engine: "S63 4.4L twin-turbo V8",
    power: "560-575 hp",
    transmission: "7-speed DCT",
    notes: "First turbocharged M5, Competition package",
    options: ["Competition Package", "30 Jahre M5"],
  },
  F90_M5: {
    chassis: "F90",
    years: "2018-present",
    engine: "S63 4.4L twin-turbo V8",
    power: "600-627 hp",
    transmission: "8-speed auto",
    notes: "First AWD M5, RWD mode available",
    options: ["Competition", "CS (limited)"],
  },
};

export const BMW_OPTION_PACKAGES = {
  ZCP: {
    name: "Competition Package (ZCP)",
    models: ["E46 M3", "E90/E92 M3"],
    features: [
      "Stiffer suspension",
      "Larger anti-roll bars",
      "Cross-drilled brakes",
      "Alcantara steering wheel",
      "Unique wheels (E46: Style 67, E92: Style 220M)",
      "Shadowline trim",
    ],
    notes: "Highly sought after by enthusiasts, improves handling",
  },
  CSL: {
    name: "Coupe Sport Lightweight (CSL)",
    models: ["E46 M3", "G82 M4"],
    features: [
      "Carbon fiber roof",
      "Lightweight interior",
      "Increased power",
      "Aggressive aerodynamics",
      "Reduced weight (~100 lbs)",
    ],
    notes: "Limited production, extremely collectible",
  },
  Competition: {
    name: "Competition Package",
    models: ["F80 M3", "F82 M4", "F90 M5", "G80 M3", "G82 M4"],
    features: [
      "Increased power (+28-47 hp)",
      "Sport exhaust",
      "Adaptive M suspension",
      "M Sport seats",
      "Unique wheels",
    ],
    notes: "Factory performance upgrade, standard on newer models",
  },
  xDrive: {
    name: "M xDrive (AWD)",
    models: ["F90 M5", "G80 M3", "G82 M4"],
    features: [
      "All-wheel drive system",
      "RWD mode available",
      "Improved traction",
      "Torque vectoring",
    ],
    notes: "First AWD M cars, controversial among purists",
  },
};

export const BMW_MAINTENANCE_INTERVALS = {
  oil_change: {
    interval: "10,000 miles or 1 year",
    notes: "Enthusiasts often do 5,000-7,500 miles for performance driving",
  },
  brake_fluid: {
    interval: "2 years",
    notes: "More frequent for track use",
  },
  coolant: {
    interval: "4 years or 50,000 miles",
    notes: "Critical for preventing overheating",
  },
  transmission_fluid: {
    interval: "60,000-100,000 miles",
    notes: "Lifetime fill but recommended to change",
  },
  differential_fluid: {
    interval: "60,000-100,000 miles",
    notes: "More frequent for track use",
  },
  spark_plugs: {
    interval: "60,000-100,000 miles",
    notes: "Varies by engine, check specific model",
  },
  air_filter: {
    interval: "30,000 miles",
    notes: "More frequent in dusty conditions",
  },
  cabin_filter: {
    interval: "15,000-30,000 miles",
    notes: "Easy DIY maintenance",
  },
};

export const BMW_COMMON_ISSUES = {
  E46_M3: [
    "Subframe cracking (rear)",
    "VANOS issues",
    "Rod bearings (high mileage)",
    "Cooling system (expansion tank, water pump)",
  ],
  E90_E92_M3: [
    "Rod bearings (critical)",
    "Throttle actuators",
    "VANOS solenoids",
    "Cooling system",
  ],
  F80_F82_M3_M4: [
    "Crank hub failure (early models)",
    "Turbocharger wastegate rattle",
    "Fuel pump issues",
  ],
  E39_M5: [
    "VANOS issues",
    "Cooling system",
    "Transmission mounts",
    "Electronics (pixel issues)",
  ],
  E60_M5: [
    "Rod bearings (critical)",
    "SMG pump failure",
    "Throttle actuators",
    "VANOS solenoids",
  ],
};

/**
 * Get chassis code information
 */
export function getChassisInfo(chassis: string): typeof BMW_CHASSIS_CODES[keyof typeof BMW_CHASSIS_CODES] | null {
  const key = chassis.toUpperCase() as keyof typeof BMW_CHASSIS_CODES;
  return BMW_CHASSIS_CODES[key] || null;
}

/**
 * Get M model information
 */
export function getMModelInfo(model: string): typeof BMW_M_MODELS[keyof typeof BMW_M_MODELS] | null {
  const key = model.toUpperCase().replace(/\s+/g, "_") as keyof typeof BMW_M_MODELS;
  return BMW_M_MODELS[key] || null;
}

/**
 * Get option package information
 */
export function getOptionPackageInfo(packageName: string): typeof BMW_OPTION_PACKAGES[keyof typeof BMW_OPTION_PACKAGES] | null {
  const key = packageName.toUpperCase() as keyof typeof BMW_OPTION_PACKAGES;
  return BMW_OPTION_PACKAGES[key] || null;
}

/**
 * Format BMW knowledge for context injection
 */
export function formatBMWContext(query: string): string {
  const lowerQuery = query.toLowerCase();
  let context = "";

  // Check if query mentions specific chassis codes
  Object.keys(BMW_CHASSIS_CODES).forEach((chassis) => {
    if (lowerQuery.includes(chassis.toLowerCase())) {
      const info = BMW_CHASSIS_CODES[chassis as keyof typeof BMW_CHASSIS_CODES];
      context += `\n\n${chassis} Information:\n`;
      context += `Generation: ${info.generation}\n`;
      context += `Years: ${info.years}\n`;
      context += `Models: ${info.models.join(", ")}\n`;
      context += `Notes: ${info.notes}\n`;
    }
  });

  // Check if query mentions M models
  if (lowerQuery.includes("m3") || lowerQuery.includes("m5") || lowerQuery.includes("m4")) {
    Object.keys(BMW_M_MODELS).forEach((model) => {
      if (lowerQuery.includes(model.toLowerCase().replace(/_/g, " "))) {
        const info = BMW_M_MODELS[model as keyof typeof BMW_M_MODELS];
        context += `\n\n${model.replace(/_/g, " ")} Information:\n`;
        context += `Chassis: ${info.chassis}\n`;
        context += `Years: ${info.years}\n`;
        context += `Engine: ${info.engine}\n`;
        context += `Power: ${info.power}\n`;
        context += `Transmission: ${info.transmission}\n`;
        context += `Notes: ${info.notes}\n`;
        if (info.options) {
          context += `Options: ${info.options.join(", ")}\n`;
        }
      }
    });
  }

  // Check if query mentions option packages
  if (lowerQuery.includes("zcp") || lowerQuery.includes("competition") || lowerQuery.includes("csl")) {
    Object.keys(BMW_OPTION_PACKAGES).forEach((pkg) => {
      if (lowerQuery.includes(pkg.toLowerCase())) {
        const info = BMW_OPTION_PACKAGES[pkg as keyof typeof BMW_OPTION_PACKAGES];
        context += `\n\n${info.name}:\n`;
        context += `Models: ${info.models.join(", ")}\n`;
        context += `Features: ${info.features.join(", ")}\n`;
        context += `Notes: ${info.notes}\n`;
      }
    });
  }

  return context;
}
