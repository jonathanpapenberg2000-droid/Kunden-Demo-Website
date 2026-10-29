'use strict';

// Gleiche Quell-Metadaten wie in der bisherigen Kontaktseite.
const embeddedChatbotFrame = document.querySelector('[data-embedded-chatbot-frame]');
if (embeddedChatbotFrame) {
  const widgetUrl = new URL(embeddedChatbotFrame.dataset.widgetSrc);
  widgetUrl.searchParams.set('botId', embeddedChatbotFrame.dataset.botId);
  widgetUrl.searchParams.set('sourceUrl', window.location.href);
  widgetUrl.searchParams.set('sourceHost', window.location.host);
  widgetUrl.searchParams.set('sourcePath', window.location.pathname);
  widgetUrl.searchParams.set('pageTitle', document.title);
  widgetUrl.searchParams.set('widgetTitle', embeddedChatbotFrame.dataset.widgetTitle);
  embeddedChatbotFrame.src = widgetUrl.href;
}
