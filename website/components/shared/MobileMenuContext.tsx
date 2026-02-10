"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface MobileMenuContextType {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  aboutPanelOpen: boolean;
  openAboutPanel: () => void;
  closeAboutPanel: () => void;
  inventoryPanelOpen: boolean;
  openInventoryPanel: () => void;
  closeInventoryPanel: () => void;
  servicesPanelOpen: boolean;
  openServicesPanel: () => void;
  closeServicesPanel: () => void;
  contactPanelOpen: boolean;
  openContactPanel: () => void;
  closeContactPanel: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(
  undefined
);

export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutPanelOpen, setAboutPanelOpen] = useState(false);
  const [inventoryPanelOpen, setInventoryPanelOpen] = useState(false);
  const [servicesPanelOpen, setServicesPanelOpen] = useState(false);
  const [contactPanelOpen, setContactPanelOpen] = useState(false);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => {
    setIsOpen(false);
    setAboutPanelOpen(false);
    setInventoryPanelOpen(false);
    setServicesPanelOpen(false);
    setContactPanelOpen(false);
  };

  const openAboutPanel = () => {
    setInventoryPanelOpen(false);
    setServicesPanelOpen(false);
    setContactPanelOpen(false);
    setAboutPanelOpen(true);
  };
  const closeAboutPanel = () => setAboutPanelOpen(false);

  const openInventoryPanel = () => {
    setAboutPanelOpen(false);
    setServicesPanelOpen(false);
    setContactPanelOpen(false);
    setInventoryPanelOpen(true);
  };
  const closeInventoryPanel = () => setInventoryPanelOpen(false);

  const openServicesPanel = () => {
    setAboutPanelOpen(false);
    setInventoryPanelOpen(false);
    setContactPanelOpen(false);
    setServicesPanelOpen(true);
  };
  const closeServicesPanel = () => setServicesPanelOpen(false);

  const openContactPanel = () => {
    setAboutPanelOpen(false);
    setInventoryPanelOpen(false);
    setServicesPanelOpen(false);
    setContactPanelOpen(true);
  };
  const closeContactPanel = () => setContactPanelOpen(false);

  return (
    <MobileMenuContext.Provider
      value={{
        isOpen,
        openMenu,
        closeMenu,
        aboutPanelOpen,
        openAboutPanel,
        closeAboutPanel,
        inventoryPanelOpen,
        openInventoryPanel,
        closeInventoryPanel,
        servicesPanelOpen,
        openServicesPanel,
        closeServicesPanel,
        contactPanelOpen,
        openContactPanel,
        closeContactPanel,
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
