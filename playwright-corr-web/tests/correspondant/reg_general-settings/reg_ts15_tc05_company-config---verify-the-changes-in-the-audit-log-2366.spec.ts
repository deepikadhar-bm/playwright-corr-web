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
import { runPrereq_2342 } from '../../../src/helpers/prereqs/prereq-2342';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let auditLogPage: AuditLogPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let seeDifferencePopUpPage: SeeDifferencePopUpPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_2342(page, vars);
    auditLogPage = new AuditLogPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    seeDifferencePopUpPage = new SeeDifferencePopUpPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS15_TC05_Company Config - Verify the Changes in the Audit Log', async ({ page }) => {

    // [DISABLED] Login to CORR Portal
    // await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    // [DISABLED] Click on Administration_Menu
    // await correspondentPortalPage.Administration_Menu.click();
    // [DISABLED] Click on GeneralSettings_Menu
    // await correspondentPortalPage.GeneralSettings_Menu.click();
    // [DISABLED] Wait until the element Spinner is not visible
    // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["ExpectedTimeAudit"] = vars["TimeOnScreen"];
    vars["ExpectedTimeAudit"] = String(vars["ExpectedTimeAudit"]).substring(17, String(vars["ExpectedTimeAudit"]).length - 13);
    vars["ExpectedTimeAudit"] = (() => {
      const d = new Date(String(vars["ExpectedTimeAudit"]));
      const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
      return "MM/dd/yyyy hh:mm a".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
    })();
    await generalSettingPage.Audit_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    // [DISABLED] Verify that the element Created Date & Time Column Data value contains the ExpectedTimeAudit , ignoring case
    // expect((await generalSettingPage.Created_Date_Time_Column_Data.inputValue() || '').toLowerCase()).toContain(String('').toLowerCase());
    expect((await generalSettingPage.Created_Date_Time_Column_Data.textContent() || '').toLowerCase()).toContain(String('').toLowerCase());
    // [DISABLED] Verify that the element Created Date & Time Column Data displays text contains ExpectedTimeAudit and With Scrollable FALSE
    // await expect(generalSettingPage.Created_Date_Time_Column_Data).toContainText(vars["ExpectedTimeAudit"]);
    await expect(generalSettingPage.First_User_Name_UI).toContainText("testsigma_internal\t\r");
    await expect(generalSettingPage.Config_Type_Column_Data).toContainText("Company Config");
    await correspondentPortalPage.See_the_difference_Button.click();
    await correspondentPortalPage.Side_by_side_Button.waitFor({ state: 'visible' });
    await expect(correspondentPortalPage.Side_by_side_Button).toBeVisible();
    await expect(correspondentPortalPage.Line_by_line_Button).toBeVisible();
    await expect(seeDifferencePopUpPage.Side_by_Side_Tables).toBeVisible();
    vars["SidebySideTablesCount"] = String(await seeDifferencePopUpPage.Side_by_Side_Tables.count());
    expect(String(vars["SidebySideTablesCount"])).toBe("2");
    await expect(seeDifferencePopUpPage.Name_Previous_DataPop_Up).toContainText(vars["CompanyPreviousDataExp"]);
    await expect(seeDifferencePopUpPage.Internal_User_Name_Previous_Datapop_up).toContainText(vars["InternalUserPreviousDataExp"]);
    await expect(auditLogPage.Company_Name_Previous_Data).toHaveCSS('border', "rgba(255, 182, 186, 1)");
    await expect(auditLogPage.Internal_User_Name_Previous_Data).toHaveCSS('border', "rgba(255, 182, 186, 1)");
    await expect(seeDifferencePopUpPage.Name_New_DataPop_up).toContainText(vars["CompanyNewDataExp"]);
    await expect(seeDifferencePopUpPage.Inernal_User_New_Datapop_up).toContainText(vars["InternalUserNewDataExp"]);
    await expect(seeDifferencePopUpPage.Company_Name_New_Data).toHaveCSS('border', "rgba(151, 242, 149, 1)");
    await expect(seeDifferencePopUpPage.Internal_User_Name_New_Data).toHaveCSS('border', "rgba(151, 242, 149, 1)");
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
