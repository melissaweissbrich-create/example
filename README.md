# Travel Guide - Europa Camping Rundreisen 🏕️

Ein spezialisierter Reiseplanungs-Assistent für individuelle Camping-Rundreisen durch Europa.

## Features

- 🎯 **Persönliche Beratung**: 6 gezielte Fragen für maßgeschneiderte Reisepläne
- 🗺️ **Detaillierte Routenvorschläge**: 2-3 vollständige alternative Routen
- 🏕️ **Camping-Stellplätze**: Konkrete Empfehlungen mit direkten Links
- 🎪 **Events & Aktivitäten**: Passende Veranstaltungen im Reisezeitraum
- 🌍 **Europa-weit**: Alle europäischen Länder und Regionen
- 📱 **Responsive Design**: Optimiert für Desktop und Mobile

## Design

Das Interface verwendet ein modernes, camping-freundliches Design mit:

- **Schriftart**: Poppins (Google Fonts)
- **Primärfarbe**: #09C2C1 (Türkis)
- **Sekundärfarbe**: #044954 (Dunkelblau)
- **Hintergrund**: #FEFBF8 (Warmes Weiß)
- **Textfarbe**: #252628 (Dunkelgrau)

## Installation

1. **Repository klonen**:
   ```bash
   git clone <repository-url>
   cd example
   ```

2. **Dependencies installieren**:
   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren**:
   Erstellen Sie eine `.env.local` Datei im Projektroot:
   ```
   OPENAI_API_KEY=ihr_openai_api_key_hier
   ```

4. **Development Server starten**:
   ```bash
   npm run dev
   ```

5. **Anwendung öffnen**:
   Besuchen Sie [http://localhost:3000](http://localhost:3000)

## Build für Produktion

```bash
# Build erstellen
npm run build

# Production Server starten
npm start
```

## API Endpunkt

### POST /api/travelguide

Sendet Nachrichten an den Travel Guide und erhält personalisierte Reiseempfehlungen.

**Request Body**:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Ich möchte eine Rundreise planen"
    }
  ]
}
```

**Response**:
```json
{
  "reply": "Detaillierte Antwort des Travel Guide...",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "model": "gpt-4o-mini"
}
```

## Technologie Stack

- **Framework**: Next.js 15
- **Frontend**: React 18 mit TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4o-mini
- **Deployment**: Vercel-ready

## Projektstruktur

```
src/
├── app/
│   ├── globals.css          # Globale Styles mit Tailwind
│   ├── layout.tsx           # Root Layout
│   └── page.tsx             # Hauptseite
├── components/
│   ├── ChatMessage.tsx      # Chat-Nachrichten Komponente
│   └── MessageInput.tsx     # Nachrichteneingabe
└── pages/
    └── api/
        └── travelguide.js   # API Endpunkt
```

## Development

- **Linting**: `npm run lint`
- **Type Checking**: Automatisch bei Build
- **Hot Reload**: Automatisch im Development Mode

## Umgebungsvariablen

| Variable | Beschreibung | Erforderlich |
|----------|-------------|--------------|
| `OPENAI_API_KEY` | OpenAI API Schlüssel für GPT-4o-mini | Ja |

## Lizenz

Dieses Projekt ist für den internen Gebrauch bestimmt.