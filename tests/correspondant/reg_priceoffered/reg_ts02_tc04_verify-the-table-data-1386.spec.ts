import { test, expect } from '@playwright/test';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1380 } from '../../../src/helpers/prereqs/prereq-1380';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';


const TC_ID = 'REG_TS02_TC04';
const TC_TITLE = 'Verify the table data';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  const StandardProfileName = 'Standard Loan Details Table';
  const ChaseProfileName = 'Chase Direct Loan Details Table';

  test.beforeEach(async ({ page }) => {
    await runPrereq_1380(page, vars);
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

      log.step('Navigate to Bid Requests and open first Bid Request');
      try {
        await correspondentPortalPage.Bid_Requests_Side_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.First_Bid_Request_ID.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Bid Requests and opened Bid Request ID: ' + vars["RequestIDDetails"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bid Requests or open Bid Request');
        throw e;
      }

      log.step('Fetch and store Standard table (table1) loan data');
      try {
        vars["ExecutionTypeCheck"] = await bidRequestDetailsPage.Execution_Type_from_Details_table1.textContent() || '';
        vars["SuccessStatusCount(table1)"] = String(await bidRequestDetailsPage.Success_Rowtable1_bid_request_details.count());
        log.info('Execution Type (table1): ' + vars["ExecutionTypeCheck"]);
        log.info('Success Status Count (table1): ' + vars["SuccessStatusCount(table1)"]);
        await correspondentPortalPage.Corr_Loan_Column_Sort_Arrow.first().click();
        await priceOfferedPage.Corr_Loan_Down_Arrow_Sort.first().waitFor({ state: 'visible' });
        vars["count"] = appconstants.ONE;
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["SuccessStatusCount(table1)"]))) {
          log.info('Iteration (table1): ' + vars["count"]);
          await bidRequestDetailsPage.Bid_Request_Details_Text.click();
          vars["LoanNumber(table1)"] = await bidRequestDetailsPage.Corr_Loantable1_bid_request_details(vars['count']).textContent() || '';
          Methods.removeCharactersFromPosition(vars["LoanNumber(table1)"], '0', '7', "LoanNumber(table1)");
          vars["LastName(table1)"] = await bidRequestDetailsPage.Last_Nametable1_bid_request_details(vars['count']).textContent() || '';
          vars["LoanAmount(table1)"] = await bidRequestDetailsPage.Loan_Amounttable1_bid_request_details(vars['count']).textContent() || '';
          testDataManager.updatePartialProfileDataByDataIndex(StandardProfileName, {
            'Loan Number(Standard)': vars["LoanNumber(table1)"],
            'Last Name(Standard)': vars["LastName(table1)"],
            'Loan Amount(Standard)': vars["LoanAmount(table1)"],
          }, vars['count']);
          Methods.performArithmetic(vars["count"], 'ADDITION', appconstants.ONE, "count", 0);
        }
        log.stepPass('Standard table (table1) data Fetched and stored');
      } catch (e) {
        await log.stepFail(page, 'Failed to Fetch Standard table (table1) data at row: ' + vars["count"]);
        throw e;
      }

      log.step('Fetch and store Chase Direct table (table2) loan data');
      try {
        await bidRequestDetailsPage.Execution_Type_from_detailstable2.evaluate((el) => {el.scrollIntoView();});
        vars["ExecutionTypeCheck"] = await bidRequestDetailsPage.Execution_Type_from_detailstable2.textContent() || '';
        vars["SuccessStatusCount(table2)"] = String(await bidRequestDetailsPage.Success_Rowtable2_bid_request_details.count());
        log.info('Execution Type (table2): ' + vars["ExecutionTypeCheck"]);
        log.info('Success Status Count (table2): ' + vars["SuccessStatusCount(table2)"]);
        vars["count"] = appconstants.ONE;
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["SuccessStatusCount(table2)"]))) {
          log.info('Iteration (table2): ' + vars["count"]);
          await bidRequestDetailsPage.Bid_Request_Details_Text.click();
          vars["LoanNumber(table2)"] = await bidRequestDetailsPage.Corr_Loantable2_bid_request_details(vars['count']).textContent() || '';
          Methods.removeCharactersFromPosition(vars["LoanNumber(table2)"], '0', '7', "LoanNumber(table2)");
          vars["LastName(table2)"] = await bidRequestDetailsPage.Last_Nametable2_bid_request_details(vars['count']).textContent() || '';
          vars["LoanAmount(table2)"] = await bidRequestDetailsPage.Loan_Amounttable2_bid_request_details(vars['count']).textContent() || '';
          testDataManager.updatePartialProfileDataByDataIndex(ChaseProfileName, {
            'Loan Number (ChaseDirect)': vars["LoanNumber(table2)"],
            'Last Name(Chase Direct)': vars["LastName(table2)"],
            'Loan Amount(Chase Direct)': vars["LoanAmount(table2)"],
          }, vars['count']);
          Methods.performArithmetic(vars["count"], 'ADDITION', appconstants.ONE, "count", 0);
        }
        log.stepPass('Chase Direct table (table2) data Fetched and stored');
      } catch (e) {
        await log.stepFail(page, 'Failed to collect Chase Direct table (table2) data at row: ' + vars["count"]);
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});