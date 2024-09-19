# Etapa 1: Construir la aplicación
FROM node:18-alpine AS builder

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos de package.json y package-lock.json al contenedor
COPY package*.json ./

# Instalar las dependencias necesarias
RUN npm install --legacy-peer-deps

# Copiar el resto de los archivos al contenedor
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa 2: Ejecutar la aplicación
FROM node:18-alpine AS runner

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos de construcción de la etapa anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Instalar solo las dependencias de producción
RUN npm install --only=production

# Establecer las variables de entorno (opcional, si usas variables en .env o config)
ENV NODE_ENV=production
ENV PORT=3000

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "dist/main"]
