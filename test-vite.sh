#!/bin/bash
set -e

# Add Node.js to PATH
export PATH="/usr/local/bin:$PATH"

echo "Testing Vite server startup..."

# Change to frontend directory
cd frontend

# Try to start preview server and capture output
echo "Starting preview server..."
npx vite preview --port 4173 --host 0.0.0.0 2>&1 &
VITE_PID=$!

echo "Vite PID: $VITE_PID"

# Wait a bit for server to start
sleep 8

# Check if process is still running
if ps -p $VITE_PID > /dev/null; then
    echo "✅ Vite process is running"
    
    # Test connection
    echo "Testing connection..."
    if curl -f http://localhost:4173 > /dev/null 2>&1; then
        echo "✅ Server is responding on port 4173"
        kill $VITE_PID
        exit 0
    else
        echo "❌ Server is not responding on port 4173"
        kill $VITE_PID
        exit 1
    fi
else
    echo "❌ Vite process died"
    exit 1
fi
