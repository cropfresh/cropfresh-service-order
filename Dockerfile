# Build stage
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY prisma/ ./prisma/
RUN npx prisma generate
COPY src/ ./src/
COPY protos/ ./protos/
RUN npm run build

# Production stage
FROM node:24-alpine AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

# Copy only production dependencies and built files
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/protos ./protos

# Set ownership and switch to non-root user
RUN chown -R appuser:nodejs /app
USER appuser

# Expose gRPC and HTTP ports
EXPOSE 3000 50051

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))" || exit 1

CMD ["node", "dist/index.js"]
