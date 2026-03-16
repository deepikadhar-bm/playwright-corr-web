import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};

  test.beforeEach(async () => {
    vars = {};
  });

  test('1359_352e9d8092844fc4bfd94299a0234f54_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
      await stepGroups.stepGroup_Modifying_The_Batch_Intervals_For_one_Hour_Prior(page, vars);
    }
  });
});
