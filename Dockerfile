FROM node:18.7-alpine

RUN apk add --no-cache libc6-compat

RUN mkdir -p /app
WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc ./
RUN corepack enable
RUN corepack prepare pnpm@7.9.0 --activate
RUN apk update && apk upgrade
RUN apk add git
RUN pnpm install

COPY . /app
RUN pnpm install
RUN pnpm build
RUN rm -rf /app/src

CMD ["pnpm", "start"]
LABEL org.opencontainers.image.source https://github.com/Lucxjo/reddit-discord-bridge