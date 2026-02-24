// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { CustomerPermissionPage } from '../../../src/pages/correspondant/customer-permission';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let customerPermissionPage: CustomerPermissionPage;
  let generalSettingPage: GeneralSettingPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    customerPermissionPage = new CustomerPermissionPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test('REG_TS03_TC02_Customer Permission - Verify the search by Company name functionality', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await customerPermissionPage.CustomerPermission_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await customerPermissionPage.Search_Filter_Input.fill("Freedom");
    await page.keyboard.press('Enter');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["FirstCompanyName"] = await generalSettingPage.First_Company_Namecustomer_permission.textContent() || '';
    // [DISABLED] Split string FirstCompanyName using - and store the 1 into a ExpectedCCode
    // vars["ExpectedCCode"] = String('').split("-")["1"] || '';
    // [DISABLED] Split the FirstCompanyName with the - and store the value from the 2 in the ExpectedCCode
    // vars["ExpectedCCode"] = String(vars["FirstCompanyName"]).split("-")["2"] || '';
    // [DISABLED] Trim white space from ExpectedCCode and store it in a runtime ExpectedCCode
    // vars["ExpectedCCode"] = String(vars["ExpectedCCode"]).trim();
    vars["FirstCompanyName"] = String(vars["FirstCompanyName"]).substring(1, String(vars["FirstCompanyName"]).length - 1);
    await customerPermissionPage.Search_Filter_Input.fill(String(vars["FirstCompanyName"]));
    // [DISABLED] Enter ExpectedCCode in the Search Filter Input field
    // await customerPermissionPage.Search_Filter_Input.fill(vars["ExpectedCCode"]);
    await page.keyboard.press('Enter');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["ExpectedCompanyName"] = vars["FirstCompanyName"];
    await expect(statusInactivePage.Company_Names).toContainText(vars["ExpectedCompanyName"]);
    vars["RowsCountBeforeClear"] = String(await priceOfferedPage.RowCount.count());
    expect(String(vars["RowsCountBeforeClear"])).toBe("1");
    await generalSettingPage.Clear_buttonUsername_Search_Bar.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["RowsCountAfterClear"] = String(await priceOfferedPage.RowCount.count());
    expect(String(vars["RowsCountAfterClear"])).toBe("1");
  });
});
