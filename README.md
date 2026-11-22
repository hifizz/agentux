# Turnframe

An Agent UX showcase built with Next.js, Tailwind CSS, and Motion. It includes one interactive example, Prompt Composer, with a simulated chat response.

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

## Credits

The site is adapted from [Rare UI](https://rareui.com/) by Swami Malode. See [LICENSE](LICENSE) for the upstream copyright, attribution, and distribution terms.
