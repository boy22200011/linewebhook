FROM node:22.11.0-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm build

EXPOSE 5000

CMD ["node", "dist/main.js"]

