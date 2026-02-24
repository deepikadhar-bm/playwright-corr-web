// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { AdvanceSearchPage } from '../../../src/pages/correspondant/advance-search';
import { ItagPage } from '../../../src/pages/correspondant/itag';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let advanceSearchPage: AdvanceSearchPage;
  let itagPage: ItagPage;
  let statusInactive2Page: StatusInactive2Page;

  test.beforeEach(async ({ page }) => {
    vars = {};
    advanceSearchPage = new AdvanceSearchPage(page);
    itagPage = new ItagPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
  });

  test('1045_df8297c4d7c64cb9873b10ea84310984_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      if (true) /* Element Close Advance Search Pop up Button is visible */ {
        await advanceSearchPage.Close_Advance_Search_Pop_up_Button.click();
        await page.reload();
        await stepGroups.stepGroup_Deleting_All_Advanced_Search_Bid_Maps(page, vars);
      }
      if (true) /* Element Reset Button is visible */ {
        await itagPage.Reset_Button.click();
        await statusInactive2Page.SearchFilter_Fields.waitFor({ state: 'visible' });
        await stepGroups.stepGroup_Deleting_All_Advanced_Search_Bid_Maps(page, vars);
      }
      if (true) /* Element Search/Filter Input(All Map List Page) is visible */ {
        await stepGroups.stepGroup_Deleting_All_Advanced_Search_Bid_Maps(page, vars);
      }
    }
  });
});
