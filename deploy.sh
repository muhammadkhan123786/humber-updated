#!/bin/bash

# -----------------------------
# 🚀 Safe Deployment Script
# -----------------------------

# Go to project root
cd /var/www/humber/humber-updated || exit 1
PROJECT_ROOT=$(pwd)
echo "📌 Project root: $PROJECT_ROOT"

# Step 1: Pull latest code from GitHub
echo "📌 Pulling latest code from GitHub..."
git fetch origin main
git reset --hard origin/main
echo "✅ Latest code pulled."

# Step 2: Stop only your project containers (frontend + backend)
echo "📌 Stopping project containers..."
docker stop nextjs_frontend node_backend 2>/dev/null || true
docker rm nextjs_frontend node_backend 2>/dev/null || true
echo "✅ Project containers stopped (other containers safe)."

# Step 3: Ensure uploads folder exists (prevent accidental deletion)
if [ ! -d "./backend/uploads" ]; then
    echo "⚠️ 'uploads' folder missing! Creating..."
    mkdir -p ./backend/uploads
else
    echo "✅ 'uploads' folder exists, safe."
fi

# Step 4: Rebuild and start backend container
echo "📌 Building and starting backend container..."
docker compose build backend
docker compose up -d backend
echo "✅ Backend started."

# Step 5: Rebuild and start frontend container
echo "📌 Building and starting frontend container..."
docker compose build frontend
docker compose up -d frontend
echo "✅ Frontend started."

# Step 6: Show running containers for your project only
echo "📌 Active project containers:"
docker ps --filter "name=nextjs_frontend" --filter "name=node_backend"

# Step 7: Show logs
echo "----------------------------------------"
echo "📄 Backend logs (last 50 lines)"
echo "----------------------------------------"
docker logs node_backend --tail=50

echo "----------------------------------------"
echo "📄 Frontend logs (last 50 lines)"
echo "----------------------------------------"
docker logs nextjs_frontend --tail=50

echo "----------------------------------------"
echo "✅ Deployment finished successfully!"
echo "----------------------------------------"
