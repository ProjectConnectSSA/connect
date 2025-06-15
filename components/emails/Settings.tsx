'use client';
import { useEmailTemplate, useSelectedElement } from '@/app/provider';
import React, { useEffect, useState } from 'react';
import InputFields from './Settings/InputFields';
import StyleFields from './Settings/StyleFields';
import SocialIconsFields from './Settings/SocialIconsFields';

export default function Settings() {
  type LayoutElementType = {
    id: string;
    [key: string]: any;
  };

  type SelectedElementType = {
    layout?: LayoutElementType[];
    index?: number;
    columnIndex?: number;
  };

  const { selectedElement, setSelectedElement } = useSelectedElement() as {
    selectedElement: SelectedElementType;
    setSelectedElement: (el: SelectedElementType) => void;
  };

  const { emailTemplate, setEmailTemplate } = useEmailTemplate();

  const [element, setElement] = useState<LayoutElementType | null>(null);

  useEffect(() => {
    if (
      selectedElement?.layout &&
      Array.isArray(selectedElement.layout) &&
      typeof selectedElement.index === 'number' &&
      selectedElement.layout[selectedElement.index]
    ) {
      setElement(selectedElement.layout[selectedElement.index]);
    } else {
      setElement(null);
    }
  }, [selectedElement]);

  // Update a simple field
  const onHandleInputChange = (fieldName: string, value: string) => {
    updateElement({ [fieldName]: value });
  };

  // Update a style field
  const onStyleChange = (styleKey: string, value: string) => {
    updateElement({ style: { ...element?.style, [styleKey]: value } });
  };

  // Update an outerStyle field
  const onOuterStyleChange = (styleKey: string, value: string) => {
    updateElement({ outerStyle: { ...element?.outerStyle, [styleKey]: value } });
  };

  // Update a social icon field
  const onSocialIconChange = (idx: number, key: string, value: string) => {
    if (!element?.socialIcons) return;
    const updatedIcons = element.socialIcons.map((icon: any, i: number) =>
      i === idx ? { ...icon, [key]: value } : icon
    );
    updateElement({ socialIcons: updatedIcons });
  };

  // Add a new social icon
  const onAddSocialIcon = () => {
    updateElement({
      socialIcons: [...(element?.socialIcons || []), { icon: '', url: '' }],
    });
  };

  // Delete a social icon
  const onDeleteSocialIcon = (idx: number) => {
    if (!element?.socialIcons) return;
    const updatedIcons = element.socialIcons.filter((_: any, i: number) => i !== idx);
    updateElement({ socialIcons: updatedIcons });
  };

  // General update function
  function updateElement(changes: Record<string, any>) {
    if (
      selectedElement?.layout &&
      Array.isArray(selectedElement.layout) &&
      typeof selectedElement.index === 'number' &&
      selectedElement.layout[selectedElement.index] !== undefined &&
      typeof selectedElement.columnIndex === 'number'
    ) {
      const updatedLayout = [...selectedElement.layout];
      updatedLayout[selectedElement.index] = {
        ...updatedLayout[selectedElement.index],
        ...changes,
      };

      setSelectedElement({
        ...selectedElement,
        layout: updatedLayout,
      });

      setEmailTemplate((prevTemplate: any[]) => {
        const newTemplate = [...prevTemplate];
        const columnIndex = selectedElement.columnIndex!;
        if (newTemplate[columnIndex]) {
          newTemplate[columnIndex] = {
            ...newTemplate[columnIndex],
            [selectedElement.index!]: updatedLayout[selectedElement.index!],
          };
        }
        return newTemplate;
      });
    }
  }

  // Dynamically render all editable fields
  function renderFields() {
    if (!element) return null;
    const ignoreFields = ['id', 'icon', 'type', 'label'];
    return (
      <>
        {Object.entries(element).map(([key, value]) => {
          if (ignoreFields.includes(key)) return null;
          if (key === 'style' && typeof value === 'object') {
            return (
              <StyleFields
                key="style"
                style={value}
                onChange={onStyleChange}
                label="Style"
              />
            );
          }
          if (key === 'outerStyle' && typeof value === 'object') {
            return (
              <StyleFields
                key="outerStyle"
                style={value}
                onChange={onOuterStyleChange}
                label="Outer Style"
              />
            );
          }
          if (key === 'socialIcons' && Array.isArray(value)) {
            return (
              <SocialIconsFields
                key="socialIcons"
                socialIcons={value}
                onChange={onSocialIconChange}
                onAdd={onAddSocialIcon}
                onDelete={onDeleteSocialIcon}
              />
            );
          }
          // For all other primitive fields (string, number)
          if (typeof value === 'string' || typeof value === 'number') {
            return (
              <InputFields
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={String(value)}
                onHandleInputChange={(v: string) => onHandleInputChange(key, v)}
              />
            );
          }
          return null;
        })}
      </>
    );
  }

  return (
    <div
      className="p-5 h-screen shadow-md overflow-y-auto"
      style={{ maxHeight: '100vh' }}
    >
      <h2 className="font-bold text-lg mb-4">Settings</h2>
      {element ? renderFields() : <div className="text-gray-400">Select an element to edit its settings.</div>}
    </div>
  );
}
