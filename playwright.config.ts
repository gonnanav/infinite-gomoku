import { defineConfig, devices } from '@playwright/test';

const ci = !!process.env.CI;

const devServer = {
  command: 'npm run dev',
  url: 'http://localhost:5173',
  reuseExistingServer: true,
};

const previewServer = {
  command: 'npm run preview',
  url: 'http://localhost:8787',
  reuseExistingServer: false,
};

const server = ci ? previewServer : devServer;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: ci,
  retries: ci ? 2 : 0,
  workers: ci ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: server.url,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: server,
});
