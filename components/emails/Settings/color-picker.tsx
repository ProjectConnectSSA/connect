import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HexColorPicker } from 'react-colorful';
import { Label } from '@/components/ui/label';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export const ColorPicker = ({ value, onChange, label }: ColorPickerProps) => {
  const [color, setColor] = useState(value || '#000000');

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger>
            <div 
              className="w-10 h-10 rounded border cursor-pointer" 
              style={{ backgroundColor: color }}
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3">
            <HexColorPicker color={color} onChange={handleColorChange} />
          </PopoverContent>
        </Popover>
        <input 
          type="text" 
          value={color} 
          onChange={(e) => handleColorChange(e.target.value)}
          className="border rounded px-2 py-1 text-sm w-28"
        />
      </div>
    </div>
  );
};