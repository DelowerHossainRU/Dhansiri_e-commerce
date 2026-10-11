# Production Dockerfile for Backend
FROM node:20-alpine AS base

# Install curl for container health check
RUN apk add --no-cache curl

WORKDIR /usr/src/app

# Copy dependency specifications
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy application source
COPY . .

# Create uploads directory and set permissions
RUN mkdir -p src/uploads && chown -R node:node /usr/src/app

# Switch to non-root user for security
USER node

EXPOSE 5000

ENV NODE_ENV=production \
    PORT=5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

CMD ["node", "src/server.js"]
