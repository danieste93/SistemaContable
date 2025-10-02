# Usar Node.js 16 LTS (compatible con Next.js 10)
FROM node:16-alpine

# Instalar dependencias del sistema necesarias para compilación
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias con legacy peer deps
RUN npm install --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Construir la aplicación Next.js
RUN npm run build

# Establecer variables de entorno necesarias
ENV NODE_ENV="production"
ENV PORT="8080"

# Exponer el puerto
EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["npm", "start"]