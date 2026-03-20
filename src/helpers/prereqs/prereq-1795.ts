import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { CommitmentListPage } from '../../pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../constants/app-constants';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';


const TC_ID = 'PREREQ_1795(REG_TS08_TC01)';
const TC_TITLE = 'Setup: Commit loan, navigate to Commitment List and verify auth limit values';

export async function runPrereq_1795(page: Page, vars: Record<string, string>): Promise<void> {
  log.tcStart(TC_ID, TC_TITLE);

  const commitmentListPage = new CommitmentListPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);
  const Methods = new AddonHelpers(page, vars);
  const credentials = ENV.getCredentials('internal');
  vars['Username'] = credentials.username;
  vars['Password'] = credentials.password;
  const profileName = 'CommitmentList';
  const profile = testDataManager.getProfileByName(profileName);

  log.step('Login to Correspondent Portal');
  try {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    log.stepPass('Logged in to Correspondent Portal');
  } catch (e) {
    await log.stepFail(page, 'Failed to login to Correspondent Portal');
    throw e;
  }

  log.step('Search by Bid Request ID, select loan and perform commit action');
  try {
    if (profile && profile.data) {
      vars['BidReqId'] = profile.data[0]['RequestIdFrom6-4'];
      log.info('BidReqId: ' + vars['BidReqId']);
    }
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqId']);
    await page.keyboard.press('Enter');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidRequestIDPrice_Offered_New(vars['BidReqId']).click();
    await priceOfferedPage.Check_the_Loan_Num.first().waitFor({ state: 'visible' });
    await priceOfferedPage.Check_the_Loan_Num.first().check();
    await expect(priceOfferedPage.Get_Price_Button).toBeEnabled();
    await priceOfferedPage.Get_Price_Button.click();
    await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await priceOfferedPage.Yes_Commit_ButtonPopup.click();
    await priceOfferedPage.Yes_Commit_ButtonPopup.waitFor({ state: 'hidden' });
    await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
    await priceOfferedPage.Okay_ButtonPopup.click();
    log.stepPass('Commit action performed for BidReqId: ' + vars['BidReqId']);
  } catch (e) {
    await log.stepFail(page, 'Failed to perform commit action for BidReqId: ' + vars['BidReqId']);
    throw e;
  }

  log.step('Navigate to Commitment List, search by Bid Request ID and open commitment');
  try {
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.type(vars['BidReqId']);
    await priceOfferedPage.Search_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Commitment_IDCommitment_List_Page(vars['BidReqId']).first().click();
    await priceOfferedPage.Commit_IDCommitment_List.first().waitFor({ state: 'visible' });
    log.stepPass('Commitment List opened for BidReqId: ' + vars['BidReqId']);
  } catch (e) {
    await log.stepFail(page, 'Failed to navigate to Commitment List for BidReqId: ' + vars['BidReqId']);
    throw e;
  }

  log.step('Capture commitment details and auth limit values before commit');
  try {
    vars['CommitID'] = await priceOfferedPage.Commit_IDCommitment_List.first().textContent() || '';
    Methods.trimtestdata(vars['CommitID'], 'CommitID');
    log.info('CommitID: ' + vars['CommitID']);
    vars['CommitOrderScreen'] = await priceOfferedPage.Commit_OrderCommitment_List.first().textContent() || '';
    Methods.trimtestdata(vars['CommitOrderScreen'], 'CommitOrderScreen');
    log.info('CommitOrderScreen: ' + vars['CommitOrderScreen']);
    vars['OpenAuthLimit'] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
    Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '0', 'OpenAuthLimitBeforeCommit');
    Methods.removeMultipleSpecialChars(['$', ','], vars['OpenAuthLimitBeforeCommit'], 'OpenAuthLimitBeforeCommit');
    Methods.trimtestdata(vars['OpenAuthLimitBeforeCommit'], 'OpenAuthLimitBeforeCommit');
    log.info('OpenAuthLimitBeforeCommit: ' + vars['OpenAuthLimitBeforeCommit']);
    vars['AuthLimitBeforeCommit'] = await priceOfferedPage.Auth_Limit.textContent() || '';
    Methods.trimtestdata(vars['AuthLimitBeforeCommit'], 'AuthLimitBeforeCommit');
    log.info('AuthLimitBeforeCommit: ' + vars['AuthLimitBeforeCommit']);
    vars['LastCommittedBidTime'] = await commitmentListPage.Commitment_Time_List_Details_ScreenLatest.textContent() || '';
    Methods.getCurrentTimestamp(appconstants.DATE_FORMAT_MDYY, 'LastCommittedBidDate', appconstants.UTC);
    Methods.concatenateWithSpace(vars['LastCommittedBidDate'], vars['LastCommittedBidTime'], 'ExpectedLastCommittedBidDateAndTime');
    log.info('ExpectedLastCommittedBidDateAndTime: ' + vars['ExpectedLastCommittedBidDateAndTime']);
    vars['LastCommittedBidLoanAmount'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
    Methods.removeCharactersFromPosition(vars['LastCommittedBidLoanAmount'], '3', '0', 'LastCommittedBidLoanAmountBeforeCommit');
    log.info('LastCommittedBidLoanAmountBeforeCommit: ' + vars['LastCommittedBidLoanAmountBeforeCommit']);
    log.stepPass('Commitment details captured before commit. CommitID: ' + vars['CommitID']);
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
    log.info('CommitOrderScreen: ' + vars['CommitOrderScreen']);
    log.info('LatestCommittedCommitmentOrder: ' + vars['LatestCommittedCommitmentOrder']);
    expect(Methods.verifyString(vars['CommitOrderScreen'], 'equals', vars['LatestCommittedCommitmentOrder']));
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
    vars['OpenAuthLimit'] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
    Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '0', 'OpenAuthLimitAfterCommit');
    Methods.removeMultipleSpecialChars(['$', ','], vars['OpenAuthLimitAfterCommit'], 'OpenAuthLimitAfterCommit');
    Methods.trimtestdata(vars['OpenAuthLimitAfterCommit'], 'OpenAuthLimitAfterCommit');
    log.info('OpenAuthLimitAfterCommit: ' + vars['OpenAuthLimitAfterCommit']);
    Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '1', 'OpenAuthLimitPercentageAfterCommit');
    Methods.removeMultipleSpecialChars([')', '%'], vars['OpenAuthLimitPercentageAfterCommit'], 'OpenAuthLimitPercentageAfterCommit');
    Methods.trimtestdata(vars['OpenAuthLimitPercentageAfterCommit'], 'OpenAuthLimitPercentageAfterCommit');
    log.info('OpenAuthLimitPercentageAfterCommit: ' + vars['OpenAuthLimitPercentageAfterCommit']);
    vars['AuthLimitAfterCommit'] = await priceOfferedPage.Auth_Limit.textContent() || '';
    Methods.trimtestdata(vars['AuthLimitAfterCommit'], 'AuthLimitAfterCommit');
    log.info('AuthLimitAfterCommit: ' + vars['AuthLimitAfterCommit']);
    vars['LastCommittedBid'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
    Methods.splitBySpecialChar(vars['LastCommittedBid'], '|', '0', 'LastCommittedBidAfterCommit');
    Methods.trimtestdata(vars['LastCommittedBidAfterCommit'], 'LastCommittedBidAfterCommit');
    log.info('LastCommittedBidAfterCommit: ' + vars['LastCommittedBidAfterCommit']);
    vars['LastCommittedBidLoanAmount'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
    Methods.removeCharactersFromPosition(vars['LastCommittedBidLoanAmount'], '3', '0', 'LastCommittedBidLoanAmountAfterCommit');
    log.info('LastCommittedBidLoanAmountAfterCommit: ' + vars['LastCommittedBidLoanAmountAfterCommit']);
    Methods.performArithmetic(vars['OpenAuthLimitBeforeCommit'], 'SUBTRACTION', vars['CommittedLoanAmountTotalLoans'], 'ExpectedOpenAuthLimit', 0);
    Methods.performArithmetic(vars['ExpectedOpenAuthLimit'], 'DIVISION', vars['AuthLimitBeforeCommit'], 'ExpectedOpenAuthLimitPercentage', 4);
    Methods.performArithmetic(vars['ExpectedOpenAuthLimitPercentage'], 'MULTIPLICATION', '100', 'ExpectedOpenAuthLimitPercentage', 2);
    log.info('ExpectedOpenAuthLimit: ' + vars['ExpectedOpenAuthLimit']);
    log.info('ExpectedOpenAuthLimitPercentage: ' + vars['ExpectedOpenAuthLimitPercentage']);
    expect(Methods.verifyString(vars['ExpectedOpenAuthLimit'], 'equals', vars['OpenAuthLimitAfterCommit']));
    expect(Methods.verifyString(vars['ExpectedOpenAuthLimitPercentage'], 'equals', vars['OpenAuthLimitPercentageAfterCommit']));
    expect(Methods.verifyString(vars['AuthLimitBeforeCommit'], 'equals', vars['AuthLimitAfterCommit']));
    log.stepPass('Auth limit values verified after commit');
  } catch (e) {
    await log.stepFail(page, 'Failed to verify auth limit values after commit');
    throw e;
  }

  log.step('Verify last committed bid timestamp and loan amount');
  try {
    Methods.addMinutesToDatetime(vars['ExpectedLastCommittedBidDateAndTime'], appconstants.DATE_TIME_FORMAT_COMMIT, 1, appconstants.DATE_TIME_FORMAT_COMMIT, 'ExpectedLastCommittedBidDateAndTimePlus1');
    log.info('ExpectedLastCommittedBidDateAndTimePlus1: ' + vars['ExpectedLastCommittedBidDateAndTimePlus1']);
    Methods.subtractMinutesFromDatetime(vars['ExpectedLastCommittedBidDateAndTime'], appconstants.DATE_TIME_FORMAT_COMMIT, 1, appconstants.DATE_TIME_FORMAT_COMMIT, 'ExpectedLastCommittedBidDateAndTimeMinus1');
    log.info('ExpectedLastCommittedBidDateAndTimeMinus1: ' + vars['ExpectedLastCommittedBidDateAndTimeMinus1']);
    if (String(vars['ExpectedLastCommittedBidDateAndTime']) === String(vars['LastCommittedBidAfterCommit'])) {
      log.info('Commit time matched exactly: ' + vars['LastCommittedBidAfterCommit']);
    } else if (String(vars['ExpectedLastCommittedBidDateAndTimePlus1']) === String(vars['LastCommittedBidAfterCommit'])) {
      log.info('Commit time matched at +1 min: ' + vars['LastCommittedBidAfterCommit']);
    } else {
      expect(Methods.verifyString(vars['ExpectedLastCommittedBidDateAndTimeMinus1'], 'equals', vars['LastCommittedBidAfterCommit']));
      log.info('Commit time matched at -1 min: ' + vars['LastCommittedBidAfterCommit']);
    }
    expect(Methods.verifyString(vars['LastCommittedBidLoanAmountBeforeCommit'], 'equals', vars['LastCommittedBidLoanAmountAfterCommit']));
    log.stepPass('Last committed bid timestamp and loan amount verified');
  } catch (e) {
    await log.stepFail(page, 'Failed to verify last committed bid timestamp and loan amount');
    throw e;
  }

  log.tcEnd('PASS');
}