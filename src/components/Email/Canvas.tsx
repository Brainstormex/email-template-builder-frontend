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
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Text, 
  Img, 
  Button, 
  Hr, 
  Link,
  Section
} from '@react-email/components';
import { GripHorizontal } from 'lucide-react';

interface CanvasElementProps {
  element: EmailElement;
  isSelected: boolean;
  onSelect: (elementId: string) => void;
}

function CanvasElement({ element, isSelected, onSelect }: CanvasElementProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id);
  };

  const renderElementContent = () => {
    switch (element.type) {
      case 'text':
        if (isTextElement(element)) {
          const properties = element.properties;
          return (
            <Section className="p-6 border-2 border-dashed border-gray-300 rounded-lg min-h-[80px] flex items-center justify-center bg-white">
              <Text 
                style={{
                  fontSize: properties.fontSize || '16px',
                  color: properties.color || '#000000',
                  textAlign: properties.alignment || 'left',
                  margin: 0,
                }}
              >
                {properties.text || 'Text Block'}
              </Text>
            </Section>
          );
        }
        break;

      case 'image':
        if (isImageElement(element)) {
          const properties = element.properties;
          return (
            <Section className="p-6 border-2 border-dashed border-gray-300 rounded-lg min-h-[200px] flex items-center justify-center bg-white">
              <div className="text-center">
                {properties.src ? (
                  <Img
                    src={properties.src}
                    alt={properties.alt || 'Image'}
                    width={properties.width || '100%'}
                    height={properties.height || 'auto'}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">IMG</span>
                  </div>
                )}
                <Text style={{ fontSize: '14px', color: '#666', margin: '8px 0 0 0' }}>
                  {properties.alt || 'Image Placeholder'}
                </Text>
              </div>
            </Section>
          );
        }
        break;

      case 'button':
        if (isButtonElement(element)) {
          const properties = element.properties;
          return (
            <Section className="p-6 flex items-center justify-center bg-white">
              <Button
                style={{
                  backgroundColor: properties.backgroundColor || '#007bff',
                  color: properties.color || '#ffffff',
                  padding: properties.padding || '16px 32px',
                  borderRadius: properties.borderRadius || '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                }}
              >
                {properties.text || 'Button'}
              </Button>
            </Section>
          );
        }
        break;

      case 'table':
        if (isTableElement(element)) {
          const properties = element.properties;
          const rows = properties.rows || 3;
          const columns = properties.columns || 3;
          const borderWidth = properties.borderWidth || '1px';
          const borderColor = properties.borderColor || '#dee2e6';
          
          return (
            <Section className="p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white">
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  border: `${borderWidth} solid ${borderColor}`,
                }}
              >
                <tbody>
                  {Array.from({ length: rows }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {Array.from({ length: columns }).map((_, colIndex) => (
                        <td 
                          key={colIndex} 
                          style={{
                            border: `${borderWidth} solid ${borderColor}`,
                            padding: '12px',
                            textAlign: 'center',
                            fontSize: '14px',
                          }}
                        >
                          Cell {rowIndex + 1}-{colIndex + 1}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          );
        }
        break;

      case 'divider':
        if (isDividerElement(element)) {
          const properties = element.properties;
          return (
            <Section className="p-6 flex items-center justify-center bg-white">
              <Hr 
                style={{
                  width: '100%',
                  height: properties.height || '2px',
                  backgroundColor: properties.color || '#dee2e6',
                  border: 'none',
                  margin: properties.margin || '20px 0',
                }}
              />
            </Section>
          );
        }
        break;

              case 'link':
        if (isLinkElement(element)) {
          const properties = element.properties;
          return (
            <Section className="p-6 border-2 border-dashed border-gray-300 rounded-lg min-h-[60px] flex items-center justify-center bg-white">
              <Link
                href={properties.url || '#'}
                style={{
                  color: properties.color || '#007bff',
                  textDecoration: properties.underline ? 'underline' : 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                }}
              >
                {properties.text || 'Link Text'}
              </Link>
            </Section>
          );
        }
        break;

        case 'custom-html':
        if (isCustomHTMLElement(element)) {
          const properties = element.properties;
          const isCompleteTemplate = properties.isCompleteTemplate;
          
          return (
            <Section className="p-6 border-2 border-dashed border-gray-300 rounded-lg min-h-[200px] bg-white">
              <div className="mb-3">
                <div className={`text-xs px-2 py-1 rounded font-medium ${
                  isCompleteTemplate 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {isCompleteTemplate ? '📧 Complete Email Template' : '🔧 Custom HTML'}
                </div>
              </div>
              <div 
                className={`w-full min-h-[150px] border border-gray-200 rounded p-3 ${
                  isCompleteTemplate ? 'bg-blue-50' : 'bg-gray-50'
                }`}
                dangerouslySetInnerHTML={{ __html: properties.html || '<div>Custom HTML content</div>' }}
              />
              {isCompleteTemplate && (
                <div className="mt-3 text-xs text-blue-600 bg-blue-100 px-3 py-2 rounded">
                  <strong>Note:</strong> This is a complete email template. The HTML will be rendered as-is in the final output.
                </div>
              )}
            </Section>
          );
        }
        break;

      default:
        return (
          <Section className="p-6 border-2 border-dashed border-gray-300 rounded-lg min-h-[80px] flex items-center justify-center bg-white">
            <Text style={{ fontSize: '16px', color: '#666' }}>{element.name}</Text>
          </Section>
        );
    }

    // Fallback for unhandled cases
    return (
      <Section className="p-6 border-2 border-dashed border-gray-300 rounded-lg min-h-[80px] flex items-center justify-center bg-white">
        <Text style={{ fontSize: '16px', color: '#666' }}>{element.name}</Text>
      </Section>
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative cursor-pointer transition-all duration-200 mb-4",
        isSelected && "ring-2 ring-blue-500 ring-offset-4 bg-blue-50",
        isDragging && "opacity-50"
      )}
    >
      
      
      {/* Element content - fully clickable for selection */}
      <div 
        className="ml-6 cursor-pointer"
        onClick={handleClick}
      >
        {renderElementContent()}
      </div>
      
      {/* Element label */}
      <div className="absolute flex -top-3 left-6 bg-blue-500 text-white text-xs px-2 py-1 rounded">
        
      <div 
        className="rounded-t cursor-grab active:cursor-grabbing "
        {...attributes}
        {...listeners}
      >
        {/* <div className="flex gap-1">
          <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
        </div> */}
        <GripHorizontal className='w-4 h-4'/>
      </div>
      {element.name}
        {/* Drag handle at the top */}
      </div>
    </div>
  );
}

export default function Canvas() {
  const { state, selectElement, reorderElements } = useEmailTemplate();

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if clicking directly on the canvas background
    // Don't deselect if clicking on an element (event will be handled by element)
    if (e.target === e.currentTarget) {
      selectElement(null);
    }
  };

  const handleElementSelect = (elementId: string) => {
    selectElement(elementId);
  };

  // Drag start handler - currently not needed

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = state.template.elements.findIndex(el => el.id === active.id);
      const newIndex = state.template.elements.findIndex(el => el.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(state.template.elements, oldIndex, newIndex);
        const elementIds = newOrder.map(el => el.id);
        reorderElements(elementIds);
      }
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 relative overflow-auto">
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div 
          className="relative w-full max-w-4xl mx-auto py-8 px-8"
          onClick={handleCanvasClick}
        >
          {/* Canvas grid background */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-50" />
          
          {/* Instructions */}
          <div className="relative z-10 mb-8 text-center">
            <p className="text-gray-600 text-sm">
              Click on any element to select it and edit its styles in the right sidebar
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Drag the grip at the top of elements to reorder them • Click on elements to edit styles
            </p>
          </div>
          
          {/* Email elements container */}
          <SortableContext 
            items={state.template.elements.map(el => el.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="relative">
              {state.template.elements.map((element) => (
                <CanvasElement
                  key={element.id}
                  element={element}
                  isSelected={state.selectedElementId === element.id}
                  onSelect={handleElementSelect}
                />
              ))}
            </div>
          </SortableContext>
          
          {/* Empty state */}
          {state.template.elements.length === 0 && (
            <div className="relative z-10 text-center py-20">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-gray-400 text-4xl">📧</span>
              </div>
              <h3 className="text-2xl font-medium text-gray-600 mb-3">Start Building Your Email</h3>
              <p className="text-gray-500 text-lg max-w-md mx-auto">
                Click on blocks from the sidebar to add them to your canvas. 
                New elements are auto-selected, or click on any element to edit their styles. You can rearrange elements by dragging them up and down.
              </p>
            </div>
          )}
        </div>
      </DndContext>
    </div>
  );
}
