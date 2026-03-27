import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1394 } from './prereq-1394';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS10_TC01';
const TC_TITLE = 'Perform selecting a unique loan Verify the bid, loan value, and selected loan count displayed in the Commit Selected Loans popup';

export async function runPrereq_1455(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1394(page, vars);
  const Methods = new AddonHelpers(page,vars);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);

  const profileName = 'All Loans Tab - Committed Loans Tab(Price offered)';
   

    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Navigate to Price Offered and select two loans');
      try {
        vars['PriceOfferedBidReqId'] = vars['RequestIDDetails'];
        Methods.trimtestdata(vars['PriceOfferedBidReqId'], 'PriceOfferedBidReqId');
        log.info('PriceOfferedBidReqId: ' + vars['PriceOfferedBidReqId']);
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['PriceOfferedBidReqId']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Price_Offered_Bid_Req_Id(vars['PriceOfferedBidReqId']).first().click();
        // await page.waitForLoadState('load');
        await priceOfferedPage.Check_UncommittedLoanNum1.first().waitFor({ state: 'visible' });
        await priceOfferedPage.Check_UncommittedLoanNum1.first().check();
        vars['UncommittedLoanNum1'] = await priceOfferedPage.Uncommitted_LoanNum1.first().textContent() || '';
        Methods.trimtestdata(vars['UncommittedLoanNum1'], 'UncommittedLoanNum1');
        log.info('UncommittedLoanNum1: ' + vars['UncommittedLoanNum1']);
        await priceOfferedPage.Check_Uncommitted_LoanNum2.first().check();
        vars['UncommittedLoanNum2'] = await correspondentPortalPage.Uncommited_LoanNum2.first().textContent() || '';
        Methods.trimtestdata(vars['UncommittedLoanNum2'], 'UncommittedLoanNum2');
        log.info('UncommittedLoanNum2: ' + vars['UncommittedLoanNum2']);
        vars['CheckedRowsCount'] = String(await priceOfferedPage.Checked_Row.count());
        log.info('CheckedRowsCount: ' + vars['CheckedRowsCount']);
        vars['LoanAmount1'] = await priceOfferedPage.Loan_Amount1AllLoans(vars['UncommittedLoanNum1']).textContent() || '';
        vars['LoanAmount2'] = await priceOfferedPage.Loan_Amount2AllLoans(vars['UncommittedLoanNum2']).textContent() || '';
        Methods.trimtestdata(vars['LoanAmount1'], 'LoanAmount1');
        Methods.trimtestdata(vars['LoanAmount2'], 'LoanAmount2');
        Methods.performArithmetic(vars['LoanAmount1'], 'ADDITION', vars['LoanAmount2'], 'TotalLoanAmountSelectedBids', 0);
        log.info('TotalLoanAmountSelectedBids: ' + vars['TotalLoanAmountSelectedBids']);
        log.stepPass('Two loans selected successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Price Offered or select loans');
        throw e;
      }

      log.step('Get price, capture open auth limit and verify commit popup values');
      try {
        await priceOfferedPage.Get_Price_Button.click();
        await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
        vars['OpenAuthLimit'] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '0', 'OpenAuthLimitBeforeCommitted');
        Methods.removeMultipleSpecialChars(['$', ','], vars['OpenAuthLimitBeforeCommitted'], 'OpenAuthLimitBeforeCommitted');
        Methods.trimtestdata(vars['OpenAuthLimitBeforeCommitted'], 'OpenAuthLimitBeforeCommitted');
        log.info('OpenAuthLimitBeforeCommitted: ' + vars['OpenAuthLimitBeforeCommitted']);
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        vars['BidreqIDPopup'] = await priceOfferedPage.BidRequestIdPopup.textContent() || '';
        Methods.trimtestdata(vars['BidreqIDPopup'], 'BidreqIDPopup');
        vars['LoanValuePopup'] = await priceOfferedPage.Loan_ValuePopup.textContent() || '';
        Methods.removeMultipleSpecialChars(['$', ','], vars['LoanValuePopup'], 'LoanValuePopup');
        Methods.trimtestdata(vars['LoanValuePopup'], 'LoanValuePopup');
        vars['SelectedLoansCountPopup'] = await priceOfferedPage.Selected_LoansPopup.textContent() || '';
        Methods.trimtestdata(vars['SelectedLoansCountPopup'], 'SelectedLoansCountPopup');
        log.info('BidreqIDPopup: ' + vars['BidreqIDPopup']);
        log.info('LoanValuePopup: ' + vars['LoanValuePopup']);
        log.info('SelectedLoansCountPopup: ' + vars['SelectedLoansCountPopup']);
        Methods.verifyString(vars['BidreqIDPopup'], 'equals', vars['PriceOfferedBidReqId']);
        Methods.verifyString(vars['LoanValuePopup'], 'equals', vars['TotalLoanAmountSelectedBids']);
        Methods.verifyString(vars['SelectedLoansCountPopup'], 'equals', vars['CheckedRowsCount']);
        log.stepPass('Commit popup values verified');
      } catch (e) {
        await log.stepFail(page, 'Commit popup values mismatch');
        throw e;
      }

      log.step('Confirm commit and verify commitment ID length is 8 characters');
      try {
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        Methods.getCurrentTimestamp(appconstants. DATE_TIME_FORMAT_COMMIT, 'BidCommittedDateAndTime', appconstants.UTC);
        log.info('BidCommittedDateAndTime: ' + vars['BidCommittedDateAndTime']);
        await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
        vars['CommitmentUniqueNumPopup'] = await priceOfferedPage.Commitment_ID.textContent() || '';
        Methods.trimtestdata(vars['CommitmentUniqueNumPopup'], 'CommitmentUniqueNumPopup');
        vars['CommitmentIDLength'] = String(vars['CommitmentUniqueNumPopup'].length);
        log.info('CommitmentUniqueNumPopup: ' + vars['CommitmentUniqueNumPopup']);
        log.info('CommitmentIDLength: ' + vars['CommitmentIDLength']);
        Methods.verifyString(vars['CommitmentIDLength'], 'equals', '8');
        await priceOfferedPage.Okay_ButtonPopup.click();
        await page.waitForLoadState('networkidle');
        log.stepPass('Commitment confirmed and ID length verified');
      } catch (e) {
        await log.stepFail(page, 'Commit confirmation failed or commitment ID length is not 8');
        throw e;
      }

      log.step('Capture committed loan details and store to test data profile');
      try {
        await priceOfferedPage.All_Loans_PriceofferedPage.click();
        vars['CountOfCommittedLoans'] = String(await priceOfferedPage.CommittedLoansCount.count());
        log.info('CountOfCommittedLoans: ' + vars['CountOfCommittedLoans']);

        vars['count'] = appconstants.ONE;
        while (parseFloat(String(vars['count'])) <= parseFloat(String(vars['CountOfCommittedLoans']))) {
          log.info('Processing committed loan row: ' + vars['count']);
          await expect(priceOfferedPage.CommittedLoan_Locked_Icon(vars['count'])).toBeVisible();
          vars['LockedLoanCommitOrder'] = await priceOfferedPage.Locked_Loan_CommitOrder(vars['count']).textContent() || '';
          vars['CorrLoanTable'] = await priceOfferedPage.Corr_Loan_price_offered_table(vars['count']).textContent() || '';
          vars['LastNameTable'] = await priceOfferedPage.Last_Nameprice_offered_table(vars['count']).textContent() || '';
          vars['LoanAmountTable'] = await priceOfferedPage.Loan_Amountprice_offered_table(vars['count']).textContent() || '';
          vars['IntRateTable'] = await priceOfferedPage.Int_Rateprice_offered_table(vars['count']).textContent() || '';
          vars['RefSecProdTable'] = await priceOfferedPage.Ref_Sec_Prodprice_offered_table(vars['count']).textContent() || '';
          vars['RefSecPriceTable'] = await priceOfferedPage.Ref_Sec_Priceprice_offered_table(vars['count']).textContent() || '';
          vars['GrossPriceTable'] = await priceOfferedPage.Gross_Priceprice_offered_table(vars['count']).textContent() || '';
          vars['HedgeRatioTable'] = await priceOfferedPage.Hedge_Ratioprice_offered_table(vars['count']).textContent() || '';
          vars['MarkAdjTable'] = await priceOfferedPage.Mark_Adjprice_offered_table(vars['count']).textContent() || '';
          vars['CurrGrossTable'] = await priceOfferedPage.Curr_Grossprice_offered_table(vars['count']).textContent() || '';
          log.info('Sucessfully stored the locked loan details row:'+vars['count']);

          testDataManager.updatePartialProfileDataByDataIndex(profileName, {
            'CommitOrder':    vars['LockedLoanCommitOrder'],
            'Corr Loan':       vars['CorrLoanTable'],
            'Last Name':           vars['LastNameTable'],
            'Loan Amount':         vars['LoanAmountTable'],
            'Int Rate':       vars['IntRateTable'],
            'Ref Sec Prod':        vars['RefSecProdTable'],
            'Ref Sec Price':       vars['RefSecPriceTable'],
            'Gross Price':         vars['GrossPriceTable'],
            'Hedge Ratio':         vars['HedgeRatioTable'],
            'Mark Adj':            vars['MarkAdjTable'],
            'Curr Gross': vars['CurrGrossTable'],
          }, vars['count']);

          log.info('Stored row ' + vars['count'] + ' to profile: ' + profileName);
          Methods.MathematicalOperation(vars['count'], '+', 1, 'count');
        }
        log.stepPass('Committed loan details captured and stored to test data profile');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture committed loan details');
        throw e;
      }

      log.step('Verify open auth limit after commit');
      try {
        vars['OpenAuthLimit'] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '0', 'ActualOpenAuthLimit');
        Methods.removeMultipleSpecialChars(['$', ','], vars['ActualOpenAuthLimit'], 'ActualOpenAuthLimit');
        Methods.trimtestdata(vars['ActualOpenAuthLimit'], 'ActualOpenAuthLimit');
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '1', 'ActualOpenAuthLimitPercentage');
        Methods.removeMultipleSpecialChars([')', '%'], vars['ActualOpenAuthLimitPercentage'], 'ActualOpenAuthLimitPercentage');
        Methods.trimtestdata(vars['ActualOpenAuthLimitPercentage'], 'ActualOpenAuthLimitPercentage');
        vars['ActualAuthLimit'] = await priceOfferedPage.Auth_Limit.textContent() || '';
        Methods.trimtestdata(vars['ActualAuthLimit'], 'ActualAuthLimit');
        Methods.performArithmetic(vars['OpenAuthLimitBeforeCommitted'], 'SUBTRACTION', vars['TotalLoanAmountSelectedBids'], 'ExpectedOpenAuthLimit', 0);
        Methods.performArithmetic(vars['ActualOpenAuthLimit'], 'DIVISION', vars['ActualAuthLimit'], 'ExpectedOpenAuthLimitPercentage', 4);
        Methods.performArithmetic(vars['ExpectedOpenAuthLimitPercentage'], 'MULTIPLICATION', '100', 'ExpectedOpenAuthLimitPercentage', 2);
        vars['LastCommittedBid'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.splitBySpecialChar(vars['LastCommittedBid'], '|', '0', 'LastCommittedBidTimeAndDate');
        Methods.trimtestdata(vars['LastCommittedBidTimeAndDate'], 'LastCommittedBidTimeAndDate');
        vars['LastCommittedBidLoanAmount'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
        Methods.removeCharactersFromPosition(vars['LastCommittedBidLoanAmount'], '3', '0', 'LastCommittedBidLoanLoanAmount');
        Methods.removeMultipleSpecialChars(['$', ','], vars['LastCommittedBidLoanLoanAmount'], 'LastCommittedBidLoanLoanAmount');
        log.info('ExpectedOpenAuthLimit: ' + vars['ExpectedOpenAuthLimit']);
        log.info('ActualOpenAuthLimit: ' + vars['ActualOpenAuthLimit']);
        log.info('ExpectedOpenAuthLimitPercentage: ' + vars['ExpectedOpenAuthLimitPercentage']);
        log.info('ActualOpenAuthLimitPercentage: ' + vars['ActualOpenAuthLimitPercentage']);
        log.info('LastCommittedBidTimeAndDate: ' + vars['LastCommittedBidTimeAndDate']);
        log.info('LastCommittedBidLoanLoanAmount: ' + vars['LastCommittedBidLoanLoanAmount']);
        log.stepPass('Open auth limit values captured after commit');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture open auth limit values after commit');
        throw e;
      }

      log.step('Click locked committed loans tab and verify action buttons not visible');
      try {
        await priceOfferedPage.LockedCommitted_Loans_2.click();
        await expect(priceOfferedPage.Paste_Loans_ButtonPrice_Offered_Page).not.toBeVisible();
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).not.toBeVisible();
        log.stepPass('Locked committed loans tab verified — Paste Loans and Commit Selected buttons not visible');
      } catch (e) {
        await log.stepFail(page, 'Locked committed loans tab failed or buttons visible');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  }