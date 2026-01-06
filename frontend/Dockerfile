# Use Node LTS Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for caching dependencies)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build Next.js app
RUN npm run build

# Expose frontend port
EXPOSE 7000

# Start the app
CMD ["npm", "start"]
