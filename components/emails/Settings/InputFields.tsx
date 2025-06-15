import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface InputFieldsProps {
  element: any;
  onChange: (changes: any) => void;
}

export const InputFields = ({ element, onChange }: InputFieldsProps) => {
  const handleChange = (key: string, value: any) => {
    onChange({ [key]: value });
  };

  // Render different input fields based on element type
  switch (element.type) {
    case 'Button':
      return (
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Button Text</Label>
            <Input 
              value={element.content || ''} 
              onChange={e => handleChange('content', e.target.value)} 
              className="w-full"
            />
          </div>
          <div>
            <Label className="mb-2 block">URL</Label>
            <Input 
              value={element.url || ''} 
              onChange={e => handleChange('url', e.target.value)} 
              className="w-full"
              placeholder="https://example.com"
            />
          </div>
        </div>
      );
      
    case 'Text':
      return (
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Content</Label>
            <Textarea 
              value={element.textarea || ''} 
              onChange={e => handleChange('textarea', e.target.value)} 
              className="w-full min-h-[150px]"
            />
          </div>
        </div>
      );
      
    case 'Image':
      return (
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Image URL</Label>
            <Input 
              value={element.imageUrl || ''} 
              onChange={e => handleChange('imageUrl', e.target.value)} 
              className="w-full"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <Label className="mb-2 block">Alt Text</Label>
            <Input 
              value={element.alt || ''} 
              onChange={e => handleChange('alt', e.target.value)} 
              className="w-full"
              placeholder="Image description"
            />
          </div>
          <div>
            <Label className="mb-2 block">Link URL (optional)</Label>
            <Input 
              value={element.url || ''} 
              onChange={e => handleChange('url', e.target.value)} 
              className="w-full"
              placeholder="https://example.com"
            />
          </div>
        </div>
      );
      
    case 'Logo':
    case 'LogoHeader':
      return (
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Logo URL</Label>
            <Input 
              value={element.imageUrl || ''} 
              onChange={e => handleChange('imageUrl', e.target.value)} 
              className="w-full"
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div>
            <Label className="mb-2 block">Alt Text</Label>
            <Input 
              value={element.alt || ''} 
              onChange={e => handleChange('alt', e.target.value)} 
              className="w-full"
              placeholder="Company logo"
            />
          </div>
          <div>
            <Label className="mb-2 block">Link URL (optional)</Label>
            <Input 
              value={element.url || ''} 
              onChange={e => handleChange('url', e.target.value)} 
              className="w-full"
              placeholder="https://yourcompany.com"
            />
          </div>
        </div>
      );
      
    case 'Divider':
      return (
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Divider Color</Label>
            <Input 
              type="color"
              value={element.style?.borderColor || '#cccccc'} 
              onChange={e => onChange({ style: { ...element.style, borderColor: e.target.value } })} 
              className="w-full h-10"
            />
          </div>
        </div>
      );
      
    default:
      return (
        <div className="text-center text-gray-500 py-4">
          No content settings available for this element type.
        </div>
      );
  }
};

