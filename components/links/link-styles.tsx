// src/components/link-styles.tsx (Update this component)
"use client";

import React from "react";
import { StyleProps, colorPalettes } from "@/app/types/links/types"; // Adjust path

interface LinkStyleProps {
  styles: StyleProps;
  onChangeStyle: (newStyles: Partial<StyleProps>) => void; // Allow partial updates
}

const fonts = [
  "Inter, sans-serif",
  "Roboto, sans-serif",
  "Open Sans, sans-serif",
  "Lato, sans-serif",
  "Montserrat, sans-serif",
  "Poppins, sans-serif",
  "Arial, sans-serif",
  "Verdana, sans-serif",
  "Georgia, serif",
  "Times New Roman, serif",
];

const radiusOptions = {
  none: "0px",
  sm: "0.125rem", // 2px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  full: "9999px",
};

export default function LinkStyle({ styles, onChangeStyle }: LinkStyleProps) {
  const handleThemeChange = (themeName: string) => {
    const palette = colorPalettes[themeName];
    if (palette) {
      onChangeStyle({ ...palette, theme: themeName });
    }
  };

  return (
    <div className="p-4 border-l bg-gray-50 h-full overflow-y-auto w-72 flex-shrink-0">
      {" "}
      {/* Fixed width */}
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Customize Style</h2>
      {/* Themes/Palettes */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-700">Themes</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(colorPalettes).map((themeName) => (
            <button
              key={themeName}
              onClick={() => handleThemeChange(themeName)}
              className={`p-2 rounded border capitalize text-sm ${
                styles.theme === themeName ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-300"
              }`}
              style={{
                backgroundColor: colorPalettes[themeName].backgroundColor,
                color: colorPalettes[themeName].textColor,
              }}>
              {themeName}
            </button>
          ))}
          <button
            onClick={() => onChangeStyle({ theme: "custom" })} // Allow custom edits
            className={`p-2 rounded border capitalize text-sm ${
              styles.theme === "custom" ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-300"
            }`}>
            Custom
          </button>
        </div>
      </div>
      {/* Background */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">Background Color</label>
        <input
          type="color"
          value={styles.backgroundColor}
          onChange={(e) => onChangeStyle({ backgroundColor: e.target.value, theme: "custom" })}
          className="w-full h-8 p-1 border rounded cursor-pointer"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">Background Image URL</label>
        <input
          type="text"
          placeholder="Enter image URL"
          value={styles.backgroundImage}
          onChange={(e) => onChangeStyle({ backgroundImage: e.target.value, theme: "custom" })}
          className="w-full p-2 border rounded text-sm"
        />
      </div>
      {/* Text & Buttons */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">Text Color</label>
        <input
          type="color"
          value={styles.textColor}
          onChange={(e) => onChangeStyle({ textColor: e.target.value, theme: "custom" })}
          className="w-full h-8 p-1 border rounded cursor-pointer"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">Button Color</label>
        <input
          type="color"
          value={styles.buttonColor}
          onChange={(e) => onChangeStyle({ buttonColor: e.target.value, theme: "custom" })}
          className="w-full h-8 p-1 border rounded cursor-pointer"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">Button Text Color</label>
        <input
          type="color"
          value={styles.buttonTextColor}
          onChange={(e) => onChangeStyle({ buttonTextColor: e.target.value, theme: "custom" })}
          className="w-full h-8 p-1 border rounded cursor-pointer"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">Button Style</label>
        <select
          value={styles.buttonStyle}
          onChange={(e) => onChangeStyle({ buttonStyle: e.target.value as StyleProps["buttonStyle"], theme: "custom" })}
          className="w-full p-2 border rounded text-sm bg-white">
          <option value="filled">Filled</option>
          <option value="outline">Outline</option>
        </select>
      </div>
      {/* Font */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">Font</label>
        <select
          value={styles.fontFamily}
          onChange={(e) => onChangeStyle({ fontFamily: e.target.value })}
          className="w-full p-2 border rounded text-sm bg-white">
          {fonts.map((font) => (
            <option
              key={font}
              value={font}>
              {font.split(",")[0]} {/* Show cleaner font name */}
            </option>
          ))}
        </select>
      </div>
      {/* Border Radius */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">Button/Card Edges</label>
        <div className="flex space-x-2">
          {Object.entries(radiusOptions).map(([key, value]) => (
            <button
              key={key}
              onClick={() => onChangeStyle({ borderRadius: key as StyleProps["borderRadius"] })}
              className={`flex-1 p-2 border rounded capitalize text-xs ${
                styles.borderRadius === key ? "ring-2 ring-blue-500 border-blue-500 bg-blue-100" : "border-gray-300 bg-white"
              }`}
              style={{ borderRadius: value }}>
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
