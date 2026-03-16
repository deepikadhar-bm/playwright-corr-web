import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};

  test.beforeEach(async () => {
    vars = {};
  });

  test('1044_db00b840b176466ab5180f158fb7c13c_aftertest', async ({ page }) => {
    await stepGroups.stepGroup_Deleting_BidMaps_After_Test_StepsAdvance_Search(page, vars);
  });
});
