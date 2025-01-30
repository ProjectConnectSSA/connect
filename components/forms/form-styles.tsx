import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
interface FormStylesProps {
  form: Form;
  setForm: (form: Form) => void;
  currentPageIndex: number;
  selectedElement: any;
}

interface Form {
  title: string;
  description: string;
  pages: Pages[];
}

interface Pages {
  id: string;
  title: string;
  elements: Elements[];
  styles?: {};
  background?: string;
}

interface Elements {
  id: string;
  title: string;
  styles: {
    backgroundColor?: string;
    width?: string;
    height?: string;
  };
  type: string;
  required: boolean;
}

interface SelectedElement {
  element: Elements;
  pageIndex: number;
}

export function FormStyles({ form, setForm, currentPageIndex, selectedElement }: FormStylesProps) {
  const colorPalette = {
    primary: ["#FF0000", "#FF6A00", "#FFD700", "#00BF5F", "#0099FF", "#172554", "#000000"],
    neutral: ["#F5F5F5", "#E5E5E5", "#D4D4D4", "#A3A3A3", "#737373", "#404040", "#171717"],
    accent: ["#FF69B4", "#9747FF", "#00C7B0", "#FF5630", "#36B37E", "#00B8D9", "#6554C0"],
  };

  const currentPage = form.pages[currentPageIndex];

  // Update page or element background color
  const updateBackgroundColor = (color: string) => {
    if (selectedElement && selectedElement.pageIndex === currentPageIndex) {
      const updatedPages = [...form.pages];
      const elementIndex = updatedPages[currentPageIndex].elements.findIndex((el) => el.id === selectedElement.element.id);
      if (elementIndex !== -1) {
        const element = updatedPages[currentPageIndex].elements[elementIndex];
        updatedPages[currentPageIndex].elements[elementIndex] = {
          ...element,
          styles: {
            ...element.styles,
            backgroundColor: color,
          },
        };
        setForm({ ...form, pages: updatedPages });
      }
    } else {
      const updatedPages = [...form.pages];
      updatedPages[currentPageIndex] = {
        ...updatedPages[currentPageIndex],
        background: color,
      };
      setForm({ ...form, pages: updatedPages });
    }
  };

  // Update width
  const updateWidth = (width: string) => {
    console.log("width", width);
    console.log(selectedElement);
    if (selectedElement && selectedElement.pageIndex === currentPageIndex) {
      // Update the selected element's style directly
      console.log("selectedElement", selectedElement.element.styles);
      selectedElement.element.styles = {
        ...selectedElement.element.styles,
        width: width + "px",
      };

      // Trigger state update to reflect the changes
      setForm({ ...form });
      console.log("FORM", form);
    }
  };

  // Update height
  const updateHeight = (height: string) => {
    console.log(selectedElement);
    if (selectedElement && selectedElement.pageIndex === currentPageIndex) {
      // Update the selected element's style directly
      selectedElement.element.styles = {
        ...selectedElement.element.styles,
        height: height + "px",
      };

      // Trigger state update to reflect the changes
      setForm({ ...form });
    }
  };

  return (
    <Card className="border-border/40">
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Width (px)</Label>
            <Input
              type="number"
              min={200}
              max={800}
              className="border-border/40"
              onChange={(e) => updateWidth(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Height (px)</Label>
            <Input
              type="number"
              min={40}
              max={400}
              className="border-border/40"
              onChange={(e) => updateHeight(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="background-color">Page Background Color</Label>
            <Input
              type="color"
              id="background-color"
              value={currentPage.background || "#ffffff"}
              onChange={(e) => updateBackgroundColor(e.target.value)}
            />
          </div>
        </div>
        <Separator className="my-4" />
        <div className="space-y-4">
          <Label className="text-base">Background Color</Label>
          <div className="space-y-4">
            {Object.entries(colorPalette).map(([group, colors]) => (
              <div
                key={group}
                className="space-y-2">
                <Label className="text-xs capitalize text-muted-foreground">{group}</Label>
                <div className="grid grid-cols-7 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-lg border border-border/40 shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-lg"
                      style={{
                        background: color,
                      }}
                      onClick={() => updateBackgroundColor(color)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base">Opacity (%)</Label>
          <Input
            type="number"
            min={0}
            max={100}
            className="border-border/40"
          />
        </div>
      </CardContent>
    </Card>
  );
}
