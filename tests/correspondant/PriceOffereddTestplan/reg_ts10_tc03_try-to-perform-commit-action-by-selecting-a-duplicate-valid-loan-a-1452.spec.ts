import { test, expect } from '@playwright/test';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1389 } from '../../../src/helpers/prereqs/prereq-1389';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
// import { ENV } from '@config/environments';
// import * as stepGroups from '../../../src/helpers/step-groups';


const TC_ID = 'REG_TS10_TC03';
const TC_TITLE = 'Try to perform commit action by selecting a duplicate + valid loan and verify the bid, loan value, and selected loan count displayed in the Commit Selected Loans popup';

test.describe('REG_PriceOffered', () => {

  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
//   const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1389(page, vars);
    // vars['Username'] = credentials.username;
    // vars['Password'] = credentials.password;
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    // await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);

    try {

      log.step('Navigate to Price Offered list and search by Bid Request ID');
      try {
        vars['BidReqIdPriceOffered'] = vars['RequestIDDetails'];
        // vars['BidReqIdPriceOffered'] ="87FG7C9D83E3";
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Bid Request ID: ' + vars['BidReqIdPriceOffered']);
        log.stepPass('Navigated to Price Offered list. Bid Request ID: ' + vars['BidReqIdPriceOffered']);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Price Offered list for Bid Request ID: ' + vars['BidReqIdPriceOffered']);
        throw e;
      }

      log.step('Commit a loan in Standard and capture committed/uncommitted loan numbers');
      try {
        await priceOfferedPage.BidReqId_Standard.click();
        await priceOfferedPage.Required_Loan_Num.first().waitFor({ state: 'visible' });
        await priceOfferedPage.Required_Loan_Num.first().check();
        await priceOfferedPage.Get_Price_Button.click();
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
        await priceOfferedPage.Okay_ButtonPopup.click();
        await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
        await priceOfferedPage.Committed_Loan_NumStandard.waitFor({ state: 'visible' });
        vars['CommittedLoanNumStandard'] = await priceOfferedPage.Committed_Loan_NumStandard.textContent() || '';
        Methods.trimtestdata(vars['CommittedLoanNumStandard'], 'CommittedLoanNumStandard');
        log.info('Committed Loan (Standard): ' + vars['CommittedLoanNumStandard']);
        vars['UncommittedLoanNumStandard'] = await priceOfferedPage.Uncommitted_Loan_NumStandard.first().textContent() || '';
        log.info('Uncommitted Loan (Standard): ' + vars['UncommittedLoanNumStandard']);        
        Methods.trimtestdata(vars['UncommittedLoanNumStandard'], 'UncommittedLoanNumStandard');
        vars['OpenAuthLimitRaw'] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimitRaw'], '(', '0', 'OpenAuthLimitStandard');
        log.info('Open Auth Limit (Standard): ' + vars['OpenAuthLimitStandard']);
        vars['AuthLimitStandard'] = await priceOfferedPage.Auth_Limit.textContent() || '';
        Methods.trimtestdata(vars['AuthLimitStandard'], 'AuthLimitStandard');    
        log.stepPass('Standard loan committed: ' + vars['CommittedLoanNumStandard'] + 'Uncommitted Loan: ' + vars['UncommittedLoanNumStandard']);
      } catch (e) {
        await log.stepFail(page, 'Failed to commit Standard loan or capture loan numbers');
        throw e;
      }

      log.step('Select duplicate and fresh loans in Chase Direct and verify popup values');
      try {
        await priceOfferedPage.BackTo_PriceofferedPage.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidReqId_Chase_Direct.click();
        await priceOfferedPage.Check_Fresh_Loan_NumChase_Direct(vars["UncommittedLoanNumStandard"]).check();
        await priceOfferedPage.Check_Duplicate_Loan_NumChase_Direct(vars["CommittedLoanNumStandard"]).check();
        vars['SelectedLoansCount'] = String(await priceOfferedPage.Checked_Row.count());
        log.info('Selected loans count: ' + vars['SelectedLoansCount']);
        vars['LoanAmountDuplicateLoan'] = await priceOfferedPage.Loan_AmountDuplicate_Loan_Num(vars["CommittedLoanNumStandard"]).textContent() || '';
        vars['LoanAmountFreshLoan'] = await priceOfferedPage.Loan_AmountFresh_Loan_Num(vars["UncommittedLoanNumStandard"]).textContent() || '';
        Methods.trimtestdata(vars['LoanAmountFreshLoan'], 'ExpectedCommittedLoanAmount');
        Methods.MathematicalOperation(vars['LoanAmountDuplicateLoan'], '+', vars['LoanAmountFreshLoan'], 'TotalSelectedLoanAmount');
        Methods.trimtestdata(vars['TotalSelectedLoanAmount'], 'TotalSelectedLoanAmount');
        log.info('Total selected loan amount: ' + vars['TotalSelectedLoanAmount']);
        await priceOfferedPage.Get_Price_Button.click();
        await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        vars['BidreqIDPopup'] = await priceOfferedPage.BidRequestIdPopup.textContent() || '';
        vars['LoanValuePopup'] = await priceOfferedPage.Loan_ValuePopup.textContent() || '';
        Methods.removeMultipleSpecialChars(['$', ','], vars['LoanValuePopup'], 'LoanValuePopup');
        vars['SelectedLoansCountPopup'] = await priceOfferedPage.Selected_LoansPopup.textContent() || '';
        Methods.trimtestdata(vars['SelectedLoansCountPopup'], 'SelectedLoansCountPopup');
        expect(Methods.verifyString(vars['BidreqIDPopup'], 'equals', vars['BidReqIdPriceOffered']));
        expect(Methods.verifyString(vars['LoanValuePopup'], 'equals', vars['TotalSelectedLoanAmount']));
        expect(Methods.verifyString(vars['SelectedLoansCountPopup'], 'equals', vars['SelectedLoansCount']));
        log.stepPass('Popup values verified. Bid ID: ' + vars['BidreqIDPopup'] + 'Loan value: ' + vars['LoanValuePopup'] + 'Loans Count: ' + vars['SelectedLoansCountPopup']);
      } catch (e) {
        await log.stepFail(page, 'Popup value verification failed');
        throw e;
      }

      log.step('Confirm commit and verify duplicate loan error and successful loan message');
      try {
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        Methods.getCurrentTimestamp(appconstants.DATE_TIME_FORMAT_COMMIT, 'ExpectedBidCommittedDateAndTime', appconstants.UTC);
        await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
        vars['CommitmentUniqueNumberPopup'] = await priceOfferedPage.Commitment_ID.textContent() || '';
        Methods.storeCharacterCount(vars['CommitmentUniqueNumberPopup'], 'CommitmentUniqueNumberPopup');
        log.info('Commitment ID length: ' + vars['CommitmentUniqueNumberPopup']);
        expect(Methods.verifyComparison(vars['CommitmentUniqueNumberPopup'], '==', appconstants.COMMITMENT_ID_LENGTH));
        await expect(priceOfferedPage.Loans_added_successfullyPopup).toContainText(appconstants.LOANS_ADDED_SUCCESSFULLY);
        await expect(priceOfferedPage.Commit_Loan_TextPopup).toContainText(vars['UncommittedLoanNumStandard']);
        await expect(priceOfferedPage.Loans_failedPopup).toContainText(appconstants.LOANS_FAILED_TO_ADD);
        Methods.concatenateWithSpace('Loan', vars['CommittedLoanNumStandard'], 'DuplicateLoan');
        Methods.concatenateWithSpace(vars['DuplicateLoan'], appconstants.DUPLICATE_LOAN, 'LoanDuplicateMessage');
        log.info('Duplicate loan message: ' + vars['LoanDuplicateMessage']);
        await expect(priceOfferedPage.Loans_Failed_TextPopup).toContainText(vars['LoanDuplicateMessage']);
        await priceOfferedPage.Okay_ButtonPopup.click();
        log.stepPass('Commit confirmation verified. Duplicate error and successful loan message correct');
      } catch (e) {
        await log.stepFail(page, 'Commit confirmation verification failed');
        throw e;
      }

      log.step('Capture committed loan details from All Loans tab');
      try {
        await priceOfferedPage.All_Loans_PriceofferedPage.click();
        await priceOfferedPage.Committed_Loan_Locked_Icon(vars["UncommittedLoanNumStandard"]).waitFor({ state: 'visible' });
        vars['ExpectedCommittedLoans'] = String(await priceOfferedPage.Committed_Loans.count());
        log.info('Committed loans count: ' + vars['ExpectedCommittedLoans']);
        vars['CommitmentOrderAllLoans'] = await priceOfferedPage.Commitment_OrderChase_Direct(vars["UncommittedLoanNumStandard"]).textContent() || '';
        vars['LastNameAllLoans'] = await priceOfferedPage.Last_Name_Committed_Loan(vars["UncommittedLoanNumStandard"]).textContent() || '';
        vars['LoanAmountAllLoans'] = await priceOfferedPage.Loan_Amount_Committed_Loan(vars["UncommittedLoanNumStandard"]).textContent() || '';
        vars['InterestRateAllLoans'] = await priceOfferedPage.Interest_Rate_Committed_Loan(vars["UncommittedLoanNumStandard"]).textContent() || '';
        vars['ReferenceSecurityAllLoans'] = await priceOfferedPage.Reference_Security_Committed_Loan(vars["UncommittedLoanNumStandard"]).textContent() || '';
        vars['ReferenceSecurityPriceAllLoans'] = await priceOfferedPage.Reference_Security_Price_Committed_Loan(vars["UncommittedLoanNumStandard"]).textContent() || '';
        vars['GrossPriceAllLoans'] = await priceOfferedPage.Gross_Price_Committed_Loan(vars["UncommittedLoanNumStandard"]).textContent() || '';
        vars['HedgeRatioAllLoans'] = await priceOfferedPage.Hedge_Ratio_Committed_Loan(vars["UncommittedLoanNumStandard"]).textContent() || '';
        vars['MarketAdjustmentAllLoans'] = await priceOfferedPage.Market_Adjustment_Committed_Loan(vars["UncommittedLoanNumStandard"]).textContent() || '';
        vars['CurrentGrossPriceAllLoans'] = await priceOfferedPage.Current_Gross_Price_Committed_Laon(vars["UncommittedLoanNumStandard"]).textContent() || '';
        vars['OpenAuthLimitRaw'] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimitRaw'], '(', '0', 'OpenAuthLimitChaseDirect');
        Methods.removeMultipleSpecialChars(['$', ','], vars['OpenAuthLimitChaseDirect'], 'OpenAuthLimitChaseDirect');
        Methods.trimtestdata(vars['OpenAuthLimitChaseDirect'], 'OpenAuthLimitChaseDirect');
        log.info('Open Auth Limit (Chase Direct): ' + vars['OpenAuthLimitChaseDirect']);

        Methods.splitBySpecialChar(vars['OpenAuthLimitRaw'], '(', '1', 'OpenAuthLimitPercentageChaseDirect');
        Methods.removeMultipleSpecialChars([')', '%'], vars['OpenAuthLimitPercentageChaseDirect'], 'OpenAuthLimitPercentageChaseDirect');
        vars['AuthLimitChaseDirect'] = await priceOfferedPage.Auth_Limit.textContent() || '';
        Methods.trimtestdata(vars['AuthLimitChaseDirect'], 'AuthLimitChaseDirect');
        log.info('Auth Limit (Chase Direct): ' + vars['AuthLimitChaseDirect']);

        vars['LastCommittedBidRaw'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.splitBySpecialChar(vars['LastCommittedBidRaw'], '|', '0', 'ActualCommittedBidDateAndTime');
        Methods.trimtestdata(vars['ActualCommittedBidDateAndTime'], 'ActualCommittedBidDateAndTime');
        vars['LatestCommittedBidLoanAmount'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
        Methods.removeCharactersFromPosition(vars['LatestCommittedBidLoanAmount'], '3', '0', "ActualCommittedBidLoanAmount");
        await expect(priceOfferedPage.Committed_Loan_Locked_Icon(vars["UncommittedLoanNumStandard"])).toBeVisible();
        log.stepPass('All Loans tab details captured Committed loans: ' + vars['ExpectedCommittedLoans']);
      } catch (e) {
        await log.stepFail(page, 'Failed to capture All Loans tab details');
        throw e;
      }

      log.step('Verify locked/committed loans tab and auth limit calculations');
      try {
        await priceOfferedPage.LockedCommitted_Loans.click();
        await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Paste_Loans_ButtonPrice_Offered_Page).not.toBeVisible();
        vars['ActualCommittedLoans'] = await priceOfferedPage.LockedCommitted_Loans_Count.textContent() || '';
        Methods.trimtestdata(vars['ActualCommittedLoans'], 'ActualCommittedLoans');
        expect(Methods.verifyString(vars['ActualCommittedLoans'], 'equals', vars['ExpectedCommittedLoans']));
        await expect(priceOfferedPage.Commitment_OrderChase_Direct(vars["UncommittedLoanNumStandard"])).toContainText(vars['CommitmentOrderAllLoans']);
        await expect(priceOfferedPage.Committed_Loan_NumChase(vars["UncommittedLoanNumStandard"])).toBeVisible();
        await expect(priceOfferedPage.Duplicate_Loan_NumStandard(vars["CommittedLoanNumStandard"])).not.toBeVisible();
        await expect(priceOfferedPage.Last_Name_Committed_Loan(vars["UncommittedLoanNumStandard"])).toContainText(vars['LastNameAllLoans']);
        await expect(priceOfferedPage.Loan_Amount_Committed_Loan(vars["UncommittedLoanNumStandard"])).toContainText(vars['LoanAmountAllLoans']);
        await expect(priceOfferedPage.Interest_Rate_Committed_Loan(vars["UncommittedLoanNumStandard"])).toContainText(vars['InterestRateAllLoans']);
        await expect(priceOfferedPage.Reference_Security_Committed_Loan(vars["UncommittedLoanNumStandard"])).toContainText(vars['ReferenceSecurityAllLoans']);
        await expect(priceOfferedPage.Reference_Security_Price_Committed_Loan(vars["UncommittedLoanNumStandard"])).toContainText(vars['ReferenceSecurityPriceAllLoans']);
        await expect(priceOfferedPage.Gross_Price_Committed_Loan(vars["UncommittedLoanNumStandard"])).toContainText(vars['GrossPriceAllLoans']);
        await expect(priceOfferedPage.Hedge_Ratio_Committed_Loan(vars["UncommittedLoanNumStandard"])).toContainText(vars['HedgeRatioAllLoans']);
        await expect(priceOfferedPage.Market_Adjustment_Committed_Loan(vars["UncommittedLoanNumStandard"])).toContainText(vars['MarketAdjustmentAllLoans']);
        await expect(priceOfferedPage.Current_Gross_Price_Committed_Laon(vars["UncommittedLoanNumStandard"])).toContainText(vars['CurrentGrossPriceAllLoans']);
        Methods.performArithmetic(vars['OpenAuthLimitStandard'], 'SUBTRACTION', vars['ExpectedCommittedLoanAmount'], 'ExpectedOpenAuthLimit',0);
        Methods.performArithmetic(vars['ExpectedOpenAuthLimit'], 'DIVISION', vars['AuthLimitChaseDirect'], 'ExpectedOpenAuthLimitPercentage',4);
        Methods.performArithmetic(vars['ExpectedOpenAuthLimitPercentage'], 'MULTIPLICATION', '100', 'ExpectedOpenAuthLimitPercentage',2);
        expect(Methods.verifyString(vars['ExpectedOpenAuthLimit'], 'equals', vars['OpenAuthLimitChaseDirect']));
        expect(Methods.verifyString(vars['ExpectedOpenAuthLimitPercentage'], 'equals', vars['OpenAuthLimitPercentageChaseDirect']));
        expect(Methods.verifyString(vars['AuthLimitStandard'], 'equals', vars['AuthLimitChaseDirect']));
        expect(Methods.verifyString(vars['ExpectedBidCommittedDateAndTime'], 'equals', vars['ActualCommittedBidDateAndTime']));
        expect(Methods.verifyString(vars['ExpectedCommittedLoanAmount'], 'equals', vars['ActualCommittedBidLoanAmount']));
        log.stepPass('Locked/Committed Loans tab and auth limit calculations verified');
      } catch (e) {
        await log.stepFail(page, 'Locked/Committed Loans tab verification failed');
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