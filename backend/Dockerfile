# Use Node LTS Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for caching dependencies)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose backend port
EXPOSE 8081

# Start the app
CMD ["npm", "run", "start"]
