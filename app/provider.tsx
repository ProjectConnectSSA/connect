"use client";
import { DragDropLayoutElement } from "@/components/context/DragDropLayoutElement";
import { EmailTemplateContext } from "@/components/emails/EmailTemplateContext";
import { SelectedElementContext, SelectedElementType } from "../components/context/SelectedElementContext";
import React, { ReactNode, useState, useContext, useEffect } from "react";

export default function Provider({ children }: { children: ReactNode }) {
  const [screenSize, setScreenSize] = useState<string>("desktop");
  const [dragDropLayoutElement, setDragDropLayoutElement] = useState<any>();
  const [emailTemplate, setEmailTemplate] = useState<any[]>([]);
  const [selectedElement, setSelectedElement] = useState<SelectedElementType | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedTemplate = localStorage.getItem("emailTemplate");
        if (storedTemplate) {
          const parsed = JSON.parse(storedTemplate);
          setEmailTemplate(Array.isArray(parsed) ? parsed : []);
        } else {
          setEmailTemplate([]);
        }
      } catch (error) {
        console.error("Error parsing template from localStorage:", error);
        setEmailTemplate([]);
      }
    }
  }, []);

  return (
    <EmailTemplateContext.Provider value={{ emailTemplate, setEmailTemplate }}>
      <SelectedElementContext.Provider value={{ selectedElement, setSelectedElement }}>
        <DragDropLayoutElement.Provider value={{ dragDropLayoutElement, setDragDropLayoutElement }}>
          {children}
        </DragDropLayoutElement.Provider>
      </SelectedElementContext.Provider>
    </EmailTemplateContext.Provider>
  );
}

export { ScreenSizeProvider, useScreenSize } from './ScreenSizeContext';
export { SelectedElementProvider, useSelectedElement } from './SelectedElementContext';

export const useDragDropLayoutElement = () => {
  const context = useContext(DragDropLayoutElement);
  if (!context) {
    throw new Error("useDragDropLayoutElement must be used within a DragDropLayoutElement.Provider");
  }
  return context;
};

export const useEmailTemplate = () => {
  const context = useContext(EmailTemplateContext);
  if (!context) {
    throw new Error("useEmailTemplate must be used within an EmailTemplateProvider");
  }
  return context;
};