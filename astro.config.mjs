// @ts-check
import { defineConfig } from 'astro/config';

// Set PUBLIC_SITE_URL when building for production (canonical + Open Graph).
// Example: PUBLIC_SITE_URL=https://www.yourdomain.com npm run build
const site =
	process.env.PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://example.com';

// https://astro.build/config
export default defineConfig({
	site,
	output: 'static',
	trailingSlash: 'always',
});
