#!/bin/bash

# Start the backend server in the background
echo "Starting backend server..."
cd backend && python3 -m uvicorn app:app --host 0.0.0.0 --port 8001 --reload &
BACKEND_PID=$!

# Wait a moment for the backend to start
sleep 2
echo "Backend server running on http://0.0.0.0:8001"

# Start the frontend
echo "Starting frontend..."
cd ..
npx expo start

# When the frontend is closed, kill the backend process
kill $BACKEND_PID 