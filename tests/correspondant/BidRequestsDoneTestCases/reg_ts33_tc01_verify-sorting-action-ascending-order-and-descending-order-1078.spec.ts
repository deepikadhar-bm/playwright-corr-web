// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidrequestPage } from '../../../src/pages/correspondant/bidrequest';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '../../../src/config/environments';

const TC_ID = 'REG_TS33_TC01';
const TC_TITLE = 'Verify Sorting Action [Ascending Order and Descending Order]';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidrequestPage: BidrequestPage;
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidrequestPage = new BidrequestPage(page);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test(`${TC_ID}_${TC_TITLE}`, async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Step 1: Load Credentials ──────────────────────────────────────────
      log.step('Loading credentials');
      try {
        const credentials = ENV.getCredentials('internal');
            vars["Username"] = credentials.username;
            vars["Password"] = credentials.password;
        log.stepPass('Credentials loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Loading credentials failed');
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
        await expect(correspondentPortalPage.Bid_Requests).toBeVisible();
        await correspondentPortalPage.Bid_Requests.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Bid Requests successfully');
      } catch (e) {
        await log.stepFail(page, 'Navigating to Bid Requests failed');
        throw e;
      }

      // ── Step 4: Verify sorting for first 7 column headers ─────────────────
      log.step('Verifying ascending and descending sorting for first 7 column headers');
      try {
        vars["ColumnHeadersCount"] = String(await priceOfferedPage.Columns_Headers.count());
        vars["HeadersWithoutSorting"] = " Execution Type and  #Loans / #Errors and Bid Value ";
        // [DISABLED] Click on Go to Next Page Button
        // await correspondentPortalPage.Go_to_Next_Page_Button_2.click();
        // [DISABLED] Click on Go to Next Page Button
        // await correspondentPortalPage.Go_to_Next_Page_Button_2.click();
        vars["count"] = "1";
        while (parseFloat(String(vars["count"])) <= parseFloat(String("7"))) {
          vars["IndividualHeaderName"] = await bidRequestPage.Individual_Column_Header(parseInt(vars["count"])).textContent() || '';
          vars["IndividualHeaderName"] = String(vars["IndividualHeaderName"]).substring(1, String(vars["IndividualHeaderName"]).length - 1);
          log.info(`Iteration ${vars["count"]}: Verifying column header - "${vars["IndividualHeaderName"]}"`);
          if (String(vars["HeadersWithoutSorting"]).includes(String(vars["IndividualHeaderName"]))) {
            await page.waitForLoadState('load');
            log.info(`Skipping sort verification for non-sortable column: "${vars["IndividualHeaderName"]}"`);
          } else {
            // Ascending
            await bidRequestPage.Individual_Column_Header(parseInt(vars["count"])).click();
            await spinnerPage.Spinner.waitFor({ state: 'hidden' });
            await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
            await bidrequestPage.First_Column_Data(vars["IndividualHeaderName"]).waitFor({ state: 'visible' });
            {
              const texts = await bidRequestPage.ColumnData.allTextContents();
              const sorted = [...texts].sort((a, b) => a.localeCompare(b)); // A → Z
              expect(texts).toEqual(sorted);
            }
            // Descending
            await bidRequestPage.Individual_Column_Header(parseInt(vars["count"])).click();
            await spinnerPage.Spinner.waitFor({ state: 'hidden' });
            await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
            await bidrequestPage.First_Column_Data(vars["IndividualHeaderName"]).waitFor({ state: 'visible' });
            await page.waitForTimeout(4000);
            {
              const texts = await bidRequestPage.ColumnData.allTextContents();
              const sorted = [...texts].sort((a, b) => b.localeCompare(a)); // Z → A 
              expect(texts).toEqual(sorted);
            }
            log.info(`Column "${vars["IndividualHeaderName"]}" ascending and descending sort verified`);
          }
          vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
        }
        log.stepPass('Sorting verified for all 7 column headers successfully');
      } catch (e) {
        await log.stepFail(page, `Sorting verification failed at column iteration: ${vars["count"]} - "${vars["IndividualHeaderName"]}"`);
        throw e;
      }

      // ── Step 5: Verify sorting for Requested Date column ──────────────────
      log.step('Verifying ascending and descending sorting for Requested Date column');
      try {
        vars["RequestedDateHeaderName"] = await bidRequestsPage.Requested_Date_Header.textContent() || '';
        // Ascending
        await bidRequestsPage.Requested_Date_Header.click();
        await page.waitForLoadState('load');
        await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
        await bidRequestPage.First_Requested_Date.waitFor({ state: 'visible' });
        {
          const texts = await bidRequestsPage.Requested_Date_Column_Data.allTextContents();
          const dates = texts.map(t => new Date(t).getTime());
          const sorted = [...dates].sort((a, b) => a - b); // oldest → newest
          expect(dates).toEqual(sorted);
        }
        log.info('Requested Date ascending sort verified');
        // Descending
        await bidRequestsPage.Requested_Date_Header.click();
        await page.waitForLoadState('load');
        await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
        await bidRequestPage.First_Requested_Date.waitFor({ state: 'visible' });
        {
          const texts = await bidRequestsPage.Requested_Date_Column_Data.allTextContents();
          const dates = texts.map(t => new Date(t).getTime());
          const sorted = [...dates].sort((a, b) => b - a); // newest → oldest 
          expect(dates).toEqual(sorted);
        }
        log.info('Requested Date descending sort verified');
        log.stepPass('Requested Date column ascending and descending sort verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Sorting verification failed for Requested Date column');
        throw e;
      }

      // ── Step 6: Verify sorting for Uploaded Date column ───────────────────
      log.step('Verifying ascending and descending sorting for Uploaded Date column');
      try {
        // Ascending
        await bidrequestPage.Uploaded_Date_Header.click();
        await bidRequestPage.First_Uploaded_Date.first().waitFor({ state: 'visible' });
        await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
        {
          const texts = await bidRequestsPage.Uploaded_Date_Count.allTextContents();
          const dates = texts.map(t => new Date(t).getTime());
          const sorted = [...dates].sort((a, b) => a - b); // oldest → newest
          expect(dates).toEqual(sorted);
        }
        log.info('Uploaded Date ascending sort verified');
        // Descending
        await bidrequestPage.Uploaded_Date_Header.click();
        await bidRequestPage.First_Uploaded_Date.first().waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
        {
          const texts = await bidRequestsPage.Uploaded_Date_Count.allTextContents();
          const dates = texts.map(t => new Date(t).getTime());
          const sorted = [...dates].sort((a, b) => b - a); // newest → oldest
          expect(dates).toEqual(sorted);
        }
        log.info('Uploaded Date descending sort verified');
        log.stepPass('Uploaded Date column ascending and descending sort verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Sorting verification failed for Uploaded Date column');
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