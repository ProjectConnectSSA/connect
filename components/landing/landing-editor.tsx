"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ImageUpload } from "@/components/emails/image-upload";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  Plus,
  Trash2,
  GripVertical,
  Layout,
  Type,
  Grid,
  Image,
} from "lucide-react";

interface LandingEditorProps {
  content: any;
  setContent: (content: any) => void;
}

export function LandingEditor({ content, setContent }: LandingEditorProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const updateSection = (index: number, updates: any) => {
    const newSections = [...content.sections];
    newSections[index] = { ...newSections[index], ...updates };
    setContent({
      ...content,
      sections: newSections,
    });
  };

  const addSection = (type: string) => {
    const newSection = {
      id: Date.now().toString(),
      type,
      content: {
        ...(type === "hero" && {
          heading: "New Hero Section",
          subheading: "Add your subheading here",
          image: "",
          cta: {
            text: "Get Started",
            url: "#",
          },
        }),
        ...(type === "features" && {
          heading: "Features",
          items: [
            {
              title: "Feature 1",
              description: "Description here",
              icon: "Zap",
            },
          ],
        }),
        ...(type === "content" && {
          heading: "Content Section",
          body: "Add your content here",
          image: "",
          alignment: "left",
        }),
        ...(type === "footer" && {
          heading: "Footer",
          companyName: "Your Company",
          tagline: "Your company tagline here",
          links: [
            { label: "Home", url: "#" },
            { label: "About", url: "#" },
            { label: "Services", url: "#" },
            { label: "Contact", url: "#" },
          ],
          socialLinks: [
            { platform: "Twitter", url: "#", icon: "Twitter" },
            { platform: "Facebook", url: "#", icon: "Facebook" },
            { platform: "Instagram", url: "#", icon: "Instagram" },
          ],
          copyright: `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
        }),
      },
    };

    setContent({
      ...content,
      sections: [...content.sections, newSection],
    });
    setSelectedSection(`section-${content.sections.length}`);
  };

  const removeSection = (index: number) => {
    const newSections = content.sections.filter(
      (_: any, i: number) => i !== index
    );
    setContent({
      ...content,
      sections: newSections,
    });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const sections = Array.from(content.sections);
    const [reorderedSection] = sections.splice(result.source.index, 1);
    sections.splice(result.destination.index, 0, reorderedSection);

    setContent({
      ...content,
      sections: sections,
    });
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <Accordion
        type="single"
        collapsible
        value={selectedSection}
        onValueChange={setSelectedSection}
        className="space-y-6"
      >
        <AccordionItem value="page-settings" className="border rounded-lg">
          <AccordionTrigger className="px-4">Page Settings</AccordionTrigger>
          <AccordionContent className="space-y-4 p-4">
            <div className="space-y-2">
              <Label>Page Title</Label>
              <Input
                value={content.title}
                onChange={(e) =>
                  setContent({ ...content, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={content.description}
                onChange={(e) =>
                  setContent({ ...content, description: e.target.value })
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Page Sections</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addSection("hero")}
              >
                <Layout className="mr-2 h-4 w-4" />
                Add Hero
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addSection("features")}
              >
                <Grid className="mr-2 h-4 w-4" />
                Add Features
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addSection("content")}
              >
                <Type className="mr-2 h-4 w-4" />
                Add Content
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addSection("footer")}
              >
                <Layout className="mr-2 h-4 w-4" />
                Add Footer
              </Button>
            </div>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {content.sections.map((section: any, index: number) => (
                    <Draggable
                      key={section.id}
                      draggableId={section.id}
                      index={index}
                    >
                      {(provided) => (
                        <AccordionItem
                          value={`section-${index}`}
                          className="border rounded-lg mb-2"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <div className="flex items-center">
                            <div {...provided.dragHandleProps} className="px-2">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <AccordionTrigger className="flex-1 px-4">
                              {section.type === "hero" && (
                                <div className="flex items-center gap-2">
                                  <Layout className="h-4 w-4" />
                                  Hero Section
                                </div>
                              )}
                              {section.type === "features" && (
                                <div className="flex items-center gap-2">
                                  <Grid className="h-4 w-4" />
                                  Features Section
                                </div>
                              )}
                              {section.type === "content" && (
                                <div className="flex items-center gap-2">
                                  <Type className="h-4 w-4" />
                                  Content Section
                                </div>
                              )}
                              {section.type === "footer" && (
                                <div className="flex items-center gap-2">
                                  <Layout className="h-4 w-4" />
                                  Footer Section
                                </div>
                              )}
                            </AccordionTrigger>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeSection(index)}
                              className="mr-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <AccordionContent className="space-y-4 p-4">
                            {section.type === "hero" && (
                              <>
                                <div className="space-y-2">
                                  <Label>Heading</Label>
                                  <Input
                                    value={section.content.heading}
                                    onChange={(e) =>
                                      updateSection(index, {
                                        content: {
                                          ...section.content,
                                          heading: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Subheading</Label>
                                  <Input
                                    value={section.content.subheading}
                                    onChange={(e) =>
                                      updateSection(index, {
                                        content: {
                                          ...section.content,
                                          subheading: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Hero Image</Label>
                                  <ImageUpload
                                    value={section.content.image}
                                    onChange={(url) =>
                                      updateSection(index, {
                                        content: {
                                          ...section.content,
                                          image: url,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>CTA Text</Label>
                                  <Input
                                    value={section.content.cta.text}
                                    onChange={(e) =>
                                      updateSection(index, {
                                        content: {
                                          ...section.content,
                                          cta: {
                                            ...section.content.cta,
                                            text: e.target.value,
                                          },
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>CTA URL</Label>
                                  <Input
                                    value={section.content.cta.url}
                                    onChange={(e) =>
                                      updateSection(index, {
                                        content: {
                                          ...section.content,
                                          cta: {
                                            ...section.content.cta,
                                            url: e.target.value,
                                          },
                                        },
                                      })
                                    }
                                  />
                                </div>
                              </>
                            )}

                            {section.type === "features" && (
                              <>
                                <div className="space-y-2">
                                  <Label>Section Heading</Label>
                                  <Input
                                    value={section.content.heading}
                                    onChange={(e) =>
                                      updateSection(index, {
                                        content: {
                                          ...section.content,
                                          heading: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-4">
                                  {section.content.items.map(
                                    (item: any, itemIndex: number) => (
                                      <div
                                        key={itemIndex}
                                        className="space-y-4 border-t pt-4"
                                      >
                                        <div className="flex items-center justify-between">
                                          <h4 className="font-medium">
                                            Feature {itemIndex + 1}
                                          </h4>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                              const newItems =
                                                section.content.items.filter(
                                                  (_: any, i: number) =>
                                                    i !== itemIndex
                                                );
                                              updateSection(index, {
                                                content: {
                                                  ...section.content,
                                                  items: newItems,
                                                },
                                              });
                                            }}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Title</Label>
                                          <Input
                                            value={item.title}
                                            onChange={(e) => {
                                              const newItems = [
                                                ...section.content.items,
                                              ];
                                              newItems[itemIndex] = {
                                                ...item,
                                                title: e.target.value,
                                              };
                                              updateSection(index, {
                                                content: {
                                                  ...section.content,
                                                  items: newItems,
                                                },
                                              });
                                            }}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Description</Label>
                                          <Textarea
                                            value={item.description}
                                            onChange={(e) => {
                                              const newItems = [
                                                ...section.content.items,
                                              ];
                                              newItems[itemIndex] = {
                                                ...item,
                                                description: e.target.value,
                                              };
                                              updateSection(index, {
                                                content: {
                                                  ...section.content,
                                                  items: newItems,
                                                },
                                              });
                                            }}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Icon</Label>
                                          <Select
                                            value={item.icon}
                                            onValueChange={(value) => {
                                              const newItems = [
                                                ...section.content.items,
                                              ];
                                              newItems[itemIndex] = {
                                                ...item,
                                                icon: value,
                                              };
                                              updateSection(index, {
                                                content: {
                                                  ...section.content,
                                                  items: newItems,
                                                },
                                              });
                                            }}
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="Zap">
                                                Lightning
                                              </SelectItem>
                                              <SelectItem value="Shield">
                                                Shield
                                              </SelectItem>
                                              <SelectItem value="Star">
                                                Star
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    )
                                  )}
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      const newItems = [
                                        ...section.content.items,
                                        {
                                          title: "New Feature",
                                          description: "Description here",
                                          icon: "Zap",
                                        },
                                      ];
                                      updateSection(index, {
                                        content: {
                                          ...section.content,
                                          items: newItems,
                                        },
                                      });
                                    }}
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Feature
                                  </Button>
                                </div>
                              </>
                            )}

                            {section.type === "content" && (
                              <>
                                <div className="space-y-2">
                                  <Label>Heading</Label>
                                  <Input
                                    value={section.content.heading}
                                    onChange={(e) =>
                                      updateSection(index, {
                                        content: {
                                          ...section.content,
                                          heading: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Body</Label>
                                  <Textarea
                                    value={section.content.body}
                                    onChange={(e) =>
                                      updateSection(index, {
                                        content: {
                                          ...section.content,
                                          body: e.target.value,
                                        },
                                      })
                                    }
                                    rows={6}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Image</Label>
                                  <ImageUpload
                                    value={section.content.image}
                                    onChange={(url) =>
                                      updateSection(index, {
                                        content: {
                                          ...section.content,
                                          image: url,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Image Alignment</Label>
                                  <Select
                                    value={section.content.alignment}
                                    onValueChange={(value) =>
                                      updateSection(index, {
                                        content: {
                                          ...section.content,
                                          alignment: value,
                                        },
                                      })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="left">Left</SelectItem>
                                      <SelectItem value="right">
                                        Right
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </>
                            )}

                            {section.type === "footer" && (
                              <>
                                <div className="space-y-2">
                                  <Label>Heading</Label>
                                  <Input
                                    value={section.content.heading}
                                    onChange={(e) =>
                                      updateSection(index, {
                                        content: {
                                          ...section.content,
                                          heading: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Company Name</Label>
                                  <Input
                                    value={section.content.companyName}
                                    onChange={(e) =>
                                      updateSection(index, {
                                        content: {
                                          ...section.content,
                                          companyName: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Tagline</Label>
                                  <Input
                                    value={section.content.tagline}
                                    onChange={(e) =>
                                      updateSection(index, {
                                        content: {
                                          ...section.content,
                                          tagline: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Copyright</Label>
                                  <Input
                                    value={section.content.copyright}
                                    onChange={(e) =>
                                      updateSection(index, {
                                        content: {
                                          ...section.content,
                                          copyright: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                              </>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </Accordion>
    </div>
  );
}
