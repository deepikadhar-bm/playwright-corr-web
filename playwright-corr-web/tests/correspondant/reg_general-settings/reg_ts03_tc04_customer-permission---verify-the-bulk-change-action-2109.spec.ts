// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { CustomerPermissionPage } from '../../../src/pages/correspondant/customer-permission';
import { EditPermissionsPage } from '../../../src/pages/correspondant/edit-permissions';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { GeneralSettingsPage } from '../../../src/pages/correspondant/general-settings';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let customerPermissionPage: CustomerPermissionPage;
  let editPermissionsPage: EditPermissionsPage;
  let generalSettingPage: GeneralSettingPage;
  let generalSettingsPage: GeneralSettingsPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    customerPermissionPage = new CustomerPermissionPage(page);
    editPermissionsPage = new EditPermissionsPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    generalSettingsPage = new GeneralSettingsPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test('REG_TS03_TC04_Customer Permission - Verify the bulk change action.', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await customerPermissionPage.CustomerPermission_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await generalSettingsPage.Company_Check_box1customer_permissions.check();
    await expect(generalSettingsPage.Company_Check_box1customer_permissions).toBeVisible();
    vars["ExpectedCompanyName1"] = await customerPermissionPage.Company_Name1other_than_HomeSweet.textContent() || '';
    vars["PreviousStandardStateC1"] = await customerPermissionPage.Company_1_Standard_State.textContent() || '';
    vars["PreviousChaseStateC1"] = await customerPermissionPage.Company_1_Chase_State.textContent() || '';
    await generalSettingPage.Company_Check_Box_2customer_permissions.check();
    await expect(generalSettingPage.Company_Check_Box_2customer_permissions).toBeVisible();
    vars["ExpectedCompanyName2"] = await customerPermissionPage.Company_Name2Other_than_Home_Sweet.textContent() || '';
    vars["PreviousStandardStateC2"] = await customerPermissionPage.Company_2_Standard_State.textContent() || '';
    vars["PreviousChaseStateC2"] = await customerPermissionPage.Company_2_Chase_State.textContent() || '';
    await customerPermissionPage.Bulk_Change_Button.waitFor({ state: 'visible' });
    await customerPermissionPage.Bulk_Change_Button.click();
    await editPermissionsPage.Standard_Off_Radio_button.waitFor({ state: 'visible' });
    // [DISABLED] Verify that the element First Company(bulk change pop up) displays text contains ExpectedCompanyName1 and With Scrollable FALSE
    // await expect(customerPermissionPage.First_Companybulk_change_pop_up).toContainText(vars["ExpectedCompanyName1"]);
    vars["ActualFirstCompanyName"] = await customerPermissionPage.First_Companybulk_change_pop_up.textContent() || '';
    vars["ActualFirstCompanyName"] = String(vars["ActualFirstCompanyName"]).trim();
    vars["ExpectedNameC1"] = String(vars["ExpectedCompanyName1"]).trim();
    expect(String(vars["ActualFirstCompanyName"])).toBe(vars["ExpectedNameC1"]);
    vars["ActualSecondCompanyName"] = await customerPermissionPage.Second_Companybulk_change_popup.textContent() || '';
    vars["ActualSecondCompanyName"] = String(vars["ActualSecondCompanyName"]).trim();
    vars["ExpectedNameC2"] = String(vars["ExpectedCompanyName2"]).trim();
    expect(String(vars["ActualSecondCompanyName"])).toBe(vars["ExpectedNameC2"]);
    // [DISABLED] Verify that the element Second Company(bulk change popup) displays text contains ExpectedCompanyName2 and With Scrollable FALSE
    // await expect(customerPermissionPage.Second_Companybulk_change_popup).toContainText(vars["ExpectedCompanyName2"]);
    await stepGroups.stepGroup_Toggle_Radio_Button_Based_on_Current_State_and_Storing_the_U(page, vars);
    // [DISABLED] Split string FirstCompanyName using - and store the 1 into a ExpectedCCode
    // vars["ExpectedCCode"] = String('').split("-")["1"] || '';
    // [DISABLED] Split the FirstCompanyName with the - and store the value from the 2 in the ExpectedCCode
    // vars["ExpectedCCode"] = String(vars["FirstCompanyName"]).split("-")["2"] || '';
    // [DISABLED] Trim white space from ExpectedCCode and store it in a runtime ExpectedCCode
    // vars["ExpectedCCode"] = String(vars["ExpectedCCode"]).trim();
    await expect(customerPermissionPage.Company_1_Standard_State).toContainText(vars["ExpectedStandardState"]);
    await expect(customerPermissionPage.Company_1_Chase_State).toContainText(vars["ExpectedChaseState"]);
    await expect(customerPermissionPage.Company_2_Standard_State).toContainText(vars["ExpectedStandardState"]);
    await expect(customerPermissionPage.Company_2_Chase_State).toContainText(vars["ExpectedChaseState"]);
    // [DISABLED] Click on Edit Permissions Button(Company 1)
    // await customerPermissionPage.Edit_Permissions_ButtonCompany_1.click();
    await stepGroups.stepGroup_Toggling_the_Radio_Button_based_on_previous_state(page, vars);
    await stepGroups.stepGroup_Toggling_the_Radio_Button_based_on_previous_state(page, vars);
    // [DISABLED] Enter ExpectedCCode in the Search Filter Input field
    // await customerPermissionPage.Search_Filter_Input.fill(vars["ExpectedCCode"]);
    // [DISABLED] Enter Freedom in the Search Filter Input field
    // await customerPermissionPage.Search_Filter_Input.fill("Freedom");
    // [DISABLED] Verify that the element Company Name in Customer Permission displays text contains ExpectedCompanyName and With Scrollable FALSE
    // await expect(statusInactivePage.Company_Names).toContainText(vars["ExpectedCompanyName"]);
    // [DISABLED] Store the count of elements identified by locator Total Rows Count into a variable RowsCountBeforeClear
    // vars["RowsCountBeforeClear"] = String(await priceOfferedPage.RowCount.count());
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
