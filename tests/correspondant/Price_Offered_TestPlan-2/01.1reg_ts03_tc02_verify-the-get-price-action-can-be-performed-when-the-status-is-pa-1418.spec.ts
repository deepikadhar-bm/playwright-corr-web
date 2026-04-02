import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1417 } from '../../../src/helpers/prereqs/prereq-1417';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { Logger as log } from '../../../src/helpers/log-helper';


const TC_ID = 'REG_TS03_TC02';
const TC_TITLE = 'Verify the Get price action can be performed when the status is partially committed';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1417(page, vars);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Commit first loan from Price Offered screen');
      try {
        await expect(priceOfferedPage.First_Check_Boxprice_offered_screen).toBeVisible();
        await priceOfferedPage.First_Check_Boxprice_offered_screen.first().check();
        await expect(priceOfferedPage.Commit_Selected_Footer_Buttonprice_offered).toBeEnabled();
        await priceOfferedPage.Commit_Selected_Footer_Buttonprice_offered.click();
        await priceOfferedPage.Commit_Selected_Loanspopupprice_offered_screen.waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Commit_Selected_Loanspopupprice_offered_screen).toContainText(appconstants.COMMIT_SELECTED_LOANS_TEXT_POPUP);
        await expect(page.getByText(appconstants.COMMIT_POPUP_SUCCESS_MESSAGE_PRICEOFFERED)).toBeVisible();
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        await priceOfferedPage.Yes_Commit_ButtonPopup.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Commit_Selected_Loans2popup_price_offered_screen).toContainText(appconstants.UPDATED_SUCCESSFULLY_TEXT_POPUP);
        await priceOfferedPage.Okay_Buttonpopup_price_offered_screen.click();
        await page.waitForTimeout(5000);
        log.stepPass('First loan committed successfully and success message verified');
      } catch (e) {
        log.stepFail(page, 'Failed to commit first loan from Price Offered screen');
        throw e;
      }

      log.step('Navigate back and verify status is Partially Committed');
      try {
        await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Status1price_offered_standard).toContainText(appconstants.PARTIALLYCOMMITTED_STATUS);
        log.info('RequestIDDetails: ' + vars['RequestIDDetails']);
        log.stepPass('Status correctly shows Partially Committed');
      } catch (e) {
        log.stepFail(page, 'Failed to verify Partially Committed status');
        throw e;
      }

      log.step('Navigate into bid and verify Price Offered details screen');
      try {
        await priceOfferedPage.First_bid_id.click();
        await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.waitFor({ state: 'visible' });
        await stepGroups.stepGroup_Price_offered_Details_Screen_Verification_Price_details_and_(page, vars);
        log.stepPass('Price Offered details screen verified successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to verify Price Offered details screen');
        throw e;
      }

      log.step('Trigger Get Price action and wait for price to load');
      try {
        await correspondentPortalPage.Get_Price_Button.click();
        await page.waitForTimeout(3000);
        log.stepPass('Get Price action triggered successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to trigger Get Price action');
        throw e;
      }

      log.step('Verify Current Market and Current Market Diff values AFTER Get Price');
      try {
        vars["CurrentMarketValue"] = await priceOfferedPage.Current_Marketprice_offered.first().textContent() || '';
        Methods.trimWhitespace(vars["CurrentMarketValue"], 'CurrentMarketValue');
        log.info('CurrentMarketValue: ' + vars['CurrentMarketValue']);
        await Methods.verifyTextMatchesPattern(vars["CurrentMarketValue"], '^\\d+\\.\\d{3}$');

        vars["CurrentMarketDiffValue"] = await priceOfferedPage.Current_Market_Diffprice_offered.first().textContent() || '';
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
        vars["TotalRowsCountValue"] = String(await priceOfferedPage.All_Bid_Request_ID_Rowsprice_offered_screen1.count());
        log.info('TotalRowsCountValue: ' + vars['TotalRowsCountValue']);

        while (parseFloat(vars["count1"]) <= parseFloat(vars["TotalRowsCountValue"])) {
          log.info('Verifying Row: ' + vars['count1']);

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