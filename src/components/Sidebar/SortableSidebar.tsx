"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconGripHorizontal } from '@tabler/icons-react';

interface SortableSidebarProps {
  id: string;
  children: React.ReactNode;
}

export function SortableSidebar({ id, children }: SortableSidebarProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms ease',
    opacity: isDragging ? 0.5 : 1, // Just reduce opacity when dragging, don't hide
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="h-full w-64" // Fixed width to prevent layout shifts
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute top-2 right-2 z-30 p-1 cursor-move hover:bg-gray-100 rounded transition-colors"
        title="Drag to reorder sidebars"
      >
        <IconGripHorizontal className="w-4 h-4 text-gray-500" />
      </div>
      
      {/* Sidebar Content */}
      <div className="h-full">
        {children}
      </div>
    </div>
  );
}
