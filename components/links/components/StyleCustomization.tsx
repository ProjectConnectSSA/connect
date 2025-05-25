import React from "react";
import { StyleProps } from "@/app/types/links/types";
import { FONTS, RADIUS_OPTIONS } from "../constants/styleConstants";

interface StyleCustomizationProps {
  styles: StyleProps;
  onStyleChange: (newStyles: Partial<StyleProps>) => void;
}

export function StyleCustomization({ styles, onStyleChange }: StyleCustomizationProps) {
  return (
    <>
      {/* Button Style */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Button Style</label>
        <select
          value={styles.buttonStyle}
          onChange={(e) =>
            onStyleChange({
              buttonStyle: e.target.value as StyleProps["buttonStyle"],
              theme: "custom",
            })
          }
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500">
          <option value="filled">Filled</option>
          <option value="outline">Outline</option>
        </select>
      </div>

      {/* Font */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Font</label>
        <select
          value={styles.fontFamily}
          onChange={(e) => onStyleChange({ fontFamily: e.target.value, theme: "custom" })}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500">
          {FONTS.map((font) => (
            <option
              key={font}
              value={font}>
              {font.split(",")[0]}
            </option>
          ))}
        </select>
      </div>

      {/* Border Radius */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Radius</label>
        <select
          value={styles.borderRadius}
          onChange={(e) =>
            onStyleChange({
              borderRadius: e.target.value as StyleProps["borderRadius"],
              theme: "custom",
            })
          }
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500">
          {Object.entries(RADIUS_OPTIONS).map(([key, val]) => (
            <option
              key={key}
              value={key}
              style={{ borderRadius: val }}>
              {key}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
