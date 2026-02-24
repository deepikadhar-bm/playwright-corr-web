// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestPage = new BidRequestPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS23_TC01_Verify that if the status is committed and if one of the loan from the list is uncommitted, then the status should be updated as partially committed', async ({ page }) => {
    const testData: Record<string, string> = {
  "RequestIDfrom22-3.1": "877V3BF90360",
  "CompanyNameInFilters": "Fre",
  "RequestIdfor22-2.1": "87BQ7DB5C69B",
  "RequestIDCreated3rdScenario": "87YK9A2E0311",
  "BidMappingID": "Deepika Aug1",
  "RequestIdfor22-2.2": "87TS8C74F49F",
  "RequestIDfrom13-1": "87RS88D43BB6",
  "RequestIDfrom13-2": "578FE9EDEC6C",
  "RequestIDfrom22-1.2": "874KBED58307",
  "RequestIDfrom10-2": "872V960789CD",
  "RequestIDfrom11-1": "87ZB36778D61",
  "EditedChaseUsersTime": "3",
  "RequestIDCreated1stScenario": "87P80EB790BD",
  "RequestIDfrom10-3": "874WDCCDC3CE",
  "Expected Product(price offered)": "FN30",
  "RequestIDfrom22-1.1": "877V3BF90360",
  "RequestIDCreated2ndScenario": "87462B751677",
  "Expected Coupon(price offered)": "3.5",
  "Static Last Name(Pop Up Verfication)": "LN_Deepika_JULY_16_13",
  "RequestIDfrom24-1": "87E42DCFAFE8",
  "Company Name": "Freedom - A4187",
  "RequestIDfrom29-1": "57EFC2170915",
  "RequestIDfrom28-1": "87E15439E568",
  "NO of Batches": "5",
  "RequestIDfrom27-1": "87DEF1EBA5BD",
  "RequestIDFrom28-2": "878S25D7D52F",
  "StatusInFilters": "Price",
  "RequestIDCreated4rthScenario": "87145580866E"
}; // Profile: "Price Offered", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["BidReqIdPriceOffered"] = testData["RequestIDfrom22-3.1"];
    // [DISABLED] Clear the existing text from Search Field in Price Offered Page and enter BidReqIdPriceOffered
    // await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(String(vars["BidReqIdPriceOffered"]));
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqIdPriceOffered"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidRequestIDPrice_Offered.click();
    await priceOfferedPage.LockedCommitted_Loans_Count.waitFor({ state: 'visible' });
    vars["CommittedLoansCountBeforeUnommit"] = await priceOfferedPage.LockedCommitted_Loans_Count.textContent() || '';
    vars["OpenAuthLimit"] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
    vars["OpenAuthLimitBeforeUncommit"] = String('').split("(")["0"] || '';
    vars["AuthLimitBeforeUncommit"] = await priceOfferedPage.Auth_Limit.textContent() || '';
    vars["LastCommittedBidBeforeUncommit"] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
    vars["LastCommittedBidBeforeUncommit"] = String('').split("|")["0"] || '';
    vars["LastCommittedBidBeforeUncommit"] = String(vars["LastCommittedBidBeforeUncommit"]).trim();
    vars["LastCommittedLoanAmountBeforeUncommit"] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
    vars["LastCommittedLoanAmountBeforeUncommit"] = String(vars["LastCommittedLoanAmountBeforeUncommit"]).substring(3);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_In_Committed_Page.click();
    await priceOfferedPage.Search_In_Committed_Page.fill(vars["BidReqIdPriceOffered"]);
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.CommitmentID.waitFor({ state: 'visible' });
    await priceOfferedPage.CommitmentID.click();
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.check();
    vars["UncommittedLoanNum"] = await priceOfferedPage.Checked_Corr_Loan.textContent() || '';
    vars["UncommittedLoanAmount"] = await priceOfferedPage.Checked_Loan_Amount.textContent() || '';
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await priceOfferedPage.Yes_Uncommit_Button.click();
    await page.waitForLoadState('networkidle');
    if (true) /* Element Okay Button is visible */ {
      await correspondentPortalPage.Okay_Button1.waitFor({ state: 'visible' });
      await correspondentPortalPage.Okay_Button1.click();
    }
    // [DISABLED] Perform subtraction on LastCommittedLoanAmountBeforeUncommit and UncommittedLoanAmount and store the result inside a ExpectedLastCommittedLoanAmount considering 0 decimal places
    // vars["ExpectedLastCommittedLoanAmount"] = (parseFloat(String(vars["LastCommittedLoanAmountBeforeUncommit"])) - parseFloat(String(vars["UncommittedLoanAmount"]))).toFixed(0);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await correspondentPortalPage.Commitments_Side_Menu.waitFor({ state: 'visible' });
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.click();
    // [DISABLED] Enter BidReqIdPriceOffered in the Search Field in Price Offered Page field
    // await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqIdPriceOffered"]);
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(String(vars["BidReqIdPriceOffered"]));
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    while (!(await priceOfferedPage.Partially_Committed_Status.isVisible())) {
      await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(String(vars["BidReqIdPriceOffered"]));
      // [DISABLED] Enter BidReqIdPriceOffered in the Search Field in Price Offered Page field
      // await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqIdPriceOffered"]);
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1.waitFor({ state: 'visible' });
      vars["BidStatusPriceOfferedPage"] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1.textContent() || '';
      vars["BidStatusPriceOfferedPage"] = String(vars["BidStatusPriceOfferedPage"]).trim();
      expect(String(vars["BidStatusPriceOfferedPage"])).toBe("Partially Committed");
    }
    await priceOfferedPage.BidRequestIDPrice_Offered.click();
    await priceOfferedPage.Committed_Loan_NumLatest.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Committed_Loan_NumLatest).toBeVisible();
    vars["OpenAuthLimit"] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
    vars["OpenAuthLimitAfterUncommit"] = String('').split("(")["0"] || '';
    vars["OpenAuthLimitAfterUncommit"] = String(vars["OpenAuthLimitAfterUncommit"]).replace(/\$\,/g, '');
    vars["OpenAuthLimitAfterUncommit"] = String(vars["OpenAuthLimitAfterUncommit"]).trim();
    vars["OpenAuthLimitPercentageAfterUncommit"] = String('').split("(")["1"] || '';
    vars["OpenAuthLimitPercentageAfterUncommit"] = String(vars["OpenAuthLimitPercentageAfterUncommit"]).replace(/\)%/g, '');
    vars["AuthLimitAfterUncommit"] = await priceOfferedPage.Auth_Limit.textContent() || '';
    vars["LastCommittedBidAfterUnommit"] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
    vars["LastCommittedBidAfterUnommit"] = String('').split("|")["0"] || '';
    vars["LastCommittedBidAfterUnommit"] = String(vars["LastCommittedBidAfterUnommit"]).trim();
    vars["LastCommittedLoanAmountAfterUncommit"] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
    vars["LastCommittedLoanAmountAfterUncommit"] = String(vars["LastCommittedLoanAmountAfterUncommit"]).substring(3);
    await priceOfferedPage.LockedCommitted_Loans.click();
    await priceOfferedPage.Paste_Loans_ButtonPrice_Offered_Page.waitFor({ state: 'hidden' });
    await expect(priceOfferedPage.Paste_Loans_ButtonPrice_Offered_Page).toBeVisible();
    await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeVisible();
    await expect(priceOfferedPage.Committed_Loan_NumLatest).toBeVisible();
    vars["ExpectedOpenAuthLimit"] = (parseFloat(String(vars["OpenAuthLimitBeforeUncommit"])) + parseFloat(String(vars["UncommittedLoanAmount"]))).toFixed(0);
    vars["ExpectedOpenAuthPercentage"] = (parseFloat(String(vars["ExpectedOpenAuthLimit"])) / parseFloat(String(vars["AuthLimitAfterUncommit"]))).toFixed(4);
    vars["ExpectedOpenAuthPercentage"] = (parseFloat(String(vars["ExpectedOpenAuthPercentage"])) * parseFloat(String("100"))).toFixed(2);
    expect(String(vars["ExpectedOpenAuthLimit"])).toBe(vars["OpenAuthLimitAfterUncommit"]);
    expect(String(vars["ExpectedOpenAuthPercentage"])).toBe(vars["OpenAuthLimitPercentageAfterUncommit"]);
    expect(String(vars["AuthLimitBeforeUncommit"])).toBe(vars["AuthLimitAfterUncommit"]);
    expect(String(vars["LastCommittedBidBeforeUncommit"])).toBe(vars["LastCommittedBidAfterUnommit"]);
    expect(String(vars["LastCommittedLoanAmountBeforeUncommit"])).toBe(vars["LastCommittedLoanAmountAfterUncommit"]);
    vars["CommittedLoansCountAfterUncommit"] = await priceOfferedPage.LockedCommitted_Loans_Count.textContent() || '';
    expect(String(vars["CommittedLoansCountBeforeUnommit"])).toBe(vars["CommittedLoansCountAfterUncommit"]);
    await correspondentPortalPage.Bid_Requests.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqIdPriceOffered"]);
    await page.keyboard.press('Enter');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["BidStatusBidReqPage"] = await bidRequestPage.Bid_Status_BidRequestsPage.textContent() || '';
    vars["BidStatusBidReqPage"] = String(vars["BidStatusBidReqPage"]).trim();
    expect(String(vars["BidStatusBidReqPage"])).toBe("Partially Committed");
    await bidRequestPage.Required_Bid_Req_IDBid_Req_Page.click();
    await bidRequestPage.Bid_StatusBid_Req_Details.waitFor({ state: 'visible' });
    vars["StatusBidReqDetails"] = await bidRequestPage.Bid_StatusBid_Req_Details.textContent() || '';
    expect(String(vars["StatusBidReqDetails"])).toBe("Partially Committed");
  });
});
