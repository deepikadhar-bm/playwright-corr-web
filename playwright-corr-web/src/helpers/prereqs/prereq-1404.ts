import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BidRequestDetailsPage } from '../../pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../pages/correspondant/bid-request';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1389 } from './prereq-1389';

export async function runPrereq_1404(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1389(page, vars);

  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const bidRequestPage = new BidRequestPage(page);
  const bidRequestsPage = new BidRequestsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);



  await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
  // Write to test data profile: "RequestIDCreated2ndScenario" = vars["RequestIDDetails"]
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  vars["RequestedDate(bid requests)"] = await bidRequestPage.First_Requested_Date.textContent() || '';
  await correspondentPortalPage.First_Bid_Request_ID.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await expect(page.getByText("Bid Request Details\r")).toBeVisible();
  vars["CCode(bid request details)"] = await correspondentPortalPage.CCode_Valuebid_request_details.textContent() || '';
  vars["Company(bid request details)"] = await bidRequestDetailsPage.Company_ValueBid_Request_Details.textContent() || '';
  vars["Company(bid request details"] = String(vars["Company(bid request details)"]).substring(1, String(vars["Company(bid request details)"]).length - 1);
  vars["RequestID(bid request details)"] = await bidRequestDetailsPage.Request_Id_From_Details.textContent() || '';
  vars["Status(bid request details)"] = await bidRequestDetailsPage.Statusbid_request_details.textContent() || '';
  vars["count"] = "1";
  vars["TotalRows"] = String(await bidRequestDetailsPage.Common_Execution_Type_Rowsbid_requests_details.count());
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalRows"]))) {
    vars["ExecutionType"] = await bidRequestDetailsPage.ExecutionTypebid_requests_details_counter.textContent() || '';
    if (String(vars["ExecutionType"]).includes(String("Chase"))) {
      vars["SuccessLoan(CD)"] = await bidRequestDetailsPage.Heading_Successful_Loans_4.textContent() || '';
      vars["count1"] = "1";
      vars["total"] = "0";
      vars["TotalSuccessLoanAmountCount"] = String(await bidRequestDetailsPage.Success_Loan_Amountbid_request_details_table2.count());
      while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["TotalSuccessLoanAmountCount"]))) {
        vars["SuccessLoanAmount"] = await bidRequestDetailsPage.All_Success_Loan_Amount_Textbid_request_details_tbl1.textContent() || '';
        vars["SuccessLoanAmount"] = String(vars["SuccessLoanAmount"]).replace(/\$/g, '');
        vars["SuccessLoanAmount"] = String(vars["SuccessLoanAmount"]).replace(/\,/g, '');
        vars["total"] = (parseFloat(String(vars["total"])) + parseFloat(String(vars["SuccessLoanAmount"]))).toFixed(0);
        vars["count1"] = (parseFloat(String("1")) + parseFloat(String(vars["count1"]))).toFixed(0);
      }
      vars["TotalSumOfSuccessLoanAmount(chase bid request details)"] = vars["total"];
    } else if (String(vars["ExecutionType"]).includes(String("Standard"))) {
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
      vars["TotalSumOfSuccessLoanAmount(standard bid requests details)"] = vars["total"];
    }
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
  await correspondentPortalPage.Commitments_Side_Menu.click();
  await correspondentPortalPage.Price_Offered_List_Dropdown.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  vars["count"] = "1";
  vars["AllRowsCount"] = String(await priceOfferedPage.All_Bid_Request_ID_Rowsprice_offered_screen1.count());
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["AllRowsCount"]))) {
    vars["ExecutionType1(price offered screen)"] = await priceOfferedPage.All_Execution_Typeprice_offered_screen1.textContent() || '';
    if (String(vars["ExecutionType1(price offered screen)"]).includes(String("CHASE"))) {
      await expect(priceOfferedPage.CCode1price_offered).toContainText(vars["CCode(bid request details)"]);
      await expect(priceOfferedPage.All_Bid_Request_ID2price_offered_screen1).toContainText(vars["RequestID(bid request details)"]);
      await expect(priceOfferedPage.Company1price_offered).toContainText(vars["Company(bid request details)"]);
      // [DISABLED] Verify that the element Company1(price offered) displays text Company(bid request details) and With Scrollable FALSE
      // await expect(priceOfferedPage.Company1price_offered).toContainText(vars["Company(bid request details)"]);
      await expect(priceOfferedPage.Date_Price_Offered1price_offered).toContainText(vars["RequestedDate(bid requests)"]);
      vars["TotalLoanAmountChase"] = await priceOfferedPage.Bid_Value1price_offered.textContent() || '';
      vars["TotalLoanAmountChasePriceOffered"] = String(vars["TotalLoanAmountChase"]).replace(/\$/g, '');
      vars["TotalLoanAmountChasePriceOffered"] = String(vars["TotalLoanAmountChasePriceOffered"]).replace(/\,/g, '');
      expect(String(vars["TotalLoanAmountChasePriceOffered"])).toBe(vars["TotalSumOfSuccessLoanAmount(chase bid request details)"]);
      await expect(priceOfferedPage.Loansprice_offered).toContainText(vars["SuccessLoan(CD)"]);
      await expect(priceOfferedPage.Status1price_offered).toContainText(vars["Status(bid request details)"]);
    } else if (String(vars["ExecutionType1(price offered screen)"]).includes(String("STANDARD"))) {
      await expect(priceOfferedPage.CCode1price_offered).toContainText(vars["CCode(bid request details)"]);
      await expect(priceOfferedPage.All_Bid_Request_ID2price_offered_screen1).toContainText(vars["RequestID(bid request details)"]);
      await expect(priceOfferedPage.Company1price_offered).toContainText(vars["Company(bid request details)"]);
      await expect(priceOfferedPage.Date_Price_Offered1price_offered).toContainText(vars["RequestedDate(bid requests)"]);
      vars["TotalLoanAmountStandard"] = await priceOfferedPage.Bid_Value1price_offered.textContent() || '';
      vars["TotalLoanAmountStandardPriceOffered"] = String(vars["TotalLoanAmountStandard"]).replace(/\$/g, '');
      vars["TotalLoanAmountStandardPriceOffered"] = String(vars["TotalLoanAmountStandardPriceOffered"]).replace(/\,/g, '');
      expect(String(vars["TotalLoanAmountStandardPriceOffered"])).toBe(vars["TotalSumOfSuccessLoanAmount(standard bid requests details)"]);
      await expect(priceOfferedPage.Loansprice_offered).toContainText(vars["SuccessLoan(SFL)"]);
      await expect(priceOfferedPage.Status1price_offered).toContainText(vars["Status(bid request details)"]);
    }
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
}
