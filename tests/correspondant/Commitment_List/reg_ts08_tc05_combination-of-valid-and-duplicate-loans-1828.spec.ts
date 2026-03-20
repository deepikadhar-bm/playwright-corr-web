import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS08_TC05';
const TC_TITLE = 'Combination of valid and duplicate loans';

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
        await log.stepFail(page, 'Failed to login CORR portal');
        throw e;
      }

      log.step('Search by Bid Request ID and capture Standard commitment loan numbers');
      try {
        if (profile && profile.data) {
          vars['BidReqId'] = profile.data[0]['RequestIdFrom5-1'];
          log.info('BidReqId: ' + vars['BidReqId']);
        }
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Search_Dropdown.type(vars['BidReqId']);
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Commitment_IDStandard.first().click();
        await commitmentListPage.Total_LoansCommitment_List.waitFor({ state: 'visible' });
        await commitmentListPage.Total_LoansCommitment_List.click();
        await commitmentListPage.Committed_Loan_NumStandard_Commitment_List.first().waitFor({ state: 'visible' });
        vars['CommittedLoanNumStandard'] = await commitmentListPage.Committed_Loan_NumStandard_Commitment_List.first().textContent() || '';
        Methods.trimtestdata(vars['CommittedLoanNumStandard'], 'CommittedLoanNumStandard');
        log.info('Committed Loan Num Standard: ' + vars['CommittedLoanNumStandard']);
        vars['FreshLoanNumStandard1'] = await commitmentListPage.Fresh_Loan_Num1Standard_Commitment_List.first().textContent() || '';
        Methods.trimtestdata(vars['FreshLoanNumStandard1'], 'FreshLoanNumStandard1');
        log.info('Fresh Loan Num Standard1: ' + vars['FreshLoanNumStandard1']);
        vars['FreshLoanNumStandard2'] = await commitmentListPage.Fresh_Loan_Num2Standard.first().textContent() || '';
        Methods.trimtestdata(vars['FreshLoanNumStandard2'], 'FreshLoanNumStandard2');
        log.info('Fresh Loan Num Standard2: ' + vars['FreshLoanNumStandard2']);
        log.stepPass('Standard loan numbers captured for BidReqId: ' + vars['BidReqId']);
      } catch (e) {
        await log.stepFail(page, 'Failed to capture Standard loan numbers for BidReqId: ' + vars['BidReqId']);
        throw e;
      }

      log.step('Navigate to Chase Direct commitment and capture details before commit');
      try {
        await priceOfferedPage.Back_To_Commitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Commitment_IDChase_Direct.first().click();
        await commitmentListPage.Total_LoansCommitment_List.waitFor({ state: 'visible' });
        vars['NoOfLoansBeforeCommit'] = await commitmentListPage.No_ofLoansCommitment_List_Details.first().textContent() || '';
        Methods.trimtestdata(vars['NoOfLoansBeforeCommit'], 'NoOfLoansBeforeCommit');
        log.info('NoOf Loans Before Commit: ' + vars['NoOfLoansBeforeCommit']);
        vars['CommitID'] = await priceOfferedPage.Commit_IDCommitment_List.first().textContent() || '';
        Methods.trimtestdata(vars['CommitID'], 'CommitID');
        log.info('CommitID: ' + vars['CommitID']);
        vars['OpenAuthLimit'] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '0', 'OpenAuthLimitBeforeCommit');
        Methods.removeMultipleSpecialChars(['$', ','], vars['OpenAuthLimitBeforeCommit'], 'OpenAuthLimitBeforeCommit');
        Methods.trimtestdata(vars['OpenAuthLimitBeforeCommit'], 'OpenAuthLimitBeforeCommit');
        log.info('OpenAuthLimitBeforeCommit: ' + vars['OpenAuthLimitBeforeCommit']);
        vars['AuthLimitBeforeCommit'] = await priceOfferedPage.Auth_Limit.textContent() || '';
        Methods.trimtestdata(vars['AuthLimitBeforeCommit'], 'AuthLimitBeforeCommit');
        log.info('AuthLimitBeforeCommit: ' + vars['AuthLimitBeforeCommit']);
        vars['LastCommittedBidLoanAmount'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
        Methods.removeCharactersFromPosition(vars['LastCommittedBidLoanAmount'], '3', '0', 'LastCommittedBidLoanAmounBeforeCommit');
        log.info('LastCommittedBidLoanAmounBeforeCommit: ' + vars['LastCommittedBidLoanAmounBeforeCommit']);
        log.stepPass('Chase Direct details captured. CommitID: ' + vars['CommitID']);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Chase Direct or capture details before commit');
        throw e;
      }

      log.step('Select valid and duplicate loans in Chase Direct and determine committed loan');
      try {
        await commitmentListPage.Total_LoansCommitment_List.click();
        await commitmentListPage.Committed_Loan_NumberChase_Direct.first().waitFor({ state: 'visible' });
        vars['CommittedLoanNumChaseDirect'] = await commitmentListPage.Committed_Loan_NumberChase_Direct.first().textContent() || '';
        Methods.trimtestdata(vars['CommittedLoanNumChaseDirect'], 'CommittedLoanNumChaseDirect');
        log.info('CommittedLoanNumChaseDirect: ' + vars['CommittedLoanNumChaseDirect']);
        if (String(vars['CommittedLoanNumChaseDirect']) !== String(vars['FreshLoanNumStandard1'])) {
          vars['CommittedCorrLoan'] = vars['FreshLoanNumStandard1'];
        } else if (String(vars['CommittedLoanNumChaseDirect']) !== String(vars['FreshLoanNumStandard2'])) {
          vars['CommittedCorrLoan'] = vars['FreshLoanNumStandard2'];
        }
        log.info('CommittedCorrLoan (fresh loan to commit): ' + vars['CommittedCorrLoan']);
        await commitmentListPage.Fresh_Loan_NumChase_Direct(vars["CommittedCorrLoan"]).check();
        await priceOfferedPage.Check_Duplicate_Loan_NumChase_Direct(vars["CommittedLoanNumStandard"]).check();
        await stepGroups.stepGroup_Storing_Required_Loan_Number_Details2(page, vars);
        vars['ExpectedCommittedLoanAmount'] = String(vars['CommittedLoanAmountTotalLoans']).trim();
        log.info('ExpectedCommittedLoanAmount: ' + vars['ExpectedCommittedLoanAmount']);
        vars['SelectedLoanScreen'] = String(await priceOfferedPage.Checked_Row.count());
        log.info('SelectedLoanScreen: ' + vars['SelectedLoanScreen']);
        vars['LoanAmount2'] = await priceOfferedPage.Loan_AmountDuplicate_Loan_Num(vars["CommittedLoanNumStandard"]).textContent() || '';
        Methods.trimtestdata(vars['LoanAmount2'], 'LoanAmount2');
        Methods.performArithmetic(vars['CommittedLoanAmountTotalLoans'], 'ADDITION', vars['LoanAmount2'], 'SelectedLoanAmountScreen', 0);
        log.info('SelectedLoanAmountScreen: ' + vars['SelectedLoanAmountScreen']);
        log.stepPass('Valid and duplicate loans selected. CommittedCorrLoan: ' + vars['CommittedCorrLoan']);
      } catch (e) {
        await log.stepFail(page, 'Failed to select loans or determine committed loan');
        throw e;
      }

      log.step('Open Add to Commit dropdown and capture commitment order and popup details');
      try {
        await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        vars['CommitmentOrder'] = await correspondentPortalPage.Commitment_OrderCommitment_List(vars["CommitID"]).textContent() || '';
        Methods.getLastCharacters(vars['CommitmentOrder'], '1', 'CommitmentOrder');
        log.info('CommitmentOrder: ' + vars['CommitmentOrder']);
        await correspondentPortalPage.Commitment_OrderCommitment_List(vars["CommitID"]).click();
        vars['BidRequestIDPopup'] = await priceOfferedPage.BidRequestIDPopupDetails.textContent() || '';
        Methods.trimtestdata(vars['BidRequestIDPopup'], 'BidRequestIDPopup');
        vars['LoanValuePopup'] = await priceOfferedPage.Loan_ValuePopup.textContent() || '';
        Methods.removeMultipleSpecialChars(['$', ','], vars['LoanValuePopup'], 'LoanValuePopup');
        Methods.trimtestdata(vars['LoanValuePopup'], 'LoanValuePopup');
        vars['SelectedLoansPopup'] = await priceOfferedPage.Selected_LoansPopup.textContent() || '';
        Methods.trimtestdata(vars['SelectedLoansPopup'], 'SelectedLoansPopup');
        log.info('BidRequestIDPopup: ' + vars['BidRequestIDPopup']);
        log.info('LoanValuePopup: ' + vars['LoanValuePopup']);
        log.info('SelectedLoansPopup: ' + vars['SelectedLoansPopup']);
        expect(Methods.verifyString(vars['BidReqId'], 'equals', vars['BidRequestIDPopup']));
        expect(Methods.verifyString(vars['SelectedLoanAmountScreen'], 'equals', vars['LoanValuePopup']));
        expect(Methods.verifyString(vars['SelectedLoanScreen'], 'equals', vars['SelectedLoansPopup']));
        log.stepPass('Popup details verified successfully');
      } catch (e) {
        await log.stepFail(page,'Failed to verify the popup details');
        throw e;
      }

      log.step('Confirm commit and verify success and duplicate loan error messages in popup');
      try {
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
        Methods.concatenateWithSpace('Commitment', vars['CommitID'],'CommitmentUpdateText');
        Methods.concatenateWithSpace(vars['CommitmentUpdateText'], 'is','CommitmentUpdateText');
        Methods.concatenateWithSpace(vars['CommitmentUpdateText'], 'updated.','CommitmentUpdateText');
        log.info('ExpectedCommitmentUpdateText: ' + vars['CommitmentUpdateText']);

         Methods.concatenateWithSpace('Loan', vars['CommittedLoanNumStandard'],'DuplicateLoanText');
        Methods.concatenateWithSpace(vars['DuplicateLoanText'], appconstants.DUPLICATE_TEXT_POPUP,'DuplicateLoanText');
        log.info('ExpectedDuplicateLoanText: ' + vars['DuplicateLoanText']);
        await expect(commitmentListPage.Commitment_UpdatePopup).toContainText(vars['CommitmentUpdateText']);
        await expect(priceOfferedPage.Loans_added_successfullyPopup).toContainText(appconstants.LOANS_ADDED_SUCCESSFULLY);
        await expect(priceOfferedPage.Commit_Loan_TextPopup).toContainText(vars['CommittedCorrLoan']);
        await expect(priceOfferedPage.Loans_failedPopup).toContainText(appconstants.LOANS_FAILED_TO_ADD);
        await expect(priceOfferedPage.Loans_Failed_TextPopup).toContainText(vars['DuplicateLoanText']);
        log.stepPass('Commit popup messages verified for CommitID: ' + vars['CommitID']);
      } catch (e) {
        await log.stepFail(page, 'Commit popup messages not as expected for CommitID: ' + vars['CommitID']);
        throw e;
      }

      log.step('Verify committed and duplicate loans visible and loan count unchanged after commit');
      try {
        await priceOfferedPage.Okay_ButtonPopup.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Committed_CorrLoan(vars["CommittedCorrLoan"])).toBeVisible();
        await expect(priceOfferedPage.Duplicate_Loan_NumStandard(vars["CommittedLoanNumStandard"])).not.toBeVisible();
        vars['NoOfLoansAfterCommit'] = await commitmentListPage.No_ofLoansCommitment_List_Details.first().textContent() || '';
        Methods.trimtestdata(vars['NoOfLoansAfterCommit'], 'NoOfLoansAfterCommit');
        log.info('NoOfLoansAfterCommit: ' + vars['NoOfLoansAfterCommit']);
        expect(Methods.verifyComparison(vars['NoOfLoansBeforeCommit'], '<', vars['NoOfLoansAfterCommit']));
        await expect(priceOfferedPage.Commitment_OrderPrice_Offred(vars["CommittedCorrLoan"]).first()).toContainText(vars['CommitmentOrder']);
        log.stepPass('Committed Loans count is updated after committing a fresh loan');
      } catch (e) {
        await log.stepFail(page, 'Committed Loans count is not updated after committing a fresh loan');
        throw e;
      }

      log.step('verification of committed fresh loan details in total committed loans tab');
      try {
        await stepGroups.stepGroup_Verifying_Loan_Details2(page, vars);
        log.stepPass('Loan details verified for loan: ' + vars['CommittedCorrLoan']);
      } catch (e) {
        await log.stepFail(page, 'Loan details verification failed for loan: ' + vars['CommittedCorrLoan']);
        throw e;
      }

      log.step('Capture auth limit details after commit and verify calculations');
      try {
        await correspondentPortalPage.Open_Auth_Limit_Total_Loan.scrollIntoViewIfNeeded();
        vars['OpenAuthLimit'] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '0', 'OpenAuthLimitAfterCommit');
        Methods.removeMultipleSpecialChars(['$', ','], vars['OpenAuthLimitAfterCommit'], 'OpenAuthLimitAfterCommit');
        Methods.trimtestdata(vars['OpenAuthLimitAfterCommit'], 'OpenAuthLimitAfterCommit');
        log.info('OpenAuthLimitAfterCommit: ' + vars['OpenAuthLimitAfterCommit']);
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '1', 'OpenAuthLimitPercentageAfterCommit');
        Methods.removeMultipleSpecialChars([')', '%'], vars['OpenAuthLimitPercentageAfterCommit'], 'OpenAuthLimitPercentageAfterCommit');
        Methods.trimtestdata(vars['OpenAuthLimitPercentageAfterCommit'], 'OpenAuthLimitPercentageAfterCommit');
        log.info('OpenAuthLimitPercentageAfterCommit: ' + vars['OpenAuthLimitPercentageAfterCommit']);
        vars['AuthLimitAfterCommit'] = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
        Methods.trimtestdata(vars['AuthLimitAfterCommit'], 'AuthLimitAfterCommit');
        log.info('AuthLimitAfterCommit: ' + vars['AuthLimitAfterCommit']);
        vars['LastCommittedBid'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.splitBySpecialChar(vars['LastCommittedBid'], '|', '0', 'LastCommittedBidDateAndTimeAfterCommit');
        Methods.trimtestdata(vars['LastCommittedBidDateAndTimeAfterCommit'], 'LastCommittedBidDateAndTimeAfterCommit');
        log.info('LastCommittedBidDateAndTimeAfterCommit: ' + vars['LastCommittedBidDateAndTimeAfterCommit']);
        vars['LastCommittedBidLoanAmount'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
        Methods.removeCharactersFromPosition(vars['LastCommittedBidLoanAmount'], '3', '0', 'LastCommittedBidLoanAmountAfterCommit');
        Methods.removeMultipleSpecialChars(['$', ','], vars['LastCommittedBidLoanAmountAfterCommit'], 'LastCommittedBidLoanAmountAfterCommit');
        log.info('LastCommittedBidLoanAmountAfterCommit: ' + vars['LastCommittedBidLoanAmountAfterCommit']);
        Methods.performArithmetic(vars['OpenAuthLimitBeforeCommit'], 'SUBTRACTION', vars['ExpectedCommittedLoanAmount'], 'ExpectedOpenAuthLimit', 0);
        Methods.performArithmetic(vars['ExpectedOpenAuthLimit'], 'DIVISION', vars['AuthLimitBeforeCommit'], 'ExpectedOpenAuthLimitPercentage', 4);
        Methods.performArithmetic(vars['ExpectedOpenAuthLimitPercentage'], 'MULTIPLICATION', '100', 'ExpectedOpenAuthLimitPercentage', 2);
        Methods.performArithmetic(vars['LastCommittedBidLoanAmounBeforeCommit'], 'ADDITION', vars['ExpectedCommittedLoanAmount'], 'ExpectedLastCommittedLoanAmount',0);
        log.info('ExpectedOpenAuthLimit: ' + vars['ExpectedOpenAuthLimit']);
        log.info('ExpectedOpenAuthLimitPercentage: ' + vars['ExpectedOpenAuthLimitPercentage']);
        log.info('ExpectedLastCommittedLoanAmount: ' + vars['ExpectedLastCommittedLoanAmount']);
        expect(Methods.verifyString(vars['ExpectedOpenAuthLimit'], 'equals', vars['OpenAuthLimitAfterCommit']));
        expect(Methods.verifyString(vars['ExpectedOpenAuthLimitPercentage'], 'equals', vars['OpenAuthLimitPercentageAfterCommit']));
        expect(Methods.verifyString(vars['AuthLimitBeforeCommit'], 'equals', vars['AuthLimitAfterCommit']));
        expect(Methods.verifyString(vars['ExpectedLastCommittedLoanAmount'], 'equals', vars['LastCommittedBidLoanAmountAfterCommit']));
        log.stepPass('Auth limit values verified after commit');
      } catch (e) {
        await log.stepFail(page,'Fail to verify Auth limit values  after commit')
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