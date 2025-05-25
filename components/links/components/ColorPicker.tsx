import React, { useRef } from "react";
import { Plus } from "lucide-react";
import { PREDEFINED_COLORS } from "../constants/styleConstants";
interface ColorPickerProps {
  label: string;
  currentColor: string;
  onColorChange: (color: string) => void;
}

export function ColorPicker({ label, currentColor, onColorChange }: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex items-center space-x-2">
        <div
          className="w-8 h-8 rounded-md flex-none cursor-pointer border-2 border-dashed flex items-center justify-center"
          style={{ borderColor: currentColor, backgroundColor: "transparent" }}
          onClick={() => inputRef.current?.click()}
          title="Open color picker">
          <Plus
            size={18}
            strokeWidth={2.5}
            style={{ color: currentColor }}
          />
        </div>

        <input
          ref={inputRef}
          type="color"
          value={currentColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="opacity-0 w-0 h-0 absolute"
        />

        {PREDEFINED_COLORS.map((color) => (
          <div
            key={color}
            className="w-8 h-8 rounded-md flex-none cursor-pointer border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
            title={`Set to ${color}`}
          />
        ))}
      </div>
    </div>
  );
}
