// @ts-check
require('dotenv').config();
const { defineConfig, devices } = require('@playwright/test');
const { defineBddConfig } = require('playwright-bdd');

const testDir = defineBddConfig({
  features: './features/**/*.feature',
  steps: './features/steps/**/*.js',
});

module.exports = defineConfig({
  testDir,
  timeout: 120000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    trace: 'on',
    screenshot: 'on',
    video: 'on-first-retry',
    viewport: null,
    launchOptions: {
      slowMo: 200,
      args: ['--start-maximized'],
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: null, deviceScaleFactor: undefined },
    },
  ],
});
