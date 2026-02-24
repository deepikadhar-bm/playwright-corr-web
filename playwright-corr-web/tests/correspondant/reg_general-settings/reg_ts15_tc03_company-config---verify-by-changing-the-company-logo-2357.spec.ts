// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let okButtonPage: OkButtonPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    okButtonPage = new OkButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS15_TC03_Company Config - Verify by changing the Company Logo', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await correspondentPortalPage.Company_ConfigGenral_settings.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.upload_Company_Config.click();
    await correspondentPortalPage.upload_Company_Config.setInputFiles(path.resolve(__dirname, 'test-data', "Newlogo.png"));
    await correspondentPortalPage.Save_Settings.waitFor({ state: 'visible' });
    await correspondentPortalPage.Save_Settings.click();
    await page.getByText("Company config updated successfully!").waitFor({ state: 'visible' });
    await okButtonPage.Ok_Button.click();
    await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
    await correspondentPortalPage.upload_Company_Config.setInputFiles(path.resolve(__dirname, 'test-data', "logo.png"));
    await correspondentPortalPage.Save_Settings.waitFor({ state: 'visible' });
    await correspondentPortalPage.Save_Settings.click();
    await page.getByText("Company config updated successfully!").waitFor({ state: 'visible' });
    await okButtonPage.Ok_Button.click();
  });
});
