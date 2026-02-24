// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestConfigPage } from '../../../src/pages/correspondant/bid-request-config';
import { EarlyConfigPage } from '../../../src/pages/correspondant/early-config';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestConfigPage: BidRequestConfigPage;
  let earlyConfigPage: EarlyConfigPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestConfigPage = new BidRequestConfigPage(page);
    earlyConfigPage = new EarlyConfigPage(page);
  });

  test('2189_a62bd03db4ce418cbf669a6b89685a48_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      await stepGroups.stepGroup_Navigating_To_Bid_Request_Config(page, vars);
      await earlyConfigPage.Real_time_On_Radio_Button.check();
      await earlyConfigPage.Deffered_On_Radio_Button.check();
      await page.waitForLoadState('networkidle');
      if (true) /* Element Save Changes Button is enabled */ {
        await bidRequestConfigPage.Save_Changes_Button.click();
      }
    }
  });
});
