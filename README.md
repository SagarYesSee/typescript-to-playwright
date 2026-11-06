# TypeScript to Playwright

An interactive 70-day learning path for a Java tester moving to Playwright with TypeScript.

Live roadmap: https://sagaryessee.github.io/typescript-to-playwright/

Hosted using GitHub Pages from the root of the `main` branch.

## Saving progress across devices

1. Open the live roadmap and choose **Create private sync code**.
2. Copy the code and keep it in a password manager or another safe place.
3. On another device, open the same site, enter the code and choose **Connect**.

The code grants access to your completed days, interaction labs and quiz answers.
It cannot be recovered if lost. Cloudflare stores a SHA-256 hash of the code,
not the code itself. The browser remembers the code so future visits reconnect.
Font and theme preferences remain local to each device.

When first connecting, **Include this browser's existing progress** combines
completed work. Cloud answers win if both devices have answered the same quiz
question. Uncheck this option to load only the cloud progress.

Changes save locally first, then sync after a short delay. Offline changes queue
in browser storage and retry when the connection returns. While the page is open,
it checks for changes from other devices every minute and when returning to the
tab. For the same field, the last update received by the server wins; changes to
different days do not overwrite each other. **Disconnect this device** keeps
the browser's progress and the cloud record, but removes the remembered code.
Clearing browser data removes that device's offline copy and remembered code.

## Cloudflare backend

The API runs as the `playwright-progress` Worker, backed by the
`playwright-progress` D1 database. GitHub Pages serves the website independently
of the laptop. Publishing HTML does not deploy the API.

Keep the Cloudflare account on the Workers Free plan. This project does not
activate paid services. Free-tier limits still apply.

### Local development

Requires Node.js and npm:

```sh
npm ci
npm run db:local
npm run dev:api
```

In a second terminal:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open http://localhost:8080. The localhost UI uses the local API on port 8787.
Run `npm test` while that API is running to test real local D1 storage.

### Deploying backend changes

```sh
npx wrangler login
npm run db:remote
npm run deploy:api
```

`cloudflare/wrangler.jsonc` contains the public database identifier and allowed
website origins. `sync-config.js` contains the public Worker URL. Neither file
contains credentials. Cloudflare authorization stays in Wrangler's local
credential store. Do not commit `.dev.vars`, `.env` or `.wrangler`.

To publish website changes, commit and push `index.html`, `cloud-sync.js` and
`sync-config.js` to `main`; GitHub Pages publishes them automatically.
