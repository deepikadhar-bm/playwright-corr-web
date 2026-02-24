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

  test('2103_7b2bf867f2d84cd5ae9a39ac4015f545_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      if (true) /* Element CrossButton [Edit Customer Permissions] is visible */ {
        await correspondentPortalPage.close_pop_up_bid_request_details.click();
        await correspondentPortalPage.close_pop_up_bid_request_details.waitFor({ state: 'hidden' });
      }
      await stepGroups.stepGroup_Toggling_the_Radio_Button_based_on_previous_state(page, vars);
    }
  });
});
