# Instagram Carousel Generator Frontend

A modern React frontend for generating Instagram carousel posts using AI. This application connects to a FastAPI backend that uses Google Gemini to create carousel content and converts it into beautiful HTML slides.

## Features

- **Modern UI** - Beautiful gradient design with Tailwind CSS
- **AI-Powered** - Integrates with Google Gemini via LangChain
- **Carousel Preview** - Live preview of generated carousel slides
- **Export Options** - Download as HTML or individual PNG images
- **Real-time Loading** - Smooth loading states and error handling
- **TypeScript** - Full type safety throughout the application

## Prerequisites

- Node.js 14+ 
- FastAPI backend running on port 8000 (or configured via environment variable)

## Getting Started

### Installation

1. Clone the repository and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` to match your backend URL:
```
REACT_APP_API_URL=http://localhost:8000
```

### Running the Application

Start the development server:
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Usage

1. **Fill in the form** with your carousel details:
   - Post title
   - Account information (name, username, profile image)
   - Description of the carousel content
   - Number of slides (1-10)

2. **Click "Generate Carousel"** to create your carousel using AI

3. **Preview and download** the results:
   - View the carousel in the built-in preview
   - Download as HTML file
   - Download individual slide images (if available)

## Project Structure

```
src/
├── components/
│   ├── CarouselForm.tsx      # Main form component
│   └── CarouselPreview.tsx   # Preview and download component
├── services/
│   └── api.ts               # API service layer
├── types/
│   └── index.ts             # TypeScript type definitions
├── App.tsx                  # Main application component
└── index.css                # Global styles with Tailwind
```

## Available Scripts

### `npm start`
Runs the app in development mode.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
**Note: this is a one-way operation.** Ejects from Create React App configuration.

## API Integration

The frontend expects a FastAPI backend with the following endpoint:

```
POST /generate-carousel
Content-Type: application/json

{
  "title": "string",
  "account": {
    "name": "string", 
    "username": "string",
    "image": "string (optional)"
  },
  "description": "string",
  "slides": "number (1-10)"
}
```

Response:
```json
{
  "html": "string",
  "images": ["string"] (optional),
  "success": "boolean",
  "error": "string" (optional)
}
```

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
