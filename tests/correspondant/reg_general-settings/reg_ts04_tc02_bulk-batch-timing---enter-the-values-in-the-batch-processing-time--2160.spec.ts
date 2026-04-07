import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestUploadPage } from '../../../src/pages/correspondant/bid-request-upload';
import { BidUploadPagePage } from '../../../src/pages/correspondant/bid-upload-page';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS04_TC02';
const TC_TITLE = 'Bulk Batch Timing - Enter the Values in the Batch Processing time Buffer, and verify it is get displayed in the Bid request Module.';


test.describe('REG_General Settings', () => {

  let vars: Record<string, string> = {};
  let bidRequestUploadPage: BidRequestUploadPage;
  let bidUploadPagePage: BidUploadPagePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  let REG_TS04_TC02testFailed = false;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    bidRequestUploadPage = new BidRequestUploadPage(page);
    bidUploadPagePage = new BidUploadPagePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
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
        log.stepPass('Login to CORR Portal successful');
      } catch (e) {
        await log.stepFail(page, 'Login to CORR Portal failed');
        throw e;
      }

      log.step('Navigate to Bulk Batch Timing and modify batch intervals');
      try {
        const profileName = 'Administration_Bulk Batch Timing';
        const profile = testDataManager.getProfileByName(profileName);
        if (profile && profile.data) {
          vars['Time Interval'] = profile.data[0]['Time Interval'];
          vars['NO of Batches'] = profile.data[0]['NO of Batches'];
          log.info('Time Interval: ' + vars['Time Interval']);
          log.info('NO of Batches: ' + vars['NO of Batches']);
        }
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByRole('heading', { name: 'Bulk Batch Timing' })).toBeVisible();
        await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
        log.stepPass('Navigated to Bulk Batch Timing and batch intervals modified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bulk Batch Timing or modify batch intervals');
        throw e;
      }

      log.step('Capture current buffer time, update to 10 and save');
      try {
        vars['BufferTimeBefore'] = await correspondentPortalPage.Batch_Processing_Time_Buffer_Input.inputValue() || '';
        Methods.trimtestdata(vars['BufferTimeBefore'], 'BufferTimeBefore');
        log.info('BufferTimeBefore: ' + vars['BufferTimeBefore']);
        await correspondentPortalPage.Batch_Processing_Time_Buffer_Input.click();
        await correspondentPortalPage.Batch_Processing_Time_Buffer_Input.clear();
        await correspondentPortalPage.Batch_Processing_Time_Buffer_Input.fill(appconstants.TEN);
        await expect(correspondentPortalPage.Save_BufferBulk_Batches).toBeEnabled();
        await correspondentPortalPage.Save_BufferBulk_Batches.click();
        await page.waitForTimeout(4000);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Buffer time updated to 10 and saved successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to update or save buffer time');
        throw e;
      }

      log.step('Navigate to Upload New Bid Request and verify pricing dropdown options');
      try {
        await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
        await correspondentPortalPage.Pricing_Return_Time.click();
        Methods.getCurrentTimestamp(appconstants.TIME_FORMAT1_HHMMA, 'CurrentTime', appconstants.AMERICA_NEW_YORK);
        log.info('Current Est Time: ' + vars['CurrentTime']);
        const optionsCount = await bidRequestUploadPage.Options_Pricing_Dropdown.count();
        log.info('Total options in pricing dropdown: ' + optionsCount);
        const optionsTexts = await bidRequestUploadPage.Options_Pricing_Dropdown.allTextContents();
        log.info('Texts of all options in pricing dropdown: ' + optionsTexts);
        const enabledCount = await bidRequestUploadPage.Enabled_Options_Pricing_Dropdown.count();
        log.info('Total enabled options:' + enabledCount);
        const enabledOptionsTexts = await bidRequestUploadPage.Enabled_Options_Pricing_Dropdown.allTextContents();
        log.info('Texts of enabled options:' + enabledOptionsTexts);
        const count = await bidRequestUploadPage.Disabled_Options_Pricing_Dropdown.count();
        log.info('Total disabled options:' + count);
        const disabledOptionsTexts = await bidRequestUploadPage.Disabled_Options_Pricing_Dropdown.allTextContents();
        log.info('Texts of disabled options:' + disabledOptionsTexts);
        await page.waitForTimeout(30000);
        await expect(bidRequestUploadPage.First_Option_In_Pricing_Dropdown).toBeDisabled();
        await expect(bidRequestUploadPage.Second_Option_Pricing_Dropdown).toBeDisabled();
        await expect(bidRequestUploadPage.Third_Option_Pricing_Dropdown).toBeEnabled();
        await expect(bidUploadPagePage.Fourth_OptionPricing_Dropdown).toBeEnabled();
        Methods.getCurrentTimestamp(appconstants.TIME_FORMAT1_HHMMA, 'CurrentTime', appconstants.AMERICA_NEW_YORK);
        log.info('Current Est Time: ' + vars['CurrentTime']);
        log.stepPass('Pricing dropdown options verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify pricing dropdown options');
        throw e;
      }

      log.step('Navigate back to Bulk Batch Timing and restore original buffer time');
      try {
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        await correspondentPortalPage.Batch_Processing_Time_Buffer_Input.fill(vars['BufferTimeBefore']);
        await expect(correspondentPortalPage.Save_BufferBulk_Batches).toBeEnabled();
        await correspondentPortalPage.Save_BufferBulk_Batches.click();
        log.info('Buffer time restored to: ' + vars['BufferTimeBefore']);
        log.stepPass('Original buffer time restored successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to restore original buffer time');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      REG_TS04_TC02testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }
  });

  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, REG_TS04_TC02testFailed);
    try {
      log.step('Executing after-test steps: Restore buffer time to original value');
      if (REG_TS04_TC02testFailed) {
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        vars['Batch Processing Time Buffer Input'] = await correspondentPortalPage.Batch_Processing_Time_Buffer_Input.inputValue() || '';
        Methods.trimtestdata(vars['Batch Processing Time Buffer Input'], 'Batch Processing Time Buffer Input');
        log.info('Current buffer time: ' + vars['Batch Processing Time Buffer Input']);
        if (String(vars['Batch Processing Time Buffer Input']) === String(vars['BufferTimeBefore'])) {
          log.info('Buffer time is already at original value: ' + vars['BufferTimeBefore']);
        } else {
          await correspondentPortalPage.Batch_Processing_Time_Buffer_Input.fill(String(vars['BufferTimeBefore']));
          if (await correspondentPortalPage.Save_BufferBulk_Batches.isEnabled()) {
            await correspondentPortalPage.Save_BufferBulk_Batches.click();
          }
        }
      }
      log.stepPass('After-test steps executed successfully. Buffer time restored to original value');
    } catch (e) {
      await log.stepFail(page, 'Failed to restore buffer time to original value in after-test steps');
      throw e;
    }
  });
});