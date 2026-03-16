// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
  });

  test('2241_bbc18427981b44f1a90cdc0da0be4153_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      if (true) /* Element Cross Button is visible */ {
        await correspondentPortalPage.close_pop_up_bid_request_details.click();
      }
      if (true) /* Element Delete Button Early Config(Next Day) is visible */ {
        await stepGroups.stepGroup_Delete_early_config(page, vars);
      }
    }
  });
});
