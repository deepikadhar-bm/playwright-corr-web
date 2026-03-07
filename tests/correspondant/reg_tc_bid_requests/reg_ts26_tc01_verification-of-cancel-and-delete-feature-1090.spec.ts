// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { testDataManager } from 'testdata/TestDataManager';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';


test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS26_TC01_Verification Of Cancel and Delete Feature', async ({ page }) => {

    const profileName = 'Bid Requests'; // TDP sheet name
    const profile = testDataManager.getProfileByName(profileName);
    if (profile && profile.data) {
      const reasonForCancellation = profile.data[0]['Reason For Cancellation'];
      const reasonForDeletion = profile.data[0]['Reason For Deletion'];
    }
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    //await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
    // [DISABLED] Uploading Bid Request
    // await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
    // [DISABLED] Uploading Bid Request(New)
    // await stepGroups.stepGroup_Uploading_Bid_RequestNew(page, vars);
    const CorrPortalElem = new CorrPortalPage(page);
      await CorrPortalElem.BidRequests_Menu.click();
      await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Uploading_New_Bid_Request_Bid_Request_Screen(page, vars);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
    await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
    await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestDetailsPage.Submit_for_PricingEnabled.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestDetailsPage.Yes_Submit_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    //await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
      await CorrPortalElem.BidRequests_Menu.click();
      await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
      //await expect(page.getByText("Bid Requests").first()).toBeVisible();
      //await CorrPortalElem.Upload_New_Bid_Request_Button.click();
      //await CorrPortalElem.Spinner.first().waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Uploading_New_Bid_Request_Bid_Request_Screen(page, vars);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
    await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
    await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestDetailsPage.Submit_for_PricingEnabled.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestDetailsPage.Yes_Submit_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortalPage.Bid_Requests).toBeVisible();
    await correspondentPortalPage.Bid_Requests.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Filter_Dropdown1.click();
    await bidRequestPage.Select_Bid_Request_Status_Dropdown.click();
    await bidRequestsPage.Queued_for_Next_Batchbid_requests.check();
    await expect(bidRequestsPage.Queued_for_Next_Batchbid_requests).toBeVisible();
    await correspondentPortalPage.Apply_Selected.click();
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(bidRequestPage.First_Status_In_Column).toContainText("Queued");
    vars["CanceledBidRequestID"] = await correspondentPortalPage.First_Bid_Request_ID.textContent() || '';
    await correspondentPortalPage.Cancel_Bid_Request_Button.click();
    await expect(correspondentPortalPage.Cancel_Bid_Request_PopUp).toBeVisible();
    await expect(correspondentPortalPage.Yes_Go_ahead_Button_Bid_Request_List).toBeVisible();
    await correspondentPortalPage.Reason_for_cancelling_bid_request_Input.fill(vars[""]);
    await correspondentPortalPage.Yes_Go_ahead_Button_Bid_Request_List.click();
    await page.waitForTimeout(4000);
    vars["FirstBidRequestIDAfterCancel"] = await correspondentPortalPage.First_Bid_Request_ID.textContent() || '';
    expect(String(vars["CanceledBidRequestID"])).toBe(vars["FirstBidRequestIDAfterCancel"]);
    vars["DeletedBidRequestId"] = await correspondentPortalPage.First_Bid_Request_ID.textContent() || '';
    await bidRequestPage.Delete_Bid_Request_Button.click();
    await expect(correspondentPortalPage.Yes_Go_ahead_Buttondelete).toBeVisible();
    await correspondentPortalPage.Reason_for_deleting_bid_request_Input.fill(vars["reasonForDeletion"]);
    await expect(correspondentPortalPage.Yes_Go_ahead_Buttondelete).toBeVisible();
    await correspondentPortalPage.Yes_Go_ahead_Buttondelete.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["FirstBidRequestIdAfterDelete"] = await correspondentPortalPage.First_Bid_Request_ID.textContent() || '';
    expect(String(vars["DeletedBidRequestId"])).toBe(vars["FirstBidRequestIdAfterDelete"]);
    await correspondentPortalPage.Clear_All_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["CanceledBidRequestID"] = String(vars["CanceledBidRequestID"]).trim();
    vars["DeletedBidRequestId"] = String(vars["DeletedBidRequestId"]).trim();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["CanceledBidRequestID"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortalPage.First_Bid_Request_ID).toContainText(vars["CanceledBidRequestID"]);
    await expect(bidRequestPage.First_Status_In_Column).toContainText("Cancelled");
    await bidRequestPage.First_Status_In_Column.hover();
    await expect(page.getByText(vars["reasonForCancellation"])).toBeVisible();
    await expect(correspondentPortalPage.Cancel_Bid_Request_Button).toBeVisible();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.clear();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["DeletedBidRequestId"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortalPage.First_Bid_Request_ID).toContainText(vars["DeletedBidRequestId"]);
    await expect(bidRequestPage.First_Status_In_Column).toContainText("Deleted by testsigma_internal");
    await bidRequestPage.First_Bid_Value.hover();
    await bidRequestPage.First_Status_In_Column.hover();
    await expect(page.getByText(vars["reasonForDeletion"])).toBeVisible();
    await expect(bidRequestPage.Delete_Bid_Request_Button).toBeVisible();
  });
});
