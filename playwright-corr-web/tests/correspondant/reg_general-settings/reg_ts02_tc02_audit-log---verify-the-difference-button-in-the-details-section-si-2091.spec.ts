// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { AuditLogPage } from '../../../src/pages/correspondant/audit-log';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { SeeDifferencePopUpPage } from '../../../src/pages/correspondant/see-difference-pop-up';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_2087 } from '../../../src/helpers/prereqs/prereq-2087';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let auditLogPage: AuditLogPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let seeDifferencePopUpPage: SeeDifferencePopUpPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_2087(page, vars);
    auditLogPage = new AuditLogPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    seeDifferencePopUpPage = new SeeDifferencePopUpPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS02_TC02_Audit Log - Verify the difference button in the details section  (Side by side) & (Line by Line).', async ({ page }) => {

    // [DISABLED] Login to CORR Portal
    // await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    // [DISABLED] Click on Administration_Menu
    // await correspondentPortalPage.Administration_Menu.click();
    // [DISABLED] Click on GeneralSettings_Menu
    // await correspondentPortalPage.GeneralSettings_Menu.click();
    // [DISABLED] Wait until the element Spinner is not visible
    // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await generalSettingPage.Audit_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(generalSettingPage.Created_Date_Time_Column_Data).toContainText(vars["ExpectedTimeAudit"]);
    await expect(generalSettingPage.First_User_Name_UI).toContainText("testsigma_internal\t\r");
    await expect(generalSettingPage.Config_Type_Column_Data).toContainText("Global Restrictions Config");
    await correspondentPortalPage.See_the_difference_Button.click();
    await correspondentPortalPage.Side_by_side_Button.waitFor({ state: 'visible' });
    await expect(correspondentPortalPage.Side_by_side_Button).toBeVisible();
    await expect(correspondentPortalPage.Line_by_line_Button).toBeVisible();
    await expect(seeDifferencePopUpPage.Side_by_Side_Tables).toBeVisible();
    vars["SidebySideTablesCount"] = String(await seeDifferencePopUpPage.Side_by_Side_Tables.count());
    expect(String(vars["SidebySideTablesCount"])).toBe("2");
    await expect(auditLogPage.Standard_Previous_Datapop_up).toContainText(vars["StandardPreviousDataExp"]);
    await expect(auditLogPage.Chase_Previous_Data_pop_up).toContainText(vars["ChasePreviousDataExp"]);
    await expect(seeDifferencePopUpPage.Standard_previous_datapop_up_sub_text).toHaveCSS('border', "rgba(255, 182, 186, 1)");
    await expect(seeDifferencePopUpPage.Chase_Previous_Datapop_up_sub_text).toHaveCSS('border', "rgba(255, 182, 186, 1)");
    await expect(seeDifferencePopUpPage.Chase_New_Datapop_up_sub_text).toContainText(vars["ChaseNewDataExp"]);
    await expect(seeDifferencePopUpPage.Standard_New_Datapop_up_sub_text).toContainText(vars["StandardNewDataExp"]);
    await expect(seeDifferencePopUpPage.Standard_New_Datapop_up_sub_text).toHaveCSS('border', "rgba(151, 242, 149, 1)");
    await expect(seeDifferencePopUpPage.Chase_New_Datapop_up_sub_text).toHaveCSS('border', "rgba(151, 242, 149, 1)");
    await correspondentPortalPage.Line_by_line_Button.click();
    await correspondentPortalPage.Side_by_side_Button.waitFor({ state: 'visible' });
    await expect(correspondentPortalPage.Line_by_line_Button).toBeVisible();
    await seeDifferencePopUpPage.Line_by_line_Table.waitFor({ state: 'visible' });
    vars["LineByLineTableCount"] = String(await seeDifferencePopUpPage.Line_by_line_Table.count());
    expect(String(vars["LineByLineTableCount"])).toBe("1");
    await stepGroups.stepGroup_Verification_of_see_difference_pop_up_data(page, vars);
    await correspondentPortalPage.close_pop_up_bid_request_details.click();
  });
});
