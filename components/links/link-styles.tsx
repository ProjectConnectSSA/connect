/* eslint-disable no-unused-vars */

"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Style {
  form_background?: string;
  link_background?: string;
  text_color?: string;
  font_family?: string;
  font_size?: string;
  font_weight?: string;
}

interface LinkStyleProps {
  styles: Style;
  setStyle: (styles: Style) => void;
}

const colorOptions = [
  { name: "White", value: "#FFFFFF" },
  { name: "Red", value: "#FF5733" },
  { name: "Green", value: "#33FF57" },
  { name: "Blue", value: "#3357FF" },
  { name: "Orange", value: "#F39C12" },
  { name: "Purple", value: "#8E44AD" },
  { name: "Sky Blue", value: "#3498DB" },
  { name: "Coral", value: "#E74C3C" },
  { name: "Lime", value: "#2ECC71" },
  { name: "Amber", value: "#E67E22" },
  { name: "Teal", value: "#1ABC9C" },
  { name: "Violet", value: "#9B59B6" },
  { name: "Slate", value: "#34495E" },
];

const fontOptions = ["Arial", "Roboto", "Georgia", "Verdana", "Tahoma", "Courier New", "Times New Roman"];
const fontSizeOptions = ["12px", "14px", "16px", "18px", "20px", "22px", "24px", "26px", "28px"];
const fontWeightOptions = ["400", "500", "600", "700", "800"];

export function LinkStyles({ styles, setStyle }: LinkStyleProps) {
  const [isColorOptionsOpen, setIsColorOptionsOpen] = useState(true);
  const [isTypographyOpen, setIsTypographyOpen] = useState(false);

  const CustomDropdown = ({ label, selectedValue, onChange }: { label: string; selectedValue?: string; onChange: (value: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedColor = colorOptions.find((color) => color.value === selectedValue);

    return (
      <div className="relative space-y-2">
        <h2 className="text-sm font-medium">{label}</h2>
        <div
          className="border rounded p-2 flex items-center justify-between cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}>
          <div className="flex items-center space-x-2">
            <div
              className="w-6 h-6 rounded"
              style={{ backgroundColor: selectedColor?.value || "#FFFFFF" }}></div>
            <span>{selectedColor?.name || "Select a color"}</span>
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-md max-h-60 overflow-y-auto">
            {colorOptions.map((color) => (
              <div
                key={color.value}
                className={`flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100 ${selectedValue === color.value ? "bg-gray-200" : ""}`}
                onClick={() => {
                  onChange(color.value);
                  setIsOpen(false);
                }}>
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: color.value }}></div>
                <span>{color.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <h1 className="text-lg font-semibold mb-4">Styles</h1>

      {/* Color Options Panel */}
      <Card className="border">
        <CardHeader className="flex items-center justify-between pb-3 px-4">
          <CardTitle className="text-sm font-medium">Color Options</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsColorOptionsOpen((prev) => !prev)}>
            {isColorOptionsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CardHeader>
        {isColorOptionsOpen && (
          <CardContent className="p-4 space-y-6">
            <CustomDropdown
              label="Form Background"
              selectedValue={styles.form_background}
              onChange={(value) => setStyle({ ...styles, form_background: value })}
            />
            <CustomDropdown
              label="Link Background"
              selectedValue={styles.link_background}
              onChange={(value) => setStyle({ ...styles, link_background: value })}
            />
            <CustomDropdown
              label="Text Color"
              selectedValue={styles.text_color}
              onChange={(value) => setStyle({ ...styles, text_color: value })}
            />
          </CardContent>
        )}
      </Card>

      {/* Typography Options Panel */}
      <Card className="border">
        <CardHeader className="flex items-center justify-between pb-3 px-4">
          <CardTitle className="text-sm font-medium">Typography</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsTypographyOpen((prev) => !prev)}>
            {isTypographyOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CardHeader>
        {isTypographyOpen && (
          <CardContent className="p-4 space-y-6">
            <div>
              <h2 className="text-sm font-medium mb-2">Font</h2>
              <select
                className="border rounded p-2 w-full"
                value={styles.font_family || ""}
                onChange={(e) => setStyle({ ...styles, font_family: e.target.value })}>
                {fontOptions.map((font) => (
                  <option
                    key={font}
                    value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h2 className="text-sm font-medium mb-2">Font Size</h2>
              <select
                className="border rounded p-2 w-full"
                value={styles.font_size || ""}
                onChange={(e) => setStyle({ ...styles, font_size: e.target.value })}>
                {fontSizeOptions.map((size) => (
                  <option
                    key={size}
                    value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h2 className="text-sm font-medium mb-2">Font Weight</h2>
              <select
                className="border rounded p-2 w-full"
                value={styles.font_weight || ""}
                onChange={(e) => setStyle({ ...styles, font_weight: e.target.value })}>
                {fontWeightOptions.map((weight) => (
                  <option
                    key={weight}
                    value={weight}>
                    {weight}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
