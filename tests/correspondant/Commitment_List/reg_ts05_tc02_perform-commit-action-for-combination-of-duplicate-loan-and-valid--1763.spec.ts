import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';


const TC_ID = 'REG_TS05_TC02';
const TC_TITLE = 'Perform commit action for combination of duplicate loan and valid loan, verify that commitment should be created and no loans should be displayed and that commitment record should be displayed';


test.describe('Commitment List - TS_2', () => {

  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  const profileName = 'CommitmentList';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Login to CORR portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login successful');
      } catch (e) {
        await log.stepFail(page, 'Login failed');
        throw e;
      }

      log.step('Navigate to Price Offered list and capture auth limit and loan numbers before commit');
      try {
        if (profile && profile.data) {
          vars['BidReqId'] = profile.data[0]['RequestIdFrom5-1'];
          log.info('RequestIdFrom5-1: ' + vars['BidReqId']);
        }
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqId']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidReqId_Standard.click();
        await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
        await priceOfferedPage.Committed_Loan_NumStandard.first().waitFor({ state: 'visible' });
        vars['CommittedLoanNumStandard'] = await priceOfferedPage.Committed_Loan_NumStandard.first().textContent() || '';
        Methods.trimtestdata(vars['CommittedLoanNumStandard'], 'CommittedLoanNumStandard');
        log.info('Committed Loan (Standard): ' + vars['CommittedLoanNumStandard']);
        vars['UncommittedLoanNumStandard'] = await priceOfferedPage.Uncommitted_Loan_NumStandard.first().textContent() || '';
        Methods.trimtestdata(vars['UncommittedLoanNumStandard'], 'UncommittedLoanNumStandard');
        log.info('Uncommitted Loan (Standard): ' + vars['UncommittedLoanNumStandard']);
        vars['OpenAuthLimitRaw'] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimitRaw'], '(', '0', 'OpenAuthLimitBeforeCommit');
        Methods.removeMultipleSpecialChars(['$', ','], vars['OpenAuthLimitBeforeCommit'], 'OpenAuthLimitBeforeCommit');
        Methods.trimtestdata(vars['OpenAuthLimitBeforeCommit'], 'OpenAuthLimitBeforeCommit');
        log.info('Open Auth Limit before commit: ' + vars['OpenAuthLimitBeforeCommit']);
        vars['AuthLimitBeforeCommit'] = await priceOfferedPage.Auth_Limit.textContent() || '';
        Methods.trimtestdata(vars['AuthLimitBeforeCommit'], 'AuthLimitBeforeCommit');
        log.info('Auth Limit before commit: ' + vars['AuthLimitBeforeCommit']);
        log.stepPass('Auth limit and loan numbers captured before commit');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate or capture auth limit for Bid Request ID: ' + vars['BidReqId']);
        throw e;
      }

      log.step('Select duplicate and fresh loans in Chase Direct and perform commit action');
      try {
        await priceOfferedPage.BackTo_PriceofferedPage.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidReqId_Chase_Direct.click();
        await priceOfferedPage.Check_Fresh_Loan_NumChase_Direct(vars["UncommittedLoanNumStandard"]).check();
        await priceOfferedPage.Check_Duplicate_Loan_NumChase_Direct(vars["CommittedLoanNumStandard"]).check();
        await priceOfferedPage.Get_Price_Button.click();
        vars['LoanAmountFreshLoan'] = await priceOfferedPage.Loan_AmountFresh_Loan_Num(vars["UncommittedLoanNumStandard"]).textContent() || '';
        Methods.trimtestdata(vars['LoanAmountFreshLoan'], 'ExpectedCommittedLoanAmount');
        log.info('Expected committed loan amount: ' + vars['ExpectedCommittedLoanAmount']);
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
        log.stepPass('Commit action performed for loan amount: ' + vars['ExpectedCommittedLoanAmount']);
      } catch (e) {
        await log.stepFail(page, 'Failed to perform commit action');
        throw e;
      }

      log.step('Capture commit timestamp and commitment ID from popup');
      try {
        Methods.getCurrentTimestamp(appconstants.DATE_TIME_FORMAT_COMMIT, 'ExpectedBidCommittedDateAndTime', appconstants.UTC);
        Methods.addMinutesToDatetime(vars['ExpectedBidCommittedDateAndTime'], appconstants.DATE_TIME_FORMAT_COMMIT, 1, appconstants.DATE_TIME_FORMAT_COMMIT, 'ExpectedLastCommittedBidDateAndTimeplus1');
        Methods.subtractMinutesFromDatetime(vars['ExpectedBidCommittedDateAndTime'], appconstants.DATE_TIME_FORMAT_COMMIT, 1, appconstants.DATE_TIME_FORMAT_COMMIT, 'ExpectedLastCommittedBidDateAndTimeminus1');
        vars['CommitmentID'] = await priceOfferedPage.Commitment_IdPrice_Offered.textContent() || '';
        Methods.trimtestdata(vars['CommitmentID'], 'CommitmentID');
        log.info('Expected commit date and time: ' + vars['ExpectedBidCommittedDateAndTime']);
        log.info('Commitment ID: ' + vars['CommitmentID']);
        await priceOfferedPage.Okay_ButtonPopup.click();
        log.stepPass('Commitment ID captured: ' + vars['CommitmentID']);
      } catch (e) {
        await log.stepFail(page, 'Failed to capture commitment ID or timestamp from popup');
        throw e;
      }

      log.step('Verify committed loan is visible in All Loans tab');
      try {
        await priceOfferedPage.All_Loans_PriceofferedPage.waitFor({ state: 'visible' });
        await priceOfferedPage.All_Loans_PriceofferedPage.click();
        await expect(priceOfferedPage.Committed_Loan_Locked_Icon(vars["UncommittedLoanNumStandard"])).toBeVisible();
        vars['CommitmentOrderPriceOffered'] = await priceOfferedPage.Commitment_OrderChase_Direct(vars["UncommittedLoanNumStandard"]).textContent() || '';
        Methods.trimtestdata(vars['CommitmentOrderPriceOffered'], 'CommitmentOrderPriceOffered');
        log.info('Commitment order (Price Offered): ' + vars['CommitmentOrderPriceOffered']);
        log.stepPass('Committed loan visible in All Loans tab');
      } catch (e) {
        await log.stepFail(page, 'Committed loan not visible in All Loans tab');
        throw e;
      }

      log.step('Search by Commitment ID in Commitment List and verify entry');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars['CommitmentID']);
        await priceOfferedPage.Commitment_Id_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Commitment_IdCommitment_List_Screen(vars["CommitmentID"])).toBeVisible();
        await expect(page.getByText(vars['BidReqId'])).toBeVisible();
        await priceOfferedPage.Commitment_IdCommitment_List_Screen(vars["CommitmentID"]).click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars['CommitmentID'])).toBeVisible();
        await expect(priceOfferedPage.Committed_Loan_NumChase(vars["UncommittedLoanNumStandard"])).toBeVisible();
        await expect(priceOfferedPage.Duplicate_Loan_NumStandard(vars["CommittedLoanNumStandard"])).not.toBeVisible();
        log.stepPass('Commitment ID found in Commitment List: ' + vars['CommitmentID']);
      } catch (e) {
        await log.stepFail(page, 'Commitment ID not found in Commitment List: ' + vars['CommitmentID']);
        throw e;
      }

      log.step('Verify commitment order in Total Loans tab matches Price Offered');
      try {
        await commitmentListPage.Total_LoansCommitment_List.click();
        await priceOfferedPage.Check_the_Loan_Num.first().waitFor({ state: 'visible' });
        await priceOfferedPage.Check_the_Loan_Num.first().check();
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await expect(commitmentListPage.Commitment_IdAdd_To_Commit_Dropdown(vars["CommitmentID"])).toBeVisible();
        vars['CommitmentOrderCommitmentList'] = await commitmentListPage.Commitment_OrderAdd_To_Commit_Dropdown(vars["CommitmentID"]).textContent() || '';
        Methods.getLastCharacters(vars['CommitmentOrderCommitmentList'], '1', 'CommitmentOrderCommitmentList');
        log.info('Commitment order (Commitment List): ' + vars['CommitmentOrderCommitmentList']);
        expect(Methods.verifyString(vars['CommitmentOrderPriceOffered'], 'equals', vars['CommitmentOrderCommitmentList']));
        log.stepPass('Commitment order verified Price Offered: ' + vars['CommitmentOrderPriceOffered'] + '  Commitment List: ' + vars['CommitmentOrderCommitmentList']);
      } catch (e) {
        await log.stepFail(page, 'Commitment order mismatch. Price Offered: ' + vars['CommitmentOrderPriceOffered'] + ' | Commitment List: ' + vars['CommitmentOrderCommitmentList']);
        throw e;
      }

      log.step('Capture auth limit after commit and verify calculations');
      try {
        vars['OpenAuthLimitRaw'] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimitRaw'], '(', '0', 'OpenAuthLimitAfterCommit');
        Methods.removeMultipleSpecialChars(['$', ','], vars['OpenAuthLimitAfterCommit'], 'OpenAuthLimitAfterCommit');
        Methods.trimtestdata(vars['OpenAuthLimitAfterCommit'], 'OpenAuthLimitAfterCommit');
        Methods.splitBySpecialChar(vars['OpenAuthLimitRaw'], '(', '1', 'OpenAuthLimitPercentageAfterCommit');
        Methods.removeMultipleSpecialChars([')', '%'], vars['OpenAuthLimitPercentageAfterCommit'], 'OpenAuthLimitPercentageAfterCommit');
        vars['AuthLimitAfterCommit'] = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
        Methods.trimtestdata(vars['AuthLimitAfterCommit'], 'AuthLimitAfterCommit');
        vars['LastCommittedBidRaw'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.splitBySpecialChar(vars['LastCommittedBidRaw'], '|', '0', 'LastCommittedBidDateAndTimeAfterCommit');
        Methods.trimtestdata(vars['LastCommittedBidDateAndTimeAfterCommit'], 'LastCommittedBidDateAndTimeAfterCommit');
        vars['LastCommittedBidLoanAmountRaw'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
        Methods.removeCharactersFromPosition(vars['LastCommittedBidLoanAmountRaw'], '3','0','LastCommittedBidLoanAmountAfterCommit');
         Methods.performArithmetic(vars['OpenAuthLimitBeforeCommit'], 'SUBTRACTION', vars['ExpectedCommittedLoanAmount'], 'ExpectedOpenAuthLimit', 0);
        Methods.performArithmetic(vars['ExpectedOpenAuthLimit'], 'DIVISION', vars['AuthLimitBeforeCommit'], 'ExpectedOpenAuthLimitPercentage', 4);
        Methods.performArithmetic(vars['ExpectedOpenAuthLimitPercentage'], 'MULTIPLICATION', '100', 'ExpectedOpenAuthLimitPercentage', 2);
        log.info('Open Auth Limit after commit: ' + vars['OpenAuthLimitAfterCommit']);
        log.info('Expected Open Auth Limit: ' + vars['ExpectedOpenAuthLimit']);
        expect(Methods.verifyString(vars['ExpectedOpenAuthLimit'], 'equals', vars['OpenAuthLimitAfterCommit']));
        expect(Methods.verifyString(vars['ExpectedOpenAuthLimitPercentage'], 'equals', vars['OpenAuthLimitPercentageAfterCommit']));
        expect(Methods.verifyString(vars['AuthLimitBeforeCommit'], 'equals', vars['AuthLimitAfterCommit']));
        // Allow ±1 minute tolerance for commit timestamp comparison
        if (vars['ExpectedBidCommittedDateAndTime'] === vars['LastCommittedBidDateAndTimeAfterCommit']) {
          log.info('Commit timestamp matched exactly: ' + vars['LastCommittedBidDateAndTimeAfterCommit']);
        } else if (vars['ExpectedLastCommittedBidDateAndTimeplus1'] === vars['LastCommittedBidDateAndTimeAfterCommit']) {
          log.info('Commit timestamp matched at +1 min: ' + vars['LastCommittedBidDateAndTimeAfterCommit']);
        } else {
          expect(Methods.verifyString(vars['ExpectedLastCommittedBidDateAndTimeminus1'], 'equals', vars['LastCommittedBidDateAndTimeAfterCommit']));
        }
        expect(Methods.verifyString(vars['ExpectedCommittedLoanAmount'], 'equals', vars['LastCommittedBidLoanAmountAfterCommit']));
        log.stepPass('Auth limit values verified after commit');
      } catch (e) {
        await log.stepFail(page, 'Auth limit values verification failed');
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