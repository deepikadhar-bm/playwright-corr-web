import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../pages/correspondant/general-setting';
import { MarketThresholdPage } from '../../pages/correspondant/market-threshold';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1404 } from './prereq-1404';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'PREREQ_1380(REG_TS02_TC03)';
const TC_TITLE = 'Verify the data present in the summary';

export async function runPrereq_1380(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1404(page, vars);

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
    if (profile && profile.data) {
      vars['Expected Product(price offered)'] = profile.data[0]['Expected Product(price offered)'];
      vars['Expected Coupon(price offered)'] = profile.data[0]['Expected Coupon(price offered)'];
    }
    log.step('Iterate through Price Offered rows and verify summary data for each execution type');
    try {
      vars['count'] = appconstants.ONE;
      vars['TotalRowCount(price offered screen1)'] = String(await priceOfferedPage.All_Bid_Request_ID_Rowsprice_offered_screen1.count());
      vars['ExpectedProductCode'] = 'FN30';
      log.info('Total rows in Price Offered screen: ' + vars['TotalRowCount(price offered screen1)']);
      while (parseFloat(String(vars['count'])) <= parseFloat(String(vars['TotalRowCount(price offered screen1)']))) {
        vars['ExecutionType1(price offered screen)'] = await priceOfferedPage.All_Execution_Typeprice_offered_screen1(vars['count']).textContent() || '';
        if (String(vars['ExecutionType1(price offered screen)']).includes(String(appconstants.EXECUTION_TYPE_CHASE_DIRECT))) {
          log.info('Verifying CHASE_DIRECT row at count: ' + vars['count']);
          await priceOfferedPage.All_Bid_Request_ID2price_offered_screen1(vars['count']).click();
          await correspondentPortalPage.Get_Price_Button.waitFor({ state: 'visible' });
          await expect(priceOfferedPage.Bid_Request_IDprice_offered.first()).toContainText(vars['RequestID(bid request details)']);
          await expect(priceOfferedPage.CCodeprice_offered).toContainText(vars['CCode(bid request details)']);
          await expect(priceOfferedPage.Execution_type_Price_Offered).toContainText(appconstants.EXECUTION_TYPE_CHASE_DIRECT);
          await expect(priceOfferedPage.Companyprice_offered).toContainText(vars['Company(bid request details)']);
          await expect(priceOfferedPage.Productprice_offered).toContainText(vars['Expected Product(price offered)']);
          await expect(priceOfferedPage.Couponprice_offered).toContainText(vars['Expected Coupon(price offered)']);
          await stepGroups.stepGroup_Getting_Next_Month_From_Current_Month(page, vars);
          Methods.getMonthNameByNumber(vars['NextMonth'], 'FullNextMonthName');
          Methods.splitRangeOfCharacters(vars['FullNextMonthName'], 0, 3, 'HalfNextMonthName');
          await expect(priceOfferedPage.Sec_Monthprice_offered).toContainText(vars['HalfNextMonthName']);
          await expect(priceOfferedPage.Current_Marketprice_offered.first()).toContainText('-');
          await expect(priceOfferedPage.Current_Market_Diffprice_offered.first()).toContainText('-');
          await expect(correspondentPortalPage.Administration_Menu).toBeVisible();
          await correspondentPortalPage.Administration_Menu.click();
          await generalSettingPage.General_Settings.click();
          await correspondentPortalPage.Market_Thresholds.scrollIntoViewIfNeeded();
          await correspondentPortalPage.Market_Thresholds.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          vars['MinDisplayValue'] = await marketThresholdPage.Min_Display_Valuemarket_thresholds.first().textContent() || '';
          Methods.splitBySpecialChar(vars['MinDisplayValue'], '%', '0', 'MinDisplayValue');
          vars['MaxDisplayValue'] = await marketThresholdPage.Required_Max_Display_Value(vars['ExpectedProductCode']).textContent() || '';
          Methods.splitBySpecialChar(vars['MaxDisplayValue'], '%', '0', 'MaxDisplayValue');
          Methods.concatenateWithSpecialChar(vars['MinDisplayValue'], vars['MaxDisplayValue'], '/', 'MinMaxThreshold(expected)');
          log.info('MinMax Threshold (expected): ' + vars['MinMaxThreshold(expected)'])
          await correspondentPortalPage.Commitments_Side_Menu.click();
          await correspondentPortalPage.Price_Offered_List_Dropdown.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
          await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['RequestIDDetails']);
          await page.keyboard.press('Enter');
          await correspondentPortalPage.First_Bid_Request_ID.first().click();
          await priceOfferedPage.MinMax_Thresholdprice_offered.first().waitFor({ state: 'visible' });
          Methods.trimWhitespace(vars['MinMaxThreshold(expected)'], 'MinMaxThreshold(expected)');
          vars['ActualMinMaxThreshold'] = await priceOfferedPage.MinMax_Thresholdprice_offered.textContent() || '';
          Methods.trimWhitespace(vars['ActualMinMaxThreshold'], 'ActualMinMaxThreshold');
          expect(Methods.verifyString(vars['MinMaxThreshold(expected)'], 'equals', vars['ActualMinMaxThreshold']));
          await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        } else if (String(vars['ExecutionType1(price offered screen)']).includes(String(appconstants.EXECUTION_TYPE_STANDARD))) {
          log.info('Verifying STANDARD row at count: ' + vars['count']);
          await priceOfferedPage.All_Bid_Request_ID2price_offered_screen1(vars['count']).click();
          await correspondentPortalPage.Get_Price_Button.waitFor({ state: 'visible' });
          await expect(priceOfferedPage.Bid_Request_IDprice_offered).toContainText(vars['RequestID(bid request details)']);
          await expect(priceOfferedPage.Execution_type_Price_Offered).toContainText(appconstants.EXECUTION_TYPE_STANDARD);
          await expect(priceOfferedPage.CCodeprice_offered).toContainText(vars['CCode(bid request details)']);
          await expect(priceOfferedPage.Companyprice_offered).toContainText(vars['Company(bid request details)']);
          await expect(priceOfferedPage.Productprice_offered).toContainText(vars['Expected Product(price offered)']);
          await Methods.verifyElementContainsTextIgnoreCase(priceOfferedPage.Couponprice_offered, vars['Expected Coupon(price offered)']);
          await stepGroups.stepGroup_Getting_Next_Month_From_Current_Month(page, vars);
          Methods.getMonthNameByNumber(vars['NextMonth'], 'FullNextMonthName');
          Methods.splitRangeOfCharacters(vars['FullNextMonthName'], 0, 3, 'HalfNextMonthName');
          await expect(priceOfferedPage.Sec_Monthprice_offered).toContainText(vars['HalfNextMonthName']);
          await expect(priceOfferedPage.Current_Marketprice_offered.first()).toContainText('-');
          await expect(priceOfferedPage.Current_Market_Diffprice_offered.first()).toContainText('-');
          await expect(correspondentPortalPage.Administration_Menu).toBeVisible();
          await correspondentPortalPage.Administration_Menu.click();
          await generalSettingPage.General_Settings.click();
          await correspondentPortalPage.Market_Thresholds.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          vars['MinDisplayValue'] = await marketThresholdPage.Min_Display_Valuemarket_thresholds.textContent() || '';
          Methods.splitBySpecialChar(vars['MinDisplayValue'], '%', '0', 'MinDisplayValue');
          vars['MaxDisplayValue'] = await marketThresholdPage.Required_Max_Display_Value(vars['ExpectedProductCode']).textContent() || '';
          Methods.splitBySpecialChar(vars['MaxDisplayValue'], '%', '0', 'MaxDisplayValue');
          Methods.concatenateWithSpecialChar(vars['MinDisplayValue'], vars['MaxDisplayValue'], '/', 'MinMaxThreshold(expected)');
          log.info('MinMax Threshold (expected): ' + vars['MinMaxThreshold(expected)']);
          await correspondentPortalPage.Commitments_Side_Menu.click();
          await correspondentPortalPage.Price_Offered_List_Dropdown.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
          await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['RequestIDDetails']);
          await page.keyboard.press('Enter');
          await priceOfferedPage.Second_Bid_Request_ID.click();
          await priceOfferedPage.MinMax_Thresholdprice_offered.waitFor({ state: 'visible' });
          Methods.trimWhitespace(vars['MinMaxThreshold(expected)'], 'MinMaxThreshold(expected)');
          vars['ActualMinMaxThreshold'] = await priceOfferedPage.MinMax_Thresholdprice_offered.textContent() || '';
          Methods.trimWhitespace(vars['ActualMinMaxThreshold'], 'ActualMinMaxThreshold');
          expect(Methods.verifyString(vars['MinMaxThreshold(expected)'], 'equals', vars['ActualMinMaxThreshold']));
          await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        }
        Methods.performArithmetic('1', 'ADDITION', vars['count'], 'count', 0);
      }
      log.stepPass('Summary data verified for all execution type rows');
    } catch (e) {
      await log.stepFail(page, 'Summary data verification failed');
      throw e;
    }

    log.tcEnd('PASS');

  } catch (e) {
    await log.captureOnFailure(page, TC_ID, e);
    log.tcEnd('FAIL');
    throw e;
  }
}