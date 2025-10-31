#!/bin/bash

# This script triggers the cleanup workflow via GitHub Actions

REPO="Maximus-Technologies-Uganda/training-prince"
WORKFLOW="cleanup-duplicate-issues.yml"
BRANCH="development"
PARENT_ID="${1:-PRI-1447}"

echo "🚀 Triggering cleanup workflow for $PARENT_ID..."
echo ""

# Check if GITHUB_TOKEN is available
if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ GITHUB_TOKEN not found. Please set it:"
  echo "   export GITHUB_TOKEN=your_github_token"
  exit 1
fi

# Trigger workflow using GitHub REST API
curl -X POST \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$REPO/actions/workflows/$WORKFLOW/dispatches" \
  -d "{
    \"ref\": \"$BRANCH\",
    \"inputs\": {
      \"parent_id\": \"$PARENT_ID\"
    }
  }"

echo ""
echo "✅ Workflow triggered!"
echo ""
echo "📋 Check progress at:"
echo "   https://github.com/$REPO/actions/workflows/$WORKFLOW"
echo ""
