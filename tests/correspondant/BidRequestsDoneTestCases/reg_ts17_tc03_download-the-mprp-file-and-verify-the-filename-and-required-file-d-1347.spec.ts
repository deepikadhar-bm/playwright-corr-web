// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequest2Page } from '../../../src/pages/correspondant/bid-request-2';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidrequestPage } from '../../../src/pages/correspondant/bidrequest';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';
import * as XLSX from 'xlsx';

const TC_ID = 'REG_TS17_TC03';
const TC_TITLE = 'Download the MPRP file and verify the filename and required file data.';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequest2Page: BidRequest2Page;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidrequestPage: BidrequestPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequest2Page = new BidRequest2Page(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidrequestPage = new BidrequestPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test(`${TC_ID}_${TC_TITLE}`, async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Step 1: Load Credentials and Set Up Download Handler ──────────────
      log.step('Loading credentials and setting up download handler');
      try {
        page.on('download', async (download) => {
          const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
          await download.saveAs(filePath);
          vars['_lastDownloadPath'] = filePath;
        });
        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        log.stepPass('Credentials loaded and download handler set up successfully');
      } catch (e) {
        await log.stepFail(page, 'Loading credentials or setting up download handler failed');
        throw e;
      }

      // ── Step 2: Login to Correspondent Portal ─────────────────────────────
      log.step('Login to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to Correspondent Portal successful');
      } catch (e) {
        await log.stepFail(page, 'Login to Correspondent Portal failed');
        throw e;
      }

      // ── Step 3: Navigate to Bid Requests ──────────────────────────────────
      log.step('Navigating to Bid Requests');
      try {
        await correspondentPortalPage.Bid_Requests.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Heading_Bid_Requests).toBeVisible();
        log.stepPass('Navigated to Bid Requests successfully');
      } catch (e) {
        await log.stepFail(page, 'Navigating to Bid Requests failed');
        throw e;
      }

      // ── Step 4: Find Bid Request with more Loans than Errors ──────────────
      log.step('Finding a Bid Request with more loans than errors');
      try {
        vars["Count"] = "1";
        vars["RowsCountBidList"] = String(await bidRequestPage.LoansErrorsCount.count());
        while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["RowsCountBidList"]))) {
          vars["StatusOfBidRequestID"] = await bidrequestPage.StatusOfBidRequestID(vars["Count"]).textContent() || '';
          if (String(vars["StatusOfBidRequestID"]).includes(String("Committed"))) {
            vars["Count"] = (parseFloat(String(vars["Count"])) + parseFloat(String("1"))).toFixed(0);
          } else {
            vars["Loans&Errors"] = await bidRequestPage.LoansErrors(vars["Count"]).textContent() || '';
            log.info(`Row: ${vars["Count"]} - Loans & Errors: ${vars["Loans&Errors"]}`);
            vars["loans"] = String(vars["Loans&Errors"]).split("/")[0].trim() || '';
            vars["Errors"] = String(vars["Loans&Errors"]).split("/")[1].trim() || '';
            log.info(`Row: ${vars["Count"]} - Loans: ${vars["loans"]}, Errors: ${vars["Errors"]}`);
            if (String(vars["loans"]) > String(vars["Errors"])) {
              await bidrequestPage.BidRequestID(vars["Count"]).click();
              break;
            } else {
              vars["Count"] = (parseFloat(String(vars["Count"])) + parseFloat(String("1"))).toFixed(0);
            }
          }
        }
        log.info(`Selected Bid Request ID has ${vars["loans"]} loans and ${vars["Errors"]} errors.`);
        log.stepPass(`Bid Request found and selected at row: ${vars["Count"]}`);
      } catch (e) {
        await log.stepFail(page, `Finding Bid Request with more loans than errors failed at row: ${vars["Count"]}`);
        throw e;
      }

      // ── Step 5: Find a Successful Loan and Download MPRP File ────────────
      log.step('Finding a successful loan and downloading MPRP file');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Heading_Bid_Request_Details).toBeVisible();
        vars["Rows"] = "1";
        vars["LoanStatusCountDetails"] = String(await bidRequestPage.LoanstatusCount.count());
        log.info(`Total loan status entries: ${vars["LoanStatusCountDetails"]}`);
        while (parseFloat(String(vars["Rows"])) <= parseFloat(String(vars["LoanStatusCountDetails"]))) {
          vars["LoanStatusText"] = (await bidRequest2Page.LoanStatusText(vars["Rows"]).textContent() || '').trim();
          log.info(`Row: ${vars["Rows"]} - Loan Status: ${vars["LoanStatusText"]}`);
          if (String(vars["LoanStatusText"]) === String("Success")) {
            log.info(`Successful loan found at row: ${vars["Rows"]} inside if`);
            vars["LoanName"] = (await bidRequestPage.Corr_LoanName.textContent() || '').trim();
            vars["RequestID"] = (await bidRequestDetailsPage.Request_Id_From_Details.textContent() || '').trim();
            log.info(`Loan Name: ${vars["LoanName"]}, Request ID: ${vars["RequestID"]}`);
            await bidRequestPage.MPRP_in_Corr_Loan.first().click();
            break;
          } else {
            vars["Rows"] = (parseFloat(String(vars["Rows"])) + parseFloat(String("1"))).toFixed(0);
          }
        }
        log.info(`Successful loan found at row: ${vars["Rows"]} - Loan Name: ${vars["LoanName"]}`);
        // [DISABLED] Wait until all files are download in all browsers
        // await page.waitForTimeout(3000); // Wait for download to complete
        // Wait for download - handled by Playwright download events
        await page.waitForTimeout(2000);
        log.stepPass(`MPRP file download initiated for loan: ${vars["LoanName"]}`);
      } catch (e) {
        await log.stepFail(page, `Finding successful loan or downloading MPRP file failed at row: ${vars["Rows"]}`);
        throw e;
      }

      // ── Step 6: Verify Downloaded File Name ───────────────────────────────
      log.step('Verifying downloaded MPRP file name');
      try {
        vars["ExcelFile"] = vars['_lastDownloadPath'] ? require('path').basename(vars['_lastDownloadPath']) : '';
        log.info(`Downloaded file name: ${vars["ExcelFile"]}`);

        // Verify file name contains LoanName
        vars["FileName"] = String(vars["LoanName"]) + "-" + String(vars["RequestID"]);
        log.info(`Expected file name to contain: ${vars["FileName"]}`);
        expect(String(vars["ExcelFile"])).toContain(vars["FileName"]);
        log.stepPass(`Downloaded file name verified - File: ${vars["ExcelFile"]} contains: ${vars["FileName"]}`);
      } catch (e) {
        await log.stepFail(page, `Verifying downloaded file name failed - File: ${vars["ExcelFile"]}, Expected to contain: ${vars["FileName"]}`);
        throw e;
      }

      // ── Step 7: Verify Downloaded File is Not Empty ───────────────────────
      // ── Step 7: Verify Downloaded File is Not Empty ───────────────────────
      log.step('Verifying downloaded MPRP file is not empty');
      try {
        vars["ExcelFilePath"] = vars['_lastDownloadPath'] || '';
        log.info(`ExcelFilePath: ${vars["ExcelFilePath"]}`);

        // Read workbook and get first sheet
        const workbook = XLSX.readFile(vars["ExcelFilePath"]);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Get all cell keys — filter out special keys like !ref, !margins
        const allCells = Object.keys(worksheet).filter(key => !key.startsWith('!'));

        // Count non-empty cells
        const nonEmptyCells = allCells.filter(key => {
          const cell = worksheet[key];
          return cell && cell.v !== undefined && cell.v !== null && cell.v !== '';
        });

        vars["NonEmptyCells"] = String(nonEmptyCells.length);
        log.info(`Non-empty cells count: ${vars["NonEmptyCells"]}`);

        expect(parseInt(vars["NonEmptyCells"])).toBeGreaterThan(5);
        log.stepPass(`MPRP file is not empty - Non-empty cells count: ${vars["NonEmptyCells"]}`);
      } catch (e) {
        await log.stepFail(page, `Verifying MPRP file is not empty failed - ExcelFilePath: ${vars["ExcelFilePath"]}`);
        throw e;
      }

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }

  });
});