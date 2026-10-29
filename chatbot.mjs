// Bestehender Demo-Dienst und dieselbe serverseitige Empfängerzuordnung.
export const CHATBOT_BASE_URL = 'https://malerbot-mini.onrender.com';
export const CHATBOT_ID = 'fp-demo';

export function chatbotLoader(file) {
  if (file === 'kontakt.html') return '';
  return `<script src="${CHATBOT_BASE_URL}/loader.js" data-bot-id="${CHATBOT_ID}" data-widget-title="F&amp;P Anfrageannahme" defer></script>`;
}

export function embeddedChatbot() {
  return `<section class="section contact-chat-section" id="anfrage" aria-labelledby="chat-heading"><div class="wrap contact-chat-layout"><div class="contact-chat-copy"><span class="eyebrow">Chatbot ausprobieren</span><h2 id="chat-heading">Ihr Vorhaben.<br><em>Direkt im Chat.</em></h2><p>Testen Sie, wie der F&amp;P Chatbot eine Maler- oder Renovierungsanfrage aufnimmt und die wichtigsten Angaben zusammenfasst.</p><p>Nutzen Sie für diesen Test fiktive Angaben. Der gezeigte Malerbetrieb ist ein Beispielbetrieb.</p><a class="text-link" href="datenschutz.html#chatbot">Hinweise zum Demo-Chat ↗</a></div><div class="embedded-chatbot-card"><div class="embedded-chatbot-header"><strong>F&amp;P Anfrageannahme</strong><span>Maler- und Renovierungsanfragen ausprobieren</span></div><iframe id="embedded-chatbot-frame" data-embedded-chatbot-frame data-widget-src="${CHATBOT_BASE_URL}/widget.html" data-bot-id="${CHATBOT_ID}" data-widget-title="F&amp;P Anfrageannahme" title="F&amp;P Anfrageannahme Chatbot" loading="eager" referrerpolicy="no-referrer"></iframe><p class="chatbot-fallback">Falls der Chat nicht lädt: <a href="${CHATBOT_BASE_URL}/widget.html?botId=${CHATBOT_ID}" target="_blank" rel="noopener noreferrer">Chat in einem neuen Tab öffnen ↗</a></p></div></div></section>`;
}
