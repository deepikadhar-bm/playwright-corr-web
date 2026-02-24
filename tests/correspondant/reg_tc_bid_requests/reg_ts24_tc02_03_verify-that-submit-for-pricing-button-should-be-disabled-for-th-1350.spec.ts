// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CancelButtonPage } from '../../../src/pages/correspondant/cancel-button';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1261 } from '../../../src/helpers/prereqs/prereq-1261';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let cancelButtonPage: CancelButtonPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let okButtonPage: OkButtonPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1261(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    cancelButtonPage = new CancelButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    okButtonPage = new OkButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS24_TC02_03_Verify that submit for pricing button should be disabled for the status and the Queued Time text Should be Red In colour for passed time.', async ({ page }) => {

    vars["BidRequestID1"] = await bidRequestDetailsPage.Bid_Request_Details_Text.textContent() || '';
    await bidRequestDetailsPage.Submit_for_PricingEnabled.click();
    await expect(page.getByText("Submit for Pricing\r")).toBeVisible();
    await bidRequestDetailsPage.Yes_Submit_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    if (await okButtonPage.Ok_Button.isVisible()) {
      await okButtonPage.Ok_Button.click();
    }
    if (await cancelButtonPage.Cancel_Button.isVisible()) {
      await cancelButtonPage.Cancel_Button.click();
    }
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["TrimmedBidRequestID1"] = String(vars["BidRequestID1"]).trim();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["TrimmedBidRequestID1"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.First_Bid_Request_ID.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["Status"] = await bidRequestDetailsPage.Statusbid_request_details.inputValue() || '';
    if (true) /* Element Queued For(bid request details text dark) has attrib */ {
      vars["ExtractedQueuedForTime"] = await bidRequestDetailsPage.Queued_Forbid_request_details_text_dark.textContent() || '';
      vars["ExtractedQueuedForTime(only time)"] = String('').split("")["3"] || '';
      vars["ExtractedQueuedForTime(extracted hour minutes)"] = vars["ExtractedQueuedForTime(only time)"];
      vars["ExtractedQueuedForTime(only am pm)"] = String('').split("")["4"] || '';
      vars["ExtractedQueuedForTime(extracted am pm)"] = vars["ExtractedQueuedForTime(only am pm)"];
      vars[""] = String(vars["ExtractedQueuedForTime(extracted hour minutes)"]) + ' ' + String(vars["ExtractedQueuedForTime(extracted am pm)"]);
      await expect(bidRequestDetailsPage.Submit_For_Pricingdisabled).toBeDisabled();
    }
    await correspondentPortalPage.Bid_Requestsside_bar_menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["TrimmedBidRequestID1"]);
    vars[""] = String(vars["ExtractedQueuedForTime( time with am pm)"]) + ' ' + String("ET");
    vars["ExtractedQueuedForTime( time with am pm ET)"] = String('') + String('');
    vars["FinalExpectedStatus(bid requests)"] = String(vars["FinalExpectedStatus(bid requests)"]).trim();
    vars["FinalActualStatus(bid requests)"] = await bidRequestPage.First_Status_In_Column.textContent() || '';
    vars["FinalActualStatus(bid requests)"] = String(vars["FinalActualStatus(bid requests)"]).trim();
    expect(String(vars["FinalActualStatus(bid requests)"]).toLowerCase()).toContain(String(vars["FinalExpectedStatus(bid requests)"]).toLowerCase());
  });
});
