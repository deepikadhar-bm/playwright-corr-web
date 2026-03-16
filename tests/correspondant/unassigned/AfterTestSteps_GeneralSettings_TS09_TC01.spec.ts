import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};

  test.beforeEach(async () => {
    vars = {};
  });

  test('2173_490d675c06444514a0800d6297565cda_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      await stepGroups.stepGroup_Changing_the_Conventional_type_config(page, vars);
    }
  });
});
