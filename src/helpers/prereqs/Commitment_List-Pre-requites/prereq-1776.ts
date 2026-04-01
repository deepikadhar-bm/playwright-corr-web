import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { CommitmentListPage } from '../../../pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../pages/correspondant/price-offered';
// import { runPrereq_1774 } from './prereq-1774';
import { runPrereq_1774 } from '../../../helpers/prereqs/Commitment_List-Pre-requites/prereq-1774';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';


const TC_ID = 'PREREQ_1776(REG_TS06_TC03)';
const TC_TITLE = 'Setup: Uncommit all loans from non-latest commitment and verify auth limit values';

export async function runPrereq_1776(page: Page, vars: Record<string, string>): Promise<void> {

  await runPrereq_1774(page, vars);
  const commitmentListPage = new CommitmentListPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const Methods = new AddonHelpers(page, vars);


  log.tcStart(TC_ID, TC_TITLE);
  try {
    log.step('Capture auth limit values and commitment ID before uncommit');
    try {
      await priceOfferedPage.Open_Auth_LimitCommitment_List.waitFor({ state: 'visible' });
      vars['OpenAuthLimit'] = await priceOfferedPage.Open_Auth_LimitCommitment_List.textContent() || '';
      Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '0', 'OpenAuthLimitBeforeUncommit');
      Methods.removeMultipleSpecialChars(['$', ','], vars['OpenAuthLimitBeforeUncommit'], 'OpenAuthLimitBeforeUncommit');
      Methods.trimtestdata(vars['OpenAuthLimitBeforeUncommit'], 'OpenAuthLimitBeforeUncommit');
      log.info('OpenAuthLimitBeforeUncommit: ' + vars['OpenAuthLimitBeforeUncommit']);
      vars['AuthLimitBeforeUncommit'] = await priceOfferedPage.Auth_Limit.textContent() || '';
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
      log.stepPass('Commitment ID not visible and latest committed loan not visible');
    } catch (e) {
      await log.stepFail(page, 'Commitment ID still visible or latest committed loan visible');
      log.tcEnd('FAIL');
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
      vars['LastCommittedBidLoanAmount'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
      Methods.removeCharactersFromPosition(vars['LastCommittedBidLoanAmount'], '3', '0', 'LastCommittedBidLoanAmountAfterUncommit');
      log.info('LastCommittedBidLoanAmountAfterUncommit: ' + vars['LastCommittedBidLoanAmountAfterUncommit']);
      Methods.performArithmetic(vars['OpenAuthLimitBeforeUncommit'], 'ADDITION', vars['UncommittedLoanAmount'], 'ExpectedOpenAuthLimit', 0);
      Methods.performArithmetic(vars['ExpectedOpenAuthLimit'], 'DIVISION', vars['AuthLimitBeforeUncommit'], 'ExpectedOpenAuthPercentage', 4);
      Methods.performArithmetic(vars['ExpectedOpenAuthPercentage'], 'MULTIPLICATION', '100', 'ExpectedOpenAuthPercentage', 2);
      log.info('ExpectedOpenAuthLimit: ' + vars['ExpectedOpenAuthLimit']);
      log.info('ExpectedOpenAuthPercentage: ' + vars['ExpectedOpenAuthPercentage']);
      expect(Methods.verifyString(vars['ExpectedOpenAuthLimit'], 'equals', vars['OpenAuthLimitAfterUncommit']));
      expect(Methods.verifyString(vars['ExpectedOpenAuthPercentage'], 'equals', vars['OpenAuthLimitPercentageAfterUncommit']));
      expect(Methods.verifyString(vars['AuthLimitBeforeUncommit'], 'equals', vars['AuthLimitAfterUncommit']));
      expect(Methods.verifyString(vars['LastCommittedBidBeforeUncommit'], 'equals', vars['LastCommittedBidAfterUncommit']));
      expect(Methods.verifyString(vars['LatestCommittedBidLoanAmountBeforeUncommit'], 'equals', vars['LastCommittedBidLoanAmountAfterUncommit']));
      log.stepPass('Auth limit values verified after uncommit');
    } catch (e) {
      await log.stepFail(page, 'Auth limit verification failed after uncommit');
      throw e;
    }
    log.tcEnd('PASS');

  } catch (e) {
    await log.captureOnFailure(page, TC_ID, e);
    log.tcEnd('FAIL');
    throw e;
  }
}