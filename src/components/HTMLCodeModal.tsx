"use client";

import React, { useState, useEffect } from 'react';
import { useEmailTemplate } from '@/contexts/EmailTemplateContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Code, Copy, Download, RefreshCw, Save } from 'lucide-react';

export function HTMLCodeModal() {
  const { generateEmailHTML, addElement } = useEmailTemplate();
  const [htmlCode, setHtmlCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isCustomHTML, setIsCustomHTML] = useState(false);
  const [isCompleteTemplate, setIsCompleteTemplate] = useState(false);
  const [saveMode, setSaveMode] = useState<'element' | 'template'>('element');

  const loadHTMLCode = async () => {
    setIsLoading(true);
    try {
      const html = await generateEmailHTML();
      setHtmlCode(html);
      setIsCustomHTML(false);
      setIsCompleteTemplate(false);
      setSaveMode('element');
    } catch {
      console.error('Error generating HTML');
      showToastMessage('Failed to generate HTML code', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(htmlCode);
      showToastMessage('HTML code copied to clipboard!', 'success');
    } catch {
      showToastMessage('Failed to copy code', 'error');
    }
  };

  const handleDownloadHTML = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-template.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToastMessage('HTML file downloaded!', 'success');
  };

  const handleHTMLChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHTML = e.target.value;
    setHtmlCode(newHTML);
    setIsCustomHTML(true);
    
    // Check if this looks like a complete email template
    const isComplete = newHTML.includes('<html') && 
                      newHTML.includes('<head') && 
                      newHTML.includes('<body') &&
                      newHTML.includes('</html>');
    
    setIsCompleteTemplate(isComplete);
    setSaveMode(isComplete ? 'template' : 'element');
  };

  const handleSaveHTML = () => {
    if (!htmlCode.trim()) {
      showToastMessage('Please enter HTML code to save', 'error');
      return;
    }

    try {
      if (saveMode === 'template') {
        // Replace entire template with custom HTML
        // For now, we'll add it as a custom HTML element but mark it as a complete template
        addElement('custom-html', 'Complete Email Template', undefined, {
          html: htmlCode,
          isCustom: true,
          isCompleteTemplate: true,
        });
        showToastMessage('Complete email template saved successfully!', 'success');
      } else {
        // Add as a custom HTML element
        addElement('custom-html', 'Custom HTML Template', undefined, {
          html: htmlCode,
          isCustom: true,
          isCompleteTemplate: false,
        });
        showToastMessage('Custom HTML saved successfully!', 'success');
      }
      
      setIsCustomHTML(false);
      setIsCompleteTemplate(false);
      setSaveMode('element');
      
      // Close the modal after saving
      setIsOpen(false);
    } catch {
      showToastMessage('Failed to save HTML code', 'error');
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadHTMLCode();
    }
  }, [isOpen]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Code className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent 
          className="!w-[90vw] !max-w-[1200px] max-h-[90vh] overflow-hidden"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Email HTML Code
            </DialogTitle>
            <DialogDescription>
              View and edit the generated HTML code for your email template, or paste your own custom HTML code. 
              This code uses table-based layout for maximum email client compatibility.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Label htmlFor="html-code">HTML Code</Label>
                {isCompleteTemplate && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    <span>📧</span>
                    Complete Email Template Detected
                  </div>
                )}
                {isCustomHTML && !isCompleteTemplate && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    <span>🔧</span>
                    Custom HTML Element
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadHTMLCode}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCode}
                    disabled={!htmlCode}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadHTML}
                    disabled={!htmlCode}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSaveHTML}
                    disabled={!htmlCode || !isCustomHTML}
                    className={`${
                      saveMode === 'template' 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saveMode === 'template' ? 'Save as Template' : 'Save as Element'}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="relative">
                             <textarea
                 id="html-code"
                 value={htmlCode}
                 onChange={handleHTMLChange}
                 className="w-full h-[500px] p-4 font-mono text-sm bg-gray-900 text-gray-100 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                 placeholder="Loading HTML code... or paste your custom HTML here"
                 spellCheck={false}
               />
              {isLoading && (
                <div className="absolute inset-0 bg-gray-900/50 rounded-lg flex items-center justify-center">
                  <div className="flex items-center gap-2 text-white">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Generating HTML...</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p><strong>Note:</strong> This HTML code is optimized for email clients and uses table-based layout.</p>
              <p><strong>Complete Email Template:</strong> If you paste a full HTML email (with &lt;html&gt;, &lt;head&gt;, &lt;body&gt; tags), it will be detected and saved as a complete template.</p>
              <p><strong>Custom HTML Element:</strong> If you paste HTML fragments or components, they will be saved as individual elements in your template.</p>
              <p><strong>Compatibility:</strong> Works with Gmail, Outlook, Apple Mail, and other major email clients.</p>
              <p><strong>Features:</strong> Responsive design, inline CSS, and semantic HTML structure.</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <Button onClick={handleSaveHTML} disabled={!htmlCode || !isCustomHTML}>
              <Save className="h-4 w-4 mr-2" />
              Save HTML
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Simple Toast */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
          toastType === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {toastMessage}
        </div>
      )}
    </>
  );
}
