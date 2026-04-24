import { test, expect } from '@playwright/test';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
// import { runPrereq_1776 } from '../../../src/helpers/prereqs/prereq-1776';
import { runPrereq_1776 } from '@helpers/prereqs/Commitment_List-Pre-requites/prereq-1776';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS06_TC04';
const TC_TITLE = 'Uncommit all loans from the latest commitment and verify the open auth limit values + last commit values';

test.describe('Commitment List - TS_2', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1776(page, vars);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Capture auth limit values, commit time and commitment ID before uncommit');
      try {
        await correspondentPortalPage.Open_Auth_Limit_Total_Loan.waitFor({ state: 'visible' });
        vars['BidCommitTimeFirstLoan'] = await commitmentListPage.Commit_TimeCommitment_Screen.first().textContent() || '';
        Methods.trimtestdata(vars['BidCommitTimeFirstLoan'], 'BidCommitTimeFirstLoan');
        log.info('BidCommitTimeFirstLoan: ' + vars['BidCommitTimeFirstLoan']);
        vars['LastCommitLoanAmount'] = await commitmentListPage.Last_Commit_Loan_Amount.first().textContent() || '';
        Methods.trimtestdata(vars['LastCommitLoanAmount'], 'LastCommitLoanAmountFirstLoan');
        log.info('LastCommitLoanAmountFirstLoan: ' + vars['LastCommitLoanAmountFirstLoan']);
        vars['OpenAuthLimit'] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '0', 'OpenAuthLimitBeforeUncommit');
        Methods.removeMultipleSpecialChars(['$', ','], vars['OpenAuthLimitBeforeUncommit'], 'OpenAuthLimitBeforeUncommit');
        Methods.trimtestdata(vars['OpenAuthLimitBeforeUncommit'], 'OpenAuthLimitBeforeUncommit');
        log.info('OpenAuthLimitBeforeUncommit: ' + vars['OpenAuthLimitBeforeUncommit']);
        vars['AuthLimitBeforeUncommit'] = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
        Methods.trimtestdata(vars['AuthLimitBeforeUncommit'], 'AuthLimitBeforeUncommit');
        log.info('AuthLimitBeforeUncommit: ' + vars['AuthLimitBeforeUncommit']);
        vars['LastCommittedBid'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.splitBySpecialChar(vars['LastCommittedBid'], '|', '0', 'LastCommittedBidBeforeUncommit');
        Methods.trimtestdata(vars['LastCommittedBidBeforeUncommit'], 'LastCommittedBidBeforeUncommit');
        log.info('LastCommittedBidBeforeUncommit: ' + vars['LastCommittedBidBeforeUncommit']);
        vars['LastCommittedBidLoanAmount'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
        Methods.removeCharactersFromPosition(vars['LastCommittedBidLoanAmount'], '3', '0', 'LatestCommittedBidLoanAmountBeforeUncommit');
        log.info('LatestCommittedBidLoanAmountBeforeUncommit: ' + vars['LatestCommittedBidLoanAmountBeforeUncommit']);
        vars['CommitmentIDBeforeUncommit'] = await commitmentListPage.Commitment_ID2_Screen.textContent() || '';
        Methods.trimtestdata(vars['CommitmentIDBeforeUncommit'], 'CommitmentIDBeforeUncommit');
        log.info('CommitmentIDBeforeUncommit: ' + vars['CommitmentIDBeforeUncommit']);
        log.stepPass('Auth limit values and commitment ID captured before uncommit');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture auth limit values before uncommit');
        throw e;
      }

      log.step('Select all loans and perform uncommit action');
      try {
        await commitmentListPage.Select_All_Loans.first().check();
        vars['UncommittedLoanNum'] = await priceOfferedPage.Checked_Corr_Loan.first().textContent() || '';
        Methods.trimtestdata(vars['UncommittedLoanNum'], 'UncommittedLoanNum');
        log.info('UncommittedLoanNum: ' + vars['UncommittedLoanNum']);
        vars['UncommittedLoanAmount'] = await priceOfferedPage.Checked_Loan_Amount.first().textContent() || '';
        Methods.trimtestdata(vars['UncommittedLoanAmount'], 'UncommittedLoanAmount');
        log.info('UncommittedLoanAmount: ' + vars['UncommittedLoanAmount']);
        await expect(commitmentListPage.Uncommit_Selected_Button).toBeEnabled();
        await commitmentListPage.Uncommit_Selected_Button.click();
        await priceOfferedPage.Yes_Uncommit_Button.click();
        await correspondentPortalPage.Okay_Button1.waitFor({ state: 'visible' });
        await correspondentPortalPage.Okay_Button1.click();
        log.stepPass('Uncommit all loans action performed');
      } catch (e) {
        await log.stepFail(page, 'Failed to perform uncommit all loans action');
        throw e;
      }

      log.step('Verify commitment removed and latest committed loan not visible after uncommit');
      try {
        await commitmentListPage.Total_Committed_Loans_Tab.waitFor({ state: 'visible' });
        await commitmentListPage.Total_Committed_Loans_Tab.click();
        await expect(page.getByText(vars['CommitmentIDBeforeUncommit'])).not.toBeVisible();
        await expect(priceOfferedPage.Uncommitted_Loan_Num(vars['UncommittedLoanNum'])).not.toBeVisible();
        log.stepPass('Commitment ID not visible and latest committed loan visible');
      } catch (e) {
        await log.stepFail(page, 'Commitment ID still visible or latest committed loan not visible');
        throw e;
      }

      log.step('Capture auth limit values after uncommit and verify calculations');
      try {
        vars['OpenAuthLimit'] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '0', 'OpenAuthLimitAfterUncommit');
        Methods.removeMultipleSpecialChars(['$', ','], vars['OpenAuthLimitAfterUncommit'], 'OpenAuthLimitAfterUncommit');
        Methods.trimtestdata(vars['OpenAuthLimitAfterUncommit'], 'OpenAuthLimitAfterUncommit');
        log.info('OpenAuthLimitAfterUncommit: ' + vars['OpenAuthLimitAfterUncommit']);
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '1', 'OpenAuthLimitPercentageAfterUncommit');
        Methods.removeMultipleSpecialChars([')', '%'], vars['OpenAuthLimitPercentageAfterUncommit'], 'OpenAuthLimitPercentageAfterUncommit');
        Methods.trimtestdata(vars['OpenAuthLimitPercentageAfterUncommit'], 'OpenAuthLimitPercentageAfterUncommit');
        log.info('OpenAuthLimitPercentageAfterUncommit: ' + vars['OpenAuthLimitPercentageAfterUncommit']);
        vars['AuthLimitAfterUncommit'] = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
        Methods.trimtestdata(vars['AuthLimitAfterUncommit'], 'AuthLimitAfterUncommit');
        log.info('AuthLimitAfterUncommit: ' + vars['AuthLimitAfterUncommit']);
        vars['LastCommittedBid'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.splitBySpecialChar(vars['LastCommittedBid'], '|', '0', 'LastCommittedBidAfterUncommit');
        Methods.trimtestdata(vars['LastCommittedBidAfterUncommit'], 'LastCommittedBidAfterUncommit');
        log.info('LastCommittedBidAfterUncommit: ' + vars['LastCommittedBidAfterUncommit']);
        Methods.splitByWhiteSpace(vars['LastCommittedBidAfterUncommit'], '1', 'BidCommitTime');
        Methods.splitByWhiteSpace(vars['LastCommittedBidAfterUncommit'], '2', 'BidCommitTimeStamp');
        Methods.concatenateWithSpace(vars['BidCommitTime'], vars['BidCommitTimeStamp'], 'LastBidCommitTimeAfterUncommit');
        log.info('LastBidCommitTimeAfterUncommit: ' + vars['LastBidCommitTimeAfterUncommit']);
        vars['LastCommittedBidLoanAmount'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
        Methods.removeCharactersFromPosition(vars['LastCommittedBidLoanAmount'], '3', '0', 'LastCommittedBidLoanAmountAfterUncommit');
        log.info('LastCommittedBidLoanAmountAfterUncommit: ' + vars['LastCommittedBidLoanAmountAfterUncommit']);
        Methods.performArithmetic(vars['OpenAuthLimitBeforeUncommit'], 'ADDITION', vars['UncommittedLoanAmount'], 'ExpectedOpenAuthLimit', 0);
        Methods.performArithmetic(vars['ExpectedOpenAuthLimit'], 'DIVISION', vars['AuthLimitBeforeUncommit'], 'ExpectedOpenAuthPercentage', 4);
        Methods.performArithmetic(vars['ExpectedOpenAuthPercentage'], 'MULTIPLICATION', '100', 'ExpectedOpenAuthPercentage', 2);
        log.info('ExpectedOpenAuthLimit: ' + vars['ExpectedOpenAuthLimit']);
        log.info('ExpectedOpenAuthPercentage: ' + vars['ExpectedOpenAuthPercentage']);
        expect(Methods.verifyString(vars['ExpectedOpenAuthLimit'], 'equals', vars['OpenAuthLimitAfterUncommit']));
        expect(Methods.verifyString(vars['ExpectedOpenAuthPercentage'], 'contains', vars['OpenAuthLimitPercentageAfterUncommit']));
        expect(Methods.verifyString(vars['AuthLimitBeforeUncommit'], 'equals', vars['AuthLimitAfterUncommit']));
        log.stepPass('Auth limit values verified after uncommit');
      } catch (e) {
        await log.stepFail(page, 'Auth limit verification failed after uncommit');
        throw e;
      }

      log.step('Verify last committed bid timestamp using ±1 min tolerance');
      try {
        Methods.addMinutesToDatetime(vars['LastBidCommitTimeAfterUncommit'], appconstants.TIME_FORMAT1_HHMMA, 1, appconstants.TIME_FORMAT1_HHMMA, 'LastBidCommitTimeAfterUnCommitPlus1');
        log.info('LastBidCommitTimeAfterUnCommitPlus1: ' + vars['LastBidCommitTimeAfterUnCommitPlus1']);
        Methods.subtractMinutesFromDatetime(vars['LastBidCommitTimeAfterUncommit'], appconstants.TIME_FORMAT1_HHMMA, 1, appconstants.TIME_FORMAT1_HHMMA, 'LastBidCommitTimeAfterUnCommitMinus1');
        log.info('LastBidCommitTimeAfterUnCommitMinus1: ' + vars['LastBidCommitTimeAfterUnCommitMinus1']);
        log.info('BidCommitTimeFirstLoan: ' + vars['BidCommitTimeFirstLoan']);
        if (String(vars['BidCommitTimeFirstLoan']) === String(vars['LastBidCommitTimeAfterUncommit'])) {
          log.info('Commit time matched exactly: ' + vars['LastBidCommitTimeAfterUncommit']);
        } else if (String(vars['BidCommitTimeFirstLoan']) === String(vars['LastBidCommitTimeAfterUnCommitPlus1'])) {
          log.info('Commit time matched at +1 min: ' + vars['LastBidCommitTimeAfterUnCommitPlus1']);
        } else {
          expect(Methods.verifyString(vars['BidCommitTimeFirstLoan'], 'equals', vars['LastBidCommitTimeAfterUnCommitMinus1']));
          log.info('Commit time matched at -1 min: ' + vars['LastBidCommitTimeAfterUnCommitMinus1']);
        }
        expect(Methods.verifyString(vars['LastCommitLoanAmountFirstLoan'], 'equals', vars['LastCommittedBidLoanAmountAfterUncommit']));
        log.stepPass('Last committed bid timestamp and loan amount verified');
      } catch (e) {
        await log.stepFail(page, 'Last committed bid timestamp or loan amount verification failed');
        throw e;
      }

      log.step('Update test data profile with BidReqId');
      try {
        testDataManager.updateProfileData('CommitmentList', { 'RequestIdFrom6-4': vars['BidReqId'] });
        log.info('Updated CommitmentList profile - RequestIdFrom6-4: ' + vars['BidReqId']);
        log.stepPass('Test data profile updated with BidReqId: ' + vars['BidReqId']);
      } catch (e) {
        await log.stepFail(page, 'Failed to update test data profile with BidReqId: ' + vars['BidReqId']);
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