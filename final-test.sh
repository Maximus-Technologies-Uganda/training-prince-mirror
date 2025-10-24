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
sleep 15

# Test the server - try both ports
echo "Testing server connection..."

# Try port 5173 first (original command was trying this)
if curl -f http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Server is running successfully on port 5173"
    kill $PREVIEW_PID
    exit 0
fi

# Try port 4173 (default Vite preview port)
if curl -f http://localhost:4173 > /dev/null 2>&1; then
    echo "✅ Server is running successfully on port 4173"
    echo "ℹ️  Note: Original command was trying port 5173, but server is on 4173"
    kill $PREVIEW_PID
    exit 0
fi

echo "❌ Server failed to start on both ports"
kill $PREVIEW_PID
exit 1
