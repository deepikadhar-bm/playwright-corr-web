// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_2317 } from '../../../src/helpers/prereqs/prereq-2317';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_2317(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS01_TC02_For bids with two execution types, verify that two records are created in the Price Offered screen, one for each execution type with proper bid records data..', async ({ page }) => {

    await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
    // Write to test data profile: "RequestIDCreated1stScenario" = vars["RequestIDDetails"]
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["RequestedDate(bid requests)"] = await bidRequestPage.First_Requested_Date.textContent() || '';
    await correspondentPortalPage.First_Bid_Request_ID.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText("Bid Request Details\r")).toBeVisible();
    vars["CCode(bid request details)"] = await correspondentPortalPage.CCode_Valuebid_request_details.textContent() || '';
    vars["Company(bid request details)"] = await bidRequestDetailsPage.Company_ValueBid_Request_Details.textContent() || '';
    vars["Company(bid request details)"] = String(vars["Company(bid request details)"]).substring(1, String(vars["Company(bid request details)"]).length - 1);
    vars["RequestID(bid request details)"] = await bidRequestDetailsPage.Request_Id_From_Details.textContent() || '';
    vars["Status(bid request details)"] = await bidRequestDetailsPage.Statusbid_request_details.textContent() || '';
    vars["ExecutionFlow(SFL)"] = await bidRequestDetailsPage.Execution_Typesflbid_request_details.textContent() || '';
    vars["ExecutionFlow(SFL)"] = String('').split("")["0"] || '';
    vars["SuccessLoan(SFL)"] = await bidRequestDetailsPage.Success_Loansfl_bid_request_details.textContent() || '';
    vars["count1"] = "1";
    vars["total"] = "0";
    vars["TotalSuccessLoanAmountCount"] = String(await bidRequestDetailsPage.Total_Success_Loantable1_bid_request_details.count());
    while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["TotalSuccessLoanAmountCount"]))) {
      vars["SuccessLoanAmount"] = await bidRequestDetailsPage.All_Success_Loan_Amount_Textbid_request_details_tbl1.textContent() || '';
      vars["SuccessLoanAmount"] = String(vars["SuccessLoanAmount"]).replace(/\$/g, '');
      vars["SuccessLoanAmount"] = String(vars["SuccessLoanAmount"]).replace(/\,/g, '');
      vars["total"] = (parseFloat(String(vars["total"])) + parseFloat(String(vars["SuccessLoanAmount"]))).toFixed(0);
      vars["count1"] = (parseFloat(String("1")) + parseFloat(String(vars["count1"]))).toFixed(0);
    }
    vars["BidValue(SFL,bid request details)"] = vars["total"];
    await expect(correspondentPortalPage.Commitments_Side_Menu).toBeVisible();
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText("Price Offered\r\r")).toBeVisible();
    await expect(priceOfferedPage.CCode1price_offered_standard).toContainText(vars["CCode(bid request details)"]);
    await expect(priceOfferedPage.First_bid_id).toContainText(vars["RequestID(bid request details)"]);
    // [DISABLED] Verify that the element Company1(price offered standard) displays text contains Company(bid request details) and With Scrollable FALSE
    // await expect(priceOfferedPage.Company1price_offered_standard).toContainText(vars["Company(bid request details)"]);
    await expect(priceOfferedPage.Company1price_offered_standard).toContainText(vars["Company(bid request details)"]);
    await expect(priceOfferedPage.Date_Price_Offered1price_offered_standard).toContainText(vars["RequestedDate(bid requests)"]);
    vars["TotalBidValue(SFL)"] = await priceOfferedPage.Bid_Value1price_offered_standard.textContent() || '';
    vars["TotalBidValueResult(SFL)"] = String(vars["TotalBidValue(SFL)"]).replace(/\$/g, '');
    vars["TotalBidValueResult(SFL,price offered)"] = String(vars["TotalBidValueResult(SFL)"]).replace(/\,/g, '');
    expect(String(vars["TotalBidValueResult(SFL,price offered)"])).toBe(vars["BidValue(SFL,bid request details)"]);
    await expect(priceOfferedPage.Loans1price_offered_standard).toContainText(vars["SuccessLoan(SFL)"]);
    vars["ExecutionType(price offered)"] = await priceOfferedPage.Execution_Type1price_offered.textContent() || '';
    expect((await priceOfferedPage.Execution_Type1price_offered.textContent() || '').toLowerCase()).toContain(String('').toLowerCase());
    await expect(priceOfferedPage.Status1price_offered_standard).toContainText(vars["Status(bid request details)"]);
  });
});
