// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidRequestListPage } from '../../../src/pages/correspondant/bid-request-list';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { ClearButtonPage } from '../../../src/pages/correspondant/clear-button';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let bidRequestListPage: BidRequestListPage;
  let bidRequestPage: BidRequestPage;
  let clearButtonPage: ClearButtonPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    bidRequestListPage = new BidRequestListPage(page);
    bidRequestPage = new BidRequestPage(page);
    clearButtonPage = new ClearButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS30_TC02_Verifying the Cancel Button is disabled for the statuses by filtering', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await expect(correspondentPortalPage.Bid_Requestsside_bar_menu).toBeVisible();
    vars["count"] = "1";
    vars["TotalStatusCount"] = "4";
    vars["DisabledOptions"] = "Processing Failed, Pricing in Progress, Price Offered, Partially Committed, Commitment in Progress, Cancelled, Expired";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalStatusCount"]))) {
      await correspondentPortalPage.Bid_Requestsside_bar_menu.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(page.getByText("Bid Requests\r\r")).toBeVisible();
      if (await clearButtonPage.Clear_Button.isVisible()) {
        await clearButtonPage.Clear_Button.click();
      }
      await priceOfferedPage.Filter_Dropdown1.click();
      await bidRequestPage.Select_Bid_Request_Status_Dropdown.click();
      if (String(vars["count"]) === String("1")) {
        vars["StatusToBeSet"] = "Processing Failed";
      } else if (String(vars["count"]) === String("2")) {
        vars["StatusToBeSet"] = "Price Offered";
      } else if (String(vars["count"]) === String("3")) {
        vars["StatusToBeSet"] = "Expired";
      } else {
        vars["StatusToBeSet"] = "Cancelled";
      }
      await bidRequestPage.All_Status_From_Dropdown.evaluate(el => { (el as HTMLElement).scrollTop = (el as HTMLElement).scrollHeight; });
      await bidRequestPage.StatusCheck.check();
      await expect(bidRequestPage.StatusCheck).toBeVisible();
      await correspondentPortalPage.Apply_Selected.click();
      await applyFiltersButtonPage.Apply_Filters_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(bidRequestListPage.First_Cancel_Button).toBeVisible();
      expect(String(vars["DisabledOptions"])).toBe(vars["StatusToBeSet"]);
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
  });
});
