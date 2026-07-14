import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// The site is fully prerendered (see src/routes/+layout.js), so it ships
		// as static files rather than needing a Node/serverless host.
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false,
			strict: true
		})
	},
	preprocess: vitePreprocess()
};

export default config;
