import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};

  test.beforeEach(async () => {
    vars = {};
  });

  test('1272_c8418caef16443c79400a95c98ce07d6_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      await stepGroups.stepGroup_Navigating_to_Customer_Permission_and_enabling_the_Standard_(page, vars);
    }
  });
});
