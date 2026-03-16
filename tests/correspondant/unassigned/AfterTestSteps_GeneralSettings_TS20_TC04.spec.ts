import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};

  test.beforeEach(async () => {
    vars = {};
  });

  test('2409_4976c8252e43473ca874b73a3133a9a8_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      if (true) /* Element Required Delete Email Button is visible */ {
        await stepGroups.stepGroup_Deleting_added_email_from_email_config(page, vars);
      }
    }
  });
});
