// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EmailConfigPage } from '../../../src/pages/correspondant/email-config';
import { GeneralSettingsPage } from '../../../src/pages/correspondant/general-settings';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let emailConfigPage: EmailConfigPage;
  let generalSettingsPage: GeneralSettingsPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    emailConfigPage = new EmailConfigPage(page);
    generalSettingsPage = new GeneralSettingsPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS20_TC02_Email Configuration - Verfiy the edit Functionality and once the data is updated, accordingly values should be reflected in the UI and last modified value should get updated', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await correspondentPortalPage.Email_Configuration.click();
    await correspondentPortalPage.Add_Email_Button.click();
    await page.getByText("Add Internal Recipient").waitFor({ state: 'visible' });
    await correspondentPortalPage.Email_Id_Input.fill("testsigma@sysla.com");
    vars["ExpectedEmail"] = "testsigma@sysla.com";
    await correspondentPortalPage.Save_ButtonEmail_Config.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Close_Buttonemail_config.click();
    // [DISABLED] Verify that the current page displays an element Last Email Record and With Scrollable FALSE
    // await expect(emailConfigPage.Last_Email_Record).toBeVisible();
    await expect(emailConfigPage.Last_Email_Record).toContainText("testsigma@sysla.com");
    await generalSettingsPage.Last_Edit_Button_Email_Config.click();
    await correspondentPortalPage.Email_Id_Input.fill(String("testsigma@syslatech.com"));
    // [DISABLED] Enter testsigma@syslatech.com in the Email Id Input field
    // await correspondentPortalPage.Email_Id_Input.fill("testsigma@syslatech.com");
    vars["ExpectedEmail"] = "testsigma@syslatech.com";
    await correspondentPortalPage.Save_ButtonEmail_Config.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Close_Buttonemail_config.click();
    await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
    await emailConfigPage.Required_Delete_Email_Button.click();
    await emailConfigPage.Yes_Go_ahead_Button.waitFor({ state: 'visible' });
    await emailConfigPage.Yes_Go_ahead_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Close_Buttonemail_config.click();
    // [DISABLED] Verifying the Last Modified Data In the Right corner screen
    // await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
  });
});
