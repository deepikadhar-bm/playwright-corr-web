import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};

  test.beforeEach(async () => {
    vars = {};
  });

  test('1854_00c6eae9345a4da1aed6a9f5585acbcd_aftertest', async ({ page }) => {
    await stepGroups.stepGroup_Market_Threshold_Values_Updating_Back(page, vars);
  });
});
