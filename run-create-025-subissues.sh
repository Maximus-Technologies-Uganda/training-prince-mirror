#!/bin/bash

# Quick script to create all 25 Linear sub-issues for 025-week-5-day

if [ -z "$LINEAR_API_KEY" ]; then
  echo "❌ Error: LINEAR_API_KEY not set"
  echo ""
  echo "Usage:"
  echo "  1. Get your API key from: https://linear.app/settings/api"
  echo "  2. Run: export LINEAR_API_KEY='your-api-key'"
  echo "  3. Run: bash run-create-025-subissues.sh"
  echo ""
  exit 1
fi

cd "$(dirname "$0")"

echo "🚀 Starting Linear sub-issue creation for 025-week-5-day"
echo ""

node create-linear-sub-issues-025.mjs

echo ""
echo "✅ Script complete!"


