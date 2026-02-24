// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { SeeDifferencePopUpPage } from '../../../src/pages/correspondant/see-difference-pop-up';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let seeDifferencePopUpPage: SeeDifferencePopUpPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    seeDifferencePopUpPage = new SeeDifferencePopUpPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS04_TC09_Bulk Batch timing  - After performing each action, verify the same in Audit logs', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
    vars["BufferTime"] = "1";
    await stepGroups.stepGroup_Delete_Last_Batch_Time(page, vars);
    // [DISABLED] Split string LastBatchTime using : and store the 0 into a TimeHour
    // vars["TimeHour"] = String('').split(":")["0"] || '';
    // [DISABLED] Split string LastBatchTime using : and store the 1 into a TimeMin
    // vars["TimeMin"] = String('').split(":")["1"] || '';
    // [DISABLED] concate "hours": and TimeHour and store the new string into a ExpectedTimeHour
    // vars["TimeHour"] = String('') + String('');
    // [DISABLED] concate ExpectedTimeHour and , and store the new string into a ExpectedTimeHour
    // vars[","] = String('') + String('');
    // [DISABLED] concate "minutes": and TimeMin and store the new string into a ExpectedTimeMin
    // vars["TimeMin"] = String('') + String('');
    await generalSettingPage.Audit_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Verifying_the_Audit_Time_and_Date(page, vars);
    await stepGroups.stepGroup_Verifying_the_Username_and_Config_Type_in_Audit_List_Screen(page, vars);
    await stepGroups.stepGroup_Verifying_the_side_by_side_data_in_see_difference_pop_upAudi(page, vars);
    // [DISABLED] Verify that the text "processingTime": { is present in the table element Side by side (Previous data table) and With Scrollable FALSE
    // await expect(seeDifferencePopUpPage.Side_by_side_Previous_data_table).toContainText("\"processingTime\": {");
    // [DISABLED] Verify that the text ExpectedTimeHour is present in the table element Side by side (Previous data table) and With Scrollable FALSE
    // await expect(seeDifferencePopUpPage.Side_by_side_Previous_data_table).toContainText(vars["ExpectedTimeHour"]);
    // [DISABLED] Verify that the text ExpectedTimeMin is present in the table element Side by side (Previous data table) and With Scrollable FALSE
    // await expect(seeDifferencePopUpPage.Side_by_side_Previous_data_table).toContainText(vars["ExpectedTimeMin"]);
    // [DISABLED] Verify that the element Side by Side Previous Data (Early Config) displays rgba(254, 232, 233, 1) for css property name background-color and With Scrollable FALSE
    // await expect(seeDifferencePopUpPage.Side_by_Side_Previous_Data_Early_Config).toHaveCSS('border', "rgba(254, 232, 233, 1)");
    // [DISABLED] Verify that the element New Data Empty Fields is present and With Scrollable FALSE
    // await expect(seeDifferencePopUpPage.New_Data_Empty_Fields).toBeVisible();
    // [DISABLED] Verify that the element Previous Data Text(Side by Side) displays text contains minValue and With Scrollable FALSE
    // await expect(seeDifferencePopUpPage.Previous_Data_TextSide_by_Side).toContainText("minValue");
    // [DISABLED] Verify that the element Previous Data Change Text(Side by Side) displays text contains ExpectedPreviousData and With Scrollable FALSE
    // await expect(seeDifferencePopUpPage.Previous_Data_Change_TextSide_by_Side).toContainText(vars["ExpectedPreviousData"]);
    // [DISABLED] Verify that the element New Data Text(Side by Side) displays text contains minValue and With Scrollable FALSE
    // await expect(correspondentPortalPage.New_Data_TextLine_by_Line).toContainText("minValue");
    // [DISABLED] Verify that the element New Data Change Text (Side by Side) displays text contains ExpectedNewData and With Scrollable FALSE
    // await expect(seeDifferencePopUpPage.New_Data_Change_Text_Side_by_Side).toContainText(vars["ExpectedNewData"]);
    await stepGroups.stepGroup_Verifying_the_Line_by_line_data_in_see_difference_pop_upAudi(page, vars);
    // [DISABLED] Verify that the element Previous Data Text(Side by Side) displays text contains minValue and With Scrollable FALSE
    // await expect(seeDifferencePopUpPage.Previous_Data_TextSide_by_Side).toContainText("minValue");
    // [DISABLED] Verify that the element Previous Data Change Text(Side by Side) displays text contains ExpectedPreviousData and With Scrollable FALSE
    // await expect(seeDifferencePopUpPage.Previous_Data_Change_TextSide_by_Side).toContainText(vars["ExpectedPreviousData"]);
    // [DISABLED] Verify that the element New Data Text(Side by Side) displays text contains minValue and With Scrollable FALSE
    // await expect(correspondentPortalPage.New_Data_TextLine_by_Line).toContainText("minValue");
    // [DISABLED] Verify that the element New Data Change Text (Side by Side) displays text contains ExpectedNewData and With Scrollable FALSE
    // await expect(seeDifferencePopUpPage.New_Data_Change_Text_Side_by_Side).toContainText(vars["ExpectedNewData"]);
    await correspondentPortalPage.close_pop_up_bid_request_details.click();
  });
});
