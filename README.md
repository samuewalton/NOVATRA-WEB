<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# NOVATRA eCommerce Platform

A modern, AI-powered eCommerce platform for NOVATRA - the official Israeli importer of Veres baby furniture from Ukraine. Built with React, TypeScript, and powered by Google Gemini AI.

View your app in AI Studio: https://ai.studio/apps/drive/1ZJWp8KCxmiGX2xZIYKA7vga2nBC1DOTR

## Features

- **AI Shopping Assistant (Rani)** - Conversational AI assistant powered by Gemini 2.5 Pro with function calling
- **Virtual Room Designer** - Visualize furniture in your room using Gemini image editing
- **Text-to-Speech** - Product descriptions read aloud using Gemini TTS
- **Smart Review Analysis** - AI-powered review summarization
- **Multi-language Support** - Hebrew (RTL), English, and Russian
- **Shopping Cart & Wishlist** - Full eCommerce functionality
- **Admin Dashboard** - Product management interface
- **Responsive Design** - Mobile-first design with Tailwind CSS

## Tech Stack

**Frontend:**
- React 19.2.0
- TypeScript 5.5.3
- Vite 5.3.3
- Tailwind CSS 3.4.4
- Google GenAI 1.27.0

**Backend:**
- Firebase Hosting
- Firebase Cloud Functions (Node.js 20)
- Firebase Admin SDK

## Prerequisites

- Node.js 18+ (recommended: Node.js 20)
- npm or yarn
- Google Gemini API key ([Get one here](https://ai.google.dev/gemini-api/docs/api-key))
- Firebase CLI (for deployment)

## Local Development Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd NOVATRA-WEB
```

### 2. Install dependencies

```bash
# Install frontend dependencies
npm install

# Install Firebase Functions dependencies
cd functions
npm install
cd ..
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 4. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Firebase Setup (for deployment)

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing "novatra-ecommerce")
3. Enable Firebase Hosting and Cloud Functions

### 4. Update Firebase project ID

Edit `.firebaserc` if your project ID is different:

```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

### 5. Configure Firebase Functions environment

Set the Gemini API key for production:

```bash
firebase functions:config:set gemini.api_key="your_gemini_api_key_here"
```

Or use environment variables in `.env` file in the `functions/` directory:

```bash
cd functions
cp .env.example .env
# Edit .env and add your API key
```

## Building for Production

Build the frontend:

```bash
npm run build
```

This creates optimized production files in the `dist/` directory.

## Deployment

### Deploy to Firebase

Deploy both hosting and functions:

```bash
firebase deploy
```

Or deploy separately:

```bash
# Deploy only hosting
firebase deploy --only hosting

# Deploy only functions
firebase deploy --only functions
```

## Project Structure

```
NOVATRA-WEB/
├── components/           # React UI components
│   ├── icons/           # SVG icon components
│   ├── Header.tsx       # Navigation header
│   ├── Footer.tsx       # Site footer
│   ├── ChatWidget.tsx   # AI assistant chat interface
│   └── ...              # Other components
├── pages/               # Page-level components
│   ├── HomePage.tsx     # Landing page
│   ├── CatalogPage.tsx  # Product catalog
│   ├── ProductPage.tsx  # Product details
│   └── ...              # Other pages
├── context/             # React Context (state management)
│   ├── CartContext.tsx  # Shopping cart state
│   ├── ChatContext.tsx  # AI chat state
│   └── ...              # Other contexts
├── services/            # Business logic & API services
│   └── geminiService.ts # Gemini AI integration
├── data/                # Static data & seed data
│   ├── products.ts      # Product catalog
│   ├── translations.ts  # i18n strings
│   └── ...              # Other data
├── functions/           # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts     # Gemini API proxy
│   └── package.json
├── public/              # Static assets (will be created)
├── types.ts             # TypeScript type definitions
├── App.tsx              # Root React component
├── index.tsx            # React DOM entry point
├── index.html           # HTML entry point
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── firebase.json        # Firebase configuration
└── package.json         # NPM dependencies
```

## Environment Variables

### Frontend (.env.local)
- `GEMINI_API_KEY` - Google Gemini API key (for development only)

### Firebase Functions
- `GEMINI_API_KEY` - Google Gemini API key (set via Firebase config or .env)

**Security Note:** In production, the API key should only be stored in Firebase Functions environment, not exposed to the frontend.

## API Integration

The app uses Google Gemini API for AI features:

1. **Chat Assistant** - Uses Gemini 2.5 Pro with function calling for:
   - Product search
   - Shopping cart management
   - Product recommendations
   - General customer support

2. **Text-to-Speech** - Uses Gemini 2.5 Flash TTS for audio generation

3. **Virtual Room Designer** - Uses Gemini 2.5 Flash Image for room visualization

4. **Review Summarization** - Uses Gemini 2.5 Flash with structured output

All API calls should go through the `/api/gemini` proxy (Firebase Function) in production.

## Troubleshooting

### API Key Issues

If you see "API_KEY environment variable not set":
1. Ensure `.env.local` exists in the root directory
2. Restart the dev server after creating/editing `.env.local`
3. Check that the variable name is exactly `GEMINI_API_KEY`

### Firebase Functions Not Working

1. Check that you've installed functions dependencies: `cd functions && npm install`
2. Verify the API key is configured: `firebase functions:config:get`
3. Check function logs: `firebase functions:log`

### Build Errors

1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Clear build cache: `rm -rf dist`
3. Ensure TypeScript version matches: `npm list typescript`

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Proprietary - NOVATRA Ltd.

## Support

For technical support, contact: [support@novatra.co.il](mailto:support@novatra.co.il)
