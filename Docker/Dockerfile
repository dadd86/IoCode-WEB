# syntax=docker/dockerfile:1.7

ARG NODE_IMAGE=node:24-alpine@sha256:a0b9bf06e4e6193cf7a0f58816cc935ff8c2a908f81e6f1a95432d679c54fbfd
FROM ${NODE_IMAGE} AS build

WORKDIR /app

ENV NODE_ENV=development
ENV ASTRO_TELEMETRY_DISABLED=1

RUN apk add --no-cache gcompat \
  && node --version \
  && npm --version

COPY package*.json .npmrc ./

RUN test -f package.json || { echo "ERROR: package.json no existe en la raiz del proyecto." >&2; exit 64; }

RUN npm ci

COPY . .

RUN npm run check
RUN npm run build


FROM ${NODE_IMAGE} AS runtime

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
