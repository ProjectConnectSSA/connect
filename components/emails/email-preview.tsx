"use client";

import { cn } from "@/lib/utils";
import { Twitter, Facebook, Linkedin } from "lucide-react";
import type { EmailContent } from "@/types/email";

interface EmailPreviewProps {
  content: EmailContent;
}

export function EmailPreview({ content }: EmailPreviewProps) {
  const { styles } = content;

  const getButtonStyles = () => {
    const baseStyles = "inline-flex items-center justify-center font-semibold no-underline";
    const sizeStyles = {
      small: "px-3 py-1.5 text-sm",
      medium: "px-4 py-2",
      large: "px-6 py-3 text-lg"
    };
    const variantStyles = {
      rounded: "rounded-md",
      square: "",
      pill: "rounded-full"
    };

    return cn(
      baseStyles,
      sizeStyles[styles.buttonSize as keyof typeof sizeStyles],
      variantStyles[styles.buttonStyle as keyof typeof variantStyles],
      "transition-colors",
    );
  };

  const getSectionSpacing = () => {
    switch (styles.spacing) {
      case "compact":
        return "space-y-4";
      case "spacious":
        return "space-y-12";
      default:
        return "space-y-8";
    }
  };

  return (
    <div 
      className="h-full overflow-y-auto"
      style={{ 
        backgroundColor: styles.backgroundColor,
        color: styles.textColor,
        fontFamily: styles.fontFamily
      }}
    >
      <div className={cn("mx-auto", getSectionSpacing())} style={{ maxWidth: `${styles.containerWidth}px` }}>
        {/* Header */}
        <div 
          className="p-6 text-center"
          style={{ backgroundColor: styles.headerBackground }}
        >
          <img
            src={content.content.header.logo}
            alt="Logo"
            className="h-8 object-contain mx-auto"
          />
        </div>

        {/* Content Sections */}
        {content.content.sections.map((section, index) => (
          <div 
            key={index}
            className={cn(
              "p-6 bg-white",
              `rounded-[${styles.borderRadius}rem]`
            )}
          >
            {section.type === "hero" && (
              <div className="space-y-4 text-center">
                {section.image && (
                  <img
                    src={section.image}
                    alt={section.title}
                    className={cn(
                      "w-full object-cover",
                      `rounded-[${styles.borderRadius}rem]`
                    )}
                  />
                )}
                <h1 className="text-3xl font-bold" style={{ color: styles.textColor }}>
                  {section.title}
                </h1>
                <p className="text-lg" style={{ color: `${styles.textColor}99` }}>
                  {section.subtitle}
                </p>
                <a
                  href={section.buttonUrl}
                  className={getButtonStyles()}
                  style={{ 
                    backgroundColor: styles.buttonColor,
                    color: "#ffffff"
                  }}
                >
                  {section.buttonText}
                </a>
              </div>
            )}

            {section.type === "text" && (
              <div className="prose max-w-none">
                {section.content?.split("\n").map((paragraph, i) => (
                  <p 
                    key={i} 
                    className="mb-4"
                    style={{ color: styles.textColor }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {section.type === "columns" && (
              <div className="grid md:grid-cols-2 gap-6">
                {section.columns?.map((column, colIndex) => (
                  <div key={colIndex} className="space-y-4">
                    <img
                      src={column.image}
                      alt={column.title}
                      className={cn(
                        "w-full object-cover",
                        `rounded-[${styles.borderRadius}rem]`
                      )}
                    />
                    <h3 
                      className="text-xl font-semibold"
                      style={{ color: styles.textColor }}
                    >
                      {column.title}
                    </h3>
                    <p style={{ color: `${styles.textColor}99` }}>
                      {column.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Footer */}
        <div 
          className="p-6 text-center space-y-4"
          style={{ 
            backgroundColor: styles.footerBackground,
            color: `${styles.textColor}99`
          }}
        >
          <div className="flex justify-center space-x-4">
            {content.content.footer.socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="text-muted-foreground hover:text-foreground transition-colors"
                style={{ color: `${styles.textColor}99` }}
              >
                {link.platform === "twitter" && <Twitter className="h-5 w-5" />}
                {link.platform === "facebook" && <Facebook className="h-5 w-5" />}
                {link.platform === "linkedin" && <Linkedin className="h-5 w-5" />}
              </a>
            ))}
          </div>
          <p>{content.content.footer.companyAddress}</p>
          <p>
            <a 
              href={content.content.footer.unsubscribeUrl}
              className="underline hover:no-underline"
              style={{ color: `${styles.textColor}99` }}
            >
              Unsubscribe
            </a>
            {" "}from our emails
          </p>
        </div>
      </div>
    </div>
  );
}