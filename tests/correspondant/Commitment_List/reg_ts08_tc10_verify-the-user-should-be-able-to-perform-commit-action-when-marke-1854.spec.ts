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


const TC_ID = 'REG_TS08_TC10';
const TC_TITLE = 'Verify the user should be able to perform commit action when market threshold value is valid but updated market threshold does not satisfy';

test.describe('Commitment List - TS_2', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  let REG_TS08_TC10testFailed = false;
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
        await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.waitFor({ state: 'visible' });
        await correspondentPortalPage.Get_Price_Button.click();
        await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.waitFor({ state: 'visible' });
        await priceOfferedPage.Check_the_Loan_Num.first().waitFor({ state: 'visible' });
        vars['FirstMarkAdj'] = await correspondentPortalPage.First_Market_adjustment_Value.first().textContent() || '';
        Methods.trimtestdata(vars['FirstMarkAdj'], 'FirstMarkAdj');
        Methods.removeMultipleSpecialChars(['-'], vars['FirstMarkAdj'], 'FirstMarkAdj');
        Methods.performArithmetic('0', 'ADDITION', vars['FirstMarkAdj'], 'FirstMarkAdj', 0);
        log.info('FirstMarkAdj: ' + vars['FirstMarkAdj']);
        log.stepPass('First market adjustment value captured: ' + vars['FirstMarkAdj']);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Price Offered or capture market adjustment value');
        throw e;
      }

      log.step('Navigate to Commitment List and capture min/max threshold before change');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Search_Dropdown.type(vars['BidReqId']);
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Commitment_IDCommitment_List_Page(vars['BidReqId']).first().click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['MinMaxThresholdBefore'] = await priceOfferedPage.MinMax_ThresholdDetails.first().textContent() || '';
        Methods.trimtestdata(vars['MinMaxThresholdBefore'], 'MinMaxThresholdBefore');
        log.info('MinMaxThresholdBefore: ' + vars['MinMaxThresholdBefore']);
        log.stepPass('Min/max threshold captured before change: ' + vars['MinMaxThresholdBefore']);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Commitment List or capture threshold');
        throw e;
      }

      log.step('Navigate to Market Thresholds and set max threshold below market adjustment');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await correspondentPortalPage.Market_Thresholds.scrollIntoViewIfNeeded();
        await correspondentPortalPage.Market_Thresholds.click();
        await stepGroups.stepGroup_Market_Threshold(page, vars);
        Methods.generateRandomInteger('3', '6', 'RandomInteger');
        log.info('RandomInteger (3-6 range): ' + vars['RandomInteger']);
        Methods.performArithmetic(vars['FirstMarkAdj'], 'SUBTRACTION', vars['RandomInteger'], 'NumberLessThanMarkAdj', 0);
        log.info('NumberLessThanMarkAdj: ' + vars['NumberLessThanMarkAdj']);
        await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.type(vars['NumberLessThanMarkAdj']);
        await expect(priceOfferedPage.Update_Threshold_Button).toBeEnabled();
        await priceOfferedPage.Update_Threshold_Button.click();
        log.stepPass('Max threshold set to: ' + vars['NumberLessThanMarkAdj'] + ' (below market adjustment: ' + vars['FirstMarkAdj'] + ')');
      } catch (e) {
        await log.stepFail(page, 'Failed to set market threshold below market adjustment');
        throw e;
      }

      log.step('Reload and navigate to Commitment List, capture loan count before commit attempt');
      try {
        await page.reload();
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Search_Dropdown.type(vars['BidReqId']);
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Commitment_IDCommitment_List_Page(vars['BidReqId']).first().click();
        vars['NoOfLoansBefore'] = await commitmentListPage.No_LoansCommitment_List.first().textContent() || '';
        Methods.trimtestdata(vars['NoOfLoansBefore'], 'NoOfLoansBefore');
        log.info('NoOfLoansBefore: ' + vars['NoOfLoansBefore']);
        log.stepPass('Loan count captured before commit attempt: ' + vars['NoOfLoansBefore']);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Commitment List or capture loan count');
        throw e;
      }

      log.step('Select loan, attempt commit and verify commit succeeds with no error popup');
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
        vars['NoOfLoansAfter'] = await commitmentListPage.No_Loans_Last.first().textContent() || '';
        Methods.trimtestdata(vars['NoOfLoansAfter'], 'NoOfLoansAfter');
        log.info('NoOfLoansBefore: ' + vars['NoOfLoansBefore']);
        log.info('NoOfLoansAfter: ' + vars['NoOfLoansAfter']);
        Methods.verifyString(vars['NoOfLoansBefore'], 'equals', vars['NoOfLoansAfter']);
        log.stepPass('Loan count verified unchanged after commit attempt. Count: ' + vars['NoOfLoansAfter']);
      } catch (e) {
        await log.stepFail(page, 'Commit failed or loan count mismatch after commit attempt');
        throw e;
      }

      log.step('Restore market threshold to 120 and update test data profile');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await correspondentPortalPage.Market_Thresholds.scrollIntoViewIfNeeded();
        await correspondentPortalPage.Market_Thresholds.click();
        await stepGroups.stepGroup_Market_Threshold(page, vars);
        await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.type(appconstants.ONE_HUNDRED_TWEENTY);
        await expect(priceOfferedPage.Update_Threshold_Button).toBeEnabled();
        await priceOfferedPage.Update_Threshold_Button.click();
        log.info('Market threshold restored to 120');
        testDataManager.updateProfileData('CommitmentList', { 'CommitmentIDfrom8-10': vars['CommitmentID'] });
        log.info('Updated CommitmentList profile - CommitmentIDfrom8-10: ' + vars['CommitmentID']);
        log.stepPass('Market threshold restored to 120 and test data profile updated');
      } catch (e) {
        await log.stepFail(page, 'Failed to restore market threshold or update test data profile');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      REG_TS08_TC10testFailed = true;
      throw e;
    }
  });

  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, REG_TS08_TC10testFailed);
    if (REG_TS08_TC10testFailed) {
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