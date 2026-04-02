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
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';
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
    log.info('Test started: Verify submit for pricing button is disabled and Queued Time text is Red for passed time');

    const credentials = ENV.getCredentials('internal');
    vars["Username"] = credentials.username;
    vars["Password"] = credentials.password;
    log.info('Fetched credentials for internal user');

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    log.info('Logged into Correspondent Portal');

    await expect(correspondentPortalPage.Bid_Requestsside_bar_menu).toBeVisible();
    log.info('Bid Requests sidebar menu is visible');

    vars["count"] = "1";
    vars["TotalStatusCount"] = "4";
    log.info(`Starting status loop. Total statuses to verify: ${vars["TotalStatusCount"]}`);

    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalStatusCount"]))) {
      log.info(`Loop iteration: ${vars["count"]} of ${vars["TotalStatusCount"]}`);

      await correspondentPortalPage.Bid_Requestsside_bar_menu.click();
      log.info('Clicked Bid Requests sidebar menu');

      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.info('Spinner hidden - page loaded');

      await expect(page.getByText("Bid Requests").first()).toBeVisible();
      log.info('Bid Requests page title is visible');

      if (await clearButtonPage.Clear_Button.isVisible()) {
        await clearButtonPage.Clear_Button.click();
        log.info('Clear button was visible - clicked to reset filters');
      } else {
        log.info('Clear button not visible - no existing filters to clear');
      }

      await priceOfferedPage.Filter_Dropdown1.click();
      log.info('Clicked Filter Dropdown 1');

      await bidRequestPage.Select_Bid_Request_Status_Dropdown.click();
      log.info('Clicked Select Bid Request Status Dropdown');

      if (String(vars["count"]) === String("1")) {
        vars["StatusToBeSet"] = "Processing Failed";
      } else if (String(vars["count"]) === String("2")) {
        vars["StatusToBeSet"] = "Cancelled";
      } else if (String(vars["count"]) === String("3")) {
        vars["StatusToBeSet"] = "Committed";
      } else {
        vars["StatusToBeSet"] = "Deleted";
      }
      log.info(`Status to be set for iteration ${vars["count"]}: ${vars["StatusToBeSet"]}`);

      await expect(correspondentPortalPage.Dropdown_Search_In_Commitments_Status).toBeVisible();
      log.info('Commitments Status search dropdown is visible');

      await correspondentPortalPage.Dropdown_Search_In_Commitments_Status.pressSequentially(vars["StatusToBeSet"]);
      log.info(`Typed status "${vars["StatusToBeSet"]}" into the search dropdown`);

      // await page.getByText(vars["StatusToBeSet"]).first().waitFor({ state: 'visible' });
      // log.info(`Status option "${vars["StatusToBeSet"]}" appeared in dropdown`);
      await expect(bidRequestPage.StatusCheck(vars["StatusToBeSet"])).toBeVisible();

      await expect(bidRequestPage.StatusCheck(vars["StatusToBeSet"])).toBeEnabled();
      log.info(`Status checkbox for "${vars["StatusToBeSet"]}" is enabled`);

      await bidRequestPage.StatusCheck(vars["StatusToBeSet"]).check();
      log.info(`Checked status checkbox for "${vars["StatusToBeSet"]}"`);

      await expect(bidRequestPage.StatusCheck(vars["StatusToBeSet"])).toBeVisible();
      log.info(`Status checkbox for "${vars["StatusToBeSet"]}" is visible after check`);

      await correspondentPortalPage.Apply_Selected.nth(1).click();
      log.info('Clicked Apply Selected');

      await applyFiltersButtonPage.Apply_Filters_Button.click();
      log.info('Clicked Apply Filters button');

      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.info('Spinner hidden - filters applied');

      if (await bidRequestPage.Select_Date_Range_Error.isVisible()) {
        log.info('Date Range Error is visible - closing the modal');
        await clearButtonPage.Clear_Button.first().click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Clicked Cross button to dismiss Date Range Error');
      } else {
        log.info('No Date Range Error displayed');
      }

      await correspondentPortalPage.First_Bid_Request_ID.first().click();
      log.info('Clicked on the first Bid Request ID');

      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.info('Spinner hidden - Bid Request details page loaded');

      await expect(bidRequestDetailsPage.Passed_Queued_For_TimeRed_Colour_Text).toBeVisible();
      log.info('Verified: Passed Queued For Time text is visible in Red colour');

      await expect(bidRequestDetailsPage.Submit_For_Pricingdisabled).toBeDisabled();
      log.info(`Verified: Submit For Pricing button is disabled for status "${vars["StatusToBeSet"]}"`);

      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
      log.info(`Incremented count to: ${vars["count"]}`);
    }

    log.info('Test completed: All statuses verified - Submit For Pricing button is disabled and Queued Time text is Red for all applicable statuses');
  });
});