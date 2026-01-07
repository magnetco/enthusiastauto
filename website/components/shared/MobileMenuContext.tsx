"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface MobileMenuContextType {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  inventoryPanelOpen: boolean;
  openInventoryPanel: () => void;
  closeInventoryPanel: () => void;
  servicesPanelOpen: boolean;
  openServicesPanel: () => void;
  closeServicesPanel: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(
  undefined
);

export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inventoryPanelOpen, setInventoryPanelOpen] = useState(false);
  const [servicesPanelOpen, setServicesPanelOpen] = useState(false);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => {
    setIsOpen(false);
    setInventoryPanelOpen(false);
    setServicesPanelOpen(false);
  };

  const openInventoryPanel = () => {
    setServicesPanelOpen(false);
    setInventoryPanelOpen(true);
  };
  const closeInventoryPanel = () => setInventoryPanelOpen(false);

  const openServicesPanel = () => {
    setInventoryPanelOpen(false);
    setServicesPanelOpen(true);
  };
  const closeServicesPanel = () => setServicesPanelOpen(false);

  return (
    <MobileMenuContext.Provider
      value={{
        isOpen,
        openMenu,
        closeMenu,
        inventoryPanelOpen,
        openInventoryPanel,
        closeInventoryPanel,
        servicesPanelOpen,
        openServicesPanel,
        closeServicesPanel,
      }}
    >
      {children}
    </MobileMenuContext.Provider>
  );
}

export function useMobileMenu() {
  const context = useContext(MobileMenuContext);
  if (context === undefined) {
    throw new Error("useMobileMenu must be used within a MobileMenuProvider");
  }
  return context;
}
