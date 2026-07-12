/**
 * Text-to-Speech und Translation Utilities für HNOSS Papers
 */

// Text extrahieren und für TTS bereinigen
export const extractTextFromHTML = (html: string): string => {
  // Einfacher Ansatz: HTML-Tags entfernen und Text extrahieren
  const temp = document.createElement("div");
  temp.innerHTML = html;
  
  // Alle Textknoten extrahieren
  const textNodes: string[] = [];
  const walk = document.createTreeWalker(
    temp,
    NodeFilter.SHOW_TEXT,
    null
  );
  
  let node: Node | null;
  while ((node = walk.nextNode())) {
    const text = node.textContent?.trim();
    if (text) textNodes.push(text);
  }
  
  return textNodes.join(". ");
};

// Verfügbare Sprachen für TTS
export const TTS_LANGUAGES: Record<string, string> = {
  de: "de-DE",
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES",
  it: "it-IT",
  pt: "pt-PT",
  ru: "ru-RU",
  zh: "zh-CN",
  ja: "ja-JP",
  ar: "ar-SA"
};

// Sprache für TTS setzen
export const speakText = (text: string, langCode: string = "de"): void => {
  if (!text || !text.trim()) return;
  
  // Vorhandene Sprache stoppen
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = TTS_LANGUAGES[langCode] || "de-DE";
  utterance.rate = 0.9;
  utterance.pitch = 1;
  
  window.speechSynthesis.speak(utterance);
};

// Übersetzungsfunktion (Placeholder für zukünftige Integration)
// Funktioniert direkt im Browser ohne API
export const translateHTML = (_html: string, _targetLang: string): Promise<string> => {
  // Hinweis: Für vollständige Übersetzung müsste eine Translation-API genutzt werden
  // Aktuell wird HTML unverändert zurückgegeben
  return Promise.resolve(_html);
};