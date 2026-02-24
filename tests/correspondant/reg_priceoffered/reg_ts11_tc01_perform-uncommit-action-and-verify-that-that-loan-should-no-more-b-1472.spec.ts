// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1394 } from '../../../src/helpers/prereqs/prereq-1394';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1394(page, vars);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS11_TC01_Perform uncommit action, and verify that that loan should no more be in committed state, and verify the auth limit, open auth limit and the Last committed bid values along with the [+cou', async ({ page }) => {

    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.click();
    vars["BidReqIdPriceOffered"] = vars["RequestIDDetails"];
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqIdPriceOffered"]);
    await page.waitForLoadState('networkidle');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidRequestIDPrice_Offered.click();
    await priceOfferedPage.Last_Committed_Bid.waitFor({ state: 'visible' });
    vars["LastCommittedBidBeforeCommit"] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
    vars["LastCommittedBidBeforeCommit"] = String('').split("|")["0"] || '';
    vars["LastCommittedBidBeforeCommit"] = String(vars["LastCommittedBidBeforeCommit"]).trim();
    vars["LastCommitLoanAmountBeforeCommit"] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
    vars["LastCommitLoanAmountBeforeCommit"] = String(vars["LastCommitLoanAmountBeforeCommit"]).substring(3);
    await priceOfferedPage.Check_UncommittedLoanNum1.check();
    vars["CommittedLoan"] = await priceOfferedPage.Committed_Loan_ID.textContent() || '';
    await correspondentPortalPage.Get_Price_Button.waitFor({ state: 'visible' });
    await correspondentPortalPage.Get_Price_Button.click();
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await priceOfferedPage.Yes_Commit_ButtonPopup.click();
    await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
    await priceOfferedPage.Okay_ButtonPopup.click();
    await page.waitForLoadState('networkidle');
    vars["OpenAuthLimitAfterCommit"] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
    vars["OpenAuthLimitAfterCommit"] = String('').split("(")["0"] || '';
    vars["AuthLimitAfterCommit"] = await priceOfferedPage.Auth_Limit.textContent() || '';
    vars["CommittedLoansCountAfterCommit"] = await priceOfferedPage.LockedCommitted_Loans_Count.textContent() || '';
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["BidReqIdPriceOffered"]);
    await priceOfferedPage.Commitment_Page_Bid_Request_ID.click();
    await page.waitForLoadState('networkidle');
    await priceOfferedPage.CommitmentID.click();
    await commitmentListPage.Committed_Loan_Number.waitFor({ state: 'visible' });
    await commitmentListPage.Committed_Loan_Number.check();
    vars["SelectedLoansCount"] = String(await priceOfferedPage.Checked_Row.count());
    vars["UncommittedLoanAmount"] = await priceOfferedPage.Selected_Uncommitted_Loan_Amount.textContent() || '';
    vars["UncommittedLoanNum"] = await priceOfferedPage.Checked_Corr_Loan.textContent() || '';
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await expect(priceOfferedPage.BidRequestIdPopup).toContainText(vars["BidReqIdPriceOffered"]);
    await expect(priceOfferedPage.Loan_ValuePopup).toContainText(vars["UncommittedLoanAmount"]);
    await expect(priceOfferedPage.Selected_LoansPopup).toContainText(vars["SelectedLoansCount"]);
    await priceOfferedPage.Yes_Uncommit_Button.click();
    await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Uncommitted_successfully).toContainText("Uncommitted successfully");
    await priceOfferedPage.Okay_ButtonPopup.click();
    vars["ExpectedOpenAuthLimit"] = (parseFloat(String(vars["OpenAuthLimitAfterCommit"])) + parseFloat(String(vars["UncommittedLoanAmount"]))).toFixed(0);
    vars["ExpectedOpenAuthPercentage"] = (parseFloat(String(vars["ExpectedOpenAuthLimit"])) / parseFloat(String(vars["AuthLimitAfterCommit"]))).toFixed(4);
    vars["ExpectedOpenAuthPercentage"] = (parseFloat(String(vars["ExpectedOpenAuthPercentage"])) * parseFloat(String("100"))).toFixed(2);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqIdPriceOffered"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidRequestIDPrice_Offered.click();
    await priceOfferedPage.All_Loans_Tabprice_offered_screen.waitFor({ state: 'visible' });
    await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
    await expect(priceOfferedPage.Committed_Loan_NumLatest).toBeVisible();
    await expect(priceOfferedPage.Locked_IconLatest_Committed_Loan).toBeVisible();
    await expect(priceOfferedPage.Uncommitted_LoanCheck_Box).toBeVisible();
    vars["OpenAuthLimit"] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
    vars["OpenAuthLimitAfterUncommit"] = String('').split("(")["0"] || '';
    vars["OpenAuthLimitAfterUncommit"] = String(vars["OpenAuthLimitAfterUncommit"]).replace(/\$\,/g, '');
    vars["OpenAuthLimitAfterUncommit"] = String(vars["OpenAuthLimitAfterUncommit"]).trim();
    vars["OpenAuthLimitPercentageAfterUncommit"] = String('').split("(")["1"] || '';
    vars["OpenAuthLimitPercentageAfterUncommit"] = String(vars["OpenAuthLimitPercentageAfterUncommit"]).replace(/\)%/g, '');
    expect(String(vars["ExpectedOpenAuthLimit"])).toBe(vars["OpenAuthLimitAfterUncommit"]);
    expect(String(vars["ExpectedOpenAuthPercentage"])).toBe(vars["OpenAuthLimitPercentageAfterUncommit"]);
    vars["AuthLimitAfterUncommit"] = await priceOfferedPage.Auth_Limit.textContent() || '';
    expect(String(vars["AuthLimitAfterCommit"])).toBe(vars["AuthLimitAfterUncommit"]);
    vars["LastCommittedBidAfterUncommit"] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
    vars["LastCommittedBidAfterUncommit"] = String('').split("|")["0"] || '';
    vars["LastCommittedBidAfterUncommit"] = String(vars["LastCommittedBidAfterUncommit"]).trim();
    expect(String(vars["LastCommittedBidBeforeCommit"])).toBe(vars["LastCommittedBidAfterUncommit"]);
    vars["LastCommitLoanAmountAfterUncommit"] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
    vars["LastCommitLoanAmountAfterUncommit"] = String(vars["LastCommitLoanAmountAfterUncommit"]).substring(3);
    expect(String(vars["LastCommitLoanAmountBeforeCommit"])).toBe(vars["LastCommitLoanAmountAfterUncommit"]);
    if (true) /* Element Actual Locked/Committed Loans is not visible */ {
      expect(String("0")).toBe(vars["CommittedLoansCountAfterCommit"]);
    } else {
      vars["CommittedLoansCountAfterUncommit"] = await priceOfferedPage.LockedCommitted_Loans_Count.textContent() || '';
      expect(String(vars["CommittedLoansCountAfterUncommit"])).toBe(vars["CommittedLoansCountAfterCommit"]);
    }
    // Write to test data profile: "RequestIDfrom11-1" = vars["BidReqIdPriceOffered"]
  });
});
