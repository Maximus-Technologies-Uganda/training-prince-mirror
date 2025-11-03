#!/bin/bash

# Script to create Linear sub-issues from 018-title-week-4/tasks.md

echo "=========================================="
echo "Linear Sub-Issue Creator"
echo "Feature: 018-title-week-4"
echo "Parent: PRI-2376"
echo "=========================================="
echo ""

# Check if LINEAR_API_KEY is set
if [ -z "$LINEAR_API_KEY" ]; then
    echo "❌ ERROR: LINEAR_API_KEY environment variable is not set"
    echo ""
    echo "To create sub-issues, run the command with your Linear API key:"
    echo ""
    echo "  LINEAR_API_KEY='your-api-key-here' node create-sub-issues-018-title-week-4.mjs"
    echo ""
    echo "To get your Linear API key:"
    echo "  1. Go to https://linear.app/settings/api"
    echo "  2. Create a new API key"
    echo "  3. Copy the key and use it in the command above"
    echo ""
    exit 1
fi

echo "✅ Linear API Key found"
echo ""
echo "Running sub-issue creator..."
echo ""

node create-sub-issues-018-title-week-4.mjs

exit $?
