import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};

  test.beforeEach(async () => {
    vars = {};
  });

  test('2406_03375ec675f94e7fa9466fb59e04eba5_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      await stepGroups.stepGroup_updating_back_text_to_Delegated_Conventional_Mandatory(page, vars);
    }
  });
});
