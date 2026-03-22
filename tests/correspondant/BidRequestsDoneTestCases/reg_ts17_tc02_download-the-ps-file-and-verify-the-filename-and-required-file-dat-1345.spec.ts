// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequest2Page } from '../../../src/pages/correspondant/bid-request-2';
import { BidrequestPage } from '../../../src/pages/correspondant/bidrequest';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as fileHelper from '../../../src/helpers/file-helpers';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'REG_TS17_TC02';
const TC_TITLE = 'Download the PS file and verify the filename and required file data.';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequest2Page: BidRequest2Page;
  let bidrequestPage: BidrequestPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequest2Page = new BidRequest2Page(page);
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

      // ── Step 5: Find a Successful Loan and Download PS File ───────────────
      log.step('Finding a successful loan and downloading PS file');
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
            vars["LoanAmount"] = (await bidRequestPage.LoanAmount.first().textContent() || '').trim();
            log.info(`Loan Name: ${vars["LoanName"]}, Loan Amount (raw): ${vars["LoanAmount"]}`);
            await bidrequestPage.PS_in_Corr_Loan.first().click();
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
        log.stepPass(`PS file download initiated for loan: ${vars["LoanName"]}`);
      } catch (e) {
        await log.stepFail(page, `Finding successful loan or downloading PS file failed at row: ${vars["Rows"]}`);
        throw e;
      }

      // ── Step 6: Verify Downloaded File Name ───────────────────────────────
      log.step('Verifying downloaded PS file name');
      try {
        vars["JsonFile"] = vars['_lastDownloadPath'] ? require('path').basename(vars['_lastDownloadPath']) : '';
        log.info(`Downloaded file name: ${vars["JsonFile"]}`);
        vars["FileName"] = String('ppe-eligibility-response-') + String(vars["LoanName"]);
        log.info(`Expected file name to contain: ${vars["FileName"]}`);
        expect(String(vars["JsonFile"])).toContain(vars["FileName"]);
        log.stepPass(`Downloaded file name verified - File: ${vars["JsonFile"]} contains: ${vars["FileName"]}`);
      } catch (e) {
        await log.stepFail(page, `Verifying downloaded file name failed - File: ${vars["JsonFile"]}, Expected to contain: ${vars["FileName"]}`);
        throw e;
      }

      // ── Step 7: Verify Downloaded File Data Contains Loan Amount ──────────
      log.step('Verifying downloaded PS file data contains loan amount');
      try {
        vars["JsonFilePath"] = vars['_lastDownloadPath'] || '';
        log.info(`JsonFilePath: ${vars["JsonFilePath"]}`);

        // // Process LoanAmount — strip currency symbol and trailing character
        // vars["LoanAmount"] = String(vars["LoanAmount"]).substring(2, String(vars["LoanAmount"]).length - 1);
        // log.info(`LoanAmount after substring: ${vars["LoanAmount"]}`);

        // // Split LoanAmount by comma and recombine
        // vars["Loan"] = String(vars["LoanAmount"]).split(",")[0].trim() || '';
        // vars["Amount"] = String(vars["LoanAmount"]).split(",")[1].trim() || '';
        // log.info(`Loan part: ${vars["Loan"]}, Amount part: ${vars["Amount"]}`);
        // vars["Amount"] = String(vars["Loan"]) + String(vars["Amount"]);
        // log.info(`Final Amount (combined): ${vars["Amount"]}`);
        // Process LoanAmount — remove $ prefix and comma, append .0
        vars["LoanAmount"] = (await bidRequestPage.LoanAmount.first().textContent() || '').trim();
        log.info(`LoanAmount raw from UI: "${vars["LoanAmount"]}"`);

        // Remove $ and comma → "150025" then append ".0" → "150025.0"
        vars["Amount"] = String(vars["LoanAmount"])
          .replace('$', '')   // remove $ → "150,025"
          .replace(',', '')   // remove comma → "150025"
          .trim();

        log.info(`Amount after processing: "${vars["Amount"]}"`);

        vars["DataFromJsonFile"] = fileHelper.readJsonValue(vars["JsonFilePath"], "");
        log.info(`DataFromJsonFile: "${vars["DataFromJsonFile"]}"`);

        // expect(String(vars["DataFromJsonFile"])).toContain(vars["Amount"]);

        // vars["DataFromJsonFile"] = fileHelper.readJsonValue(vars["JsonFilePath"], "");
        // log.info(`DataFromJsonFile: "${vars["DataFromJsonFile"]}"`);

        expect(String(vars["DataFromJsonFile"])).toContain(vars["Amount"]);
        log.stepPass(`Downloaded file data verified - Data matches loan amount: ${vars["Amount"]}`);
      } catch (e) {
        await log.stepFail(page, `Verifying downloaded file data failed - JsonFilePath: ${vars["JsonFilePath"]}, LoanAmount: ${vars["LoanAmount"]}`);
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