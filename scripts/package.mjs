import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
// Nur das feste Build-Verzeichnis dieses Projekts darf geleert werden.
if (path.dirname(output) !== root || path.basename(output) !== 'dist') {
  throw new Error('Ungültiges Ausgabeverzeichnis.');
}
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output);
const publicFiles = [
  'index.html', 'leistungen.html', 'renovierung.html', 'badmodernisierung.html',
  'referenzen.html', 'ueber-uns.html', 'kontakt.html', 'impressum.html',
  'datenschutz.html', 'style.css', 'script.js', 'chatbot.css', 'chatbot.js', 'favicon.svg',
  'BILDNACHWEIS.txt'
];
for (const file of publicFiles) {
  fs.copyFileSync(path.join(root, file), path.join(output, file));
}
function copyAssets(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.isDirectory()) copyAssets(path.join(from, entry.name), path.join(to, entry.name));
    else fs.copyFileSync(path.join(from, entry.name), path.join(to, entry.name));
  }
}
copyAssets(path.join(root, 'assets'), path.join(output, 'assets'));
console.log('Veröffentlichungsdateien in dist/ erstellt.');
