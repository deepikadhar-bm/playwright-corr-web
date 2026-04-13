import { test, expect } from '@playwright/test';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1398 } from '../../../src/helpers/prereqs/prereq-1398';
import { testDataManager } from 'testdata/TestDataManager';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { Logger as log } from '@helpers/log-helper';


const TC_ID = 'REG_TS01_TC04.1';
const TC_TITLE = 'Verify the table data..';

const profileName = 'Standard Loan Details Table';
const profile = testDataManager.getProfileByName(profileName);

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1398(page, vars);
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
      log.step('Navigate to Price Offered and Search for Bid Request');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });

        await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });

        vars["TotalRowCountValue"] = String(await priceOfferedPage.All_Bid_Request_IDprice_offered1.count());

        log.info(`Total Bid Requests found: ${vars["TotalRowCountValue"]}`);
        log.stepPass('Navigated and filtered successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Price Offered or search for Bid Request');
        throw e;
      }

      log.step('Iterate through Price Offered records and verify table details');
      try {
        vars["count"] = appconstants.ONE;
        while (parseFloat(vars["count"]) <= parseFloat(vars["TotalRowCountValue"])) {
          log.info('Iteration: ' + vars["count"]);
          vars["ExecutionType(price offered screen1)"] = await priceOfferedPage.All_Execution_Typeprice_offered_screen1(vars['count']).textContent() || '';
          if (vars["ExecutionType(price offered screen1)"].includes(appconstants.EXECUTION_TYPE_STANDARD)) {
            log.info(`Processing Row ${vars["count"]}: Found STANDARD execution type`);
            await priceOfferedPage.All_Bid_Request_IDprice_offered2(vars['count']).click();
            await expect(correspondentPortalPage.Corr_Loan_Column_Sort_Arrow).toBeVisible();
            vars["TotalRowCount(price offered screen)"] = String(await priceOfferedPage.Row_Count_For_Loan_Numberprice_offered_screen.count());
            await correspondentPortalPage.Corr_Loan_Column_Sort_Arrow.click();
            await priceOfferedPage.Corr_Loan_Down_Arrow_Sort.waitFor({ state: 'visible' });
            vars["count1"] = appconstants.ONE;
            const dataList = profile?.data as Record<string, any>[];
            vars['count2'] = appconstants.ZERO;
            while (parseFloat(vars["count1"]) <= parseFloat(vars["TotalRowCount(price offered screen)"])) {
              log.info('Iteration Row:' + vars["count1"]);
              vars['Loan Number(Standard)'] = dataList[Number(vars['count2'])]['Loan Number(Standard)'];
              log.info('Loan Number(Standard)' + vars["count1"] + ': ' + vars['Loan Number(Standard)']);
              vars['Last Name(Standard)'] = dataList[Number(vars['count2'])]['Last Name(Standard)'];
              log.info('Last Name(Standard)' + vars["count1"] + ': ' + vars['Last Name(Standard)']);
              vars['Loan Amount(Standard)'] = dataList[Number(vars['count2'])]['Loan Amount(Standard)'];
              log.info('Loan Amount(Standard)' + vars["count1"] + ': ' + vars['Loan Amount(Standard)']);
              await expect(priceOfferedPage.Loan_Numberprice_offered_screen_table(vars['count1'])).toContainText(vars["Loan Number(Standard)"]);
              await expect(priceOfferedPage.Last_Nameprice_offered_screen_table(vars['count1'])).toContainText(vars["Last Name(Standard)"]);
              await expect(priceOfferedPage.Loan_Amountprice_offered_screen_table(vars['count1'])).toContainText(vars["Loan Amount(Standard)"]);
              vars["InterestRateFromTable"] = await priceOfferedPage.Int_Rateprice_offered_screen_table(vars['count1']).textContent() || '';
              Methods.trimWhitespace(vars["InterestRateFromTable"], 'InterestRateFromTable');
              expect(Methods.verifyTextMatchesPattern(vars["InterestRateFromTable"], '^\\d+\\.\\d{3}\\%$'));
              vars["ProductPriceOfferedScreen"] = await priceOfferedPage.Productprice_offered.textContent() || '';
              Methods.trimWhitespace(vars["ProductPriceOfferedScreen"], 'ProductPriceOfferedScreen');
              await expect(priceOfferedPage.Ref_Sec_Prodprice_offered_screen_table(vars['count1'])).toContainText(vars["ProductPriceOfferedScreen"]);
              vars["ReferencePriceFromTable"] = await priceOfferedPage.Ref_Sec_Priceprice_offered_screen_table(vars['count1']).textContent() || '';
              Methods.trimWhitespace(vars["ReferencePriceFromTable"], 'ReferencePriceFromTable');
              expect(Methods.verifyTextMatchesPattern(vars["ReferencePriceFromTable"], '^\\d+\\.\\d{3}$'));
              vars["GrossPriceFromTable"] = await priceOfferedPage.Gross_Priceprice_offered_screen_table(vars['count1']).textContent() || '';
              Methods.trimWhitespace(vars["GrossPriceFromTable"], 'GrossPriceFromTable');
              expect(Methods.verifyTextMatchesPattern(vars["GrossPriceFromTable"], '^\\d+\\.\\d{3}$'));
              vars["HedgeRationFromTable"] = await priceOfferedPage.Hedge_Ratioprice_offered_screen_table(vars['count1']).textContent() || '';
              Methods.trimWhitespace(vars["HedgeRationFromTable"], 'HedgeRationFromTable');
              expect(Methods.verifyTextMatchesPattern(vars["HedgeRationFromTable"], '^\\d+\\.\\d{3}$'));
              await expect(priceOfferedPage.Mark_Adjprice_offered_screen_table(vars['count1'])).toContainText("-");
              await expect(priceOfferedPage.Curr_Grossprice_offered_screen_table(vars['count1'])).toContainText("-");
              Methods.performArithmetic(vars["count1"], 'ADDITION', appconstants.ONE, "count1", 0);
              Methods.performArithmetic(vars["count2"], 'ADDITION', appconstants.ONE, "count2", 0);
            }
          }
          Methods.performArithmetic(vars["count"], 'ADDITION', appconstants.ONE, "count", 0);
        }
        log.stepPass('All table details verified successfully for STANDARD execution rows');
      } catch (e) {
        await log.stepFail(page, `Error processing table data at row: ${vars["count1"]}`);
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