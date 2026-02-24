// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ActionsPage } from '../../../src/pages/correspondant/actions';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { CustomerPermissionPage } from '../../../src/pages/correspondant/customer-permission';
import { EditPermissionsPage } from '../../../src/pages/correspondant/edit-permissions';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let actionsPage: ActionsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let customerPermissionPage: CustomerPermissionPage;
  let editPermissionsPage: EditPermissionsPage;
  let generalSettingPage: GeneralSettingPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    actionsPage = new ActionsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    customerPermissionPage = new CustomerPermissionPage(page);
    editPermissionsPage = new EditPermissionsPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test('REG_TS03_TC03_Customer Permission - Verify the edit permission action.', async ({ page }) => {
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
    await customerPermissionPage.Edit_Permission_Buttonfirst_record.click();
    await editPermissionsPage.Standard_Off_Radio_button.waitFor({ state: 'visible' });
    await stepGroups.stepGroup_Toggle_Radio_Button_Based_on_Current_State(page, vars);
    await customerPermissionPage.Search_Filter_Input.fill(String("Freedom"));
    // [DISABLED] Enter Freedom in the Search Filter Input field
    // await customerPermissionPage.Search_Filter_Input.fill("Freedom");
    await page.keyboard.press('Enter');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(customerPermissionPage.Standard_State_First_Record).toContainText(vars["ExpectedStandardState"]);
    await expect(customerPermissionPage.Chase_StateFirst_Record).toContainText(vars["ExpectedChaseState"]);
    await customerPermissionPage.Edit_Permission_Buttonfirst_record.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    if (String(vars["PreviousStandardState"]) === String("Disabled")) {
      await editPermissionsPage.Standard_Off_Radio_button.check();
    } else {
      await generalSettingPage.Standard_On_RadioGlobal_Restriction.check();
    }
    if (String(vars["PreviousChaseState"]) === String("Allowed")) {
      await generalSettingPage.Chase_On_RadioGlobal_Restriction.check();
    } else {
      await generalSettingPage.Chase_Off_RadioGlobal_Restrictions.check();
    }
    await actionsPage.Update_Permissions_Button.waitFor({ state: 'visible' });
    await actionsPage.Update_Permissions_Button.click();
    vars["CurrentLocalTime"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
      const fmt = "M/d/yyyy : h:mm a";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    // [DISABLED] Verify that the element Company Name in Customer Permission displays text contains ExpectedCompanyName and With Scrollable FALSE
    // await expect(statusInactivePage.Company_Names).toContainText(vars["ExpectedCompanyName"]);
    // [DISABLED] Store the count of elements identified by locator Total Rows Count into a variable RowsCountBeforeClear
    // vars["RowsCountBeforeClear"] = String(await priceOfferedPage.RowCount.count());
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(customerPermissionPage.Chase_StateFirst_Record).toContainText(vars["PreviousChaseState"]);
    await expect(customerPermissionPage.Standard_State_First_Record).toContainText(vars["PreviousStandardState"]);
    // [DISABLED] Verify if RowsCountBeforeClear == 1
    // expect(String(vars["RowsCountBeforeClear"])).toBe("1");
    // [DISABLED] Click on Clear search button(customer permissions)
    // await generalSettingPage.Clear_buttonUsername_Search_Bar.click();
    // [DISABLED] Wait until the element Spinner is not visible
    // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    // [DISABLED] Store the count of elements identified by locator Total Rows Count into a variable RowsCountAfterClear
    // vars["RowsCountAfterClear"] = String(await priceOfferedPage.RowCount.count());
    // [DISABLED] Verify if RowsCountAfterClear > 1
    // expect(String(vars["RowsCountAfterClear"])).toBe("1");
  });
});
