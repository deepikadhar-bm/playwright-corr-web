// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CompanyConfigPage } from '../../../src/pages/correspondant/company-config';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let companyConfigPage: CompanyConfigPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let okButtonPage: OkButtonPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    companyConfigPage = new CompanyConfigPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    okButtonPage = new OkButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS15_TC02_Company Config - Verify by changing the timezone.and verified the last Modified date, time and user data', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Reports_Dropdown.click();
    await correspondentPortalPage.Bid_Requests_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["UploadedTimeBeforeEdit"] = await correspondentPortalPage.Uploaded_Time.textContent() || '';
    vars["UploadedTimeBeforeEdit"] = String(vars["UploadedTimeBeforeEdit"]).trim();
    vars[""] = (() => {
      const d = new Date('2000-01-01 ' + String(''));
      d.setMinutes(d.getMinutes() - parseInt(String('')));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    })();
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await correspondentPortalPage.Company_ConfigGenral_settings.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Toggle_dropdown_Dropdown.click();
    // [DISABLED] Store text from the element Company Name Input(Company Config) into a variable CompanyBeforeEdit
    // vars["CompanyBeforeEdit"] = await companyConfigPage.Company_Name_InputCompany_Config.textContent() || '';
    await generalSettingPage.Time_Zone_OptionLosAngeles.scrollIntoViewIfNeeded();
    await generalSettingPage.Time_Zone_OptionLosAngeles.click();
    await expect(correspondentPortalPage.Toggle_dropdown_Dropdown).toContainText("America/Los_Angeles");
    await correspondentPortalPage.Save_Settings.waitFor({ state: 'visible' });
    await correspondentPortalPage.Save_Settings.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await okButtonPage.Ok_Button.click();
    await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
    // [DISABLED] Store text from the element Internal User Username Replacement Input into a variable InternalUserNameBeforeEdit
    // vars["InternalUserNameBeforeEdit"] = await correspondentPortalPage.Internal_User_Username_Replacement_Input.textContent() || '';
    await correspondentPortalPage.Reports_Dropdown.click();
    await correspondentPortalPage.Bid_Requests_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["UploadedTimeAfterEdit"] = await correspondentPortalPage.Uploaded_Time.textContent() || '';
    vars["ActualUploadedTime"] = String(vars["UploadedTimeAfterEdit"]).trim();
    expect(String(vars["ExpectedUploadedTime"])).toBe(vars["ActualUploadedTime"]);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await correspondentPortalPage.Company_ConfigGenral_settings.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Toggle_dropdown_Dropdown.click();
    await correspondentPortalPage.Time_Zone_OptionAmericaNew_York.scrollIntoViewIfNeeded();
    await correspondentPortalPage.Time_Zone_OptionAmericaNew_York.click();
    await expect(correspondentPortalPage.Toggle_dropdown_Dropdown).toContainText("America/New_York");
    await correspondentPortalPage.Save_Settings.waitFor({ state: 'visible' });
    await correspondentPortalPage.Save_Settings.click();
  });
});
