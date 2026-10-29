import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const requested=pathname==='/'?'/index.html':path.extname(pathname)?pathname:pathname.replace(/\/$/,'')+'.html';const target=path.resolve(root,'.'+requested);if(!target.startsWith(root+path.sep)||!types[path.extname(target)]){res.writeHead(404);res.end('Nicht gefunden');return;}const data=await fs.readFile(target);res.writeHead(200,{'Content-Type':types[path.extname(target)],'Cache-Control':'no-store'});res.end(data);}catch{res.writeHead(404);res.end('Nicht gefunden');}});
server.listen(Number(process.env.PORT)||4328,'127.0.0.1',()=>console.log('Lokale Vorschau: http://127.0.0.1:'+server.address().port));
