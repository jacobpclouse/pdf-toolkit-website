# Deployment issue: disallowed MIME type for `/src/main.tsx`

Summary
-------
- Symptom: Browser console shows an error loading `https://pdf.jacobpclouse.net/src/main.tsx` blocked with MIME type `application/octet-stream` and the site fails to boot.
- Root cause: The published `index.html` being served to the browser is the *development* `index.html` (which imports `/src/main.tsx`) instead of the production-built `dist/index.html` (which imports the bundled `/assets/*.js`). The dev `index.html` asks the browser to load a `.tsx` module from the server; GitHub Pages (or whatever host is serving your repository root) serves that raw file with a non-JS MIME type, so the browser refuses to execute it.

Why this happens
-----------------
- During development the app's `index.html` references `/<project-root>/src/main.tsx` as a module. That works with `vite dev` because the dev server transforms and serves TS/TSX as JS modules.
- In production you must deploy the files produced by `vite build` (the `dist` directory). `dist/index.html` references the built `assets/*.js` bundles, not `/src/main.tsx`.
- If GitHub Pages (or your hosting) ends up serving the repository root (or a `docs/` folder containing the unbuilt `index.html`), the browser will request the original `src/main.tsx` file from the server. The server will return the raw file (often with `application/octet-stream`) which is not a valid JS module MIME type, so the module load is blocked.

How I validated it locally
--------------------------
1. Ran a production build:

```bash
npm run build
```

2. Confirmed `dist/index.html` imports the bundled JS asset (example):

```html
<script type="module" crossorigin src="/assets/index-xxxxxx.js"></script>
```

3. Confirmed the repo root `index.html` (the source/dev file) still references `/src/main.tsx`:

```html
<script type="module" src="/src/main.tsx"></script>
```

Diagnosis
---------
- The built `dist` is correct. The problem is that the live site is still serving the repo's root `index.html` (the dev one) instead of the `dist` output.

Most likely causes
------------------
- GitHub Pages is configured to serve the repository root (or `docs`) rather than using the GitHub Actions Pages deployment created by `actions/deploy-pages`.
- A manual or earlier Pages setup (or a `CNAME` at repo root) is causing Pages to serve the unbuilt files.
- Browser caching or CDN caching serving an old `index.html`.

Fixes and recommended steps
--------------------------
1. Prefer the GitHub Actions Pages deployment (recommended):
   - In your repository **Settings → Pages**, ensure the **Source** is set to **GitHub Actions** (or that the site is configured to use the Pages deployment created by the action). This tells Pages to use the artifact uploaded by `actions/deploy-pages` rather than the branch contents.

2. If you intentionally serve from a branch/root (not using the action):
   - Deploy the built `dist` contents to that branch/folder (for example, push `dist/*` to `gh-pages` branch, or place files under `docs/` and serve `docs`), or update the root `index.html` so it references the built assets (not recommended — better to deploy `dist`).

3. Remove/avoid deploying the unbuilt `index.html` at the repo root (if it exists there):
   - If `index.html` in repo root is the dev file, it will continue to cause this problem when Pages uses the repo as source. Either remove it from the branch that Pages serves or switch Pages to use the Actions deployment.

4. Confirm the GitHub Actions workflow completed successfully:
   - Go to the repository **Actions** tab and open the most recent run of the workflow that contains the `build_and_predeploy` and `deploy` jobs. Confirm the `predeploy` step produced a `dist` and the `deploy` job used the uploaded artifact (check the `Upload artifact to Pages` and `Deploy to GitHub Pages` steps).

5. Check the deployed `index.html` on the site (quick verification):
   - In a browser fetch `https://pdf.jacobpclouse.net/index.html` and view source. If it contains `/src/main.tsx`, the site is serving the dev file. If it contains `/assets/index-*.js` then the built artifact is being served.

6. Clear caches / wait for DNS propagation if you recently changed the Pages configuration or custom domain.

Extra notes
-----------
- The console message about "The Components object is deprecated" is a runtime deprecation warning coming from the React/ReactDOM runtime or a library. It does not cause the MIME error — it is a separate warning you can address by updating the offending library or changing how components are created. It's safe to ignore while you fix the deployment.

- The MIME error arises because browsers require text/javascript (or equivalent JS module MIME) for modules; raw `.tsx` files are not valid JS modules on a static file server.

Quick verification commands (local)
---------------------------------

Build and serve locally to verify production output:

```bash
npm run build
# either
# 1) preview with vite (recommended)
npm run preview
# 2) or serve the dist dir with a static server
# install serve if you need it: npm i -g serve
# then
serve -s dist -l 5000

# open http://localhost:5000 and confirm the site loads and index.html references /assets/*.js
```

If you'd like me to make a small checklist PR (for example, update the workflow or add a short note in `README.md`), tell me which fix you prefer and I can apply the change.

If you want automated protection against accidentally publishing the dev `index.html`, one approach is to move the dev `index.html` into `src/` and keep only `index.html` in `dist` at publish time — but the simplest reliable fix is to configure GitHub Pages to use the Actions deployment (or to deploy `dist` to the served branch).

— End
