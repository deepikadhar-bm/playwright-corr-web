import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1394 } from '../../../src/helpers/prereqs/prereq-1394';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS13_TC01';
const TC_TITLE = 'Verify that user should not be allowed to perform commit action, if the market adjustor value doesnot satisfy Max threshold condition - An error message should be shown which should bloc';


test.describe('REG_PriceOffered', () => {

  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const profileName = 'Price Offered';

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1394(page, vars);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
    
  });
  let REG_TS13_TC01testFailed = false;
  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Navigate to Price Offered and get market adjustment value');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.click();
        vars['BidReqIdPriceOffered'] = vars['RequestIDDetails'];
        log.info('Bid Request ID: ' + vars['BidReqIdPriceOffered']);
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidRequestIDPrice_Offered(vars['BidReqIdPriceOffered']).click();
        await correspondentPortalPage.Get_Price_Button.waitFor({ state: 'visible' });
        await correspondentPortalPage.Get_Price_Button.click();
        await page.waitForTimeout(5000);
        vars['FirstMarkAdjValue'] = await correspondentPortalPage.First_Market_adjustment_Value.first().textContent() || '';
        Methods.trimtestdata(vars['FirstMarkAdjValue'], 'FirstMarkAdjValue');
        Methods.removeCharactersFromPosition(vars['FirstMarkAdjValue'], '0', '3', 'MarkAdjOnScreen');
        Methods.removeSpecialChar('-', vars['FirstMarkAdjValue'], 'FirstMarkAdjValue');
        Methods.performArithmetic('0', 'ADDITION', vars['FirstMarkAdjValue'], 'FirstMarkAdjValue', 0);
        log.info('First Market Adj Value: ' + vars['FirstMarkAdjValue']);
        log.info('Market Adj On Screen: ' + vars['MarkAdjOnScreen']);
        log.stepPass('Market adjustment value captured successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture market adjustment value');
        throw e;
      }

      log.step('Navigate to Market Thresholds and set max threshold lower than market adj value');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await correspondentPortalPage.Market_Thresholds.scrollIntoViewIfNeeded();
        await correspondentPortalPage.Market_Thresholds.click();
        await priceOfferedPage.Edit_Map_Button.click();
        await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.click();
        await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.clear();
        Methods.generateRandomInteger('1', '8', 'Number');
        log.info('Random number generated: ' + vars['Number']);
        Methods.performArithmetic(vars['FirstMarkAdjValue'], 'SUBTRACTION', vars['Number'], 'NumLowerThanMarkAdj', 0);
        Methods.performArithmetic('0', 'ADDITION', vars['NumLowerThanMarkAdj'], 'NumLowerThanMarkAdjPopup', 1);
        log.info('NumLowerThanMarkAdj: ' + vars['NumLowerThanMarkAdj']);
        log.info('NumLowerThanMarkAdjPopup: ' + vars['NumLowerThanMarkAdjPopup']);
        await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.fill(vars['NumLowerThanMarkAdj']);
        await expect(priceOfferedPage.Update_Threshold_Button).toBeEnabled();
        await priceOfferedPage.Update_Threshold_Button.click();
        log.stepPass('Market threshold updated to value lower than market adj value');
      } catch (e) {
        await log.stepFail(page, 'Failed to update market threshold');
        throw e;
      }

      log.step('Navigate back to Price Offered, select loan and attempt commit');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['RequestIDDetails']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidRequestIDPrice_Offered(vars['BidReqIdPriceOffered']).click();
        await priceOfferedPage.Check_the_Loan_Num.first().waitFor({ state: 'visible' });
        await priceOfferedPage.Check_the_Loan_Num.first().check();
        vars['CorrLoan'] = await correspondentPortalPage.First_Corr_loan_Value_Unchecked.first().textContent() || '';
        Methods.trimtestdata(vars['CorrLoan'], 'CorrLoan');
        log.info('Corr Loan: ' + vars['CorrLoan']);
        // vars['ExpectedPopUpError1'] = 'Loan' + vars['space'] + vars['CorrLoan'] + vars['space'] + 'can not be committed. Market adjuster value' + vars['space'];
        Methods.concatenateWithSpace(appconstants.LOAN_TEXT,vars['CorrLoan'],'ExpectedPopUpError1');
        Methods.concatenateWithSpace(vars['ExpectedPopUpError1'],appconstants.MARKET_ADJ_ERROR_TEXT,'ExpectedPopUpError1');
        log.info('Expected error 1: ' + vars['ExpectedPopUpError1']);
        // vars['ExpectedPopUpError2'] = 'is greater than market threshold value' + vars['space'] + vars['NumLowerThanMarkAdjPopup'];
        Methods.concatenateWithSpace(appconstants.MARKET_ADJ_REASON_TEXT,vars['NumLowerThanMarkAdjPopup'],'ExpectedPopUpError2');
        log.info('Expected error 2: ' + vars['ExpectedPopUpError2']);
        await correspondentPortalPage.Get_Price_Button.click();
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
        log.stepPass('Commit attempted with loan selected');
      } catch (e) {
        await log.stepFail(page, 'Failed to attempt commit action');
        throw e;
      }

      log.step('Verify error popup is displayed with correct message');
      try {
        await expect(correspondentPortalPage.Loans_failed_to_be_added_to_commitment).toBeVisible();
        vars['ActualErrorPopup'] = await correspondentPortalPage.Loan_Greater_Text.textContent() || '';
        Methods.trimtestdata(vars['ActualErrorPopup'], 'ActualErrorPopup');
        log.info('Actual error popup: ' + vars['ActualErrorPopup']);
        await expect(page.getByText(vars['ExpectedPopUpError1'])).toBeVisible();
        Methods.verifyString(vars['ActualErrorPopup'], 'contains', vars['ExpectedPopUpError2']);
        await priceOfferedPage.Okay_Buttonpopup_price_offered_screen.click();
        log.stepPass('Error popup verified with correct message');
      } catch (e) {
        await log.stepFail(page, 'Error popup verification failed');
        throw e;
      }

      log.step('Reset market threshold to 120 and save');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await correspondentPortalPage.Market_Thresholds.scrollIntoViewIfNeeded();
        await correspondentPortalPage.Market_Thresholds.click();
        await stepGroups.stepGroup_Market_Threshold(page, vars);
        await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.type(appconstants.ONE_HUNDRED_TWEENTY);
        await expect(priceOfferedPage.Update_Threshold_Button).toBeEnabled();
        await priceOfferedPage.Update_Threshold_Button.click();
        testDataManager.updateProfileData(profileName, { 'RequestIDfrom13-1': vars['RequestIDDetails'] });
        log.stepPass('Market threshold reset to 120 successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to reset market threshold');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      REG_TS13_TC01testFailed = true;
      throw e;
    }
  });
  
  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, REG_TS13_TC01testFailed);
    try {
      log.step('Executing after-test steps: Restore market threshold to original state');
      if (REG_TS13_TC01testFailed) {
        await stepGroups.stepGroup_If_Test_case_fail(page, vars);
      }
      log.stepPass('After-test steps executed successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to execute after-test steps');
      throw e;
    }
  });
});