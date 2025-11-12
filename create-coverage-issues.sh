#!/bin/bash

# Script to create GitHub sub-issues from tasks.md for feature 029-coverage-hardening
# Creates sub-issues under parent issue: "feat(api): Day 4 - Coverage Lift & Edge Cases"

set -e

REPO="Maximus-Technologies-Uganda/training-prince"
PARENT_ISSUE_TITLE="feat(api): Day 4 - Coverage Lift & Edge Cases"
TASKS_FILE="/Users/prnceb/Desktop/WORK/training-prince/specs/029-coverage-hardening/tasks.md"

echo "🚀 Creating GitHub sub-issues from tasks..."
echo "Repository: $REPO"
echo "Parent Issue: $PARENT_ISSUE_TITLE"
echo "Tasks file: $TASKS_FILE"
echo ""

# First, find or create parent issue
echo "📍 Finding parent issue..."
PARENT_ISSUE=$(gh issue list --repo "$REPO" --search "$PARENT_ISSUE_TITLE" --state open --json number --jq ".[0].number" 2>/dev/null || echo "")

if [ -z "$PARENT_ISSUE" ]; then
  echo "❌ Parent issue not found. Please create the parent issue first:"
  echo "   Title: $PARENT_ISSUE_TITLE"
  echo "   Description: Week 5 Day 4 - Coverage Lift, Edge Cases & Security Hardening"
  exit 1
fi

echo "✓ Found parent issue: #$PARENT_ISSUE"
echo ""

# Extract tasks from tasks.md and create sub-issues
echo "📋 Processing tasks..."

# Counter for created issues
CREATED=0
FAILED=0

# Read tasks.md and extract task lines
while IFS= read -r line; do
  # Match lines like: - [ ] T001 [P] [US1] Description in file.js
  if [[ $line =~ ^-\ \[\ \]\ (T[0-9]+)\ (.*)$ ]]; then
    TASK_ID="${BASH_REMATCH[1]}"
    TASK_REST="${BASH_REMATCH[2]}"
    
    # Remove [P] marker if present
    TASK_REST="${TASK_REST#\[P\] }"
    
    # Extract story label if present
    STORY=""
    if [[ $TASK_REST =~ ^\[US[0-9]\] ]]; then
      STORY=$(echo "$TASK_REST" | grep -oP '\[US\d\]' | head -1)
      TASK_REST="${TASK_REST#$STORY }"
    fi
    
    # Build issue title
    ISSUE_TITLE="$TASK_ID $STORY: $TASK_REST"
    
    # Build issue body with link to parent
    ISSUE_BODY="Task from feature 029-coverage-hardening

Related to: #$PARENT_ISSUE"
    
    # Create the sub-issue
    echo -n "  Creating: $ISSUE_TITLE... "
    
    if ISSUE_NUM=$(gh issue create \
      --repo "$REPO" \
      --title "$ISSUE_TITLE" \
      --body "$ISSUE_BODY" \
      --label "029-coverage-hardening" \
      --json number \
      --jq ".number" 2>/dev/null); then
      
      echo "✓ Created #$ISSUE_NUM"
      ((CREATED++))
    else
      echo "⚠️  Issue creation may have failed, continuing..."
      ((FAILED++))
    fi
  fi
done < "$TASKS_FILE"

echo ""
echo "✅ Completed!"
echo "   Created: $CREATED sub-issues"
if [ $FAILED -gt 0 ]; then
  echo "   Failed: $FAILED"
fi
echo ""
echo "📊 View all sub-issues:"
echo "   gh issue list --repo $REPO --label 029-coverage-hardening"
