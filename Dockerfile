# Multi-stage Dockerfile for FitFlow Full-Stack (Express + Vite + Socket.IO)

# Stage 1: Dependencies & Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy full application codebase
COPY . .

# Build Vite client and bundle Express server into dist/
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled frontend and backend bundle from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
