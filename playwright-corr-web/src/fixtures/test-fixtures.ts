import { test as base, Page } from '@playwright/test';
import { envVars } from '../config/environments';

type TestFixtures = {
  vars: Record<string, string>;
  authenticatedPage: Page;
};

export const test = base.extend<TestFixtures>({
  // Runtime variables object - matches Testsigma's runtime variable model
  vars: async ({}, use) => {
    const vars: Record<string, string> = { ...envVars };
    await use(vars);
  },

  // Page with extended timeout for slow-loading apps
  authenticatedPage: async ({ page }, use) => {
    page.setDefaultTimeout(30_000);
    page.setDefaultNavigationTimeout(60_000);
    await use(page);
  },
});

export { expect } from '@playwright/test';
