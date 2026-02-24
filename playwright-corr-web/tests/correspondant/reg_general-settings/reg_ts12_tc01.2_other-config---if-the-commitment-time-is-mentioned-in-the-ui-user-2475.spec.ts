// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS12_TC01.2_Other Config - If the Commitment time is Mentioned in the UI, Users are allowed to commit a new loans within the Mentioned time limit in the UI.', async ({ page }) => {
    const testData: Record<string, string> = {
  "RequestIDFrom-REG_TS12_TC01.1": "87JKBC8635A7",
  "Company Name": "Freedom",
  "CommitCorrCutoffBefore": "6"
}; // Profile: "General Settings", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    vars["BidReqId"] = testData["RequestIDFrom-REG_TS12_TC01.1"];
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["BidReqId"]);
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Commitment_IDCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Total_LoansCommitment_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Required_Loan_Num.check();
    vars["CommittedCorrLoan"] = await priceOfferedPage.Checked_Corr_Loan.textContent() || '';
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await expect(commitmentListPage.Commitment_OrderDisabled).toHaveAttribute('aria-label', "disabled");
    await commitmentListPage.Total_Committed_Loans_Tab.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(commitmentListPage.Committed_Corr_Loan_Number).toBeVisible();
    await stepGroups.stepGroup_Revert_The_Commitment_Correction_Cutoff_Time(page, vars);
  });
});
