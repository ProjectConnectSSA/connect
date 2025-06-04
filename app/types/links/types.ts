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
}

// Represents the overall data structure for a single bio page.
export interface PageData {
  id?: string | undefined; // Database ID (optional until saved)
  slug: string; // Unique URL slug for the page
  customDomain?: string | null; // Optional custom domain linked to the page
  elements: BioElement[];
  styles: StyleProps; // Global styling for the page
  active: boolean; // Whether the page is publicly accessible
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
}
