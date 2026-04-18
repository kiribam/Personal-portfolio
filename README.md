# Personal portfolio

Static personal portfolio built with [Astro](https://astro.build/). Pages: **Home**, **Projects** (overview plus category subpages), and **About me**. Global navigation appears on every page.

## Local development

Requires **Node.js 20+**.

```bash
npm install
npm run dev
```

Open the URL printed in the terminal (default `http://localhost:4321`). To preview the production build locally:

```bash
npm run build
npm run preview
```

## Production build

Set `PUBLIC_SITE_URL` to your public URL before building so canonical and Open Graph metadata are correct. See [DEPLOY.md](./DEPLOY.md) for Google Cloud Storage and HTTPS setup.

## Git workflow

See [docs/GIT-WORKFLOW.md](./docs/GIT-WORKFLOW.md) for branch naming and pull request conventions.
