FROM node:24-bookworm-slim

WORKDIR /app

ENV ASTRO_TELEMETRY_DISABLED=1

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    git \
    unzip \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

CMD ["sleep", "infinity"]