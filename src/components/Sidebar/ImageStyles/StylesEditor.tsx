"use client";

import React, { useState, useEffect } from 'react';
import { useEmailTemplate } from '@/contexts/EmailTemplateContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  X, 
  Trash2, 
  ExternalLink,
  HelpCircle,
  Lock,
  Unlock,
  Undo2,
  Redo2,
  Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { isImageElement, ImageElementProperties } from '@/lib/email-schema';
import Image from 'next/image';

interface ImageDimensions {
  width: number;
  height: number;
}

interface StylesEditorProps {
  onClose: () => void;
}

export function StylesEditor({ onClose }: StylesEditorProps) {
  const { state, updateElement, undo, redo, canUndo, canRedo } = useEmailTemplate();
  const selectedElement = state.selectedElementId ? state.template.elements.find(el => el.id === state.selectedElementId) : null;
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageFileSize, setImageFileSize] = useState<number | null>(null);
  // Function to get image dimensions from URL
  const getImageDimensions = (imageUrl: string): Promise<ImageDimensions> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      img.src = imageUrl;
    });
  };
   // Function to get image file size from URL
   const getImageFileSize = (imageUrl: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('HEAD', imageUrl, false); // Use false for synchronous request
      xhr.send();
      if (xhr.status === 200) {
        resolve(xhr.getResponseHeader('Content-Length') ? parseInt(xhr.getResponseHeader('Content-Length') || '0', 10) : 0);
      } else {
        reject(new Error('Failed to get file size'));
      }
    });
  };

  // Function to format file size in human-readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  // Effect to update image dimensions when src changes
  useEffect(() => {
    if (selectedElement && isImageElement(selectedElement) && selectedElement.properties?.src) {
      setImageLoading(true);
      Promise.all([
        getImageDimensions(selectedElement.properties?.src as string),
        getImageFileSize(selectedElement.properties?.src as string)
      ])
                 .then(([dimensions, fileSize]) => {
           setImageDimensions(dimensions);
           setImageFileSize(fileSize);
           setImageLoading(false);
         })
        .catch(() => {
          setImageDimensions(null);
          setImageLoading(false);
        });
    } else {
      setImageDimensions(null);
    }
  }, [selectedElement, updateElement]);

  if (!selectedElement) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <p>Select an element to edit its styles</p>
        </div>
      </div>
    );
  }

  const renderImageEditor = () => {
    if (!isImageElement(selectedElement)) return null;
    
    const properties = selectedElement.properties as ImageElementProperties;
    
    const updateImageProperty = (updates: Partial<ImageElementProperties>) => {
      updateElement(selectedElement.id, {
        properties: {
          ...properties,
          ...updates,
        },
      });
    };



      const updateMargin = (side: 'top' | 'right' | 'bottom' | 'left', value: number) => {
    const newMargins = { ...properties.margins };
    if (properties.margins.linked) {
      // Update all margins if linked
      newMargins.top = value;
      newMargins.right = value;
      newMargins.bottom = value;
      newMargins.left = value;
    } else {
      // Update only the specific margin
      newMargins[side] = value;
    }
    updateImageProperty({ margins: newMargins });
  };

    const toggleMarginLink = () => {
      updateImageProperty({
        margins: {
          ...properties.margins,
          linked: !properties.margins.linked,
        },
      });
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Image Block</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={undo}
              disabled={!canUndo}
              className="h-8 w-8"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={redo}
              disabled={!canRedo}
              className="h-8 w-8"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Image URL Input */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Image URL</Label>
          <div className="flex gap-2">
            <Input 
              placeholder="https://example.com/image.jpg" 
              className="flex-1"
              value={properties.src}
              onChange={(e) => updateImageProperty({ src: e.target.value })}
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="px-3"
              onClick={() => {
                if (properties.src) {
                  // Force a re-render of the image and refresh dimensions
                  updateImageProperty({ src: properties.src + '?t=' + Date.now() });
                  // Refresh dimensions
                  setImageLoading(true);
                  getImageDimensions(properties.src)
                    .then(dimensions => {
                      setImageDimensions(dimensions);
                      setImageLoading(false);
                    })
                    .catch(() => {
                      setImageDimensions(null);
                      setImageLoading(false);
                    });
                }
              }}
            >
              Refresh
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Paste an image URL to display the image. Supports JPG, PNG, GIF, and WebP formats.
          </p>
        </div>

        {/* Image Preview */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
              {properties.src ? (
                <Image 
                  src={properties.src} 
                  alt={properties.alt || 'Image preview'} 
                  width={128}
                  height={128}
                  className="w-full h-full object-cover rounded-lg"
                  onError={() => {
                    // Handle image load errors gracefully
                    setImageDimensions(null);
                  }}
                  unoptimized
                />
              ) : (
                <div className="text-center text-gray-400">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-gray-500 text-xs">IMG</span>
                  </div>
                  <p className="text-xs">No image</p>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="text-sm">
                {/* <p className="font-medium">
                  {properties.src ? 'Image loaded' : 'No image URL provided'}
                </p> */}
                {properties.src && (
                  <>
                    <p className="text-xs text-gray-500 mt-1">
                     {properties.src.length > 40 ? properties.src.substring(0, 40) + '...' : properties.src}
                    </p>
                    {imageLoading ? (
                      <p className="text-xs text-blue-500">Loading dimensions...</p>
                    ) : imageDimensions ? (
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Dimensions:</span> {imageDimensions.width} × {imageDimensions.height} px
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">Dimensions: Unable to load</p>
                    )}
                    {imageFileSize && (
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Size:</span> {formatFileSize(imageFileSize)}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">Alt Text:</span> {properties.alt || 'Not set'}
                    </p>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-2"
                  disabled={!properties.src}
                  onClick={() => {
                    if (properties.src) {
                      // Open image in new tab
                      window.open(properties.src, '_blank');
                    }
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-2"
                  disabled={!properties.src}
                  onClick={() => {
                    if (properties.src) {
                      // Copy image URL to clipboard
                      navigator.clipboard.writeText(properties.src);
                    }
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-2"
                  disabled={!properties.src}
                  onClick={() => updateImageProperty({ src: '' })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Link Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Link</Label>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <select className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option>Site</option>
            </select>
            <Input 
              placeholder="https://" 
              className="flex-1"
              value={properties.linkUrl || ''}
              onChange={(e) => updateImageProperty({ linkUrl: e.target.value })}
            />
          </div>
        </div>

        {/* Alternate Text */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Alternate Text</Label>
          <Input 
            placeholder="Will be added in attributes Alt and Title"
            value={properties.alt}
            onChange={(e) => updateImageProperty({ alt: e.target.value })}
          />
        </div>

        {/* Size on Desktop */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <Label className="text-sm font-medium">Size on Desktop</Label>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 px-2">
              <div className="w-4 h-4 border-2 border-dashed border-gray-400 rounded"></div>
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-2">
              <div className="w-5 h-5 border-2 border-dashed border-gray-400 rounded"></div>
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-2 bg-green-100 border-green-500">
              <div className="w-4 h-4 border-2 border-gray-400"></div>
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-2">
              <div className="w-4 h-4 border-2 border-gray-400"></div>
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-6 w-6 p-0">-</Button>
              <Input 
                value={properties.width}
                onChange={(e) => updateImageProperty({ width: e.target.value })}
                className="w-16 h-6 text-center text-sm"
              />
              <Button variant="outline" size="sm" className="h-6 w-6 p-0">+</Button>
            </div>
          </div>
        </div>

        {/* Alignment on Desktop */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <Label className="text-sm font-medium">Alignment on Desktop</Label>
          </div>
          <div className="flex gap-2">
            {[
              { value: 'left', icon: '◤' },
              { value: 'center', icon: '◥' },
              { value: 'right', icon: '◣' }
            ].map((align) => (
              <Button
                key={align.value}
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 px-2",
                  properties.alignment === align.value && "bg-green-100 border-green-500"
                )}
                onClick={() => updateImageProperty({ alignment: align.value as "left" | "center" | "right" })}
              >
                <span className="text-sm">{align.icon}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Radius */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Radius</Label>
            <HelpCircle className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-6 w-6 p-0">-</Button>
              <Input 
                value={properties.radius}
                onChange={(e) => updateImageProperty({ radius: parseInt(e.target.value) || 0 })}
                className="w-16 h-6 text-center text-sm"
              />
              <Button variant="outline" size="sm" className="h-6 w-6 p-0">+</Button>
            </div>
            <div className="flex gap-1">
              {[
                { value: 'sharp', icon: '◻' },
                { value: 'rounded', icon: '◯' }
              ].map((style) => (
                <Button
                  key={style.value}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-8 px-2",
                    properties.borderRadius === style.value && "bg-green-100 border-green-500"
                  )}
                  onClick={() => updateImageProperty({ borderRadius: style.value as "sharp" | "rounded" })}
                >
                  <span className="text-sm">{style.icon}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Rollover Effect */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Rollover Effect</Label>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </div>
            <Switch
              checked={properties.rolloverEffect}
              onCheckedChange={(checked: boolean) => updateImageProperty({ rolloverEffect: checked })}
            />
          </div>
          <p className="text-xs text-gray-500">
            The image that will display over current image on mouse hover.
          </p>
        </div>

        {/* Anchor Link */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Anchor Link</Label>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </div>
            <Switch
              checked={properties.anchorLink}
              onCheckedChange={(checked: boolean) => updateImageProperty({ anchorLink: checked })}
            />
          </div>
        </div>

        {/* Margins on Desktop */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <Label className="text-sm font-medium">Margins on Desktop</Label>
            <HelpCircle className="h-4 w-4 text-gray-400" />
          </div>
          <div className="relative">
            <div className="grid grid-cols-3 gap-2">
              <div></div>
              <div className="flex items-center justify-center">
                <Input 
                  value={properties.margins.top}
                  onChange={(e) => updateMargin('top', parseInt(e.target.value) || 0)}
                  className="w-16 h-8 text-center text-sm"
                />
              </div>
              <div></div>
              <div className="flex items-center justify-center">
                <Input 
                  value={properties.margins.left}
                  onChange={(e) => updateMargin('left', parseInt(e.target.value) || 0)}
                  className="w-16 h-8 text-center text-sm"
                />
              </div>
              <div className="flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMarginLink}
                  className="h-8 w-8 p-0"
                >
                  {properties.margins.linked ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Unlock className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-center">
                <Input 
                  value={properties.margins.right}
                  onChange={(e) => updateMargin('right', parseInt(e.target.value) || 0)}
                  className="w-16 h-8 text-center text-sm"
                />
              </div>
              <div></div>
              <div className="flex items-center justify-center">
                <Input 
                  value={properties.margins.bottom}
                  onChange={(e) => updateMargin('bottom', parseInt(e.target.value) || 0)}
                  className="w-16 h-8 text-center text-sm"
                />
              </div>
              <div></div>
            </div>
          </div>
        </div>

        {/* Include in */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Include in</Label>
            <HelpCircle className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex gap-2">
            {[
              { value: 'both', label: 'Both' },
              { value: 'html', label: 'HTML' },
              { value: 'amp', label: 'HTML ⚡' }
            ].map((option) => (
              <Button
                key={option.value}
                variant="outline"
                size="sm"
                className={cn(
                  "flex-1",
                  properties.includeIn === option.value && "bg-green-100 border-green-500"
                )}
                onClick={() => updateImageProperty({ includeIn: option.value as "both" | "html" | "amp" })}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            The element will be included in both MIME versions of the...
          </p>
        </div>
      </div>
    );
  };

  const renderEditor = () => {
    switch (selectedElement.type) {
      case 'image':
        return renderImageEditor();
      default:
        return (
          <div className="text-center text-gray-500">
            <p>Styles editor for {selectedElement.type} elements coming soon</p>
          </div>
        );
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          {selectedElement && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="p-4">
        {renderEditor()}
      </div>
    </div>
  );
}
