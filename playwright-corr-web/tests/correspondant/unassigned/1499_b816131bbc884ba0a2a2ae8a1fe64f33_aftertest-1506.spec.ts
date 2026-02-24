import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};

  test.beforeEach(async () => {
    vars = {};
  });

  test('1499_b816131bbc884ba0a2a2ae8a1fe64f33_aftertest', async ({ page }) => {
    await stepGroups.stepGroup_If_Test_case_fail(page, vars);
  });
});
