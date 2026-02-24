// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CompanyConfigPage } from '../../../src/pages/correspondant/company-config';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let companyConfigPage: CompanyConfigPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let okButtonPage: OkButtonPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    companyConfigPage = new CompanyConfigPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    okButtonPage = new OkButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS15_TC01_Company Config - Verify the User can add/ edit  the Values in the Inputs. ', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await correspondentPortalPage.Company_ConfigGenral_settings.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await companyConfigPage.Company_Name_InputCompany_Config.click();
    // [DISABLED] Store text from the element Company Name Input(Company Config) into a variable CompanyBeforeEdit
    // vars["CompanyBeforeEdit"] = await companyConfigPage.Company_Name_InputCompany_Config.textContent() || '';
    vars["CompanyBeforeEdit"] = await companyConfigPage.Company_Name_InputCompany_Config.inputValue() || '';
    await companyConfigPage.Company_Name_InputCompany_Config.fill(String("Company_Testing"));
    vars["CompanyPreviousDataExp"] = "Company_Testing";
    await correspondentPortalPage.Save_Settings.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await okButtonPage.Ok_Button.click();
    await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
    vars["InternalUserNameBeforeEdit"] = await correspondentPortalPage.Internal_User_Username_Replacement_Input.inputValue() || '';
    // [DISABLED] Store text from the element Internal User Username Replacement Input into a variable InternalUserNameBeforeEdit
    // vars["InternalUserNameBeforeEdit"] = await correspondentPortalPage.Internal_User_Username_Replacement_Input.textContent() || '';
    await correspondentPortalPage.Internal_User_Username_Replacement_Input.fill(String("InternalUser_Testing"));
    vars["InternalUserPreviousDataExp"] = "InternalUser_Testing";
    await correspondentPortalPage.Save_Settings.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await okButtonPage.Ok_Button.click();
    await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
    await companyConfigPage.Company_Name_InputCompany_Config.fill(String(vars["CompanyBeforeEdit"]));
    vars["CompanyNewDataExp"] = vars["CompanyBeforeEdit"];
    await correspondentPortalPage.Internal_User_Username_Replacement_Input.fill(String(vars["InternalUserNameBeforeEdit"]));
    vars["InternalUserNewDataExp"] = vars["InternalUserNameBeforeEdit"];
    await correspondentPortalPage.Save_Settings.waitFor({ state: 'visible' });
    await correspondentPortalPage.Save_Settings.click();
    await page.getByText("Company config updated successfully!").waitFor({ state: 'visible' });
    await okButtonPage.Ok_Button.click();
  });
});
