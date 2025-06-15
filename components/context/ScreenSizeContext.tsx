import React from "react";

export const ScreenSizeContext = React.createContext<{
  screenSize: string;
  setScreenSize: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);