import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ColorPicker } from './color-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StyleFieldsProps {
  element: any;
  onChange: (changes: any) => void;
}

export const StyleFields = ({ element, onChange }: StyleFieldsProps) => {
  const handleChange = (key: string, value: any) => {
    onChange({ 
      style: { 
        ...element.style, 
        [key]: value 
      } 
    });
  };

  const handleOuterChange = (key: string, value: any) => {
    onChange({ 
      outerStyle: { 
        ...element.outerStyle, 
        [key]: value 
      } 
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Element Style</h3>
      
      {/* Background Color (for applicable elements) */}
      {element.type !== 'Divider' && (
        <ColorPicker
          label="Background Color"
          value={element.style?.backgroundColor || '#ffffff'}
          onChange={(color) => handleChange('backgroundColor', color)}
        />
      )}
      
      {/* Text Color (for elements with text) */}
      {['Button', 'Text'].includes(element.type) && (
        <ColorPicker
          label="Text Color"
          value={element.style?.color || '#000000'}
          onChange={(color) => handleChange('color', color)}
        />
      )}
      
      {/* Font settings (for text elements) */}
      {['Button', 'Text'].includes(element.type) && (
        <>
          <div>
            <Label className="mb-2 block">Font Size</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={parseInt(element.style?.fontSize) || 16}
                onChange={(e) => handleChange('fontSize', `${e.target.value}px`)}
                className="w-20"
              />
              <span className="text-sm text-gray-500">px</span>
            </div>
          </div>
          
          <div>
            <Label className="mb-2 block">Font Weight</Label>
            <Select 
              value={element.style?.fontWeight || 'normal'}
              onValueChange={(value) => handleChange('fontWeight', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select weight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="lighter">Light</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="mb-2 block">Font Style</Label>
            <Select 
              value={element.style?.fontStyle || 'normal'}
              onValueChange={(value) => handleChange('fontStyle', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="italic">Italic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      
      {/* Alignment (for most elements) */}
      <div>
        <Label className="mb-2 block">Alignment</Label>
        <div className="flex border rounded-md overflow-hidden">
          <Button
            type="button"
            variant={element.style?.textAlign === 'left' ? 'default' : 'ghost'}
            className="flex-1 rounded-none"
            onClick={() => handleChange('textAlign', 'left')}
          >
            Left
          </Button>
          <Button
            type="button"
            variant={element.style?.textAlign === 'center' ? 'default' : 'ghost'}
            className="flex-1 rounded-none"
            onClick={() => handleChange('textAlign', 'center')}
          >
            Center
          </Button>
          <Button
            type="button"
            variant={element.style?.textAlign === 'right' ? 'default' : 'ghost'}
            className="flex-1 rounded-none"
            onClick={() => handleChange('textAlign', 'right')}
          >
            Right
          </Button>
        </div>
      </div>
      
      {/* Padding */}
      <div>
        <Label className="mb-2 block">Padding</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input 
            type="number" 
            placeholder="Top/Bottom" 
            value={element.style?.paddingY || '10'}
            onChange={(e) => {
              const value = e.target.value;
              handleChange('paddingTop', `${value}px`);
              handleChange('paddingBottom', `${value}px`);
            }}
          />
          <Input 
            type="number" 
            placeholder="Left/Right" 
            value={element.style?.paddingX || '10'}
            onChange={(e) => {
              const value = e.target.value;
              handleChange('paddingLeft', `${value}px`);
              handleChange('paddingRight', `${value}px`);
            }}
          />
        </div>
      </div>
      
      {/* Width/Size controls */}
      {['Button', 'Image', 'Logo', 'LogoHeader'].includes(element.type) && (
        <div>
          <Label className="mb-2 block">Width</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={parseInt(element.style?.width) || 100}
              onChange={(e) => handleChange('width', `${e.target.value}${element.type === 'Button' ? 'px' : '%'}`)}
              className="w-20"
            />
            <span className="text-sm text-gray-500">{element.type === 'Button' ? 'px' : '%'}</span>
          </div>
        </div>
      )}
      
      {/* Border Radius for buttons and images */}
      {['Button', 'Image'].includes(element.type) && (
        <div>
          <Label className="mb-2 block">Border Radius</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={parseInt(element.style?.borderRadius) || 0}
              onChange={(e) => handleChange('borderRadius', `${e.target.value}px`)}
              className="w-20"
            />
            <span className="text-sm text-gray-500">px</span>
          </div>
        </div>
      )}
      
      {/* Container Alignment */}
      <div>
        <Label className="mb-2 block">Container Alignment</Label>
        <Select 
          value={element.outerStyle?.justifyContent || 'center'}
          onValueChange={(value) => handleOuterChange('justifyContent', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select alignment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flex-start">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="flex-end">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};