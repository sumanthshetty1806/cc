# Stage 1: Build the React Application
FROM node:18-alpine as build
WORKDIR /app

# Cache standard dependencies explicitly
COPY package*.json ./
RUN npm install

# Build the Vite deployment bundle natively minimizing payloads
COPY . .
RUN npm run build

# Stage 2: Serve the finalized production bundle using Nginx Alpine
FROM nginx:alpine

# Purge default nginx configurations that prevent SPA routing
RUN rm /etc/nginx/conf.d/default.conf

# Map customized fallback Nginx configurations required for React Router hooks
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Migrate strictly the finalized /dist package onto the alpine serving blocks
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Execute server foreground daemon
CMD ["nginx", "-g", "daemon off;"]
