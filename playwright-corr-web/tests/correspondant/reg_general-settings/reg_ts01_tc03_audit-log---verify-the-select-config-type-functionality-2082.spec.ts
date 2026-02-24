// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS01_TC03_Audit log - Verify the select config type functionality', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["FirstConfigOptionList"] = await generalSettingPage.Config_Type_Column_Data.textContent() || '';
    vars["FirstConfigOptionList"] = String(vars["FirstConfigOptionList"]).substring(1, String(vars["FirstConfigOptionList"]).length - 1);
    await generalSettingPage.Select_Config_Type_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["SelectedConfig"] = vars["FirstConfigOptionList"];
    await correspondentPortalPage.Search_Text_Field.fill(vars["SelectedConfig"]);
    await page.keyboard.press('Enter');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await generalSettingPage.First_Option_Config_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Change_Page_Size_Dropdown.click();
    await correspondentPortalPage.Set_page_size_to_50_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    for (let i = 0; i < await generalSettingPage.Config_Type_Column_Data.count(); i++) {
      await expect(generalSettingPage.Config_Type_Column_Data.nth(i)).toHaveText(String(vars["SelectedConfig"]));
    }
    if (true) /* Element Go to Next Page Button is enabled */ {
      await correspondentPortalPage.Go_to_Next_Page_Button_2.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      for (let i = 0; i < await generalSettingPage.Config_Type_Column_Data.count(); i++) {
        await expect(generalSettingPage.Config_Type_Column_Data.nth(i)).toHaveText(String(vars["SelectedConfig"]));
      }
      await generalSettingPage.Go_to_Previous_Page_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    }
    vars["CreatedColumnDataWithSearch"] = (await generalSettingPage.Created_Date_Time_Column_Data.allTextContents()).join(', ');
    await generalSettingPage.Select_Config_Type_Dropdown.click();
    await correspondentPortalPage.Show_All_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["CreatedColumnDataWithoutSearch"] = (await generalSettingPage.Created_Date_Time_Column_Data.allTextContents()).join(', ');
    expect(String(vars["CreatedColumnDataWithoutSearch"])).toBe(vars["CreatedColumnDataWithSearch"]);
  });
});
