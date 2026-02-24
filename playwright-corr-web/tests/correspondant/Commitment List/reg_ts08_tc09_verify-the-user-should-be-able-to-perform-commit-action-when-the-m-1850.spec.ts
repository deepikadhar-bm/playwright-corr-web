// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Commitment List - TS_2', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestsPage = new BidRequestsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS08_TC09_Verify the user should be able to perform commit action when the market threshold value does not satisfy min condition', async ({ page }) => {
    const testData: Record<string, string> = {
  "RequestIdFrom8-8": "87BI08DD054F",
  "CommitmentIdfrom8-8": "87JU2DDD",
  "Requestidfrom4-2": "873O84593BB5",
  "RequestIdfrom6-1.1": "57HK54C5AE2A",
  "RequestIDfrom14-1": "876U855F6483",
  "RequestIdFrom5-1": "876YA587E147",
  "RequestIdFrom5-5": "87CKA7D37EB6",
  "RequestIdFrom6-4": "87MWF9C278BC",
  "RequestIDFromPRE_PR_1-1": "87YTD25F4356",
  "CommitmentIDfrom8-10": "87JU2DDD"
}; // Profile: "Commitment List", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    vars["BidReqId"] = testData["RequestIdFrom8-8"];
    vars["CommitmentID"] = testData["CommitmentIdfrom8-8"];
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqId"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidRequestIDPrice_Offered_New.click();
    await correspondentPortalPage.Get_Price_Button.click();
    await page.waitForLoadState('networkidle');
    await priceOfferedPage.Back_To_Commitment_List.waitFor({ state: 'visible' });
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.waitFor({ state: 'visible' });
    vars["FirstMarkAdjValue"] = await correspondentPortalPage.First_Market_adjustment_Value.textContent() || '';
    vars["FirstMarkAdjValue"] = String(vars["FirstMarkAdjValue"]).trim();
    vars["FirstMarkAdjValue"] = String(vars["FirstMarkAdjValue"]).replace(/\-/g, '');
    vars["FirstMarkAdjValue"] = (parseFloat(String("0")) + parseFloat(String(vars["FirstMarkAdjValue"]))).toFixed(0);
    vars["MinValue"] = (parseFloat(String(vars["FirstMarkAdjValue"])) + parseFloat(String(String(Math.floor(Math.random() * (9999 - 1 + 1)) + 1)))).toFixed(0);
    vars["MaxValue"] = (parseFloat(String(vars["MinValue"])) + parseFloat(String(String(Math.floor(Math.random() * (9999 - 1 + 1)) + 1)))).toFixed(0);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await correspondentPortalPage.Market_Thresholds.scrollIntoViewIfNeeded();
    await correspondentPortalPage.Market_Thresholds.click();
    await stepGroups.stepGroup_Market_Threshold(page, vars);
    await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.fill(vars["MaxValue"]);
    await commitmentListPage.Enter_minimum_display_value_in_percentage.clear();
    await commitmentListPage.Enter_minimum_display_value_in_percentage.fill(vars["MinValue"]);
    await priceOfferedPage.Update_Threshold_Button.click();
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqId"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidRequestIDPrice_Offered_New.click();
    await correspondentPortalPage.Get_Price_Button.waitFor({ state: 'visible' });
    await correspondentPortalPage.Get_Price_Button.click();
    await commitmentListPage.Individual_Mark_Adjust.waitFor({ state: 'visible' });
    await stepGroups.stepGroup_Verifying_MarkAdjValue(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["BidReqId"]);
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await commitmentListPage.Commitment_IDCommitment_List_Page.click();
    await expect(commitmentListPage.Max_Threshold).toContainText(vars["MaxValue"]);
    await expect(commitmentListPage.Min_Threshold).toContainText(vars["MinValue"]);
    vars["LoansCountBefore"] = await commitmentListPage.No_LoansCommitment_List.textContent() || '';
    await commitmentListPage.Total_LoansCommitment_List.click();
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.waitFor({ state: 'visible' });
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.click();
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await commitmentListPage.Commitment_IdAdd_To_Commit_Dropdown.click();
    await correspondentPortalPage.Yes_Commit_Button.click();
    await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
    await priceOfferedPage.Okay_ButtonPopup.click();
    await commitmentListPage.Total_Committed_Loans_Tab.click();
    vars["LoansCountAfter"] = await commitmentListPage.No_LoansCommitment_List.textContent() || '';
    expect(String(vars["LoansCountAfter"])).toBe(vars["LoansCountBefore"]);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await correspondentPortalPage.Market_Thresholds.scrollIntoViewIfNeeded();
    await correspondentPortalPage.Market_Thresholds.click();
    await stepGroups.stepGroup_Market_Threshold(page, vars);
    await commitmentListPage.Enter_minimum_display_value_in_percentage.clear();
    await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.fill("120");
    await commitmentListPage.Enter_minimum_display_value_in_percentage.fill("1");
    await priceOfferedPage.Update_Threshold_Button.click();
  });
});
