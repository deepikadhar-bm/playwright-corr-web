import { test, expect } from '@playwright/test';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1386 } from '../../../src/helpers/prereqs/prereq-1386';
import { testDataManager } from 'testdata/TestDataManager';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { Logger as log } from '@helpers/log-helper';


const TC_ID = 'REG_TS02_TC04.1';
const TC_TITLE = 'Verify the table data';

const standardProfileName = 'Standard Loan Details Table';
const standardProfile = testDataManager.getProfileByName(standardProfileName);

const chaseProfileName = 'Chase Direct Loan Details Table';
const chaseProfile = testDataManager.getProfileByName(chaseProfileName);

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;


  test.beforeEach(async ({ page }) => {
    await runPrereq_1386(page, vars);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Navigate to Price Offered and search for Bid Request');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.waitFor({ state: 'visible' });
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Price Offered and searched Bid Request ID: ' + vars["RequestIDDetails"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Price Offered or search Bid Request');
        throw e;
      }

      log.step('Verify Chase Direct (table1) price offered data row by row');
      try {
        vars["count"] = appconstants.ONE;
        await priceOfferedPage.BidReqId_Chase_Direct.click();
        await correspondentPortalPage.Corr_Loan_Column_Sort_Arrow.first().waitFor({ state: 'visible' });
        vars["ExecutionType(price offered screen1)"] = await priceOfferedPage.Eceution_Type_Price_Offered_Details.textContent() || '';
        Methods.trimtestdata(vars["ExecutionType(price offered screen1)"], "ExecutionType(price offered screen1)");
        Methods.verifyString(vars["ExecutionType(price offered screen1)"], 'equals', appconstants.EXECUTION_TYPE_CHASE_DIRECT);
        vars["TotalRowCount(price offered screen)"] = String(await priceOfferedPage.Row_Count_For_Loan_Numberprice_offered_screen.count());
        log.info('Chase Direct total rows: ' + vars["TotalRowCount(price offered screen)"]);
        await correspondentPortalPage.Corr_Loan_Column_Sort_Arrow.first().click();
        await priceOfferedPage.Corr_Loan_Down_Arrow_Sort.waitFor({ state: 'visible' });
        vars["count1"] = appconstants.ONE;
        const chaseDataList = chaseProfile?.data as Record<string, any>[];
        vars['count2'] = appconstants.ZERO;
        while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["TotalRowCount(price offered screen)"]))) {
          log.info('Iteration (Chase Direct): ' + vars["count1"]);
          vars['Loan Number (ChaseDirect)'] = chaseDataList[Number(vars['count2'])]['Loan Number (ChaseDirect)'];
          vars['Last Name(Chase Direct)'] = chaseDataList[Number(vars['count2'])]['Last Name(Chase Direct)'];
          vars['Loan Amount(Chase Direct)'] = chaseDataList[Number(vars['count2'])]['Loan Amount(Chase Direct)'];
          log.info('Loan Number (ChaseDirect): ' + vars['Loan Number (ChaseDirect)']);
          log.info('Last Name (Chase Direct): ' + vars['Last Name(Chase Direct)']);
          log.info('Loan Amount (Chase Direct): ' + vars['Loan Amount(Chase Direct)']);
          await expect(priceOfferedPage.Loan_Numberprice_offered_screen_table(vars['count1'])).toContainText(vars['Loan Number (ChaseDirect)']);
          await expect(priceOfferedPage.Last_Nameprice_offered_screen_table(vars['count1'])).toContainText(vars['Last Name(Chase Direct)']);
          await expect(priceOfferedPage.Loan_Amountprice_offered_screen_table(vars['count1'])).toContainText(vars['Loan Amount(Chase Direct)']);
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
        log.stepPass('Chase Direct table data verified. Rows: ' + vars["TotalRowCount(price offered screen)"]);
      } catch (e) {
        await log.stepFail(page, 'Chase Direct table data verification failed at row: ' + vars["count1"]);
        throw e;
      }

      log.step('Navigate back and verify Standard (table2) price offered data row by row');
      try {
        await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidReqId_Standard.click();
        await correspondentPortalPage.Corr_Loan_Column_Sort_Arrow.first().waitFor({ state: 'visible' });
        await correspondentPortalPage.Corr_Loan_Column_Sort_Arrow.first().click();
        await priceOfferedPage.Corr_Loan_Down_Arrow_Sort.waitFor({ state: 'visible' });
        vars["TotalRowCount(price offered screen)"] = String(await priceOfferedPage.Row_Count_For_Loan_Numberprice_offered_screen.count());
        vars["ExecutionType(price offered screen1)"] = await priceOfferedPage.Eceution_Type_Price_Offered_Details.textContent() || '';
        Methods.trimtestdata(vars["ExecutionType(price offered screen1)"], "ExecutionType(price offered screen1)");
        Methods.verifyString(vars["ExecutionType(price offered screen1)"], 'equals', appconstants.EXECUTION_TYPE_STANDARD);
        log.info('Standard total rows: ' + vars["TotalRowCount(price offered screen)"]);
        vars["count1"] = appconstants.ONE;
        const standardDataList = standardProfile?.data as Record<string, any>[];
        vars['count2'] = appconstants.ZERO;
        while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["TotalRowCount(price offered screen)"]))) {
          log.info('Iteration (Standard): ' + vars["count1"]);
          vars['Loan Number(Standard)'] = standardDataList[Number(vars['count2'])]['Loan Number(Standard)'];
          vars['Last Name(Standard)'] = standardDataList[Number(vars['count2'])]['Last Name(Standard)'];
          vars['Loan Amount(Standard)'] = standardDataList[Number(vars['count2'])]['Loan Amount(Standard)'];
          log.info('Loan Number(Standard): ' + vars['Loan Number(Standard)']);
          log.info('Last Name(Standard): ' + vars['Last Name(Standard)']);
          log.info('Loan Amount(Standard): ' + vars['Loan Amount(Standard)']);
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
        log.stepPass('Standard table data verified. Rows: ' + vars["TotalRowCount(price offered screen)"]);
      } catch (e) {
        await log.stepFail(page, 'Standard table data verification failed at row: ' + vars["count1"]);
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