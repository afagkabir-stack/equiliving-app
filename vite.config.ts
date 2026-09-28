import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  // Automatic Base URL Detection:
  // - Vercel automatically sets process.env.VERCEL = '1' -> root base '/'
  // - GitHub Pages sets process.env.GITHUB_PAGES = 'true' or BASE_PATH -> '/equiliving-app/'
  // - Default fallback: '/'
  const isVercel = process.env.VERCEL === '1' || Boolean(process.env.VERCEL);
  const isGitHubPages = process.env.GITHUB_PAGES === 'true';
  const base = process.env.BASE_PATH || (isVercel ? '/' : isGitHubPages ? '/equiliving-app/' : '/');

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('.', import.meta.url)),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

