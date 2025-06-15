import React, { createContext, useContext, useState, ReactNode } from "react";

export const DragDropLayoutElement = createContext<{
  dragDropLayoutElement: any;
  setDragDropLayoutElement: React.Dispatch<React.SetStateAction<any>>;
} | null>(null);

interface DragDropLayoutElementProviderProps {
  children: ReactNode;
}

export const DragDropLayoutElementProvider: React.FC<DragDropLayoutElementProviderProps> = ({
  children,
}) => {
  const [dragDropLayoutElement, setDragDropLayoutElement] = useState<any>(null);

  return (
    <DragDropLayoutElement.Provider value={{ dragDropLayoutElement, setDragDropLayoutElement }}>
      {children}
    </DragDropLayoutElement.Provider>
  );
};

export const useDragElementLayout = () => {
  const context = useContext(DragDropLayoutElement);
  if (!context) {
    throw new Error("useDragElementLayout must be used within a DragDropLayoutElementProvider");
  }
  return context;
};