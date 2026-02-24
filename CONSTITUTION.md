# Static Web Application Constitution

## Core Principles

### I. Static-First Architecture
Every component must be a static file (HTML, CSS, JavaScript) served without server-side rendering or dynamic processing. No backend logic, database queries, or server-side computations. All data transformations and business logic execute in the browser.

### II. Client-Side Rendering
All UI updates and data binding happen exclusively in the browser. JavaScript frameworks (React, Vue, Svelte, etc.) or vanilla JS can be used. Content must be fully functional with JavaScript disabled or gracefully degrade to a static fallback.

### III. External API Integration Only
The only permitted backend communication is through HTTP/REST APIs to third-party services (never to a dedicated backend). Requests must be CORS-compliant and use fetch/AJAX. API keys must never be exposed in source code—use environment variables or secure backend proxies.

### IV. Performance Optimization Mandatory
All static assets must be minified (HTML, CSS, JavaScript). Images must be optimized and compressed. Total bundle size must not exceed 500KB (uncompressed). Implement lazy loading for images and code-splitting for JavaScript. Caching headers must leverage browser cache effectively.

### V. Security by Default
Sanitize all user inputs to prevent XSS attacks. Use Content Security Policy headers via meta tags or server configuration. Never hardcode secrets, API keys, or credentials. Validate all external API responses to prevent data injection.

### VI. Accessibility & SEO Standards
All HTML must follow semantic markup (proper heading hierarchy, alt text for images). Pages must be WCAG 2.1 Level AA compliant. Meta tags (title, description, og:* tags) required for SEO. Mobile-responsive design mandatory.

### VII. Responsive Design First
Mobile-first approach required. Minimum breakpoints: mobile (320px), tablet (768px), desktop (1024px). All interactive elements must be touch-friendly (minimum 44x44px targets). Fluid typography and flexible layouts using CSS Grid/Flexbox.

## Development Constraints

### Technology Stack
- **Languages**: HTML5, CSS3, ES2020+ JavaScript
- **Hosting**: Static file hosting (GitHub Pages, Netlify, Vercel, S3, etc.)
- **Build Tools**: Optional (Webpack, Vite, Parcel for bundling/minification)
- **Dependencies**: Keep third-party libraries minimal; prefer native browser APIs
- **Frameworks**: Optional (React, Vue, Svelte) but pure TypeScript/JS preferred for small applications

### File Structure
```
/
├── index.html              (entry point)
├── css/
│   └── style.css          (compiled/minified)
├── js/
│   └── main.js            (compiled/minified)
├── assets/
│   ├── images/            (optimized)
│   ├── fonts/             (webfonts only)
│   └── icons/             (SVG preferred)
└── config.json            (optional: non-secret configuration)
```

### Quality Gates
- All HTML must pass W3C validation
- No console errors or warnings in production builds
- Lighthouse score must be ≥ 90 for Performance, Accessibility, Best Practices
- Zero security vulnerabilities (use npm audit, OWASP ZAP)
- Cross-browser compatibility: Chrome, Firefox, Safari, Edge (latest 2 versions)

## Testing & Deployment

### Testing Requirements
- Unit tests for JavaScript utilities (Jest, Vitest, or similar)
- E2E tests for critical user flows (Cypress, Playwright)
- Accessibility audits automated (Axe, Pa11y)
- Performance testing on every build (Lighthouse CI)
- Manual testing on mobile devices before release

### Deployment Process
1. All assets built and minified
2. Source maps generated (excluded from production)
3. Static files deployed to CDN with immutable URLs
4. HTTP caching headers configured: index.html (no-cache), other assets (max-age=31536000)
5. Gzip/Brotli compression enabled on all text assets
6. HTTPS enforced; HTTP redirects to HTTPS

### Supported Browsers
- Chrome/Chromium: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Edge: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Android Chrome 80+

## CI/CD Pipeline

- **Automated Build**: Every commit triggers minification, bundling, optimization
- **Testing Gate**: All tests must pass before merge
- **Lighthouse Audit**: Performance score must meet threshold (90+)
- **Security Scan**: Dependency vulnerability checking (npm audit, Snyk)
- **Preview Deploy**: Temporary staging URL for pull request preview
- **Production Deploy**: Automatic upon merge to main branch

## Governance

### Constitution Authority
This constitution is the source of truth for all development decisions. Deviations require documented amendment with team consensus.

### Amendment Process
1. Change must be proposed with justification
2. Written documentation of impact and migration requirements
3. Team review and approval
4. Version bump and date recorded
5. All active projects notified of changes

### Compliance Verification
- All pull requests must reference this constitution
- Code review checklist includes constitution compliance
- Automated linting rules enforce core principles
- Monthly audits of production applications

### Exceptions Policy
Exceptions to this constitution require:
- Explicit business justification
- Documentation in project README
- Time-limited approval (max 90 days)
- Plan for bringing into compliance

---

**Version**: 1.0.0 | **Ratified**: 2026-02-24 | **Last Amended**: 2026-02-24 | **Next Review**: 2026-05-24
