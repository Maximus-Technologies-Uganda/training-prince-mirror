#!/bin/bash
set -e

# Add Node.js to PATH
export PATH="/usr/local/bin:$PATH"

echo "Starting frontend preview server..."

# Change to frontend directory
cd frontend

# Build the project first
echo "Building frontend..."
npm run build

# Start preview server in background
echo "Starting preview server..."
npm run preview &
PREVIEW_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 10

# Test the server
echo "Testing server connection..."
if curl -f http://localhost:4173; then
    echo "✅ Server is running successfully on port 4173"
    kill $PREVIEW_PID
    exit 0
else
    echo "❌ Server failed to start on port 4173"
    kill $PREVIEW_PID
    exit 1
fi
