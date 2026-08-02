# syntax=docker/dockerfile:1.7

ARG NODE_IMAGE=node:24-alpine@sha256:a0b9bf06e4e6193cf7a0f58816cc935ff8c2a908f81e6f1a95432d679c54fbfd
FROM ${NODE_IMAGE} AS build

ARG PUBLIC_DEPLOY_ENV=production
ARG PUBLIC_SITE_URL=https://iocode-solutions.com
ARG PUBLIC_LEGAL_APPROVED=false
ARG PUBLIC_LEGAL_NAME
ARG PUBLIC_LEGAL_BUSINESS_NAME=IoCode SOLUTIONS
ARG PUBLIC_LEGAL_STREET
ARG PUBLIC_LEGAL_POSTAL_CODE
ARG PUBLIC_LEGAL_CITY=Aachen
ARG PUBLIC_LEGAL_COUNTRY=Germany
ARG PUBLIC_LEGAL_EMAIL=contact@iocode-solutions.com
ARG PUBLIC_LEGAL_PHONE
ARG PUBLIC_LEGAL_VAT_ID
ARG PUBLIC_LEGAL_REGISTER_NAME
ARG PUBLIC_LEGAL_REGISTER_NUMBER

WORKDIR /app

ENV NODE_ENV=development
ENV ASTRO_TELEMETRY_DISABLED=1
ENV PUBLIC_DEPLOY_ENV=${PUBLIC_DEPLOY_ENV}
ENV PUBLIC_SITE_URL=${PUBLIC_SITE_URL}
ENV PUBLIC_LEGAL_APPROVED=${PUBLIC_LEGAL_APPROVED}
ENV PUBLIC_LEGAL_NAME=${PUBLIC_LEGAL_NAME}
ENV PUBLIC_LEGAL_BUSINESS_NAME=${PUBLIC_LEGAL_BUSINESS_NAME}
ENV PUBLIC_LEGAL_STREET=${PUBLIC_LEGAL_STREET}
ENV PUBLIC_LEGAL_POSTAL_CODE=${PUBLIC_LEGAL_POSTAL_CODE}
ENV PUBLIC_LEGAL_CITY=${PUBLIC_LEGAL_CITY}
ENV PUBLIC_LEGAL_COUNTRY=${PUBLIC_LEGAL_COUNTRY}
ENV PUBLIC_LEGAL_EMAIL=${PUBLIC_LEGAL_EMAIL}
ENV PUBLIC_LEGAL_PHONE=${PUBLIC_LEGAL_PHONE}
ENV PUBLIC_LEGAL_VAT_ID=${PUBLIC_LEGAL_VAT_ID}
ENV PUBLIC_LEGAL_REGISTER_NAME=${PUBLIC_LEGAL_REGISTER_NAME}
ENV PUBLIC_LEGAL_REGISTER_NUMBER=${PUBLIC_LEGAL_REGISTER_NUMBER}

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

ARG RELEASE_VERSION=0.0.0
ARG VCS_REF=unknown
ARG BUILD_DATE=unknown
ARG ARTIFACT_NAME=unknown
ARG ARTIFACT_SHA256=unknown

LABEL org.opencontainers.image.title="IoCode SOLUTIONS Web" \
  org.opencontainers.image.version="${RELEASE_VERSION}" \
  org.opencontainers.image.revision="${VCS_REF}" \
  org.opencontainers.image.created="${BUILD_DATE}" \
  org.opencontainers.image.source="https://github.com/dadd86/IoCode-WEB" \
  com.iocode.release.artifact.name="${ARTIFACT_NAME}" \
  com.iocode.release.artifact.sha256="${ARTIFACT_SHA256}"

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
