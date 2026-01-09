FROM node:20-alpine

WORKDIR /app/backend

# Copy only package files first (cache-friendly)
COPY backend/package*.json ./
RUN npm install --legacy-peer-deps

# Copy ALL source code AFTER deps
COPY backend ./
COPY common ../common

# 🔥 Force clean build
RUN rm -rf dist && npm run build

EXPOSE 8081

CMD ["node", "dist/server.js"]
