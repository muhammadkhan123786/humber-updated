#!/bin/bash

# -----------------------------
# 🚀 Full Safe Deployment Script
# -----------------------------

# Go to project root
cd /var/www/humber/humber-updated || exit 1
PROJECT_ROOT=$(pwd)
echo "📌 Project root: $PROJECT_ROOT"

# Step 1: Pull latest code
echo "📌 Pulling latest code from GitHub..."
git fetch origin main
git reset --hard origin/main
echo "✅ Latest code pulled."

# Step 2: Stop only project containers
echo "📌 Stopping project containers..."
docker stop nextjs_frontend node_backend 2>/dev/null || true
docker rm nextjs_frontend node_backend 2>/dev/null || true
echo "✅ Project containers stopped (other containers safe)."

# Step 3: Ensure uploads folder exists
if [ ! -d "./backend/uploads" ]; then
    echo "⚠️ 'uploads' folder missing! Creating..."
    mkdir -p ./backend/uploads
else
    echo "✅ 'uploads' folder exists, safe."
fi

# Step 4: Clean old frontend build and node_modules
echo "📌 Cleaning frontend build cache..."
rm -rf ./frontend/node_modules ./frontend/.next
cd frontend
npm install --legacy-peer-deps
cd ..
echo "✅ Frontend cache cleaned and dependencies installed."

# Step 5: Clean old backend node_modules
echo "📌 Cleaning backend node_modules..."
rm -rf ./backend/node_modules
cd backend
npm install
cd ..
echo "✅ Backend dependencies installed."

# Step 6: Remove old Docker images to avoid caching issues
echo "📌 Removing old Docker images..."
docker rmi nextjs_frontend node_backend 2>/dev/null || true
echo "✅ Old Docker images removed."

# Step 7: Build and start backend container
echo "📌 Building and starting backend container..."
docker compose build --no-cache backend
docker compose up -d backend
echo "✅ Backend started."

# Step 8: Build and start frontend container
echo "📌 Building and starting frontend container..."
docker compose build --no-cache frontend
docker compose up -d frontend
echo "✅ Frontend started."

# Step 9: Show running containers for your project
echo "📌 Active project containers:"
docker ps --filter "name=nextjs_frontend" --filter "name=node_backend"

# Step 10: Show logs (last 50 lines)
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