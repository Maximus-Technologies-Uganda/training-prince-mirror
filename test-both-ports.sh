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

# Test the server on both ports to see which one works
echo "Testing server connection..."

# Try port 4173 first (default preview port)
if curl -f http://localhost:4173 > /dev/null 2>&1; then
    echo "✅ Server is running successfully on port 4173"
    echo "Testing the original port 5173..."
    if curl -f http://localhost:5173 > /dev/null 2>&1; then
        echo "✅ Server is also responding on port 5173"
    else
        echo "ℹ️  Server is not responding on port 5173 (this is expected)"
    fi
    kill $PREVIEW_PID
    exit 0
else
    echo "❌ Server failed to start on port 4173"
    kill $PREVIEW_PID
    exit 1
fi
