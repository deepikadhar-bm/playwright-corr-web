import { test, expect } from '@playwright/test';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1405 } from '../../../src/helpers/prereqs/prereq-1405';
import { testDataManager } from 'testdata/TestDataManager';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { Logger as log } from '@helpers/log-helper';

const TC_ID = 'REG_TS01_TC04';
const TC_TITLE = 'Verify the table data..';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const profileName = 'Standard Loan Details Table';

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1405(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      log.step('Search for Bid Request and navigate to Details');
      try {
        await correspondentPortalPage.Bid_Requestsside_bar_menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.First_Bid_Request_ID.click();
        await correspondentPortalPage.Corr_Loan_Column_Sort_Arrow.waitFor({ state: 'visible' });
        vars["ExecutionTypeCheck"] = await bidRequestDetailsPage.Execution_Type_from_Details_table1.textContent() || '';
        log.info(`Execution Type detected: ${vars["ExecutionTypeCheck"]}`);
        log.stepPass('Navigated to Bid Request Details successfully');
      } catch (e) {
        await log.stepFail(page, `Failed to navigate to Bid Request Details`);
        throw e;
      }

      if (String(vars["ExecutionTypeCheck"]).includes(appconstants.STANDARD_TEXT)) {
        log.step('Verify and capture data for all rows in the Standard Loan Details table');
        try {
          await correspondentPortalPage.Corr_Loan_Column_Sort_Arrow.click();
          await priceOfferedPage.Corr_Loan_Down_Arrow_Sort.waitFor({ state: 'visible' });
          await page.waitForTimeout(5000);
          vars["SuccessStatusCount(table1)"] = String(await bidRequestDetailsPage.Success_Rowtable1_bid_request_details.count());
          vars["count"] = appconstants.ONE;
          log.info('Total rows count:' + vars["SuccessStatusCount(table1)"]);
          while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["SuccessStatusCount(table1)"]))) {
            await bidRequestDetailsPage.Bid_Request_Details_Text.click();
            vars["Loan Number(Standard)"] = await bidRequestDetailsPage.Corr_Loantable1_bid_request_details(vars['count']).textContent() || '';
            Methods.removeCharactersFromPosition(vars["Loan Number(Standard)"], '0', '7', "Loan Number(Standard)");
            vars["Last Name(Standard)"] = await bidRequestDetailsPage.Last_Nametable1_bid_request_details(vars['count']).textContent() || '';
            vars["Loan Amount(Standard)"] = await bidRequestDetailsPage.Loan_Amounttable1_bid_request_details(vars['count']).textContent() || '';
            testDataManager.updatePartialProfileDataByDataIndex(profileName, {
              'Last Name(Standard)': vars['Last Name(Standard)'],
              'Loan Number(Standard)': vars['Loan Number(Standard)'],
              'Loan Amount(Standard)': vars['Loan Amount(Standard)'],
            }, vars['count']);

            Methods.performArithmetic(vars["count"], 'ADDITION', appconstants.ONE, "count", 0);
          }
          log.stepPass('All rows processed and data stored successfully');
        } catch (e) {
          await log.stepFail(page, `Error processing table rows at count: ${vars["count"]}`);
          throw e;
        }
      } else {
        log.info('Standard Execution text not found. Skipping table verification.');
      }

      log.tcEnd('PASS');
    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});