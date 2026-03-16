import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};

  test.beforeEach(async () => {
    vars = {};
  });

  test('1843_107d70ea2ef7461092ae5237c1eab5cc_aftertest', async ({ page }) => {
    await stepGroups.stepGroup_Market_Threshold_Values_Updating_Back(page, vars);
  });
});
