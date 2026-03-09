import { defineConfig, devices } from '@playwright/test';
import { ENV } from './src/config/environments';
import path from 'path';



export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,

  reporter: [["html", { outputFolder: "playwright-report", open: "never" }],
  [path.join(__dirname, "reports/qa-reporter.js")],
  ['list'],
  ],
  timeout: 1800_000,
  expect: {
    timeout: 15_000,
  },

  use: {
    browserName: 'chromium',
    viewport: null,
    launchOptions: {
      args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox', '--force-device-scale-factor=0.9', '--disable-extensions'],
      slowMo: 3000, // ⬅️ Reduced from 5000ms to 2000ms (2 sec between actions)
    },
    baseURL: process.env.STG_URL2 || 'https://ppe-stg2-ext.cre8techdev.com/#/login',

    trace: 'on',
    screenshot: 'on',
    video: 'on',
    actionTimeout: 1 * 60 * 1000,
    navigationTimeout: 60_000,
  },

  projects: [
    {
      name: 'correspondant',
      testDir: './tests/correspondant',

      use: {
        browserName: 'chromium',

        timezoneId: 'UTC',

        viewport: { width: 1920, height: 1080 },
        // baseURL: ENV.CORR_QA_URL,
        launchOptions: {
          args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox', '--force-device-scale-factor=0.9'],
          slowMo: 2000, // ⬅️ Added slowMo to project config as well
        },
        baseURL: process.env.CORR_QA_URL || 'https://ext-qa.lpcorrtest.com/cp/',
      },
    },
  ],
});