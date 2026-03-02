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

test.describe('Commitment List - TS_2', () => {
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

  test('REG_TS08_TC08_Verify the user should not be able to perform commit action when the market threshold value exceeds', async ({ page }) => {

    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    vars["BidReqId"] = vars["RequestIDDetails"];
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqId"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidRequestIDPrice_Offered_New.click();
    await page.waitForLoadState('networkidle');
    await priceOfferedPage.Back_To_Commitment_List.waitFor({ state: 'visible' });
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.waitFor({ state: 'visible' });
    await correspondentPortalPage.Get_Price_Button.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    vars["FirstMarkAdj"] = await correspondentPortalPage.First_Market_adjustment_Value.textContent() || '';
    vars["FirstMarkAdj"] = String(vars["FirstMarkAdj"]).trim();
    vars["FirstMarkAdj"] = String(vars["FirstMarkAdj"]).replace(/\-/g, '');
    vars["FirstMarkAdj"] = (parseFloat(String("0")) + parseFloat(String(vars["FirstMarkAdj"]))).toFixed(0);
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.click();
    await priceOfferedPage.Get_Price_Button.waitFor({ state: 'visible' });
    await priceOfferedPage.Get_Price_Button.click();
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await priceOfferedPage.Yes_Commit_ButtonPopup.click();
    await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
    vars["CommitmentID"] = await priceOfferedPage.Commitment_IdPrice_Offered.textContent() || '';
    await priceOfferedPage.Okay_ButtonPopup.click();
    await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["BidReqId"]);
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await commitmentListPage.Commitment_IDCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["MinMaxThresholdBefore"] = await priceOfferedPage.MinMax_ThresholdDetails.textContent() || '';
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await correspondentPortalPage.Market_Thresholds.scrollIntoViewIfNeeded();
    await correspondentPortalPage.Market_Thresholds.click();
    await stepGroups.stepGroup_Market_Threshold(page, vars);
    vars["RandomInteger"] = String(Math.floor(Math.random() * (6 - 3 + 1)) + 3);
    vars["NumberLessThanMarkAdj"] = (parseFloat(String(vars["FirstMarkAdj"])) - parseFloat(String(vars["RandomInteger"]))).toFixed(0);
    vars["NumLowerThanMarkAdjPopup"] = (parseFloat(String("0")) + parseFloat(String(vars["NumberLessThanMarkAdj"]))).toFixed(1);
    await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.fill(vars["NumberLessThanMarkAdj"]);
    await priceOfferedPage.Update_Threshold_Button.click();
    await page.reload();
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqId"]);
    await priceOfferedPage.BidRequestIDPrice_Offered_New.click();
    await correspondentPortalPage.Get_Price_Button.click();
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["BidReqId"]);
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Commitment_IDCommitment_List_Page.click();
    await commitmentListPage.No_LoansCommitment_List.waitFor({ state: 'visible' });
    vars["NoOfLoansBefore"] = await commitmentListPage.No_LoansCommitment_List.textContent() || '';
    await commitmentListPage.Total_LoansCommitment_List.click();
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.waitFor({ state: 'visible' });
    // [DISABLED] Click on Check the Loan Num
    // await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.click();
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.check();
    await priceOfferedPage.Checked_Corr_Loan.waitFor({ state: 'visible' });
    vars["CorrLoan"] = await priceOfferedPage.Checked_Corr_Loan.textContent() || '';
    await stepGroups.stepGroup_Storing_PopUpError(page, vars);
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await commitmentListPage.Commitment_IdAdd_To_Commit_Dropdown.click();
    await correspondentPortalPage.Yes_Commit_Button.click();
    await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
    await expect(correspondentPortalPage.Loans_failed_to_be_added_to_commitment).toBeVisible();
    vars["ActualErrorPopup"] = await correspondentPortalPage.Loan_Greater_Text.textContent() || '';
    await expect(page.getByText(vars["ExpectedPopUpError1"])).toBeVisible();
    expect(String(vars["ActualErrorPopup"])).toBe(vars["ExpectedPopUpError2"]);
    await priceOfferedPage.Okay_ButtonPopup.click();
    await commitmentListPage.Total_Committed_Loans_Tab.click();
    vars["NoOfLoansAfter"] = await commitmentListPage.No_LoansCommitment_List.textContent() || '';
    expect(String(vars["NoOfLoansBefore"])).toBe(vars["NoOfLoansAfter"]);
    vars["MaxThreshold"] = await commitmentListPage.Max_Threshold.textContent() || '';
    expect(String(vars["MaxThreshold"])).toBe(vars["NumberLessThanMarkAdj"]);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await correspondentPortalPage.Market_Thresholds.scrollIntoViewIfNeeded();
    await correspondentPortalPage.Market_Thresholds.click();
    await stepGroups.stepGroup_Market_Threshold(page, vars);
    await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.fill("120");
    await priceOfferedPage.Update_Threshold_Button.click();
    // Write to test data profile: "RequestIdFrom8-8" = vars["BidReqId"]
    // Write to test data profile: "CommitmentIdfrom8-8" = vars["CommitmentID"]
  });
});
