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

  test('REG_TS01_TC01_Audit log - Verify the search by username functionality', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["FirstUserNameList"] = await generalSettingPage.First_User_Name_UI.textContent() || '';
    vars["FirstUserNameList"] = String(vars["FirstUserNameList"]).trim();
    await correspondentPortalPage.Search_Username_Input.fill(vars["FirstUserNameList"]);
    vars["SearchedUserName"] = vars["FirstUserNameList"];
    await page.keyboard.press('Enter');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Change_Page_Size_Dropdown.click();
    await correspondentPortalPage.Set_page_size_to_50_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    for (let i = 0; i < await generalSettingPage.First_User_Name_UI.count(); i++) {
      await expect(generalSettingPage.First_User_Name_UI.nth(i)).toHaveText(String(vars["SearchedUserName"]));
    }
    if (true) /* Element Go to Next Page Button is enabled */ {
      await correspondentPortalPage.Go_to_Next_Page_Button_2.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      for (let i = 0; i < await generalSettingPage.First_User_Name_UI.count(); i++) {
        await expect(generalSettingPage.First_User_Name_UI.nth(i)).toHaveText(String(vars["SearchedUserName"]));
      }
      await generalSettingPage.Go_to_Previous_Page_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    }
    vars["CreatedColumnDataBeforeClear"] = (await generalSettingPage.Created_Date_Time_Column_Data.allTextContents()).join(', ');
    await generalSettingPage.Clear_buttonUsername_Search_Bar.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["CreatedColumnDataAfterClear"] = (await generalSettingPage.Created_Date_Time_Column_Data.allTextContents()).join(', ');
    expect(String(vars["CreatedColumnDataBeforeClear"])).toBe(vars["CreatedColumnDataAfterClear"]);
  });
});
