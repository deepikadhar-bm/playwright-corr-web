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
    [path.join(__dirname, "reports/qa-reporter.js")],
    ['list']
  ],

  timeout: 120_000,

  expect: {
    timeout: 15_000,
  },

  use: {
    // headless: false,
    timezoneId: 'UTC',

    launchOptions: {
      slowMo: 5000,
    },

    trace: 'on',
    screenshot: 'on',
    video: 'on',

    actionTimeout: 2 * 60 * 1000,
    navigationTimeout: 60_000,
  },

  projects: [
    {
      name: 'correspondant',
      testDir: './tests/correspondant',

      use: {
        browserName: 'chromium',

        // ⭐ Force UTC in browser context
        timezoneId: 'UTC',

        viewport: { width: 1920, height: 1080 },

        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--force-device-scale-factor=0.9',
            '--window-size=1920,1080'
          ]
        },

        baseURL: process.env.CORR_QA_URL || 'https://ext-qa.lpcorrtest.com/cp/',
      },
    },
  ],
});