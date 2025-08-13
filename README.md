# Bionic Reading Webapp

Eine umfassende Webapp für Bionic Reading, Übersetzungen und Dokumentenverarbeitung. Diese Anwendung ermöglicht es Benutzern, EPUB-Dateien in Bionic Reading-Format zu konvertieren, große Dokumente mit der OpenAI API zu übersetzen und PDF-Dateien zu verarbeiten.

## 🚀 Funktionen

### 1. Bionic Reading Converter
- **EPUB-Konvertierung**: Konvertieren Sie EPUB-Dateien in Bionic Reading-Format
- **Umfangreiche Konfiguration**: 
  - Fett-Darstellung (% der Wortlänge)
  - Schriftgröße und -art
  - Zeilenabstand und Absatzabstände
  - Randeinstellungen
- **Live-Vorschau**: Sehen Sie Änderungen in Echtzeit
- **Download**: Exportieren Sie konvertierte EPUB-Dateien

### 2. Dokument-Übersetzer
- **OpenAI API-Integration**: Übersetzen Sie Dokumente ins Deutsche
- **Intelligente Chunk-Verarbeitung**: Dokumente werden in sinnvolle Einheiten aufgeteilt
- **Benutzerdefinierte Hinweise**: Geben Sie spezielle Übersetzungsanweisungen
- **Fortschrittsverfolgung**: Überwachen Sie den Übersetzungsprozess
- **Pausieren/Fortsetzen**: Kontrollieren Sie den Übersetzungsprozess

### 3. PDF-Verarbeiter
- **PDF-Upload**: Laden Sie PDF-Dateien hoch
- **Optionale Übersetzung**: Übersetzen Sie PDFs vor der Bionic Reading-Konvertierung
- **Optimale Reihenfolge**: Übersetzung → Bionic Reading → EPUB-Generierung
- **Schritt-für-Schritt-Verfolgung**: Sehen Sie jeden Verarbeitungsschritt
- **Konfigurierbare Bionic Reading-Einstellungen**

## 🛠️ Technologie-Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **File Upload**: React Dropzone
- **Routing**: React Router DOM

## 📋 Voraussetzungen

- Node.js 16+ 
- npm oder yarn
- OpenAI API-Schlüssel (für Übersetzungsfunktionen)

## 🚀 Installation

### 1. Repository klonen
```bash
git clone <repository-url>
cd bionic-reading-app
```

### 2. Abhängigkeiten installieren
```bash
npm install
# oder
yarn install
```

### 3. Umgebungsvariablen konfigurieren
Erstellen Sie eine `.env`-Datei im Root-Verzeichnis:
```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_API_URL=https://api.openai.com/v1
```

### 4. Entwicklungsserver starten
```bash
npm run dev
# oder
yarn dev
```

Die Anwendung ist dann unter `http://localhost:3000` verfügbar.

## 🏗️ Build für Produktion

### Development Build
```bash
npm run build
# oder
yarn build
```

### Preview des Production Builds
```bash
npm run preview
# oder
yarn preview
```

## 🐳 Docker Deployment

### Dockerfile erstellen
```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  bionic-app:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
```

## 🌐 Webserver-Konfiguration (Ubuntu + Caddy)

### Caddyfile
```caddy
bionic.liontribe.de {
    root * /var/www/bionic
    try_files {path} /index.html
    file_server
    
    # API-Proxy (falls Backend vorhanden)
    handle /api/* {
        reverse_proxy localhost:3001
    }
    
    # Gzip-Kompression
    encode gzip
    
    # Sicherheitsheader
    header {
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        X-XSS-Protection "1; mode=block"
    }
}
```

### Nginx-Konfiguration (Alternative)
```nginx
server {
    listen 80;
    server_name bionic.liontribe.de;
    
    root /var/www/bionic;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Gzip-Kompression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Sicherheitsheader
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
}
```

## 🔧 Konfiguration

### Bionic Reading-Einstellungen
- **Fett-Darstellung**: 20-80% der Wortlänge
- **Schriftgröße**: 12-24px
- **Zeilenabstand**: 1.2-2.5
- **Schriftarten**: Inter, Arial, Georgia, Times New Roman
- **Randeinstellungen**: 10-50px für alle Seiten

### Übersetzungseinstellungen
- **Chunk-Größe**: 500-2000 Zeichen
- **Zielsprachen**: Deutsch, Französisch, Spanisch, Italienisch
- **Formatierung beibehalten**: Ja/Nein
- **Originaltext einbeziehen**: Ja/Nein

## 📱 Responsive Design

Die Anwendung ist vollständig mobil-optimiert und funktioniert auf allen Geräten:
- **Mobile First**: Optimiert für Smartphones und Tablets
- **Touch-freundlich**: Große Touch-Targets und intuitive Gesten
- **Responsive Grid**: Passt sich automatisch an verschiedene Bildschirmgrößen an
- **Progressive Web App**: Kann als App installiert werden

## 🔒 Sicherheit

- **Datei-Validierung**: Nur erlaubte Dateitypen werden akzeptiert
- **Größenbeschränkungen**: Maximale Dateigrößen werden überwacht
- **API-Schlüssel**: OpenAI API-Schlüssel werden sicher gespeichert
- **HTTPS**: Alle Produktionsumgebungen verwenden HTTPS

## 🧪 Testing

```bash
# Linting
npm run lint

# Type-Checking
npm run type-check

# Build-Test
npm run build
```

## 📊 Performance

- **Lazy Loading**: Komponenten werden bei Bedarf geladen
- **Code Splitting**: Automatische Aufteilung in Chunks
- **Optimierte Bundles**: Minimierte und komprimierte Assets
- **Caching**: Effiziente Browser-Caching-Strategien

## 🤝 Beitragen

1. Fork das Repository
2. Erstellen Sie einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committen Sie Ihre Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Pushen Sie den Branch (`git push origin feature/AmazingFeature`)
5. Öffnen Sie einen Pull Request

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe `LICENSE` für weitere Details.

## 🆘 Support

Bei Fragen oder Problemen:
- Erstellen Sie ein Issue im GitHub-Repository
- Kontaktieren Sie das Entwicklungsteam
- Konsultieren Sie die Dokumentation

## 🔮 Roadmap

- [ ] Backend-API für echte Dateiverarbeitung
- [ ] Mehrsprachige Unterstützung
- [ ] Erweiterte Bionic Reading-Algorithmen
- [ ] Batch-Verarbeitung für mehrere Dateien
- [ ] Cloud-Speicher-Integration
- [ ] Benutzerkonten und Verlauf
- [ ] API für Entwickler

---

**Entwickelt mit ❤️ für besseres Lesen**
