FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies for SWC on ARM64
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application with SWC disabled for ARM64 compatibility
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
