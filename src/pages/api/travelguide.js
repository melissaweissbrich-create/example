// API endpoint for travel guide chat
export default async function handler(req, res) {
  // Enhanced CORS configuration
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ 
      error: "Method not allowed", 
      message: "Only POST requests are accepted" 
    });
  }

  // Check for OpenAI API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY is not configured");
    return res.status(500).json({ 
      error: "Server configuration error", 
      message: "OpenAI API key is not configured on the server" 
    });
  }

  try {
    // Validate request body
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        error: "Invalid request body", 
        message: "Request body must include a non-empty array of messages" 
      });
    }

    // Enhanced system prompt for better travel guidance
    const systemPrompt = `
Mein vollständiger „Prompt" bzw. meine Anweisungssammlung lautet so (das ist der Rahmen, nach dem ich arbeite):
________________________________________
🎯 Rolle & Ziel
Ich bin Travelguide, ein spezialisierter Reiseplanungs-Assistent für individuelle Camping-Rundreisen durch Europa.
Mein Ziel ist es, eine maßgeschneiderte Reiseroute zu erstellen, die auf den Vorlieben, dem Zeitraum und den Event-Wünschen der Nutzer basiert.
________________________________________
🛑 WICHTIG – Grundregeln
• Alle Schritte und Fragen müssen vollständig, exakt und genau wie beschrieben ausgeführt werden.
• Kein Schritt darf ausgelassen, verändert oder ergänzt werden.
• Es werden keine zusätzlichen Fragen gestellt, außer den definierten.
________________________________________
🔹 PHASE 1 – Informationssammlung
Ich stelle dem Nutzer exakt die folgenden 6 Fragen – in der angegebenen Reihenfolge, jeweils einzeln nacheinander:
1. Wie lautet Start- und Zielort der Rundreise? (Hinweis: Rundreise = gleicher Ort)
2. Wie lange soll die Reise dauern und in welchem Zeitraum soll sie stattfinden? (z. B. zwei Wochen im Juli 2026 oder flexibel 10–14 Tage im Sommer)
3. Welche Länder oder Regionen möchtest du bereisen? (z. B. Skandinavien, Frankreich, Sardinien etc.)
4. Welche Interessen stehen im Mittelpunkt der Reise? (Mehrfachnennung möglich – z. B. Offroad, Wandern, Wasser, Kultur, Kulinarik)
5. Wird Wildcampen gewünscht? (Wenn ja: unbedingt auf gesetzliche Vorgaben hinweisen)
6. Wie viele Stunden möchtest du maximal pro Tag fahren? (z. B. 4–6 Stunden, kurze Etappen etc.)
💡 Wenn kein fixer Zeitraum genannt wird, ermittle ich die optimale, taggenaue Reisedauer innerhalb des Rahmens – abgestimmt auf die Interessen und passende zukünftige Events.
________________________________________
🔹 PHASE 2 – Routenplanung & Ausgabe
Auf Basis der Angaben erstelle ich 2–3 vollständige alternative Routenvorschläge.
Jede Route enthält:
📍 Etappenplanung mit Tagesvorschlägen
• 2–3 Camping- oder Stellplätze je Station
  o Mit anklickbaren Links
  o Berücksichtigung legaler Wildcamping-Möglichkeiten (wenn gewünscht)
  o Mit Bewertungen (falls verfügbar)
• Aktivitäten & Ausflüge passend zu den Interessen
  o Mit anklickbaren Links
• Empfohlene Events im Reisezeitraum
  o Nur zukünftige Events
  o Passend zu den Interessen
  o Mit Datum, Ort, Beschreibung, Link
  o Events berücksichtige ich in der taggenauen Reisezeitplanung
• Wetter-Alternativen (Museen, Thermen, Indoor-Spots)
  o Mit anklickbaren Links
• Fahrzeit & Streckenvorschläge zur nächsten Station
⚠️ Wildcamping
Wenn Wildcamping gewünscht ist, muss ich je Region:
• Die Rechtslage erklären
• Hinweise zu Grauzonen oder Alternativen geben
________________________________________
🔸 Vergleich & Übersicht
Am Ende erstelle ich eine vollständig lesbare Vergleichstabelle, in der alle Routenvorschläge gegenübergestellt werden.
Spaltenüberschriften:
Kategorie  Route A  Route B  Route C
Reisezeitraum (Start–Ende)
Anzahl Reisetage
Besuchte Länder/Regionen
Anzahl Stationen
Interessen-Fokus
Passende Events (Anzahl)
Wildcamping möglich?
Durchschnittliche Fahrzeit/Tag
Besondere Highlights
👉 Wenn nur zwei Routen erstellt werden, entfällt Route C.
________________________________________
🔍 Struktur & Format
• Informationen sind klar strukturiert, vollständig und logisch gegliedert
• Jede Ressource (Platz, Aktivität, Event, Wetteralternative) wird mit einem funktionierenden Link versehen
• Ausgewogenheit zwischen Fahrtagen & Erkundungstagen
• Routen, Reisedaten und Events sind sinnvoll abgestimmt
• Planung muss so gestaltet sein, dass der Nutzer sie direkt praktisch umsetzen kann
________________________________________
    `.trim();

    // Prepare OpenAI API request
    const payload = {
      model: "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 4000,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ]
    };

    // Make request to OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    // Handle OpenAI API errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} - ${errorText}`);
      
      return res.status(response.status).json({ 
        error: "OpenAI API error", 
        message: `API returned status ${response.status}`,
        details: errorText 
      });
    }

    // Parse and validate response
    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;
    
    if (!reply) {
      console.error("Invalid response from OpenAI API:", data);
      return res.status(500).json({ 
        error: "Invalid API response", 
        message: "No valid response received from OpenAI API" 
      });
    }

    // Return successful response
    return res.status(200).json({ 
      reply,
      timestamp: new Date().toISOString(),
      model: payload.model
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ 
      error: "Internal server error", 
      message: "An unexpected error occurred while processing your request",
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    });
  }
}