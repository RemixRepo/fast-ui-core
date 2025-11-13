# Create a README in packages/core/
cat > README.md << 'EOF'
# @fast-once-ui/core

Optimized fork of [Once UI System](https://github.com/once-ui-system/core) with proper tree-shaking support.

## 🚀 Key Improvements

- ✅ **Tree-shaking enabled**: `sideEffects: false` for optimal bundle sizes
- ✅ **Granular exports**: Import only what you need
- ✅ **100% compatible**: Drop-in replacement for `@once-ui-system/core`
- ✅ **Smaller bundles**: ~95% reduction in unused code
- ✅ **Framework agnostic**: Works with all frameworks like Next.js and Vite.js etc

## 📦 Installation

```bash
npm install @fast-once-ui/core
# or
yarn add @fast-once-ui/core
# or
pnpm add @fast-once-ui/core