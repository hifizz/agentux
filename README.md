# reni

An Agent UX showcase built with Next.js, Tailwind CSS, and Motion. Browse interactive composer, chat, and agent message examples. All interactions use local fixtures.

## Run locally

Use Node.js 20.9 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Run `npm run build` to export the static site to `out/`.

## Add an example

1. Add a route under `app/examples/`. Keep the example and its private UI in the same route directory.
2. Add the name, route, category, and description to `examples` in `lib/components.ts`.
3. Optionally set the entry's `preview` to a small component for the gallery card.
4. Get Code shows `demo.tsx` by default. To show the component implementation instead, list its files relative to `app/examples/` in `scripts/display-files.mjs`, primary file first. List multiple files only when they belong together; Install still includes all dependencies.

The site name, tagline, and logo path live in `lib/site.ts`.

## Reuse an example

Open **Install** on a demo to copy its shadcn command, or **Get code** to inspect and copy its files. Each static manifest contains the demo and its local dependencies, with import paths rewritten for installation. In a Tailwind v4 project import the included `reni/app/examples/_shared/tokens.css` in the main stylesheet, relative to the configured components directory. Render the demo inside a container with a height.

## Connect Langfuse

The Langfuse examples run on a redacted sample. To show your own sessions, copy `server/` and `http-load-io.ts` from `app/examples/_langfuse/` into your app. Install does not include them because the demos never import them. They use only web standards, but this site is a static export and cannot host the route itself.

```ts
// app/api/langfuse/route.ts
import { configFromEnv } from "@/lib/langfuse/server/client";
import { createLangfuseHandler } from "@/lib/langfuse/server/handler";

export const GET = createLangfuseHandler({
  config: () => configFromEnv(process.env),
  authorize: async (request) => isSignedIn(request),
});
```

Set `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY` and `LANGFUSE_BASE_URL` (the URL of your region) on the server only. In the browser, load the rows and render:

```tsx
const { rows, truncated } = await loadSessionRows("/api/langfuse", sessionId);
<SessionView session={toSession(rows)} loadIo={createHttpLoadIo("/api/langfuse")} />
```

Notes:

- Reads use `GET /api/public/v2/observations` with a bounded time range, 30 days back by default and 90 at most. A session older than that needs a larger `days`.
- The server follows cursors for up to 20 pages of 1000 rows and sets `truncated` when it stops early. It retries 429 and 5xx answers.
- Input and output are not part of the session load. `createHttpLoadIo` fetches them when a step opens.
- Cost stays empty for models without a price in your Langfuse project. The views show how many generations are unpriced.
- Always set `authorize`. Without it anyone who can reach the route can read your traces.

Run `npm run registry:build` after editing an example during development. The dev and production build commands generate the manifests automatically.
