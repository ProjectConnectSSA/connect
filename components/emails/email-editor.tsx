"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { ImageUpload } from "@/components/emails/image-upload";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { 
  Layout, 
  Type, 
  Columns, 
  Plus, 
  Trash2, 
  GripVertical,
  Image,
  ShoppingCart,
  SeparatorHorizontal,
  MousePointerClick,
  Share2,
  Table,
  Quote,
  Video,
  Clock,
  MapPin
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator as SeparatorUI } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { EmailContent } from "@/types/email";

interface EmailEditorProps {
  content: EmailContent;
  setContent: (content: EmailContent) => void;
}

const ELEMENT_TYPES = [
  {
    category: "Basic",
    items: [
      { id: "hero", label: "Hero Section", icon: Layout },
      { id: "text", label: "Text Block", icon: Type },
      { id: "columns", label: "Columns", icon: Columns },
      { id: "image", label: "Image", icon: Image },
      { id: "button", label: "Button", icon: MousePointerClick },
      { id: "divider", label: "Divider", icon: SeparatorHorizontal }
    ]
  },
  {
    category: "Commerce",
    items: [
      { id: "product", label: "Product Card", icon: ShoppingCart },
      { id: "productGrid", label: "Product Grid", icon: Table },
      { id: "pricing", label: "Pricing Table", icon: Clock }
    ]
  },
  {
    category: "Media",
    items: [
      { id: "video", label: "Video", icon: Video },
      { id: "quote", label: "Testimonial", icon: Quote },
      { id: "social", label: "Social Links", icon: Share2 },
      { id: "map", label: "Map", icon: MapPin }
    ]
  }
];

export function EmailEditor({ content, setContent }: EmailEditorProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const updateSection = (index: number, updates: any) => {
    const newSections = [...content.content.sections];
    newSections[index] = { ...newSections[index], ...updates };
    setContent({
      ...content,
      content: { ...content.content, sections: newSections },
    });
  };

  const addSection = (type: string) => {
    const newSection = {
      id: Date.now().toString(),
      type,
      ...(type === "hero" && {
        image: "",
        title: "New Hero Section",
        subtitle: "Add your subtitle here",
        buttonText: "Click Here",
        buttonUrl: "#",
      }),
      ...(type === "text" && {
        content: "Add your content here",
      }),
      ...(type === "columns" && {
        columns: [
          {
            image: "",
            title: "Column 1",
            content: "Add content here",
          },
          {
            image: "",
            title: "Column 2",
            content: "Add content here",
          },
        ],
      }),
      ...(type === "product" && {
        image: "",
        title: "Product Name",
        description: "Product description",
        price: "$99.99",
        buttonText: "Buy Now",
        buttonUrl: "#"
      }),
      ...(type === "divider" && {
        style: "solid",
        color: content.styles.dividerColor,
        width: "1"
      })
    };

    setContent({
      ...content,
      content: {
        ...content.content,
        sections: [...content.content.sections, newSection],
      },
    });
    setSelectedSection(`section-${content.content.sections.length}`);
  };

  const removeSection = (index: number) => {
    const newSections = content.content.sections.filter((_: any, i: number) => i !== index);
    setContent({
      ...content,
      content: { ...content.content, sections: newSections },
    });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const sections = Array.from(content.content.sections);
    const [reorderedSection] = sections.splice(result.source.index, 1);
    sections.splice(result.destination.index, 0, reorderedSection);

    setContent({
      ...content,
      content: { ...content.content, sections: sections },
    });
  };

  return (
    <div className="grid grid-cols-[250px,1fr] h-full divide-x">
      {/* Elements Panel */}
      <div className="p-4 bg-muted/10">
        <h3 className="font-semibold mb-4">Add Elements</h3>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-6">
            {ELEMENT_TYPES.map((category) => (
              <div key={category.category}>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  {category.category}
                </h4>
                <div className="grid gap-2">
                  {category.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant="outline"
                        className="justify-start w-full"
                        onClick={() => addSection(item.id)}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
                <SeparatorUI className="my-4" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Content Editor */}
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-6">
          <Accordion
            type="single"
            collapsible
            value={selectedSection || undefined}
            onValueChange={setSelectedSection}
            className="space-y-6"
          >
            <AccordionItem value="email-settings" className="border rounded-lg">
              <AccordionTrigger className="px-4">Email Settings</AccordionTrigger>
              <AccordionContent className="space-y-4 p-4">
                <div className="space-y-2">
                  <Label>Email Subject</Label>
                  <Input
                    value={content.subject}
                    onChange={(e) =>
                      setContent({ ...content, subject: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preheader Text</Label>
                  <Input
                    value={content.preheader}
                    onChange={(e) =>
                      setContent({ ...content, preheader: e.target.value })
                    }
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="header" className="border rounded-lg">
              <AccordionTrigger className="px-4">Header</AccordionTrigger>
              <AccordionContent className="space-y-4 p-4">
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <ImageUpload
                    value={content.content.header.logo}
                    onChange={(url) =>
                      setContent({
                        ...content,
                        content: {
                          ...content.content,
                          header: { ...content.content.header, logo: url },
                        },
                      })
                    }
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {content.content.sections.map((section: any, index: number) => (
                      <Draggable
                        key={section.id || index}
                        draggableId={section.id || `section-${index}`}
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
                              <div
                                {...provided.dragHandleProps}
                                className="px-2"
                              >
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <AccordionTrigger className="flex-1 px-4">
                                {section.type === "hero" && (
                                  <div className="flex items-center gap-2">
                                    <Layout className="h-4 w-4" />
                                    Hero Section
                                  </div>
                                )}
                                {section.type === "text" && (
                                  <div className="flex items-center gap-2">
                                    <Type className="h-4 w-4" />
                                    Text Section
                                  </div>
                                )}
                                {section.type === "columns" && (
                                  <div className="flex items-center gap-2">
                                    <Columns className="h-4 w-4" />
                                    Columns Section
                                  </div>
                                )}
                                {section.type === "product" && (
                                  <div className="flex items-center gap-2">
                                    <ShoppingCart className="h-4 w-4" />
                                    Product Section
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
                              {/* Section specific content editors */}
                              {section.type === "hero" && (
                                <>
                                  <div className="space-y-2">
                                    <Label>Hero Image</Label>
                                    <ImageUpload
                                      value={section.image}
                                      onChange={(url) =>
                                        updateSection(index, { image: url })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                      value={section.title}
                                      onChange={(e) =>
                                        updateSection(index, {
                                          title: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Subtitle</Label>
                                    <Input
                                      value={section.subtitle}
                                      onChange={(e) =>
                                        updateSection(index, {
                                          subtitle: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Button Text</Label>
                                    <Input
                                      value={section.buttonText}
                                      onChange={(e) =>
                                        updateSection(index, {
                                          buttonText: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Button URL</Label>
                                    <Input
                                      value={section.buttonUrl}
                                      onChange={(e) =>
                                        updateSection(index, {
                                          buttonUrl: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                </>
                              )}

                              {section.type === "text" && (
                                <div className="space-y-2">
                                  <Label>Content</Label>
                                  <Textarea
                                    value={section.content}
                                    onChange={(e) =>
                                      updateSection(index, {
                                        content: e.target.value,
                                      })
                                    }
                                    rows={6}
                                  />
                                </div>
                              )}

                              {section.type === "columns" && (
                                <div className="space-y-4">
                                  {section.columns.map(
                                    (column: any, colIndex: number) => (
                                      <div
                                        key={colIndex}
                                        className="space-y-4 border-t pt-4"
                                      >
                                        <h4 className="font-medium">
                                          Column {colIndex + 1}
                                        </h4>
                                        <div className="space-y-2">
                                          <Label>Image</Label>
                                          <ImageUpload
                                            value={column.image}
                                            onChange={(url) => {
                                              const newColumns = [
                                                ...section.columns,
                                              ];
                                              newColumns[colIndex] = {
                                                ...column,
                                                image: url,
                                              };
                                              updateSection(index, {
                                                columns: newColumns,
                                              });
                                            }}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Title</Label>
                                          <Input
                                            value={column.title}
                                            onChange={(e) => {
                                              const newColumns = [
                                                ...section.columns,
                                              ];
                                              newColumns[colIndex] = {
                                                ...column,
                                                title: e.target.value,
                                              };
                                              updateSection(index, {
                                                columns: newColumns,
                                              });
                                            }}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Content</Label>
                                          <Textarea
                                            value={column.content}
                                            onChange={(e) => {
                                              const newColumns = [
                                                ...section.columns,
                                              ];
                                              newColumns[colIndex] = {
                                                ...column,
                                                content: e.target.value,
                                              };
                                              updateSection(index, {
                                                columns: newColumns,
                                              });
                                            }}
                                          />
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}

                              {section.type === "product" && (
                                <>
                                  <div className="space-y-2">
                                    <Label>Product Image</Label>
                                    <ImageUpload
                                      value={section.image}
                                      onChange={(url) =>
                                        updateSection(index, { image: url })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Product Name</Label>
                                    <Input
                                      value={section.title}
                                      onChange={(e) =>
                                        updateSection(index, {
                                          title: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                      value={section.description}
                                      onChange={(e) =>
                                        updateSection(index, {
                                          description: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Price</Label>
                                    <Input
                                      value={section.price}
                                      onChange={(e) =>
                                        updateSection(index, {
                                          price: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Button Text</Label>
                                    <Input
                                      value={section.buttonText}
                                      onChange={(e) =>
                                        updateSection(index, {
                                          buttonText: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Button URL</Label>
                                    <Input
                                      value={section.buttonUrl}
                                      onChange={(e) =>
                                        updateSection(index, {
                                          buttonUrl: e.target.value,
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

            <AccordionItem value="footer" className="border rounded-lg">
              <AccordionTrigger className="px-4">Footer</AccordionTrigger>
              <AccordionContent className="space-y-4 p-4">
                <div className="space-y-2">
                  <Label>Company Address</Label>
                  <Input
                    value={content.content.footer.companyAddress}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        content: {
                          ...content.content,
                          footer: {
                            ...content.content.footer,
                            companyAddress: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unsubscribe URL</Label>
                  <Input
                    value={content.content.footer.unsubscribeUrl}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        content: {
                          ...content.content,
                          footer: {
                            ...content.content.footer,
                            unsubscribeUrl: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}