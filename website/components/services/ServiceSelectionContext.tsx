"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type ServiceType = "conditioning" | "rejuvenation" | "mechanical" | "cosmetic";

interface ServiceSelectionContextValue {
  selectedServices: ServiceType[];
  toggleService: (service: ServiceType) => void;
  clearServices: () => void;
  isServiceSelected: (service: ServiceType) => boolean;
}

const ServiceSelectionContext = createContext<ServiceSelectionContextValue | null>(null);

export function ServiceSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([]);

  const toggleService = useCallback((service: ServiceType) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  }, []);

  const clearServices = useCallback(() => {
    setSelectedServices([]);
  }, []);

  const isServiceSelected = useCallback(
    (service: ServiceType) => selectedServices.includes(service),
    [selectedServices]
  );

  return (
    <ServiceSelectionContext.Provider
      value={{ selectedServices, toggleService, clearServices, isServiceSelected }}
    >
      {children}
    </ServiceSelectionContext.Provider>
  );
}

export function useServiceSelection() {
  const context = useContext(ServiceSelectionContext);
  if (!context) {
    throw new Error("useServiceSelection must be used within a ServiceSelectionProvider");
  }
  return context;
}

