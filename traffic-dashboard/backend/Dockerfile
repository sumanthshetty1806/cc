# Stage 1: Build Phase
FROM node:18-alpine

WORKDIR /usr/src/app

# Only copy package constraints initially to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies for a lighter container footprint
RUN npm config set legacy-peer-deps true
RUN npm ci --only=production

# Copy the rest of the application codebase 
COPY . .

# Explicitly expose mapping port defined in configuration
EXPOSE 5000

# Execute the native Node bootstrap script
CMD ["npm", "start"]
