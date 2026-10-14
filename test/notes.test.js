import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../server.js';
import { openDb } from '../db.js';

async function withServer(run) {
  const server = createApp(openDb(':memory:')).listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try { await run(base); } finally { server.close(); }
}

test('a note sent from the form is saved and listed', async () => {
  await withServer(async (base) => {
    // The page sends { text }, exactly as public/index.html does.
    const saved = await fetch(`${base}/api/notes`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text: 'Call the venue' }) });
    assert.equal(saved.status, 201);
    const notes = await fetch(`${base}/api/notes`).then((res) => res.json());
    assert.equal(notes[0].body, 'Call the venue');
  });
});
