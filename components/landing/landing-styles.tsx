"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorPicker } from "@/components/emails/color-picker";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface LandingStylesProps {
  content: any;
  setContent: (content: any) => void;
}

export function LandingStyles({ content, setContent }: LandingStylesProps) {
  const updateStyle = (key: string, value: any) => {
    setContent({
      ...content,
      styles: {
        ...content.styles,
        [key]: value,
      },
    });
  };

  const updateColor = (key: string, value: string) => {
    setContent({
      ...content,
      styles: {
        ...content.styles,
        colors: {
          ...content.styles.colors,
          [key]: value,
        },
      },
    });
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Page Appearance</h2>
          <p className="text-sm text-muted-foreground">
            Customize how your landing page looks
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select
              value={content.styles.theme}
              onValueChange={(value) => updateStyle("theme", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="elegant">Elegant</SelectItem>
                <SelectItem value="playful">Playful</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select
              value={content.styles.fontFamily}
              onValueChange={(value) => updateStyle("fontFamily", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Roboto">Roboto</SelectItem>
                <SelectItem value="Poppins">Poppins</SelectItem>
                <SelectItem value="Montserrat">Montserrat</SelectItem>
                <SelectItem value="Open Sans">Open Sans</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Primary Color</Label>
            <ColorPicker
              value={content.styles.colors.primary}
              onChange={(color) => updateColor("primary", color)}
            />
          </div>

          <div className="space-y-2">
            <Label>Background Color</Label>
            <ColorPicker
              value={content.styles.colors.background}
              onChange={(color) => updateColor("background", color)}
            />
          </div>

          <div className="space-y-2">
            <Label>Text Color</Label>
            <ColorPicker
              value={content.styles.colors.text}
              onChange={(color) => updateColor("text", color)}
            />
          </div>

          <div className="space-y-2">
            <Label>Section Spacing</Label>
            <Select
              value={content.styles.spacing}
              onValueChange={(value) => updateStyle("spacing", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="comfortable">Comfortable</SelectItem>
                <SelectItem value="spacious">Spacious</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Border Radius</Label>
            <div className="pt-2">
              <Slider
                defaultValue={[parseFloat(content.styles.borderRadius || "0.5")]}
                max={2}
                step={0.125}
                onValueChange={([value]) =>
                  updateStyle("borderRadius", value.toString())
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Animation</Label>
            <Select
              value={content.styles.animation}
              onValueChange={(value) => updateStyle("animation", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="fade">Fade</SelectItem>
                <SelectItem value="slide">Slide</SelectItem>
                <SelectItem value="scale">Scale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={content.styles.darkMode}
              onCheckedChange={(checked) => updateStyle("darkMode", checked)}
            />
            <Label>Enable Dark Mode Support</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={content.styles.responsiveImages}
              onCheckedChange={(checked) => updateStyle("responsiveImages", checked)}
            />
            <Label>Responsive Images</Label>
          </div>
        </div>
      </div>
    </div>
  );
}