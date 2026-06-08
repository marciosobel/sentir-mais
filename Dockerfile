# Build stage
FROM oven/bun:alpine AS builder

WORKDIR /app

# Copy lock and manifest first to cache installs
COPY package.json bun.lock* ./
RUN bun install

# Copy source and build
COPY . .
RUN bunx --bun vite build

# Production stage: serve built files with Caddy
FROM caddy:2-alpine

# Copy built assets into caddy site dir
COPY --from=builder /app/dist /srv

# Copy caddy config
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 3000
