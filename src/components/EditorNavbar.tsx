"use client";

import React from 'react';
import { useEmailTemplate } from '@/contexts/EmailTemplateContext';
import { Button } from '@/components/ui/button';
import { PillButtonGroup } from '@/components/custom/PillButtonGroup';
import { HTMLCodeModal } from '@/components/HTMLCodeModal';
import { Undo2, Redo2, Code } from 'lucide-react';

export default function EditorNavbar() {
  const { undo, redo, canUndo, canRedo } = useEmailTemplate();

  const buttons = [
    {
      icon: Undo2,
      onClick: undo,
      disabled: !canUndo,
      tooltip: 'Undo',
    },
    {
      icon: Redo2,
      onClick: redo,
      disabled: !canRedo,
      tooltip: 'Redo',
    },
  ];

  return (
    <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900">Email Template Builder</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <HTMLCodeModal />
        <PillButtonGroup buttons={buttons} />
      </div>
    </div>
  );
}
