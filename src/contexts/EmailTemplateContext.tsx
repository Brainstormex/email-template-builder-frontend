"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { EmailElement, EmailTemplate, createEmailElement } from '@/lib/email-schema';
import { render } from '@react-email/render';
import { 
  Container, 
  Text, 
  Img, 
  Button, 
  Hr, 
  Link,
  Section,
  Html,
  Head,
  Body
} from '@react-email/components';

// Action types
type EmailTemplateAction =
  | { type: 'ADD_ELEMENT'; element: EmailElement; parentId?: string }
  | { type: 'REMOVE_ELEMENT'; elementId: string }
  | { type: 'UPDATE_ELEMENT'; elementId: string; updates: Partial<EmailElement> }
  | { type: 'MOVE_ELEMENT'; elementId: string; newParentId?: string }
  | { type: 'REORDER_ELEMENTS'; elementIds: string[] }
  | { type: 'SELECT_ELEMENT'; elementId: string | null }
  | { type: 'SET_TEMPLATE'; template: EmailTemplate }
  | { type: 'RESET_TEMPLATE' }
  | { type: 'UNDO' }
  | { type: 'REDO' };

// State interface
interface EmailTemplateState {
  template: EmailTemplate;
  selectedElementId: string | null;
  history: EmailTemplateState[];
  historyIndex: number;
}

// Initial state
const initialState: EmailTemplateState = {
  template: {
    id: `template-${Date.now()}`,
    name: 'New Email Template',
    elements: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  selectedElementId: null,
  history: [],
  historyIndex: -1,
};

// Reducer function
function emailTemplateReducer(state: EmailTemplateState, action: EmailTemplateAction): EmailTemplateState {
  switch (action.type) {
    case 'ADD_ELEMENT': {
      const newElement = action.element;
      let newElements = [...state.template.elements];
      
      if (action.parentId) {
        // Add as child to parent element
        newElements = addElementToParent(newElements, action.parentId, newElement);
      } else {
        // Add to root level
        newElements.push(newElement);
      }
      
      const newState = {
        ...state,
        template: {
          ...state.template,
          elements: newElements,
          updatedAt: new Date(),
        },
        selectedElementId: newElement.id,
      };
      
      return saveToHistory(newState);
    }

    case 'REMOVE_ELEMENT': {
      const newElements = removeElementById(state.template.elements, action.elementId);
      const newState = {
        ...state,
        template: {
          ...state.template,
          elements: newElements,
          updatedAt: new Date(),
        },
        selectedElementId: state.selectedElementId === action.elementId ? null : state.selectedElementId,
      };
      return saveToHistory(newState);
    }

    case 'UPDATE_ELEMENT': {
      const newElements = updateElementById(state.template.elements, action.elementId, action.updates);
      const newState = {
        ...state,
        template: {
          ...state.template,
          elements: newElements,
          updatedAt: new Date(),
        },
      };
      return saveToHistory(newState);
    }

    case 'MOVE_ELEMENT': {
      const newElements = moveElementToParent(state.template.elements, action.elementId, action.newParentId);
      return {
        ...state,
        template: {
          ...state.template,
          elements: newElements,
          updatedAt: new Date(),
        },
      };
    }

    case 'REORDER_ELEMENTS': {
      const newElements = reorderElements(state.template.elements, action.elementIds);
      const newState = {
        ...state,
        template: {
          ...state.template,
          elements: newElements,
          updatedAt: new Date(),
        },
      };
      return saveToHistory(newState);
    }

    case 'SET_TEMPLATE': {
      return {
        ...state,
        template: action.template,
        selectedElementId: null,
      };
    }

    case 'SELECT_ELEMENT': {
      return {
        ...state,
        selectedElementId: action.elementId,
      };
    }

    case 'UNDO': {
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        const previousState = state.history[newIndex];
        return {
          ...previousState,
          history: state.history,
          historyIndex: newIndex,
        };
      }
      return state;
    }

    case 'REDO': {
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        const nextState = state.history[newIndex];
        return {
          ...nextState,
          history: state.history,
          historyIndex: newIndex,
        };
      }
      return state;
    }

    case 'RESET_TEMPLATE': {
      return {
        ...state,
        template: initialState.template,
        selectedElementId: null,
      };
    }

    default:
      return state;
  }
}

// Helper functions
function addElementToParent(elements: EmailElement[], parentId: string, newElement: EmailElement): EmailElement[] {
  return elements.map(element => {
    if (element.id === parentId) {
      return {
        ...element,
        children: [...(element.children || []), newElement],
      };
    }
    if (element.children) {
      return {
        ...element,
        children: addElementToParent(element.children, parentId, newElement),
      };
    }
    return element;
  });
}

function removeElementById(elements: EmailElement[], elementId: string): EmailElement[] {
  return elements
    .filter(element => element.id !== elementId)
    .map(element => ({
      ...element,
      children: element.children ? removeElementById(element.children, elementId) : undefined,
    }));
}

function updateElementById(elements: EmailElement[], elementId: string, updates: Partial<EmailElement>): EmailElement[] {
  return elements.map(element => {
    if (element.id === elementId) {
      return {
        ...element,
        ...updates,
        updatedAt: new Date(),
      };
    }
    if (element.children) {
      return {
        ...element,
        children: updateElementById(element.children, elementId, updates),
      };
    }
    return element;
  });
}

function moveElementToParent(elements: EmailElement[], elementId: string, newParentId?: string): EmailElement[] {
  // First, find and remove the element from its current location
  const elementToMove = findElementById(elements, elementId);
  if (!elementToMove) return elements;
  
  let newElements = removeElementById(elements, elementId);
  
  if (newParentId) {
    // Move to new parent
    newElements = addElementToParent(newElements, newParentId, elementToMove);
  } else {
    // Move to root level
    newElements.push(elementToMove);
  }
  
  return newElements;
}

function findElementById(elements: EmailElement[], elementId: string): EmailElement | null {
  for (const element of elements) {
    if (element.id === elementId) return element;
    if (element.children) {
      const found = findElementById(element.children, elementId);
      if (found) return found;
    }
  }
  return null;
}

function reorderElements(elements: EmailElement[], elementIds: string[]): EmailElement[] {
  const elementMap = new Map<string, EmailElement>();
  const otherElements: EmailElement[] = [];
  
  // Separate elements to reorder from others
  elements.forEach(element => {
    if (elementIds.includes(element.id)) {
      elementMap.set(element.id, element);
    } else {
      otherElements.push(element);
    }
  });
  
  // Create new array with reordered elements
  const reorderedElements: EmailElement[] = [];
  elementIds.forEach(id => {
    const element = elementMap.get(id);
    if (element) {
      reorderedElements.push(element);
    }
  });
  
  return [...reorderedElements, ...otherElements];
}

// Helper function to save state to history
function saveToHistory(state: EmailTemplateState): EmailTemplateState {
  const newHistory = [...state.history.slice(0, state.historyIndex + 1), {
    template: state.template,
    selectedElementId: state.selectedElementId,
    history: [],
    historyIndex: -1,
  }];
  
  return {
    ...state,
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
}

// Context interface
interface EmailTemplateContextType {
  state: EmailTemplateState;
  addElement: (type: EmailElement['type'], name: string, parentId?: string) => void;
  removeElement: (elementId: string) => void;
  updateElement: (elementId: string, updates: Partial<EmailElement>) => void;
  moveElement: (elementId: string, newParentId?: string) => void;
  reorderElements: (elementIds: string[]) => void;
  selectElement: (elementId: string | null) => void;
  getElementById: (elementId: string) => EmailElement | null;
  getFlattenedElements: () => EmailElement[];
  generateEmailHTML: () => Promise<string>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

// Create context
const EmailTemplateContext = createContext<EmailTemplateContextType | undefined>(undefined);

// Provider component
export function EmailTemplateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(emailTemplateReducer, initialState);

  const addElement = (type: EmailElement['type'], name: string, parentId?: string, customProperties?: Record<string, unknown>) => {
    const newElement = createEmailElement(type, name, parentId);
    
    // If custom properties are provided, merge them with the element
    if (customProperties) {
      newElement.properties = {
        ...newElement.properties,
        ...customProperties,
      };
    }
    
    dispatch({ type: 'ADD_ELEMENT', element: newElement, parentId });
  };

  const removeElement = (elementId: string) => {
    dispatch({ type: 'REMOVE_ELEMENT', elementId });
  };

  const updateElement = (elementId: string, updates: Partial<EmailElement>) => {
    dispatch({ type: 'UPDATE_ELEMENT', elementId, updates });
  };

  const moveElement = (elementId: string, newParentId?: string) => {
    dispatch({ type: 'MOVE_ELEMENT', elementId, newParentId });
  };

  const reorderElements = (elementIds: string[]) => {
    dispatch({ type: 'REORDER_ELEMENTS', elementIds });
  };

  const selectElement = (elementId: string | null) => {
    dispatch({ type: 'SELECT_ELEMENT', elementId });
  };

  const getElementById = (elementId: string): EmailElement | null => {
    return findElementById(state.template.elements, elementId);
  };

  const getFlattenedElements = (): EmailElement[] => {
    const flattened: EmailElement[] = [];
    
    function flatten(elements: EmailElement[]) {
      elements.forEach(element => {
        flattened.push(element);
        if (element.children) {
          flatten(element.children);
        }
      });
    }
    
    flatten(state.template.elements);
    return flattened;
  };

  const generateEmailHTML = async (): Promise<string> => {
    const renderElement = (element: EmailElement): React.ReactElement => {
      const properties = element.properties || {};
      
      switch (element.type) {
        case 'text':
          return (
            <Section style={{ padding: '24px', textAlign: (properties as any).alignment || 'left' }}>
              <Text style={{
                fontSize: (properties as any).fontSize || '16px',
                color: (properties as any).color || '#000000',
                margin: 0,
                lineHeight: '1.5',
              }}>
                {(properties as any).text || 'Text Block'}
              </Text>
            </Section>
          );
        case 'image':
          return (
            <Section style={{ padding: '24px', textAlign: 'center' }}>
              {(properties as any).src ? (
                <Img
                  src={(properties as any).src}
                  alt={(properties as any).alt || 'Image'}
                  width={(properties as any).width || '100%'}
                  height={(properties as any).height || 'auto'}
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              ) : (
                <div style={{
                  width: '96px',
                  height: '96px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '8px',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9ca3af',
                  fontSize: '12px',
                }}>
                  IMG
                </div>
              )}
            </Section>
          );
        case 'button':
          return (
            <Section style={{ padding: '24px', textAlign: 'center' }}>
              <Button
                style={{
                  backgroundColor: (properties as any).backgroundColor || '#007bff',
                  color: (properties as any).color || '#ffffff',
                  padding: (properties as any).padding || '16px 32px',
                  borderRadius: (properties as any).borderRadius || '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                {(properties as any).text || 'Button'}
              </Button>
            </Section>
          );
        case 'table':
          const rows = (properties as any).rows || 3;
          const columns = (properties as any).columns || 3;
          const borderWidth = (properties as any).borderWidth || '1px';
          const borderColor = (properties as any).borderColor || '#dee2e6';
          
          return (
            <Section style={{ padding: '24px' }}>
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
        case 'divider':
          return (
            <Section style={{ padding: '24px' }}>
              <Hr 
                style={{
                  width: '100%',
                  height: (properties as any).height || '2px',
                  backgroundColor: (properties as any).color || '#dee2e6',
                  border: 'none',
                  margin: (properties as any).margin || '20px 0',
                }}
              />
            </Section>
          );
                 case 'link':
           return (
             <Section style={{ padding: '24px', textAlign: 'center' }}>
               <Link
                 href={(properties as any).url || '#'}
                 style={{
                   color: (properties as any).color || '#007bff',
                   textDecoration: (properties as any).underline ? 'underline' : 'none',
                   fontSize: '16px',
                   fontWeight: '500',
                 }}
               >
                 {(properties as any).text || 'Link Text'}
               </Link>
             </Section>
           );
                   case 'custom-html':
            const isCompleteTemplate = (properties as any).isCompleteTemplate;
            if (isCompleteTemplate) {
              // For complete templates, return the HTML as-is
              return (
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: (properties as any).html || '<div>Custom HTML content</div>' 
                  }}
                />
              );
            } else {
              // For custom HTML elements, wrap in a section
              return (
                <Section style={{ padding: '24px' }}>
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: (properties as any).html || '<div>Custom HTML content</div>' 
                    }}
                  />
                </Section>
              );
            }
         default:
           return (
             <Section style={{ padding: '24px', textAlign: 'center' }}>
               <Text style={{ fontSize: '16px', color: '#666' }}>{element.name}</Text>
             </Section>
           );
      }
    };

    const emailJSX = (
      <Html>
        <Head>
          <title>{state.template.name}</title>
        </Head>
        <Body style={{ margin: 0, padding: 0, backgroundColor: '#f9fafb' }}>
          <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
            {state.template.elements.map((element) => (
              <div key={element.id}>
                {renderElement(element)}
              </div>
            ))}
          </Container>
        </Body>
      </Html>
    );

    return render(emailJSX);
  };

  const undo = () => {
    dispatch({ type: 'UNDO' });
  };

  const redo = () => {
    dispatch({ type: 'REDO' });
  };

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  const value: EmailTemplateContextType = {
    state,
    addElement,
    removeElement,
    updateElement,
    moveElement,
    reorderElements,
    selectElement,
    getElementById,
    getFlattenedElements,
    generateEmailHTML,
    undo,
    redo,
    canUndo,
    canRedo,
  };

  return (
    <EmailTemplateContext.Provider value={value}>
      {children}
    </EmailTemplateContext.Provider>
  );
}

// Hook to use the context
export function useEmailTemplate() {
  const context = useContext(EmailTemplateContext);
  if (context === undefined) {
    throw new Error('useEmailTemplate must be used within an EmailTemplateProvider');
  }
  return context;
}
