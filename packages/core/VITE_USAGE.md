# Using @remixrepo/fast-ui-core in Vite Projects

This guide shows how to use the framework-agnostic `@remixrepo/fast-ui-core` library in Vite projects.

## Setup

### 1. Install the Package

```bash
npm install @remixrepo/fast-ui-core
# or
yarn add @remixrepo/fast-ui-core
# or
pnpm add @remixrepo/fast-ui-core
```

### 2. Configure Vite (Optional)

For optimal performance, add to your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@remixrepo/fast-ui-core']
  }
});
```

### 3. Import Styles

In your main entry file (`src/main.tsx` or `src/index.tsx`):

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import '@remixrepo/fast-ui-core/styles';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## Usage Examples

### Basic Components

```tsx
import { Button, Card, Text, Flex } from '@remixrepo/fast-ui-core';

function App() {
  return (
    <Flex direction="column" gap="16">
      <Card>
        <Text variant="heading-strong-xl">Welcome to Vite!</Text>
        <Text>This is using the framework-agnostic Once UI fork.</Text>
      </Card>
      <Button onClick={() => alert('Hello!')}>Click Me</Button>
    </Flex>
  );
}
```

### Tree-Shaking Imports (Recommended)

For the best bundle size, import components individually:

```tsx
import { Button } from '@remixrepo/fast-ui-core/Button';
import { Card } from '@remixrepo/fast-ui-core/Card';
import { Text } from '@remixrepo/fast-ui-core/Text';
import { Flex } from '@remixrepo/fast-ui-core/Flex';

function App() {
  return (
    <Flex direction="column" gap="16">
      <Card>
        <Text variant="heading-strong-xl">Optimized Bundle!</Text>
        <Text>Only imports what you use.</Text>
      </Card>
      <Button>Click Me</Button>
    </Flex>
  );
}
```

### Using Framework-Agnostic Shims

The library includes shims that work everywhere:

```tsx
import { Link, Image } from '@remixrepo/fast-ui-core/shims';

function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
    </nav>
  );
}

function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
    />
  );
}
```

### Routing with Shims

```tsx
import { useRouter, usePathname } from '@remixrepo/fast-ui-core/shims';
import { Button } from '@remixrepo/fast-ui-core/Button';

function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div>
      <p>Current path: {pathname}</p>
      <Button onClick={() => router.push('/about')}>
        Go to About
      </Button>
    </div>
  );
}
```

## Advanced Usage

### With React Router

```tsx
import { BrowserRouter, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { Button, Card, Text } from '@remixrepo/fast-ui-core';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Card>
            <Text variant="heading-strong-xl">Home</Text>
            <RouterLink to="/about">
              <Button>About</Button>
            </RouterLink>
          </Card>
        } />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Theme Provider

```tsx
import { ThemeProvider, DataThemeProvider } from '@remixrepo/fast-ui-core';

function App() {
  return (
    <ThemeProvider>
      <DataThemeProvider>
        <YourApp />
      </DataThemeProvider>
    </ThemeProvider>
  );
}
```

## Bundle Size Optimization

### Analyze Your Bundle

```bash
npm install -D rollup-plugin-visualizer
```

Add to `vite.config.ts`:

```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
});
```

Run build:

```bash
npm run build
```

This will show you exactly how much each import costs!

### Best Practices

1. **Use granular imports** for components you use frequently
2. **Import full package** if you use 20+ components (simpler, not much bigger)
3. **Avoid barrel imports** from subdirectories
4. **Use code splitting** for route-based components

## Troubleshooting

### Issue: Styles not loading

**Solution**: Make sure you import styles in your entry file:

```tsx
import '@remixrepo/fast-ui-core/styles';
```

### Issue: Module not found

**Solution**: Clear Vite cache:

```bash
rm -rf node_modules/.vite
npm run dev
```

### Issue: Type errors with shims

**Solution**: Ensure you have the latest TypeScript and React types:

```bash
npm install -D @types/react@latest @types/react-dom@latest typescript@latest
```

## Comparison with Next.js

| Feature | Vite | Next.js |
|---------|------|---------|
| Link Component | Native `<a>` | Next.js `<Link>` |
| Image Component | Native `<img>` | Next.js `<Image>` |
| Routing Hooks | History API | Next.js Router |
| Bundle Size | Smaller | Slightly larger |
| Performance | Excellent | Excellent |

The shims automatically adapt to each environment!

## Complete Example

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import '@remixrepo/fast-ui-core/styles';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// src/App.tsx
import { 
  ThemeProvider, 
  DataThemeProvider,
  Column,
  Card,
  Text,
  Button,
  Flex
} from '@remixrepo/fast-ui-core';

function App() {
  return (
    <ThemeProvider>
      <DataThemeProvider>
        <Column maxWidth="m" fillWidth padding="24">
          <Card>
            <Flex direction="column" gap="16">
              <Text variant="heading-strong-xl">
                Welcome to Vite + Once UI
              </Text>
              <Text>
                This is a tree-shakeable, framework-agnostic UI library.
              </Text>
              <Button variant="primary">
                Get Started
              </Button>
            </Flex>
          </Card>
        </Column>
      </DataThemeProvider>
    </ThemeProvider>
  );
}

export default App;
```

## Resources

- [Vite Documentation](https://vitejs.dev)
- [Once UI Documentation](https://docs.once-ui.com)
- [GitHub Repository](https://github.com/RemixRepo/fast-ui-core)

---

Happy coding! 🚀
