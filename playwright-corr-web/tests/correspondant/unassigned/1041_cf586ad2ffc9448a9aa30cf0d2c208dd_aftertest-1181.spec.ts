import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};

  test.beforeEach(async () => {
    vars = {};
  });

  test('1041_cf586ad2ffc9448a9aa30cf0d2c208dd_aftertest', async ({ page }) => {
    await stepGroups.stepGroup_Deleting_BidMaps_After_Test_StepsAdvance_Search(page, vars);
  });
});
