# Build-Stage
FROM node:18-alpine AS build

# Arbeitsverzeichnis setzen
WORKDIR /app

# Package-Dateien kopieren und Abhängigkeiten installieren
COPY package*.json ./
RUN npm ci --only=production

# Quellcode kopieren
COPY . .

# Anwendung bauen
RUN npm run build

# Production-Stage
FROM nginx:alpine

# Nginx-Konfiguration kopieren
COPY nginx.conf /etc/nginx/nginx.conf

# Gebaute Anwendung kopieren
COPY --from=build /app/dist /usr/share/nginx/html

# Port 80 exponieren
EXPOSE 80

# Nginx starten
CMD ["nginx", "-g", "daemon off;"]
