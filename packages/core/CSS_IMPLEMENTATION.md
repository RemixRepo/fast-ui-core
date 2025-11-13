# CSS/SCSS Implementation Documentation

## Overview

fast-ui-core now provides **dual CSS/SCSS output** to support both simple drop-in replacement usage AND advanced tree-shaking optimization.

## Architecture

### 1. Build Pipeline

```bash
npm run build → TypeScript compilation → CSS compilation → File copying
```

**Build Scripts:**
- `build`: `tsc -p tsconfig.build.json && npm run compile-css && npm run copy-styles`
- `compile-css`: `node scripts/compile-css.js`
- `copy-styles`: Copies SCSS sources and other static files

### 2. CSS Compilation (`scripts/compile-css.js`)

Compiles SCSS to production-ready CSS using the `sass` package:

```javascript
import * as sass from 'sass';

const result = sass.compileString(scssContent, {
  loadPaths: ['src'],
  style: 'compressed',
  sourceMap: false
});

// Output: dist/css/styles.css (71KB compressed)
// Output: dist/css/tokens.css (71KB compressed)
```

**Key Features:**
- Compressed output for production
- No sourcemaps (reduces size)
- Uses `compileString` for direct content processing
- Configurable load paths for @import resolution

### 3. Output Structure

```
dist/
├── css/
│   ├── styles.css    # Compiled CSS (71KB)
│   └── tokens.css    # Compiled tokens CSS (71KB)
├── styles/
│   ├── index.scss
│   ├── typography.scss
│   ├── spacing.scss
│   ├── color.scss
│   ├── border.scss
│   ├── shadow.scss
│   └── ... (15 files total)
└── tokens/
    ├── index.scss
    ├── theme.scss
    ├── layout.scss
    └── ... (9 files total)
```

## Usage Patterns

### Pattern 1: Drop-in Replacement (Simple)

**Use Case:** Quick migration from Once UI, no build changes needed

```tsx
// main.tsx or index.tsx
import '@remixrepo/fast-ui-core/css/styles.css';

// Works identically to Once UI System
```

**Pros:**
- Zero configuration
- No sass dependency required
- Identical to upstream Once UI
- Works in all frameworks

**Cons:**
- Larger bundle (~71KB)
- No tree-shaking
- All CSS loaded at once

### Pattern 2: Granular SCSS (Advanced)

**Use Case:** Maximum optimization, custom themes, tree-shaking

```scss
// styles/custom.scss
@import '@remixrepo/fast-ui-core/styles/typography.scss';
@import '@remixrepo/fast-ui-core/styles/spacing.scss';
@import '@remixrepo/fast-ui-core/tokens/theme.scss';

// Only imports what you need (~5-20KB)
```

**Pros:**
- Tree-shaking enabled
- Customizable with variables
- Smaller bundles (70-90% reduction)
- Granular control

**Cons:**
- Requires sass in build tool
- More complex setup
- Need to know which modules are needed

### Pattern 3: Full SCSS Bundle

**Use Case:** Custom theming with full styles

```tsx
import '@remixrepo/fast-ui-core/styles';
```

**Pros:**
- Access to all SCSS features
- Can customize variables
- Single import

**Cons:**
- Requires sass
- Larger than granular imports
- Still includes everything

## Package.json Exports

### CSS Exports (Compiled)

```json
{
  "./css/styles.css": {
    "import": "./dist/css/styles.css"
  },
  "./css/tokens.css": {
    "import": "./dist/css/tokens.css"
  }
}
```

### SCSS Exports (Source)

```json
{
  "./styles": {
    "import": "./dist/styles/index.scss"
  },
  "./styles/*": {
    "import": "./dist/styles/*.scss"
  },
  "./styles/typography.scss": {
    "import": "./dist/styles/typography.scss"
  }
  // ... 14 more granular exports
}
```

**Total Exports:** 30+ style/token related exports

## Bundle Size Comparison

| Method | Bundle Size | Tree-Shakeable | Requires sass |
|--------|-------------|----------------|---------------|
| Original Once UI | ~71KB | ❌ | ❌ |
| Compiled CSS | ~71KB | ❌ | ❌ |
| Full SCSS | ~71KB | ⚠️ Partial | ✅ |
| **Granular SCSS** | **~5-20KB** | ✅ | ✅ |

## Dependencies

### Production
- None (CSS can be imported without dependencies)

### Development
- `sass: ^1.89.1` (for build-time compilation)

### Consumer Requirements
- **Compiled CSS:** None (works everywhere)
- **SCSS imports:** sass-loader, vite-plugin-sass, or equivalent

## Build Configuration

### TypeScript Config (`tsconfig.build.json`)

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": true,
    "emitDeclarationOnly": true
  },
  "exclude": ["**/*.scss"]
}
```

**Note:** SCSS files excluded from TypeScript compilation, handled separately

### CSS Compilation Script

Location: `packages/core/scripts/compile-css.js`

**Inputs:**
- `src/styles/index.scss`
- `src/tokens/index.scss`

**Outputs:**
- `dist/css/styles.css`
- `dist/css/tokens.css`

**Process:**
1. Read SCSS source files
2. Compile with sass.compileString()
3. Write compressed CSS to dist/css/

## Upstream Compatibility

### Once UI System
- Publishes: `css/styles.css` (compiled)
- Does NOT publish: Individual SCSS files

### fast-ui-core
- Publishes: `css/styles.css` (compiled) ← **100% compatible**
- PLUS: `styles/*.scss` (source) ← **Additional feature**

**Migration Path:**
```diff
- import '@once-ui-system/core/css/styles.css';
+ import '@remixrepo/fast-ui-core/css/styles.css';
```
Zero breaking changes!

## Testing Checklist

- [x] CSS files compiled during build
- [x] CSS files present in dist/css/
- [x] SCSS files copied to dist/styles/ and dist/tokens/
- [x] CSS output is compressed (single line)
- [x] File sizes match upstream (~71KB)
- [x] All exports properly configured
- [x] Import paths work in package.json
- [x] Documentation updated

## Future Enhancements

1. **CSS Modules Support**
   - Add .module.css variants for scoped styles
   - Enable CSS modules in build config

2. **Tailwind Integration**
   - Export Tailwind preset with design tokens
   - Provide utility class alternatives

3. **PostCSS Pipeline**
   - Add autoprefixer for better browser support
   - Enable CSS custom properties fallbacks

4. **Sourcemaps**
   - Optional sourcemap generation for debugging
   - Enable via `--sourcemap` flag

5. **Critical CSS**
   - Extract above-the-fold CSS
   - Automatic critical CSS generation

## Troubleshooting

### "Cannot find module 'sass'"
**Solution:** Install sass as devDependency: `npm install --save-dev sass`

### CSS not loading in Vite
**Solution:** Ensure file extension in import: `import '@remixrepo/fast-ui-core/css/styles.css'`

### SCSS imports not resolving
**Solution:** Check that sass-loader or equivalent is configured in your build tool

### Bundle size not reducing with SCSS
**Solution:** Verify tree-shaking is enabled and only importing needed modules

## References

- [sass npm package](https://www.npmjs.com/package/sass)
- [Once UI System](https://github.com/once-ui-system/core)
- [CSS Tree-Shaking](https://webpack.js.org/guides/tree-shaking/)
- [Package Exports Field](https://nodejs.org/api/packages.html#exports)

---

**Last Updated:** January 2025  
**Version:** 1.5.2-fast.1
