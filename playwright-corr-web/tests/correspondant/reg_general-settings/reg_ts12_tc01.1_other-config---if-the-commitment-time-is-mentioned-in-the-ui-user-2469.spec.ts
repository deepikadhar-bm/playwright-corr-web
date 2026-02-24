// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SeeDifferencePopUpPage } from '../../../src/pages/correspondant/see-difference-pop-up';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1394 } from '../../../src/helpers/prereqs/prereq-1394';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let priceOfferedPage: PriceOfferedPage;
  let seeDifferencePopUpPage: SeeDifferencePopUpPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1394(page, vars);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    seeDifferencePopUpPage = new SeeDifferencePopUpPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS12_TC01.1_Other Config - If the Commitment time is Mentioned in the UI, Users are allowed to commit a new loans within the Mentioned time limit in the UI.', async ({ page }) => {

    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["BidReqId"] = vars["RequestIDDetails"];
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqId"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Commits_an_Fresh_Loan_Num(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Other_Config.click();
    await correspondentPortalPage.Commit_Correction_Cutoff_Time.waitFor({ state: 'visible' });
    vars["CommitCorrCutoffBefore"] = await correspondentPortalPage.Commit_Correction_Cutoff_Time.inputValue() || '';
    // Write to test data profile: "CommitCorrCutoffBefore" = vars["CommitCorrCutoffBefore"]
    vars["CommitCorrCutoffBefore"] = (parseFloat(String(vars["CommitCorrCutoffBefore"])) * parseFloat(String("60"))).toFixed(0);
    vars["ReplacingCutoffTime"] = "1";
    await correspondentPortalPage.Commit_Correction_Cutoff_Time.fill(String(vars["ReplacingCutoffTime"]));
    vars["ReplacingCutoffTime"] = (parseFloat(String(vars["ReplacingCutoffTime"])) * parseFloat(String("60"))).toFixed(0);
    await correspondentPortalPage.Save_Changes_Button.click();
    await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
    await generalSettingPage.Audit_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Verifying_the_Audit_Time_and_Date(page, vars);
    await stepGroups.stepGroup_Verifying_the_Username_and_Config_Type_in_Audit_List_Screen(page, vars);
    await stepGroups.stepGroup_Verifying_the_side_by_side_data_in_see_difference_pop_upAudi(page, vars);
    vars["Space"] = "key_blank";
    vars["PreviousData"] = "\"internalUserCorrectionCutOfMinutes\":" + vars["Space"] + vars["CommitCorrCutoffBefore"] + ",";
    await expect(seeDifferencePopUpPage.Side_by_side_Previous_data_table).toContainText(vars["PreviousData"]);
    await expect(seeDifferencePopUpPage.Previous_Data_Change_TextSide_by_Side).toHaveCSS('border', "rgba(255, 182, 186, 1)");
    vars["NewChangedData"] = "\"internalUserCorrectionCutOfMinutes\":" + vars["Space"] + vars["ReplacingCutoffTime"] + ",";
    await expect(seeDifferencePopUpPage.Side_by_Side_New_Data_TableSee_Difference).toContainText(vars["NewChangedData"]);
    await expect(seeDifferencePopUpPage.New_Data_Change_Text_Side_by_Side).toHaveCSS('border', "rgba(151, 242, 149, 1)");
    await stepGroups.stepGroup_Verifying_the_Line_by_line_data_in_see_difference_pop_upAudi(page, vars);
    await expect(seeDifferencePopUpPage.Previous_Data_TextSide_by_Side).toContainText(vars["PreviousData"]);
    await expect(seeDifferencePopUpPage.Previous_Data_Change_TextSide_by_Side).toHaveCSS('border', "rgba(255, 182, 186, 1)");
    await expect(correspondentPortalPage.New_Data_TextLine_by_Line).toContainText(vars["NewChangedData"]);
    await expect(seeDifferencePopUpPage.New_Data_Change_Text_Side_by_Side).toHaveCSS('border', "rgba(151, 242, 149, 1)");
    await correspondentPortalPage.close_pop_up_bid_request_details.click();
    await correspondentPortalPage.Commitments_Side_Menu.waitFor({ state: 'visible' });
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["BidReqId"]);
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Commitment_IDCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Add_to_Commit_an_Loan_Num_And_Verifying_The_Committed_Loan_N(page, vars);
    // Write to test data profile: "RequestIDFrom-REG_TS12_TC01.1" = vars["BidReqId"]
  });
});
