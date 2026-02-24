// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentDetailsPage } from '../../../src/pages/correspondant/commitment-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let commitmentDetailsPage: CommitmentDetailsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentDetailsPage = new CommitmentDetailsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS20_TC03_Input the complete value for the all of them and verify the matched records are being displayed as expected', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
    await commitmentListPage.Closed_List_Tab.click();
    await commitmentListPage.First_Commitment_IDCommitment_List.waitFor({ state: 'visible' });
    await commitmentListPage.First_Commitment_IDCommitment_List.click();
    vars["BidReqId"] = await priceOfferedPage.BidRequestIDTextDetails.textContent() || '';
    vars["CommitmentID"] = await priceOfferedPage.Commit_IDCommitment_List.textContent() || '';
    vars["ChaseLoanNumber"] = await commitmentDetailsPage.Chase_Loan_NumberCommitments_Details.textContent() || '';
    vars["CorrespondentLoanNumber"] = await commitmentListPage.Corr_Loan_NumCommitments_Details.textContent() || '';
    await priceOfferedPage.Back_To_Commitment_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["CommitmentID"]);
    await priceOfferedPage.Commitment_Id_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(commitmentListPage.Commit_IDCommitment_List_Screen).toContainText(vars["CommitmentID"]);
    await commitmentListPage.Search_Cancel_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["BidReqId"]);
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    for (let i = 0; i < await commitmentListPage.First_Bid_Req_IDCommitment_List.count(); i++) {
      await expect(commitmentListPage.First_Bid_Req_IDCommitment_List.nth(i)).toHaveText(String(vars["BidReqId"]));
    }
    await commitmentListPage.Search_Cancel_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["ChaseLoanNumber"]);
    await commitmentListPage.Chase_Loan_Number_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText(vars["CommitmentID"])).toBeVisible();
    await commitmentListPage.Commitment_IDCommitment_List_Page.click();
    await expect(commitmentDetailsPage.Chase_Loan_NumberCommitments_Details).toContainText(vars["ChaseLoanNumber"]);
    await priceOfferedPage.Back_To_Commitment_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Search_Cancel_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["CorrespondentLoanNumber"]);
    await commitmentListPage.Correspondent_Loan_Num_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText(vars["CommitmentID"])).toBeVisible();
    await commitmentListPage.Commitment_IDCommitment_List_Page.click();
    await expect(commitmentListPage.Corr_Loan_NumCommitments_Details).toContainText(vars["CorrespondentLoanNumber"]);
  });
});
