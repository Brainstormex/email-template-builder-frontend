import { z } from "zod";

// Define specific property types for each element type
export const TextElementPropertiesSchema = z.object({
  text: z.string(),
  fontSize: z.string(),
  color: z.string(),
  alignment: z.enum(["left", "center", "right"]),
});

export const ImageElementPropertiesSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.string(),
  height: z.string(),
  alignment: z.enum(["left", "center", "right"]),
  radius: z.number(),
  borderRadius: z.enum(["sharp", "rounded"]),
  rolloverEffect: z.boolean(),
  rolloverImage: z.string().optional(),
  anchorLink: z.boolean(),
  linkUrl: z.string().optional(),
  margins: z.object({
    top: z.number(),
    right: z.number(),
    bottom: z.number(),
    left: z.number(),
    linked: z.boolean(),
  }),
  includeIn: z.enum(["both", "html", "amp"]),
});

export const ButtonElementPropertiesSchema = z.object({
  text: z.string(),
  backgroundColor: z.string(),
  color: z.string(),
  padding: z.string(),
  borderRadius: z.string(),
});

export const TableElementPropertiesSchema = z.object({
  rows: z.number(),
  columns: z.number(),
  borderWidth: z.string(),
  borderColor: z.string(),
});

export const DividerElementPropertiesSchema = z.object({
  height: z.string(),
  color: z.string(),
  margin: z.string(),
});

export const LinkElementPropertiesSchema = z.object({
  text: z.string(),
  url: z.string(),
  color: z.string(),
  underline: z.boolean(),
});

export const CustomHTMLElementPropertiesSchema = z.object({
  html: z.string(),
  isCustom: z.boolean(),
  isCompleteTemplate: z.boolean().optional(),
});

// Union type for all element properties
export const ElementPropertiesSchema = z.union([
  TextElementPropertiesSchema,
  ImageElementPropertiesSchema,
  ButtonElementPropertiesSchema,
  TableElementPropertiesSchema,
  DividerElementPropertiesSchema,
  LinkElementPropertiesSchema,
  CustomHTMLElementPropertiesSchema,
]);

// Base email element schema
export const EmailElementSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["header", "content", "footer", "text", "image", "button", "table", "divider", "link", "nav", "social", "logo", "custom-html"]),
  icon: z.string(), // Icon name from lucide-react
  children: z.array(z.lazy(() => EmailElementSchema)).optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }).optional(),
  size: z.object({
    width: z.number(),
    height: z.number(),
  }).optional(),
  properties: z.record(z.unknown()).optional(), // Will be typed based on element type
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Email block schema for the blocks tab
export const EmailBlockSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  category: z.enum(["Content", "Media", "Interactive", "Layout"]),
  defaultProperties: z.record(z.unknown()).optional(),
});

// Email template schema
export const EmailTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  elements: z.array(EmailElementSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Type exports
export type EmailElement = z.infer<typeof EmailElementSchema>;
export type EmailBlock = z.infer<typeof EmailBlockSchema>;
export type EmailTemplate = z.infer<typeof EmailTemplateSchema>;
export type TextElementProperties = z.infer<typeof TextElementPropertiesSchema>;
export type ImageElementProperties = z.infer<typeof ImageElementPropertiesSchema>;
export type ButtonElementProperties = z.infer<typeof ButtonElementPropertiesSchema>;
export type TableElementProperties = z.infer<typeof TableElementPropertiesSchema>;
export type DividerElementProperties = z.infer<typeof DividerElementPropertiesSchema>;
export type LinkElementProperties = z.infer<typeof LinkElementPropertiesSchema>;
export type CustomHTMLElementProperties = z.infer<typeof CustomHTMLElementPropertiesSchema>;

// Union type for all properties
export type ElementProperties = 
  | TextElementProperties 
  | ImageElementProperties 
  | ButtonElementProperties 
  | TableElementProperties 
  | DividerElementProperties 
  | LinkElementProperties
  | CustomHTMLElementProperties;

// Type guard functions
export function isTextElement(element: EmailElement): element is EmailElement & { properties: TextElementProperties } {
  return element.type === 'text';
}

export function isImageElement(element: EmailElement): element is EmailElement & { properties: ImageElementProperties } {
  return element.type === 'image';
}

export function isButtonElement(element: EmailElement): element is EmailElement & { properties: ButtonElementProperties } {
  return element.type === 'button';
}

export function isTableElement(element: EmailElement): element is EmailElement & { properties: TableElementProperties } {
  return element.type === 'table';
}

export function isDividerElement(element: EmailElement): element is EmailElement & { properties: DividerElementProperties } {
  return element.type === 'divider';
}

export function isLinkElement(element: EmailElement): element is EmailElement & { properties: LinkElementProperties } {
  return element.type === 'link';
}

export function isCustomHTMLElement(element: EmailElement): element is EmailElement & { properties: CustomHTMLElementProperties } {
  return element.type === 'custom-html';
}

// Default email blocks
export const defaultEmailBlocks: EmailBlock[] = [
  {
    id: "text",
    name: "Text Block",
    description: "Add text content to your email",
    icon: "Type",
    category: "Content",
    defaultProperties: {
      text: "Enter your text here",
      fontSize: "16px",
      color: "#000000",
      alignment: "left",
    } as TextElementProperties,
  },
  {
    id: "image",
    name: "Image",
    description: "Insert an image into your email",
    icon: "Image",
    category: "Media",
    defaultProperties: {
      src: "",
      alt: "Image description",
      width: "600",
      height: "auto",
      alignment: "center",
      radius: 0,
      borderRadius: "sharp",
      rolloverEffect: false,
      rolloverImage: "",
      anchorLink: false,
      linkUrl: "",
      margins: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        linked: true,
      },
      includeIn: "both",
    } as ImageElementProperties,
  },
  {
    id: "button",
    name: "Button",
    description: "Add a call-to-action button",
    icon: "Square",
    category: "Interactive",
    defaultProperties: {
      text: "Click me",
      backgroundColor: "#007bff",
      color: "#ffffff",
      padding: "12px 24px",
      borderRadius: "4px",
    } as ButtonElementProperties,
  },
  {
    id: "table",
    name: "Table",
    description: "Create a data table",
    icon: "Table",
    category: "Layout",
    defaultProperties: {
      rows: 3,
      columns: 3,
      borderWidth: "1px",
      borderColor: "#dee2e6",
    } as TableElementProperties,
  },
  {
    id: "divider",
    name: "Divider",
    description: "Add a horizontal line",
    icon: "Minus",
    category: "Layout",
    defaultProperties: {
      height: "1px",
      color: "#dee2e6",
      margin: "20px 0",
    } as DividerElementProperties,
  },
  {
    id: "link",
    name: "Link",
    description: "Add a hyperlink",
    icon: "Link",
    category: "Interactive",
    defaultProperties: {
      text: "Click here",
      url: "#",
      color: "#007bff",
      underline: true,
    } as LinkElementProperties,
  },
  {
    id: "custom-html",
    name: "Custom HTML",
    description: "Add your own HTML code",
    icon: "Code",
    category: "Content",
    defaultProperties: {
      html: "<div>Your custom HTML here</div>",
      isCustom: true,
    } as CustomHTMLElementProperties,
  },
];

// Helper function to create a new email element
export function createEmailElement(
  type: EmailElement["type"],
  name: string,
  _parentId?: string // Prefix with underscore to indicate unused parameter
): EmailElement {
  const now = new Date();
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    type,
    icon: getIconForType(type),
    position: { x: 0, y: 0 },
    size: { width: 200, height: 100 },
    properties: getDefaultPropertiesForType(type),
    createdAt: now,
    updatedAt: now,
  };
}

// Helper function to get icon name for element type
function getIconForType(type: EmailElement["type"]): string {
  const iconMap: Record<EmailElement["type"], string> = {
    header: "Type",
    content: "FileText",
    footer: "Type",
    text: "Type",
    image: "Image",
    button: "Square",
    table: "Table",
    divider: "Minus",
    link: "Link",
    nav: "Link",
    social: "Link",
    logo: "Image",
    "custom-html": "Code",
  };
  return iconMap[type] || "Square";
}

// Helper function to get default properties for element type
function getDefaultPropertiesForType(type: EmailElement["type"]): Record<string, unknown> {
  const block = defaultEmailBlocks.find(b => b.id === type);
  return block?.defaultProperties || {};
}
