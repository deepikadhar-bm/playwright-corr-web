// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { ClearButtonPage } from '../../../src/pages/correspondant/clear-button';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let clearButtonPage: ClearButtonPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    clearButtonPage = new ClearButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS24_TC02_01_Verify that submit for pricing button should be disabled for the status and the Queued Time text Should be Red In colour for passed time.', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await expect(correspondentPortalPage.Bid_Requestsside_bar_menu).toBeVisible();
    vars["count"] = "1";
    vars["TotalStatusCount"] = "4";
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
        vars["StatusToBeSet"] = "Cancelled";
      } else if (String(vars["count"]) === String("3")) {
        vars["StatusToBeSet"] = "Committed";
      } else {
        vars["StatusToBeSet"] = "Deleted";
      }
      await expect(correspondentPortalPage.Dropdown_Search_In_Commitments_Status).toBeVisible();
      await correspondentPortalPage.Dropdown_Search_In_Commitments_Status.fill(vars["StatusToBeSet"]);
      await page.getByText(vars["StatusToBeSet"]).waitFor({ state: 'visible' });
      await expect(bidRequestPage.StatusCheck).toBeEnabled();
      await bidRequestPage.StatusCheck.check();
      await expect(bidRequestPage.StatusCheck).toBeVisible();
      await correspondentPortalPage.Apply_Selected.click();
      await applyFiltersButtonPage.Apply_Filters_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      if (true) /* Element Select_Date_Range_Error is visible */ {
        await correspondentPortalPage.Cross_button_in_Bid_Map.click();
      }
      await correspondentPortalPage.First_Bid_Request_ID.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(bidRequestDetailsPage.Passed_Queued_For_TimeRed_Colour_Text).toBeVisible();
      await expect(bidRequestDetailsPage.Submit_For_Pricingdisabled).toBeDisabled();
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
  });
});
