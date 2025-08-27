"use client";

import React from 'react';
import { useEmailTemplate } from '@/contexts/EmailTemplateContext';
import { 
  EmailElement, 
  isTextElement, 
  isImageElement, 
  isButtonElement, 
  isTableElement, 
  isDividerElement, 
  isLinkElement,
  isCustomHTMLElement
} from '@/lib/email-schema';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { StylesEditor } from '@/components/Sidebar/ImageStyles/StylesEditor';
import { 
  Trash2, 
  Copy, 
  Type, 
  Image, 
  Square, 
  Table, 
  Minus, 
  Link as LinkIcon,
  Code
} from 'lucide-react';

interface SettingsSidebarProps {
  className?: string;
}

// Text element settings component
function TextElementSettings({ element }: { element: EmailElement }) {
  const { updateElement } = useEmailTemplate();
  
  if (!isTextElement(element)) return null;
  
  const properties = element.properties;

  const handlePropertyChange = (key: keyof typeof properties, value: string) => {
    updateElement(element.id, {
      properties: {
        ...properties,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Text Content</label>
        <Input
          value={properties.text}
          onChange={(e) => handlePropertyChange('text', e.target.value)}
          placeholder="Enter text content"
          className="mt-1"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-700">Font Size</label>
        <Input
          value={properties.fontSize}
          onChange={(e) => handlePropertyChange('fontSize', e.target.value)}
          placeholder="16px"
          className="mt-1"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-700">Text Color</label>
        <Input
          type="color"
          value={properties.color}
          onChange={(e) => handlePropertyChange('color', e.target.value)}
          className="mt-1 h-10"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-700">Alignment</label>
        <select
          value={properties.alignment}
          onChange={(e) => handlePropertyChange('alignment', e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  );
}

// Image element settings component
function ImageElementSettings({ element }: { element: EmailElement }) {
  if (!isImageElement(element)) return null;

  return <StylesEditor onClose={() => {}} />;
}

// Button element settings component
function ButtonElementSettings({ element }: { element: EmailElement }) {
  const { updateElement } = useEmailTemplate();
  
  if (!isButtonElement(element)) return null;
  
  const properties = element.properties;

  const handlePropertyChange = (key: keyof typeof properties, value: string) => {
    updateElement(element.id, {
      properties: {
        ...properties,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Button Text</label>
        <Input
          value={properties.text}
          onChange={(e) => handlePropertyChange('text', e.target.value)}
          placeholder="Click me"
          className="mt-1"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-700">Background Color</label>
        <Input
          type="color"
          value={properties.backgroundColor}
          onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
          className="mt-1 h-10"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-700">Text Color</label>
        <Input
          type="color"
          value={properties.color}
          onChange={(e) => handlePropertyChange('color', e.target.value)}
          className="mt-1 h-10"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Padding</label>
          <Input
            value={properties.padding}
            onChange={(e) => handlePropertyChange('padding', e.target.value)}
            placeholder="12px 24px"
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Border Radius</label>
          <Input
            value={properties.borderRadius}
            onChange={(e) => handlePropertyChange('borderRadius', e.target.value)}
            placeholder="4px"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}

// Table element settings component
function TableElementSettings({ element }: { element: EmailElement }) {
  const { updateElement } = useEmailTemplate();
  
  if (!isTableElement(element)) return null;
  
  const properties = element.properties;

  const handlePropertyChange = (key: keyof typeof properties, value: string | number) => {
    updateElement(element.id, {
      properties: {
        ...properties,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Rows</label>
          <Input
            type="number"
            value={properties.rows}
            onChange={(e) => handlePropertyChange('rows', parseInt(e.target.value) || 1)}
            min="1"
            max="10"
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Columns</label>
          <Input
            type="number"
            value={properties.columns}
            onChange={(e) => handlePropertyChange('columns', parseInt(e.target.value) || 1)}
            min="1"
            max="10"
            className="mt-1"
          />
        </div>
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-700">Border Width</label>
        <Input
          value={properties.borderWidth}
          onChange={(e) => handlePropertyChange('borderWidth', e.target.value)}
          placeholder="1px"
          className="mt-1"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-700">Border Color</label>
        <Input
          type="color"
          value={properties.borderColor}
          onChange={(e) => handlePropertyChange('borderColor', e.target.value)}
          className="mt-1 h-10"
        />
      </div>
    </div>
  );
}

// Divider element settings component
function DividerElementSettings({ element }: { element: EmailElement }) {
  const { updateElement } = useEmailTemplate();
  
  if (!isDividerElement(element)) return null;
  
  const properties = element.properties;

  const handlePropertyChange = (key: keyof typeof properties, value: string) => {
    updateElement(element.id, {
      properties: {
        ...properties,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Height</label>
        <Input
          value={properties.height}
          onChange={(e) => handlePropertyChange('height', e.target.value)}
          placeholder="1px"
          className="mt-1"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-700">Color</label>
        <Input
          type="color"
          value={properties.color}
          onChange={(e) => handlePropertyChange('color', e.target.value)}
          className="mt-1 h-10"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-700">Margin</label>
        <Input
          value={properties.margin}
          onChange={(e) => handlePropertyChange('margin', e.target.value)}
          placeholder="20px 0"
          className="mt-1"
        />
      </div>
    </div>
  );
}

// Link element settings component
function LinkElementSettings({ element }: { element: EmailElement }) {
  const { updateElement } = useEmailTemplate();
  
  if (!isLinkElement(element)) return null;
  
  const properties = element.properties;

  const handlePropertyChange = (key: keyof typeof properties, value: string | boolean) => {
    updateElement(element.id, {
      properties: {
        ...properties,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Link Text</label>
        <Input
          value={properties.text}
          onChange={(e) => handlePropertyChange('text', e.target.value)}
          placeholder="Click here"
          className="mt-1"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-700">URL</label>
        <Input
          value={properties.url}
          onChange={(e) => handlePropertyChange('url', e.target.value)}
          placeholder="https://example.com"
          className="mt-1"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-700">Text Color</label>
        <Input
          type="color"
          value={properties.color}
          onChange={(e) => handlePropertyChange('color', e.target.value)}
          className="mt-1 h-10"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="underline"
          checked={properties.underline}
          onChange={(e) => handlePropertyChange('underline', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="underline" className="text-sm font-medium text-gray-700">
          Underline
        </label>
      </div>
    </div>
  );
}

// Custom HTML element settings component
function CustomHTMLElementSettings({ element }: { element: EmailElement }) {
  const { updateElement } = useEmailTemplate();
  
  if (!isCustomHTMLElement(element)) return null;
  
  const properties = element.properties;
  const isCompleteTemplate = properties.isCompleteTemplate;

  const handleHTMLChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateElement(element.id, {
      properties: {
        ...properties,
        html: e.target.value,
      },
    });
  };

  return (
    <div className="space-y-4">
      {isCompleteTemplate && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center gap-2 text-blue-800 text-sm font-medium mb-2">
            <span>📧</span>
            Complete Email Template
          </div>
          <p className="text-blue-700 text-xs">
            This element contains a complete HTML email template. When you generate the final HTML, 
            this content will be used as-is instead of the built template structure.
          </p>
        </div>
      )}
      
      <div>
        <label className="text-sm font-medium text-gray-700">HTML Code</label>
        <textarea
          value={properties.html}
          onChange={handleHTMLChange}
          className="mt-1 w-full h-32 p-3 font-mono text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder={isCompleteTemplate ? "<html>...</html>" : "<div>Your custom HTML here</div>"}
          spellCheck={false}
        />
      </div>
      
      <div className="text-xs text-gray-500">
        {isCompleteTemplate ? (
          <>
            <p><strong>Note:</strong> This is a complete email template that will replace the built template.</p>
            <p><strong>Warning:</strong> Make sure your HTML is email-client compatible and includes proper table-based layout.</p>
          </>
        ) : (
          <>
            <p><strong>Note:</strong> This HTML will be rendered directly in your email template.</p>
            <p><strong>Warning:</strong> Make sure your HTML is email-client compatible.</p>
          </>
        )}
      </div>
    </div>
  );
}

// Function to render element-specific settings
function renderElementSettings(element: EmailElement) {
  switch (element.type) {
    case 'text':
      return <TextElementSettings element={element} />;
    case 'image':
      return <ImageElementSettings element={element} />;
    case 'button':
      return <ButtonElementSettings element={element} />;
    case 'table':
      return <TableElementSettings element={element} />;
    case 'divider':
      return <DividerElementSettings element={element} />;
    case 'link':
      return <LinkElementSettings element={element} />;
    case 'custom-html':
      return <CustomHTMLElementSettings element={element} />;
    default:
      return (
        <div className="text-center text-gray-500 py-8">
          <p>No settings available for this element type.</p>
        </div>
      );
  }
}

// Function to get icon for element type
function getElementIcon(type: EmailElement['type']) {
  const iconMap: Record<EmailElement['type'], React.ReactNode> = {
    text: <Type className="h-4 w-4" />,
    image: <Image className="h-4 w-4" />,
    button: <Square className="h-4 w-4" />,
    table: <Table className="h-4 w-4" />,
    divider: <Minus className="h-4 w-4" />,
    link: <LinkIcon className="h-4 w-4" />,
    header: <Type className="h-4 w-4" />,
    content: <Type className="h-4 w-4" />,
    footer: <Type className="h-4 w-4" />,
    nav: <LinkIcon className="h-4 w-4" />,
    social: <LinkIcon className="h-4 w-4" />,
    logo: <Image className="h-4 w-4" />,
    "custom-html": <Code className="h-4 w-4" />,
  };
  return iconMap[type] || <Square className="h-4 w-4" />;
}

export default function SettingsSidebar({ className }: SettingsSidebarProps) {
  const { state, removeElement } = useEmailTemplate();
  const selectedElement = state.selectedElementId 
    ? state.template.elements.find(el => el.id === state.selectedElementId)
    : null;

  const handleDelete = () => {
    if (selectedElement) {
      removeElement(selectedElement.id);
    }
  };

  const handleDuplicate = () => {
    // TODO: Implement duplicate functionality
    console.log('Duplicate functionality not implemented yet');
  };

  if (!selectedElement) {
    return (
      <div className={cn("w-80 bg-white border-l border-gray-200 flex flex-col h-full flex-shrink-0", className)}>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Type className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Element Selected</h3>
            <p className="text-sm text-gray-500">
              Select an element from the canvas to edit its properties
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-80 bg-white border-l border-gray-200 flex flex-col h-full flex-shrink-0", className)}>
      {/* Fixed header section */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        {/* Element header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            {getElementIcon(selectedElement.type)}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{selectedElement.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{selectedElement.type}</p>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Action buttons */}
        <div className="flex gap-2 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDuplicate}
            className="flex-1"
          >
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </Button>
        </div>

        <Separator className="mb-6" />
      </div>

      {/* Scrollable content section */}
      <div className="flex-1 overflow-y-auto p-6 pt-0">
        {renderElementSettings(selectedElement)}
      </div>
    </div>
  );
}
