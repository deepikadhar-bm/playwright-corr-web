// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { runPrereq_1085 } from '../../../src/helpers/prereqs/BidRequests/prereq-1085';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'REG_TS34_TC09';
const TC_TITLE = 'Verify Clear All Feature In Search Filter Dropdown';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let priceOfferedPage: PriceOfferedPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1085(page, vars);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
  });

  test(`${TC_ID}_${TC_TITLE}`, async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Step 1: Open Filter Dropdown and Click Clear All ──────────────────
      log.step('Opening filter dropdown and clicking Clear All');
      try {
        await priceOfferedPage.Filter_Dropdown1.click();
        await bidRequestPage.Clear_All.click();
        await page.waitForLoadState('networkidle');
        log.stepPass('Filter dropdown opened and Clear All clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Opening filter dropdown or clicking Clear All failed');
        throw e;
      }

      // ── Step 2: Verify unfiltered dates count after Clear All ─────────────
      log.step('Verifying unfiltered dates count after Clear All');
      try {
        vars["count"] = "1";
        vars["Count of Uploaded Date"] = String(await bidRequestsPage.Uploaded_Date_Count.count());
        vars["UnFilteredDatesCount"] = String(await bidRequestsPage.Unfiltered_Dates.count());
        expect(parseInt(vars["UnFilteredDatesCount"])).toBeGreaterThanOrEqual(1);
        log.stepPass(`Unfiltered dates count verified - Count: ${vars["UnFilteredDatesCount"]}`);
      } catch (e) {
        await log.stepFail(page, 'Verifying unfiltered dates count failed');
        throw e;
      }

      // ── Step 3: Verify company column rows after Clear All ────────────────
      log.step('Verifying company column rows after Clear All');
      try {
        vars["TotalRowCountInCompanyColumn"] = String(await priceOfferedPage.Company_NamePrice_Offered.count());
        vars["TotalRowOfFilteredCompanyColumn"] = String(await bidRequestsPage.Total_Row_with_Required_Company.count());
        log.info(`Total rows in company column: ${vars["TotalRowCountInCompanyColumn"]}, Total filtered rows: ${vars["TotalRowOfFilteredCompanyColumn"]}`);
        if (String(vars["TotalRowCountInCompanyColumn"]) === String(vars["TotalRowOfFilteredCompanyColumn"])) {
        } else {
          vars["CountOfCompaniesAfterClearAll"] = String(await bidRequestPage.Count_Of_Companies_After_Clear_All.count());
          expect(parseInt(vars["CountOfCompaniesAfterClearAll"])).toBeGreaterThanOrEqual(1);
          log.info(`Companies count after Clear All: ${vars["CountOfCompaniesAfterClearAll"]}`);
        }
        log.stepPass('Company column rows verified successfully after Clear All');
      } catch (e) {
        await log.stepFail(page, 'Verifying company column rows after Clear All failed');
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