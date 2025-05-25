import React from "react";
import { StyleProps } from "@/app/types/links/types";
import { colorPalettes } from "../constants/styleConstants";

interface ThemeSectionProps {
  currentTheme?: string;
  hasBackgroundImage: boolean;
  onThemeChange: (newStyles: Partial<StyleProps>) => void;
}

export function ThemeSection({ currentTheme, hasBackgroundImage, onThemeChange }: ThemeSectionProps) {
  const handleThemeChange = (themeName: string) => {
    const palette = colorPalettes[themeName];
    if (palette) {
      onThemeChange({
        ...palette,
        theme: themeName,
        backgroundImage: undefined,
      });
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Themes</label>
      <div className="grid grid-cols-2 gap-2">
        {Object.keys(colorPalettes).map((themeKey) => (
          <button
            key={themeKey}
            onClick={() => handleThemeChange(themeKey)}
            className={`p-2 rounded border capitalize text-sm transition-all duration-150 ${
              currentTheme === themeKey && !hasBackgroundImage
                ? "ring-2 ring-blue-500 border-blue-500 dark:ring-blue-400 dark:border-blue-400"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
            style={{
              backgroundColor: colorPalettes[themeKey].backgroundColor,
              color: colorPalettes[themeKey].textColor,
            }}>
            {themeKey}
          </button>
        ))}
      </div>
    </div>
  );
}
