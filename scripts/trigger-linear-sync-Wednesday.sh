#!/bin/bash

#
# Trigger GitHub Actions workflow to create Linear sub-issues for Wednesday feature (PRI-289)
# Usage: GITHUB_TOKEN=your_token bash scripts/trigger-linear-sync-Wednesday.sh
#

set -e

# Configuration
REPO="Maximus-Technologies-Uganda/training-prince"
WORKFLOW_NAME="create-linear-sub-issues.yml"
PARENT_ID="PRI-289"
TASKS_FILE="specs/013-title-wednesday-spec/tasks.md"

# Check environment
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Error: GITHUB_TOKEN environment variable not set"
    echo ""
    echo "To get a GitHub token:"
    echo "1. Go to: https://github.com/settings/tokens"
    echo "2. Create a new token with 'actions' scope"
    echo "3. Run: export GITHUB_TOKEN='your_token_here'"
    echo ""
    exit 1
fi

if [ ! -f "$TASKS_FILE" ]; then
    echo "❌ Error: Tasks file not found at $TASKS_FILE"
    exit 1
fi

# Trigger workflow
echo "🚀 Triggering GitHub Actions workflow..."
echo "   Repository: $REPO"
echo "   Workflow: $WORKFLOW_NAME"
echo "   Parent Issue: $PARENT_ID"
echo "   Tasks File: $TASKS_FILE"
echo ""

RESPONSE=$(curl -s -X POST \
  "https://api.github.com/repos/$REPO/actions/workflows/$WORKFLOW_NAME/dispatches" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Content-Type: application/json" \
  -d "{
    \"ref\": \"feature/PRI-258-tuesday-ui-polishing\",
    \"inputs\": {
      \"parent_id\": \"$PARENT_ID\"
    }
  }")

echo "📋 Response: $RESPONSE"
echo ""
echo "✅ Workflow triggered successfully!"
echo ""
echo "📊 Next steps:"
echo "1. Go to: https://github.com/$REPO/actions/workflows/$WORKFLOW_NAME"
echo "2. Watch the workflow run create all 24 sub-issues under $PARENT_ID"
echo "3. Check Linear for the new sub-issues: https://linear.app/prince-training"
echo ""
