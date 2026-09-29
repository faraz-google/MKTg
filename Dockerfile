FROM node:22-alpine AS runner

WORKDIR /app

# Create non-root user for Principle of Least Privilege
RUN addgroup -S replatform && adduser -S replatform -G replatform

COPY package.json ./
COPY server.js ./
COPY src ./src
COPY public ./public

RUN chown -R replatform:replatform /app
USER replatform

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]
