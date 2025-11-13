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
- 📦 **Granular Exports** - 112 individual component exports for optimal bundling
- 🔧 **Zero Config** - Automatic detection and shimming of Next.js features
- 🎨 **Full Feature Parity** - All Once UI components and features included
- �� **Universal** - Same API across all frameworks

## 📦 Installation

\`\`\`bash
npm install @remixrepo/fast-ui-core
# or
yarn add @remixrepo/fast-ui-core
# or
pnpm add @remixrepo/fast-ui-core
\`\`\`

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

\`\`\`tsx
import { Button, Text } from '@remixrepo/fast-ui-core';
\`\`\`

## 🎨 Styling

\`\`\`tsx
// Import in your main entry file
import '@remixrepo/fast-ui-core/styles';
\`\`\`

## 📊 Bundle Size Impact

| Method | Bundle Impact | Tree-Shakeable |
|--------|--------------|----------------|
| Original Once UI | ~500KB | ❌ |
| Full Import | ~500KB | ❌ |
| **Granular Import** | **~20-50KB*** | ✅ |

*Typical usage with 5-10 components

## 🔄 Migration from Once UI

\`\`\`diff
- import { Button, Text } from '@once-ui-system/core';
+ import { Button, Text } from '@remixrepo/fast-ui-core';
\`\`\`

Or for better tree-shaking:

\`\`\`tsx
import { Button } from '@remixrepo/fast-ui-core/Button';
import { Text } from '@remixrepo/fast-ui-core/Text';
\`\`\`

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
