import React, { createContext, Dispatch, SetStateAction } from 'react';

export type LayoutElementType = {
  id: string;
  content?: string;
  [key: string]: any;
};

export type SelectedElementType = {
  layout?: LayoutElementType[];
  index?: number;
  columnIndex: number;
};

export type SelectedElementContextType = {
  selectedElement: SelectedElementType | null;
  setSelectedElement: Dispatch<SetStateAction<SelectedElementType | null>>;
};

export const SelectedElementContext = createContext<SelectedElementContextType>({
  selectedElement: null,
  setSelectedElement: () => {},
});
