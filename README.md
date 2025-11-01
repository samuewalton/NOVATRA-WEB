# NOVATRA - Baby Furniture E-Commerce Platform

Modern, responsive e-commerce platform for NOVATRA, the official Israeli importer of Veres baby furniture.

## Features

- 🛍️ Full-featured product catalog with filtering
- 🤖 AI-powered chat assistant (Rani) using Google Gemini
- 🎨 Room preview generator with AI image editing
- 🌐 Multi-language support (Hebrew, English, Russian)
- 📱 Responsive design with mobile-first approach
- 🔒 Secure server-side API key management
- ⚡ Fast performance with Vite bundler

## Quick Start

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your Gemini API key

3. **Run development server**:
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`

4. **Build for production**:
   ```bash
   npm run build
   npm run preview
   ```

### Deploy to Vercel

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete deployment instructions.

**Quick Deploy**:
1. Push to GitHub
2. Import project in Vercel
3. Add `GEMINI_API_KEY` environment variable
4. Deploy!

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Build Tool**: Vite 5
- **AI**: Google Gemini API (2.5-pro, 2.5-flash)
- **Deployment**: Vercel (Serverless Functions)
- **Styling**: Tailwind CSS with PostCSS

## Project Structure

```
├── api/              # Vercel serverless functions
├── components/       # React components
├── pages/            # Page components
├── context/          # React contexts
├── services/         # API services
├── data/             # Static data
└── src/             # Assets and styles
```

## Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Complete Vercel deployment instructions
- [Update Instructions](./UPDATE_INSTRUCTIONS.md) - Image upload instructions

## License

All rights reserved.
