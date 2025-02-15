"use client";

import React from "react";
import { FormEditor } from "../form-editor";
import { FormCanvasTraditional } from "./FormCanvasTraditional";
import { FormCanvasTypeform } from "./FormCanvasTypeform";
import { FormCanvasCard } from "./FormCanvasCard";
import { Form } from "./FormCanvasTraditional"; // shared interface

interface FormContainerProps {
  form: Form;
  setForm: (form: Form) => void;
}

export function FormContainer({ form, setForm }: FormContainerProps) {
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
  const [selectedElement, setSelectedElement] = React.useState<any>(null);

  const renderCanvas = () => {
    switch (form.formType) {
      case "typeform":
        return (
          <FormCanvasTypeform
            form={form}
            setForm={setForm}
            currentPageIndex={currentPageIndex}
            setCurrentPageIndex={setCurrentPageIndex}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
          />
        );
      case "card":
        return (
          <FormCanvasCard
            form={form}
            setForm={setForm}
            currentPageIndex={currentPageIndex}
            setCurrentPageIndex={setCurrentPageIndex}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
          />
        );
      case "traditional":
      default:
        return (
          <div className="flex-1 bg-gray-200 rounded p-2 overflow-auto">
            <FormCanvasTraditional
              form={form}
              setForm={setForm}
              selectedElement={selectedElement}
              setSelectedElement={setSelectedElement}
              currentPageIndex={currentPageIndex}
              setCurrentPageIndex={setCurrentPageIndex}
            />
          </div>
        );
    }
  };

  return (
    <div className="flex gap-8">
      <div className="w-2/3">{renderCanvas()}</div>
    </div>
  );
}
