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
export const TTS_LANGUAGES = {
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
  utterance.lang = TTS_LANGUAGES[langCode as keyof typeof TTS_LANGUAGES] || "de-DE";
  utterance.rate = 0.9;
  utterance.pitch = 1;
  
  window.speechSynthesis.speak(utterance);
};

// Übersetzungsfunktion (Browser-eigene, keine API nötig)
export const translateHTML = (html: string, targetLang: string): Promise<string> => {
  // Hinweis: Für vollständige Übersetzung müsste eine Translation-API genutzt werden
  // Dies ist eine Placeholder-Implementierung
  return new Promise((resolve) => {
    resolve(html);
  });
};