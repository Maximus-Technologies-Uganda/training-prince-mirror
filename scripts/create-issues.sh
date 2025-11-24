#!/bin/bash

# Script to create all GitHub issues from tasks.md
# Usage: ./scripts/create-issues.sh <parent-issue-number> <github-token>

set -e

PARENT_ISSUE=${1:-}
GITHUB_TOKEN=${2:-$GITHUB_TOKEN}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 GitHub Issues Creation Helper${NC}\n"

# Validation
if [ -z "$PARENT_ISSUE" ]; then
  echo -e "${RED}❌ Error: Parent issue number required${NC}"
  echo "Usage: $0 <parent-issue-number> [github-token]"
  echo ""
  echo "Example:"
  echo "  $0 1709"
  echo "  $0 1709 \$GITHUB_TOKEN"
  echo ""
  echo "Or set GITHUB_TOKEN environment variable first:"
  echo "  export GITHUB_TOKEN=your_token_here"
  echo "  $0 1709"
  exit 1
fi

if [ -z "$GITHUB_TOKEN" ]; then
  echo -e "${RED}❌ Error: GitHub token not found${NC}"
  echo "Set it with one of:"
  echo "  1. Pass as argument: $0 $PARENT_ISSUE <token>"
  echo "  2. Set env var: export GITHUB_TOKEN=your_token_here"
  exit 1
fi

# Check if tasks.md exists
if [ ! -f "specs/028-week-5-day/tasks.md" ]; then
  echo -e "${RED}❌ Error: specs/028-week-5-day/tasks.md not found${NC}"
  echo "Run this script from the repo root directory"
  exit 1
fi

# Export token for Node script
export GITHUB_TOKEN="$GITHUB_TOKEN"

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "   Parent Issue: #$PARENT_ISSUE"
echo "   Token: ${GITHUB_TOKEN:0:10}...${GITHUB_TOKEN: -4}"
echo ""

# Run Node script
echo -e "${YELLOW}⏳ Creating issues...${NC}\n"
node create-github-issues.mjs "$PARENT_ISSUE"

echo -e "${GREEN}✅ Done!${NC}"
echo ""
echo -e "${YELLOW}📌 Next Steps:${NC}"
echo "   1. Open GitHub Projects"
echo "   2. Add the created issues to the project board"
echo "   3. Organize by phase"
echo "   4. Assign to team members"
echo ""
