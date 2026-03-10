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
 
  timeout: 900_000,
 
  expect: {
    timeout: 15_000,
  },
 
  use: {
    headless: true,
    timezoneId: 'UTC',
 
    launchOptions: {
      slowMo: 2000,
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
 
        timezoneId: 'UTC',
 
        viewport: { width: 1920, height: 1080 },
        // baseURL: ENV.CORR_QA_URL,
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--force-device-scale-factor=0.9',
            '--window-size=1920,1080'
          ],
          slowMo: 2000,
        },
 
 
      },
    },
  ],
});