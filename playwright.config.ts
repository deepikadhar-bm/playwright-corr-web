import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  timeout: 120_000,
  expect: {
    timeout: 15_000,
  },
  use: {
        launchOptions: {
      slowMo: 3000,
    },

    trace: 'on',
    screenshot: 'on',
    video: 'on',
    actionTimeout: 120_000,
    navigationTimeout: 60_000,
  },
  projects: [
    {
      name: 'correspondant',
      testDir: './tests/correspondant',
      use: {
        browserName: 'chromium',
        viewport: null,
        launchOptions: {
          args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox', '--force-device-scale-factor=0.9']
        },
        baseURL: process.env.CORR_QA_URL || 'https://ext-qa.lpcorrtest.com/cp/',
      },

    },
  ],
});
