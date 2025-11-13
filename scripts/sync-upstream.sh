#!/usr/bin/env bash

# sync-upstream.sh
# Semi-automated script for syncing fast-ui-core with upstream once-ui-system/core
# Preserves framework-agnostic shims and custom features

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  fast-ui-core Upstream Sync Tool                      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "packages/core" ]; then
    echo -e "${RED}❌ Error: Must be run from repository root${NC}"
    exit 1
fi

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Warning: Working directory is not clean${NC}"
    echo -e "${YELLOW}   Uncommitted changes detected. Continue anyway? (y/N)${NC}"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo -e "${RED}Aborted.${NC}"
        exit 1
    fi
fi

# Ensure upstream remote exists
if ! git remote get-url upstream > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Upstream remote not found. Adding...${NC}"
    git remote add upstream https://github.com/once-ui-system/core.git
    echo -e "${GREEN}✓ Added upstream remote${NC}"
fi

# Fetch upstream
echo -e "${BLUE}→ Fetching upstream changes...${NC}"
git fetch upstream

# Get current version
CURRENT_VERSION=$(node -p "require('./packages/core/package.json').version")
echo -e "${GREEN}✓ Current version: ${CURRENT_VERSION}${NC}"

# Check for upstream changes
UPSTREAM_COMMITS=$(git rev-list HEAD..upstream/main --count)
if [ "$UPSTREAM_COMMITS" -eq 0 ]; then
    echo -e "${GREEN}✓ Already up to date with upstream!${NC}"
    exit 0
fi

echo -e "${YELLOW}⚠️  Found ${UPSTREAM_COMMITS} new commits in upstream${NC}"
echo ""

# Show recent upstream commits
echo -e "${BLUE}Recent upstream commits:${NC}"
git log --oneline --graph -10 upstream/main
echo ""

# Check which protected files would be affected
echo -e "${BLUE}→ Checking for conflicts in protected files...${NC}"
AFFECTED_PROTECTED_FILES=$(git diff HEAD..upstream/main --name-only | grep -f .protected-files || true)

if [ -n "$AFFECTED_PROTECTED_FILES" ]; then
    echo -e "${RED}⚠️  Protected files that will be affected:${NC}"
    echo "$AFFECTED_PROTECTED_FILES" | while read -r file; do
        echo -e "${YELLOW}   - $file${NC}"
    done
    echo ""
    echo -e "${YELLOW}   These files contain custom fast-ui-core modifications.${NC}"
    echo -e "${YELLOW}   Manual review will be required after merge.${NC}"
    echo ""
else
    echo -e "${GREEN}✓ No protected files affected${NC}"
fi

# Ask user how to proceed
echo -e "${BLUE}How would you like to proceed?${NC}"
echo "  1) Create sync branch and merge (recommended)"
echo "  2) Show detailed diff first"
echo "  3) Cherry-pick specific commits"
echo "  4) Cancel"
echo ""
read -p "Choice [1-4]: " choice

case $choice in
    1)
        # Create sync branch
        BRANCH_NAME="sync/upstream-$(date +%Y%m%d-%H%M)"
        echo -e "${BLUE}→ Creating branch: ${BRANCH_NAME}${NC}"
        git checkout -b "$BRANCH_NAME"
        
        # Backup protected files
        BACKUP_DIR=".backup-$(date +%Y%m%d-%H%M)"
        echo -e "${BLUE}→ Backing up protected files to ${BACKUP_DIR}${NC}"
        mkdir -p "$BACKUP_DIR"
        
        while IFS= read -r file; do
            if [ -f "$file" ]; then
                mkdir -p "$BACKUP_DIR/$(dirname "$file")"
                cp "$file" "$BACKUP_DIR/$file"
            fi
        done < .protected-files
        
        echo -e "${GREEN}✓ Protected files backed up${NC}"
        
        # Attempt merge
        echo -e "${BLUE}→ Merging upstream/main...${NC}"
        if git merge upstream/main --no-commit --no-ff; then
            echo -e "${GREEN}✓ Merge successful (no conflicts)${NC}"
            
            # Check if protected files were modified
            MODIFIED_PROTECTED=$(git diff --cached --name-only | grep -f .protected-files || true)
            if [ -n "$MODIFIED_PROTECTED" ]; then
                echo -e "${YELLOW}⚠️  Protected files were modified:${NC}"
                echo "$MODIFIED_PROTECTED" | while read -r file; do
                    echo -e "${YELLOW}   - $file${NC}"
                done
                echo ""
                echo -e "${YELLOW}→ Please review these changes carefully:${NC}"
                echo "$MODIFIED_PROTECTED" | while read -r file; do
                    echo -e "${BLUE}   git diff --cached $file${NC}"
                done
                echo ""
                echo -e "${YELLOW}→ Restore from backup if needed:${NC}"
                echo -e "${BLUE}   cp $BACKUP_DIR/<file> <file>${NC}"
            fi
            
            echo ""
            echo -e "${GREEN}→ Next steps:${NC}"
            echo "  1. Review changes: git diff --cached"
            echo "  2. Test build: cd packages/core && pnpm build"
            echo "  3. Test in Vite project"
            echo "  4. Commit: git commit"
            echo "  5. Push: git push origin $BRANCH_NAME"
        else
            echo -e "${RED}❌ Merge conflicts detected!${NC}"
            echo ""
            echo -e "${YELLOW}Conflicting files:${NC}"
            git status --short | grep "^UU\|^AA\|^DD"
            echo ""
            echo -e "${YELLOW}→ Resolve conflicts manually:${NC}"
            echo "  1. Edit conflicting files"
            echo "  2. For protected files, refer to: $BACKUP_DIR"
            echo "  3. Stage resolved files: git add <file>"
            echo "  4. Continue: git merge --continue"
            echo "  5. Or abort: git merge --abort"
            echo ""
            echo -e "${BLUE}💡 Conflict Resolution Tips:${NC}"
            echo "  - Keep shim imports (not Next.js imports)"
            echo "  - Keep granular exports in package.json"
            echo "  - Keep ESM syntax in scripts/"
            echo "  - See UPSTREAM_SYNC.md for details"
        fi
        ;;
        
    2)
        # Show detailed diff
        echo -e "${BLUE}→ Showing diff for all files...${NC}"
        git diff HEAD..upstream/main
        ;;
        
    3)
        # Cherry-pick mode
        echo -e "${BLUE}→ Listing commits to cherry-pick:${NC}"
        git log HEAD..upstream/main --oneline --reverse
        echo ""
        echo "Enter commit hashes to cherry-pick (space-separated):"
        read -r commits
        
        if [ -n "$commits" ]; then
            BRANCH_NAME="cherry-pick/upstream-$(date +%Y%m%d-%H%M)"
            git checkout -b "$BRANCH_NAME"
            
            for commit in $commits; do
                echo -e "${BLUE}→ Cherry-picking $commit${NC}"
                if git cherry-pick "$commit"; then
                    echo -e "${GREEN}✓ Success${NC}"
                else
                    echo -e "${RED}❌ Conflict - resolve manually${NC}"
                    echo "  Continue: git cherry-pick --continue"
                    echo "  Skip: git cherry-pick --skip"
                    echo "  Abort: git cherry-pick --abort"
                    break
                fi
            done
        fi
        ;;
        
    4)
        echo -e "${YELLOW}Cancelled.${NC}"
        exit 0
        ;;
        
    *)
        echo -e "${RED}Invalid choice.${NC}"
        exit 1
        ;;
esac
