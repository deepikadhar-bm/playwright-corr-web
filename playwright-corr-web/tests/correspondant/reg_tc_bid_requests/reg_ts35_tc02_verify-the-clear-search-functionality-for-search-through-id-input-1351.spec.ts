// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1330 } from '../../../src/helpers/prereqs/prereq-1330';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1330(page, vars);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS35_TC02_Verify the clear search functionality for Search Through Id Input', async ({ page }) => {

    await expect(bidRequestsPage.Navigate_To_Page).toBeVisible();
    if (true) /* Verify that the element Navigate To Page displays text conta */ {
      await expect(bidRequestPage.Navigate_to_Previous).toBeEnabled();
      await bidRequestPage.Navigate_to_Previous.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(bidRequestsPage.Navigate_To_Page).toContainText("Page 1");
    }
    vars["IDSearchedFor"] = await bidRequestsPage.Search_by_Bid_Request_ID_Field.inputValue() || '';
    await expect(bidRequestsPage.Cross_Button_in_Search_Field).toBeEnabled();
    await bidRequestsPage.Cross_Button_in_Search_Field.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    if (true) /* Element Bid ID Contains SearchedID is visible */ {
      vars["BidIDWithSearchIDCount"] = String(await bidRequestsPage.Bid_ID_Contains_SearchedID.count());
      expect(String(vars["BidIDWithSearchIDCount"])).toBe("20");
    } else {
      await expect(bidRequestsPage.Bid_ID_Contains_SearchedID).toBeVisible();
    }
  });
});
