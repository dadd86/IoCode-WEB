# syntax=docker/dockerfile:1.7

FROM node:lts-alpine AS build

WORKDIR /app

ENV NODE_ENV=development
ENV ASTRO_TELEMETRY_DISABLED=1

RUN apk add --no-cache gcompat \
  && node --version \
  && npm --version

COPY package*.json ./

RUN test -f package.json || { echo "ERROR: package.json no existe en la raiz del proyecto." >&2; exit 64; }

RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

RUN npm run check
RUN npm run build


FROM node:lts-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV ASTRO_TELEMETRY_DISABLED=1

RUN apk add --no-cache gcompat \
  && node --version \
  && npm --version

COPY --from=build /app/dist ./dist
COPY Docker/node-static-server.mjs ./node-static-server.mjs

USER node

EXPOSE 8080

CMD ["node", "node-static-server.mjs"]