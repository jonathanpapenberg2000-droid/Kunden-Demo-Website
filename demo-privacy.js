(() => {
  const makeWidgetUrl = () => {
    const url = new URL('https://malerbot-mini.onrender.com/widget.html');
    url.searchParams.set('botId', 'fp-demo');
    url.searchParams.set('sourceUrl', `${location.origin}${location.pathname}`);
    url.searchParams.set('sourceHost', location.host);
    url.searchParams.set('sourcePath', location.pathname);
    url.searchParams.set('pageTitle', document.title);
    url.searchParams.set('widgetTitle', 'F&P · KI-Demo');
    return url.href;
  };
  const inlineFrame = document.querySelector('[data-embedded-chatbot-frame]');
  const inlineStart = document.querySelector('[data-demo-inline-start]');
  if (inlineFrame && inlineStart) {
    inlineStart.addEventListener('click', () => {
      inlineFrame.src = makeWidgetUrl();
      inlineFrame.hidden = false;
      inlineStart.closest('.demo-chat-notice').hidden = true;
    }, { once: true });
    return;
  }
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'demo-chat-toggle';
  button.textContent = 'KI-Demo-Chat öffnen';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', 'demo-chat-panel');
  const panel = document.createElement('section');
  panel.id = 'demo-chat-panel';
  panel.className = 'demo-chat-panel';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'F&P KI-Demo');
  panel.innerHTML = '<header><strong>F&P · KI-Demo</strong><a href="datenschutz.html#chatbot">Datenschutz</a></header><div class="demo-chat-notice"><p>Testen Sie mit fiktiven Angaben. Der Chatbot nutzt künstliche Intelligenz und kann Fehler machen; es werden keine Maleraufträge angenommen.</p><p>Beim Start wird die Chatoberfläche von Render geladen. Ihre Nachrichten und etwaige Bilder werden beim Absenden an OpenAI verarbeitet; abgeschlossene Testanfragen können per E-Mail an F&P gehen.</p><a href="datenschutz.html#chatbot">Datenverarbeitung ansehen</a><button type="button" data-demo-start>KI-Demo starten</button></div>';
  const start = panel.querySelector('[data-demo-start]');
  start.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = makeWidgetUrl();
    frame.title = 'KI-Demo-Chatbot von F&P';
    frame.referrerPolicy = 'no-referrer';
    panel.querySelector('.demo-chat-notice').replaceWith(frame);
  }, { once: true });
  button.addEventListener('click', () => {
    const open = panel.hidden;
    panel.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? 'KI-Demo-Chat schliessen' : 'KI-Demo-Chat öffnen';
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) {
      panel.hidden = true;
      button.setAttribute('aria-expanded', 'false');
      button.textContent = 'KI-Demo-Chat öffnen';
      button.focus();
    }
  });
  document.body.append(panel, button);
})();
