import React, { useRef } from "react";
import { StyleProps } from "@/app/types/links/types";
import { ColorPicker } from "./ColorPicker";

interface ColorCustomizationProps {
  styles: StyleProps;
  onStyleChange: (newStyles: Partial<StyleProps>) => void;
}

const colorConfigs = [
  { label: "Background Color", key: "backgroundColor" as keyof StyleProps },
  { label: "Text Color", key: "textColor" as keyof StyleProps },
  { label: "Button Color", key: "buttonColor" as keyof StyleProps },
  { label: "Button Text Color", key: "buttonTextColor" as keyof StyleProps },
];

export function ColorCustomization({ styles, onStyleChange }: ColorCustomizationProps) {
  return (
    <>
      {colorConfigs.map(({ label, key }) => (
        <ColorPicker
          key={key}
          label={label}
          currentColor={styles[key] as string}
          onColorChange={(color) => onStyleChange({ [key]: color, theme: "custom" })}
        />
      ))}
    </>
  );
}
