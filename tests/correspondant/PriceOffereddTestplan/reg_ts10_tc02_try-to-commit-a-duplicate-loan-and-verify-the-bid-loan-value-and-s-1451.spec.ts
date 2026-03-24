import { test, expect } from '@playwright/test';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1389 } from '../../../src/helpers/prereqs/prereq-1389';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID    = 'REG_TS10_TC02';
const TC_TITLE = 'Try to commit a duplicate loan and verify the bid, loan value, and selected loan count displayed in the Commit Selected Loans popup. After a successful commitment, verify that a commitment is created';

test.describe('REG_PriceOffered', () => {

  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;


  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1389(page, vars);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage        = new PriceOfferedPage(page);
    spinnerPage             = new SpinnerPage(page);
    Methods                 = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Navigate to Price Offered list and open Chase Direct bid request');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['RequestIDDetails']);
        log.info('Bid Request ID: ' + vars['RequestIDDetails']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Bid_Req_IDChase_Direct.click();
        log.stepPass('Navigated to Price Offered list and opened Chase Direct bid request');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Price Offered list for Bid Request ID: ' + vars['RequestIDDetails']);
        throw e;
      }

      log.step('Commit an uncommitted loan in Chase Direct (if not already committed)');
      try {
        await priceOfferedPage.Check_UncommittedLoanNum1.check();
        await correspondentPortalPage.Get_Price_Button.click();
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await priceOfferedPage.Yes_Commit_Buttonpopup_price_offered_screen.waitFor({ state: 'visible' });
        await priceOfferedPage.Yes_Commit_Buttonpopup_price_offered_screen.click();
        await priceOfferedPage.Yes_Commit_Buttonpopup_price_offered_screen.waitFor({ state: 'hidden' });
        await priceOfferedPage.Okay_Buttonpopup_price_offered_screen.waitFor({ state: 'visible' });
        await priceOfferedPage.Okay_Buttonpopup_price_offered_screen.click();
        log.stepPass('Loan committed in Chase Direct');
      } catch (e) {
        await log.stepFail(page, 'Failed to commit loan in Chase Direct');
        throw e;
      }

      log.step('Capture committed loan details and auth limit info from All Loans tab');
      try {
        await priceOfferedPage.All_Loans_PriceofferedPage.click();
        vars['CommittedLoanNumber'] = await priceOfferedPage.Committed_Loan.textContent() || '';
        await priceOfferedPage.Committed_Loan_icon(vars["CommittedLoanNumber"]).waitFor({ state: 'visible' });
        Methods.trimtestdata(vars['CommittedLoanNumber'], 'CommittedLoanNumber');
        await expect(priceOfferedPage.Committed_Loan_icon(vars["CommittedLoanNumber"])).toBeVisible();
        log.info('Committed Loan Number: ' + vars['CommittedLoanNumber']);
        vars['OpenAuthLimit'] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '0', 'OpenAuthLimitChaseDirect');
       log.info('Open Auth Limit (Chase Direct): ' + vars['OpenAuthLimitChaseDirect']);
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '1', 'OpenAuthLimitPercentageChaseDirect');
        Methods.removeMultipleSpecialChars([')', '%'], vars['OpenAuthLimitPercentageChaseDirect'], 'OpenAuthLimitPercentageChaseDirect');

        vars['AuthLimitChaseDirect'] = await priceOfferedPage.Auth_Limit_All_Loans.textContent() || '';
        Methods.trimtestdata(vars['AuthLimitChaseDirect'], 'AuthLimitChaseDirect');
        log.info('Auth Limit (Chase Direct): ' + vars['AuthLimitChaseDirect']);

        vars['LastCommittedBid'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.splitBySpecialChar(vars['LastCommittedBid'], '|', '0', 'LastCommittedBidChaseDirect');
        Methods.trimtestdata(vars['LastCommittedBidChaseDirect'], 'LastCommittedBidChaseDirect');

        vars['LastCommittedBidLoanAmountChaseDirect'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
        Methods.removeCharactersFromPosition(vars['LastCommittedBidLoanAmountChaseDirect'],"3","0",'LastCommittedBidLoanAmountChaseDirect');       
        
        log.stepPass('Chase Direct committed loan details and auth limit captured');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture Chase Direct committed loan details');
        throw e;
      }

      log.step('Select duplicate loan in Standard and verify popup values');
      try {
        await priceOfferedPage.BackTo_PriceofferedPage.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Bid_Req_IDStandard.click();
        await priceOfferedPage.Select_Loan_which_is_committed_in_Chase_Direct(vars["CommittedLoanNumber"]).waitFor({ state: 'visible' });
        await priceOfferedPage.Select_Loan_which_is_committed_in_Chase_Direct(vars["CommittedLoanNumber"]).check();
        vars['LoanCount(Screen)'] = String(await priceOfferedPage.Checked_Row.count());
        log.info('Loan count on screen: ' + vars['LoanCount(Screen)']);
        vars['LoanAmountValue(Screen)'] = await priceOfferedPage.Count_of_Selected_Loans.textContent() || '';
        Methods.trimtestdata(vars['LoanAmountValue(Screen)'],"LoanAmountValue(Screen)");
        
        log.info('Loan amount on screen: ' + vars['LoanAmountValue(Screen)']);
        await correspondentPortalPage.Get_Price_Button.click();
        await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        vars['BidRequestIDPopup']              = await priceOfferedPage.BidRequestIDPopupDetails.textContent() || '';
        vars['PriceofferedLoanvalue(Popup)']   = await priceOfferedPage.Price_Offered_Loan_Value.textContent() || '';
        vars['CountofSelectedLoans(Popup)']    = await priceOfferedPage.Selected_Loans_Number.textContent() || '';
        Methods.trimtestdata(vars['CountofSelectedLoans(Popup)'],"CountofSelectedLoans(Popup)");
        expect(Methods.verifyString(vars['BidRequestIDPopup'], 'equals', vars['RequestIDDetails']));
        expect(Methods.verifyString(vars['PriceofferedLoanvalue(Popup)'], 'equals', vars['LoanAmountValue(Screen)']));
        expect(Methods.verifyString(vars['CountofSelectedLoans(Popup)'], 'equals', vars['LoanCount(Screen)']));
        log.stepPass('Popup values verified Bid ID: ' + vars['BidRequestIDPopup'] + '  Loan value: ' + vars['PriceofferedLoanvalue(Popup)'] + 'Loans Count: ' + vars['CountofSelectedLoans(Popup)']);
      } catch (e) {
        await log.stepFail(page, 'Popup value verification failed');
        throw e;
      }

      log.step('Confirm commit and verify duplicate loan error message');
      try {
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        await correspondentPortalPage.Okay_Button1.waitFor({ state: 'visible' });
        vars['CommitmentUpdatedNumber'] = await priceOfferedPage.Commitment_ID.textContent() || '';
        Methods.storeCharacterCount(vars['CommitmentUpdatedNumber'], 'CommitmentUpdatedValue');
        log.info('Commitment ID: ' + vars['CommitmentUpdatedNumber'] + 'Length: ' + vars['CommitmentUpdatedValue']);
        expect(Methods.verifyComparison(vars['CommitmentUpdatedValue'], '==', appconstants.COMMITMENT_ID_LENGTH));
        vars['Loansfailed(Popup)'] = await priceOfferedPage.Loans_added_successfullyPopup.textContent() || '';
        Methods.trimtestdata(vars['Loansfailed(Popup)'], 'Loansfailed(Popup)');
        expect(Methods.verifyString(vars['Loansfailed(Popup)'], 'equals', appconstants.LOANS_FAILED_TO_ADD));
        Methods.concatenateWithSpace('Loan', vars['CommittedLoanNumber'], 'DuplicateLoan');
        Methods.concatenateWithSpace(vars['DuplicateLoan'], appconstants.DUPLICATE_LOAN, 'DuplicateLoan(Popup)');
        await expect(priceOfferedPage.Commit_Loan_TextPopup).toContainText(vars['DuplicateLoan(Popup)']);
        log.info('Duplicate loan message: ' + vars['DuplicateLoan(Popup)']);
        await correspondentPortalPage.Okay_Button1.click();
        log.stepPass('Duplicate loan error message verified');
      } catch (e) {
        await log.stepFail(page, 'Duplicate loan error message verification failed');
        throw e;
      }

      log.step('Verify auth limit values are unchanged after Standard commit attempt');
      try {
        await priceOfferedPage.LockedCommitted_Loans.waitFor({ state: 'visible' });

        vars['OpenAuthLimit'] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '0', 'OpenAuthLimitStandard');
        log.info('Open Auth Limit (Standard): ' + vars['OpenAuthLimitStandard']);
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '1', 'OpenAuthLimitPercentageStandard');
        Methods.removeMultipleSpecialChars([')', '%'], vars['OpenAuthLimitPercentageStandard'], 'OpenAuthLimitPercentageStandard');

        
        vars['AuthLimitStandard'] = await priceOfferedPage.Auth_Limit_All_Loans.textContent() || '';
        Methods.trimtestdata(vars['AuthLimitStandard'], 'AuthLimitStandard');
        log.info('Auth Limit (Standard): ' + vars['AuthLimitStandard']);

        vars['LastCommittedBid'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.splitBySpecialChar(vars['LastCommittedBid'], '|', '0', 'LastCommitedBidStandard');
        Methods.trimtestdata(vars['LastCommitedBidStandard'], 'LastCommitedBidStandard');

        vars['LastCommittedBidLoanAmountStandard'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
        Methods.removeCharactersFromPosition(vars['LastCommittedBidLoanAmountStandard'], "3","0",'LastCommittedBidLoanAmountStandard');

        await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
        await expect(priceOfferedPage.Committed_Loan_icon(vars["CommittedLoanNumber"])).not.toBeVisible();
        log.info("Duplicate loan is not committed and the locked symbol is not displayed for the duplicate loan")
        expect(Methods.verifyString(vars['OpenAuthLimitStandard'], 'equals', vars['OpenAuthLimitChaseDirect']));
        expect(Methods.verifyString(vars['OpenAuthLimitPercentageStandard'], 'equals', vars['OpenAuthLimitPercentageChaseDirect']));
        expect(Methods.verifyString(vars['AuthLimitStandard'], 'equals', vars['AuthLimitChaseDirect']));
        expect(Methods.verifyString(vars['LastCommitedBidStandard'], 'equals', vars['LastCommittedBidChaseDirect']));
        expect(Methods.verifyString(vars['LastCommittedBidLoanAmountStandard'], 'equals', vars['LastCommittedBidLoanAmountChaseDirect']));    
        
        log.stepPass('Auth limit values verified — Standard matches Chase Direct');
      } catch (e) {
        await log.stepFail(page, 'Auth limit verification failed after Standard commit attempt');
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