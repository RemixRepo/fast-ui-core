import { compileString } from 'sass';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, '../src');
const distDir = path.resolve(__dirname, '../dist');
const cssDir = path.join(distDir, 'css');

// Ensure css directory exists
if (!fs.existsSync(cssDir)) {
  fs.mkdirSync(cssDir, { recursive: true });
}

console.log('Compiling SCSS to CSS...');

// Compile styles.css (all utility styles)
try {
  const stylesScss = path.join(srcDir, 'styles', 'index.scss');
  const stylesContent = fs.readFileSync(stylesScss, 'utf8');
  
  const stylesResult = compileString(stylesContent, {
    loadPaths: [path.join(srcDir, 'styles')],
    style: 'compressed',
    sourceMap: false,
  });
  
  fs.writeFileSync(path.join(cssDir, 'styles.css'), stylesResult.css);
  console.log('✓ Compiled styles.css');
} catch (error) {
  console.error('✗ Error compiling styles.css:', error.message);
  process.exit(1);
}

// Compile tokens.css (design tokens)
try {
  const tokensScss = path.join(srcDir, 'tokens', 'index.scss');
  const tokensContent = fs.readFileSync(tokensScss, 'utf8');
  
  const tokensResult = compileString(tokensContent, {
    loadPaths: [path.join(srcDir, 'tokens')],
    style: 'compressed',
    sourceMap: false,
  });
  
  fs.writeFileSync(path.join(cssDir, 'tokens.css'), tokensResult.css);
  console.log('✓ Compiled tokens.css');
} catch (error) {
  console.error('✗ Error compiling tokens.css:', error.message);
  process.exit(1);
}

console.log('CSS compilation complete!');
