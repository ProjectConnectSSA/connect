// src/types/form.ts

export interface Condition {
  id: string;
  sourcePageId: string;
  elementId: string;
  operator: string;
  value: string;
  targetPageId: string;
}

export interface ElementStyle {
  backgroundColor?: string;
  width?: string;
  height?: string;
  // Add other potential style properties
  [key: string]: any; // Allow arbitrary style properties
}

export interface ElementType {
  id: string;
  title: string;
  type: string; // e.g., 'text', 'image', 'rating'
  required: boolean;
  value?: string | number | boolean | string[]; // Allow different value types
  options?: string[]; // For select, radio, checkbox groups
  styles: ElementStyle;
  column?: "left" | "right"; // Example for multi-column layout
}

export interface Page {
  id: string;
  title: string;
  elements: ElementType[];
  background?: string;
  styles?: Record<string, any>; // Styles specific to the page container
}

export interface Form {
  id?: string; // Add ID here if it comes from DB
  user_id?: string; // Add user ID
  title: string;
  description: string;
  pages: Page[];
  conditions?: Condition[];
  background?: string;
  styles?: {
    width?: string;
    height?: string;
    columns?: number;
  };
  isActive?: boolean;
  isMultiPage?: boolean;
}
