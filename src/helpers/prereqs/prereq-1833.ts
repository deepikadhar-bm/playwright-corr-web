import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { CommitmentListPage } from '../../pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1795 } from './prereq-1795';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../constants/app-constants';


const TC_ID = 'PREREQ_1833(REG_TS08_TC02)';
const TC_TITLE = 'Setup: Add loans to latest commitment and verify auth limit values';

export async function runPrereq_1833(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1795(page, vars);
  const Methods = new AddonHelpers(page, vars);
  const commitmentListPage = new CommitmentListPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);
  log.tcStart(TC_ID, TC_TITLE);
  try {
    log.step('Capture latest commitment details and auth limit values before commit');
    try {
      await commitmentListPage.Commitment_IDLatest.first().waitFor({ state: 'visible' });
      vars['CommitID'] = await commitmentListPage.Commitment_IDLatest.first().textContent() || '';
      Methods.trimtestdata(vars['CommitID'], 'CommitID');
      log.info('CommitID: ' + vars['CommitID']);
      vars['LatestCommitmentOrderScreen'] = await commitmentListPage.Commit_OrderLatest.first().textContent() || '';
      Methods.trimtestdata(vars['LatestCommitmentOrderScreen'], 'LatestCommitmentOrderScreen');
      log.info('LatestCommitmentOrderScreen: ' + vars['LatestCommitmentOrderScreen']);
      vars['LastCommittedBidTime'] = await commitmentListPage.Commitment_Time_List_Details_ScreenLatest.textContent() || '';
      Methods.trimtestdata(vars['LastCommittedBidTime'], 'LastCommittedBidTime');
      Methods.getCurrentTimestamp(appconstants.DATE_FORMAT_MDYY, 'LastCommittedBidDate', appconstants.UTC);
      Methods.concatenateWithSpace(vars['LastCommittedBidDate'], vars['LastCommittedBidTime'], 'ExpectedLastCommittedBidDateAndTime');
      log.info('ExpectedLastCommittedBidDateAndTime: ' + vars['ExpectedLastCommittedBidDateAndTime']);
      vars['OpenAuthLimitRaw'] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
      Methods.splitBySpecialChar(vars['OpenAuthLimitRaw'], '(', '0', 'OpenAuthLimitBeforeCommit');
      Methods.removeMultipleSpecialChars(['$', ','], vars['OpenAuthLimitBeforeCommit'], 'OpenAuthLimitBeforeCommit');
      Methods.trimtestdata(vars['OpenAuthLimitBeforeCommit'], 'OpenAuthLimitBeforeCommit');
      log.info('OpenAuthLimitBeforeCommit: ' + vars['OpenAuthLimitBeforeCommit']);
      vars['AuthLimitBeforeCommit'] = await priceOfferedPage.Auth_Limit.textContent() || '';
      Methods.trimtestdata(vars['AuthLimitBeforeCommit'], 'AuthLimitBeforeCommit');
      log.info('AuthLimitBeforeCommit: ' + vars['AuthLimitBeforeCommit']);
      vars['LastCommittedBidLoanAmountRaw'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
      Methods.removeCharactersFromPosition(vars['LastCommittedBidLoanAmountRaw'], '3', '0', 'LastCommittedBidLoanAmountBeforeCommit');
      log.info('LastCommittedBidLoanAmountBeforeCommit: ' + vars['LastCommittedBidLoanAmountBeforeCommit']);
      log.stepPass('Latest commitment details and auth limit captured before commit. CommitID: ' + vars['CommitID']);
    } catch (e) {
      await log.stepFail(page, 'Failed to capture commitment details before commit');
      throw e;
    }

    log.step('Select loan in Total Loans tab and capture loan details');
    try {
      await commitmentListPage.Total_LoansCommitment_List.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await priceOfferedPage.Required_Loan_Num.first().check();
      vars['CommittedCorrLoan'] = await priceOfferedPage.Checked_Corr_Loan.textContent() || '';
      Methods.trimtestdata(vars['CommittedCorrLoan'], 'CommittedCorrLoan');
      log.info('CommittedCorrLoan: ' + vars['CommittedCorrLoan']);
      vars['CommittedLastNameTotalLoans'] = await commitmentListPage.Last_NameCommitment_List(vars['CommittedCorrLoan']).textContent() || '';
      Methods.trimtestdata(vars['CommittedLastNameTotalLoans'], 'CommittedLastNameTotalLoans');
      vars['CommittedLoanAmountTotalLoans'] = await priceOfferedPage.Committed_Loan_AmountPrice_Offered(vars['CommittedCorrLoan']).textContent() || '';
      Methods.trimtestdata(vars['CommittedLoanAmountTotalLoans'], 'CommittedLoanAmountTotalLoans');
      log.info('CommittedLoanAmountTotalLoans: ' + vars['CommittedLoanAmountTotalLoans']);
      vars['CommittedIntRateTotalLoans'] = await priceOfferedPage.Committed_Interest_RatePrice_Offered(vars['CommittedCorrLoan']).textContent() || '';
      Methods.trimtestdata(vars['CommittedIntRateTotalLoans'], 'CommittedIntRateTotalLoans');
      vars['CommittedRefSecProdTotalLoans'] = await priceOfferedPage.Committed_Reference_SecurityPrice_Offered(vars['CommittedCorrLoan']).textContent() || '';
      Methods.trimtestdata(vars['CommittedRefSecProdTotalLoans'], 'CommittedRefSecProdTotalLoans');
      vars['CommittedRefSecPriceTotalLoans'] = await priceOfferedPage.Committed_Reference_Security_PricePrice_Offered(vars['CommittedCorrLoan']).textContent() || '';
      Methods.trimtestdata(vars['CommittedRefSecPriceTotalLoans'], 'CommittedRefSecPriceTotalLoans');
      vars['CommittedGrossPriceTotalLoans'] = await priceOfferedPage.Committed_Gross_PricePrice_Offered(vars['CommittedCorrLoan']).textContent() || '';
      Methods.trimtestdata(vars['CommittedGrossPriceTotalLoans'], 'CommittedGrossPriceTotalLoans');
      vars['CommittedHedgeRatioTotalLoans'] = await priceOfferedPage.Committed_Hedge_RatioPrice_Offered(vars['CommittedCorrLoan']).textContent() || '';
      Methods.trimtestdata(vars['CommittedHedgeRatioTotalLoans'], 'CommittedHedgeRatioTotalLoans');
      vars['CommittedCurrMarketValueTotalLoans'] = await commitmentListPage.Curr_Market_ValueCommitment_List(vars['CommittedCorrLoan']).textContent() || '';
      Methods.trimtestdata(vars['CommittedCurrMarketValueTotalLoans'], 'CommittedCurrMarketValueTotalLoans');
      vars['CommittedMarkAdjTotalLoans'] = await priceOfferedPage.Committed_Mar_AdjPrice_Offered(vars['CommittedCorrLoan']).textContent() || '';
      Methods.trimtestdata(vars['CommittedMarkAdjTotalLoans'], 'CommittedMarkAdjTotalLoans');
      vars['CommittedCurrGrossTotalLoans'] = await correspondentPortalPage.Curr_GrossCommitment_List(vars['CommittedCorrLoan']).textContent() || '';
      Methods.trimtestdata(vars['CommittedCurrGrossTotalLoans'], 'CommittedCurrGrossTotalLoans');
      log.stepPass('Loan details captured for loan: ' + vars['CommittedCorrLoan']);
    } catch (e) {
      await log.stepFail(page, 'Failed to capture loan details for loan: ' + vars['CommittedCorrLoan']);
      throw e;
    }

    log.step('Perform Add to Commit action for selected loan');
    try {
      await expect(priceOfferedPage.Add_To_Commit_Dropdown).toBeEnabled();
      await priceOfferedPage.Add_To_Commit_Dropdown.click();
      await correspondentPortalPage.Commitment_OrderCommitment_List(vars['CommitID']).click();
      await correspondentPortalPage.Yes_Commit_Button.click();
      await correspondentPortalPage.Okay_Button1.waitFor({ state: 'visible' });
      await correspondentPortalPage.Okay_Button1.click();
      log.stepPass('Add to Commit action performed for loan: ' + vars['CommittedCorrLoan']);
    } catch (e) {
      await log.stepFail(page, 'Failed to perform Add to Commit action for loan: ' + vars['CommittedCorrLoan']);
      throw e;
    }

    log.step('Verify committed loan visible and loan details match in Total Committed Loans tab');
    try {
      await commitmentListPage.Total_Committed_Loans_Tab.waitFor({ state: 'visible' });
      await commitmentListPage.Total_Committed_Loans_Tab.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(commitmentListPage.Committed_Loan_NumCommitment_List(vars['CommitID'], vars['CommittedCorrLoan'])).toBeVisible();
      vars['LatestCommittedCommitmentOrder'] = await priceOfferedPage.Commitment_OrderPrice_Offred(vars['CommittedCorrLoan']).textContent() || '';
      Methods.trimtestdata(vars['LatestCommittedCommitmentOrder'], 'LatestCommittedCommitmentOrder');
      log.info('LatestCommitmentOrderScreen: ' + vars['LatestCommitmentOrderScreen']);
      log.info('LatestCommittedCommitmentOrder: ' + vars['LatestCommittedCommitmentOrder']);
      expect(Methods.verifyString(vars['LatestCommitmentOrderScreen'], 'equals', vars['LatestCommittedCommitmentOrder']));
      await expect(commitmentListPage.Last_NameCommitment_List(vars['CommittedCorrLoan'])).toContainText(vars['CommittedLastNameTotalLoans']);
      await expect(priceOfferedPage.Committed_Loan_AmountPrice_Offered(vars['CommittedCorrLoan'])).toContainText(vars['CommittedLoanAmountTotalLoans']);
      await expect(priceOfferedPage.Committed_Interest_RatePrice_Offered(vars['CommittedCorrLoan'])).toContainText(vars['CommittedIntRateTotalLoans']);
      await expect(priceOfferedPage.Committed_Reference_SecurityPrice_Offered(vars['CommittedCorrLoan'])).toContainText(vars['CommittedRefSecProdTotalLoans']);
      await expect(priceOfferedPage.Committed_Reference_Security_PricePrice_Offered(vars['CommittedCorrLoan'])).toContainText(vars['CommittedRefSecPriceTotalLoans']);
      await expect(priceOfferedPage.Committed_Gross_PricePrice_Offered(vars['CommittedCorrLoan'])).toContainText(vars['CommittedGrossPriceTotalLoans']);
      await expect(priceOfferedPage.Committed_Hedge_RatioPrice_Offered(vars['CommittedCorrLoan'])).toContainText(vars['CommittedHedgeRatioTotalLoans']);
      await expect(commitmentListPage.Curr_Market_ValueCommitment_List(vars['CommittedCorrLoan'])).toContainText(vars['CommittedCurrMarketValueTotalLoans']);
      await expect(priceOfferedPage.Committed_Mar_AdjPrice_Offered(vars['CommittedCorrLoan'])).toContainText(vars['CommittedMarkAdjTotalLoans']);
      await expect(correspondentPortalPage.Curr_GrossCommitment_List(vars['CommittedCorrLoan'])).toContainText(vars['CommittedCurrGrossTotalLoans']);
      log.stepPass('Loan details verified in Total Committed Loans tab for loan: ' + vars['CommittedCorrLoan']);
    } catch (e) {
      await log.stepFail(page, 'Loan details mismatch in Total Committed Loans tab for loan: ' + vars['CommittedCorrLoan']);
      throw e;
    }

    log.step('Capture auth limit values after commit and verify calculations');
    try {
      await priceOfferedPage.Open_Auth_Limit.scrollIntoViewIfNeeded();
      vars['OpenAuthLimitRaw'] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
      Methods.splitBySpecialChar(vars['OpenAuthLimitRaw'], '(', '0', 'OpenAuthLimitAfterCommit');
      Methods.removeMultipleSpecialChars(['$', ','], vars['OpenAuthLimitAfterCommit'], 'OpenAuthLimitAfterCommit');
      Methods.trimtestdata(vars['OpenAuthLimitAfterCommit'], 'OpenAuthLimitAfterCommit');
      log.info('OpenAuthLimitAfterCommit: ' + vars['OpenAuthLimitAfterCommit']);
      Methods.splitBySpecialChar(vars['OpenAuthLimitRaw'], '(', '1', 'OpenAuthLimitPercentageAfterCommit');
      Methods.removeMultipleSpecialChars([')', '%'], vars['OpenAuthLimitPercentageAfterCommit'], 'OpenAuthLimitPercentageAfterCommit');
      Methods.trimtestdata(vars['OpenAuthLimitPercentageAfterCommit'], 'OpenAuthLimitPercentageAfterCommit');
      log.info('OpenAuthLimitPercentageAfterCommit: ' + vars['OpenAuthLimitPercentageAfterCommit']);
      vars['AuthLimitAfterCommit'] = await priceOfferedPage.Auth_Limit.textContent() || '';
      Methods.trimtestdata(vars['AuthLimitAfterCommit'], 'AuthLimitAfterCommit');
      log.info('AuthLimitAfterCommit: ' + vars['AuthLimitAfterCommit']);
      vars['LastCommittedBidRaw'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
      Methods.splitBySpecialChar(vars['LastCommittedBidRaw'], '|', '0', 'LastCommittedBidAfterCommit');
      Methods.trimtestdata(vars['LastCommittedBidAfterCommit'], 'LastCommittedBidAfterCommit');
      log.info('LastCommittedBidAfterCommit: ' + vars['LastCommittedBidAfterCommit']);
      vars['LastCommittedBidLoanAmountRaw'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
      Methods.removeCharactersFromPosition(vars['LastCommittedBidLoanAmountRaw'], '3', '0', 'LastCommittedBidLoanAmountAfterCommit');
      Methods.removeMultipleSpecialChars(['$', ','], vars['LastCommittedBidLoanAmountAfterCommit'], 'LastCommittedBidLoanAmountAfterCommit');
      log.info('LastCommittedBidLoanAmountAfterCommit: ' + vars['LastCommittedBidLoanAmountAfterCommit']);
      Methods.performArithmetic(vars['OpenAuthLimitBeforeCommit'], 'SUBTRACTION', vars['CommittedLoanAmountTotalLoans'], 'ExpectedOpenAuthLimit', 0);
      Methods.performArithmetic(vars['ExpectedOpenAuthLimit'], 'DIVISION', vars['AuthLimitBeforeCommit'], 'ExpectedOpenAuthLimitPercentage', 4);
      Methods.performArithmetic(vars['ExpectedOpenAuthLimitPercentage'], 'MULTIPLICATION', '100', 'ExpectedOpenAuthLimitPercentage', 2);
      Methods.performArithmetic(vars['LastCommittedBidLoanAmountBeforeCommit'], 'ADDITION', vars['CommittedLoanAmountTotalLoans'], 'ExpectedLastCommittedLoanAmount', 0);
      log.info('ExpectedOpenAuthLimit: ' + vars['ExpectedOpenAuthLimit']);
      log.info('ExpectedOpenAuthLimitPercentage: ' + vars['ExpectedOpenAuthLimitPercentage']);
      log.info('ExpectedLastCommittedLoanAmount: ' + vars['ExpectedLastCommittedLoanAmount']);
      expect(Methods.verifyString(vars['ExpectedOpenAuthLimit'], 'equals', vars['OpenAuthLimitAfterCommit']));
      expect(Methods.verifyString(vars['ExpectedOpenAuthLimitPercentage'], 'equals', vars['OpenAuthLimitPercentageAfterCommit']));
      expect(Methods.verifyString(vars['AuthLimitBeforeCommit'], 'equals', vars['AuthLimitAfterCommit']));
      expect(Methods.verifyString(vars['ExpectedLastCommittedBidDateAndTime'], 'equals', vars['LastCommittedBidAfterCommit']));
      expect(Methods.verifyString(vars['ExpectedLastCommittedLoanAmount'], 'equals', vars['LastCommittedBidLoanAmountAfterCommit']));
      log.stepPass('Auth limit values verified after commit');
    } catch (e) {
      await log.stepFail(page, 'Auth limit values verification failed after commit');
      throw e;
    }
    log.tcEnd('PASS');
  } catch (e) {
    await log.captureOnFailure(page, TC_ID, e);
    log.tcEnd('FAIL');
    throw e;
  }
}