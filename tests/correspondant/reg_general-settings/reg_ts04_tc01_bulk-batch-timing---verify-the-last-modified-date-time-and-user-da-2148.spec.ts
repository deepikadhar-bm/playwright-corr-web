import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS04_TC01';
const TC_TITLE = 'Bulk Batch Timing - Verify the last Modified date, Time and user data that get displayed in the right corner of the page';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let generalSettingPage: GeneralSettingPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars["Username"] = credentials.username;
    vars["Password"] = credentials.password;
    generalSettingPage = new GeneralSettingPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Login to CORR Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Logged in to CORR Portal successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to login to CORR Portal');
        throw e;
      }

      log.step('Navigate to Bulk Batch Timing settings');
      try {
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByRole('heading', { name: 'Bulk Batch Timing' })).toBeVisible();
        log.stepPass('Navigated to Bulk Batch Timing and page heading verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bulk Batch Timing or page heading not visible');
        throw e;
      }

      log.step('Modify batch intervals');
      try {
        const profileName = "Administration_Bulk Batch Timing";
        const profile = testDataManager.getProfileByName(profileName);

        if (profile && profile.data) {
          vars["Time Interval"] = profile.data[0]['Time Interval'];
          vars["NO of Batches"] = profile.data[0]['NO of Batches'];
        }
        await stepGroups.stepGroup_Modifying_The_Batch_Intervals(page, vars);
        await page.waitForTimeout(2000);
        log.stepPass('Batch intervals modified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to modify batch intervals');
        throw e;
      }

      log.step('Verify Last Modified date, time and user data displayed in the right corner of the page');
      try {
        await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
        log.stepPass('Last Modified date, time and user data verified successfully in the right corner of the page');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Last Modified date, time or user data in the right corner of the page');
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