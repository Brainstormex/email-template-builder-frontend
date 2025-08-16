"use client";

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { EditorSidebar } from './EditorSidebar';
import { SettingsSidebar } from './SettingsSidebar';
import { SortableSidebar } from './SortableSidebar';

type SidebarId = 'editor' | 'settings';

interface DraggableSidebarContainerProps {
  children: React.ReactNode;
}

// Map of sidebar IDs to their components
const sidebarComponentMap = {
  editor: EditorSidebar,
  settings: SettingsSidebar,
};

export function DraggableSidebarContainer({ children }: DraggableSidebarContainerProps) {
  const [sidebarOrder, setSidebarOrder] = useState<SidebarId[]>(['editor', 'settings']);
  const [activeSidebarId, setActiveSidebarId] = useState<SidebarId | null>(null);
  const [dragOverId, setDragOverId] = useState<SidebarId | null>(null);
  const [isGhostMode, setIsGhostMode] = useState(true); // Toggle between ghost and real-time

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveSidebarId(event.active.id as SidebarId);
  }

  function handleDragOver(event: DragOverEvent) {
    if (event.over) {
      setDragOverId(event.over.id as SidebarId);
      
      // Real-time switching: immediately reorder during drag
      if (!isGhostMode && activeSidebarId && event.over.id !== activeSidebarId) {
        setSidebarOrder((items) => {
          const oldIndex = items.indexOf(activeSidebarId);
          const newIndex = items.indexOf(event.over!.id as SidebarId);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    // Ghost switching: only reorder on drop
    if (isGhostMode && over && active.id !== over.id) {
      setSidebarOrder((items) => {
        const oldIndex = items.indexOf(active.id as SidebarId);
        const newIndex = items.indexOf(over.id as SidebarId);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    
    // Clear drag states
    setActiveSidebarId(null);
    setDragOverId(null);
  }

  // Define a smooth drop animation
  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };
  const ActiveSidebarComponent = activeSidebarId ? sidebarComponentMap[activeSidebarId] : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Toggle between Ghost and Real-time modes */}
      <div className="absolute top-4 right-4 z-50 bg-white border border-gray-300 rounded-lg p-2 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Drag Mode:</span>
          <button
            onClick={() => setIsGhostMode(true)}
            className={`px-3 py-1 text-xs rounded ${
              isGhostMode 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Ghost
          </button>
          <button
            onClick={() => setIsGhostMode(false)}
            className={`px-3 py-1 text-xs rounded ${
              !isGhostMode 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Real-time
          </button>
        </div>
      </div>

      <SortableContext 
        items={isGhostMode ? [] : sidebarOrder} 
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left sidebar - always render */}
          <div className="relative flex-shrink-0">
            {(() => {
              const leftSidebarId = sidebarOrder[0];
              const LeftComponent = sidebarComponentMap[leftSidebarId];
              return (
                <>
                  {/* Blue dashed border overlay - only when this is the drop target */}
                  {dragOverId === leftSidebarId && activeSidebarId && activeSidebarId !== leftSidebarId && (
                    <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none z-10" />
                  )}
                  <SortableSidebar id={leftSidebarId}>
                    <LeftComponent side="left" />
                  </SortableSidebar>
                </>
              );
            })()}
          </div>

          {/* Main content */}
          <main className="flex-1 pt-4 px-4 overflow-auto">
            {children}
          </main>

          {/* Right sidebar - always render */}
          <div className="relative flex-shrink-0">
            {(() => {
              const rightSidebarId = sidebarOrder[1];
              const RightComponent = sidebarComponentMap[rightSidebarId];
              return (
                <>
                  {/* Blue dashed border overlay - only when this is the drop target */}
                  {dragOverId === rightSidebarId && activeSidebarId && activeSidebarId !== rightSidebarId && (
                    <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none z-10" />
                  )}
                  <SortableSidebar id={rightSidebarId}>
                    <RightComponent side="right" />
                  </SortableSidebar>
                </>
              );
            })()}
          </div>
        </div>
      </SortableContext>

      <DragOverlay dropAnimation={dropAnimation}>
        {ActiveSidebarComponent ? (
          <ActiveSidebarComponent side="left" />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
