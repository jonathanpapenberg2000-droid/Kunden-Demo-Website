import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { legalPages } from '../legal-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = fs.readdirSync(root).filter(file => file.endsWith('.html'));
const htmlByFile = new Map(pages.map(file => [file, fs.readFileSync(path.join(root, file), 'utf8')]));
let checkedLinks = 0;
for (const [file, html] of htmlByFile) {
  assert.match(html, /noindex,nofollow/, `${file}: Demo-Kennzeichnung für Suchmaschinen fehlt`);
  assert.doesNotMatch(html, /01234567890|info@fp-maler\.de|\[Platzhalter|Lokale Designstudie/);
  const loaders = [...html.matchAll(/<script[^>]+src="https:\/\/malerbot-mini\.onrender\.com\/loader\.js"[^>]*>/g)];
  if (file === 'kontakt.html') {
    assert.equal(loaders.length, 0, 'Kein zweites Chatfenster neben dem eingebetteten Chat');
    assert.match(html, /id="anfrage"/);
    assert.match(html, /data-widget-src="https:\/\/malerbot-mini\.onrender\.com\/widget\.html"/);
    assert.match(html, /data-bot-id="fp-demo"/);
  } else {
    assert.equal(loaders.length, 1, `${file}: genau ein Chat-Loader erforderlich`);
    assert.match(loaders[0][0], /data-bot-id="fp-demo"/);
  }
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const value = match[1].replaceAll('&amp;', '&');
    if (/^(?:https?:|mailto:|tel:|data:)/.test(value)) continue;
    const url = new URL(value, `https://demo.invalid/${file}`);
    const target = decodeURIComponent(url.pathname).replace(/^\//, '') || 'index.html';
    assert.ok(fs.existsSync(path.join(root, target)), `${file}: Datei fehlt: ${target}`);
    if (url.hash && htmlByFile.has(target)) {
      const id = decodeURIComponent(url.hash.slice(1));
      assert.ok(htmlByFile.get(target).includes(`id="${id}"`), `${file}: Sprungziel fehlt: ${value}`);
    }
    checkedLinks++;
  }
}
for (const [file, content] of Object.entries(legalPages)) {
  assert.ok(htmlByFile.get(file).includes(content), `${file}: aktueller veröffentlichter Rechtstext muss erhalten bleiben`);
}
assert.equal(pages.length, 9);
assert.equal(htmlByFile.get('badmodernisierung.html'), htmlByFile.get('renovierung.html'));
console.log(`${pages.length} Seiten, ${checkedLinks} interne Links/Dateien, Chatbot und aktuelle Rechtstexte geprüft.`);
