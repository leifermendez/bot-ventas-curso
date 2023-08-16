#!/bin/bash

# Ruta de la carpeta donde se eliminarán los archivos
carpeta="/ruta/de/la/carpeta"

# Eliminar archivos con extension .mp3
find "$carpeta" -type f -name "*.mp3" -exec rm -f {} \;

# Eliminar archivos con extension .ogg
find "$carpeta" -type f -name "*.ogg" -exec rm -f {} \;


echo "Archivos .mp3 y .ogg eliminados de la carpeta: $carpeta"
