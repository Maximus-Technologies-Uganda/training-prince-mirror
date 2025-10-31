#!/bin/bash
# Linear Sync Helper Script for Day 0: CI Maturity, Review Packet Parity, and Repository Hygiene

echo "=== Linear Sync Helper ==="
echo "This script will create Linear sub-issues from tasks.md"
echo ""

# Check if .linear-parent file exists and has a valid ID
PARENT_FILE="specs/011-title-day-0/.linear-parent"
if [ ! -f "$PARENT_FILE" ]; then
    echo "❌ Error: $PARENT_FILE not found"
    exit 1
fi

PARENT_ID=$(cat "$PARENT_FILE" | tr -d '\n' | tr -d '\r' | xargs)
if [ -z "$PARENT_ID" ] || [ "$PARENT_ID" = "PRI-XXX" ]; then
    echo "❌ Error: Please update $PARENT_FILE with your actual Linear parent issue ID"
    echo "   Example: PRI-154, ENG-123, etc."
    exit 1
fi

echo "✅ Parent issue ID: $PARENT_ID"

# Check if tasks.md exists
TASKS_FILE="specs/011-title-day-0/tasks.md"
if [ ! -f "$TASKS_FILE" ]; then
    echo "❌ Error: $TASKS_FILE not found"
    exit 1
fi

echo "✅ Tasks file: $TASKS_FILE"

# Check if Linear API key is available
if [ -z "${LINEAR_API_KEY:-}" ]; then
    echo "❌ Error: LINEAR_API_KEY environment variable not set"
    echo ""
    echo "To set it up:"
    echo "1. Go to Linear Settings → API"
    echo "2. Create a new API key"
    echo "3. Run: export LINEAR_API_KEY='your_api_key_here'"
    echo "4. Then run this script again"
    exit 1
fi

echo "✅ Linear API key is set"

# Set required environment variables
export LINEAR_TEAM_NAME="Prince Training"
export LINEAR_PROJECT_NAME="Training-Prince"
export LINEAR_PARENT_IDENTIFIER="$PARENT_ID"
export TASKS_FILE="$TASKS_FILE"

echo ""
echo "🚀 Running Linear sync..."
echo "   Team: $LINEAR_TEAM_NAME"
echo "   Project: $LINEAR_PROJECT_NAME"
echo "   Parent: $LINEAR_PARENT_IDENTIFIER"
echo ""

# Run the linear-sync script
node scripts/linear-sync.js

echo ""
echo "✅ Linear sync completed!"
echo "   Check your Linear workspace for the created sub-issues"
