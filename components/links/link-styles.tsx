"use client";

import React from "react";
import { StyleProps } from "@/app/types/links/types";
import { ThemeSection } from "./components/ThemeSection";
import { BackgroundImageSection } from "./components/BackgroundImageSection";
import { ColorCustomization } from "./components/ColorCustomization";
import { StyleCustomization } from "./components/StyleCustomization";

interface LinkStyleProps {
  styles: StyleProps;
  onChangeStyle: (newStyles: Partial<StyleProps>) => void;
}

export default function LinkStyle({ styles, onChangeStyle }: LinkStyleProps) {
  return (
    <div className="p-4 border-l bg-gray-50 dark:bg-gray-800 h-full overflow-y-auto w-72 flex-shrink-0 text-gray-900 dark:text-gray-100">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Customize Style</h2>

      <ThemeSection
        currentTheme={styles.theme}
        hasBackgroundImage={!!styles.backgroundImage}
        onThemeChange={onChangeStyle}
      />

      <BackgroundImageSection
        backgroundImage={styles.backgroundImage}
        onStyleChange={onChangeStyle}
      />

      <ColorCustomization
        styles={styles}
        onStyleChange={onChangeStyle}
      />

      <StyleCustomization
        styles={styles}
        onStyleChange={onChangeStyle}
      />
    </div>
  );
}
