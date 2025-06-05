"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorPicker } from "@/components/ui/color-picker";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface LandingStylesProps {
  content: any;
  setContent: (content: any) => void;
}

export function LandingStyles({ content, setContent }: LandingStylesProps) {
  // Helper function to update styles
  const updateStyle = (path: string[], value: any) => {
    setContent((prevContent: any) => {
      const newContent = { ...prevContent };
      let current = newContent.styles;

      // Navigate to the right location in the object
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }

      // Update the final property
      current[path[path.length - 1]] = value;
      return newContent;
    });
  };

  // Get current styles or defaults
  const styles = content.styles || {};
  const theme = styles.theme || "modern";
  const fontFamily = styles.fontFamily || "Inter";
  const colors = styles.colors || {
    primary: "#7c3aed",
    background: "#ffffff",
    text: "#1f2937",
  };
  const spacing = styles.spacing || "comfortable";
  const animation = styles.animation || "fade";
  const borderRadius = styles.borderRadius || "0.5";
  const darkMode = styles.darkMode || false;

  return (
    <div className="h-full overflow-y-auto p-4">
      {/* Style Controls in Accordion */}
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="typography"
      >
        {/* Typography Section */}
        <AccordionItem value="typography">
          <AccordionTrigger className="text-lg font-medium">
            Typography
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Tabs defaultValue="headings">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="headings">Headings</TabsTrigger>
                  <TabsTrigger value="body">Body Text</TabsTrigger>
                </TabsList>

                <TabsContent value="headings" className="space-y-3 pt-2">
                  <div>
                    <Label>Font Family</Label>
                    <Select
                      value={fontFamily}
                      onValueChange={(value) =>
                        updateStyle(["fontFamily"], value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                        <SelectItem value="Playfair Display">
                          Playfair
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Font Weight</Label>
                    <Select
                      value={styles.headingWeight || "600"}
                      onValueChange={(value) =>
                        updateStyle(["headingWeight"], value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select weight" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="300">Light (300)</SelectItem>
                        <SelectItem value="400">Regular (400)</SelectItem>
                        <SelectItem value="500">Medium (500)</SelectItem>
                        <SelectItem value="600">Semibold (600)</SelectItem>
                        <SelectItem value="700">Bold (700)</SelectItem>
                        <SelectItem value="800">Extrabold (800)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>
                      Line Height ({styles.headingLineHeight || "1.2"})
                    </Label>
                    <Slider
                      value={[parseFloat(styles.headingLineHeight || "1.2")]}
                      min={0.8}
                      max={2}
                      step={0.1}
                      onValueChange={([value]) =>
                        updateStyle(["headingLineHeight"], value.toString())
                      }
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>
                      Letter Spacing ({styles.headingLetterSpacing || "0"})
                    </Label>
                    <Slider
                      value={[parseFloat(styles.headingLetterSpacing || "0")]}
                      min={-0.05}
                      max={0.1}
                      step={0.01}
                      onValueChange={([value]) =>
                        updateStyle(["headingLetterSpacing"], value.toString())
                      }
                      className="mt-2"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="body" className="space-y-3 pt-2">
                  <div>
                    <Label>Font Family</Label>
                    <Select
                      value={styles.bodyFont || fontFamily}
                      onValueChange={(value) =>
                        updateStyle(["bodyFont"], value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Font Weight</Label>
                    <Select
                      value={styles.bodyWeight || "400"}
                      onValueChange={(value) =>
                        updateStyle(["bodyWeight"], value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select weight" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="300">Light (300)</SelectItem>
                        <SelectItem value="400">Regular (400)</SelectItem>
                        <SelectItem value="500">Medium (500)</SelectItem>
                        <SelectItem value="600">Semibold (600)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>
                      Line Height ({styles.bodyLineHeight || "1.5"})
                    </Label>
                    <Slider
                      value={[parseFloat(styles.bodyLineHeight || "1.5")]}
                      min={1}
                      max={2}
                      step={0.1}
                      onValueChange={([value]) =>
                        updateStyle(["bodyLineHeight"], value.toString())
                      }
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>
                      Font Size Base ({styles.baseFontSize || "16"}px)
                    </Label>
                    <Slider
                      value={[parseInt(styles.baseFontSize || "16")]}
                      min={14}
                      max={20}
                      step={1}
                      onValueChange={([value]) =>
                        updateStyle(["baseFontSize"], value.toString())
                      }
                      className="mt-2"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Colors Section */}
        <AccordionItem value="colors">
          <AccordionTrigger className="text-lg font-medium">
            Colors
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <Label>Theme Mode</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Switch
                    checked={darkMode}
                    onCheckedChange={(checked) =>
                      updateStyle(["darkMode"], checked)
                    }
                    id="dark-mode"
                  />
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label>Primary Color</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full mt-1 flex justify-between items-center"
                      >
                        <span>Select color</span>
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: colors.primary }}
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <ColorPicker
                        color={colors.primary}
                        onChange={(color) =>
                          updateStyle(["colors", "primary"], color)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Secondary Color</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full mt-1 flex justify-between items-center"
                      >
                        <span>Select color</span>
                        <div
                          className="w-6 h-6 rounded"
                          style={{
                            backgroundColor: colors.secondary || "#38bdf8",
                          }}
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <ColorPicker
                        color={colors.secondary || "#38bdf8"}
                        onChange={(color) =>
                          updateStyle(["colors", "secondary"], color)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Accent Color</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full mt-1 flex justify-between items-center"
                      >
                        <span>Select color</span>
                        <div
                          className="w-6 h-6 rounded"
                          style={{
                            backgroundColor: colors.accent || "#f43f5e",
                          }}
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <ColorPicker
                        color={colors.accent || "#f43f5e"}
                        onChange={(color) =>
                          updateStyle(["colors", "accent"], color)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label>Background Color</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full mt-1 flex justify-between items-center"
                      >
                        <span>Select color</span>
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: colors.background }}
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <ColorPicker
                        color={colors.background}
                        onChange={(color) =>
                          updateStyle(["colors", "background"], color)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Text Color</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full mt-1 flex justify-between items-center"
                      >
                        <span>Select color</span>
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: colors.text }}
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <ColorPicker
                        color={colors.text}
                        onChange={(color) =>
                          updateStyle(["colors", "text"], color)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Use Gradient Background</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Switch
                      checked={styles.useGradient || false}
                      onCheckedChange={(checked) =>
                        updateStyle(["useGradient"], checked)
                      }
                      id="use-gradient"
                    />
                    <Label htmlFor="use-gradient">Enable Gradient</Label>
                  </div>

                  {styles.useGradient && (
                    <div className="mt-3 space-y-2">
                      <Label>Gradient End Color</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full mt-1 flex justify-between items-center"
                          >
                            <span>Select color</span>
                            <div
                              className="w-6 h-6 rounded"
                              style={{
                                backgroundColor:
                                  colors.gradientEnd || "#4f46e5",
                              }}
                            />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64">
                          <ColorPicker
                            color={colors.gradientEnd || "#4f46e5"}
                            onChange={(color) =>
                              updateStyle(["colors", "gradientEnd"], color)
                            }
                          />
                        </PopoverContent>
                      </Popover>

                      <div>
                        <Label>
                          Gradient Direction ({styles.gradientAngle || "45"}°)
                        </Label>
                        <Slider
                          value={[parseInt(styles.gradientAngle || "45")]}
                          min={0}
                          max={360}
                          step={15}
                          onValueChange={([value]) =>
                            updateStyle(["gradientAngle"], value.toString())
                          }
                          className="mt-2"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Layout Section */}
        <AccordionItem value="layout">
          <AccordionTrigger className="text-lg font-medium">
            Layout
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <Label>
                  Container Width (max {styles.maxContainerWidth || "1200"}px)
                </Label>
                <Slider
                  value={[parseInt(styles.maxContainerWidth || "1200")]}
                  min={800}
                  max={1600}
                  step={50}
                  onValueChange={([value]) =>
                    updateStyle(["maxContainerWidth"], value.toString())
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Section Spacing</Label>
                <Select
                  value={spacing}
                  onValueChange={(value) => updateStyle(["spacing"], value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select spacing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Border Radius ({borderRadius}rem)</Label>
                <Slider
                  value={[parseFloat(borderRadius)]}
                  min={0}
                  max={1.5}
                  step={0.125}
                  onValueChange={([value]) =>
                    updateStyle(["borderRadius"], value.toString())
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Content Alignment</Label>
                <Select
                  value={styles.contentAlignment || "center"}
                  onValueChange={(value) =>
                    updateStyle(["contentAlignment"], value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select alignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>
                  Section Padding ({styles.sectionPadding || "4"}rem)
                </Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <Label className="text-xs">Desktop</Label>
                    <Slider
                      value={[parseFloat(styles.sectionPadding || "4")]}
                      min={1}
                      max={8}
                      step={0.5}
                      onValueChange={([value]) =>
                        updateStyle(["sectionPadding"], value.toString())
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Mobile</Label>
                    <Slider
                      value={[parseFloat(styles.sectionPaddingMobile || "2")]}
                      min={0.5}
                      max={4}
                      step={0.5}
                      onValueChange={([value]) =>
                        updateStyle(["sectionPaddingMobile"], value.toString())
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Effects & Animation Section */}
        <AccordionItem value="effects">
          <AccordionTrigger className="text-lg font-medium">
            Effects & Animation
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <Label>Animation Style</Label>
                <Select
                  value={animation}
                  onValueChange={(value) => updateStyle(["animation"], value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select animation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="fade">Fade</SelectItem>
                    <SelectItem value="slide">Slide</SelectItem>
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="bounce">Bounce</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>
                  Animation Speed ({styles.animationSpeed || "0.5"}s)
                </Label>
                <Slider
                  value={[parseFloat(styles.animationSpeed || "0.5")]}
                  min={0.1}
                  max={2}
                  step={0.1}
                  onValueChange={([value]) =>
                    updateStyle(["animationSpeed"], value.toString())
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Button Hover Effect</Label>
                <Select
                  value={styles.buttonHoverEffect || "scale"}
                  onValueChange={(value) =>
                    updateStyle(["buttonHoverEffect"], value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select effect" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="scale">Scale</SelectItem>
                    <SelectItem value="glow">Glow</SelectItem>
                    <SelectItem value="lift">Lift (Shadow)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Enable Shadows</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Switch
                    checked={styles.enableShadows || false}
                    onCheckedChange={(checked) =>
                      updateStyle(["enableShadows"], checked)
                    }
                    id="enable-shadows"
                  />
                  <Label htmlFor="enable-shadows">
                    Add subtle shadows to elements
                  </Label>
                </div>
              </div>

              <div>
                <Label>Image Effects</Label>
                <Select
                  value={styles.imageEffect || "none"}
                  onValueChange={(value) => updateStyle(["imageEffect"], value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select effect" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                    <SelectItem value="circle">Circle</SelectItem>
                    <SelectItem value="shadow">Shadow</SelectItem>
                    <SelectItem value="border">Border</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
