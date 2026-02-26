// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
  });

  test('REG_TS20_TC01_Once the search action is clicked, verify the values present in the popup should be commitment commitment ID, Bid request ID, Chase loan number and the Correspondent loan number', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
    await commitmentListPage.Closed_List_Tab.click();
    await priceOfferedPage.Search_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Search_Dropdown.click();
    await expect(commitmentListPage.Commitment_IDSearch_Dropdown).toContainText("Commitment ID");
    await expect(commitmentListPage.Bid_Request_IDSearch_Dropdown).toContainText("Bid Request ID");
    await expect(commitmentListPage.Chase_Loan_NumberSearch_Dropdown).toContainText("Chase Loan Number");
    await expect(correspondentPortalPage.Correspondent_Loan_NumberSearch_Dropdown).toContainText("Correspondent Loan Number");
  });
});
