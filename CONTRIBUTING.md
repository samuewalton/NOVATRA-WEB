# Contributing to NOVATRA eCommerce Platform

Thank you for your interest in contributing to the NOVATRA eCommerce platform! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Standards](#code-standards)
4. [Project Structure](#project-structure)
5. [Testing](#testing)
6. [Submitting Changes](#submitting-changes)

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: Node.js 20)
- npm or yarn
- Git
- Google Gemini API key
- Firebase account (for deployment testing)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NOVATRA-WEB
   ```

2. **Install all dependencies**
   ```bash
   npm run setup
   ```
   This installs both frontend and Firebase Functions dependencies.

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your Gemini API key.

4. **Start the development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature branches (e.g., `feature/payment-integration`)
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Critical production fixes

### Creating a New Feature

1. **Create a feature branch from `develop`**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Follow the project's code standards
   - Add comments for complex logic

3. **Test your changes**
   ```bash
   npm run type-check
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: Add feature description"
   ```

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Standards

### TypeScript

- **Use TypeScript strictly** - Enable strict mode in `tsconfig.json`
- **Define types** - Always define types for function parameters and return values
- **Avoid `any`** - Use specific types or `unknown` instead
- **Use interfaces** - Define interfaces for complex objects

Example:
```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // Implementation
};
```

### React Components

- **Functional Components** - Use functional components with hooks
- **File naming** - Use PascalCase for component files (e.g., `ProductCard.tsx`)
- **Component structure**:
  ```typescript
  import statements

  type/interface definitions

  const Component: React.FC<Props> = ({ props }) => {
    // Hooks
    // Helper functions
    // Event handlers
    // Render
  };

  export default Component;
  ```

### Styling

- **Tailwind CSS** - Use Tailwind utility classes for styling
- **Responsive design** - Mobile-first approach
- **RTL support** - Consider Hebrew (RTL) layout in all designs

### State Management

- **React Context** - Use Context API for global state
- **Local state** - Use `useState` for component-specific state
- **Effects** - Use `useEffect` carefully, always specify dependencies

### Error Handling

- **Try-catch blocks** - Always wrap async operations in try-catch
- **User-friendly messages** - Provide clear error messages for users
- **Console logging** - Log detailed errors to console for debugging

Example:
```typescript
try {
  const result = await fetchData();
  return result;
} catch (error) {
  console.error("Failed to fetch data:", error);
  if (error instanceof Error) {
    console.error("Error details:", error.message);
  }
  throw new Error("Failed to load data. Please try again.");
}
```

## Project Structure

```
NOVATRA-WEB/
├── components/          # Reusable UI components
├── pages/              # Page-level components (routes)
├── context/            # React Context providers
├── services/           # Business logic and API services
├── data/               # Static data and seed data
├── functions/          # Firebase Cloud Functions
├── public/             # Static assets
└── types.ts            # TypeScript type definitions
```

### Adding a New Component

1. Create the component file in `components/`
2. Define TypeScript interfaces for props
3. Implement the component
4. Export the component
5. Add to relevant page or parent component

### Adding a New Page

1. Create the page file in `pages/`
2. Import necessary contexts and components
3. Implement the page logic
4. Update `RouterContext.tsx` to add route

### Adding a New Context

1. Create the context file in `context/`
2. Define context interface
3. Create provider component
4. Export context and hook
5. Add provider to `App.tsx`

## Testing

### Type Checking

```bash
npm run type-check
```

### Build Testing

```bash
npm run build
```

### Local Preview

```bash
npm run preview
```

### Firebase Functions Testing

```bash
npm run functions:serve
```

## Submitting Changes

### Commit Message Format

Use conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no code change)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Build process or auxiliary tool changes

Examples:
```
feat: Add product filtering by price range
fix: Resolve cart total calculation bug
docs: Update README with deployment instructions
refactor: Simplify product search logic
```

### Pull Request Process

1. **Update documentation** - Update README or other docs if needed
2. **Test thoroughly** - Ensure all tests pass and build succeeds
3. **Write a clear PR description**:
   - What changes were made?
   - Why were these changes necessary?
   - How were they tested?
4. **Request review** - Assign reviewers
5. **Address feedback** - Make requested changes
6. **Merge** - Once approved, squash and merge

### Code Review Guidelines

When reviewing code:
- Check for code standards compliance
- Verify TypeScript types are properly defined
- Test the changes locally
- Look for potential bugs or edge cases
- Suggest improvements constructively

## Important Notes

### Security

- **Never commit API keys** - Always use `.env.local` for secrets
- **Validate user input** - Sanitize and validate all user inputs
- **Secure Firebase Functions** - Add authentication where needed

### Performance

- **Optimize images** - Compress and optimize all images
- **Lazy loading** - Use lazy loading for heavy components
- **Memoization** - Use `useMemo` and `useCallback` appropriately

### Accessibility

- **Semantic HTML** - Use proper HTML tags
- **ARIA labels** - Add ARIA labels for screen readers
- **Keyboard navigation** - Ensure keyboard accessibility

### Internationalization

- **Use translations** - Always use translation strings from `data/translations.ts`
- **Test all languages** - Test in Hebrew, English, and Russian
- **RTL layout** - Verify RTL layout works correctly

## Questions?

If you have questions or need help:
- Check the [README.md](README.md) for setup instructions
- Review existing code for examples
- Contact the development team

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

Thank you for contributing to NOVATRA! 🎉
