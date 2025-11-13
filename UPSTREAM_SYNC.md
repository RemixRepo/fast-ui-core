# Upstream Sync Strategy

This document outlines the strategy for maintaining `@remixrepo/fast-ui-core` while syncing with the upstream `once-ui-system/core` repository.

## Overview

`@remixrepo/fast-ui-core` is a fork of [once-ui-system/core](https://github.com/once-ui-system/core) with critical enhancements:
- **Framework-agnostic shims** for Next.js components (Link, Image, Script, navigation)
- **Tree-shaking support** via granular exports (112 component exports)
- **Vite.js compatibility** without losing Next.js optimizations
- **Platform-agnostic design** that works in any React environment

## Git Remote Configuration

```bash
# Your fork (origin)
origin: https://github.com/RemixRepo/fast-ui-core

# Original repository (upstream)
upstream: https://github.com/once-ui-system/core
```

## Protected Files (Custom Modifications)

These files contain **fast-ui-core specific changes** and must be carefully reviewed during merges:

### Critical Custom Files
```
packages/core/src/shims/
├── Link.tsx                    # Framework-agnostic Link shim
├── Image.tsx                   # Framework-agnostic Image shim
├── Script.tsx                  # Framework-agnostic Script shim
├── navigation.ts               # Framework-agnostic navigation hooks
└── index.ts                    # Shims barrel export

packages/core/src/index.ts      # Added: export * from "./shims"
packages/core/package.json      # Custom: 112 granular exports, @remixrepo scope
packages/core/tsconfig.build.json  # Custom: bundler moduleResolution
packages/core/scripts/
├── update-exports.js           # Custom: ESM conversion, auto-generates exports
└── copy-files.js               # Custom: ESM conversion
```

### Modified Components (Using Shims)
```
packages/core/src/components/
├── Logo/Logo.tsx               # Changed: import Link from "../shims"
├── Media/Media.tsx             # Changed: import Image from "../shims"
├── ElementType/ElementType.tsx # Changed: import Link from "../shims"

packages/core/src/modules/
├── Schema/Schema.tsx           # Changed: import Script from "../../shims"
├── Kbar/Kbar.tsx              # Changed: import {useRouter, usePathname} from "../../shims"
└── MegaMenu/MegaMenu.tsx      # Changed: import usePathname from "../../shims"
```

### Documentation
```
packages/core/README.md         # Custom: fast-ui-core specific usage
VITE_USAGE.md                  # Custom: Vite integration guide
MIGRATION_SUMMARY.md           # Custom: migration documentation
UPSTREAM_SYNC.md               # This file
```

## Sync Workflow

### 1. Fetch Upstream Changes (Monthly/Quarterly)

```bash
# Fetch latest from upstream
git fetch upstream

# Create a sync branch
git checkout -b sync/upstream-$(date +%Y%m%d)

# View what changed
git log HEAD..upstream/main --oneline

# Check which protected files are affected
git diff HEAD..upstream/main --name-only | grep -E "(shims|package.json|tsconfig|scripts/|Logo.tsx|Media.tsx|ElementType.tsx|Schema.tsx|Kbar.tsx|MegaMenu.tsx)"
```

### 2. Merge Strategy

**Option A: Cherry-pick safe changes (Recommended)**
```bash
# Review commits one by one
git log upstream/main --oneline --graph -20

# Cherry-pick specific commits that don't affect protected files
git cherry-pick <commit-hash>

# For bug fixes in unmodified components
git cherry-pick <commit-hash>
```

**Option B: Merge with conflict resolution**
```bash
# Merge upstream changes
git merge upstream/main

# Conflicts will appear in protected files
# Manually resolve while preserving:
#   - Shim imports in components
#   - Granular exports in package.json
#   - ESM scripts
```

### 3. Conflict Resolution Guidelines

When conflicts occur in protected files:

#### For Component Files (Logo.tsx, Media.tsx, etc.)
```tsx
// ❌ REJECT upstream's Next.js imports
import Link from "next/link";
import Image from "next/image";

// ✅ KEEP our shim imports
import { Link } from "../shims";
import { Image } from "../shims";
```

#### For package.json
```json
// ✅ KEEP our granular exports (all 112)
"exports": {
  "./Button": "./dist/components/Button/index.js",
  "./shims": "./dist/shims/index.js",
  // ... all other exports
}

// ✅ KEEP sideEffects configuration
"sideEffects": ["*.css", "*.scss"]

// ✅ KEEP @remixrepo scope
"name": "@remixrepo/fast-ui-core"

// ⚠️ MERGE version number (take upstream's version, add -fast.X suffix)
"version": "<upstream-version>-fast.1"

// ⚠️ REVIEW dependencies (add upstream's new deps, keep ours)
```

#### For tsconfig.build.json
```json
// ✅ KEEP bundler moduleResolution
"moduleResolution": "bundler"

// ⚠️ MERGE other compiler options from upstream
```

#### For scripts/
```javascript
// ✅ KEEP ESM imports
import fs from 'fs';
import path from 'path';

// ❌ REJECT CommonJS
const fs = require('fs');
```

### 4. Testing After Merge

```bash
# Clean and rebuild
cd packages/core
pnpm clean
pnpm build

# Verify shims are built
ls -la dist/shims/

# Verify exports
node -e "const pkg = require('./package.json'); console.log(Object.keys(pkg.exports).length)"

# Test in a Vite project
cd /tmp/test-vite
npm create vite@latest test-app -- --template react-ts
cd test-app
npm install /path/to/fast-ui-core/packages/core
```

Create test file:
```tsx
// src/Test.tsx
import { Button } from '@remixrepo/fast-ui-core/Button';
import { Link } from '@remixrepo/fast-ui-core/shims';

export default function Test() {
  return (
    <>
      <Button>Works!</Button>
      <Link href="/test">Link works without Next.js!</Link>
    </>
  );
}
```

```bash
npm run build
# Verify tree-shaking: check bundle size
```

### 5. Version Bumping Strategy

```bash
# Upstream: 1.6.0 → Fast-UI-Core: 1.6.0-fast.1
# Upstream: 1.6.1 → Fast-UI-Core: 1.6.1-fast.1
# Upstream: 2.0.0 → Fast-UI-Core: 2.0.0-fast.1

# For our own fixes/features (between upstream releases)
# 1.5.2-fast.1 → 1.5.2-fast.2 → 1.5.2-fast.3
```

### 6. Commit and Publish

```bash
# Commit merge
git add .
git commit -m "chore: sync with upstream once-ui-system/core v<version>

- Merged upstream changes from v<old> to v<new>
- Preserved framework-agnostic shims
- Maintained granular exports for tree-shaking
- Resolved conflicts in: <list files>

Upstream changes:
- <summarize upstream changes>
"

# Push to your fork
git push origin sync/upstream-$(date +%Y%m%d)

# Create PR for review
gh pr create --title "Sync: Upstream v<version>" --body "See commit message"

# After review and merge to main
git checkout main
git pull

# Publish new version
cd packages/core
npm version <new-version>  # e.g., 1.6.0-fast.1
npm publish --access public
git push --tags
```

## Automation Script

A helper script is provided at `scripts/sync-upstream.sh` for semi-automated syncing.

## Quick Reference Commands

```bash
# Check for upstream updates
git fetch upstream && git log HEAD..upstream/main --oneline

# See which protected files would be affected
git diff HEAD..upstream/main --name-only | grep -f .protected-files

# Safe merge (with protected files backup)
./scripts/sync-upstream.sh

# Manual merge
git merge upstream/main

# Abort if things go wrong
git merge --abort
```

## Communication

When syncing:
1. **Create an issue** tracking the upstream version being merged
2. **List breaking changes** from upstream
3. **Document new features** that are now available
4. **Update CHANGELOG.md** with both upstream and fast-ui-core changes
5. **Announce on npm** and GitHub releases

## FAQ

**Q: What if upstream refactors a file we modified?**
A: Manually reapply our shim imports to the refactored code structure. Test thoroughly.

**Q: What if upstream adds new Next.js dependencies?**
A: Create shims for new Next.js components, update affected files to use shims.

**Q: Should we contribute shims back to upstream?**
A: Yes! Consider opening a PR to once-ui-system/core with our framework-agnostic approach.

**Q: How often should we sync?**
A: Check monthly for updates. Sync when there are significant bug fixes or new features.

**Q: What if our shims break due to upstream changes?**
A: Fix shims first, then complete the merge. Shims are the foundation of our framework-agnostic approach.

## Resources

- [once-ui-system/core](https://github.com/once-ui-system/core) - Upstream repository
- [GitHub: Syncing a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)
- [Git: Cherry-picking](https://git-scm.com/docs/git-cherry-pick)
