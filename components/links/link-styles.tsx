"use client";

import React from "react";

export interface StyleProps {
  backgroundColor: string;
  backgroundImage: string;
}

interface LinkStyleProps {
  styles: StyleProps;
  onChangeStyle: (newStyles: StyleProps) => void;
}

export default function LinkStyle({ styles, onChangeStyle }: LinkStyleProps) {
  return (
    <div className="p-4 border-l">
      <h2 className="text-lg font-semibold mb-4">Style Properties</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Background Color</label>
        <input
          type="color"
          value={styles.backgroundColor}
          onChange={(e) => onChangeStyle({ ...styles, backgroundColor: e.target.value })}
          className="w-full p-1 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Background Image URL</label>
        <input
          type="text"
          placeholder="Enter image URL"
          value={styles.backgroundImage}
          onChange={(e) => onChangeStyle({ ...styles, backgroundImage: e.target.value })}
          className="w-full p-1 border rounded"
        />
      </div>
    </div>
  );
}
