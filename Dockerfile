FROM node:20.9-alpine AS builder
WORKDIR /app

# Copy only package manifests and install dependencies
COPY package.json package-lock.json* ./
# Use npm ci for reproducible builds and faster installs
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build


# 2) Production stage: serve with nginx
FROM nginx:alpine

# Remove default config and add minimal nginx config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copy built static files from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port and start nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]