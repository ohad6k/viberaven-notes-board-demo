import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { openDb } from './db.js';

async function readJson(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

function send(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

export function createApp(db = openDb()) {
  return createServer(async (req, res) => {
    try {
      if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        res.end(await readFile(new URL('./public/index.html', import.meta.url)));
        return;
      }
      if (req.method === 'GET' && req.url === '/api/notes') {
        send(res, 200, db.prepare('SELECT id, body, created_at FROM notes ORDER BY id DESC').all());
        return;
      }
      if (req.method === 'POST' && req.url === '/api/notes') {
        const input = await readJson(req);
        const note = db.prepare('INSERT INTO notes (body) VALUES (?) RETURNING id, body, created_at').get(input.body);
        send(res, 201, note);
        return;
      }
      send(res, 404, { error: 'Not found' });
    } catch (error) {
      console.error(error);
      send(res, 500, { error: 'Could not save your note.' });
    }
  });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT) || 3000;
  createApp().listen(port, () => console.log(`Notes board on http://localhost:${port}`));
}
