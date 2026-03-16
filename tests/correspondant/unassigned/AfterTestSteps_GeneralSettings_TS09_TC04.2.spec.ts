// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestConfigPage } from '../../../src/pages/correspondant/bid-request-config';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestConfigPage: BidRequestConfigPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestConfigPage = new BidRequestConfigPage(page);
  });

  test('2228_c458acc7201b4cc2bfdf1c68453aed9a_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      await stepGroups.stepGroup_Navigating_To_Bid_Request_Config(page, vars);
      if (true) /* Verify that the element Loan Duplicate Toggle displays Light */ {
        await bidRequestConfigPage.Loan_Duplicate_Toggle.click();
      }
      await page.waitForLoadState('networkidle');
      await expect(bidRequestConfigPage.Loan_Duplicate_Toggle).toHaveCSS('border', vars["BrightBlueColor"]);
      if (true) /* Element Save Changes Button is enabled */ {
        await bidRequestConfigPage.Save_Changes_Button.click();
      }
    }
  });
});
