// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { MarketThresholdPage } from '../../../src/pages/correspondant/market-threshold';
import { SeeDifferencePopUpPage } from '../../../src/pages/correspondant/see-difference-pop-up';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { APP_CONSTANTS } from 'src/constants/app-constants';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';

const TC_ID = "REG_TS06_TC05";
const TC_TITLE = 'Early Close Config - Audit Log - Verify the difference button in the details section (Side by side) & (Line by Line)';
let Status_reg_6_5 = false;
test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let marketThresholdPage: MarketThresholdPage;
  let seeDifferencePopUpPage: SeeDifferencePopUpPage;
  let spinnerPage: SpinnerPage;
  let CorrPortalElem: CorrPortalPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    marketThresholdPage = new MarketThresholdPage(page);
    seeDifferencePopUpPage = new SeeDifferencePopUpPage(page);
    spinnerPage = new SpinnerPage(page);
    CorrPortalElem = new CorrPortalPage(page);
  });

  test('REG_TS06_TC05_Early Close Config - Audit Log - Verify the difference button in the details section (Side by side) & (Line by Line).', async ({ page }) => {
    
    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {
      const credentials = ENV.getCredentials('internal');
      vars['Username'] = credentials.username;
      vars['Password'] = credentials.password;

      // ── Login to Correspondent Portal ─────────────────────────────────
      log.step('Logging in to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Successfully logged in to Correspondent Portal');
      } catch (e) {
        await log.stepFail(page, 'Failed to log in to Correspondent Portal');
        throw e;
      }

      // ── Wait for page load ────────────────────────────────────────────
      log.step('Waiting for page load');
      try {
        await page.waitForLoadState('load');
        log.info('Page loaded successfully');
        log.stepPass('Page load completed');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for page load');
        throw e;
      }

      // ── Click Administration Menu ─────────────────────────────────────
      log.step('Clicking Administration Menu');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        log.info('Clicked Administration Menu');
        log.stepPass('Administration Menu clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Administration Menu');
        throw e;
      }

      // ── Wait for General Settings Menu to be visible ──────────────────
      log.step('Waiting for General Settings Menu to be visible');
      try {
        await correspondentPortalPage.GeneralSettings_Menu.waitFor({ state: 'visible' });
        log.info('General Settings Menu is now visible');
        log.stepPass('General Settings Menu visibility confirmed');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for General Settings Menu visibility');
        throw e;
      }

      // ── Click General Settings Menu ───────────────────────────────────
      log.step('Clicking General Settings Menu');
      try {
        await correspondentPortalPage.GeneralSettings_Menu.click();
        log.info('Clicked General Settings Menu');
        log.stepPass('General Settings Menu clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click General Settings Menu');
        throw e;
      }

      // ── Creating an Early Config Record ───────────────────────────────
      log.step('Creating an Early Close Config Record');
      try {
        await stepGroups.stepGroup_Creating_an_Early_Config_Record(page, vars);
        log.info('Early Config Record created');
        log.stepPass('Early Config Record created successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to create Early Config Record');
        throw e;
      }

      // ── Extract Time Hour ─────────────────────────────────────────────
      log.step('Extracting Time Hour from TimeHourMin');
      try {
        vars["TimeHour"] = String(vars["TimeHourMin"]).split(":")["0"] || '';
        if (vars["TimeHour"].charAt(0) === '0') {
    vars["TimeHour"] = vars["TimeHour"].charAt(1);
}
        // vars["TimeHour"] = (() => {
        //   const d = new Date(String(vars["TimeHour"]));
        //   const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
        //   return "h".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
        // })();
        log.info(`Time Hour extracted: ${vars["TimeHour"]}`);
        log.stepPass('Time Hour extracted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to extract Time Hour');
        throw e;
      }

      // ── Extract Time Minutes ──────────────────────────────────────────
      log.step('Extracting Time Minutes from TimeHourMin');
      try {
        vars["TimeMin"] = String(vars["TimeHourMin"]).split(":")["1"] || '';
        log.info(`Time Minutes extracted: ${vars["TimeMin"]}`);
        log.stepPass('Time Minutes extracted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to extract Time Minutes');
        throw e;
      }

      // ── Deleting Early Config Records other than today ────────────────
      log.step('Deleting Early Config Records other than today');
      try {
        await stepGroups.stepGroup_Deleting_Early_Config_Recordsother_than_today(page, vars);
        log.info('Early Config Records deleted');
        log.stepPass('Early Config Records deletion completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to delete Early Config Records');
        throw e;
      }

      // ── Click Audit Menu ──────────────────────────────────────────────
      log.step('Clicking Audit Menu');
      try {
        await generalSettingPage.Audit_Menu.click();
        log.info('Clicked Audit Menu');
        log.stepPass('Audit Menu clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Audit Menu');
        throw e;
      }

      // ── Wait for page load ────────────────────────────────────────────
      log.step('Waiting for Spinner to disappear');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - Audit page loaded');
        log.stepPass('Audit page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for page load');
        throw e;
      }

      // ── Verify Audit Time and Date ────────────────────────────────────
      log.step('Verifying Audit Time and Date');
      try {
        await stepGroups.stepGroup_Verifying_the_Audit_Time_and_Date(page, vars);
        log.info('Audit Time and Date verified');
        log.stepPass('Audit Time and Date verification completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Audit Time and Date');
        throw e;
      }

      // ── Verify First User Name ────────────────────────────────────────
      //await stepGroups.stepGroup_Verifying_the_Username_and_Config_Type_in_Audit_List_Screen(page, vars);
      log.step('Verifying First User Name');
      try {
        await expect(CorrPortalElem.First_User_Name_UI.first()).toContainText(APP_CONSTANTS.TESTSIGMA_INTERNAL);
        log.info(`First User Name verified: ${APP_CONSTANTS.TESTSIGMA_INTERNAL}`);
        log.stepPass('First User Name verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify First User Name');
        throw e;
      }

      // ── Verify Config Type Column Data ────────────────────────────────
      log.step('Verifying Config Type Column Data');
      try {
        await expect(CorrPortalElem.Config_Type_Column_Data.first()).toContainText(APP_CONSTANTS.EarlyConfigTextAuditPage);
        log.info(`Config Type Column Data verified: ${APP_CONSTANTS.EarlyConfigTextAuditPage}`);
        log.stepPass('Config Type Column Data verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Config Type Column Data');
        throw e;
      }

      // ── Verify Side by Side Data in See Difference Pop-up ──────────────
      log.step('Verifying Side by Side data in See Difference Pop-up');
      try {
        await stepGroups.stepGroup_Verifying_the_side_by_side_data_in_see_difference_pop_upAudi(page, vars);
        log.info('Side by Side data verified');
        log.stepPass('Side by Side data verification completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Side by Side data');
        throw e;
      }

      // ── Generate Expected Creation Date ───────────────────────────────
      log.step('Generating Expected Creation Date');
      try {
        vars["ExpectedCreationDate"] = (() => {
          const d = new Date();
          const opts: Intl.DateTimeFormatOptions = { timeZone: "America/New_York" };
          const fmt = "yyyy-MM-dd";
          // Map Java date format to Intl parts
          const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
          const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
          return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
        })();
        log.info(`Expected Creation Date generated: ${vars["ExpectedCreationDate"]}`);
        log.stepPass('Expected Creation Date generated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to generate Expected Creation Date');
        throw e;
      }

      // ── Format Tomorrow's Date Input ──────────────────────────────────
      log.step('Formatting Tomorrow\'s Date Input');
      try {
        // [DISABLED] Concate "date": " and TomorrowsDateInput with Space and store into a variable ExpectedDate
        // vars[""] = String("\"date\": \"") + ' ' + String(vars["TomorrowsDateInput"]);
        vars["ExpectedDate"] = String('"date": ') + String('"')+String(vars["TomorrowsDateInput"])+String('"');
        log.info(`Expected Date for Tomorrow's Date Input: ${vars["ExpectedDate"]}`);
        log.info(`Tomorrow's Date Input formatted: ${vars["TomorrowsDateInput"]}`);
        log.stepPass('Tomorrow\'s Date Input formatted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to format Tomorrow\'s Date Input');
        throw e;
      }

      // ── Verify Previous Data Table - Expected Date ────────────────────
      log.step('Verifying Previous Data Table contains Expected Date');
      try {
        await expect(seeDifferencePopUpPage.Side_by_side_Previous_data_table).toContainText(vars["ExpectedDate"]);
        log.info('Previous Data Table contains Expected Date');
        log.stepPass('Expected Date verification passed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Expected Date in Previous Data Table');
        throw e;
      }

      // ── Verify commitCreationCutOffTime ───────────────────────────────
      log.step('Verifying commitCreationCutOffTime in Previous Data Table');
      try {
        await expect(seeDifferencePopUpPage.Side_by_side_Previous_data_table).toContainText("\"commitCreationCutOffTime\": null,");
        log.info('commitCreationCutOffTime verified as null');
        log.stepPass('commitCreationCutOffTime verification passed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify commitCreationCutOffTime');
        throw e;
      }

      // ── Verify lastBatchTime ──────────────────────────────────────────
      log.step('Verifying lastBatchTime in Previous Data Table');
      try {
        await expect(seeDifferencePopUpPage.Side_by_side_Previous_data_table).toContainText("\"lastBatchTime\": {");
        log.info('lastBatchTime verified');
        log.stepPass('lastBatchTime verification passed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify lastBatchTime');
        throw e;
      }

      // ── Generate Expected Time Hour ───────────────────────────────────
      log.step('Generating Expected Time Hour');
      try {
        vars["ExpectedTimeHour"] = String("\"hours\":") + ' ' + String(vars["TimeHour"]);
        vars["ExpectedTimeHour"] = String(vars["ExpectedTimeHour"]) + String(',');
        log.info(`Expected Time Hour generated: ${vars["ExpectedTimeHour"]}`);
        log.stepPass('Expected Time Hour generated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to generate Expected Time Hour');
        throw e;
      }

      // ── Verify Expected Time Hour in Previous Data Table ──────────────
      log.step('Verifying Expected Time Hour in Previous Data Table');
      try {
        await expect(seeDifferencePopUpPage.Side_by_side_Previous_data_table).toContainText(vars["ExpectedTimeHour"]);
        log.info(`Expected Time Hour verified: ${vars["ExpectedTimeHour"]}`);
        log.stepPass('Expected Time Hour verification passed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Expected Time Hour');
        throw e;
      }

      // ── Generate Expected Time Minutes ────────────────────────────────
      log.step('Generating Expected Time Minutes');
      try {
        vars["ExpectedTimeMin"] = String("\"minutes\":") + ' ' + String(vars["TimeMin"]);
        log.info(`Expected Time Minutes generated: ${vars["ExpectedTimeMin"]}`);
        log.stepPass('Expected Time Minutes generated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to generate Expected Time Minutes');
        throw e;
      }

      // ── Verify Expected Time Minutes in Previous Data Table ───────────
      log.step('Verifying Expected Time Minutes in Previous Data Table');
      try {
        await expect(seeDifferencePopUpPage.Side_by_side_Previous_data_table).toContainText(vars["ExpectedTimeMin"]);
        log.info(`Expected Time Minutes verified: ${vars["ExpectedTimeMin"]}`);
        log.stepPass('Expected Time Minutes verification passed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Expected Time Minutes');
        throw e;
      }

      // ── Verify createdBy in Previous Data Table ───────────────────────
      log.step('Verifying createdBy in Previous Data Table');
      try {
        await expect(seeDifferencePopUpPage.Side_by_side_Previous_data_table).toContainText("\"createdBy\": \"testsigma_internal\",");
        log.info('createdBy verified as testsigma_internal');
        log.stepPass('createdBy verification passed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify createdBy');
        throw e;
      }

      // ── Generate Expected Creation Date for creationDate ──────────────
      log.step('Generating Expected Creation Date for creationDate field');
      try {
        vars["ExpectedCreationDate"] = String('\"creationDate": \"') + String(vars["ExpectedCreationDate"]);
        log.info(`Expected Creation Date for creationDate field generated: ${vars["ExpectedCreationDate"]}`);
        log.stepPass('Expected Creation Date for creationDate field generated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to generate Expected Creation Date for creationDate');
        throw e;
      }

      // ── Verify creationDate in Previous Data Table ────────────────────
      log.step('Verifying creationDate in Previous Data Table');
      try {
        await expect(seeDifferencePopUpPage.Side_by_side_Previous_data_table).toContainText(vars["ExpectedCreationDate"]);
        log.info(`creationDate verified: ${vars["ExpectedCreationDate"]}`);
        log.stepPass('creationDate verification passed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify creationDate');
        throw e;
      }

      // ── Verify modifiedBy in Previous Data Table ──────────────────────
      log.step('Verifying modifiedBy in Previous Data Table');
      try {
        await expect(seeDifferencePopUpPage.Side_by_side_Previous_data_table).toContainText("\"modifiedBy\": \"testsigma_internal\",");
        log.info('modifiedBy verified as testsigma_internal');
        log.stepPass('modifiedBy verification passed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify modifiedBy');
        throw e;
      }

      // ── Generate Expected Modified Time ───────────────────────────────
      log.step('Generating Expected Modified Time');
      try {
        vars["ExpectedModifiedTime"] = (() => {
          const d = new Date();
          const opts: Intl.DateTimeFormatOptions = { timeZone: "America/New_York" };
          const fmt = "yyyy-MM-dd";
          // Map Java date format to Intl parts
          const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
          const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
          return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
        })();
        vars["ExpectedModifiedTime"] = String(' \"modifiedDate": \"') + String(vars["ExpectedModifiedTime"]);
        log.info(`Expected Modified Time generated: ${vars["ExpectedModifiedTime"]}`);
        log.stepPass('Expected Modified Time generated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to generate Expected Modified Time');
        throw e;
      }

      // ── Verify modifiedDate in Previous Data Table ────────────────────
      log.step('Verifying modifiedDate in Previous Data Table');
      try {
        await expect(seeDifferencePopUpPage.Side_by_side_Previous_data_table).toContainText(vars["ExpectedModifiedTime"]);
        log.info(`modifiedDate verified: ${vars["ExpectedModifiedTime"]}`);
        log.stepPass('modifiedDate verification passed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify modifiedDate');
        throw e;
      }

      // ── Verify Previous Data Background Color ──────────────────────────
      log.step('Verifying Previous Data Background Color');
      try {
        await expect(seeDifferencePopUpPage.Side_by_Side_Previous_Data_Early_Config).toHaveCSS('background-color', "rgb(254, 232, 233)");
        log.info('Previous Data background color verified as rgb(254, 232, 233)');
        log.stepPass('Previous Data background color verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Previous Data background color');
        throw e;
      }

      // ── Verify New Data Text in Line by Line view ─────────────────────
      log.step('Verifying New Data Text in Line by Line view');
      try {
        await expect(correspondentPortalPage.New_Data_TextLine_by_Line).toContainText("{}");
        log.info('New Data Text verified as empty object {}');
        log.stepPass('New Data Text verification passed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify New Data Text');
        throw e;
      }

      // ── Verify New Data Background Color (Side by Side view) ──────────
      log.step('Verifying New Data Background Color in Side by Side view');
      try {
        await expect(seeDifferencePopUpPage.New_Data_Change_Text_Side_by_Side).toHaveCSS('background-color', "rgb(151, 242, 149)");
        log.info('New Data background color verified as rgb(151, 242, 149)');
        log.stepPass('New Data background color verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify New Data background color');
        throw e;
      }

      // ── Verify Line by Line data in See Difference Pop-up ──────────────
      log.step('Verifying Line by Line data in See Difference Pop-up');
      try {
        await stepGroups.stepGroup_Verifying_the_Line_by_line_data_in_see_difference_pop_upAudi(page, vars);
        log.info('Line by Line data verified');
        log.stepPass('Line by Line data verification completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Line by Line data');
        throw e;
      }
//-------------------------------------------Color Verification to check after---------------------------------------
      // ── Verify Previous Data Background Color (Line by Line view) ──────
      // log.step('Verifying Previous Data Background Color in Line by Line view');
      // try {
      //   await expect(seeDifferencePopUpPage.Previous_Data_Change_Text_Line_by_Line_Minus).toHaveCSS('background-color', "rgb(255, 182, 186)");
      //   log.info('Previous Data background color verified as rgb(255, 182, 186) in Line by Line view');
      //   log.stepPass('Previous Data background color verified in Line by Line view');
      // } catch (e) {
      //   await log.stepFail(page, 'Failed to verify Previous Data background color in Line by Line view');
      //   throw e;
      // }
//---------------------------------------------------------------------------------------------------------------------------
      // ── Verify New Data Text in Line by Line view (Final) ──────────────
      log.step('Verifying New Data Text in Line by Line view (Final)');
      try {
        await expect(correspondentPortalPage.New_Data_TextLine_by_Line).toContainText("{}");
        log.info('New Data Text verified as empty object {} in final check');
        log.stepPass('New Data Text final verification passed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify New Data Text in final check');
        throw e;
      }

      // ── Verify New Data Background Color (Final) ──────────────────────
      log.step('Verifying New Data Background Color (Final)');
      try {
        await expect(seeDifferencePopUpPage.New_Data_Change_Text_Side_by_Side).toHaveCSS('background-color', "rgb(151, 242, 149)");
        log.info('New Data background color verified as rgb(151, 242, 149) in final check');
        log.stepPass('New Data background color verified in final check');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify New Data background color in final check');
        throw e;
      }

      // ── Close the Difference Pop-up ───────────────────────────────────
      log.step('Closing the Difference Pop-up');
      try {
        await correspondentPortalPage.close_pop_up_bid_request_details.click();
        log.info('Clicked Close Pop-up Button');
        log.stepPass('Difference Pop-up closed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to close Difference Pop-up');
        throw e;
      }

      // ── Navigate to Early Close Config ────────────────────────────────
      log.step('Navigating to Early Close Config');
      try {
        await stepGroups.stepGroup_Navigating_To_Early_Close_Config(page, vars);
        log.info('Navigated to Early Close Config');
        log.stepPass('Early Close Config navigation completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Early Close Config');
        throw e;
      }

      // ── Delete Early Config Records other than today ───────────────────
      log.step('Deleting Early Config Records other than today (Cleanup)');
      try {
        await stepGroups.stepGroup_Deleting_Early_Config_Recordsother_than_today(page, vars);
        log.info('Early Config Records deleted (Cleanup)');
        log.stepPass('Early Config Records deletion completed successfully (Cleanup)');
      } catch (e) {
        await log.stepFail(page, 'Failed to delete Early Config Records (Cleanup)');
        throw e;
      }

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      Status_reg_6_5 = true;
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }

  });
  test.afterEach(async ({ page }) => {
    // ── Logout from Correspondent Portal ───────────────────────────────
    if(Status_reg_6_5){
    try {
      // ── Navigate to Early Close Config ────────────────────────────────
      log.step('Navigating to Early Close Config');

      try {
        if (await correspondentPortalPage.close_pop_up_bid_request_details.isVisible()) {
          await correspondentPortalPage.close_pop_up_bid_request_details.click();
          log.info('Closed open pop-up before navigating to Early Close Config');
        }
        await stepGroups.stepGroup_Navigating_To_Early_Close_Config(page, vars);
        log.info('Navigated to Early Close Config');
        log.stepPass('Early Close Config navigation completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Early Close Config');
        throw e;
      }

      // ── Delete Early Config Records other than today ───────────────────
      log.step('Deleting Early Config Records other than today (Cleanup)');
      try {
        await stepGroups.stepGroup_Deleting_Early_Config_Recordsother_than_today(page, vars);
        log.info('Early Config Records deleted (Cleanup)');
        log.stepPass('Early Config Records deletion completed successfully (Cleanup)');
      } catch (e) {
        await log.stepFail(page, 'Failed to delete Early Config Records (Cleanup)');
        throw e;
      }
    } catch (e) {
      await log.stepFail(page, 'Failed to delete Early Config Records (Cleanup)');
      throw e;
    }}
    else{
      log.step('Cleanup after steps is not required as test passed');
    }
  });
});