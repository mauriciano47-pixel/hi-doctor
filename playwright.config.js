import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 35000,
  workers: 1,
  use: {
    headless: true,
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'https://hidoc.pages.dev/',
    viewport: { width: 390, height: 844 }, // Viewport Canónico Móvil 390px (iPhone)
    trace: 'on-first-retry',
    channel: 'msedge',
  },
  projects: [
    {
      name: 'Mobile Viewport 390px (Edge)',
      use: {
        viewport: { width: 390, height: 844 },
        channel: 'msedge',
      },
    },
  ],
});
