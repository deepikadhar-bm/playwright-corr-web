import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { PriceOfferedDetailsPage } from '../../../src/pages/correspondant/price-offered-details';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';


const TC_ID = 'REG_TS13_TC02';
const TC_TITLE = 'Verify that market adjuster value should be displayed as "-" if it doesnot satisfy min threshold condition, but should be able to perform commit action.';


test.describe('REG_PriceOffered', () => {

  let vars: Record<string, string> = {};
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let priceOfferedDetailsPage: PriceOfferedDetailsPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  let REG_TS13_TC02testFailed = false;
  const credentials = ENV.getCredentials('internal');

  const profileName = 'Price Offered';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    priceOfferedDetailsPage = new PriceOfferedDetailsPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      if (profile && profile.data) {
        vars['BidIDPriceOffered'] = profile.data[0]['RequestIDfrom13-1'];
        log.info('Bid ID Price Offered: ' + vars['BidIDPriceOffered']);
      }

      log.step('Login to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to Correspondent Portal successful');
      } catch (e) {
        await log.stepFail(page, 'Login to Correspondent Portal failed');
        throw e;
      }

      log.step('Navigate to Price Offered and commit a fresh loan');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidIDPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Bid_Request_Idprice_offered(vars['BidIDPriceOffered']).click();
        await correspondentPortalPage.Get_Price_Button.waitFor({ state: 'visible' });
        await correspondentPortalPage.Get_Price_Button.click();
        await priceOfferedPage.Remaining_Timeprice_offered.waitFor({ state: 'visible' });
        await priceOfferedPage.Required_Loan_Num.first().click();
        await correspondentPortalPage.Get_Price_Button.click();
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        await priceOfferedPage.Commit_Selected_Loans_Successful_Popup.waitFor({ state: 'visible' });
        await priceOfferedPage.Okay_Buttonpopup_price_offered_screen.click();
        await priceOfferedPage.Okay_Buttonpopup_price_offered_screen.waitFor({ state: 'hidden' });
        log.stepPass('Fresh loan committed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to commit fresh loan');
        throw e;
      }

      log.step('Capture market adjustment value from committed loan');
      try {
        await page.waitForTimeout(3000);
        vars['MarkAdjustmentValue'] = await priceOfferedPage.Locked_MarkAdjCommitment_List.first().textContent() || '';
        vars['InitialMarkAdjValue'] = vars['MarkAdjustmentValue'];
        Methods.removeSpecialChar('-', vars['MarkAdjustmentValue'], 'MarkAdjValue');
        vars['Count'] = appconstants.ZERO;
        Methods.performArithmetic(vars['Count'], 'ADDITION', vars['MarkAdjValue'], 'MarkAdjValue', 0);
        log.info('Initial Mark Adj Value: ' + vars['InitialMarkAdjValue']);
        log.info('Mark Adj Value (cleaned): ' + vars['MarkAdjValue']);
        log.stepPass('Market adjustment value captured successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture market adjustment value');
        throw e;
      }

      log.step('Navigate to Market Thresholds and set min/max values around market adj value');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await generalSettingPage.General_Settings.click();
        await correspondentPortalPage.Market_Thresholds.scrollIntoViewIfNeeded();
        await correspondentPortalPage.Market_Thresholds.click();
        await priceOfferedPage.Edit_Map_Button.click();
        vars['MinimumDisplayValue'] = await priceOfferedPage.Minimum_Display_value.textContent() || '';
        vars['MaximumDisplayValue'] = await priceOfferedPage.Maximum_Display_Value.textContent() || '';
        await priceOfferedPage.Minimum_Display_value.click();
        await priceOfferedPage.Minimum_Display_value.clear();
        Methods.generateRandomInteger('1', '5', 'Number');
        log.info('Random number (min offset): ' + vars['Number']);
        Methods.performArithmetic(vars['Number'], 'ADDITION', vars['MarkAdjValue'], 'MinDisplayValue', 0);
        log.info('MinDisplayValue: ' + vars['MinDisplayValue']);
        await priceOfferedPage.Minimum_Display_value.fill(vars['MinDisplayValue']);
        await priceOfferedPage.Maximum_Display_Value.click();
        await priceOfferedPage.Maximum_Display_Value.clear();
        Methods.generateRandomInteger('5', '10', 'Number1');
        log.info('Random number (max offset): ' + vars['Number1']);
        Methods.performArithmetic(vars['MarkAdjValue'], 'ADDITION', vars['Number1'], 'MaxDisplayvalue', 0);
        log.info('MaxDisplayvalue: ' + vars['MaxDisplayvalue']);
        await priceOfferedPage.Maximum_Display_Value.fill(vars['MaxDisplayvalue']);
        await expect(priceOfferedPage.Update_Threshold_Button).toBeEnabled();
        await priceOfferedPage.Update_Threshold_Button.click();
        log.stepPass('Market threshold min/max updated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to update market threshold');
        throw e;
      }

      log.step('Navigate back to Price Offered and verify mark adj values for uncommitted and committed loans');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidIDPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Bid_Request_Idprice_offered(vars['BidIDPriceOffered']).click();
        await correspondentPortalPage.Get_Price_Button.waitFor({ state: 'visible' });
        await correspondentPortalPage.Get_Price_Button.click();
        vars['CountofMarkAdjEnabledLoans'] = String(await priceOfferedPage.Mark_Adjustment_Value_Enabled_Loans.count());
        vars['GrossPriceValueCount'] = String(await priceOfferedPage.Gross_Price_Values_Count.count());
        vars['CommittedLoansCount'] = String(await priceOfferedPage.LockedCommitted_Loans_Count.count());
        vars['UncommittedLoansCount'] = String(await chaseFieldNamePage.Not_Committed_Loans_Count.count());
        log.info('Uncommitted loans count: ' + vars['UncommittedLoansCount']);
        log.info('Committed loans count: ' + vars['CommittedLoansCount']);
        vars['count'] = appconstants.ONE;
        while (parseFloat(String(vars['count'])) <= parseFloat(String(vars['UncommittedLoansCount']))) {
          vars['IndividualMarkAdjValue'] = await priceOfferedDetailsPage.Individual_Mark_Adjust_ValueFresh_Loans(vars['count']).textContent() || '';
          Methods.trimWhitespace(vars['IndividualMarkAdjValue'], 'IndividualMarkAdjValue');
          Methods.verifyString(vars['IndividualMarkAdjValue'], 'equals', '-');
          Methods.performArithmetic('1', 'ADDITION', vars['count'], 'count', 0);
        }
        vars['Count'] = appconstants.ONE;
        while (parseFloat(String(vars['Count'])) <= parseFloat(String(vars['CommittedLoansCount']))) {
          await expect(priceOfferedPage.Individual_Mark_Adj_Value_Commited_Loans(vars['Count'])).toContainText(vars['InitialMarkAdjValue']);
          Methods.performArithmetic('1', 'ADDITION', vars['Count'], 'Count', 0);
        }
        log.stepPass('Mark adj values verified for all uncommitted and committed loans');
      } catch (e) {
        await log.stepFail(page, 'Mark adj value verification failed');
        throw e;
      }

      log.step('Calculate expected market adjustor value and verify gross price calculations');
      try {
        vars['CurrentMarketDiffValue'] = await priceOfferedPage.Current_Market_Difference.first().textContent() || '';
        vars['HedgeRatioValue'] = await priceOfferedPage.Hedge_Ratio_Value.first().textContent() || '';
        Methods.performArithmetic(vars['CurrentMarketDiffValue'], 'MULTIPLICATION', vars['HedgeRatioValue'], 'MarketAdjustorValueAfterCommitting', 3);
        Methods.removeSpecialChar('-', vars['MarketAdjustorValueAfterCommitting'], 'MarketAdjustorValueAfterCommitting');
        Methods.removeCharactersFromPosition(vars['MarketAdjustorValueAfterCommitting'], '0', '2', 'MarketAdjustorValueAfterCommitting');
        log.info('MarketAdjustorValueAfterCommitting: ' + vars['MarketAdjustorValueAfterCommitting']);
        vars['TotalLoansCount'] = String(await priceOfferedPage.Total_LoansDetails_Screen.count());
        log.info('Total loans count: ' + vars['TotalLoansCount']);
        vars['Count1'] = appconstants.ONE;
        vars['count1'] = appconstants.ZERO;
        while (parseFloat(String(vars['Count1'])) <= parseFloat(String(vars['TotalLoansCount']))) {
          log.info('Iteration: ' + vars['Count1']);
          vars['GrossPriceValues'] = await priceOfferedPage.Gross_price_Values(vars['Count1']).textContent() || '';
          vars['IndividualNewMarkAdj'] = await priceOfferedPage.individual_new_mark_adj(vars['Count1']).textContent() || '';
          Methods.trimtestdata(vars['IndividualNewMarkAdj'], 'IndividualNewMarkAdj');
          vars['ActualCurrGrossValues'] = await priceOfferedPage.Curr_Gross_Values(vars['Count1']).textContent() || '';
          if (String(vars['IndividualNewMarkAdj']) === String('-')) {
            Methods.verifyString(vars['GrossPriceValues'], 'equals', vars['ActualCurrGrossValues']);
          } else {
            Methods.performArithmetic(vars['GrossPriceValues'], 'ADDITION', vars['IndividualNewMarkAdj'], 'GrossPriceAndMarkAdjExpected', 3);
            Methods.verifyString(vars['ActualCurrGrossValues'], 'contains', vars['GrossPriceAndMarkAdjExpected']);
            Methods.verifyString(vars['IndividualNewMarkAdj'], 'contains', vars['MarketAdjustorValueAfterCommitting']);
          }
          Methods.performArithmetic('1', 'ADDITION', vars['Count1'], 'Count1', 0);
        }
        log.stepPass('Gross price calculations verified for all loans');
      } catch (e) {
        await log.stepFail(page, 'Gross price calculation verification failed');
        throw e;
      }

      log.step('Commit the required loan and verify successful popup');
      try {
        await priceOfferedPage.Required_Loan_Num.first().click();
        await correspondentPortalPage.Get_Price_Button.click();
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        await priceOfferedPage.Commit_Selected_Loans_Successful_Popup.waitFor({ state: 'visible' });
        vars['ActualSuccesfullyCreatedPopup'] = await priceOfferedPage.Commit_Selected_Loans_Successful_Popup.textContent() || '';
        Methods.trimtestdata(vars['ActualSuccesfullyCreatedPopup'], 'ActualSuccesfullyCreatedPopup');
        vars['CommitmentIDPopup'] = await priceOfferedPage.Commitment_ID.textContent() || '';
        Methods.trimtestdata(vars['CommitmentIDPopup'], 'CommitmentIDPopup');
        log.info('Commitment ID: ' + vars['CommitmentIDPopup']);
        log.info('Actual popup: ' + vars['ActualSuccesfullyCreatedPopup']);
         Methods.splitByWhiteSpace(vars['ActualSuccesfullyCreatedPopup'], '0', 'ActualSuccesfullyCreatedPopup_1');
        Methods.splitByWhiteSpace(vars['ActualSuccesfullyCreatedPopup'], '2', 'ActualSuccesfullyCreatedPopup_2');
        Methods.splitByWhiteSpace(vars['ActualSuccesfullyCreatedPopup'], '3', 'ActualSuccesfullyCreatedPopup_3');
        Methods.splitByWhiteSpace(vars['ActualSuccesfullyCreatedPopup'], '4', 'ActualSuccesfullyCreatedPopup_4');
        Methods.concatenateWithSpace(vars['ActualSuccesfullyCreatedPopup_1'], vars['CommitmentIDPopup'], 'ExpectedCreatedPopup_1');
        Methods.concatenateWithSpace(vars['ExpectedCreatedPopup_1'], vars['ActualSuccesfullyCreatedPopup_2'], 'ExpectedCreatedPopup_2');
        Methods.concatenateWithSpace(vars['ExpectedCreatedPopup_2'], vars['ActualSuccesfullyCreatedPopup_3'], 'ExpectedCreatedPopup_3');
        Methods.concatenateWithSpace(vars['ExpectedCreatedPopup_3'], vars['ActualSuccesfullyCreatedPopup_4'], 'ExpectedCreatedPopup_4');
        expect(Methods.verifyString(vars['ActualSuccesfullyCreatedPopup'], 'equals', vars['ExpectedCreatedPopup_4']));
        await priceOfferedPage.Okay_ButtonPopup.click();
        log.stepPass('Loan committed successfully and popup verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to commit loan or verify popup');
        throw e;
      }

      log.step('Reset market threshold to default values (min: 1, max: 120)');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await generalSettingPage.General_Settings.click();
        await correspondentPortalPage.Market_Thresholds.click();
        await priceOfferedPage.Edit_Map_Button.click();
        await priceOfferedPage.Maximum_Display_Value.click();
        await priceOfferedPage.Minimum_Display_value.clear();
        await priceOfferedPage.Minimum_Display_value.fill(appconstants.ONE);
        await priceOfferedPage.Maximum_Display_Value.fill(appconstants.ONE_HUNDRED_TWEENTY);
        if(await priceOfferedPage.Update_Threshold_Button.isEnabled){
        await priceOfferedPage.Update_Threshold_Button.click();
        }
        log.stepPass('Market threshold reset to default values successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to reset market threshold');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      REG_TS13_TC02testFailed = true;
      throw e;
    }
  });

  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, REG_TS13_TC02testFailed);
    try {
      log.step('Executing after-test steps: Restore market threshold to original state');
      if (REG_TS13_TC02testFailed) {
        await correspondentPortalPage.Administration_Menu.click();
        await generalSettingPage.General_Settings.click();
        await correspondentPortalPage.Market_Thresholds.click();
        await priceOfferedPage.Edit_Map_Button.click();
        await priceOfferedPage.Minimum_Display_value.clear();
        await priceOfferedPage.Minimum_Display_value.fill(appconstants.ONE);
        await priceOfferedPage.Maximum_Display_Value.clear();
        await priceOfferedPage.Maximum_Display_Value.fill(appconstants.ONE_HUNDRED_TWEENTY);
        if(await priceOfferedPage.Update_Threshold_Button.isEnabled){
        await priceOfferedPage.Update_Threshold_Button.click();
        }      
      }
      log.stepPass('After-test steps executed successfully. Market threshold restored to original state');
    } catch (e) {
      await log.stepFail(page, 'Failed to restore market threshold to original state');
      throw e;
    }
  });
});