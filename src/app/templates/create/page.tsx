"use client";

import React from 'react';
import Canvas from '@/components/Email/Canvas';
import { HTMLCodeModal } from '@/components/HTMLCodeModal';

export default function CreateTemplatePage() {
  return (
    <>
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-900">Create Email Template</h1>
          <div className="text-sm text-gray-500">Click on blocks to add them, then select elements to edit styles</div>
        </div>
        <div className="flex items-center gap-2">
          <HTMLCodeModal />
        </div>
      </div>
      
      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        <Canvas />
      </div>
    </>
  );
}
