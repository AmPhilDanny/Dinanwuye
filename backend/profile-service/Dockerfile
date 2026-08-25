# Multi-stage build for smaller production image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY profile-service/package.json profile-service/package.json
COPY shared/package.json shared/package.json
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Generate Prisma Client
COPY profile-service/prisma ./profile-service/prisma/
RUN pnpm --filter @dinanwuye/profile-service exec prisma generate --schema prisma/schema.prisma

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/profile-service/prisma ./prisma

USER nestjs

EXPOSE 3000

CMD ["node", "dist/main.js"]