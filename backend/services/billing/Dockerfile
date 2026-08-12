FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY services/billing/package*.json ./services/billing/
RUN cd services/billing && npm ci --omit=dev

COPY services/billing ./services/billing
COPY shared ./shared

WORKDIR /app/services/billing

EXPOSE 8004

CMD ["npm", "start"]