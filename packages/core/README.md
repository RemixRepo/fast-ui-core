<br/>

<div align="center">
  <h1>@remixrepo/fast-ui-core</h1>
  
  <p><strong>Framework-agnostic, tree-shakeable fork of Once UI</strong></p>
  
  <p>Works seamlessly in Next.js, Vite, and any React project</p>

  [![npm version](https://img.shields.io/npm/v/@remixrepo/fast-ui-core.svg)](https://www.npmjs.com/package/@remixrepo/fast-ui-core)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE.md)
</div>

<br/>

## 🚀 Key Improvements Over Original

This is an optimized fork of [Once UI System](https://github.com/once-ui-system/core) with:

- ✅ **Framework Agnostic** - Works in Next.js, Vite, Create React App, and any React environment
- ⚡ **Tree-Shaking Enabled** - Import only what you need, reduce bundle size by up to 90%
- 📦 **Granular Exports** - 112+ individual component exports for optimal bundling
- 🎨 **Dual CSS/SCSS Output** - Compiled CSS for simplicity OR granular SCSS for tree-shaking
- 🔧 **Zero Config** - Automatic detection and shimming of Next.js features
- � **Full Feature Parity** - All Once UI components and features included
- 🔄 **Drop-in Compatible** - Same import paths as original for easy migration
- 🌐 **Universal** - Same API across all frameworks

## 📦 Installation

\`\`\`bash
npm install @remixrepo/fast-ui-core
# or
yarn add @remixrepo/fast-ui-core
# or
pnpm add @remixrepo/fast-ui-core
\`\`\`

### Required Peer Dependencies

This package requires the following peer dependencies to be installed in your project:

\`\`\`bash
npm install react react-dom react-icons prismjs recharts framer-motion date-fns
\`\`\`

**Peer Dependencies:**
- `react` >=18
- `react-dom` >=18
- `react-icons` ^5.0.0
- `prismjs` ^1.0.0
- `recharts` ^2.0.0
- `framer-motion` ^11.0.0
- `date-fns` ^4.0.0

> **Note:** These are peer dependencies, meaning you install them once in your project and they're shared across all packages. This keeps your bundle size optimized.

## 🎯 Usage

### Basic Import

\`\`\`tsx
import { Button, Card, Text } from '@remixrepo/fast-ui-core';

function App() {
  return (
    <Card>
      <Text>Hello World</Text>
      <Button>Click me</Button>
    </Card>
  );
}
\`\`\`

### Tree-Shaking Imports (Recommended)

For maximum bundle size reduction:

\`\`\`tsx
import { Button } from '@remixrepo/fast-ui-core/Button';
import { Card } from '@remixrepo/fast-ui-core/Card';
import { Text } from '@remixrepo/fast-ui-core/Text';
\`\`\`

## 🔌 Framework Setup

### Vite

Install the package and peer dependencies:

\`\`\`bash
npm install @remixrepo/fast-ui-core react-icons prismjs recharts framer-motion date-fns
\`\`\`

\`\`\`tsx
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
\`\`\`

### Next.js

Works out of the box - automatically uses Next.js components when available!

\`\`\`bash
npm install @remixrepo/fast-ui-core react-icons prismjs recharts framer-motion date-fns
\`\`\`

\`\`\`tsx
import { Button, Text } from '@remixrepo/fast-ui-core';
\`\`\`

## 🎨 Styling

### Option 1: Compiled CSS (Simple)

For quick setup, import the pre-compiled CSS:

\`\`\`tsx
// Import in your main entry file (e.g., main.tsx, index.tsx, _app.tsx)
import '@remixrepo/fast-ui-core/css/styles.css';
\`\`\`

This is a **drop-in replacement** for the original Once UI - same import path, same behavior.

### Option 2: SCSS with Tree-Shaking (Advanced)

For maximum customization and bundle optimization, import granular SCSS:

\`\`\`scss
// Import only what you need (requires sass in your build tool)
@import '@remixrepo/fast-ui-core/styles/typography.scss';
@import '@remixrepo/fast-ui-core/styles/spacing.scss';
@import '@remixrepo/fast-ui-core/tokens/theme.scss';
\`\`\`

Available granular SCSS modules:
- `styles/typography.scss` - Font and text styles
- `styles/spacing.scss` - Margins, padding, gaps
- `styles/color.scss` - Color utilities
- `styles/border.scss` - Border utilities
- `styles/shadow.scss` - Shadow utilities
- `tokens/*` - Design tokens (theme, layout, etc.)

### Option 3: Full SCSS Bundle

Import all styles via SCSS entry point:

\`\`\`tsx
import '@remixrepo/fast-ui-core/styles';
\`\`\`

## 📊 Bundle Size Impact

| Method | CSS Bundle | Tree-Shakeable |
|--------|-----------|----------------|
| Original Once UI | ~71KB | ❌ |
| Compiled CSS | ~71KB | ❌ |
| **Granular SCSS** | **~5-20KB*** | ✅ |

*Actual size depends on which modules you import

*Typical usage with 5-10 components

## 🔄 Migration from Once UI

### 1. Install Package and Peer Dependencies

\`\`\`bash
npm uninstall @once-ui-system/core
npm install @remixrepo/fast-ui-core react-icons prismjs recharts framer-motion date-fns
\`\`\`

> **Note:** Once UI bundled these dependencies directly. fast-ui-core uses peer dependencies to avoid duplication and reduce bundle size.

### 2. Update Component Imports

\`\`\`diff
- import { Button, Text } from '@once-ui-system/core';
+ import { Button, Text } from '@remixrepo/fast-ui-core';
\`\`\`

Or for better tree-shaking:

\`\`\`tsx
import { Button } from '@remixrepo/fast-ui-core/Button';
import { Text } from '@remixrepo/fast-ui-core/Text';
\`\`\`

### 3. Styles

CSS import paths are **100% compatible** - no changes needed:

\`\`\`tsx
// This works the same way as Once UI
import '@remixrepo/fast-ui-core/css/styles.css';
\`\`\`

For advanced users, you can now also use granular SCSS imports for better tree-shaking (not available in original Once UI)

## �� Framework-Agnostic Shims

The library includes intelligent shims for Next.js-specific features:

\`\`\`tsx
import { Link, Image, useRouter } from '@remixrepo/fast-ui-core/shims';

// Automatically uses:
// - Next.js components in Next.js apps
// - Native HTML elements in Vite/CRA
\`\`\`

## 📚 Components

100+ components including:

**Layout**: Flex, Grid, Column, Row, Stack  
**Typography**: Heading, Text, InlineCode  
**Inputs**: Input, Textarea, Select, Checkbox, Switch, DatePicker  
**Buttons**: Button, IconButton, ToggleButton  
**Feedback**: Toast, Dialog, Spinner, Skeleton  
**Navigation**: Dropdown, Menu, Tabs  
**Effects**: HoloFx, GlitchFx, RevealFx, and more...

[View full component list →](https://docs.once-ui.com)

## 🙏 Credits

This is a fork of the excellent [Once UI System](https://github.com/once-ui-system/core) by [Lorant One](https://lorant.one).

**Key Differences:**
- Removed Next.js hard dependency
- Added framework-agnostic shims
- Implemented granular exports
- Optimized for tree-shaking

## 📄 License

MIT - Same as the original Once UI System

## 🔗 Links

- [GitHub Repository](https://github.com/RemixRepo/fast-ui-core)
- [Original Once UI](https://github.com/once-ui-system/core)
- [Original Documentation](https://docs.once-ui.com)
- [Report Issues](https://github.com/RemixRepo/fast-ui-core/issues)

---

Maintained [@RemixRepo](https://github.com/RemixRepo)  
Original by [Once UI System](https://github.com/once-ui-system/core)
