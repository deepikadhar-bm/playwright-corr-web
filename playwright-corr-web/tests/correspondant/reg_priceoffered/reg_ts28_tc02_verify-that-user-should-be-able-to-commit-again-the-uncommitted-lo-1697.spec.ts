// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1394 } from '../../../src/helpers/prereqs/prereq-1394';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1394(page, vars);
    bidRequestsPage = new BidRequestsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS28_TC02_Verify that user should be able to commit again the uncommitted loan', async ({ page }) => {

    // [DISABLED] Login to CORR Portal
    // await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    vars["BidReqIdPriceOffered"] = vars["RequestIDDetails"];
    // Write to test data profile: "RequestIDFrom28-2" = vars["BidReqIdPriceOffered"]
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqIdPriceOffered"]);
    await correspondentPortalPage.First_Bid_Request_ID.waitFor({ state: 'visible' });
    await stepGroups.stepGroup_Commits_an_Fresh_Loan_Num(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["BidReqIdPriceOffered"]);
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Commitment_ID_2.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.check();
    vars["UncommittedLoanNum"] = await priceOfferedPage.Checked_Corr_Loan.textContent() || '';
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await priceOfferedPage.Yes_Uncommit_Button.click();
    await correspondentPortalPage.Okay_Button1.waitFor({ state: 'visible' });
    await correspondentPortalPage.Okay_Button1.click();
    await commitmentListPage.Total_LoansCommitment_List.waitFor({ state: 'visible' });
    await commitmentListPage.Total_Committed_Loans_Tab.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(priceOfferedPage.Committed_Loan_NumLatest).toBeVisible();
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqIdPriceOffered"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidRequestIDPrice_Offered.click();
    await priceOfferedPage.Uncommitted_LoanCheck_Box.waitFor({ state: 'visible' });
    await priceOfferedPage.Uncommitted_LoanCheck_Box.check();
    await priceOfferedPage.Get_Price_Button.click();
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await priceOfferedPage.Yes_Commit_ButtonPopup.click();
    await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
    await priceOfferedPage.Okay_ButtonPopup.click();
    await priceOfferedPage.LockedCommitted_Loans.waitFor({ state: 'visible' });
    await priceOfferedPage.Paste_Loans_ButtonPrice_Offered_Page.waitFor({ state: 'hidden' });
    await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeVisible();
    await expect(priceOfferedPage.Committed_Loan_NumLatest).toBeVisible();
    await expect(priceOfferedPage.Commit_OrderLatest_Committed_Loan).toContainText("2");
    await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
    await priceOfferedPage.Paste_Loans_ButtonPrice_Offered_Page.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeVisible();
    await expect(priceOfferedPage.Committed_Loan_NumLatest).toBeVisible();
    await expect(priceOfferedPage.Locked_IconLatest_Committed_Loan).toBeVisible();
    await expect(priceOfferedPage.Commit_OrderLatest_Committed_Loan).toContainText("2");
  });
});
