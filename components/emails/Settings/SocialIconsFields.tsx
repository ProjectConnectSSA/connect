import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';

interface SocialIconsFieldsProps {
  element: any;
  onChange: (changes: any) => void;
}

export const SocialIconsFields = ({ element, onChange }: SocialIconsFieldsProps) => {
  const handleChange = (index: number, field: string, value: string) => {
    const updatedIcons = [...element.socialIcons];
    updatedIcons[index] = { ...updatedIcons[index], [field]: value };
    onChange({ socialIcons: updatedIcons });
  };

  const addIcon = () => {
    const updatedIcons = [...(element.socialIcons || []), { icon: '', url: '' }];
    onChange({ socialIcons: updatedIcons });
  };

  const removeIcon = (index: number) => {
    const updatedIcons = element.socialIcons.filter((_: any, i: number) => i !== index);
    onChange({ socialIcons: updatedIcons });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-2 block">Social Media Label (optional)</Label>
        <Input 
          value={element.label || ''}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="Follow us on social media"
          className="w-full"
        />
      </div>
      
      <div className="space-y-4">
        <Label className="block">Social Icons</Label>
        
        {(element.socialIcons || []).map((icon: any, index: number) => (
          <div key={index} className="border rounded-md p-3 space-y-3 relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => removeIcon(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            
            <div>
              <Label className="mb-1 block text-sm">Icon URL</Label>
              <Input 
                value={icon.icon || ''}
                onChange={(e) => handleChange(index, 'icon', e.target.value)}
                placeholder="https://example.com/icon.png"
                className="w-full"
              />
            </div>
            
            <div>
              <Label className="mb-1 block text-sm">Link URL</Label>
              <Input 
                value={icon.url || ''}
                onChange={(e) => handleChange(index, 'url', e.target.value)}
                placeholder="https://facebook.com/yourpage"
                className="w-full"
              />
            </div>

            {icon.icon && (
              <div className="flex justify-center">
                <img 
                  src={icon.icon} 
                  alt={`Social icon ${index}`} 
                  className="w-10 h-10 object-contain"
                />
              </div>
            )}
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          className="w-full mt-2"
          onClick={addIcon}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Social Icon
        </Button>
      </div>
    </div>
  );
};