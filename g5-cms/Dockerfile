FROM node:22-alpine AS runner

WORKDIR /app

# Create non-root user for Principle of Least Privilege
RUN addgroup -S g5cms && adduser -S g5cms -G g5cms

COPY package.json ./
COPY server.js ./
COPY data ./data
COPY public ./public

RUN chown -R g5cms:g5cms /app
USER g5cms

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "server.js"]
