import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'REG_TS01_TC01';
const TC_TITLE = 'Audit log - Verify the search by username functionality';

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

      log.step('Capturing first username from the list and searching by it');
      try {
        vars["FirstUserNameList"] = await generalSettingPage.First_User_Name_UI.first().textContent() || '';
        vars["FirstUserNameList"] = String(vars["FirstUserNameList"]).trim();
        await correspondentPortalPage.Search_Username_Input.fill(vars["FirstUserNameList"]);
        vars["SearchedUserName"] = vars["FirstUserNameList"];
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Captured and searched username: ' + vars["SearchedUserName"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to capture or search username');
        throw e;
      }

      log.step('Setting page size to 50 and verifying all results match searched username');
      try {
        await correspondentPortalPage.Change_Page_Size_Dropdown.click();
        await correspondentPortalPage.Set_page_size_to_50_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });

        for (let i = 0; i < await generalSettingPage.First_User_Name_UI.count(); i++) {
          await expect(generalSettingPage.First_User_Name_UI.nth(i)).toHaveText(String(vars["SearchedUserName"]));
        }
        log.stepPass('All usernames on page 1 match searched username: ' + vars["SearchedUserName"]);
      } catch (e) {
        await log.stepFail(page, 'Username verification failed on page 1');
        throw e;
      }

      log.step('Navigating to next page (if available) and verifying usernames');
      try {
        if (await correspondentPortalPage.Go_to_Next_Page_Button.isVisible()) {
          await correspondentPortalPage.Go_to_Next_Page_Button_2.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });

          for (let i = 0; i < await generalSettingPage.First_User_Name_UI.count(); i++) {
            await expect(generalSettingPage.First_User_Name_UI.nth(i)).toHaveText(String(vars["SearchedUserName"]));
          }
          log.info('All usernames on page 2 match searched username: ' + vars["SearchedUserName"]);

          await generalSettingPage.Go_to_Previous_Page_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.stepPass('Verified usernames on next page and returned to previous page');
        } else {
          log.info('Next page button not visible — skipping multi-page verification');
          log.stepPass('Single page result — no pagination to verify');
        }
      } catch (e) {
        await log.stepFail(page, 'Failed during next page username verification');
        throw e;
      }

      log.step('Clearing search and verifying the data changes after clear');
      try {
        vars["CreatedColumnDataBeforeClear"] = (await generalSettingPage.Created_Date_Time_Column_Data.allTextContents()).join(', ');
        await generalSettingPage.Clear_buttonUsername_Search_Bar.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["CreatedColumnDataAfterClear"] = (await generalSettingPage.Created_Date_Time_Column_Data.allTextContents()).join(', ');

        expect(String(vars["CreatedColumnDataBeforeClear"])).not.toBe(vars["CreatedColumnDataAfterClear"]);
        // log.info('CreatedColumnDataBeforeClear: ' + vars["CreatedColumnDataBeforeClear"]);
        // log.info('CreatedColumnDataAfterClear: ' + vars["CreatedColumnDataAfterClear"]);
        log.stepPass('Created date column data changed after clearing the username search — clear functionality verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify data change after clearing search');
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