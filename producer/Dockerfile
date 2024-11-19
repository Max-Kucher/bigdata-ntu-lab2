FROM node:22

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
