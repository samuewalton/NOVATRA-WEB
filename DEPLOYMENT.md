# NOVATRA Vercel Deployment Guide

## Prerequisites

- [Vercel Account](https://vercel.com/signup)
- [Gemini API Key](https://ai.google.dev/)
- Node.js 20+ installed locally for testing

## Quick Start

### 1. Deploy to Vercel

#### Option A: Deploy from GitHub (Recommended)
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/new)
3. Click "Import Project"
4. Select your GitHub repository
5. Vercel will auto-detect Vite configuration
6. Click "Deploy"

#### Option B: Deploy using Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

### 2. Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variable:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key from https://ai.google.dev/
   - **Environments**: Production, Preview, Development

3. **Important**: Click "Save" and then redeploy your project for changes to take effect

### 3. Verify Deployment

After deployment:
1. Visit your deployed URL
2. Test the chat functionality
3. Check that images load correctly
4. Verify all features work

## Local Development

### Setup
```bash
npm install
```

### Create `.env.local` file
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

### Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

### Build and Test Locally
```bash
npm run build
npm run preview
```

Visit `http://localhost:4173`

## Architecture Overview

### Vercel Serverless Functions (API Routes)

The following API endpoints handle Gemini AI features:

- **`/api/gemini-chat.ts`** - Chat conversation with Rani AI assistant
- **`/api/gemini-tts.ts`** - Text-to-speech generation
- **`/api/gemini-image.ts`** - Room preview image generation
- **`/api/gemini-reviews.ts`** - Product review summarization

### Security

✅ **API Key Security**: The Gemini API key is **never** exposed to the client
- All Gemini API calls go through Vercel serverless functions
- API key is stored securely in Vercel environment variables
- Client-side code only calls `/api/*` endpoints

✅ **Security Headers**: Configured in `vercel.json`
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

## Build Configuration

### Project Structure
```
NOVATRA-WEB/
├── api/                    # Vercel serverless functions
│   ├── gemini-chat.ts
│   ├── gemini-tts.ts
│   ├── gemini-image.ts
│   └── gemini-reviews.ts
├── src/
│   └── index.css           # Tailwind CSS entry point
├── components/             # React components
├── pages/                  # Page components
├── context/                # React contexts
├── services/               # API service wrappers
├── data/                   # Static data
├── dist/                   # Build output (gitignored)
├── vercel.json             # Vercel configuration
├── tailwind.config.js      # Tailwind CSS config
├── postcss.config.js       # PostCSS config
├── vite.config.ts          # Vite bundler config
└── tsconfig.json           # TypeScript config
```

### Key Files

**vercel.json**
- Configures SPA routing (rewrites all routes to /index.html)
- Sets security headers
- Configures build settings

**vite.config.ts**
- Vite bundler configuration
- Path aliases
- Development server settings

**tailwind.config.js**
- Tailwind CSS configuration
- Custom colors and fonts
- Content paths

## Troubleshooting

### Build Fails

**Error**: `GEMINI_API_KEY environment variable is not set`
- **Solution**: Add `GEMINI_API_KEY` in Vercel dashboard → Settings → Environment Variables → Redeploy

**Error**: TypeScript compilation errors
- **Solution**: Run `npm run build` locally to identify issues
- Check tsconfig.json excludes `functions` directory

### Runtime Errors

**Chat not working**
- Check Vercel function logs in dashboard
- Verify `GEMINI_API_KEY` is set correctly
- Test API endpoint: `curl https://your-domain.vercel.app/api/gemini-chat`

**Images not loading**
- Verify images are in `public/` directory (not root)
- Check image paths in `data/products.ts`
- Use absolute paths like `/images/product.jpg`

**Styling issues**
- Ensure Tailwind CSS is properly configured
- Check `src/index.css` is imported in `index.tsx`
- Verify `postcss.config.js` and `tailwind.config.js` exist

### Performance

**Slow initial load**
- Optimize images (use WebP format, lazy loading)
- Consider code splitting for large pages
- Enable Vercel Edge caching

**API timeout**
- Gemini API calls have 10-second default timeout
- For longer operations, consider streaming responses
- Monitor Vercel function execution time

## Migration from Firebase

This project was originally built for Google AI Studio + Firebase and has been migrated to Vercel. Key changes:

1. **Firebase Functions** → **Vercel Serverless Functions**
   - `functions/src/index.ts` → `api/*.ts`
   - Firebase HTTP functions → Vercel API routes

2. **Client-side Gemini SDK** → **Server-side API proxy**
   - `@google/genai` calls moved server-side
   - Client now calls `/api/*` endpoints

3. **CDN Dependencies** → **npm bundling**
   - Removed import maps from `index.html`
   - Dependencies bundled via Vite

4. **CDN Tailwind** → **Build-time Tailwind**
   - Proper PostCSS integration
   - PurgeCSS for optimized CSS

## Support

For issues or questions:
- Check [Vercel Documentation](https://vercel.com/docs)
- Review [Vite Documentation](https://vitejs.dev/)
- Check [Gemini API Documentation](https://ai.google.dev/docs)

## License

[Add your license information here]
