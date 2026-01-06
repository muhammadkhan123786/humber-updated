# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app/backend

# Copy package files and install dependencies
COPY backend/package*.json ./
RUN npm install --legacy-peer-deps

# Copy backend code + common folder
COPY backend ./ 
COPY common ../common

# Build backend (TypeScript)
RUN npm run build

# Expose backend port
EXPOSE 8081

# Start backend
CMD ["node", "dist/server.js"]
