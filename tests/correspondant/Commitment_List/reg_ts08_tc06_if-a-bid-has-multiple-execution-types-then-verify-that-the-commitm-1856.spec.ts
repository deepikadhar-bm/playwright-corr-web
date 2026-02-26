// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Commitment List - TS_2', () => {
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

  test('REG_TS08_TC06_If a bid has multiple execution types, then verify that the commitment details mentioned here belongs to one particular execution type', async ({ page }) => {
    const testData: Record<string, string> = {
  "RequestIdFrom5-1": "876YA587E147",
  "Requestidfrom4-2": "873O84593BB5",
  "RequestIdfrom6-1.1": "57HK54C5AE2A",
  "RequestIDfrom14-1": "876U855F6483",
  "CommitmentIdfrom8-8": "87JU2DDD",
  "RequestIdFrom5-5": "87CKA7D37EB6",
  "RequestIdFrom6-4": "87MWF9C278BC",
  "RequestIDFromPRE_PR_1-1": "87YTD25F4356",
  "CommitmentIDfrom8-10": "87JU2DDD",
  "RequestIdFrom8-8": "87BI08DD054F"
}; // Profile: "Commitment List", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    vars["BidReqId"] = testData["RequestIdFrom5-1"];
    await priceOfferedPage.Search_Dropdown.fill(vars["BidReqId"]);
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Commitment_IDStandard.click();
    await priceOfferedPage.Commit_IDCommitment_List.waitFor({ state: 'visible' });
    vars["CommitIDStandard"] = await priceOfferedPage.Commit_IDCommitment_List.textContent() || '';
    await priceOfferedPage.Back_To_Commitment_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Commitment_IDChase_Direct.click();
    await priceOfferedPage.Commit_IDCommitment_List.waitFor({ state: 'visible' });
    vars["CommitIDChase"] = await priceOfferedPage.Commit_IDCommitment_List.textContent() || '';
    await priceOfferedPage.Back_To_Commitment_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Commitment_IDStandard.click();
    await commitmentListPage.Total_LoansCommitment_List.waitFor({ state: 'visible' });
    await commitmentListPage.Total_LoansCommitment_List.click();
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.waitFor({ state: 'visible' });
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.click();
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await expect(commitmentListPage.Commitment_ID_DropdownStandard).toBeVisible();
    await expect(commitmentListPage.Commitment_ID_DropdownChase).toBeVisible();
    await priceOfferedPage.Back_To_Commitment_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Commitment_IDChase_Direct.click();
    await commitmentListPage.Total_LoansCommitment_List.waitFor({ state: 'visible' });
    await commitmentListPage.Total_LoansCommitment_List.click();
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.waitFor({ state: 'visible' });
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.click();
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await expect(commitmentListPage.Commitment_ID_DropdownChase).toBeVisible();
    await expect(commitmentListPage.Commitment_ID_DropdownStandard).toBeVisible();
  });
});
