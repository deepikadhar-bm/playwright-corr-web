import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1394 } from '../../../src/helpers/prereqs/prereq-1394';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS08_TC08';
const TC_TITLE = 'Verify the user should not be able to perform commit action when the market threshold value exceeds';

test.describe('Commitment List - TS_2', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;


  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1394(page, vars);
    bidRequestsPage = new BidRequestsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });
  let REG_TS08_TC08testFailed = false;
  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Navigate to Price Offered List and open bid request');
      try {
        vars['BidReqId'] = vars['RequestIDDetails'];
        log.info('BidReqId: ' + vars['BidReqId']);
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqId']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidRequestIDPrice_Offered_New(vars['BidReqId']).first().click();
        await priceOfferedPage.BackTo_PriceofferedPage.waitFor({ state: 'visible' });
        await priceOfferedPage.Check_the_Loan_Num.first().waitFor({ state: 'visible' });
        log.stepPass('Navigated to Price Offered and opened bid: ' + vars['BidReqId']);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Price Offered or open bid: ' + vars['BidReqId']);
        throw e;
      }

      log.step('Get price and capture first market adjustment value');
      try {
        await correspondentPortalPage.Get_Price_Button.click();
        await page.waitForTimeout(5000);
        vars['FirstMarkAdj'] = await correspondentPortalPage.First_Market_adjustment_Value.first().textContent() || '';
        Methods.trimtestdata(vars['FirstMarkAdj'], 'FirstMarkAdj');
        Methods.removeMultipleSpecialChars(['-'], vars['FirstMarkAdj'], 'FirstMarkAdj');
        Methods.performArithmetic('0', 'ADDITION', vars['FirstMarkAdj'], 'FirstMarkAdj', 0);
        log.info('FirstMarkAdj: ' + vars['FirstMarkAdj']);
        log.stepPass('First market adjustment value captured: ' + vars['FirstMarkAdj']);
      } catch (e) {
        await log.stepFail(page, 'Failed to capture first market adjustment value');
        throw e;
      }

      log.step('Select loan, get price and commit to create a commitment');
      try {
        await priceOfferedPage.Check_the_Loan_Num.first().click();
        await expect(priceOfferedPage.Get_Price_Button).toBeEnabled();
        await priceOfferedPage.Get_Price_Button.click();
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
        vars['CommitmentID'] = await priceOfferedPage.Commitment_IdPrice_Offered.textContent() || '';
        Methods.trimtestdata(vars['CommitmentID'], 'CommitmentID');
        log.info('CommitmentID: ' + vars['CommitmentID']);
        await priceOfferedPage.Okay_ButtonPopup.click();
        await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
        log.stepPass('Loan committed successfully. CommitmentID: ' + vars['CommitmentID']);
      } catch (e) {
        await log.stepFail(page, 'Failed to commit loan or capture CommitmentID');
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
        Methods.performArithmetic('0', 'ADDITION', vars['NumberLessThanMarkAdj'], 'NumLowerThanMarkAdjPopup', 1);
        log.info('NumLowerThanMarkAdjPopup: ' + vars['NumLowerThanMarkAdjPopup']);
        await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.type(vars['NumberLessThanMarkAdj']);
        await expect(priceOfferedPage.Update_Threshold_Button).toBeEnabled();
        await priceOfferedPage.Update_Threshold_Button.click();
        log.stepPass('Max threshold set to: ' + vars['NumberLessThanMarkAdj'] + ' (below market adjustment: ' + vars['FirstMarkAdj'] + ')');
      } catch (e) {
        await log.stepFail(page, 'Failed to set market threshold below market adjustment');
        throw e;
      }

      log.step('Reload and navigate back to Price Offered, get price with updated threshold');
      try {
        await page.reload();
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqId']);
        await page.keyboard.press('Enter');
        await priceOfferedPage.BidRequestIDPrice_Offered_New(vars['BidReqId']).click();
        await correspondentPortalPage.Get_Price_Button.click();
        log.stepPass('Navigated back to Price Offered and got price with updated threshold');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Price Offered or get price after threshold change');
        throw e;
      }

      log.step('Navigate to Commitment List and capture loan count before commit attempt');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Search_Dropdown.type(vars['BidReqId']);
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Commitment_IDCommitment_List_Page(vars['BidReqId']).first().click();
        await commitmentListPage.No_LoansCommitment_List.first().waitFor({ state: 'visible' });
        vars['NoOfLoansBefore'] = await commitmentListPage.No_LoansCommitment_List.first().textContent() || '';
        Methods.trimtestdata(vars['NoOfLoansBefore'], 'NoOfLoansBefore');
        log.info('NoOfLoansBefore: ' + vars['NoOfLoansBefore']);
        log.stepPass('Loan count captured before commit attempt: ' + vars['NoOfLoansBefore']);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Commitment List or capture loan count');
        throw e;
      }

      log.step('Select loan and attempt commit — verify error popup shown due to threshold exceeded');
      try {
        await commitmentListPage.Total_LoansCommitment_List.click();
        await priceOfferedPage.Check_the_Loan_Num.first().waitFor({ state: 'visible' });
        await priceOfferedPage.Check_the_Loan_Num.first().check();
        await priceOfferedPage.Checked_Corr_Loan.waitFor({ state: 'visible' });
        vars['CorrLoan'] = await priceOfferedPage.Checked_Corr_Loan.textContent() || '';
        Methods.trimtestdata(vars['CorrLoan'], 'CorrLoan');
        log.info('CorrLoan: ' + vars['CorrLoan']);
        await stepGroups.stepGroup_Storing_PopUpError(page, vars);
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await commitmentListPage.Commitment_IdAdd_To_Commit_Dropdown(vars['CommitmentID']).click();
        await correspondentPortalPage.Yes_Commit_Button.click();
        await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
        await expect(correspondentPortalPage.Loans_failed_to_be_added_to_commitment).toBeVisible();
        vars['ActualErrorPopup'] = await correspondentPortalPage.Loan_Greater_Text.textContent() || '';
        Methods.trimtestdata(vars['ActualErrorPopup'], 'ActualErrorPopup');
        log.info('ActualErrorPopup: ' + vars['ActualErrorPopup']);
        await expect(page.getByText(vars['ExpectedPopUpError1'])).toBeVisible();
        Methods.verifyString(vars['ActualErrorPopup'], 'contains', vars['ExpectedPopUpError2']);
        log.stepPass('Error popup verified — commit blocked due to market threshold exceeded');
      } catch (e) {
        await log.stepFail(page, 'Commit error popup not shown or error message mismatch');
        throw e;
      }

      log.step('Dismiss popup and verify loan count unchanged, max threshold matches');
      try {
        await priceOfferedPage.Okay_ButtonPopup.click();
        await commitmentListPage.Total_Committed_Loans_Tab.click();
        vars['NoOfLoansAfter'] = await commitmentListPage.No_LoansCommitment_List.first().textContent() || '';
        Methods.trimtestdata(vars['NoOfLoansAfter'], 'NoOfLoansAfter');
        log.info('NoOfLoansAfter: ' + vars['NoOfLoansAfter']);
        Methods.verifyString(vars['NoOfLoansBefore'], 'equals', vars['NoOfLoansAfter']);
        vars['MaxThreshold'] = await commitmentListPage.Max_Threshold.first().textContent() || '';
        Methods.trimtestdata(vars['MaxThreshold'], 'MaxThreshold');
        log.info('MaxThreshold: ' + vars['MaxThreshold']);
        Methods.verifyString(vars['MaxThreshold'], 'contains', vars['NumberLessThanMarkAdj']);
        log.stepPass('Loan count unchanged and max threshold verified. Count: ' + vars['NoOfLoansAfter'] + ' | MaxThreshold: ' + vars['MaxThreshold']);
      } catch (e) {
        await log.stepFail(page, 'Loan count changed or max threshold mismatch after failed commit');
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
        testDataManager.updateProfileData('CommitmentList', { 'RequestIdFrom8-8': vars['BidReqId'] });
        testDataManager.updateProfileData('CommitmentList', { 'CommitmentIdfrom8-8': vars['CommitmentID'] });
        log.info('Updated CommitmentList profile - RequestIdFrom8-8: ' + vars['BidReqId']);
        log.info('Updated CommitmentList profile - CommitmentIdfrom8-8: ' + vars['CommitmentID']);
        log.stepPass('Market threshold restored to 120 and test data profile updated');
      } catch (e) {
        await log.stepFail(page, 'Failed to restore market threshold or update test data profile');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      REG_TS08_TC08testFailed = true;
      throw e;
    }
  });
  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, REG_TS08_TC08testFailed);
    if (REG_TS08_TC08testFailed) {
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