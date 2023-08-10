FROM node:18-bullseye as bot
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install --global pnpm
RUN pnpm install
COPY . .
ARG PUBLIC_URL
ARG PORT
CMD ["npm", "start"]
