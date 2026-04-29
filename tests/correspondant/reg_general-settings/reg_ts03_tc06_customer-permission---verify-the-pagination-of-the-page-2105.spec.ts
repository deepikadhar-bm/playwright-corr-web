// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { CustomerPermissionPage } from '../../../src/pages/correspondant/customer-permission';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';

const TC_ID = 'REG_TS03_TC06';
const TC_TITLE = 'Customer Permission - Verify the Pagination of the Page';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let customerPermissionPage: CustomerPermissionPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    customerPermissionPage = new CustomerPermissionPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS03_TC06_Customer Permission  - Verify the Pagination of the Page', async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Login and credentials setup ────────────────────────────────────
      log.step('Logging in to Correspondent Portal');
      try {
        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Successfully logged in to Correspondent Portal');
      } catch (e) {
        await log.stepFail(page, 'Failed to log in to Correspondent Portal');
        throw e;
      }

      // ── Wait for page load ─────────────────────────────────────────
      log.step('Waiting for page load');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - page load completed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for page load');
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
        await correspondentPortalPage.GeneralSettings_Menu.waitFor({ state: 'visible' });
        log.info('General Settings Menu is now visible');
        await correspondentPortalPage.GeneralSettings_Menu.click();
        log.info('Clicked General Settings Menu');
        log.stepPass('Successfully navigated to General Settings Menu');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to General Settings Menu');
        throw e;
      }

      // ── Wait for page load ─────────────────────────────────────────
      log.step('Waiting for page load after General Settings');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - page load completed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for page load');
        throw e;
      }

      // ── Navigate to Customer Permission Menu ──────────────────────────
      log.step('Navigating to Customer Permission Menu');
      try {
        await customerPermissionPage.CustomerPermission_Menu.click();
        log.info('Clicked Customer Permission Menu');
        log.stepPass('Successfully navigated to Customer Permission Menu');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Customer Permission Menu');
        throw e;
      }

      // ── Wait for page load ─────────────────────────────────────────
      log.step('Waiting for Customer Permission page load');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - Customer Permission page loaded');
        log.stepPass('Customer Permission page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for Customer Permission page load');
        throw e;
      }

      // ── Click on Change Page Size Dropdown ──────────────────────────────
      log.step('Clicking on Change Page Size Dropdown');
      try {
        await correspondentPortalPage.Change_Page_Size_Dropdown.click();
        log.info('Clicked Change Page Size Dropdown');
        log.stepPass('Change Page Size Dropdown clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click on Change Page Size Dropdown');
        throw e;
      }

      // ── Count the number of page size options ──────────────────────────
      log.step('Counting the number of page size options');
      try {
        vars["CountOfSetPageSize"] = String(await commitmentListPage.Set_page_size_to_Dropdown.count());
        log.info(`Total page size options available: ${vars["CountOfSetPageSize"]}`);
        log.stepPass('Page size options counted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to count page size options');
        throw e;
      }

      // ── Close the dropdown ─────────────────────────────────────────────
      log.step('Closing the page size dropdown');
      try {
        await correspondentPortalPage.Change_Page_Size_Dropdown.click();
        log.info('Clicked dropdown to close it');
        log.stepPass('Dropdown closed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to close dropdown');
        throw e;
      }

      // ── Initialize pagination loop counter ─────────────────────────────
      log.step('Initializing pagination loop counter');
      try {
        vars["count"] = "1";
        log.info('Counter initialized to: 1');
        log.stepPass('Counter initialized successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to initialize counter');
        throw e;
      }

      // ── Loop through all page size options ──────────────────────────────
      log.step(`Starting pagination verification loop - Total iterations: ${vars["CountOfSetPageSize"]}`);
      try {
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountOfSetPageSize"]))) {
          const currentIteration = String(vars["count"]);
          log.step(`Pagination iteration ${currentIteration} of ${vars["CountOfSetPageSize"]}`);

          try {
            // ── Open dropdown ──────────────────────────────────────────────
            log.step(`Opening Change Page Size Dropdown for iteration ${currentIteration}`);
            try {
              await correspondentPortalPage.Change_Page_Size_Dropdown.click();
              log.info(`Opened dropdown for iteration ${currentIteration}`);
              log.stepPass(`Dropdown opened for iteration ${currentIteration}`);
            } catch (e) {
              await log.stepFail(page, `Failed to open dropdown for iteration ${currentIteration}`);
              throw e;
            }

            // ── Extract individual page size ───────────────────────────────
            log.step(`Extracting page size option for iteration ${currentIteration}`);
            try {
              vars["IndividualSetPageSize"] = await commitmentListPage.IndividualSetPageSize(vars["count"]).textContent() || '';
              log.info(`Page size option extracted: ${vars["IndividualSetPageSize"]}`);
              log.stepPass(`Page size option extracted successfully for iteration ${currentIteration}`);
            } catch (e) {
              await log.stepFail(page, `Failed to extract page size option for iteration ${currentIteration}`);
              throw e;
            }

            // ── Select the page size option ────────────────────────────────
            log.step(`Selecting page size option: ${vars["IndividualSetPageSize"]}`);
            try {
              await commitmentListPage.IndividualSetPageSize(vars["count"]).click();
              log.info(`Clicked page size option: ${vars["IndividualSetPageSize"]}`);
              log.stepPass(`Page size option selected: ${vars["IndividualSetPageSize"]}`);
            } catch (e) {
              await log.stepFail(page, `Failed to select page size option ${vars["IndividualSetPageSize"]}`);
              throw e;
            }

            // ── Wait for page load after selection ─────────────────────────
            log.step('Waiting for page load after page size selection');
            try {
              await spinnerPage.Spinner.waitFor({ state: 'hidden' });
              log.info('Spinner disappeared - page load completed');
              log.stepPass('Page loaded successfully');
            } catch (e) {
              await log.stepFail(page, 'Failed to wait for page load');
              throw e;
            }

            // ── Count rows displayed ───────────────────────────────────────
            log.step(`Counting rows displayed for page size: ${vars["IndividualSetPageSize"]}`);
            try {
              vars["RowsCount"] = String(await priceOfferedPage.Total_Rows_Count_UIDetails.count());
              log.info(`Rows displayed on current page: ${vars["RowsCount"]}`);
              log.stepPass(`Row count retrieved: ${vars["RowsCount"]}`);
            } catch (e) {
              await log.stepFail(page, `Failed to count rows for page size ${vars["IndividualSetPageSize"]}`);
              throw e;
            }

            // ── Verify page size matches row count ──────────────────────────
            log.step(`Verifying page size matches row count - Expected: ${vars["IndividualSetPageSize"]}, Actual: ${vars["RowsCount"]}`);
            try {
              expect(String(vars["IndividualSetPageSize"])).toContain(vars["RowsCount"]);
              log.info(`Page size verification passed - Page size ${vars["IndividualSetPageSize"]} matches ${vars["RowsCount"]} rows displayed`);
              log.stepPass(`Page size ${vars["IndividualSetPageSize"]} verified successfully`);
            } catch (e) {
              await log.stepFail(page, `Page size mismatch - Expected: ${vars["IndividualSetPageSize"]}, Got: ${vars["RowsCount"]}`);
              throw e;
            }

            // ── Increment counter for next iteration ───────────────────────
            log.step(`Incrementing counter for next iteration`);
            try {
              vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
              log.info(`Counter incremented to: ${vars["count"]}`);
              log.stepPass(`Counter incremented successfully`);
            } catch (e) {
              await log.stepFail(page, 'Failed to increment counter');
              throw e;
            }

          } catch (e) {
            await log.stepFail(page, `Pagination iteration ${currentIteration} failed`);
            throw e;
          }
        }
        log.stepPass(`All ${vars["CountOfSetPageSize"]} pagination iterations completed successfully`);
      } catch (e) {
        await log.stepFail(page, 'Pagination verification loop failed');
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