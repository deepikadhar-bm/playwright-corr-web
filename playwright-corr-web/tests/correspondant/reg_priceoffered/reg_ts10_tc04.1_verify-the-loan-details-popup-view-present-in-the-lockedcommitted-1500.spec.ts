// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedDetailsPage } from '../../../src/pages/correspondant/price-offered-details';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedDetailsPage: PriceOfferedDetailsPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedDetailsPage = new PriceOfferedDetailsPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS10_TC04.1_Verify the loan details popup view present in the \\\"Locked/Committed\\\" loans - Should be same as present in all loans. Also verify the search / clear search actions', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["BidRequestID"] = await priceOfferedPage.BidReqIDPartially_Committed_or_Committed.textContent() || '';
    vars["BidRequestID"] = String(vars["BidRequestID"]).trim();
    await priceOfferedPage.BidRequesIdPartially_or_Committed.click();
    await priceOfferedDetailsPage.Locked_Loan_Num_Price_Offered_details.waitFor({ state: 'visible' });
    vars["CommittedLoanNum"] = await priceOfferedDetailsPage.Locked_Loan_Num_Price_Offered_details.textContent() || '';
    await priceOfferedDetailsPage.Locked_Loan_Num_Price_Offered_details.click();
    vars["BidRequestIdAllLoans"] = await priceOfferedPage.BidReqIdLoan_Details_Popup.textContent() || '';
    vars["BidLoanNumAllLoans"] = await priceOfferedPage.Bid_Loan_NumLoan_Details_Popup.textContent() || '';
    vars["ErrorsCheckAllLoans"] = await priceOfferedPage.Errors_CheckLoan_Details_Popup.textContent() || '';
    await stepGroups.stepGroup_Storing_Loan_Popup_Details_From_All_Loans_Tab_in_to_the_tdp_(page, vars);
    await priceOfferedPage.LockedCommitted_Loans_2.click();
    await page.waitForLoadState('networkidle');
    await priceOfferedPage.Bid_Loan_Num_Committed_Loans.click();
    await expect(priceOfferedPage.BidReqIdLoan_Details_Popup).toContainText(vars["BidRequestIdAllLoans"]);
    await expect(priceOfferedPage.Bid_Loan_NumLoan_Details_Popup).toContainText(vars["BidLoanNumAllLoans"]);
    await expect(priceOfferedPage.Errors_CheckLoan_Details_Popup).toContainText(vars["ErrorsCheckAllLoans"]);
    await stepGroups.stepGroup_Verification_of_Loan_Pop_up_Details_From_Locked_Loans_Tab_Pr(page, vars);
  });
});
