// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CompanyConfigPage } from '../../../src/pages/correspondant/company-config';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let companyConfigPage: CompanyConfigPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let okButtonPage: OkButtonPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    companyConfigPage = new CompanyConfigPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    okButtonPage = new OkButtonPage(page);
  });

  test('2357_6c42bfa8f9b442cfb3941e9029082192_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      // [DISABLED] Clear the existing text from Company Name Input(Company Config) and enter CompanyBeforeEdit
      // await companyConfigPage.Company_Name_InputCompany_Config.fill(String(vars["CompanyBeforeEdit"]));
      // [DISABLED] Clear the existing text from Internal User Username Replacement Input and enter InternalUserNameBeforeEdit
      // await correspondentPortalPage.Internal_User_Username_Replacement_Input.fill(String(vars["InternalUserNameBeforeEdit"]));
      await correspondentPortalPage.upload_Company_Config.setInputFiles(path.resolve(__dirname, 'test-data', "logo.png"));
      if (true) /* Element Save Settings is enabled */ {
        await correspondentPortalPage.Save_Settings.click();
        await page.getByText("Company config updated successfully!").waitFor({ state: 'visible' });
        await okButtonPage.Ok_Button.waitFor({ state: 'visible' });
        await okButtonPage.Ok_Button.click();
      }
    }
  });
});
