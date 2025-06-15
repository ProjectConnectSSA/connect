"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface SelectedElementType {
  layout: any[];
  index: number;
  columnIndex: number;
}

interface SelectedElementContextType {
  selectedElement: SelectedElementType | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<SelectedElementType | null>>;
}

const SelectedElementContext = createContext<SelectedElementContextType | null>(null);

export const useSelectedElement = () => {
  const context = useContext(SelectedElementContext);
  if (!context) {
    throw new Error("useSelectedElement must be used within a SelectedElementProvider");
  }
  return context;
};

interface SelectedElementProviderProps {
  children: ReactNode;
}

export const SelectedElementProvider = ({ children }: SelectedElementProviderProps) => {
  const [selectedElement, setSelectedElement] = useState<SelectedElementType | null>(null);
  
  return (
    <SelectedElementContext.Provider value={{ selectedElement, setSelectedElement }}>
      {children}
    </SelectedElementContext.Provider>
  );
};