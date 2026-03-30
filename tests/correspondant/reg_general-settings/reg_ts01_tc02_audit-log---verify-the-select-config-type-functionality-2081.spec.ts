import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'REG_TS01_TC02';
const TC_TITLE = 'Audit log - Verify the select config type functionality';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let spinnerPage: SpinnerPage;
  const crederntials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    spinnerPage = new SpinnerPage(page);
    vars["Username"] = crederntials.username;
    vars["Password"] = crederntials.password;
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Logging in to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Successfully logged in to Correspondent Portal');
      } catch (e) {
        await log.stepFail(page, 'Failed to log in to Correspondent Portal');
        throw e;
      }

      log.step('Navigating to Administration > General Settings');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Successfully navigated to General Settings page');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to General Settings');
        throw e;
      }

      log.step('Opening Config Type dropdown and capturing initial options count and first option');
      try {
        await generalSettingPage.Select_Config_Type_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["OptionsCountBeforeSearch"] = String(await generalSettingPage.Options_CountConfig_Drpdwn.count());
        vars["FirstConfigOptionDrpdwn"] = await generalSettingPage.First_Option_Config_Dropdown.first().textContent() || '';
        vars["FirstConfigOptionDrpdwn"] = String(vars["FirstConfigOptionDrpdwn"]).trim();
        vars["CharCount"] = String(vars["FirstConfigOptionDrpdwn"]).length.toString();
        vars["CharCount"] = (parseFloat(String(vars["CharCount"])) - parseFloat(String("3"))).toFixed(0);
        vars["IndexCount"] = String("0") + "," + String(vars["CharCount"]);
        vars["ConfigOption3Dig"] = String(vars["FirstConfigOptionDrpdwn"]).substring(0);
        log.info('OptionsCountBeforeSearch: ' + vars["OptionsCountBeforeSearch"]);
        log.info('FirstConfigOptionDrpdwn: ' + vars["FirstConfigOptionDrpdwn"]);
        log.info('ConfigOption3Dig (search term): ' + vars["ConfigOption3Dig"]);
        log.stepPass('Config Type dropdown opened and initial data captured');
      } catch (e) {
        await log.stepFail(page, 'Failed to open Config Type dropdown or capture initial data');
        throw e;
      }

      log.step('Searching by config option text and verifying filtered results');
      try {
        await correspondentPortalPage.Search_Text_Field.fill(vars["ConfigOption3Dig"]);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["FirstConfigOptionAfterSearch"] = await generalSettingPage.First_Config_Option_After_SearchDrpdwn.textContent() || '';

        expect(String(vars["FirstConfigOptionAfterSearch"])).toBe(vars["ConfigOption3Dig"]);
        log.info('FirstConfigOptionAfterSearch: ' + vars["FirstConfigOptionAfterSearch"]);
        log.info('Expected to match ConfigOption3Dig: ' + vars["ConfigOption3Dig"]);

        vars["OptionsCountAfterSearch"] = String(await generalSettingPage.Options_CountConfig_Drpdwn.count());
        expect(String(vars["OptionsCountAfterSearch"])).not.toBe(vars["OptionsCountBeforeSearch"]);
        log.info('OptionsCountAfterSearch: ' + vars["OptionsCountAfterSearch"]);
        log.info('OptionsCountBeforeSearch: ' + vars["OptionsCountBeforeSearch"]);
        log.stepPass('Search results verified — first option matches search term and options count reduced');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify filtered results after config type search');
        throw e;
      }

      log.step('Clearing search and verifying options count is restored to original');
      try {
        await generalSettingPage.Clear_Search_ButtonConfig_Drpdwn.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["OptionsCountAfterClearSearch"] = String(await generalSettingPage.Options_CountConfig_Drpdwn.count());

        expect(String(vars["OptionsCountAfterClearSearch"])).toBe(vars["OptionsCountBeforeSearch"]);
        log.info('OptionsCountAfterClearSearch: ' + vars["OptionsCountAfterClearSearch"]);
        log.info('OptionsCountBeforeSearch: ' + vars["OptionsCountBeforeSearch"]);
        log.stepPass('Options count restored to original after clearing search — clear functionality verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify options count after clearing search');
        throw e;
      }

      log.tcEnd('PASS');
    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});