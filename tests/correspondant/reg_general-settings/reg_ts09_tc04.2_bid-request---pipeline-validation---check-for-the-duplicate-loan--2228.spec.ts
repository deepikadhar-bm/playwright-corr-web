// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestConfigPage } from '../../../src/pages/correspondant/bid-request-config';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_2234 } from '../../../src/helpers/prereqs/prereq-2234';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';

import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';
const TC_ID = 'REG_TS09_TC04.2';
const TC_TITLE = 'Bid Request - Pipeline Validation - Check for the Duplicate Loan Check, - by enable and disable upload the loan for verification.';
let reg_ts09_tc04_2_testFailed = false;

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let bidRequestConfigPage: BidRequestConfigPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    log.step('Running prerequisite REG_TS09_TC04.2');
    try {
      await runPrereq_2234(page, vars);
      log.info('Prerequisite completed successfully');
      log.stepPass('Prerequisite executed');
    } catch (e) {
      await log.stepFail(page, 'Failed to run prerequisite');
      throw e;
    }

    bidRequestConfigPage = new BidRequestConfigPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS09_TC04.2_Bid Request - Pipeline Validation - Check for the Duplicate Loan Check, - by enable and disable upload the loan for verification.', async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {
      const credentials = ENV.getCredentials('internal');
      vars["Username"] = credentials.username;
      vars["Password"] = credentials.password;
      const profile2 = testDataManager.getProfileByName("Administration_Bulk Batch Timing");
      if (profile2 && profile2.data) {
        const TimeInterval = profile2.data[0]['Time Interval'];
        vars["Time Interval"] = TimeInterval;
        log.info(`Loaded Time Interval: ${vars["Time Interval"]}`);

        const NoOfBatches = profile2.data[0]['NO of Batches'];
        vars["NO of Batches"] = NoOfBatches;
        log.info(`Loaded NO of Batches: ${vars["NO of Batches"]}`);
      }

      const profileName = 'Bid Requests'; // TDP sheet name
      const profile = testDataManager.getProfileByName(profileName);
      if (profile && profile.data) {

        const CompanyName = profile.data[0]['Company Name'];
        vars["CompanyName"] = CompanyName;
        const BidMappingID = profile.data[0]['BidMappingID'];
        vars["BidMappingID"] = BidMappingID;
      }
      // ── Login to Correspondent Portal ──────────────────────────────────
      log.step('Logging in to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.info('Login step group executed');
        log.stepPass('Successfully logged in to Correspondent Portal');
      } catch (e) {
        await log.stepFail(page, 'Failed to log in to Correspondent Portal');
        throw e;
      }

      // ── Navigate to Administration Menu ──────────────────────────────
      log.step('Navigating to Administration Menu');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        log.info('Clicked Administration Menu');
        log.stepPass('Successfully navigated to Administration Menu');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Administration Menu');
        throw e;
      }

      // ── Navigate to General Settings Menu ───────────────────────────
      log.step('Navigating to General Settings Menu');
      try {
        await correspondentPortalPage.GeneralSettings_Menu.click();
        log.info('Clicked General Settings Menu');
        log.stepPass('Successfully navigated to General Settings Menu');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to General Settings Menu');
        throw e;
      }

      // ── Wait for page load ─────────────────────────────────────────
      log.step('Waiting for spinner to disappear');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - page load completed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for spinner to disappear');
        throw e;
      }

      // ── Navigate to Bid Request Config Menu ────────────────────────────
      log.step('Navigating to Bid Request Config Menu');
      try {
        await bidRequestPage.Bid_Request_Config_Menu.click();
        log.info('Clicked Bid Request Config Menu');
        log.stepPass('Successfully navigated to Bid Request Config Menu');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bid Request Config Menu');
        throw e;
      }

      // ── Wait for page load ─────────────────────────────────────────
      log.step('Waiting for spinner to disappear');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - page load completed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for spinner to disappear');
        throw e;
      }

      // ── Set color variables ────────────────────────────────────────────
      log.step('Setting color variables for toggle verification');
      try {
        vars["LightGrayColor"] = "rgb(204, 204, 204)";
        vars["BrightBlueColor"] = "rgb(33, 150, 243)";
        log.info(`LightGrayColor set to: ${vars["LightGrayColor"]}`);
        log.info(`BrightBlueColor set to: ${vars["BrightBlueColor"]}`);
        log.stepPass('Color variables set successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to set color variables');
        throw e;
      }

      // ── Get toggle color and enable if disabled ────────────────────────
      log.step('Getting toggle color and enabling if necessary');
      try {
        vars["ToggleColor"] = await bidRequestConfigPage.Loan_Duplicate_Toggle.evaluate((el) => window.getComputedStyle(el as HTMLElement).backgroundColor);
        log.info(`Current toggle color: ${vars["ToggleColor"]}`);
        if (String(vars["ToggleColor"]) === String(vars["LightGrayColor"])) {
          await bidRequestConfigPage.Loan_Duplicate_Toggle.click();
          log.info('Toggle was disabled (gray), clicked to enable');
        } else {
          log.info('Toggle is already enabled');
        }
        log.stepPass('Toggle color check and enable completed');
      } catch (e) {
        await log.stepFail(page, 'Failed to get toggle color or enable toggle');
        throw e;
      }

      // ── Verify toggle is enabled with blue background-color ──────────────────────
      log.step('Verifying toggle is enabled with bright blue background-color');
      try {
        await expect(bidRequestConfigPage.Loan_Duplicate_Toggle).toHaveCSS('background-color', vars["BrightBlueColor"]); 
          log.info('Toggle background-color verified as bright blue');
        log.stepPass('Toggle enabled verification completed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify toggle is enabled');
        throw e;
      }

      // [DISABLED] Wait for 5 seconds
      // await page.waitForTimeout(5000);
      // [DISABLED] Get background color of element Loan Duplicate Toggle and store into ldf
      // vars["ToggleColor"] = await bidRequestConfigPage.Loan_Duplicate_Toggle.evaluate((el) => window.getComputedStyle(el as HTMLElement).backgroundColor);
      // [DISABLED] Get background color of Loan Duplicate Toggle and convert to color name and store into xcf
      // vars["ToggleColor"] = await bidRequestConfigPage.Loan_Duplicate_Toggle.evaluate((el) => window.getComputedStyle(el as HTMLElement).backgroundColor);
      // [DISABLED] Wait until the element Save Changes Button is enabled
      // await correspondentPortalPage.Save_Changes_Button.waitFor({ state: 'visible' });

      // ── Click Save Changes Button if enabled ────────────────────────────
      log.step('Checking if Save Changes Button is enabled and clicking if true');
      try {
        if (await bidRequestConfigPage.Save_Changes_Button.isEnabled()) /* Element Save Changes Button is enabled */ {
          await bidRequestConfigPage.Save_Changes_Button.click();
          log.info('Save Changes Button was enabled and clicked');
        } else {
          log.info('Save Changes Button is not enabled, skipping click');
        }
        log.stepPass('Save Changes Button check completed');
      } catch (e) {
        await log.stepFail(page, 'Failed to check or click Save Changes Button');
        throw e;
      }

      // ── Wait for page load ─────────────────────────────────────────
      log.step('Waiting for spinner to disappear');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - page load completed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for spinner to disappear');
        throw e;
      }

      // [DISABLED] Click on Save Changes Button
      // await bidRequestConfigPage.Save_Changes_Button.click();
      // [DISABLED] Wait until the element Spinner is not visible
      // await spinnerPage.Spinner.waitFor({ state: 'hidden' });

      // ── Navigate to Bulk Batch Timing ──────────────────────────────────
      log.step('Navigating to Bulk Batch Timing');
      try {
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        log.info('Navigating to Bulk Batch Timing step group executed');
        log.stepPass('Successfully navigated to Bulk Batch Timing');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bulk Batch Timing');
        throw e;
      }

      // ── Modify batch intervals with current EST time ────────────────────
      log.step('Modifying batch intervals with current EST time');
      try {
        await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
        log.info('Modifying batch intervals step group executed');
        log.stepPass('Successfully modified batch intervals');
      } catch (e) {
        await log.stepFail(page, 'Failed to modify batch intervals');
        throw e;
      }

      // ── Navigate to Bid Requests Menu ──────────────────────────────────
      log.step('Navigating to Bid Requests Menu');
      try {
        //await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
        const CorrPortalElem = new CorrPortalPage(page);
        await CorrPortalElem.BidRequests_Menu.click();
        log.info('Clicked Bid Requests Menu');
        await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared');
        await expect(page.getByText("Bid Requests").first()).toBeVisible();
        log.info('Bid Requests page visible');
        log.stepPass('Successfully navigated to Bid Requests');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bid Requests Menu');
        throw e;
      }

      // ── Upload Bid Request ─────────────────────────────────────────────
      log.step('Uploading Bid Request');
      try {
        await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
       await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
        const CorrPortalElem = new CorrPortalPage(page);
        //   await CorrPortalElem.Pricing_Return_Time.selectOption({ index: parseInt("2") });
        //   vars["ExtractedPrincingReturnTime"] = await CorrPortalElem.Pricing_Return_Time.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
         // await CorrPortalElem.Upload_File.setInputFiles([]);
           await CorrPortalElem.Upload_File.setInputFiles(path.resolve(__dirname, '../../../uploads', fileconstants.Duplicate_Loan_File));
        
          await expect(CorrPortalElem.UploadBid_Button).toBeVisible();
          await CorrPortalElem.UploadBid_Button.click();
          await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
        log.info('Uploading Bid Request step group executed');
        log.stepPass('Successfully uploaded Bid Request');
      } catch (e) {
        await log.stepFail(page, 'Failed to upload Bid Request');
        throw e;
      }
      try{
      //Wait until the text Duplicate Loans ispresent on the current page
      await expect(page.getByText("Duplicate Loans")).toBeVisible();
      await log.stepPass("Duplicate Loans text is visible after uploading bid request");
      }catch(e){
        await log.stepFail(page, 'Failed to find Duplicate Loans text after uploading bid request');
        throw e;
      }
      try{
      // Wait until the element Okay, Close Button is enabled
      await correspondentPortalPage.Okay_Close_Button.waitFor({ state: 'visible' });
      // Click on Okay, Close Button
      await correspondentPortalPage.Okay_Close_Button.click();
      // Wait until the element Spinner is not visible
      await correspondentPortalPage.Okay_Close_Button.waitFor({ state: 'hidden' });
      log.stepPass("clicked on Okay Close Button");
      }catch(e){
        await log.stepFail(page, 'Failed to handle Duplicate Loans popup');
        throw e;
      }
      // // ── Upload Bid Request from batch time selection ────────────────────
      // log.step('Uploading Bid Request from batch time selection');
      // try {
      //   await stepGroups.stepGroup_Upload_Bid_Request_from_batch_time_selection_to_continue_but(page, vars);
      //   log.info('Upload Bid Request from batch time selection step group executed');
      //   log.stepPass('Successfully uploaded Bid Request from batch time selection');
      // } catch (e) {
      //   await log.stepFail(page, 'Failed to upload Bid Request from batch time selection');
      //   throw e;
      // }

      // [DISABLED] Store the count of elements identified by locator Rows Count Table 1 into a variable RowsCount
      // vars["RowsCount"] = String(await bidRequestDetailsPage.Rows_Count_Table_1.count());
      // [DISABLED] Mouseover the element First error data
      // await bidRequestDetailsPage.First_error_data.hover();
      // [DISABLED] Store the count of elements identified by locator Not Approved for Conventional Error Description into a variable ConventionalErrorCount
      // vars["ConventionalErrorCount"] = String(await bidRequestDetailsPage.Not_Approved_for_Conventional_Error_Description.count());
      // [DISABLED] Verify if RowsCount == ConventionalErrorCount
      // expect(String(vars["RowsCount"])).toBe(vars["ConventionalErrorCount"]);

      // ── Navigate to Bid Request Config ─────────────────────────────────
      log.step('Navigating to Bid Request Config');
      try {
        await stepGroups.stepGroup_Navigating_To_Bid_Request_Config(page, vars);
        log.info('Navigating to Bid Request Config step group executed');
        log.stepPass('Successfully navigated to Bid Request Config');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bid Request Config');
        throw e;
      }

      // ── Disable Loan Duplicate Toggle ──────────────────────────────────
      log.step('Disabling Loan Duplicate Toggle');
      try {
        await bidRequestConfigPage.Loan_Duplicate_Toggle.click();
        log.info('Clicked Loan Duplicate Toggle to disable');
        await page.waitForLoadState('load');
        log.info('Page load completed');
        log.stepPass('Loan Duplicate Toggle disabled');
      } catch (e) {
        await log.stepFail(page, 'Failed to disable Loan Duplicate Toggle');
        throw e;
      }

      // ── Verify toggle is disabled with light gray background-color ────────────────
      log.step('Verifying toggle is disabled with light gray background-color');
      try {
        await expect(bidRequestConfigPage.Loan_Duplicate_Toggle).toHaveCSS('background-color', vars["LightGrayColor"]);
        log.info('Toggle background-color verified as light gray');
        log.stepPass('Toggle disabled verification completed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify toggle is disabled');
        throw e;
      }

      // ── Click Save Changes Button ──────────────────────────────────────
      log.step('Waiting for Save Changes Button and clicking it');
      try {
        await bidRequestConfigPage.Save_Changes_Button.waitFor({ state: 'visible' });
        log.info('Save Changes Button is visible');
        await bidRequestConfigPage.Save_Changes_Button.click();
        log.info('Clicked Save Changes Button');
        log.stepPass('Save Changes Button clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for or click Save Changes Button');
        throw e;
      }

      // ── Wait for page load ─────────────────────────────────────────
      log.step('Waiting for spinner to disappear');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - page load completed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for spinner to disappear');
        throw e;
      }

      // ── Navigate to Bid Requests Menu (second time) ────────────────────
      log.step('Navigating to Bid Requests Menu (second time)');
      try {
        //await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
        const CorrPortalElem = new CorrPortalPage(page);
        await CorrPortalElem.BidRequests_Menu.click();
        log.info('Clicked Bid Requests Menu');
        await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared');
        await expect(page.getByText("Bid Requests").first()).toBeVisible();
        log.info('Bid Requests page visible');
        log.stepPass('Successfully navigated to Bid Requests');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bid Requests Menu');
        throw e;
      }

      // ── Upload Bid Request (second time) ───────────────────────────────
      log.step('Uploading Bid Request (second time)');
      try {
        await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
        log.info('Uploading Bid Request step group executed');
        log.stepPass('Successfully uploaded Bid Request');
      } catch (e) {
        await log.stepFail(page, 'Failed to upload Bid Request');
        throw e;
      }

      // ── Upload Bid Request from batch time selection (second time) ──────
      log.step('Uploading Bid Request from batch time selection (second time)');
      try {
        await stepGroups.stepGroup_Upload_Bid_Request_from_batch_time_selection_to_continue_but(page, vars);
        log.info('Upload Bid Request from batch time selection step group executed');
        log.stepPass('Successfully uploaded Bid Request from batch time selection');
      } catch (e) {
        await log.stepFail(page, 'Failed to upload Bid Request from batch time selection');
        throw e;
      }

      // [DISABLED] Select option using value Conventional in the Conventional Dropdown(Bid Request Config) list
      // await correspondentPortalPage.Pricing_Return_Time.selectOption({ label: "Conventional" });
      // [DISABLED] Pick the current date MM/d/yyyy : h:mm a by location UTC and store into a variable ExpectedModifiedTime
      // vars["ExpectedModifiedTime"] = (() => {
      //   const d = new Date();
      //   const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
      //   const fmt = "MM/d/yyyy : h:mm a";
      //   // Map Java date format to Intl parts
      //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      //   const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
      // })();
      // [DISABLED] Adjust UTC Time by Subtracting Minutes hh:mm a 1 into HourMinMinus1
      // vars[""] = (() => {
      //   const d = new Date('2000-01-01 ' + String(''));
      //   d.setMinutes(d.getMinutes() - parseInt(String('')));
      //   return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      // })();
      // [DISABLED] Verify that the Conventional Dropdown(Bid Request Config) list has option with value Conventional selected and With Scrollable FALSE
      // await expect(correspondentPortalPage.Pricing_Return_Time).toHaveValue("Conventional");

      // ── Navigate to Bid Request Config (second time) ────────────────────
      log.step('Navigating to Bid Request Config (second time)');
      try {
        await stepGroups.stepGroup_Navigating_To_Bid_Request_Config(page, vars);
        log.info('Navigating to Bid Request Config step group executed');
        log.stepPass('Successfully navigated to Bid Request Config');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bid Request Config');
        throw e;
      }

      // ── Enable Loan Duplicate Toggle (second time) ─────────────────────
      log.step('Enabling Loan Duplicate Toggle (second time)');
      try {
        await bidRequestConfigPage.Loan_Duplicate_Toggle.click();
        log.info('Clicked Loan Duplicate Toggle to enable');
        await page.waitForLoadState('load');
        log.info('Page load completed');
        log.stepPass('Loan Duplicate Toggle enabled');
      } catch (e) {
        await log.stepFail(page, 'Failed to enable Loan Duplicate Toggle');
        throw e;
      }

      // ── Verify toggle is enabled with bright blue background-color (second time) ──
      log.step('Verifying toggle is enabled with bright blue background-color (second time)');
      try {
        await expect(bidRequestConfigPage.Loan_Duplicate_Toggle).toHaveCSS('background-color', vars["BrightBlueColor"]);
        log.info('Toggle background-color verified as bright blue');
        log.stepPass('Toggle enabled verification completed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify toggle is enabled');
        throw e;
      }

      // ── Click Save Changes Button (second time) ────────────────────────
      log.step('Waiting for Save Changes Button and clicking it (second time)');
      try {
        await bidRequestConfigPage.Save_Changes_Button.waitFor({ state: 'visible' });
        log.info('Save Changes Button is visible');
        await bidRequestConfigPage.Save_Changes_Button.click();
        log.info('Clicked Save Changes Button');
        log.stepPass('Save Changes Button clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for or click Save Changes Button');
        throw e;
      }

      // ── Wait for page load ─────────────────────────────────────────
      log.step('Waiting for spinner to disappear');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - page load completed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for spinner to disappear');
        throw e;
      }

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      reg_ts09_tc04_2_testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }

  });

  test.afterEach(async ({ page }) => {
    const bidRequestConfigPage = new BidRequestConfigPage(page);
    log.step('Running afterEach cleanup');
    try {
      vars["ToggleColor"] = await bidRequestConfigPage.Loan_Duplicate_Toggle.evaluate((el) => window.getComputedStyle(el as HTMLElement).backgroundColor);
      log.info(`Current toggle color in afterEach: ${vars["ToggleColor"]}`);

      if (String(vars["ToggleColor"]) === String(vars["LightGrayColor"])) {
        log.info('Toggle is disabled (gray), enabling it for cleanup');
        await bidRequestConfigPage.Loan_Duplicate_Toggle.click();
        await page.waitForLoadState('load');
        log.info('Page load completed');
        await expect(bidRequestConfigPage.Loan_Duplicate_Toggle).toHaveCSS('background-color', vars["BrightBlueColor"]);
        log.info('Toggle background-color verified as bright blue');

        if (await bidRequestConfigPage.Save_Changes_Button.isEnabled()) /* Element Save Changes Button is enabled */ {
          await bidRequestConfigPage.Save_Changes_Button.click();
          log.info('Clicked Save Changes Button');
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.info('Spinner disappeared');
        }
      }
      log.stepPass('Cleanup completed successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed during afterEach cleanup');
      throw e;
    }
  });
});