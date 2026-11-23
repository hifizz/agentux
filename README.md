# Turnframe

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

The site name, tagline, and logo path live in `lib/site.ts`.

## Reuse an example

Open **Install** on a demo to copy its shadcn command, or **Get code** to inspect and copy its files. Each static manifest contains the demo and its local dependencies, with import paths rewritten for installation. In a Tailwind v4 project import the included `turnframe/app/examples/_shared/tokens.css` in the main stylesheet, relative to the configured components directory. Render the demo inside a container with a height.

Run `npm run registry:build` after editing an example during development. The dev and production build commands generate the manifests automatically.
