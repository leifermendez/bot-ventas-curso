# Etapa de construcción
FROM node:18-bullseye as builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install --global pnpm
RUN pnpm install
COPY . .

# Etapa de producción
FROM node:18-bullseye
WORKDIR /app
COPY --from=builder /app ./
ARG PUBLIC_URL
ARG PORT
CMD ["npm", "start"]
