# Use Node LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy project files
COPY . .

# Build Next.js app using webpack (Turbopack workaround)
RUN npm run build --webpack

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "run", "start"]
