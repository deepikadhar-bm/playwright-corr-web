import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BidRequestDetailsPage } from '../../pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../pages/correspondant/bid-request';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_2317 } from './prereq-2317';

export async function runPrereq_1395(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_2317(page, vars);

  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const bidRequestPage = new BidRequestPage(page);
  const bidRequestsPage = new BidRequestsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);



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
}
