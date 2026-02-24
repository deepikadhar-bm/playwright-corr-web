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

  test('REG_TS01_TC02_Audit log - Verify the select config type functionality', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await generalSettingPage.Select_Config_Type_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["OptionsCountBeforeSearch"] = String(await generalSettingPage.Options_CountConfig_Drpdwn.count());
    vars["FirstConfigOptionDrpdwn"] = await generalSettingPage.First_Option_Config_Dropdown.textContent() || '';
    vars["FirstConfigOptionDrpdwn"] = String(vars["FirstConfigOptionDrpdwn"]).trim();
    vars[""] = String('').length.toString();
    vars["CharCount"] = (parseFloat(String(vars["CharCount"])) - parseFloat(String("3"))).toFixed(0);
    vars["IndexCount"] = String("0") + "," + String(vars["CharCount"]);
    vars["ConfigOption3Dig"] = String(vars["FirstConfigOptionDrpdwn"]).substring(0);
    await correspondentPortalPage.Search_Text_Field.fill(vars["ConfigOption3Dig"]);
    await page.keyboard.press('Enter');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["FirstConfigOptionAfterSearch"] = await generalSettingPage.First_Config_Option_After_SearchDrpdwn.textContent() || '';
    expect(String(vars["FirstConfigOptionAfterSearch"])).toBe(vars["ConfigOption3Dig"]);
    vars["OptionsCountAfterSearch"] = String(await generalSettingPage.Options_CountConfig_Drpdwn.count());
    expect(String(vars["OptionsCountAfterSearch"])).toBe(vars["OptionsCountBeforeSearch"]);
    await generalSettingPage.Clear_Search_ButtonConfig_Drpdwn.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["OptionsCountAfterClearSearch"] = String(await generalSettingPage.Options_CountConfig_Drpdwn.count());
    expect(String(vars["OptionsCountAfterClearSearch"])).toBe(vars["OptionsCountBeforeSearch"]);
  });
});
