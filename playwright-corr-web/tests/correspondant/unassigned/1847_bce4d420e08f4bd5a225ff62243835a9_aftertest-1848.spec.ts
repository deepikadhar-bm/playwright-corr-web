import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};

  test.beforeEach(async () => {
    vars = {};
  });

  test('1847_bce4d420e08f4bd5a225ff62243835a9_aftertest', async ({ page }) => {
    await stepGroups.stepGroup_If_Test_case_fail(page, vars);
  });
});
