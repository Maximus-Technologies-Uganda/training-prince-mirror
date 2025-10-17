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

# Start preview server and keep it running
echo "Starting preview server..."
npm run preview &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 15

# Test the server
echo "Testing server connection..."
if curl -f http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Server is running successfully on port 5173"
    kill $SERVER_PID 2>/dev/null || true
    exit 0
else
    echo "❌ Server failed to start on port 5173"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi
