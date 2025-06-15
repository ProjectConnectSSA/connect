"use client";
import React from 'react';
import { useSelectedElement } from '@/app/provider';
import { useEmailTemplateContext } from './EmailTemplateContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { InputFields } from './Settings/InputFields';
import { StyleFields } from './Settings/StyleFields';
import { SocialIconsFields } from './Settings/SocialIconsFields';

export default function PropertiesSidebar() {
  const { selectedElement, setSelectedElement } = useSelectedElement();
  const { emailTemplate, setEmailTemplate } = useEmailTemplateContext();

  if (!selectedElement) {
    return (
      <div className="w-80 border-l bg-white p-4 overflow-y-auto h-full">
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <p className="text-center">No element selected</p>
          <p className="text-sm text-center mt-2">Click on an element to edit its properties</p>
        </div>
      </div>
    );
  }

  const updateElement = (newProps: any) => {
    if (!selectedElement) return;

    const { columnIndex, index } = selectedElement;
    
    // Find the layout in the emailTemplate
    const layoutToUpdate = emailTemplate[columnIndex];
    
    if (!layoutToUpdate) return;
    
    // Get the current element
    const currentElement = layoutToUpdate[index] || {};
    
    // Merge the new properties with the current element
    const updatedElement = { ...currentElement };
    
    // Handle nested style and outerStyle objects
    if (newProps.style) {
      updatedElement.style = { ...updatedElement.style, ...newProps.style };
      delete newProps.style;
    }
    
    if (newProps.outerStyle) {
      updatedElement.outerStyle = { ...updatedElement.outerStyle, ...newProps.outerStyle };
      delete newProps.outerStyle;
    }
    
    // Merge the remaining properties
    Object.assign(updatedElement, newProps);
    
    // Update the email template
    const updatedEmailTemplate = [...emailTemplate];
    updatedEmailTemplate[columnIndex] = {
      ...layoutToUpdate,
      [index]: updatedElement,
    };
    
    setEmailTemplate(updatedEmailTemplate);
  };

  const deleteElement = () => {
    if (!selectedElement) return;

    const { columnIndex, index } = selectedElement;
    
    // Find the layout in the emailTemplate
    const layoutToUpdate = emailTemplate[columnIndex];
    
    if (!layoutToUpdate) return;
    
    // Create a copy of the layout without the element at the specified index
    const updatedLayout = { ...layoutToUpdate };
    delete updatedLayout[index];
    
    // Update the email template
    const updatedEmailTemplate = [...emailTemplate];
    updatedEmailTemplate[columnIndex] = updatedLayout;
    
    setEmailTemplate(updatedEmailTemplate);
    setSelectedElement(null);
  };

  // Get the selected element from the layout
  const element = selectedElement ? 
    emailTemplate[selectedElement.columnIndex]?.[selectedElement.index] : 
    null;

  if (!element) {
    return (
      <div className="w-80 border-l bg-white p-4 overflow-y-auto h-full">
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <p className="text-center">Selected element not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-l bg-white overflow-y-auto h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold text-lg">{element.label || element.type} Properties</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={deleteElement}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
      
      <div className="p-4">
        <Tabs defaultValue="content">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
            <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content">
            {element.type === 'SocialIcons' ? (
              <SocialIconsFields element={element} onChange={updateElement} />
            ) : (
              <InputFields element={element} onChange={updateElement} />
            )}
          </TabsContent>
          
          <TabsContent value="style">
            <StyleFields element={element} onChange={updateElement} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}