# Notes board (VibeRaven acceptance fixture)

A small full-stack app used to test VibeRaven's site flow end to end: a Node server, a SQLite database (`node:sqlite`, Node 22.13 or newer) and a page with a form.

It ships with a real bug on purpose: saving a note fails with "Could not save your note." `npm test` reproduces it.

```bash
npm run dev    # http://localhost:3000
npm test
```

Disposable test repository. Not a template, not maintained.
