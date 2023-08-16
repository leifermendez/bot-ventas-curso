#!/bin/bash

# Ruta del directorio donde se encuentra el repositorio y el archivo docker-compose.yml
REPO_DIR="/root/bot-ventas-curso"
DOCKER_COMPOSE_FILE="${REPO_DIR}/docker-compose.yml"

# Nombre del servicio Docker Compose que deseas reiniciar
SERVICE_NAME="bot_ventas_docker"

# Cambiar al directorio del repositorio
cd "$REPO_DIR" || exit

# Realizar un pull del repositorio
git pull origin

# Construir la imagen de Docker (si es necesario)
docker-compose -f "$DOCKER_COMPOSE_FILE" build "$SERVICE_NAME"

# Reiniciar el servicio de Docker Compose
docker-compose -f "$DOCKER_COMPOSE_FILE" down
docker-compose -f "$DOCKER_COMPOSE_FILE" up -d "$SERVICE_NAME"

echo "Repositorio actualizado, imagen construida y servicio reiniciado."
