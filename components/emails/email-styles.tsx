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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface EmailStylesProps {
  content: any;
  setContent: (content: any) => void;
}

export function EmailStyles({ content, setContent }: EmailStylesProps) {
  const updateStyle = (key: string, value: string | number) => {
    setContent({
      ...content,
      styles: {
        ...content.styles,
        [key]: value,
      },
    });
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Email Appearance</h2>
          <p className="text-sm text-muted-foreground">
            Customize how your email looks
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {/* Theme & Layout */}
          <AccordionItem value="theme">
            <AccordionTrigger>Theme & Layout</AccordionTrigger>
            <AccordionContent className="space-y-4 p-2">
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
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                    <SelectItem value="elegant">Elegant</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Container Width (px)</Label>
                <div className="pt-2">
                  <Slider
                    defaultValue={[parseInt(content.styles.containerWidth)]}
                    min={400}
                    max={800}
                    step={10}
                    onValueChange={([value]) =>
                      updateStyle("containerWidth", value.toString())
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Content Spacing</Label>
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
            </AccordionContent>
          </AccordionItem>

          {/* Typography */}
          <AccordionItem value="typography">
            <AccordionTrigger>Typography</AccordionTrigger>
            <AccordionContent className="space-y-4 p-2">
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
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Helvetica">Helvetica</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Heading Size Scale</Label>
                <Select
                  value={content.styles.headingScale}
                  onValueChange={(value) => updateStyle("headingScale", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Line Height</Label>
                <Select
                  value={content.styles.lineHeight}
                  onValueChange={(value) => updateStyle("lineHeight", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tight">Tight</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="relaxed">Relaxed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Colors */}
          <AccordionItem value="colors">
            <AccordionTrigger>Colors</AccordionTrigger>
            <AccordionContent className="space-y-4 p-2">
              <div className="space-y-2">
                <Label>Background Color</Label>
                <ColorPicker
                  value={content.styles.backgroundColor}
                  onChange={(color) => updateStyle("backgroundColor", color)}
                />
              </div>

              <div className="space-y-2">
                <Label>Text Color</Label>
                <ColorPicker
                  value={content.styles.textColor}
                  onChange={(color) => updateStyle("textColor", color)}
                />
              </div>

              <div className="space-y-2">
                <Label>Accent Color</Label>
                <ColorPicker
                  value={content.styles.accentColor}
                  onChange={(color) => updateStyle("accentColor", color)}
                />
              </div>

              <div className="space-y-2">
                <Label>Header Background</Label>
                <ColorPicker
                  value={content.styles.headerBackground}
                  onChange={(color) => updateStyle("headerBackground", color)}
                />
              </div>

              <div className="space-y-2">
                <Label>Footer Background</Label>
                <ColorPicker
                  value={content.styles.footerBackground}
                  onChange={(color) => updateStyle("footerBackground", color)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Buttons */}
          <AccordionItem value="buttons">
            <AccordionTrigger>Buttons</AccordionTrigger>
            <AccordionContent className="space-y-4 p-2">
              <div className="space-y-2">
                <Label>Button Style</Label>
                <Select
                  value={content.styles.buttonStyle}
                  onValueChange={(value) => updateStyle("buttonStyle", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rounded">Rounded</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="pill">Pill</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                    <SelectItem value="ghost">Ghost</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Button Size</Label>
                <Select
                  value={content.styles.buttonSize}
                  onValueChange={(value) => updateStyle("buttonSize", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Button Color</Label>
                <ColorPicker
                  value={content.styles.buttonColor}
                  onChange={(color) => updateStyle("buttonColor", color)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Borders & Dividers */}
          <AccordionItem value="borders">
            <AccordionTrigger>Borders & Dividers</AccordionTrigger>
            <AccordionContent className="space-y-4 p-2">
              <div className="space-y-2">
                <Label>Border Radius</Label>
                <div className="pt-2">
                  <Slider
                    defaultValue={[parseFloat(content.styles.borderRadius)]}
                    max={2}
                    step={0.125}
                    onValueChange={([value]) =>
                      updateStyle("borderRadius", value.toString())
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Divider Style</Label>
                <Select
                  value={content.styles.dividerStyle}
                  onValueChange={(value) => updateStyle("dividerStyle", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                    <SelectItem value="dotted">Dotted</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Divider Color</Label>
                <ColorPicker
                  value={content.styles.dividerColor}
                  onChange={(color) => updateStyle("dividerColor", color)}
                />
              </div>

              <div className="space-y-2">
                <Label>Divider Width (px)</Label>
                <div className="pt-2">
                  <Slider
                    defaultValue={[parseInt(content.styles.dividerWidth || "1")]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={([value]) =>
                      updateStyle("dividerWidth", value.toString())
                    }
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Images */}
          <AccordionItem value="images">
            <AccordionTrigger>Images</AccordionTrigger>
            <AccordionContent className="space-y-4 p-2">
              <div className="space-y-2">
                <Label>Image Border Radius</Label>
                <div className="pt-2">
                  <Slider
                    defaultValue={[parseFloat(content.styles.imageBorderRadius || "0.5")]}
                    max={2}
                    step={0.125}
                    onValueChange={([value]) =>
                      updateStyle("imageBorderRadius", value.toString())
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Image Shadow</Label>
                <Select
                  value={content.styles.imageShadow}
                  onValueChange={(value) => updateStyle("imageShadow", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={content.styles.imageHoverEffect}
                  onCheckedChange={(checked) =>
                    updateStyle("imageHoverEffect", checked)
                  }
                />
                <Label>Enable Hover Effects</Label>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Advanced */}
          <AccordionItem value="advanced">
            <AccordionTrigger>Advanced</AccordionTrigger>
            <AccordionContent className="space-y-4 p-2">
              <div className="space-y-2">
                <Label>Custom CSS</Label>
                <Input
                  value={content.styles.customCSS}
                  onChange={(e) => updateStyle("customCSS", e.target.value)}
                  placeholder="Enter custom CSS"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={content.styles.darkMode}
                  onCheckedChange={(checked) =>
                    updateStyle("darkMode", checked)
                  }
                />
                <Label>Enable Dark Mode Support</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={content.styles.responsiveImages}
                  onCheckedChange={(checked) =>
                    updateStyle("responsiveImages", checked)
                  }
                />
                <Label>Responsive Images</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={content.styles.retinaSupportEnabled}
                  onCheckedChange={(checked) =>
                    updateStyle("retinaSupportEnabled", checked)
                  }
                />
                <Label>Retina Support</Label>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}