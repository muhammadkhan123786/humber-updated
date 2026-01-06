# Use Node LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy project files
# Step 5: Copy frontend code + common folder
COPY frontend ./frontend
COPY common ./common   # <<< important, ye hona chahiye

# Build Next.js app using webpack (Turbopack workaround)
RUN npm run build --webpack

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "run", "start"]
