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
                <Button
                  size="lg"
                  className="mt-8"
                  style={{ backgroundColor: content.styles.colors.primary }}
                >
                  {section.content.cta.text}
                </Button>
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
                            style={{ backgroundColor: content.styles.colors.primary }}
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
              <div className={cn(
                "grid gap-8",
                section.content.alignment === "right" ? "md:grid-cols-[1fr,auto]" : "md:grid-cols-[auto,1fr]"
              )}>
                {section.content.image && (
                  <img
                    src={section.content.image}
                    alt={section.content.heading}
                    className="w-full max-w-xl rounded-lg shadow-lg"
                  />
                )}
                <div className="space-y-4 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold">{section.content.heading}</h2>
                  <div className="prose max-w-none">
                    {section.content.body.split("\n").map((paragraph: string, i: number) => (
                      <p key={i} className="text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}