import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};

  test.beforeEach(async () => {
    vars = {};
  });

  test('2155_60929dd62c064bcaa462471f8cc21e4c_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      if (true) /* Element Delete Button (early config) is visible */ {
        await stepGroups.stepGroup_Delete_early_config(page, vars);
      }
    }
  });
});
