// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { CustomerPermissionPage } from '../../../src/pages/correspondant/customer-permission';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';
import { APP_CONSTANTS } from 'src/constants/app-constants';


const TC_ID = 'REG_TS03_TC05';
const TC_TITLE = 'Customer Permission - Verify the Export Functionality';
let reg_ts03_tc05_testFailed = false;

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let customerPermissionPage: CustomerPermissionPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    customerPermissionPage = new CustomerPermissionPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS03_TC05_Customer Permission - Verify the Export Functionality', async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {
      const credentials = ENV.getCredentials('internal');
      vars["Username"] = credentials.username;
      vars["Password"] = credentials.password;

      // ── Login to Correspondent Portal ────────────────────────────────
      log.step('Logging in to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.info('Successfully logged in');
        log.stepPass('Login completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to log in to Correspondent Portal');
        throw e;
      }

      // ── Click Administration Menu ────────────────────────────────────
      log.step('Clicking Administration Menu');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        log.info('Clicked Administration Menu');
        log.stepPass('Administration Menu clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Administration Menu');
        throw e;
      }

      // ── Click General Settings Menu ──────────────────────────────────
      log.step('Clicking General Settings Menu');
      try {
        await correspondentPortalPage.GeneralSettings_Menu.click();
        log.info('Clicked General Settings Menu');
        log.stepPass('General Settings Menu clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click General Settings Menu');
        throw e;
      }

      // ── Wait for spinner to disappear ────────────────────────────────
      log.step('Waiting for spinner to disappear');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - page load completed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for spinner to disappear');
        throw e;
      }

      // ── Click Customer Permission Menu ───────────────────────────────
      log.step('Clicking Customer Permission Menu');
      try {
        await customerPermissionPage.CustomerPermission_Menu.click();
        log.info('Clicked Customer Permission Menu');
        log.stepPass('Customer Permission Menu clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Customer Permission Menu');
        throw e;
      }

      // ── Wait for spinner to disappear ────────────────────────────────
      log.step('Waiting for spinner to disappear');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - page load completed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for spinner to disappear');
        throw e;
      }

      // ── Check Third Checkbox ─────────────────────────────────────────
      log.step('Checking Third Checkbox');
      try {
        await customerPermissionPage.Third_Checkbox.check();
        log.info('Checked Third Checkbox');
        log.stepPass('Third Checkbox checked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to check Third Checkbox');
        throw e;
      }

      // ── Verify Third Checkbox is checked ─────────────────────────────
      log.step('Verifying Third Checkbox is checked');
      try {
        await expect(customerPermissionPage.Third_Checkbox).toBeChecked();
        log.info('Third Checkbox is checked');
        log.stepPass('Third Checkbox verification passed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Third Checkbox is checked');
        throw e;
      }

      // ── Check Fourth Checkbox ────────────────────────────────────────
      log.step('Checking Fourth Checkbox');
      try {
        await customerPermissionPage.Fourth_Check_box.check();
        log.info('Checked Fourth Checkbox');
        log.stepPass('Fourth Checkbox checked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to check Fourth Checkbox');
        throw e;
      }

      // ── Verify Fourth Checkbox is checked ────────────────────────────
      log.step('Verifying Fourth Checkbox is checked');
      try {
        await expect(customerPermissionPage.Fourth_Check_box).toBeChecked();
        log.info('Fourth Checkbox is checked');
        log.stepPass('Fourth Checkbox verification passed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Fourth Checkbox is checked');
        throw e;
      }

      // ── Wait for Export Selected Button to be visible ─────────────────
      log.step('Waiting for Export Selected Button to be visible');
      try {
        await correspondentPortalPage.Export_Selected_1_Button.waitFor({ state: 'visible' });
        log.info('Export Selected Button is visible');
        log.stepPass('Export Selected Button visibility confirmed');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for Export Selected Button');
        throw e;
      }

      // ── Verify Export Selected Button is enabled ──────────────────────
      log.step('Verifying Export Selected Button is enabled');
      try {
        await expect(correspondentPortalPage.Export_Selected_1_Button).toBeEnabled();
        log.info('Export Selected Button is enabled');
        log.stepPass('Export Selected Button verification passed');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Export Selected Button is enabled');
        throw e;
      }

      // ── Click Export Selected Button and wait for download ────────────
      log.step('Clicking Export Selected Button and waiting for download');
      try {
        const downloadPromise = page.waitForEvent('download');
        await correspondentPortalPage.Export_Selected_1_Button.click();
        log.info('Clicked Export Selected Button');

        const download = await downloadPromise;
        const downloadPath = path.join('test-results', 'downloads', download.suggestedFilename());
        await download.saveAs(downloadPath);
        vars['_lastDownloadPath'] = downloadPath;
        log.info(`File downloaded successfully: ${downloadPath}`);
        log.stepPass('Export Selected Button clicked and file downloaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Export Selected Button or download file');
        throw e;
      }

      // ── Wait for spinner to disappear ────────────────────────────────
      log.step('Waiting for spinner to disappear');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - file export processed');
        log.stepPass('File export completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for spinner to disappear');
        throw e;
      }

      // ── Set up export file variables ─────────────────────────────────
      log.step('Setting up export file variables');
      try {
        vars["File"] = vars['_lastDownloadPath'] || '';

        if (!vars["File"]) {
          throw new Error('Download file path is empty or undefined');
        }

        log.info(`File path: ${vars["File"]}`);

        vars["IndexCol"] = "0";
        vars["Count1"] = "1";
        log.info(`Index Column: ${vars["IndexCol"]}`);
        log.stepPass('Export file variables set up successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to set up export file variables');
        throw e;
      }

      // ── Verify Column Headers match UI and Excel ─────────────────────
      log.step('Verifying Column Headers between UI and Excel');
      try {
        while (parseFloat(String(vars["Count1"])) <= parseFloat(String("5"))) {
          log.info(`Verifying header - Count: ${vars["Count1"]}, IndexCol: ${vars["IndexCol"]}`);
          vars["IndividualHeaderUI"] = await customerPermissionPage.Individual_Column_Header_Data(vars["Count1"]).textContent() || '';
          vars["HeaderExcel"] = excelHelper.readCellByColAndRowIndex(vars['_lastDownloadPath'] || '', "0", "0", vars["IndexCol"]);
          if (vars["IndividualHeaderUI"] != "Execution Types") {
            log.info(`UI Header: ${vars["IndividualHeaderUI"]}, Excel Header: ${vars["HeaderExcel"]}`);
          }
          if (String(vars["IndividualHeaderUI"]).includes(String("CCode"))) {
            expect(String(vars["HeaderExcel"])).toBe("Ccode");
            log.info('CCode header verified');
          } else if (String(vars["IndividualHeaderUI"]).includes(String("Execution Types"))) {
            expect(String(vars["HeaderExcel"])).toBe(APP_CONSTANTS.ExecutionTypeHeaderStandard);
            vars["IndexCol"] = (parseFloat(String("1")) + parseFloat(String(vars["IndexCol"]))).toFixed(0);
            log.info('Standard Flow header verified');
            vars["HeaderExcel"] = excelHelper.readCellByColAndRowIndex(vars['_lastDownloadPath'] || '', "0", "0", vars["IndexCol"]);
            expect(String(vars["HeaderExcel"])).toBe(APP_CONSTANTS.ExecutionTypeHeaderChaseDirect);

            log.info('Chase Direct header verified');
          } else {
            expect(String(vars["IndividualHeaderUI"])).toContain(vars["HeaderExcel"]);
            log.info(`Header ${vars["IndividualHeaderUI"]} verified`);
          }

          vars["Count1"] = (parseFloat(String("1")) + parseFloat(String(vars["Count1"]))).toFixed(0);
          vars["IndexCol"] = (parseFloat(String("1")) + parseFloat(String(vars["IndexCol"]))).toFixed(0);
        }
        log.stepPass('Column Headers verification completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Column Headers');
        throw e;
      }

      // ── Get Row Count from Excel ─────────────────────────────────────
      log.step('Getting Row Count from Excel');
      try {
        vars["RowsCountExcel"] = String(excelHelper.getRowCount(vars["File"], "0"));
        log.info(`Excel Row Count: ${vars["RowsCountExcel"]}`);
        expect(String(vars["RowsCountExcel"])).toBe("2");
        log.stepPass('Row count verification passed');
      } catch (e) {
        await log.stepFail(page, 'Failed to get Row Count from Excel');
        throw e;
      }

      // ── Set up row index variables ───────────────────────────────────
      log.step('Setting up row index variables');
      try {
        vars["RowIndexExcel"] = "1";
        vars["RowIndexUI"] = "3";
        log.info(`RowIndexExcel: ${vars["RowIndexExcel"]}, RowIndexUI: ${vars["RowIndexUI"]}`);
        log.stepPass('Row index variables set up successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to set up row index variables');
        throw e;
      }

      // ── Verify Cell Data between UI and Excel ────────────────────────
      log.step('Verifying Cell Data between UI and Excel');
      try {
        while (parseFloat(String(vars["RowIndexExcel"])) <= parseFloat(String("2"))) {
          log.info(`Processing row - RowIndexExcel: ${vars["RowIndexExcel"]}, RowIndexUI: ${vars["RowIndexUI"]}`);
          vars["Count"] = "1";
          vars["IndexCol"] = "0";
          if (vars["Count"] === "1") {
            vars["ExpectedCompanyName1"] = excelHelper.readCellByColAndRowIndex(vars['_lastDownloadPath'] || '', "0", 1, "1");
            log.info(`Expected Company Name from Excel: ${vars["ExpectedCompanyName1"]}`);
          }
          else if (vars["Count"] === "2") {
            vars["ExpectedCompanyName1"] = excelHelper.readCellByColAndRowIndex(vars['_lastDownloadPath'] || '', "0", 2, "1");
            log.info(`Expected Company Name from Excel: ${vars["ExpectedCompanyName1"]}`);
          }


          while (parseFloat(String(vars["Count"])) <= parseFloat(String("5"))) {
            log.info(`Verifying cell - Count: ${vars["Count"]}, IndexCol: ${vars["IndexCol"]}`);
            await correspondentPortalPage.Heading_Customer_Permission.click();
            vars["CellDataUI"] = await customerPermissionPage.IndividualCellDataUI(vars["RowIndexUI"], vars["Count"]).textContent() || '';
            vars["CellDataExcel"] = excelHelper.readCellByColAndRowIndex(vars['_lastDownloadPath'] || '', "0", vars["RowIndexExcel"], vars["IndexCol"]);
            log.info(`UI Cell Data: ${vars["CellDataUI"]}, Excel Cell Data: ${vars["CellDataExcel"]}`);
            const cellDataUI = String(vars["CellDataUI"]);
            const cellDataExcel = String(vars["CellDataExcel"]);
            log.info(`Processing cell - UI: ${cellDataUI}, Excel: ${cellDataExcel}`);

            if (cellDataUI.includes("Standard  Chase Direct")) {
              log.info("if block satisfied - cell UI contains Standard Chase Direct - verifying permissions");
              const classAttr = await customerPermissionPage.Company_1_Standard_State(vars["ExpectedCompanyName1"]).getAttribute('class');
              if (String(classAttr).includes('text-success')) {
                expect(cellDataExcel).toContain("Allowed");
                log.info('Standard Chase Direct with text-success class verified');
              } else {
                expect(cellDataExcel).toContain("Disabled");
              }

              const classAttr1 = await customerPermissionPage.Company_1_Chase_State(vars["ExpectedCompanyName1"]).getAttribute('class');
              if (String(classAttr1).includes('text-success')) {
                expect(cellDataExcel).toContain("Allowed");
                log.info('Chase Direct with text-success class verified');
              } else {
                expect(cellDataExcel).toContain("Disabled");
              }
              vars["IndexCol"] = (parseFloat(String("1")) + parseFloat(String(vars["IndexCol"]))).toFixed(0);

            } else if (cellDataExcel.includes("ET")) {
              vars["ESTDateTimeFormatted"] = (() => {
                let raw = cellDataUI;

                // Remove extra text
                raw = raw.replace('(UTC time)', '').trim();

                // Parse as UTC
                const d = new Date(raw + ' UTC');

                // Convert to New York time
                const estDate = new Date(
                  d.toLocaleString('en-US', { timeZone: 'America/New_York' })
                );

                const MM = String(estDate.getMonth() + 1).padStart(2, '0');
                const dd = String(estDate.getDate()).padStart(2, '0');
                const yyyy = estDate.getFullYear();

                const HH = String(estDate.getHours()).padStart(2, '0');
                const mm = String(estDate.getMinutes()).padStart(2, '0');

                return `${MM}/${dd}/${yyyy} ${HH}:${mm} ET`;
                
              })();
              log.info(`Extracted and formatted EST DateTime from UI: ${vars["ESTDateTimeFormatted"]}`);
              expect(String(vars["CellDataExcel"])).toContain(vars["ESTDateTimeFormatted"]);
              log.info('Time data verification passed');
              // log.info("else if block satisfied - cell UI contains ET timestamp - verifying time data");
              // log.info('Cell contains ET timestamp - processing time conversion');
              // vars["DateUI"] = cellDataUI.split(" ")["1"] || '';
              // log.info(`Extracted DateUI: ${vars["DateUI"]}`);
              // vars["TimeUI"] = cellDataUI.split(" ")["2"] || '';
              // log.info(`Extracted TimeUI: ${vars["TimeUI"]}`);
              // vars["TimeStandardUI"] = cellDataUI.split(" ")["3"] || '';
              // log.info(`Extracted TimeStandardUI: ${vars["TimeStandardUI"]}`);
              // vars["TimeUI"] = String(vars["TimeUI"]) + ' ' + String(vars["TimeStandardUI"]);
              // log.info(`Extracted DateUI: ${vars["DateUI"]}, TimeUI: ${vars["TimeUI"]}`);

              // vars["EstTime"] = (() => {
              //   const time = vars["TimeUI"]; // e.g. "06:30 PM"
              //   const d = new Date('2000-01-01 ' + time);

              //   d.setMinutes(d.getMinutes() - 300); // subtract 300 minutes

              //   return d.toLocaleTimeString('en-US', {
              //     hour: '2-digit',
              //     minute: '2-digit',
              //     hour12: true
              //   });
              // })();
              // log.info(`Calculated EstTime: ${vars["EstTime"]}`);

              // vars["EstTime"] = String(vars["DateUI"]) + ' ' + String(vars["EstTime"]);
              // vars["ExpectedTimeExcel"] = (() => {
              //   const d = new Date(String(vars["ExpectedTimeExcel"]));
              //   const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
              //   return "MM/dd/yyyy HH:mm a".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
              // })();
              // log.info(`Formatted ExpectedTimeExcel: ${vars["ExpectedTimeExcel"]}`);

              // vars["EstTimeExcel"] = String(vars["ExpectedTimeExcel"]) + ' ' + String("ET");
              // if (String(vars["EstTimeExcel"]).includes(String("AM"))) {
              //   vars["EstTimeExcel"] = String(vars["EstTimeExcel"]).replace(/AM/g, '');
              // } else if (String(vars["EstTimeExcel"]).includes(String("PM"))) {
              //   vars["EstTimeExcel"] = String(vars["EstTimeExcel"]).replace(/PM/g, '');
              // }

              // vars["EstTimeExcel"] = String(vars["EstTimeExcel"]).trim();
              // vars["CellDataExcel"] = cellDataExcel.trim();
              // log.info(`Trimmed EstTimeExcel: ${vars["EstTimeExcel"]}`);

              // expect(String(vars["CellDataExcel"])).toContain(vars["EstTimeExcel"]);
              // log.info('Time data verification passed');
            } else {
              log.info("else block satisfied - verifying cell data contains expected Excel value");
              expect(cellDataUI).toContain(cellDataExcel);
              log.info('Cell data verification passed');
            }

            // if (String(vars["CellDataExcel"]).includes(String("ET"))) {
            //   log.info('Cell contains ET timestamp - processing time conversion');
            //   vars["DateUI"] = String(vars["CellDataUI"]).split("")["1"] || '';
            //   vars["TimeUI"] = String(vars["CellDataUI"]).split("")["2"] || '';
            //   vars["TimeStandardUI"] = String(vars["CellDataUI"]).split("")["3"] || '';
            //   vars["TimeUI"] = String(vars["TimeUI"]) + ' ' + String(vars["TimeStandardUI"]);
            //   log.info(`Extracted DateUI: ${vars["DateUI"]}, TimeUI: ${vars["TimeUI"]}`);

            //   // vars["EstTime"] = (() => {
            //   //   const d = new Date('2000-01-01 ' + String(''));
            //   //   d.setMinutes(d.getMinutes() - parseInt(String('')));
            //   //   return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            //   // })();

            //   vars["EstTime"] = (() => {
            //     const time = vars["TimeUI"]; // e.g. "06:30 PM"
            //     const d = new Date('2000-01-01 ' + time);

            //     d.setMinutes(d.getMinutes() - 300); // subtract 300 minutes

            //     return d.toLocaleTimeString('en-US', {
            //       hour: '2-digit',
            //       minute: '2-digit',
            //       hour12: true
            //     });
            //   })();
            //   log.info(`Calculated EstTime: ${vars["EstTime"]}`);

            //   vars["EstTime"] = String(vars["DateUI"]) + ' ' + String(vars["EstTime"]);
            //   vars["ExpectedTimeExcel"] = (() => {
            //     const d = new Date(String(vars["ExpectedTimeExcel"]));
            //     const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth() + 1).padStart(2, '0'), M: String(d.getMonth() + 1), dd: String(d.getDate()).padStart(2, '0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2, '0'), hh: String(d.getHours() % 12 || 12).toString().padStart(2, '0'), h: String(d.getHours() % 12 || 12), mm: String(d.getMinutes()).padStart(2, '0'), ss: String(d.getSeconds()).padStart(2, '0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
            //     return "MM/dd/yyyy HH:mm a".replace('yyyy', _p.yyyy).replace('yy', _p.yy).replace('MM', _p.MM).replace('dd', _p.dd).replace('HH', _p.HH).replace('hh', _p.hh).replace('mm', _p.mm).replace('ss', _p.ss).replace(/a/g, _p.a).replace(/M(?!M)/g, _p.M).replace(/d(?!d)/g, _p.d).replace(/h(?!h)/g, _p.h);
            //   })();
            //   log.info(`Formatted ExpectedTimeExcel: ${vars["ExpectedTimeExcel"]}`);

            //   vars["EstTimeExcel"] = String(vars["ExpectedTimeExcel"]) + ' ' + String("ET");
            //   if (String(vars["EstTimeExcel"]).includes(String("AM"))) {
            //     vars["EstTimeExcel"] = String(vars["EstTimeExcel"]).replace(/AM/g, '');
            //   } else if (String(vars["EstTimeExcel"]).includes(String("PM"))) {
            //     vars["EstTimeExcel"] = String(vars["EstTimeExcel"]).replace(/PM/g, '');
            //   }
            //   // [DISABLED] Remove Special char TimeStandardUI from EstTimeExcel and store it in runtime EstTimeExcel
            //   // vars["EstTimeExcel"] = String(vars["EstTimeExcel"]).replace(/TimeStandardUI/g, '');

            //   vars["EstTimeExcel"] = String(vars["EstTimeExcel"]).trim();
            //   vars["CellDataExcel"] = String(vars["CellDataExcel"]).trim();
            //   log.info(`Trimmed EstTimeExcel: ${vars["EstTimeExcel"]}`);

            //   expect(String(vars["CellDataExcel"])).toContain(vars["EstTimeExcel"]);
            //   log.info('Time data verification passed');
            // } 
            vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
            vars["IndexCol"] = (parseFloat(String("1")) + parseFloat(String(vars["IndexCol"]))).toFixed(0);
          }


          vars["RowIndexExcel"] = (parseFloat(String(vars["RowIndexExcel"])) + parseFloat(String("1"))).toFixed(0);
          vars["RowIndexUI"] = (parseFloat(String("1")) + parseFloat(String(vars["RowIndexUI"]))).toFixed(0);

          log.stepPass('Cell Data verification completed successfully');
        }
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Cell Data');
        throw e;
      }

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      reg_ts03_tc05_testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }

  });

  // test.afterEach(async ({ page }) => {
  //   if (reg_ts03_tc05_testFailed === true) {
  //     log.info('[AfterEach] Test failed - cleanup not required');
  //   } else {
  //     log.info('[AfterEach] Test passed - cleanup completed');
  //   }
  // });

});