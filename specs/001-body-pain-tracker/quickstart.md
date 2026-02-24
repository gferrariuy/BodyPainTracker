# Quick Start Guide: Body Pain Tracker Development

**Project**: Daily Body Pain Tracker | **Version**: 1.0 | **Date**: 2026-02-24

## Prerequisites

- **Node.js**: 18+
- **npm**: 9+ or **yarn**: 4+
- **Git**: For version control
- **Browser**: Chrome, Firefox, Safari, or Edge (latest 2 versions)

## Setup Instructions

### 1. Clone Repository

```bash
git clone <repository-url> body-pain-tracker
cd body-pain-tracker
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

This installs:
- Next.js 14+
- React 18+
- TypeScript 5.0+
- Tailwind CSS 3+
- Testing libraries (Jest, Playwright, Axe)

### 3. Configure Environment (Optional)

Create `.env.local` for local overrides:

```bash
# .env.local
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENV=development
```

### 4. Start Development Server

```bash
npm run dev
```

Application opens at **http://localhost:3000**

The dev server includes:
- Hot module reloading
- TypeScript type checking
- CSS compilation with Tailwind
- ESLint checking

## Development Workflow

### File Structure

```
src/
├── pages/          # Next.js pages (static routes)
├── components/     # React components
├── lib/           # Utilities, hooks, data models
├── styles/        # Global CSS, Tailwind directives
└── types/         # TypeScript declarations
```

### Key Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (localhost:3000) |
| `npm run build` | Build static export to `/out` |
| `npm test` | Run unit tests (Jest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:e2e` | Run E2E tests (Playwright) |
| `npm run test:a11y` | Run accessibility tests (Axe) |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking |
| `npm run format` | Format code with Prettier |

### Building Static Export

```bash
npm run build
```

Generates static files in `/out/` directory:
- `/out/index.html` - Recorder page
- `/out/statistics/index.html` - Statistics page
- `/out/history/index.html` - History page
- `/out/_next/` - JavaScript and CSS bundles (minified)

**Output is fully static**: Can be deployed to CDN, GitHub Pages, S3, Netlify, Vercel without a server.

## Testing

### Unit Tests

Test individual functions (storage, aggregation, validation):

```bash
npm test -- --testPathPattern="storage"
```

### Integration Tests

Test multi-step flows (record → save → display):

```bash
npm test -- --testPathPattern="integration"
```

### E2E Tests

Test full user workflows with Playwright:

```bash
npm run test:e2e
```

Launches browser and tests:
- Recording pain on body diagram
- Saving and retrieving from localStorage
- Viewing statistics with filters
- Editing and deleting entries

### Accessibility Audits

Run automated WCAG 2.1 AA checks:

```bash
npm run test:a11y
```

Checks for:
- Color contrast
- Semantic HTML structure
- ARIA labels
- Keyboard navigation
- Touch target sizes

## Deployment

### Static Export Deployment

After building, deploy `/out` directory to your host:

#### GitHub Pages

```bash
# Build
npm run build

# Copy /out to gh-pages branch
# Push to GitHub
```

#### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Vercel auto-detects Next.js with `output: 'export'` and deploys `/out` as static.

#### Netlify

```bash
# Create netlify.toml
[build]
  command = "npm run build"
  publish = "out"
```

#### AWS S3 + CloudFront

```bash
# Build
npm run build

# Sync to S3
aws s3 sync out/ s3://your-bucket/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

## Development Tips

### Adding a New Page

1. Create `src/pages/new-page.tsx`:
   ```typescript
   import { NextPage } from 'next';
   
   const NewPage: NextPage = () => {
     return <div>New Page Content</div>;
   };
   export default NewPage;
   ```

2. Page is auto-routed to `/new-page`

### Adding a New Component

1. Create `src/components/NewComponent.tsx`:
   ```typescript
   interface Props {
     title: string;
   }

   export const NewComponent = ({ title }: Props) => {
     return <div className="p-4">{title}</div>;
   };
   ```

2. Import in pages: `import { NewComponent } from '@/components/NewComponent';`

### Using Custom Hooks

Example: `useLocalStorage` hook for state management

```typescript
import { usePainData } from '@/lib/hooks/usePainData';

export default function Recorder() {
  const { entries, addEntry, saveEntry } = usePainData();
  
  return (
    <div>
      {/* Use entries, addEntry, saveEntry */}
    </div>
  );
}
```

### Styling with Tailwind

All components use Tailwind utility classes:

```tsx
<div className="bg-blue-50 p-4 rounded-lg shadow-sm gap-3 flex flex-col md:flex-row">
  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
    Submit
  </button>
</div>
```

Responsive breakpoints:
- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+
- `xl:` - 1280px+

## Debugging

### Browser DevTools

1. Open http://localhost:3000
2. Press F12 to open DevTools
3. Use **Console** tab for JavaScript errors
4. Use **Storage** tab to inspect localStorage (Application → Local Storage)

### Next.js Debug Mode

```bash
npm run dev -- --debug
```

### React DevTools Extension

Install React DevTools browser extension to inspect component tree and hooks.

## Troubleshooting

### Port 3000 Already in Use

```bash
# Use different port
npm run dev -- -p 3001
```

### Clear Cache

```bash
# Remove build artifacts
rm -rf .next out node_modules

# Reinstall
npm install
npm run build
```

### localStorage Errors

Check browser DevTools **Storage** tab → **Local Storage** → ensure `painTrackerData` key exists and is valid JSON.

### TypeScript Errors

Run type checker:
```bash
npm run type-check
```

## Build Optimization Checklist

Before deployment, verify:

- [ ] All tests pass: `npm test`
- [ ] Type checking passes: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] `/out` directory contains only static files (no API routes)
- [ ] Lighthouse score ≥90: Run audit on `/out` preview
- [ ] Mobile responsive verified: Test on multiple screen sizes
- [ ] Accessibility verified: `npm run test:a11y` passes

## Documentation

- **Architecture**: See [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)
- **Deployment**: See [docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md)
- **Data Model**: See [data-model.md](./data-model.md)
- **Contracts**: See [contracts/](./contracts/)

## Support

For issues or questions, refer to:
1. Feature spec: [spec.md](spec.md)
2. Implementation plan: [plan.md](plan.md)
3. Code comments in source files
4. Test files for usage examples

## Next Steps

1. Run `npm install` and `npm run dev`
2. Open http://localhost:3000 in browser
3. Start with Recorder page development (User Story P1)
4. Follow tasks in `tasks.md` for phased implementation
