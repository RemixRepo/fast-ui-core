#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, '../src/components');
const packageJsonPath = path.join(__dirname, '../package.json');

// Read current package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Get all component files
const componentFiles = fs.readdirSync(componentsDir)
  .filter(file => file.endsWith('.tsx'))
  .map(file => file.replace('.tsx', ''))
  .sort();

// Build exports object
const exports = {
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.js",
    "require": "./dist/index.js"
  },
  "./styles": {
    "import": "./dist/styles/index.css"
  },
  "./styles/*": {
    "import": "./dist/styles/*.css"
  },
  "./shims": {
    "types": "./dist/shims/index.d.ts",
    "import": "./dist/shims/index.js"
  }
};

// Add each component
componentFiles.forEach(component => {
  exports[`./${component}`] = {
    "types": `./dist/components/${component}.d.ts`,
    "import": `./dist/components/${component}.js`
  };
});

// Update package.json
packageJson.exports = exports;

// Add other important fields if missing
if (!packageJson.files) {
  packageJson.files = ["dist", "README.md", "LICENSE.md"];
}

if (!packageJson.scripts) {
  packageJson.scripts = {};
}

packageJson.scripts = {
  ...packageJson.scripts,
  "build": "tsc -p tsconfig.build.json && npm run copy-styles",
  "copy-styles": "node scripts/copy-files.js",
  "dev": "tsc -p tsconfig.build.json --watch",
  "clean": "rm -rf dist",
  "prepublishOnly": "npm run clean && npm run build"
};

if (!packageJson.peerDependencies) {
  packageJson.peerDependencies = {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  };
}

if (!packageJson.peerDependenciesMeta) {
  packageJson.peerDependenciesMeta = {
    "next": {
      "optional": true
    }
  };
}

if (!packageJson.dependencies) {
  packageJson.dependencies = {};
}

// Add required dependencies if not present
if (!packageJson.dependencies.classnames) {
  packageJson.dependencies.classnames = "^2.5.1";
}
if (!packageJson.dependencies['framer-motion']) {
  packageJson.dependencies['framer-motion'] = "^11.11.17";
}

// Update keywords
packageJson.keywords = [
  "react",
  "ui",
  "components",
  "design-system",
  "tree-shaking",
  "optimized",
  "vite",
  "nextjs",
  "framework-agnostic",
  "once-ui",
  "remix"
];

// Add bugs and homepage
if (!packageJson.bugs) {
  packageJson.bugs = {
    "url": "https://github.com/RemixRepo/fast-ui-core/issues"
  };
}

if (!packageJson.homepage) {
  packageJson.homepage = "https://github.com/RemixRepo/fast-ui-core#readme";
}

// Write updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log(`✅ Updated package.json with ${componentFiles.length} component exports`);
console.log(`📦 Total exports: ${Object.keys(exports).length}`);
