# Imagen de Node para construir la app
FROM node:18-alpine AS builder

# Directorio de trabajo
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Compilar NestJS
RUN npm run build


# ------------------------------
# SEGUNDA IMAGEN: PRODUCCIÓN
# ------------------------------
FROM node:18-alpine

WORKDIR /app

# Solo copiar lo necesario
COPY package*.json ./
RUN npm install --production

# Copiar el código compilado
COPY --from=builder /app/dist ./dist

# Copiar el .env
COPY .env .

EXPOSE 3000

CMD ["node", "dist/main.js"]