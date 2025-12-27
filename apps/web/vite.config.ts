import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv, type PluginOption } from 'vite';
import compression from 'vite-plugin-compression2';
import { VitePWA } from 'vite-plugin-pwa';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const allowedHosts = env.VITE_ALLOWED_HOSTS?.split(',') || [];
  return {
    server: {
      host: true,
      allowedHosts,
    },
    esbuild: {
      supported: {
        'top-level-await': true,
      },
    },
    build: {
      target: 'es2020',
      rollupOptions: {
        output: {
          advancedChunks: {
            groups: [
              {
                name: 'react-vendor',
                test: /node_modules[\\/](react|react-dom|react-router)/,
                priority: 1,
              },
              {
                name: 'query',
                test: /node_modules[\\/](@tanstack\/react-query)/,
                priority: 2,
              },
            ],
          },
        },
      },
    },
    plugins: [
      mdx({ providerImportSource: '@mdx-js/react' }) as unknown as PluginOption,
      react(),
      tsConfigPaths(),
      VitePWA({
        workbox: {
          globPatterns: ['**/*.{js,jsx,html,css,ico,png,svg}'],
        },
        includeAssets: ['**/*'],
        manifest: {
          name: 'Boat share Raja Ampat',
          short_name: 'Boat share Raja Ampat',
          description: 'A webapp to share boats between Raja Ampat islands',
          theme_color: '#1098ad',
          background_color: '#1098ad',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          orientation: 'portrait-primary',
          display_override: ['minimal-ui', 'browser'],
          icons: [
            {
              src: '/icons/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icons/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icons/pwa-maskable-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/icons/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
          screenshots: [
            {
              src: '/icons/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              form_factor: 'wide',
            },

            {
              src: '/icons/pwa-320x320.png',
              sizes: '320x320',
              type: 'image/png',
              form_factor: 'narrow',
            },
          ],
        },
      }),
      compression({
        algorithms: ['gzip', 'brotliCompress'],
      }),
    ],
  };
});
