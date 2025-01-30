"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState, useRef } from "react";
// Importing Lucide React Icons
import { Monitor, Smartphone } from "lucide-react";

interface Link {
  id: string;
  type: string;
  title: string;
  url: string;
}

interface Style {
  form_background?: string;
  link_background?: string;
  text_color?: string;
  font_family?: string;
  font_size?: string;
  font_weight?: string;
}

interface LinkPreviewProps {
  links: Link[];
  avatarURL: string | null;
  style: Style;
}

export function LinkPreview({ links, avatarURL, style }: LinkPreviewProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (containerRef.current?.offsetLeft || 0);
    scrollLeft.current = containerRef.current?.scrollLeft || 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const x = e.pageX - (containerRef.current.offsetLeft || 0);
    const walk = (x - startX.current) * 2; // Multiplier for faster scroll
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startX.current = touch.pageX - (containerRef.current?.offsetLeft || 0);
    scrollLeft.current = containerRef.current?.scrollLeft || 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!containerRef.current) return;
    const x = touch.pageX - (containerRef.current.offsetLeft || 0);
    const walk = (x - startX.current) * 2;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div>
      {/* Toggle View Icons */}
      <div className="flex justify-center mb-4 space-x-4">
        <button
          className={`p-3 rounded-full ${viewMode === "desktop" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setViewMode("desktop")}>
          <Monitor size={24} />
        </button>
        <button
          className={`p-3 rounded-full ${viewMode === "mobile" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setViewMode("mobile")}>
          <Smartphone size={24} />
        </button>
      </div>

      {/* Preview Container */}
      <div
        ref={containerRef}
        className={`p-6 space-y-4 rounded-lg ${viewMode === "mobile" ? "w-[375px] mx-auto" : "w-full"} h-[90vh] flex flex-col overflow-hidden`}
        style={{
          backgroundColor: style.form_background || "#ffffff",
          cursor: isDragging.current ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}>
        {/* Avatar Display */}
        {avatarURL && (
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={avatarURL}
              alt="Avatar"
              className="w-16 h-16 rounded-full "
            />
          </div>
        )}

        {/* Links Display */}
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block no-underline">
            <Card
              style={{
                backgroundColor: style.link_background || "#f8f8f8",
                border: "none",
              }}>
              <CardContent className="p-4">
                <div className="text-center">
                  <h3
                    style={{
                      color: style.text_color,
                      fontFamily: style.font_family,
                      fontSize: style.font_size,
                      fontWeight: style.font_weight,
                    }}
                    className="font-semibold">
                    {link.title || "Untitled Link"}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
