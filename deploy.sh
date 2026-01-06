#!/bin/bash

echo "----------------------------------------"
echo "🚀 Starting Full Deployment (Frontend + Backend)"
echo "----------------------------------------"

# Go to project root
cd /var/www/humber || exit 1
PROJECT_ROOT=$(pwd)
echo "📌 Project root: $PROJECT_ROOT"

# Step 1: Pull latest code from GitHub
echo "📌 Pulling latest code from GitHub..."
git fetch origin main
git reset --hard origin/main
echo "✅ Latest code pulled."

# Step 2: Stop containers safely (DO NOT remove volumes)
echo "📌 Stopping running containers..."
docker compose stop
docker compose rm -f
echo "✅ Containers stopped."

# Step 3: Rebuild backend
echo "📌 Rebuilding backend container..."
docker compose build backend
echo "✅ Backend rebuild complete."

# Step 4: Rebuild frontend
echo "📌 Rebuilding frontend container..."
docker compose build frontend
echo "✅ Frontend rebuild complete."

# Step 5: Start all containers
echo "📌 Starting containers..."
docker compose up -d
echo "✅ All containers started."

# Step 6: Show active containers
echo "📌 Active containers:"
docker ps

# Step 7: Show logs for backend and frontend
echo "----------------------------------------"
echo "📄 Backend Logs (last 50 lines)"
echo "----------------------------------------"
docker logs node_backend --tail=50

echo "----------------------------------------"
echo "📄 Frontend Logs (last 50 lines)"
echo "----------------------------------------"
docker logs nextjs_frontend --tail=50

# Step 8: Check uploads folder
if [ -d "./backend/uploads" ]; then
  echo "✅ 'uploads' folder exists, no need to restore."
else
  echo "⚠️ 'uploads' folder missing! Restore from backup."
fi

echo "----------------------------------------"
echo "✅ Deployment finished successfully!"
echo "----------------------------------------"
