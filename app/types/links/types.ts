// src/types.ts (Updated)

// Represents the different types of elements that can be added to a bio page.
export type BioElementType =
  | "profile"
  | "socials"
  | "link"
  | "card"
  | "button"
  | "header"
  | "image"
  | "calendly"
  | "shopify"
  | "countdown"
  | "subscribe"
  | "layout-single-column" // Layout container with one column
  | "layout-two-columns"; // Layout container with two columns

// Represents a single element on the bio page.
export interface BioElement {
  id: string; // Unique identifier for the element (e.g., UUID)
  type: BioElementType;
  order: number; // Display order relative to siblings (either in root or within a layout column)

  // --- Content Properties (vary by type) ---
  title?: string;
  url?: string;
  thumbnailUrl?: string;
  name?: string;
  bioText?: string;
  avatarUrl?: string;
  socialLinks?: { platform: string; url: string }[];
  description?: string;
  cardLayout?: "image-top" | "image-left" | "text-only";
  targetDate?: string;
  campaignTag?: string;

  // --- Layout Container Specific ---
  // Holds the actual child elements nested within columns.
  // Used ONLY when type is 'layout-single-column' or 'layout-two-columns'.
  columns?: BioElement[][];

  // --- Nesting Information (for elements *inside* layouts) ---
  parentId?: string; // ID of the parent layout element, if nested
  columnIndex?: number; // Index of the column (0, 1, ...) within the parent layout, if nested

  // --- Style Overrides (Optional) ---
  // style?: Partial<StyleProps>;
}

// Represents the overall data structure for a single bio page.
export interface PageData {
  id?: string | undefined; // Database ID (optional until saved)
  slug: string; // Unique URL slug for the page
  customDomain?: string | null; // Optional custom domain linked to the page
  // IMPORTANT: This 'elements' array should contain ALL elements,
  // including those nested within layout 'columns'. The nesting is
  // defined by the 'columns', 'parentId', and 'columnIndex' properties.
  elements: BioElement[];
  styles: StyleProps; // Global styling for the page
  active: boolean; // Whether the page is publicly accessible
  // user_id?: string; // Link to the user who owns the page (implement later)
  created_at?: string; // Timestamp from database
  updated_at?: string; // Timestamp from database
}

// Defines the customizable style properties for a page.
export interface StyleProps {
  theme: string; // Identifier for a pre-defined theme or 'custom'
  backgroundColor: string; // Page background color
  backgroundImage: string; // URL for page background image
  textColor: string; // Default text color for elements
  buttonColor: string; // Background color for buttons/links
  buttonTextColor: string; // Text color for buttons/links
  buttonStyle: "filled" | "outline"; // Appearance style for buttons/links
  borderRadius: "none" | "sm" | "md" | "lg" | "full"; // Border radius for buttons/cards
  fontFamily: string; // Font family for the page text
  // Add more specific styles as needed
}

// Default style settings for a new page.
export const defaultStyles: StyleProps = {
  theme: "light",
  backgroundColor: "#FFFFFF",
  backgroundImage: "",
  textColor: "#1f2937", // Tailwind gray-800
  buttonColor: "#3b82f6", // Tailwind blue-500
  buttonTextColor: "#FFFFFF",
  buttonStyle: "filled",
  borderRadius: "md",
  fontFamily: "Inter, sans-serif",
};

// Pre-defined color palettes for themes.
export const colorPalettes: Record<string, Partial<StyleProps>> = {
  light: {
    backgroundColor: "#FFFFFF",
    textColor: "#1f2937",
    buttonColor: "#3b82f6",
    buttonTextColor: "#FFFFFF",
  },
  dark: {
    backgroundColor: "#1f2937", // gray-800
    textColor: "#f3f4f6", // gray-100
    buttonColor: "#60a5fa", // blue-400
    buttonTextColor: "#1f2937",
  },
  ocean: {
    backgroundColor: "#E0F7FA", // cyan-50
    textColor: "#006064", // cyan-900
    buttonColor: "#00ACC1", // cyan-600
    buttonTextColor: "#FFFFFF",
  },
  sunset: {
    backgroundColor: "#FFF3E0", // orange-50
    textColor: "#E65100", // orange-900
    buttonColor: "#FB8C00", // orange-600
    buttonTextColor: "#FFFFFF",
  },
  // Add more palettes as desired
};
