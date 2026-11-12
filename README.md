# TypeScript to Playwright

An interactive 70-day learning path for a Java tester moving to Playwright with TypeScript.

Live roadmap: https://sagaryessee.github.io/typescript-to-playwright/

Hosted using GitHub Pages from the root of the `main` branch.

## Saving progress across devices

1. Open the live roadmap and choose **Create private sync code**.
2. Copy the code and keep it in a password manager or another safe place.
3. On another device, open the same site, enter the code and choose **Connect**.

The code grants access to your completed days and topics, interaction labs and quiz answers.
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

Requires Node.js 22 or newer and npm:

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
`sync-config.js` and `topic-progress.js` to `main`; GitHub Pages publishes them automatically.

## Topic progress and compatibility

`topic-progress.js` is the shared, explicit catalog for all 70 days. IDs such as
`d01-t01` are permanent; names and task text may change without changing IDs.
Never renumber/reuse IDs or derive them from titles or array positions. Add new
IDs explicitly and deploy the Worker before publishing a catalog containing them.

Migration is lazy and deterministic, with no destructive database backfill:
when a `topic:<id>` field is absent, its initial value comes from that day's
legacy `day:<number>` flag. Existing completed days therefore start with all
current topics completed (including the added practice topics). Incomplete days
start with unchecked topics. An explicit topic value, including `false`, always
wins. Reapplying migration produces the same values. Local migration is saved
with the next progress save; cloud fallback is evaluated on every read, and
only edited topic fields are uploaded. Sync codes, queued offline changes,
lab fields, quiz answers and device preferences retain their existing formats.

The day checkbox is a bulk action that writes every topic in that day plus the
legacy day flag. Current day/week completion is calculated from topics; partial
days show a mixed checkbox and completion counts. Individual topic edits write
only that topic, preserving independent edits from other devices. The stored
legacy day flag remains a bulk-action compatibility marker: an old browser page
can show a different day summary after individual topic edits. Refresh all
open devices to use topic-aware summaries. Old clients do not erase topic
fields, and their day edits affect only topics without explicit values.

No D1 schema migration is required: the existing `(vault_id, field)` primary key
already stores the new topic fields. The Worker validates IDs against the same
catalog and retains the 16 KiB request limit. A complete snapshot is tested
against that limit and the real local D1 database.

For a future release (nothing is deployed by this change):

1. Use Node 22+, run `npm ci`, and authenticate Wrangler if needed.
2. Run `npm run deploy:api` to deploy the updated Worker and bundled catalog.
   Existing databases already on `0001_progress.sql` need no migration. A fresh
   database still needs `npm run db:remote` once.
3. Publish the frontend files together: `index.html`, `cloud-sync.js`,
   `topic-progress.js`, and the existing `sync-config.js`.
4. Refresh two devices on one existing sync code and verify topic unchecks,
   offline retry, lab completion and quiz answers.

### Checks

With the local Worker running, `npm test` covers real D1 writes, legacy day
migration, topic validation, complete snapshots, concurrent device updates,
offline reloads, connect/merge behavior and edits during requests.

With both local servers running, install the test browser and run:

```sh
npx playwright install chromium
npm run test:browser
```

Alternatively set `CHROMIUM_PATH` to an installed Chromium-family browser.
The browser check exercises local legacy migration, partial/bulk day controls,
keyboard focus and open details after rendering, widths 390/768/1440, and two
independent browsers syncing offline topic edits through real local D1 while
preserving the same sync code, labs and quiz answers.

### Page layout

Desktop content uses the available width instead of the former 980px container.
At widths of 1100px and above, section navigation opens in a left panel;
**Hide sections** collapses it and gives that space back to the content.
The choice is remembered locally on the device. On smaller screens the panel
starts collapsed and closes after selecting a section. Text retains a readable
line length while examples, tables and roadmap columns use the wider canvas.
