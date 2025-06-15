"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type ScreenSizeType = 'mobile' | 'desktop';

interface ScreenSizeContextType {
  screenSize: ScreenSizeType;
  setScreenSize: React.Dispatch<React.SetStateAction<ScreenSizeType>>;
}

const ScreenSizeContext = createContext<ScreenSizeContextType | null>(null);

export const useScreenSize = () => {
  const context = useContext(ScreenSizeContext);
  if (!context) {
    throw new Error("useScreenSize must be used within a ScreenSizeProvider");
  }
  return context;
};

interface ScreenSizeProviderProps {
  children: ReactNode;
}

export const ScreenSizeProvider = ({ children }: ScreenSizeProviderProps) => {
  const [screenSize, setScreenSize] = useState<ScreenSizeType>('desktop');
  
  return (
    <ScreenSizeContext.Provider value={{ screenSize, setScreenSize }}>
      {children}
    </ScreenSizeContext.Provider>
  );
};