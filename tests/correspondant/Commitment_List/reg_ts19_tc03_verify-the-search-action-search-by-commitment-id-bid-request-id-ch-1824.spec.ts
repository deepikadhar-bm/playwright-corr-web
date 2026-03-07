// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentDetailsPage } from '../../../src/pages/correspondant/commitment-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { waitForSpinnerToDisappear } from '@helpers/wait-helpers';
import { TIMEOUT } from 'dns/promises';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let commitmentDetailsPage: CommitmentDetailsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentDetailsPage = new CommitmentDetailsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test('REG_TS19_TC03_Verify the search action, Search by commitment ID, Bid request ID, Chase loan number and the Correspondent loan number for input', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await commitmentListPage.First_Commitment_IDCommitment_List.first().click();
    vars["BidReqId"] = await priceOfferedPage.BidRequestIDTextDetails.first().textContent() || '';
    vars["CommitmentID"] = await priceOfferedPage.Commit_IDCommitment_List.first().textContent() || '';
    vars["ChaseLoanNumber"] = await commitmentDetailsPage.Chase_Loan_NumberCommitments_Details.first().textContent() || '';
    vars["CorrespondentLoanNumber"] = await commitmentListPage.Corr_Loan_NumCommitments_Details.first().textContent() || '';
    await priceOfferedPage.Back_To_Commitment_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });

    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.type(vars["CommitmentID"]);
    await priceOfferedPage.Commitment_Id_DropdownCommitment_List_Page.waitFor({ state: 'visible' });
    await priceOfferedPage.Commitment_Id_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 20000 });    
    await expect(commitmentListPage.Commit_IDCommitment_List_Screen.first()).toContainText(vars["CommitmentID"]);
    await commitmentListPage.Search_Cancel_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.type(vars["BidReqId"]);
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await page.waitForTimeout(6000);
    await Methods.verifyMultipleElementsHaveSameText(commitmentListPage.First_Bid_Req_IDCommitment_List, vars["BidReqId"]);
    await commitmentListPage.Search_Cancel_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.type(vars["ChaseLoanNumber"]);

    await commitmentListPage.Chase_Loan_Number_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText(vars["CommitmentID"])).toBeVisible();
    await commitmentListPage.Commitment_IDCommitment_List_Page(vars["BidReqId"]).first().click();
    await expect(commitmentDetailsPage.Chase_Loan_NumberCommitments_Details.first()).toContainText(vars["ChaseLoanNumber"]);
    await priceOfferedPage.Back_To_Commitment_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Search_Cancel_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.type(vars["CorrespondentLoanNumber"]);
    await commitmentListPage.Correspondent_Loan_Num_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText(vars["CommitmentID"])).toBeVisible();
    await commitmentListPage.Commitment_IDCommitment_List_Page(vars["BidReqId"]).click();
    await expect(commitmentListPage.Corr_Loan_NumCommitments_Details.first()).toContainText(vars["CorrespondentLoanNumber"]);
  });
});
