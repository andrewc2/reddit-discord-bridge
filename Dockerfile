FROM denoland/deno:1.24.3

RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN chmod +x ./run.sh
CMD ["./run.sh"]
LABEL org.opencontainers.image.source https://github.com/Lucxjo/reddit-discord-bridge