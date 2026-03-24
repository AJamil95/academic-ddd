#!/bin/sh

# Ejecutar migraciones de base de datos
npm run migrations:run

# Iniciar la aplicación
exec node dist/main.js