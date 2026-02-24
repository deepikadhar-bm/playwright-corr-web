// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EmailConfigPage } from '../../../src/pages/correspondant/email-config';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { SeeDifferencePopUpPage } from '../../../src/pages/correspondant/see-difference-pop-up';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let emailConfigPage: EmailConfigPage;
  let generalSettingPage: GeneralSettingPage;
  let seeDifferencePopUpPage: SeeDifferencePopUpPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    emailConfigPage = new EmailConfigPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    seeDifferencePopUpPage = new SeeDifferencePopUpPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS20_TC04_Audit - Verify the Audit log info after performing Add / Edit / Delete actions then accordingly the logs should be reflected in Audit logs', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await correspondentPortalPage.Email_Configuration.click();
    await correspondentPortalPage.Add_Email_Button.waitFor({ state: 'visible' });
    await correspondentPortalPage.Add_Email_Button.click();
    await page.getByText("Add Internal Recipient").waitFor({ state: 'visible' });
    await correspondentPortalPage.Email_Id_Input.fill("testsigma2@gmail.com");
    vars["ExpectedEmail"] = "testsigma2@gmail.com";
    await correspondentPortalPage.Save_ButtonEmail_Config.click();
    vars["ExpectedTimeAudit"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
      const fmt = "MM/dd/yyyy hh:mm a";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Close_Buttonemail_config.click();
    await expect(emailConfigPage.Last_Email_Record).toContainText(vars["ExpectedEmail"]);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await generalSettingPage.Audit_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(generalSettingPage.Created_Date_Time_Column_Data).toContainText(vars["ExpectedTimeAudit"]);
    await expect(generalSettingPage.First_User_Name_UI).toContainText("testsigma_internal\t\r");
    await expect(generalSettingPage.Config_Type_Column_Data).toContainText("Email Config");
    await correspondentPortalPage.See_the_difference_Button.click();
    await correspondentPortalPage.Side_by_side_Button.waitFor({ state: 'visible' });
    await expect(correspondentPortalPage.Side_by_side_Button).toBeVisible();
    await expect(correspondentPortalPage.Line_by_line_Button).toBeVisible();
    await expect(seeDifferencePopUpPage.Side_by_Side_Tables).toBeVisible();
    vars["SidebySideTablesCount"] = String(await seeDifferencePopUpPage.Side_by_Side_Tables.count());
    expect(String(vars["SidebySideTablesCount"])).toBe("2");
    await expect(seeDifferencePopUpPage.Side_by_Side_New_Data_TableSee_Difference).toContainText(vars["ExpectedEmail"]);
    await expect(seeDifferencePopUpPage.Previous_data_empty_email_field).toBeVisible();
    await correspondentPortalPage.Line_by_line_Button.click();
    await correspondentPortalPage.Side_by_side_Button.waitFor({ state: 'visible' });
    await expect(correspondentPortalPage.Line_by_line_Button).toBeVisible();
    await seeDifferencePopUpPage.Line_by_line_Table.waitFor({ state: 'visible' });
    vars["LineByLineTableCount"] = String(await seeDifferencePopUpPage.Line_by_line_Table.count());
    expect(String(vars["LineByLineTableCount"])).toBe("1");
    await expect(seeDifferencePopUpPage.Email_New_Data_Line_by_line).toContainText(vars["ExpectedEmail"]);
    // [DISABLED] Verification of see difference pop up data
    // await stepGroups.stepGroup_Verification_of_see_difference_pop_up_data(page, vars);
    await correspondentPortalPage.close_pop_up_bid_request_details.click();
    await correspondentPortalPage.Email_Configuration.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Deleting_added_email_from_email_config(page, vars);
  });
});
