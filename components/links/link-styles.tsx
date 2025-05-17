// src/components/links/link-style.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { StyleProps, colorPalettes } from "@/app/types/links/types"; // Adjust path if needed
import { Plus, UploadCloud, XCircle, Trash2, Loader2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

// --- Supabase & Upload Config ---
// RECOMMENDATION: Move to shared utils/config file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const BACKGROUND_BUCKET_NAME = "linkimage"; // CHANGED: Use the same bucket as ProfileElement, or create a new one like 'bio-link-backgrounds'
const BACKGROUND_SUBFOLDER = "backgrounds"; // Store backgrounds in a subfolder
const MAX_BACKGROUND_FILE_SIZE_MB = 5; // Max background image size in MB
// --- End Supabase & Upload Config ---

interface LinkStyleProps {
  styles: StyleProps;
  onChangeStyle: (newStyles: Partial<StyleProps>) => void;
}

const fonts = [
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
];

const radiusOptions = {
  none: "0px",
  sm: "0.125rem",
  md: "0.375rem",
  lg: "0.5rem",
  full: "9999px",
};

const predefinedColors = ["#FFFFFF", "#000000", "#FCA5A5", "#FDBA74", "#86EFAC", "#93C5FD", "#C4B5FD", "#F9A8D4"];

export default function LinkStyle({ styles, onChangeStyle }: LinkStyleProps) {
  const bgInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const btnInputRef = useRef<HTMLInputElement>(null);
  const btnTextInputRef = useRef<HTMLInputElement>(null);
  const backgroundImageInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleThemeChange = (themeName: string) => {
    const palette = colorPalettes[themeName];
    if (palette) {
      onChangeStyle({ ...palette, theme: themeName, backgroundImage: undefined }); // Reset BG image when theme changes
      setUploadError(null); // Clear any upload errors if a theme is picked
    }
  };

  // Upload function for background images
  async function uploadBackgroundImageToServer(file: File): Promise<string> {
    // Client-side validation
    if (file.size > MAX_BACKGROUND_FILE_SIZE_MB * 1024 * 1024) {
      throw new Error(`File size exceeds ${MAX_BACKGROUND_FILE_SIZE_MB}MB limit.`);
    }
    if (!file.type.startsWith("image/")) {
      throw new Error("Invalid file type. Please upload an image.");
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${BACKGROUND_SUBFOLDER}/${fileName}`;

    const { data, error: uploadError } = await supabase.storage.from(BACKGROUND_BUCKET_NAME).upload(filePath, file);

    if (uploadError) {
      console.error("Background Upload error:", uploadError);
      if (uploadError.message.includes("Bucket not found")) {
        throw new Error(`Storage bucket "${BACKGROUND_BUCKET_NAME}" not found.`);
      }
      throw new Error(`Background image upload failed: ${uploadError.message}`);
    }
    if (!data || !data.path) {
      console.error("Background Upload error: No path returned from storage upload.");
      throw new Error("Background image upload failed: No path returned.");
    }

    const { data: publicUrlData } = supabase.storage.from(BACKGROUND_BUCKET_NAME).getPublicUrl(data.path);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      console.error("Failed to get public URL for path:", data.path);
      throw new Error("Failed to get public URL after upload.");
    }

    return publicUrlData.publicUrl;
  }

  const handleBackgroundImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    const toastId = toast.loading("Uploading background...", { description: file.name });

    try {
      const imageUrl = await uploadBackgroundImageToServer(file);
      onChangeStyle({ backgroundImage: imageUrl, theme: "custom" }); // Update canvas, set theme to custom
      toast.success("Background uploaded!", { id: toastId });
    } catch (error: any) {
      console.error("Background upload failed:", error);
      const errorMessage = error.message || "Failed to upload background.";
      setUploadError(errorMessage);
      toast.error(`Upload failed: ${errorMessage}`, { id: toastId });
    } finally {
      setIsUploading(false);
      if (backgroundImageInputRef.current) {
        backgroundImageInputRef.current.value = ""; // Reset file input
      }
    }
  };

  const handleRemoveBackgroundImage = () => {
    onChangeStyle({ backgroundImage: undefined }); // Theme remains "custom" or user can pick another
    setUploadError(null);
    toast.info("Background image removed.");
  };

  const renderColorPickerRow = (
    label: string,
    current: string,
    inputRef: React.RefObject<HTMLInputElement>,
    onColorChange: (color: string) => void
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex items-center space-x-2">
        <div
          className="w-8 h-8 rounded-md flex-none cursor-pointer border-2 border-dashed flex items-center justify-center"
          style={{ borderColor: current, backgroundColor: "transparent" }}
          onClick={() => inputRef.current?.click()}
          title="Open color picker">
          <Plus
            size={18}
            strokeWidth={2.5}
            style={{ color: current }}
          />
        </div>
        <input
          ref={inputRef}
          type="color"
          value={current}
          onChange={(e) => onColorChange(e.target.value)}
          className="opacity-0 w-0 h-0 absolute"
        />
        {predefinedColors.map((col) => (
          <div
            key={col}
            className="w-8 h-8 rounded-md flex-none cursor-pointer border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: col }}
            onClick={() => onColorChange(col)}
            title={`Set to ${col}`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-4 border-l bg-gray-50 dark:bg-gray-800 h-full overflow-y-auto w-72 flex-shrink-0 text-gray-900 dark:text-gray-100">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Customize Style</h2>

      {/* Themes */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Themes</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(colorPalettes).map((themeKey) => (
            <button
              key={themeKey}
              onClick={() => handleThemeChange(themeKey)}
              className={`p-2 rounded border capitalize text-sm transition-all duration-150
                ${
                  styles.theme === themeKey && !styles.backgroundImage
                    ? "ring-2 ring-blue-500 border-blue-500 dark:ring-blue-400 dark:border-blue-400"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              style={{
                backgroundColor: colorPalettes[themeKey].backgroundColor,
                color: colorPalettes[themeKey].textColor,
              }}>
              {themeKey}
            </button>
          ))}
        </div>
      </div>

      {/* Background Image Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Background Image</label>
        <input
          type="file"
          ref={backgroundImageInputRef}
          onChange={handleBackgroundImageSelect}
          accept="image/*"
          style={{ display: "none" }}
          disabled={isUploading}
        />
        <button
          onClick={() => backgroundImageInputRef.current?.click()}
          disabled={isUploading}
          className="w-full flex items-center justify-center p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          {isUploading ? (
            <>
              <Loader2
                size={18}
                className="mr-2 animate-spin"
              />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud
                size={18}
                className="mr-2"
              />
              {styles.backgroundImage ? "Change Image" : "Upload Image"}
            </>
          )}
        </button>

        {styles.backgroundImage && !isUploading && (
          <button
            onClick={handleRemoveBackgroundImage}
            className="w-full flex items-center justify-center mt-2 p-2 border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/30 rounded-md text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/50 transition-colors">
            <Trash2
              size={16}
              className="mr-2"
            />
            Remove Background
          </button>
        )}

        {uploadError &&
          !isUploading && ( // Only show error if not currently uploading
            <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-start">
              <XCircle
                size={14}
                className="mr-1 mt-0.5 flex-shrink-0 text-red-500 dark:text-red-400"
              />
              <span>{uploadError}</span>
            </p>
          )}
      </div>

      {/* Color Palettes */}
      {renderColorPickerRow("Background Color", styles.backgroundColor, bgInputRef, (col) =>
        onChangeStyle({ backgroundColor: col, theme: "custom" })
      )}
      {renderColorPickerRow("Text Color", styles.textColor, textInputRef, (col) => onChangeStyle({ textColor: col, theme: "custom" }))}
      {renderColorPickerRow("Button Color", styles.buttonColor, btnInputRef, (col) => onChangeStyle({ buttonColor: col, theme: "custom" }))}
      {renderColorPickerRow("Button Text Color", styles.buttonTextColor, btnTextInputRef, (col) =>
        onChangeStyle({ buttonTextColor: col, theme: "custom" })
      )}

      {/* Button Style */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Button Style</label>
        <select
          value={styles.buttonStyle}
          onChange={(e) => onChangeStyle({ buttonStyle: e.target.value as StyleProps["buttonStyle"], theme: "custom" })}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500">
          <option value="filled">Filled</option>
          <option value="outline">Outline</option>
          {/* Add other styles like 'hardshadow' if defined in StyleProps */}
        </select>
      </div>

      {/* Font */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Font</label>
        <select
          value={styles.fontFamily}
          onChange={(e) => onChangeStyle({ fontFamily: e.target.value, theme: "custom" })}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500">
          {fonts.map((font) => (
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
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Button/Card Edges</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(radiusOptions).map(([key, val]) => (
            <button
              key={key}
              onClick={() => onChangeStyle({ borderRadius: key as StyleProps["borderRadius"], theme: "custom" })}
              className={`p-2 border rounded capitalize text-xs transition-colors
                ${
                  styles.borderRadius === key
                    ? "ring-2 ring-blue-500 border-blue-500 bg-blue-100 dark:bg-blue-600 dark:border-blue-400 dark:text-white"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              style={{ borderRadius: val }}>
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
