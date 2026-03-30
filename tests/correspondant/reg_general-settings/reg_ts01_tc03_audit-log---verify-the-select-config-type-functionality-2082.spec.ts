// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'REG_TS01_TC03';
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

      log.step('Navigating to Administration > General Settings and capturing first config option');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["FirstConfigOptionList"] = await generalSettingPage.Config_Type_Column_Data.first().textContent() || '';
        vars["FirstConfigOptionList"] = String(vars["FirstConfigOptionList"]).substring(1, String(vars["FirstConfigOptionList"]).length - 1);
        log.info('FirstConfigOptionList (trimmed): ' + vars["FirstConfigOptionList"]);
        log.stepPass('Navigated to General Settings and captured first config option');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to General Settings or capture first config option');
        throw e;
      }

      log.step('Opening Config Type dropdown, searching and selecting config option');
      try {
        await generalSettingPage.Select_Config_Type_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["SelectedConfig"] = vars["FirstConfigOptionList"];
        await correspondentPortalPage.Search_Text_Field.fill(vars["SelectedConfig"]);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await generalSettingPage.Selected_Config(vars["SelectedConfig"]).click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('SelectedConfig: ' + vars["SelectedConfig"]);
        log.stepPass('Config option selected from dropdown: ' + vars["SelectedConfig"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to search or select config option from dropdown');
        throw e;
      }

      log.step('Setting page size to 50 and verifying all rows match selected config type');
      try {
        await correspondentPortalPage.Change_Page_Size_Dropdown.click();
        await correspondentPortalPage.Set_page_size_to_50_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });

        for (let i = 0; i < await generalSettingPage.Config_Type_Column_Data.count(); i++) {
          await expect(generalSettingPage.Config_Type_Column_Data.nth(i)).toHaveText(String(vars["SelectedConfig"]));
        }
        log.stepPass('All config type rows on page 1 match selected config: ' + vars["SelectedConfig"]);
      } catch (e) {
        await log.stepFail(page, 'Config type verification failed on page 1');
        throw e;
      }

      log.step('Navigating to next page (if available) and verifying config type rows');
      try {
        if (await correspondentPortalPage.Go_to_Next_Page_Button.isVisible()) {
          await correspondentPortalPage.Go_to_Next_Page_Button_2.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });

          for (let i = 0; i < await generalSettingPage.Config_Type_Column_Data.count(); i++) {
            await expect(generalSettingPage.Config_Type_Column_Data.nth(i)).toHaveText(String(vars["SelectedConfig"]));
          }
          log.info('All config type rows on page 2 match selected config: ' + vars["SelectedConfig"]);

          await generalSettingPage.Go_to_Previous_Page_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.stepPass('Verified config type rows on next page and returned to previous page');
        } else {
          log.info('Next page button not visible — skipping multi-page verification');
          log.stepPass('Single page result — no pagination to verify');
        }
      } catch (e) {
        await log.stepFail(page, 'Failed during next page config type verification');
        throw e;
      }

      log.step('Capturing data with search filter, then resetting to Show All and verifying data changes');
      try {
        vars["CreatedColumnDataWithSearch"] = (await generalSettingPage.Created_Date_Time_Column_Data.allTextContents()).join(', ');
        log.info('CreatedColumnDataWithSearch: ' + vars["CreatedColumnDataWithSearch"]);

        await generalSettingPage.Select_Conf_Type_Toggel_Dropdown.click();
        await correspondentPortalPage.Show_All_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });

        vars["CreatedColumnDataWithoutSearch"] = (await generalSettingPage.Created_Date_Time_Column_Data.allTextContents()).join(', ');
        log.info('CreatedColumnDataWithoutSearch: ' + vars["CreatedColumnDataWithoutSearch"]);

        expect(String(vars["CreatedColumnDataWithoutSearch"])).not.toBe(vars["CreatedColumnDataWithSearch"]);
        log.stepPass('Data changed after resetting to Show All — config type filter verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify data change after resetting to Show All');
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