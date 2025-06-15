"use client";
import React, { useState } from "react";
import { useEmailTemplateContext } from "../emails/EmailTemplateContext";
import { useDragElementLayout } from "../context/DragDropLayoutElement";
import layout from "@/app/layout";
import ButtonComponent from "../emails/Element/ButtonComponent";
import TextComponent from "../emails/Element/TextComponent";
import ImageComponent from "../emails/Element/ImageComponent";
import LogoComponent from "../emails/Element/LogoComponent";
import LogoTopComponent from "../emails/Element/LogoTopComponent";
import SocialComponent from "../emails/Element/SocialComponent";
import DividerComponent from "../emails/Element/DividerComponent";
import { useSelectedElement } from "@/app/provider";

// Extend SelectedElementType to include columnIndex
interface SelectedElementType {
  layout: any[];
  index: number;
  columnIndex: number;
}

interface ColumnLayoutProps {
  numOfCol: number;
  id: string;
  layoutIndex: number;
  onDeleteElement?: (colIdx: number) => void;
}

export default function ColumnLayout({
  numOfCol,
  id,
  layoutIndex,
  isExport = false,
}: ColumnLayoutProps & { isExport?: boolean }) {
  const [dragOver, setDragOver] = useState<{ index: number; columnId?: string } | null>(null);
  const { emailTemplate, setEmailTemplate } = useEmailTemplateContext();
  const { dragDropLayoutElement } = useDragElementLayout();
  const { selectedElement, setSelectedElement } = useSelectedElement();

  const onDragOverHandle = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    setDragOver({
      index: index,
      columnId: id,
    });
  };

  const onDropHandle = (index: number) => {
    setEmailTemplate((prevItems: any[]) =>
      prevItems?.map(col =>
        col && col.id === id
          ? { ...col, [index]: dragDropLayoutElement?.dragElement }
          : col
      )
    );
    setDragOver(null);
  }

  interface ElementType {
    type?: string;
    content?: string;
    url?: string;
    [key: string]: any;
  }

  const GetElementComponent = (element: ElementType | null | undefined) => {
    if (!element) return null;
    if (element?.type === "Button") {
      return (
        <ButtonComponent
          content={element.content}
          url={element.url ?? ""}
          {...element}
        />
      );
    }
    else if (element?.type === "Text") {
      return <TextComponent content={element.content ?? ""} textarea={element.textarea ?? null} {...element} />;
    }
    else if (element?.type === "Image") {
      return <ImageComponent imageUrl={""} {...element} />;
    }
    else if (element?.type === "Logo") {
      return <LogoComponent imageUrl={element.imageUrl} {...element} />;
    }
    else if (element?.type === "LogoHeader") {
      return <LogoTopComponent imageUrl={element.imageUrl} {...element} />;
    }
    else if (element?.type === "SocialIcons") {
      return <SocialComponent socialIcons={element.socialIcons} {...element} />;
    }
    else if (element?.type === "Divider") {
      return <DividerComponent />;
    }
    return element.type || 'Element';
  };

  if (isExport) {
    // Table-based layout for export
    return (
      <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse", margin: 0, padding: 0 }}>
        <tr>
          {Array.from({ length: numOfCol }).map((_, index) => {
            const colObj = emailTemplate?.find((col: any) => col && col.id === id);
            return (
              <td
                key={index}
                style={{
                  verticalAlign: "top",
                  padding: "8px",
                  background: "#fff",
                  border: "none",
                  textAlign: "center",
                  width: `${100 / numOfCol}%`,
                }}
              >
                {GetElementComponent(colObj?.[index])}
              </td>
            );
          })}
        </tr>
      </table>
    );
  }

  return (
    <div className="rounded-md shadow-sm bg-white mb-4">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numOfCol}, 1fr)`,
          gap: "12px",
          width: '100%',
          maxWidth: '100%',
          padding: '12px',
        }}
      >
        {Array.from({ length: numOfCol }).map((_, index) => {
          const colObj = emailTemplate?.find((col: any) => col && col.id === id);
          const hasElement = !!colObj?.[index];

          // Find the column index in emailTemplate
          const columnIndex = emailTemplate.findIndex((col: any) => col && col.id === id);

          // Check if this element is selected
          const isSelected =
            hasElement &&
            selectedElement &&
            selectedElement.columnIndex === columnIndex &&
            selectedElement.index === index;

          const isDragOver = dragOver?.index === index && dragOver?.columnId === id;

          return (
            <div
              key={index}
              className={`
                relative rounded-lg transition-all duration-200
                ${hasElement ? 'bg-white' : 'bg-gray-50 border border-dashed border-gray-300 hover:border-blue-300 hover:bg-blue-50/30'}
                ${isSelected ? 'ring-2 ring-blue-500 shadow-md' : ''}
                ${isDragOver ? 'bg-blue-50 border-blue-400' : ''}
              `}
              onDragOver={(event) => onDragOverHandle(event, index)}
              onDrop={(event) => {
                event.preventDefault();
                onDropHandle(index);
              }}
              onClick={() => {
                if (hasElement) {
                  const layoutArray = [];
                  for (let i = 0; i < numOfCol; i++) {
                    layoutArray.push(colObj?.[i] ?? null);
                  }
                  setSelectedElement({
                    layout: layoutArray,
                    index: index,
                    columnIndex: columnIndex
                  });
                }
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '120px',
                width: '100%',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                padding: '12px',
                cursor: hasElement ? 'pointer' : 'cell',
              }}
            >
              {hasElement ? (
                <div className="w-full h-full flex items-center justify-center">
                  {GetElementComponent(colObj?.[index])}
                </div>
              ) : (
                <div className="text-gray-400 text-center flex flex-col items-center justify-center h-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm">Drag Element Here</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
