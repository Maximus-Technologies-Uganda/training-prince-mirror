#!/bin/bash

# Extract your Linear API key and run the script
# The script is now FIXED to use parentId as UUID (not identifier)

# Just run this in your terminal:
# bash 025-RUN-THIS-COMMAND.sh

if [ -z "$LINEAR_API_KEY" ]; then
  echo "❌ LINEAR_API_KEY not set"
  echo ""
  echo "Get your API key from: https://linear.app/settings/api"
  echo "Then run:"
  echo ""
  echo "  export LINEAR_API_KEY='your-key-here'"
  echo "  bash 025-RUN-THIS-COMMAND.sh"
  echo ""
  exit 1
fi

echo "🚀 Creating 25 Linear sub-issues for 025-week-5-day..."
echo ""
node /Users/prnceb/Desktop/WORK/hello-world/create-linear-sub-issues-025.mjs

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ SUCCESS! All 25 sub-issues created under PRI-2545"
  echo ""
else
  echo ""
  echo "❌ Script failed. Check error messages above."
  exit 1
fi


