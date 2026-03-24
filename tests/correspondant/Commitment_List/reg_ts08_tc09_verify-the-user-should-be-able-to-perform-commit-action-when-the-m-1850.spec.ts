import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS08_TC09';
const TC_TITLE = 'Verify the user should be able to perform commit action when the market threshold value does not satisfy min condition';

test.describe('Commitment List - TS_2', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  let REG_TS08_TC09testFailed = false;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    bidRequestsPage = new BidRequestsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  const profileName = 'CommitmentList';
  const profile = testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {
        if (profile && profile.data) {
          vars['BidReqId'] = profile.data[0]['RequestIdFrom8-8'];
          vars['CommitmentID'] = profile.data[0]['CommitmentIdfrom8-8'];
          log.info('BidReqId: ' + vars['BidReqId']);
          log.info('CommitmentID: ' + vars['CommitmentID']);
        }
      log.step('Login to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Logged in to Correspondent Portal');
      } catch (e) {
        await log.stepFail(page, 'Failed to login to Correspondent Portal');
        throw e;
      }

      log.step('Navigate to Price Offered, get price and capture first market adjustment value');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqId']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidRequestIDPrice_Offered_New(vars['BidReqId']).click();
        await correspondentPortalPage.Get_Price_Button.click();
        await priceOfferedPage.Back_To_Commitment_List.waitFor({ state: 'visible' });
        await priceOfferedPage.Check_the_Loan_Num.first().waitFor({ state: 'visible' });
        vars['FirstMarkAdjValue'] = await correspondentPortalPage.First_Market_adjustment_Value.first().textContent() || '';
        Methods.trimtestdata(vars['FirstMarkAdjValue'], 'FirstMarkAdjValue');
        Methods.removeMultipleSpecialChars(['-'], vars['FirstMarkAdjValue'], 'FirstMarkAdjValue');
        Methods.performArithmetic('0', 'ADDITION', vars['FirstMarkAdjValue'], 'FirstMarkAdjValue', 0);
        log.info('FirstMarkAdjValue: ' + vars['FirstMarkAdjValue']);
        log.stepPass('First market adjustment value captured: ' + vars['FirstMarkAdjValue']);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Price Offered or capture market adjustment value');
        throw e;
      }

      log.step('Generate min and max threshold values above market adjustment');
      try {
        Methods.generateRandomInteger('1', '6', 'RandomIntegerForMin');
        Methods.performArithmetic(vars['FirstMarkAdjValue'], 'ADDITION', vars['RandomIntegerForMin'], 'MinValue', 0);
        Methods.generateRandomInteger('1', '2', 'RandomIntegerForMax');
        Methods.performArithmetic(vars['MinValue'], 'ADDITION', vars['RandomIntegerForMax'], 'MaxValue', 0);
        log.info('MinValue: ' + vars['MinValue']);
        log.info('MaxValue: ' + vars['MaxValue']);
        log.stepPass('Min/Max Threshold values restored successfully (Min: ' + vars['MinValue'] + ', Max: ' + vars['MaxValue'] + ')');
      } catch (e) {
        await log.stepFail(page, 'Failed to generate min and max threshold values');
        throw e;
      }

      log.step('Navigate to Market Thresholds and set min and max values');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await correspondentPortalPage.Market_Thresholds.scrollIntoViewIfNeeded();
        await correspondentPortalPage.Market_Thresholds.click();
        await stepGroups.stepGroup_Market_Threshold(page, vars);
        await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.type(vars['MaxValue']);
        await commitmentListPage.Enter_minimum_display_value_in_percentage.clear();
        await commitmentListPage.Enter_minimum_display_value_in_percentage.type(vars['MinValue']);
        await expect(priceOfferedPage.Update_Threshold_Button).toBeEnabled();
        await priceOfferedPage.Update_Threshold_Button.click();
        log.stepPass('Market threshold updated — Min: ' + vars['MinValue'] + ' | Max: ' + vars['MaxValue']);
      } catch (e) {
        await log.stepFail(page, 'Failed to set market threshold min and max values');
        throw e;
      }

      log.step('Navigate back to Price Offered, get price and verify mark adjustment values');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqId']);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidRequestIDPrice_Offered_New(vars['BidReqId']).click();
        await correspondentPortalPage.Get_Price_Button.waitFor({ state: 'visible' });
        await correspondentPortalPage.Get_Price_Button.click();
        await commitmentListPage.Individual_Mark_Adjust.waitFor({ state: 'visible' });
        await stepGroups.stepGroup_Verifying_MarkAdjValue(page, vars);
        log.stepPass('Mark adjustment values verified after threshold update');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify mark adjustment values after threshold update');
        throw e;
      }

      log.step('Navigate to Commitment List and verify threshold chips and capture loan count');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars['BidReqId']);
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await commitmentListPage.Commitment_IDCommitment_List_Page(vars['BidReqId']).first().click();
        await expect(commitmentListPage.Max_Threshold).toContainText(vars['MaxValue']);
        await expect(commitmentListPage.Min_Threshold).toContainText(vars['MinValue']);
        log.info('Max threshold chip verified: ' + vars['MaxValue']);
        log.info('Min threshold chip verified: ' + vars['MinValue']);
        vars['LoansCountBefore'] = await commitmentListPage.No_LoansCommitment_List.first().textContent() || '';
        Methods.trimtestdata(vars['LoansCountBefore'], 'LoansCountBefore');
        log.info('LoansCountBefore: ' + vars['LoansCountBefore']);
        log.stepPass('Threshold chips verified successfully (Min: ' + vars['MinValue'] + ', Max: ' + vars['MaxValue'] + ', Loan Count Before: ' + vars['LoansCountBefore'] + ')');    
        } catch (e) {
        await log.stepFail(page, 'Threshold chips mismatch or failed to capture loan count');
        throw e;
      }

      log.step('Select loan, attempt commit and verify loan count increases');
      try {
        await commitmentListPage.Total_LoansCommitment_List.click();
        await priceOfferedPage.Check_the_Loan_Num.first().waitFor({ state: 'visible' });
        await priceOfferedPage.Check_the_Loan_Num.first().click();
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await commitmentListPage.Commitment_IdAdd_To_Commit_Dropdown(vars['CommitmentID']).click();
        await correspondentPortalPage.Yes_Commit_Button.click();
        await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
        await priceOfferedPage.Okay_ButtonPopup.click();
        await commitmentListPage.Total_Committed_Loans_Tab.click();
        vars['LoansCountAfter'] = await commitmentListPage.No_LoansCommitment_List.first().textContent() || '';
        Methods.trimtestdata(vars['LoansCountAfter'], 'LoansCountAfter');
        log.info('LoansCountBefore: ' + vars['LoansCountBefore']);
        log.info('LoansCountAfter: ' + vars['LoansCountAfter']);
        Methods.verifyComparison(vars['LoansCountAfter'], '>', vars['LoansCountBefore']);
        log.stepPass('Loan committed successfully — count increased from ' + vars['LoansCountBefore'] + ' to ' + vars['LoansCountAfter']);
      } catch (e) {
        await log.stepFail(page, 'Commit failed or loan count did not increase');
        throw e;
      }

      log.step('Restore market threshold — max to 120, min to 1');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await correspondentPortalPage.Market_Thresholds.scrollIntoViewIfNeeded();
        await correspondentPortalPage.Market_Thresholds.click();
        await stepGroups.stepGroup_Market_Threshold(page, vars);
        await commitmentListPage.Enter_minimum_display_value_in_percentage.clear();
        await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.type(appconstants.ONE_HUNDRED_TWEENTY);
        await commitmentListPage.Enter_minimum_display_value_in_percentage.fill(appconstants.ONE);
        await expect(priceOfferedPage.Update_Threshold_Button).toBeEnabled();
        await priceOfferedPage.Update_Threshold_Button.click();
        log.info('Market threshold restored — Max: 120 and Min: 1');
        log.stepPass('Market threshold restored to Max: 120 and Min: 1');
      } catch (e) {
        await log.stepFail(page, 'Failed to restore market threshold');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      REG_TS08_TC09testFailed = true;
      throw e;
    }
  });

  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, REG_TS08_TC09testFailed);
    if (REG_TS08_TC09testFailed) {
      try {
        log.step('Executing after-test steps: Restoring Min/Max Threshold values');
        await stepGroups.stepGroup_Updating_Back_MinMaxThreshold(page, vars);
        log.stepPass('After-test steps executed successfully. Min/Max Threshold values restored to original state');
      } catch (e) {
        await log.stepFail(page, 'Failed to restore Min/Max Threshold values to original state');
        throw e;
      }
    }
  });
});