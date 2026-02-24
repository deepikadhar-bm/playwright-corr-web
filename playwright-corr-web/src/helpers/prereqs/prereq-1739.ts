import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidRequestDetailsPage } from '../../pages/correspondant/bid-request-details';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CommitmentDetailsPage } from '../../pages/correspondant/commitment-details';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';

export async function runPrereq_1739(page: Page, vars: Record<string, string>): Promise<void> {
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const bidRequestsPage = new BidRequestsPage(page);
  const commitmentDetailsPage = new CommitmentDetailsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);


  const testData: Record<string, string> = {
  "RequestIDFromPRE_PR_1-1": "87YTD25F4356",
  "Requestidfrom4-2": "873O84593BB5",
  "RequestIdfrom6-1.1": "57HK54C5AE2A",
  "RequestIDfrom14-1": "876U855F6483",
  "CommitmentIdfrom8-8": "87JU2DDD",
  "RequestIdFrom5-1": "876YA587E147",
  "RequestIdFrom5-5": "87CKA7D37EB6",
  "RequestIdFrom6-4": "87MWF9C278BC",
  "CommitmentIDfrom8-10": "87JU2DDD",
  "RequestIdFrom8-8": "87BI08DD054F"
}; // Profile: "Commitment List", row: 0

  await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
  await correspondentPortalPage.Commitments_Side_Menu.click();
  await correspondentPortalPage.Price_Offered_List_Dropdown.click();
  vars["BidReqId"] = testData["RequestIDFromPRE_PR_1-1"];
  // [DISABLED] Store RequestIDFromPRE_PR_1-1 in BidReqIdPriceOffered
  // vars["BidReqIdPriceOffered"] = testData["RequestIDFromPRE_PR_1-1"];
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqId"]);
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await priceOfferedPage.BidRequestIDPrice_Offered_New.click();
  await priceOfferedPage.All_Loans_Tabprice_offered_screen.waitFor({ state: 'visible' });
  await bidRequestDetailsPage.Last_Name_Sort_Button.click();
  await priceOfferedPage.Last_Name_Down_ArrowDetails.waitFor({ state: 'visible' });
  vars["TotalLoans"] = String(await priceOfferedPage.Total_LoansDetails_Screen.count());
  vars["count"] = "1";
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalLoans"]))) {
    await commitmentDetailsPage.Bid_ReqID_TextPrice_Offered_Details.click();
    vars["CorrLoanNumAllLoans"] = await priceOfferedPage.Corr_Loan_NumDetails_Screen.textContent() || '';
    vars["LastNameAllLoans"] = await priceOfferedPage.Last_NameDetails_Screen.textContent() || '';
    vars["LoanAmountAllLoans"] = await priceOfferedPage.Loan_AmountDetails_Screen.textContent() || '';
    vars["InterestRateAllLoans"] = await priceOfferedPage.Interest_rateDetails_Screen.textContent() || '';
    vars["ReferenceSecurityAllLoans"] = await priceOfferedPage.Reference_SecurityDetails_Screen.textContent() || '';
    vars["ReferenceSecurityPriceAllLoans"] = await priceOfferedPage.Reference_security_priceDetails_Screen.textContent() || '';
    vars["GrossPriceAllLoans"] = await priceOfferedPage.Gross_PriceDetails_Screen.textContent() || '';
    vars["HedgeRatioAllLoans"] = await priceOfferedPage.Hedge_RatioDetails_Screen.textContent() || '';
    vars["MarketAdjustmentAllLoans"] = await priceOfferedPage.Market_AdjustmentDetails_Screen.textContent() || '';
    vars["CurrentGrossPriceAllLoans"] = await priceOfferedPage.Current_Gross_PriceDetails_Screen.textContent() || '';
    for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseInt(vars["count"]); dataIdx++) {
      // Write to test data profile: "Corr Loan Num" = vars["CorrLoanNumAllLoans"]
      // Write to test data profile: "Last Name" = vars["LastNameAllLoans"]
      // Write to test data profile: "Loan Amount" = vars["LoanAmountAllLoans"]
      // Write to test data profile: "Interest Rate" = vars["InterestRateAllLoans"]
      // Write to test data profile: "Ref Sec Prod" = vars["ReferenceSecurityAllLoans"]
      // Write to test data profile: "Ref Sec Price" = vars["ReferenceSecurityPriceAllLoans"]
      // Write to test data profile: "Gross Price" = vars["GrossPriceAllLoans"]
      // Write to test data profile: "Hedge Ratio" = vars["HedgeRatioAllLoans"]
      // Write to test data profile: "Mark Adj" = vars["MarketAdjustmentAllLoans"]
      // Write to test data profile: "Current Gross Price" = vars["CurrentGrossPriceAllLoans"]
      if (true) /* Element Committed Loan Lock icon(Detail Screen) is visible */ {
        vars["CommitmentOderAllLoans"] = await priceOfferedPage.Commitment_OrderDetails_Screen.textContent() || '';
        // Write to test data profile: "Locked Loan" = "Yes"
        // Write to test data profile: "Commitment Order" = vars["CommitmentOderAllLoans"]
      } else {
        // Write to test data profile: "Locked Loan" = "None"
        // Write to test data profile: "Commitment Order" = "None"
      }
      vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
    }
  }
}
