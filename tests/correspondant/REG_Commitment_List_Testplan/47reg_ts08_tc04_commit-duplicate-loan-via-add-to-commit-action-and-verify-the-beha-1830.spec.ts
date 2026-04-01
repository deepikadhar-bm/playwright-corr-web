import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentDetailsPage } from '../../../src/pages/correspondant/commitment-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS08_TC04';
const TC_TITLE = 'Commit duplicate loan via add to commit action and verify the behaviour';

test.describe('Commitment List - TS_2', () => {
  let vars: Record<string, string> = {};
  let commitmentDetailsPage: CommitmentDetailsPage;
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
    commitmentDetailsPage = new CommitmentDetailsPage(page);
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

      log.step('Search by Bid Request ID and capture Standard commitment details');
      try {
        if (profile && profile.data) {
          vars['BidReqId'] = profile.data[0]['RequestIdFrom5-1'];
          log.info('BidReqId: ' + vars['BidReqId']);
        }
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars['BidReqId']);
        await priceOfferedPage.Search_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Commitment_IDStandard.first().click();
        await commitmentListPage.Total_LoansCommitment_List.click();
        vars['CommittedCorrLoan'] = await commitmentListPage.Committed_Loan_NumStandard_Commitment_List.first().textContent() || '';
        Methods.trimtestdata(vars['CommittedCorrLoan'], 'CommittedCorrLoan');
        log.info('CommittedCorrLoan: ' + vars['CommittedCorrLoan']);
        vars['OpenAuthLimit'] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '0', 'OpenAuthLimitStandard');
        Methods.removeMultipleSpecialChars(['$', ','], vars['OpenAuthLimitStandard'], 'OpenAuthLimitStandard');
        Methods.trimtestdata(vars['OpenAuthLimitStandard'], 'OpenAuthLimitStandard');
        log.info('OpenAuthLimitStandard: ' + vars['OpenAuthLimitStandard']);
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '1', 'OpenAuthLimitPercentageStandard');
        Methods.removeMultipleSpecialChars([')', '%'], vars['OpenAuthLimitPercentageStandard'], 'OpenAuthLimitPercentageStandard');
        Methods.trimtestdata(vars['OpenAuthLimitPercentageStandard'], 'OpenAuthLimitPercentageStandard');
        log.info('OpenAuthLimitPercentageStandard: ' + vars['OpenAuthLimitPercentageStandard']);
        vars['AuthLimitStandard'] = await priceOfferedPage.Auth_Limit_All_Loans.textContent() || '';
        Methods.trimtestdata(vars['AuthLimitStandard'], 'AuthLimitStandard');
        log.info('AuthLimitStandard: ' + vars['AuthLimitStandard']);
        vars['LastCommittedBid'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.splitBySpecialChar(vars['LastCommittedBid'], '|', '0', 'LastCommitedBidStandard');
        Methods.trimtestdata(vars['LastCommitedBidStandard'], 'LastCommitedBidStandard');
        log.info('LastCommitedBidStandard: ' + vars['LastCommitedBidStandard']);
        vars['LastCommittedBidLoanAmount'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
        Methods.removeCharactersFromPosition(vars['LastCommittedBidLoanAmount'], '3', '0', 'LastCommittedBidLoanAmountStandard');
        log.info('LastCommittedBidLoanAmountStandard: ' + vars['LastCommittedBidLoanAmountStandard']);
        await stepGroups.stepGroup_Storing_Required_Loan_Number_Details(page, vars);
        log.stepPass('Standard commitment details captured for BidReqId: ' + vars['BidReqId']);
      } catch (e) {
        await log.stepFail(page, 'Failed to capture Standard commitment details for BidReqId: ' + vars['BidReqId']);
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
        log.info('NoOfLoansBeforeCommit: ' + vars['NoOfLoansBeforeCommit']);
        vars['CommitID'] = await priceOfferedPage.Commit_IDCommitment_List.first().textContent() || '';
        Methods.trimtestdata(vars['CommitID'], 'CommitID');
        log.info('CommitID: ' + vars['CommitID']);
        log.stepPass('Chase Direct details captured CommitID: ' + vars['CommitID']);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Chase Direct or capture details before commit');
        throw e;
      }

      log.step('Select duplicate loan and perform Add to Commit action');
      try {
        await commitmentListPage.Total_LoansCommitment_List.click();
        await commitmentListPage.Check_Duplicate_Loan_Num(vars["CommittedCorrLoan"]).waitFor({ state: 'visible' });
        await commitmentListPage.Check_Duplicate_Loan_Num(vars["CommittedCorrLoan"]).check();
        vars['LoanCountScreen'] = String(await priceOfferedPage.Checked_Row.count());
        log.info('Selected Loans Count Screen: ' + vars['LoanCountScreen']);
        vars['SelectedLoanValueScreen'] = await commitmentDetailsPage.Checked_Loan_Numbercommitments_new(vars["CommittedCorrLoan"]).textContent() || '';
        Methods.trimtestdata(vars['SelectedLoanValueScreen'], 'SelectedLoanValueScreen');
        log.info('Selected Loan Value Screen: ' + vars['SelectedLoanValueScreen']);
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await correspondentPortalPage.Commitment_OrderCommitment_List(vars["CommitID"]).click();
        log.stepPass('Duplicate loan selected and Add to Commit dropdown opened');
      } catch (e) {
        await log.stepFail(page, 'Failed to select duplicate loan or open Add to Commit dropdown');
        throw e;
      }

      log.step('Verify popup details match selected loan details before confirming commit');
      try {
        vars['BidRequestIDPopup'] = await priceOfferedPage.BidRequestIDPopupDetails.textContent() || '';
        Methods.trimtestdata(vars['BidRequestIDPopup'], 'BidRequestIDPopup');
        log.info('BidRequest ID Popup: ' + vars['BidRequestIDPopup']);
        vars['LoanValuePopup'] = await priceOfferedPage.Loan_ValuePopup.textContent() || '';
        Methods.trimtestdata(vars['LoanValuePopup'], 'LoanValuePopup');
        log.info('Loan Value Popup: ' + vars['LoanValuePopup']);
        vars['SelectedLoansCountPopup'] = await priceOfferedPage.Selected_LoansPopup.textContent() || '';
        Methods.trimtestdata(vars['SelectedLoansCountPopup'], 'SelectedLoansCountPopup');
        log.info('Selected Loans Count Popup: ' + vars['SelectedLoansCountPopup']);
        expect(Methods.verifyString(vars['BidReqId'], 'equals', vars['BidRequestIDPopup']));
        expect(Methods.verifyString(vars['SelectedLoanValueScreen'], 'equals', vars['LoanValuePopup']));
        expect(Methods.verifyString(vars['LoanCountScreen'], 'equals', vars['SelectedLoansCountPopup']));
        log.stepPass('Popup details verified successfully');
      } catch (e) {
        await log.stepFail(page,'Failed to verify the popup details');
        throw e;
      }

      log.step('Confirm commit and verify duplicate loan error message in popup');
      try {
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
        Methods.concatenateWithSpace('Commitment', vars['CommitID'],'CommitmentUpdateText');
        Methods.concatenateWithSpace(vars['CommitmentUpdateText'], 'is','CommitmentUpdateText');
        Methods.concatenateWithSpace(vars['CommitmentUpdateText'], 'updated.','CommitmentUpdateText');
        log.info('ExpectedCommitmentUpdateText: ' + vars['CommitmentUpdateText']);
        Methods.concatenateWithSpace('Loan', vars['CommittedCorrLoan'],'LoanDuplicateText');
        Methods.concatenateWithSpace(vars['LoanDuplicateText'], appconstants.DUPLICATE_TEXT_POPUP,'LoanDuplicateText');
        log.info('ExpectedLoanDuplicateText: ' + vars['LoanDuplicateText']);
        await expect(commitmentListPage.Commitment_UpdatePopup).toContainText(vars['CommitmentUpdateText']);
        await expect(priceOfferedPage.Loans_added_successfullyPopup).toContainText(appconstants.LOANS_FAILED_TO_ADD);
        await expect(priceOfferedPage.Commit_Loan_TextPopup).toContainText(vars['LoanDuplicateText']);
        log.stepPass('Duplicate loan error verified in popup for loan: ' + vars['CommittedCorrLoan']);
      } catch (e) {
        await log.stepFail(page, 'Duplicate loan error message not displayed as expected for loan: ' + vars['CommittedCorrLoan']);
        throw e;
      }

      log.step('Verify loan count remains unchanged after duplicate commit attempt');
      try {
        await priceOfferedPage.Okay_ButtonPopup.click();
        await commitmentListPage.Total_Committed_Loans_Tab.waitFor({ state: 'visible' });
        await commitmentListPage.Total_Committed_Loans_Tab.click();
        await expect(priceOfferedPage.Committed_CorrLoan(vars["CommittedCorrLoan"])).not.toBeVisible();
        vars['NoOfLoansAfterCommit'] = await commitmentListPage.No_ofLoansCommitment_List_Details.textContent() || '';
        Methods.trimtestdata(vars['NoOfLoansAfterCommit'], 'NoOfLoansAfterCommit');
        log.info('NoOf Loans After Commit: ' + vars['NoOfLoansAfterCommit']);
        expect(Methods.verifyString(vars['NoOfLoansBeforeCommit'], 'equals', vars['NoOfLoansAfterCommit']));
        log.stepPass('After commiting duplicate loan the count of committed loans is not changed');
      } catch (e) {
        await log.stepFail(page, 'After commiting duplicate loan the count of committed loans is changed');
        throw e;
      }

      log.step('Verify committed loan is visible in Total Loans tab and validate loan details');
      try {
        await commitmentListPage.Total_LoansCommitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Committed_CorrLoan(vars["CommittedCorrLoan"])).toBeVisible();
        await stepGroups.stepGroup_Verifying_Loan_Details(page, vars);
        
        log.stepPass('Committed loan visible and loan details verified for loan: ' + vars['CommittedCorrLoan']);
      } catch (e) {
        await log.stepFail(page, 'Committed loan not visible or loan details verification failed for loan: ' + vars['CommittedCorrLoan']);
        throw e;
      }

      log.step('Capture Chase Direct auth limit details and verify values unchanged after duplicate commit');
      try {
        await correspondentPortalPage.Open_Auth_Limit_Total_Loan.scrollIntoViewIfNeeded();
        vars['OpenAuthLimit'] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '0', 'OpenAuthLimitChaseDirect');
        Methods.removeMultipleSpecialChars(['$', ','], vars['OpenAuthLimitChaseDirect'], 'OpenAuthLimitChaseDirect');
        Methods.trimtestdata(vars['OpenAuthLimitChaseDirect'], 'OpenAuthLimitChaseDirect');
        log.info('OpenAuthLimitChaseDirect: ' + vars['OpenAuthLimitChaseDirect']);
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '1', 'OpenAuthLimitPercentageChaseDirect');
        Methods.removeMultipleSpecialChars([')', '%'], vars['OpenAuthLimitPercentageChaseDirect'], 'OpenAuthLimitPercentageChaseDirect');
        Methods.trimtestdata(vars['OpenAuthLimitPercentageChaseDirect'], 'OpenAuthLimitPercentageChaseDirect');
        log.info('OpenAuthLimitPercentageChaseDirect: ' + vars['OpenAuthLimitPercentageChaseDirect']);
        vars['AuthLimitChaseDirect'] = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
        Methods.trimtestdata(vars['AuthLimitChaseDirect'], 'AuthLimitChaseDirect');
        log.info('AuthLimitChaseDirect: ' + vars['AuthLimitChaseDirect']);
        vars['LastCommittedBid'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.splitBySpecialChar(vars['LastCommittedBid'], '|', '0', 'LastCommittedBidChaseDirect');
        Methods.trimtestdata(vars['LastCommittedBidChaseDirect'], 'LastCommittedBidChaseDirect');
        log.info('LastCommittedBidChaseDirect: ' + vars['LastCommittedBidChaseDirect']);
        vars['LastCommittedBidLoanAmount'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
        Methods.removeCharactersFromPosition(vars['LastCommittedBidLoanAmount'], '3', '0', 'LastCommittedBidLoanAmountChaseDirect');
        log.info('LastCommittedBidLoanAmountChaseDirect: ' + vars['LastCommittedBidLoanAmountChaseDirect']);
        expect(Methods.verifyString(vars['OpenAuthLimitStandard'], 'equals', vars['OpenAuthLimitChaseDirect']));
        expect(Methods.verifyString(vars['OpenAuthLimitPercentageStandard'], 'equals', vars['OpenAuthLimitPercentageChaseDirect']));
        expect(Methods.verifyString(vars['AuthLimitStandard'], 'equals', vars['AuthLimitChaseDirect']));
        expect(Methods.verifyString(vars['LastCommitedBidStandard'], 'equals', vars['LastCommittedBidChaseDirect']));
        expect(Methods.verifyString(vars['LastCommittedBidLoanAmountStandard'], 'equals', vars['LastCommittedBidLoanAmountChaseDirect']));
        log.stepPass('Auth limit values unchanged after duplicate commit');
      } catch (e) {
        await log.stepFail( page,'Auth limit mismatch  Standard and ChaseDirect after duplicate loan committed');
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