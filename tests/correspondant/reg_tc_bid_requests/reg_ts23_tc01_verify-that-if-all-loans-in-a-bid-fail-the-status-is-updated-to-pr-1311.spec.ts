// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestListPage } from '../../../src/pages/correspondant/bid-request-list';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestListPage: BidRequestListPage;
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestListPage = new BidRequestListPage(page);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS23_TC01_Verify that if all loans in a bid fail, the status is updated to \\\"Processing Failed,\\\" and the bid cannot be submitted for pricing.', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
    await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
    await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
    if (true) /* Element Second Enabled Time is visible */ {
      await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
      // [DISABLED] Scroll to the element Enabled Date into view
      // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
      // [DISABLED] Click on Enabled Date
      // await bidRequestPage.Enabled_Time.click();
    } else {
      await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
      await stepGroups.stepGroup_Modifying_batches_with_5_min_prior(page, vars);
      await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
      await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
      await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
      // [DISABLED] Scroll to the element Enabled Time into view
      // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
      // [DISABLED] Click on Enabled Date
      // await bidRequestPage.Enabled_Time.click();
    }
    await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, 'test-data', "Bid_file_success_error_loans_popup_updated.xlsx"));
    await expect(correspondentPortalPage.UploadBid_Button).toBeVisible();
    await correspondentPortalPage.UploadBid_Button.click();
    await bidRequestDetailsPage.Bid_Upload_Progress_Header.waitFor({ state: 'visible' });
    await expect(bidRequestDetailsPage.Bid_Upload_Progress_Header).toBeVisible();
    await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
    await expect(bidRequestPage.Continue_ButtonUpload_Pop_up).toBeVisible();
    await expect(bidRequestPage.Rows_above_Loan_Field_validation).toContainText("Success");
    await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
    vars["RequestIDDetails"] = await bidRequestDetailsPage.Request_Id_From_Details.textContent() || '';
    vars["RequestIDDetails"] = String(vars["RequestIDDetails"]).trim();
    vars["BidStatusFromDetails"] = await bidRequestDetailsPage.Statusbid_request_details.textContent() || '';
    await expect(bidRequestDetailsPage.Statusbid_request_details).toContainText("Processing Failed");
    await expect(bidRequestDetailsPage.Loan_Status_ColumnCommon).toContainText("Error");
    vars["TotalLoansDetails"] = await bidRequestDetailsPage.Total_Loans_From_Details.textContent() || '';
    vars["ErroredLoansDetails"] = await bidRequestDetailsPage.Errored_Loans_From_Details.textContent() || '';
    expect(String(vars["ErroredLoansDetails"])).toBe(vars["TotalLoansDetails"]);
    vars["LoansErrors(Bid request details)"] = String(vars["TotalLoansDetails"]) + "/" + String(vars["ErroredLoansDetails"]);
    vars["LoansErrors(Bid request details)"] = String(vars["LoansErrors(Bid request details)"]).trim();
    await expect(bidRequestDetailsPage.Submit_For_Pricingdisabled).toBeDisabled();
    await correspondentPortalPage.Bid_Requestsside_bar_menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(bidRequestListPage.Request_Id_From_list).toContainText(vars["RequestIDDetails"]);
    await expect(bidRequestListPage.BidStatus_From_List).toContainText("Processing Failed");
    vars["LoansErrors(bid requests list)"] = await bidRequestsPage.Loans_Errors_From_Bid_Requests_List.textContent() || '';
    vars["LoansErrors(bid requests list)"] = String(vars["LoansErrors(bid requests list)"]).trim();
    expect(String(vars["LoansErrors(Bid request details)"])).toBe(vars["LoansErrors(bid requests list)"]);
  });
});
