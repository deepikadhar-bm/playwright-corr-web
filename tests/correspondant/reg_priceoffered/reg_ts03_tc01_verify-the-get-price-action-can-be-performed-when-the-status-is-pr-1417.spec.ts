import { test, expect } from '@playwright/test';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1394 } from '../../../src/helpers/prereqs/prereq-1394';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { Logger as log } from '../../../src/helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';
import * as stepGroups from '../../../src/helpers/step-groups';


const TC_ID = 'REG_TS03_TC01';
const TC_TITLE = 'Verify the Get price action can be performed when the status is price offered';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    // await runPrereq_1394(page, vars);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  const profileName = 'Price Offered';

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    vars = {};
    const credentials = ENV.getCredentials('internal');
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);//1
    try {

      log.step('Navigate to Price Offered and search by Bid Request ID');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Price_Offered_Text).toBeVisible();
        await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
        vars["RequestIDDetails"] = "872W28B0BE69";
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        testDataManager.updateProfileData(profileName, { 'RequestIDCreated3rdScenario': vars['RequestIDDetails'] });
        log.info('RequestIDDetails: ' + vars['RequestIDDetails']);
        await priceOfferedPage.First_bid_id.click();
        await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.waitFor({ state: 'visible' });
        log.stepPass('Navigated to Price Offered and Bid Request ID found successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to navigate to Price Offered or search by Bid Request ID');
        throw e;
      }

      log.step('Verify Current Market and Current Market Diff show "-" before Get Price');
      try {
        await expect(priceOfferedPage.Current_Marketprice_offered.first()).toContainText("-");
        await expect(priceOfferedPage.Current_Market_Diffprice_offered.first()).toContainText("-");
        log.stepPass('Current Market and Current Market Diff correctly show "-" before Get Price');
      } catch (e) {
        log.stepFail(page, 'Current Market or Current Market Diff values are incorrect before Get Price');
        throw e;
      }

      log.step('Verify table row values BEFORE Get Price — IntRate, RefSecPrice, GrossPrice, HedgeRatio, MarkAdj, CurrGross');
      try {
        vars["count1"] = appconstants.ONE;
        vars["TotalRowCountInPriceOffered"] = String(await priceOfferedPage.All_Bid_Request_ID_Rowsprice_offered_screen1.count());
        log.info('TotalRowCountInPriceOffered: ' + vars['TotalRowCountInPriceOffered']);

        while (parseFloat(vars["count1"]) <= parseFloat(vars["TotalRowCountInPriceOffered"])) {
          log.info('verification Row: ' + vars['count1']);
          vars["IntRateValue"] = await priceOfferedPage.Int_Rateprice_offered_screen_table(vars['count1']).textContent() || '';
          Methods.trimWhitespace(vars["IntRateValue"], 'IntRateValue');
          await Methods.verifyTextMatchesPattern(vars["IntRateValue"], '^\\d+\\.\\d{3}\\%$');

          vars["RefSecPriceValue"] = await priceOfferedPage.Ref_Sec_Priceprice_offered_screen_table(vars['count1']).textContent() || '';
          Methods.trimWhitespace(vars["RefSecPriceValue"], 'RefSecPriceValue');
          await Methods.verifyTextMatchesPattern(vars["RefSecPriceValue"], '^\\d+\\.\\d{3}$');

          vars["GrossPriceValue"] = await priceOfferedPage.Gross_Priceprice_offered_screen_table(vars['count1']).textContent() || '';
          Methods.trimWhitespace(vars["GrossPriceValue"], 'GrossPriceValue');
          await Methods.verifyTextMatchesPattern(vars["GrossPriceValue"], '^\\d+\\.\\d{3}$');

          vars["HedgeRatioValue"] = await priceOfferedPage.Hedge_Ratioprice_offered_screen_table(vars['count1']).textContent() || '';
          Methods.trimWhitespace(vars["HedgeRatioValue"], 'HedgeRatioValue');
          await Methods.verifyTextMatchesPattern(vars["HedgeRatioValue"], '^\\d+\\.\\d{3}$');

          await expect(priceOfferedPage.Mark_Adjprice_offered_screen_table(vars['count1'])).toContainText("-");
          await expect(priceOfferedPage.Curr_Grossprice_offered_screen_table(vars['count1'])).toContainText("-");

          Methods.MathematicalOperation(vars["count1"], '+', 1, 'count1');
        }
        log.stepPass('All table row values verified successfully before Get Price');
      } catch (e) {
        log.stepFail(page, 'Table row value verification failed before Get Price');
        throw e;
      }

      log.step('Trigger Get Price action and wait for price to load');
      try {
        await correspondentPortalPage.Get_Price_Button.click();
        await page.waitForTimeout(2000);
        await priceOfferedPage.Remaining_Timeprice_offered.waitFor({ state: 'visible' });
        log.stepPass('Get Price action triggered and remaining time timer is visible');
      } catch (e) {
        log.stepFail(page, 'Failed to trigger Get Price action or remaining time did not appear');
        throw e;
      }

      log.step('Verify Current Market and Current Market Diff values AFTER Get Price');
      try {
        vars["CurrentMarketValue"] = await priceOfferedPage.Current_Marketprice_offered.textContent() || '';
        Methods.trimWhitespace(vars["CurrentMarketValue"], 'CurrentMarketValue');
        log.info('CurrentMarketValue: ' + vars['CurrentMarketValue']);
        await Methods.verifyTextMatchesPattern(vars["CurrentMarketValue"], '^\\d+\\.\\d{3}$');

        vars["CurrentMarketDiffValue"] = await priceOfferedPage.Current_Market_Diffprice_offered.textContent() || '';
        Methods.trimWhitespace(vars["CurrentMarketDiffValue"], 'CurrentMarketDiffValue');
        log.info('CurrentMarketDiffValue: ' + vars['CurrentMarketDiffValue']);
        await Methods.verifyTextMatchesPattern(vars["CurrentMarketDiffValue"], '^[+-]?\\d+\\.\\d{3}$');
        log.stepPass('Current Market and Current Market Diff values match expected pattern after Get Price');
      } catch (e) {
        log.stepFail(page, 'Current Market or Current Market Diff value verification failed after Get Price');
        throw e;
      }

      log.step('Verify table row values AFTER Get Price — IntRate, RefSecPrice, GrossPrice, HedgeRatio, MarkAdj, CurrGross');
      try {
        vars["count1"] = appconstants.ONE;
        vars["TotalRowCountInPriceOffered"] = String(await priceOfferedPage.All_Bid_Request_ID_Rowsprice_offered_screen1.count());
        log.info('TotalRowCountInPriceOffered: ' + vars['TotalRowCountInPriceOffered']);

        while (parseFloat(vars["count1"]) <= parseFloat(vars["TotalRowCountInPriceOffered"])) {

          vars["IntRateValue"] = await priceOfferedPage.Int_Rateprice_offered_screen_table(vars['count1']).textContent() || '';
          Methods.trimWhitespace(vars["IntRateValue"], 'IntRateValue');
          await Methods.verifyTextMatchesPattern(vars["IntRateValue"], '^\\d+\\.\\d{3}\\%$');

          vars["RefSecPriceValue"] = await priceOfferedPage.Ref_Sec_Priceprice_offered_screen_table(vars['count1']).textContent() || '';
          Methods.trimWhitespace(vars["RefSecPriceValue"], 'RefSecPriceValue');
          await Methods.verifyTextMatchesPattern(vars["RefSecPriceValue"], '^\\d+\\.\\d{3}$');

          vars["GrossPriceValue"] = await priceOfferedPage.Gross_Priceprice_offered_screen_table(vars['count1']).textContent() || '';
          Methods.trimWhitespace(vars["GrossPriceValue"], 'GrossPriceValue');
          await Methods.verifyTextMatchesPattern(vars["GrossPriceValue"], '^\\d+\\.\\d{3}$');

          vars["HedgeRatioValue"] = await priceOfferedPage.Hedge_Ratioprice_offered_screen_table(vars['count1']).textContent() || '';
          Methods.trimWhitespace(vars["HedgeRatioValue"], 'HedgeRatioValue');
          await Methods.verifyTextMatchesPattern(vars["HedgeRatioValue"], '^\\d+\\.\\d{3}$');

          vars["MarkAdjValue"] = await priceOfferedPage.Mark_Adjprice_offered_screen_table(vars['count1']).textContent() || '';
          Methods.trimWhitespace(vars["MarkAdjValue"], 'MarkAdjValue');
          await Methods.verifyTextMatchesPattern(vars["MarkAdjValue"], '^[+-]?\\d+\\.\\d{3}$');

          vars["CurrGrossValue"] = await priceOfferedPage.Curr_Grossprice_offered_screen_table(vars['count1']).textContent() || '';
          Methods.trimWhitespace(vars["CurrGrossValue"], 'CurrGrossValue');
          await Methods.verifyTextMatchesPattern(vars["CurrGrossValue"], '^\\d+\\.\\d{3}$');

          Methods.MathematicalOperation(vars["count1"], '+', 1, 'count1');
        }
        log.stepPass('All table row values verified successfully after Get Price');
      } catch (e) {
        log.stepFail(page, 'Table row value verification failed after Get Price');
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