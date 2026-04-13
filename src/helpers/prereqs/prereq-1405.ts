import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../pages/correspondant/general-setting';
import { MarketThresholdPage } from '../../pages/correspondant/market-threshold';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1395 } from './prereq-1395';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants'
import { testDataManager } from 'testdata/TestDataManager';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';


const TC_ID = 'PREREQ_1405(REG_TS01_TC03)';
const TC_TITLE = 'Verify the data present in the summary..';

export async function runPrereq_1405(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1395(page, vars);

  const bidRequestsPage = new BidRequestsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const generalSettingPage = new GeneralSettingPage(page);
  const marketThresholdPage = new MarketThresholdPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);
  const Methods = new AddonHelpers(page, vars);
  const profileName = 'Price Offered';
  const profile = testDataManager.getProfileByName(profileName);

  log.tcStart(TC_ID, TC_TITLE);
  try {
    try {
      log.step('Iterate through Price Offered rows and verify summary data and thresholds');
      if (profile && profile.data) {
        vars["Expected Product(price offered)"] = profile.data[0]['Expected Product(price offered)'];
        log.info('Expected Product(price offered): ' + vars["Expected Product(price offered)"]);
        vars["Expected Coupon(price offered)"] = profile.data[0]['Expected Coupon(price offered)'];
        log.info('Expected Coupon(price offered): ' + vars["Expected Coupon(price offered)"]);
      }
      vars["count"] = appconstants.ONE;
      vars["TotalRowCount(price offered screen1)"] = String(await priceOfferedPage.All_Bid_Request_ID_Rowsprice_offered_screen1.count());
      vars["ExpectedProductCode"] = "FN30";

      log.info(`Total rows to process: ${vars["TotalRowCount(price offered screen1)"]}`);

      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalRowCount(price offered screen1)"]))) {
        vars["ExecutionType1(price offered screen)"] = await priceOfferedPage.All_Execution_Typeprice_offered_screen1(vars['count']).textContent() || '';

        if (String(vars["ExecutionType1(price offered screen)"]).includes("STANDARD")) {
          log.info(`Processing Row ${vars["count"]}: Found STANDARD execution type`);
          // 1. Enter details and verify summary
          await priceOfferedPage.All_Bid_Request_ID2price_offered_screen1(vars['count']).click();
          await correspondentPortalPage.Get_Price_Button.waitFor({ state: 'visible' });
          await expect(priceOfferedPage.Bid_Request_IDprice_offered).toContainText(vars["RequestID(bid request details)"]);
          await expect(priceOfferedPage.Execution_type_Price_Offered).toContainText("STANDARD");
          await expect(priceOfferedPage.CCodeprice_offered).toContainText(vars["CCode(bid request details)"]);
          await expect(priceOfferedPage.Companyprice_offered).toContainText(vars["Company(bid request details)"]);
          await expect(priceOfferedPage.Productprice_offered).toContainText(vars["Expected Product(price offered)"]);
          await expect(priceOfferedPage.Couponprice_offered).toContainText(vars["Expected Coupon(price offered)"]);

          // 2. Date/Market Verification
          await stepGroups.stepGroup_Getting_Next_Month_From_Current_Month(page, vars);
          Methods.getMonthNameByNumber(vars['NextMonth'], 'FullNextMonthName');
          Methods.convertDateFormat(vars['FullNextMonthName'], 'MMMM', appconstants.MONTH_FORMAT, 'HalfNextMonthName');
          await expect(priceOfferedPage.Sec_Monthprice_offered).toContainText(vars["HalfNextMonthName"]);
          await expect(priceOfferedPage.Current_Marketprice_offered).toContainText("-");
          await expect(priceOfferedPage.Current_Market_Diffprice_offered).toContainText("-");

          // 3. Threshold check
          await expect(correspondentPortalPage.Administration_Menu).toBeVisible();
          await correspondentPortalPage.Administration_Menu.click();
          await generalSettingPage.General_Settings.click();
          await correspondentPortalPage.Market_Thresholds.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          vars["MinDisplayValue"] = await marketThresholdPage.Min_Display_Valuemarket_thresholds.textContent() || '';
          Methods.splitBySpecialChar(vars["MinDisplayValue"], "%", '0', "MinDisplayValue");
          vars["MaxDisplayValue"] = await marketThresholdPage.Required_Max_Display_Value(vars['ExpectedProductCode']).textContent() || '';
          Methods.splitBySpecialChar(vars["MaxDisplayValue"], "%", '0', "MaxDisplayValue");
          Methods.concatenateWithSpecialChar(vars["MinDisplayValue"], vars["MaxDisplayValue"], "/", "MinMaxThreshold(expected)");
          Methods.trimWhitespace(vars['MinMaxThreshold(expected)'], 'MinMaxThreshold(expected)');
          await correspondentPortalPage.Commitments_Side_Menu.click();
          await correspondentPortalPage.Price_Offered_List_Dropdown.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
          await page.keyboard.press('Enter');
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await priceOfferedPage.First_bid_id.click();
          // await expect(priceOfferedPage.MinMax_Thresholdprice_offered).toContainText(vars["MinMaxThreshold(expected)"]);
          vars["MinMaxPriceOfferedScreen"] = await priceOfferedPage.MinMax_Thresholdprice_offered.textContent() || '';
          Methods.trimWhitespace(vars["MinMaxPriceOfferedScreen"], 'MinMaxPriceOfferedScreen');
          expect(Methods.verifyString(vars["MinMaxThreshold(expected)"], 'equals', vars["MinMaxPriceOfferedScreen"]));
          await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        }
        Methods.performArithmetic(vars["count"], 'ADDITION', appconstants.ONE, "count", 0);
      }
    } catch (e) {
      await log.stepFail(page, 'Failed while iterating through Price Offered rows and verifying summary data and thresholds');
      throw e;
    }
    log.tcEnd('PASS');
  } catch (e) {
    await log.captureOnFailure(page, TC_ID, e);
    log.tcEnd('FAIL');
    throw e;
  }
}
