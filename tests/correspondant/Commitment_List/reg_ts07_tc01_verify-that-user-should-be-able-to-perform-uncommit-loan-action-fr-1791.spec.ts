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

  test('REG_TS07_TC01_Verify that user should be able to perform uncommit loan action from one commitment id and should be restricted to perform uncommit actions from multiple commitment id\\\'s', async ({ page }) => {
    const testData: Record<string, string> = {
  "RequestIdFrom5-5": "87CKA7D37EB6",
  "Requestidfrom4-2": "873O84593BB5",
  "RequestIdfrom6-1.1": "57HK54C5AE2A",
  "RequestIDfrom14-1": "876U855F6483",
  "CommitmentIdfrom8-8": "87JU2DDD",
  "RequestIdFrom5-1": "876YA587E147",
  "RequestIdFrom6-4": "87MWF9C278BC",
  "RequestIDFromPRE_PR_1-1": "87YTD25F4356",
  "CommitmentIDfrom8-10": "87JU2DDD",
  "RequestIdFrom8-8": "87BI08DD054F"
}; // Profile: "Commitment List", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    vars["BidReqId"] = testData["RequestIdFrom5-5"];
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["BidReqId"]);
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Commitment_IDCommitment_List_Page.click();
    await commitmentListPage.Total_Committed_Loans_Tab.waitFor({ state: 'visible' });
    await commitmentListPage.Total_Committed_Loans_Tab.click();
    await priceOfferedPage.Select_All_Loan_Num.check();
    for (let i = 0; i < await commitmentListPage.Commit_Check_Boxes.count(); i++) {
      await expect(commitmentListPage.Commit_Check_Boxes.nth(i)).toBeDisabled();
    }
  });
});
