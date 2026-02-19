# ---- Base ----
FROM node:20-alpine AS base
RUN npm install -g pnpm
WORKDIR /app
COPY pnpm-lock.yaml package.json ./

# ---- Builder ----
FROM base AS builder
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# ---- Production ----
FROM node:20-alpine AS production
RUN npm install -g pnpm
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["sh", "-c", "node migrate.js && node dist/main"]