"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Shield, Star, Zap } from "lucide-react";

interface LandingPreviewProps {
  content: any;
}

export function LandingPreview({ content }: LandingPreviewProps) {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Shield":
        return Shield;
      case "Star":
        return Star;
      case "Zap":
        return Zap;
      default:
        return Zap;
    }
  };

  // Add this helper function to format URLs properly
  const formatUrl = (url: string): string => {
    // Return empty string for undefined/null URLs
    if (!url) return "";

    // If URL is just "#", return it as is
    if (url === "#") return url;

    // If URL already starts with http:// or https://, return as is
    if (/^https?:\/\//i.test(url)) return url;

    // If URL is a relative path starting with /, return as is
    if (url.startsWith("/")) return url;

    // Otherwise, add https:// prefix for external URLs
    return `https://${url}`;
  };

  const getThemeStyles = () => {
    const { styles } = content;
    const baseStyles = {
      "--font-family": styles.fontFamily,
      "--primary": styles.colors.primary,
      "--background": styles.colors.background,
      "--text": styles.colors.text,
    };

    switch (styles.theme) {
      case "minimal":
        return {
          ...baseStyles,
          "--card": "transparent",
          "--border": "transparent",
        };
      case "modern":
        return {
          ...baseStyles,
          "--card": styles.colors.background,
          "--border": styles.colors.text,
        };
      default:
        return baseStyles;
    }
  };

  const getAnimationClass = () => {
    switch (content.styles.animation) {
      case "fade":
        return "animate-in fade-in";
      case "slide":
        return "animate-in slide-in-from-bottom";
      case "scale":
        return "animate-in zoom-in";
      default:
        return "";
    }
  };

  const getSectionSpacing = () => {
    switch (content.styles.spacing) {
      case "compact":
        return "space-y-8";
      case "comfortable":
        return "space-y-16";
      case "spacious":
        return "space-y-24";
      default:
        return "space-y-16";
    }
  };

  return (
    <div
      className="h-full overflow-y-auto bg-background"
      style={getThemeStyles() as any}
    >
      <div className={cn("container mx-auto px-4 py-8", getSectionSpacing())}>
        {content.sections.map((section: any, index: number) => (
          <div
            key={section.id}
            className={cn("w-full", getAnimationClass())}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {section.type === "hero" && (
              <div className="flex flex-col items-center text-center space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold">
                  {section.content.heading}
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  {section.content.subheading}
                </p>
                {section.content.image && (
                  <img
                    src={section.content.image}
                    alt={section.content.heading}
                    className="w-full max-w-4xl rounded-lg shadow-lg"
                  />
                )}
                {section.content.cta &&
                  (section.content.cta.url &&
                  section.content.cta.url !== "#" ? (
                    <a
                      href={formatUrl(section.content.cta.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="lg"
                        className="mt-8"
                        style={{
                          backgroundColor: content.styles.colors.primary,
                        }}
                      >
                        {section.content.cta.text}
                      </Button>
                    </a>
                  ) : (
                    <Button
                      size="lg"
                      className="mt-8"
                      style={{
                        backgroundColor: content.styles.colors.primary,
                      }}
                    >
                      {section.content.cta.text}
                    </Button>
                  ))}
              </div>
            )}

            {section.type === "features" && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-center">
                  {section.content.heading}
                </h2>
                <div className="grid gap-8 md:grid-cols-3">
                  {section.content.items.map((item: any, i: number) => {
                    const Icon = getIconComponent(item.icon);
                    return (
                      <div key={i} className="space-y-4">
                        <div className="flex justify-center">
                          <div
                            className="p-3 rounded-full"
                            style={{
                              backgroundColor: content.styles.colors.primary,
                            }}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-center">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-center">
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {section.type === "content" && (
              <div
                className={cn(
                  "grid gap-8",
                  section.content.alignment === "right"
                    ? "md:grid-cols-[1fr,auto]"
                    : "md:grid-cols-[auto,1fr]"
                )}
              >
                {section.content.image && (
                  <img
                    src={section.content.image}
                    alt={section.content.heading}
                    className="w-full max-w-xl rounded-lg shadow-lg"
                  />
                )}
                <div className="space-y-4 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold">
                    {section.content.heading}
                  </h2>
                  <div className="prose max-w-none">
                    {section.content.body
                      .split("\n")
                      .map((paragraph: string, i: number) => (
                        <p key={i} className="text-muted-foreground">
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {section.type === "footer" && (
              <footer className="border-t pt-12 pb-6 mt-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold">
                      {section.content.heading}
                    </h3>
                    <p className="text-sm">{section.content.tagline}</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold">Quick Links</h3>
                    <ul className="space-y-2">
                      {section.content.links?.map((link: any, i: number) => (
                        <li key={i}>
                          <a
                            href={formatUrl(link.url)}
                            className="text-sm hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold">Connect</h3>
                    <div className="flex space-x-4">
                      {section.content.socialLinks?.map(
                        (link: any, i: number) => (
                          <a
                            key={i}
                            href={formatUrl(link.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary"
                          >
                            {link.platform}
                          </a>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-center border-t mt-8 pt-6">
                  {section.content.copyright}
                </div>
              </footer>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
