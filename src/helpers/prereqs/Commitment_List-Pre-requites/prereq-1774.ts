import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BidRequestsPage } from '../../../pages/correspondant/bid-requests';
import { CommitmentListPage } from '../../../pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../../pages/correspondant/spinner';
// import { runPrereq_1787 } from './prereq-1787';
import { runPrereq_1787 } from '../../../helpers/prereqs/Commitment_List-Pre-requites/prereq-1787';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../constants/app-constants';


const TC_ID = 'PREREQ_1774(REG_TS06_TC02)';
const TC_TITLE = 'Setup: Commit loans 3 times, uncommit a loan and verify auth limit values';

export async function runPrereq_1774(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1787(page, vars);
  const Methods = new AddonHelpers(page, vars);
  const bidRequestsPage = new BidRequestsPage(page);
  const commitmentListPage = new CommitmentListPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);

  log.tcStart(TC_ID, TC_TITLE);
  try {
    log.step('Navigate to Price Offered List and commit loans 3 times');
    try {
      vars['BidReqId'] = vars['RequestIDDetails'];
      log.info('BidReqId: ' + vars['BidReqId']);
      await correspondentPortalPage.Commitments_Side_Menu.click();
      await correspondentPortalPage.Price_Offered_List_Dropdown.click();
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqId']);
      await page.keyboard.press('Enter');
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await priceOfferedPage.BidRequestIDPrice_Offered_New(vars['BidReqId']).click();
      await priceOfferedPage.Required_Loan_Num.first().waitFor({ state: 'visible' });
      vars['count'] = appconstants.ONE;
      while (parseFloat(String(vars['count'])) <= parseFloat(String(appconstants.THREE))) {
        log.info("Iteration:" + vars['count'])
        if (String(vars['count']) === String(appconstants.ONE)) {
          await priceOfferedPage.Select_Loan_Num1.first().check();
          await commitmentListPage.Select_Loan_Num2.first().check();
        } else {
          await priceOfferedPage.Required_Loan_Num.first().check();
        }
        await priceOfferedPage.Get_Price_Button.click();
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
        await priceOfferedPage.Okay_ButtonPopup.click();
        await priceOfferedPage.All_Loans_Tabprice_offered_screen.waitFor({ state: 'visible' });
        await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
        log.info("Succesfullu performed commit action")
        Methods.MathematicalOperation(vars['count'], '+', 1, 'count');
      }
      log.stepPass('Loans committed 3 times for BidReqId: ' + vars['BidReqId']);
    } catch (e) {
      await log.stepFail(page, 'Failed to commit loans for BidReqId: ' + vars['BidReqId']);
      throw e;
    }

    log.step('Navigate to Commitment List and capture auth limit values before uncommit');
    try {
      await correspondentPortalPage.Commitments_Side_Menu.click();
      await commitmentListPage.Committed_List_Dropdown.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await priceOfferedPage.Search_Dropdown.type(vars['BidReqId']);
      await priceOfferedPage.Search_Dropdown.click();
      await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await commitmentListPage.Commitment_IDCommitment_List_Page(vars['BidReqId']).first().click();
      await priceOfferedPage.Open_Auth_LimitCommitment_List.waitFor({ state: 'visible' });
      vars['OpenAuthLimitRaw'] = await priceOfferedPage.Open_Auth_LimitCommitment_List.textContent() || '';
      Methods.splitBySpecialChar(vars['OpenAuthLimitRaw'], '(', '0', 'OpenAuthLimitBeforeUncommit');
      Methods.removeMultipleSpecialChars(['$', ','], vars['OpenAuthLimitBeforeUncommit'], 'OpenAuthLimitBeforeUncommit');
      Methods.trimtestdata(vars['OpenAuthLimitBeforeUncommit'], 'OpenAuthLimitBeforeUncommit');
      log.info('OpenAuthLimitBeforeUncommit: ' + vars['OpenAuthLimitBeforeUncommit']);
      vars['AuthLimitBeforeUncommit'] = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
      Methods.trimtestdata(vars['AuthLimitBeforeUncommit'], 'AuthLimitBeforeUncommit');
      log.info('AuthLimitBeforeUncommit: ' + vars['AuthLimitBeforeUncommit']);
      vars['LastCommittedBidRaw'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
      Methods.splitBySpecialChar(vars['LastCommittedBidRaw'], '|', '0', 'LastCommittedBidBeforeUncommit');
      Methods.trimtestdata(vars['LastCommittedBidBeforeUncommit'], 'LastCommittedBidBeforeUncommit');
      log.info('LastCommittedBidBeforeUncommit: ' + vars['LastCommittedBidBeforeUncommit']);
      vars['LastCommittedBidLoanAmountRaw'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
      Methods.removeCharactersFromPosition(vars['LastCommittedBidLoanAmountRaw'], '3', '0', 'LatestCommittedBidLoanAmountBeforeUncommit');
      log.info('LatestCommittedBidLoanAmountBeforeUncommit: ' + vars['LatestCommittedBidLoanAmountBeforeUncommit']);
      log.stepPass('Auth limit values captured before uncommit');
    } catch (e) {
      await log.stepFail(page, 'Failed to capture auth limit values before uncommit');
      throw e;
    }

    log.step('Select loan and perform uncommit action');
    try {
      await priceOfferedPage.Check_the_Loan_Num.first().check();
      vars['UncommittedLoanNum'] = await priceOfferedPage.Checked_Corr_Loan.textContent() || '';
      Methods.trimtestdata(vars['UncommittedLoanNum'], 'UncommittedLoanNum');
      log.info('UncommittedLoanNum: ' + vars['UncommittedLoanNum']);
      vars['UncommittedLoanAmount'] = await priceOfferedPage.Checked_Loan_Amount.textContent() || '';
      Methods.trimtestdata(vars['UncommittedLoanAmount'], 'UncommittedLoanAmount');
      log.info('UncommittedLoanAmount: ' + vars['UncommittedLoanAmount']);
      await expect(commitmentListPage.Uncommit_Selected_Button).toBeEnabled();
      await commitmentListPage.Uncommit_Selected_Button.click();
      await priceOfferedPage.Yes_Uncommit_Button.click();
      await correspondentPortalPage.Okay_Button1.waitFor({ state: 'visible' });
      await correspondentPortalPage.Okay_Button1.click();
      log.stepPass('Uncommit action performed for loan: ' + vars['UncommittedLoanNum']);
    } catch (e) {
      await log.stepFail(page, 'Failed to perform uncommit action for loan: ' + vars['UncommittedLoanNum']);
      throw e;
    }

    log.step('Capture auth limit values after uncommit and verify calculations');
    try {
      await commitmentListPage.Total_Committed_Loans_Tab.waitFor({ state: 'visible' });
      await commitmentListPage.Total_Committed_Loans_Tab.click();
      await expect(priceOfferedPage.Uncommitted_Loan_Num(vars['UncommittedLoanNum'])).not.toBeVisible();
      vars['OpenAuthLimitRaw'] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
      Methods.splitBySpecialChar(vars['OpenAuthLimitRaw'], '(', '0', 'OpenAuthLimitAfterUncommit');
      Methods.removeMultipleSpecialChars(['$', ','], vars['OpenAuthLimitAfterUncommit'], 'OpenAuthLimitAfterUncommit');
      Methods.trimtestdata(vars['OpenAuthLimitAfterUncommit'], 'OpenAuthLimitAfterUncommit');
      log.info('OpenAuthLimitAfterUncommit: ' + vars['OpenAuthLimitAfterUncommit']);
      Methods.splitBySpecialChar(vars['OpenAuthLimitRaw'], '(', '1', 'OpenAuthLimitPercentageAfterUncommit');
      Methods.removeMultipleSpecialChars([')', '%'], vars['OpenAuthLimitPercentageAfterUncommit'], 'OpenAuthLimitPercentageAfterUncommit');
      Methods.trimtestdata(vars['OpenAuthLimitPercentageAfterUncommit'], 'OpenAuthLimitPercentageAfterUncommit');
      log.info('OpenAuthLimitPercentageAfterUncommit: ' + vars['OpenAuthLimitPercentageAfterUncommit']);
      vars['AuthLimitAfterUncommit'] = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
      Methods.trimtestdata(vars['AuthLimitAfterUncommit'], 'AuthLimitAfterUncommit');
      log.info('AuthLimitAfterUncommit: ' + vars['AuthLimitAfterUncommit']);
      vars['LastCommittedBidRaw'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
      Methods.splitBySpecialChar(vars['LastCommittedBidRaw'], '|', '0', 'LastCommittedBidAfterUncommit');
      Methods.trimtestdata(vars['LastCommittedBidAfterUncommit'], 'LastCommittedBidAfterUncommit');
      log.info('LastCommittedBidAfterUncommit: ' + vars['LastCommittedBidAfterUncommit']);
      vars['LastCommittedBidLoanAmountRaw'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
      Methods.removeCharactersFromPosition(vars['LastCommittedBidLoanAmountRaw'], '3', '0', 'LastCommittedBidLoanAmountAfterUncommit');
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