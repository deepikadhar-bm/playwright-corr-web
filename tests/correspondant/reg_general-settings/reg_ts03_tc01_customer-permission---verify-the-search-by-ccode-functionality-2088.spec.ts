// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CcodePage } from '../../../src/pages/correspondant/ccode';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { CustomerPermissionPage } from '../../../src/pages/correspondant/customer-permission';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let ccodePage: CcodePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let customerPermissionPage: CustomerPermissionPage;
  let generalSettingPage: GeneralSettingPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    ccodePage = new CcodePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    customerPermissionPage = new CustomerPermissionPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS03_TC01_Customer Permission - Verify the search by CCode functionality', async ({ page }) => {
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
    vars["ExpectedCCode"] = String(vars["FirstCompanyName"]).split("-")["2"] || '';
    vars["ExpectedCCode"] = String(vars["ExpectedCCode"]).trim();
    await customerPermissionPage.Search_Filter_Input.fill(String(vars["ExpectedCCode"]));
    // [DISABLED] Enter ExpectedCCode in the Search Filter Input field
    // await customerPermissionPage.Search_Filter_Input.fill(vars["ExpectedCCode"]);
    await page.keyboard.press('Enter');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(ccodePage.CCode).toContainText(vars["ExpectedCCode"]);
    vars["RowsCountBeforeClear"] = String(await priceOfferedPage.RowCount.count());
    expect(String(vars["RowsCountBeforeClear"])).toBe("1");
    await generalSettingPage.Clear_buttonUsername_Search_Bar.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["RowsCountAfterClear"] = String(await priceOfferedPage.RowCount.count());
    expect(String(vars["RowsCountAfterClear"])).toBe("1");
  });
});
