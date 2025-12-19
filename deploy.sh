#!/bin/bash

echo "----------------------------------------"
echo "🚀 Starting Frontend Deployment"
echo "----------------------------------------"

# Step 1: Go to project root
PROJECT_ROOT=$(pwd)
echo "📌 Project root: $PROJECT_ROOT"

# Step 2: Pull latest code from GitHub
echo "📌 Pulling latest code from GitHub..."
git pull origin main

# Step 3: Stop running frontend container
echo "📌 Stopping running frontend container..."
docker compose down

# Step 4: Build and start frontend container
echo "📌 Building and starting frontend container..."
docker compose up --build -d frontend

# Step 5: Show running containers
echo "📌 Active containers:"
docker ps

# Step 6: Show frontend logs (last 50 lines)
echo "----------------------------------------"
echo "📄 Frontend Logs (last 50 lines)"
echo "----------------------------------------"
docker logs nextjs_frontend --tail=50

echo "----------------------------------------"
echo "✅ Frontend Deployment finished successfully!"
echo "----------------------------------------"
