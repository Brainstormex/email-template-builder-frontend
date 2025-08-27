# Email Template Builder

A modern, drag-and-drop email template builder built with Next.js, React, and TypeScript.

## Features

### 🎨 Visual Editor
- Drag-and-drop interface for building email templates
- Real-time preview of email elements
- Responsive canvas with grid background

### 🧩 Block System
- Pre-built email blocks (Text, Image, Button, Table, Divider, Link, Custom HTML)
- Categorized blocks (Content, Media, Interactive, Layout)
- Easy block management and organization

### ✨ Styles Editor
- **Image Block Editor**: Comprehensive styling options for images including:
  - Alignment controls (Left, Center, Right)
  - Size controls with presets
  - Border radius and corner styles
  - Rollover effects
  - Anchor links
  - Margin controls with linked/unlinked options
  - Output format selection (HTML, AMP, Both)
- Context-aware editing based on selected element type
- Real-time property updates

### 🔧 Technical Features
- Type-safe email schema with Zod validation
- React Email integration for email generation
- Drag and drop reordering with @dnd-kit
- Undo/Redo functionality
- HTML code export and customization

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd email-template-builder
```

2. Install dependencies
```bash
cd frontend
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:5004](http://localhost:5004) in your browser

## Usage

### Creating a Template

1. Navigate to `/templates/create`
2. Drag blocks from the left sidebar onto the canvas
3. Click on any element to select it
4. Use the right sidebar to edit element properties and styles

### Image Block Styling

When an image block is selected, the styles editor provides:

- **Image Preview**: Shows current image with file details
- **Link Settings**: Configure image hyperlinks
- **Alternate Text**: Set accessibility text
- **Size Controls**: Adjust width with presets and manual input
- **Alignment**: Choose left, center, or right alignment
- **Radius**: Control corner roundness with number input and style presets
- **Rollover Effects**: Enable hover image changes
- **Anchor Links**: Add clickable links to images
- **Margins**: Set top, right, bottom, left margins with linked/unlinked options
- **Output Format**: Choose HTML, AMP, or both formats

### Element Selection

- Click on any element in the canvas to select it
- Selected elements show a blue ring and background highlight
- The styles editor automatically shows relevant controls for the selected element type
- Use the undo/redo buttons in the styles editor to manage changes

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app router
│   ├── components/             # React components
│   │   ├── Email/             # Email-specific components
│   │   ├── Sidebar/           # Sidebar components
│   │   ├── ui/                # UI component library
│   │   └── StylesEditor.tsx   # Main styles editor
│   ├── contexts/              # React contexts
│   └── lib/                   # Utilities and schemas
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
