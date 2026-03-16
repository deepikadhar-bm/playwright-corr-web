// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CompanyConfigPage } from '../../../src/pages/correspondant/company-config';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Unassigned', () => {
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

  test('2394_e438cc480b0249e5a5bbaa24f64d8aad_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      await correspondentPortalPage.Administration_Menu.click();
      await correspondentPortalPage.GeneralSettings_Menu.click();
      await correspondentPortalPage.Company_ConfigGenral_settings.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await companyConfigPage.Company_Name_InputCompany_Config.fill(String(vars["CompanyNameBeforeEdit"]));
      if (true) /* Element Save Settings is enabled */ {
        await correspondentPortalPage.Save_Settings.click();
        await page.getByText("Company config updated successfully!").waitFor({ state: 'visible' });
        await okButtonPage.Ok_Button.waitFor({ state: 'visible' });
        await okButtonPage.Ok_Button.click();
      }
    }
  });
});
