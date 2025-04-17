"use client";

import React, { useRef } from "react";
import { StyleProps, colorPalettes } from "@/app/types/links/types";
import { Plus } from "lucide-react";

interface LinkStyleProps {
  styles: StyleProps;
  onChangeStyle: (newStyles: Partial<StyleProps>) => void;
}

const fonts = ["Inter, sans-serif", "Roboto, sans-serif", "Open Sans, sans-serif", "Lato, sans-serif", "Montserrat, sans-serif", "Poppins, sans-serif", "Arial, sans-serif", "Verdana, sans-serif", "Georgia, serif", "Times New Roman, serif"];

const radiusOptions = {
  none: "0px",
  sm: "0.125rem",
  md: "0.375rem",
  lg: "0.5rem",
  full: "9999px",
};

const predefinedColors = ["#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA", "#F472B6", "#FCD34D", "#4ADE80"];

export default function LinkStyle({ styles, onChangeStyle }: LinkStyleProps) {
  const bgInput = useRef<HTMLInputElement>(null);
  const textInput = useRef<HTMLInputElement>(null);
  const btnInput = useRef<HTMLInputElement>(null);
  const btnTextInput = useRef<HTMLInputElement>(null);

  const handleThemeChange = (themeName: string) => {
    const palette = colorPalettes[themeName];
    if (palette) onChangeStyle({ ...palette, theme: themeName });
  };

  const renderColorPickerRow = (label: string, current: string, inputRef: React.RefObject<HTMLInputElement>, onColorChange: (color: string) => void) => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1 text-gray-700">{label}</label>
      <div className="flex items-center space-x-2">
        {/* Custom color square with outlined border and plus icon */}
        <div className="w-8 h-8 rounded-lg flex-none cursor-pointer border-2 border-dashed flex items-center justify-center" style={{ borderColor: current, backgroundColor: "transparent" }} onClick={() => inputRef.current?.click()}>
          <Plus size={20} strokeWidth={2} style={{ color: current }} />
        </div>
        <input ref={inputRef} type="color" value={current} onChange={(e) => onColorChange(e.target.value)} className="hidden" />
        {/* Predefined color boxes */}
        {predefinedColors.map((col) => (
          <div key={col} className="w-8 h-8 rounded-lg flex-none cursor-pointer border" style={{ backgroundColor: col, borderColor: col }} onClick={() => onColorChange(col)} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-4 border-l bg-gray-50 h-full overflow-y-auto w-72 flex-shrink-0">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Customize Style</h2>
      {/* Themes */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-700">Themes</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(colorPalettes).map((theme) => (
            <button
              key={theme}
              onClick={() => handleThemeChange(theme)}
              className={`p-2 rounded border capitalize text-sm ${styles.theme === theme ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-300"}`}
              style={{
                backgroundColor: colorPalettes[theme].backgroundColor,
                color: colorPalettes[theme].textColor,
              }}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>
      {/* Color Palettes */}
      {renderColorPickerRow("Background Color", styles.backgroundColor, bgInput, (col) => onChangeStyle({ backgroundColor: col, theme: "custom" }))}
      {renderColorPickerRow("Text Color", styles.textColor, textInput, (col) => onChangeStyle({ textColor: col, theme: "custom" }))}
      {renderColorPickerRow("Button Color", styles.buttonColor, btnInput, (col) => onChangeStyle({ buttonColor: col, theme: "custom" }))}
      {renderColorPickerRow("Button Text Color", styles.buttonTextColor, btnTextInput, (col) => onChangeStyle({ buttonTextColor: col, theme: "custom" }))}
      {/* Button Style */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">Button Style</label>
        <select value={styles.buttonStyle} onChange={(e) => onChangeStyle({ buttonStyle: e.target.value as StyleProps["buttonStyle"] })} className="w-full p-2 border rounded text-sm bg-white">
          <option value="filled">Filled</option>
          <option value="outline">Outline</option>
        </select>
      </div>
      {/* Font */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">Font</label>
        <select value={styles.fontFamily} onChange={(e) => onChangeStyle({ fontFamily: e.target.value })} className="w-full p-2 border rounded text-sm bg-white">
          {fonts.map((font) => (
            <option key={font} value={font}>
              {font.split(",")[0]}
            </option>
          ))}
        </select>
      </div>
      {/* Border Radius */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">Button/Card Edges</label>
        <div className="flex space-x-2">
          {Object.entries(radiusOptions).map(([key, val]) => (
            <button key={key} onClick={() => onChangeStyle({ borderRadius: key as StyleProps["borderRadius"] })} className={`flex-1 p-2 border rounded capitalize text-xs ${styles.borderRadius === key ? "ring-2 ring-blue-500 border-blue-500 bg-blue-100" : "border-gray-300 bg-white"}`} style={{ borderRadius: val }}>
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
