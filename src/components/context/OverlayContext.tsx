import React, { createContext, useContext, useState } from "react";

interface OverlayActions {
  about?: () => void;
  projects?: () => void;
  contact?: () => void;
  close?: () => void;
  shuffle?: () => void;
}

interface OverlayContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  actions: OverlayActions;
  setActions: (
    actions: OverlayActions | ((prev: OverlayActions) => OverlayActions)
  ) => void;
  showContactForm: boolean;
  setShowContactForm: (show: boolean) => void;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export const OverlayProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [actions, setActions] = useState<OverlayActions>({});
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <OverlayContext.Provider
      value={{
        isOpen,
        setIsOpen,
        actions,
        setActions,
        showContactForm,
        setShowContactForm,
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
};

export const useOverlay = () => {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error("useOverlay must be used within an OverlayProvider");
  }
  return context;
};
