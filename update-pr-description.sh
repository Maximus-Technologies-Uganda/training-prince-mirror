#!/bin/bash
# Script to update PR #1599 description with validated content

set -e

PR_NUMBER=1599
PR_DESC_FILE="PR_DESCRIPTION_VALIDATED.md"

echo "📝 Updating PR #${PR_NUMBER} description..."
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "   Install it from: https://cli.github.com/"
    echo ""
    echo "📋 Manual Update Instructions:"
    echo "1. Open PR #${PR_NUMBER} on GitHub"
    echo "2. Click 'Edit' on the PR description"
    echo "3. Copy the content from ${PR_DESC_FILE}"
    echo "4. Paste it into the PR description"
    echo "5. Click 'Update comment'"
    exit 1
fi

# Check if gh is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ GitHub CLI is not authenticated."
    echo "   Run: gh auth login"
    echo ""
    echo "📋 Manual Update Instructions:"
    echo "1. Open PR #${PR_NUMBER} on GitHub"
    echo "2. Click 'Edit' on the PR description"
    echo "3. Copy the content from ${PR_DESC_FILE}"
    echo "4. Paste it into the PR description"
    echo "5. Click 'Update comment'"
    exit 1
fi

# Update PR description
echo "✅ GitHub CLI is authenticated"
echo "📄 Reading description from ${PR_DESC_FILE}..."
echo ""

if gh pr edit ${PR_NUMBER} --body-file "${PR_DESC_FILE}"; then
    echo ""
    echo "✅ Successfully updated PR #${PR_NUMBER} description!"
    echo "   The validation check should pass on the next workflow run."
else
    echo ""
    echo "❌ Failed to update PR description."
    echo ""
    echo "📋 Manual Update Instructions:"
    echo "1. Open PR #${PR_NUMBER} on GitHub"
    echo "2. Click 'Edit' on the PR description"
    echo "3. Copy the content from ${PR_DESC_FILE}"
    echo "4. Paste it into the PR description"
    echo "5. Click 'Update comment'"
    exit 1
fi

