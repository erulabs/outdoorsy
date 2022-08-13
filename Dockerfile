# syntax=docker/dockerfile:1.3
# Install dependencies only when needed
FROM node:16-bullseye-slim AS deps
WORKDIR /app
COPY package.json yarn.lock .npmrc ./
RUN yarn install --frozen-lockfile

FROM node:16-bullseye-slim AS builder
WORKDIR /app
RUN apt-get update -yqq && \
  apt-get install -yqq awscli && \
  mkdir -p /app/secrets && \
  chown -R node:node /app
USER node
COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node scripts ./scripts
COPY --chown=node:node public ./public
COPY --chown=node:node styles ./styles
# COPY --chown=node:node components ./components
COPY --chown=node:node lib ./lib
COPY --chown=node:node pages ./pages
COPY --chown=node:node .env.loca[l] *.js *.json *.md ./
COPY --chown=node:node package.json tls.cr[t] tls.ke[y] /app/secrets/
RUN echo "Building with asset prefix: ${BUILD_ASSET_PREFIX}" && BUILD_ASSET_PREFIX=$BUILD_ASSET_PREFIX yarn build

FROM builder AS dev
ENV NEXT_TELEMETRY_DISABLED="1" \
  NODE_ENV="development" \
  HOST="0.0.0.0" \
  HTTPS=true
CMD ["yarn", "dev"]

FROM node:16-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV="production" \
  NEXT_TELEMETRY_DISABLED="1" \
  SSL_KEY_FILE="/app/secrets/tls.key" \
  SSL_CRT_FILE="/app/secrets/tls.crt"
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/public ./public
# Note that this pages dir is _only_ used by sitemap.xml (not served by Next)
COPY --from=builder /app/pages ./pages
COPY --from=builder /app/.env.local ./
COPY --from=builder --chown=node:node /app/https-server.js ./
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
EXPOSE 3002
VOLUME ["/app/secrets"]
CMD ["node", "https-server.js"]
