import { StyleProps } from "@/app/types/links/types";

export const FONTS = [
  "Inter, sans-serif",
  "Roboto, sans-serif",
  "Open Sans, sans-serif",
  "Lato, sans-serif",
  "Montserrat, sans-serif",
  "Poppins, sans-serif",
  "Arial, sans-serif",
  "Verdana, sans-serif",
  "Georgia, serif",
  "Times New Roman, serif",
] as const;

export const RADIUS_OPTIONS = {
  none: "0px",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  full: "9999px",
} as const;

export const PREDEFINED_COLORS = ["#FFFFFF", "#000000", "#FCA5A5", "#FDBA74", "#86EFAC", "#93C5FD", "#C4B5FD", "#F9A8D4"] as const;

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
