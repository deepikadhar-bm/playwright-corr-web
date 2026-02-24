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

  test('REG_TS03_TC08_Audit Log - Verify the difference button in the details section  (Side by side) & (Line by Line). ', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Navigating_to_Customer_Permissions_and_disabling_both_execut(page, vars);
    await stepGroups.stepGroup_Navigating_to_Customer_Permissions_and_enabling_both_executi(page, vars);
    await generalSettingPage.Audit_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Verifying_the_Audit_Time_and_Date(page, vars);
    await expect(generalSettingPage.First_User_Name_UI).toContainText("testsigma_internal\t\r");
    await expect(generalSettingPage.Config_Type_Column_Data).toContainText("Customer Permission Config");
    await correspondentPortalPage.See_the_difference_Button.click();
    await correspondentPortalPage.Side_by_side_Button.waitFor({ state: 'visible' });
    await expect(correspondentPortalPage.Side_by_side_Button).toBeVisible();
    await expect(correspondentPortalPage.Line_by_line_Button).toBeVisible();
    await expect(seeDifferencePopUpPage.Side_by_Side_Tables).toBeVisible();
    vars["SidebySideTablesCount"] = String(await seeDifferencePopUpPage.Side_by_Side_Tables.count());
    expect(String(vars["SidebySideTablesCount"])).toBe("2");
    await expect(seeDifferencePopUpPage.Expected_Previous_DataCustomer_Permission_Config).toBeVisible();
    await expect(seeDifferencePopUpPage.Expected_New_Data_Standard_Execution).toBeVisible();
    await expect(seeDifferencePopUpPage.Expected_New_DataChase_Execution).toBeVisible();
    await expect(seeDifferencePopUpPage.Expected_Previous_DataCustomer_Permission_Config).toHaveCSS('border', "rgba(255, 182, 186, 1)");
    await expect(seeDifferencePopUpPage.Expected_New_Data_Standard_Execution).toHaveCSS('border', "rgba(221, 255, 221, 1)");
    await expect(seeDifferencePopUpPage.Expected_New_DataChase_Execution).toHaveCSS('border', "rgba(221, 255, 221, 1)");
    await correspondentPortalPage.Line_by_line_Button.click();
    await correspondentPortalPage.Side_by_side_Button.waitFor({ state: 'visible' });
    await expect(correspondentPortalPage.Line_by_line_Button).toBeVisible();
    await seeDifferencePopUpPage.Line_by_line_Table.waitFor({ state: 'visible' });
    vars["LineByLineTableCount"] = String(await seeDifferencePopUpPage.Line_by_line_Table.count());
    expect(String(vars["LineByLineTableCount"])).toBe("1");
    await expect(seeDifferencePopUpPage.Expected_Previous_DataCustomer_Permission_Config).toHaveCSS('border', "rgba(255, 182, 186, 1)");
    await expect(seeDifferencePopUpPage.Expected_New_Data_Standard_Execution).toHaveCSS('border', "rgba(221, 255, 221, 1)");
    await expect(seeDifferencePopUpPage.Expected_New_DataChase_Execution).toHaveCSS('border', "rgba(221, 255, 221, 1)");
    await correspondentPortalPage.close_pop_up_bid_request_details.click();
  });
});
