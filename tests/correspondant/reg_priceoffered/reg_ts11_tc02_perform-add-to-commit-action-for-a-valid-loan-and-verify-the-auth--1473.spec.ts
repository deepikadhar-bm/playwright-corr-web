import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';

const TC_ID = 'REG_TS11_TC02';
const TC_TITLE = 'Perform add to commit action for a valid loan and verify the auth limit, open auth limit and the Last committed bid values along with the [+count in header]';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  const profileName = 'Price Offered';
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

      log.step('Reading test data and login to CORR portal');
      try {
        if (profile && profile.data) {
          vars['BidReqIdPriceOffered'] = profile.data[0]['RequestIDfrom11-1'];
          log.info('BidReqIdPriceOffered: ' + vars['BidReqIdPriceOffered']);
        }
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login successful');
      } catch (e) {
        log.stepFail(page, 'Failed to read test data or login to CORR portal');
        throw e;
      }

      log.step('Navigating to Price Offered, committing a fresh loan and storing the required data');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Commits_an_Fresh_Loan_Num(page, vars);
        await priceOfferedPage.Open_Auth_Limit.waitFor({ state: 'visible' });
        vars['OpenAuthLimit'] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '0', 'OpenAuthLimitBeforeCommit');
        log.info('OpenAuthLimitBeforeCommit: ' + vars['OpenAuthLimitBeforeCommit']);
        vars['AuthLimitBeforeCommit'] = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
        log.info('AuthLimitBeforeCommit: ' + vars['AuthLimitBeforeCommit']);
        vars['LastCommittedBidBeforeCommit'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.splitBySpecialChar(vars['LastCommittedBidBeforeCommit'], '|', '0', 'LastCommittedBidBeforeCommit');
        Methods.trimtestdata(vars['LastCommittedBidBeforeCommit'], 'LastCommittedBidDateAndTimeBeforeCommit');
        vars['LastCommittedLoanAmountBeforeCommit'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
        Methods.removeCharactersFromPosition(vars['LastCommittedLoanAmountBeforeCommit'], '3', '0', 'LastCommittedLoanAmountBeforeCommit');
        vars['CommittedLoansCountBeforeCommit'] = await priceOfferedPage.LockedCommitted_Loans_Count.textContent() || '';
        log.stepPass('Successfully stored the required loan data');
      } catch (e) {
        log.stepFail(page, 'Failed to store required loan data');
        throw e;
      }

      log.step('Navigating to Commitment List and performing add to commit action');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars['BidReqIdPriceOffered']);
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.waitFor({ state: 'visible' });
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Commitment_ID_2(vars["BidReqIdPriceOffered"]).first().click();
        await commitmentListPage.Total_LoansCommitment_List.waitFor({ state: 'visible' });
        await commitmentListPage.Total_LoansCommitment_List.click();
        await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
        await priceOfferedPage.Required_Loan_Num.first().waitFor({ state: 'visible' });
        await priceOfferedPage.Required_Loan_Num.first().check();
        await expect(priceOfferedPage.Required_Loan_Num.first()).toBeChecked();
        vars['CommittedCorrLoan'] = await priceOfferedPage.Checked_Corr_Loan.textContent() || '';
        log.info('CommittedCorrLoan: ' + vars['CommittedCorrLoan']);
        vars['SelectedLoanAmount'] = await priceOfferedPage.Checked_Loan_Amount.textContent() || '';
        await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        vars['SelectedCommitmentOrder'] = await priceOfferedPage.Commitment_Order_Dropdown.first().textContent() || '';
        Methods.getLastCharacters(vars['SelectedCommitmentOrder'],"1",'ExpectedCommitmentOrder');
        log.info('ExpectedCommitmentOrder: ' + vars['ExpectedCommitmentOrder'],);
        await priceOfferedPage.Commitment_Order_Dropdown.first().click();
        await correspondentPortalPage.Yes_Commit_Button.click();
        await correspondentPortalPage.Okay_Button1.waitFor({ state: 'visible' });
        await correspondentPortalPage.Okay_Button1.click();
        log.stepPass('Add to commit action performed successfully for loan: ' + vars['CommittedCorrLoan']);
      } catch (e) {
        log.stepFail(page, 'Failed to perform add to commit action');
        throw e;
      }

      log.step('Verifying committed loan is visible in Total Committed Loans tab');
      try {
        await commitmentListPage.Total_Committed_Loans_Tab.waitFor({ state: 'visible' });
        await commitmentListPage.Total_Committed_Loans_Tab.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars['CommittedCorrLoan'])).toBeVisible();
        await stepGroups.stepGroup_Storing_Committed_Corr_Loan_Num_DetailsCommitment_List(page, vars);
        log.stepPass('Committed loan visible in Total Committed Loans tab: ' + vars['CommittedCorrLoan']);
      } catch (e) {
        log.stepFail(page, 'Failed to verify committed loan in Total Committed Loans tab');
        throw e;
      }

      log.step('Capturing post-commit data from Price Offered screen');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidRequestIDPrice_Offered(vars["BidReqIdPriceOffered"]).click();
        await priceOfferedPage.Open_Auth_Limit.waitFor({ state: 'visible' });
        vars['OpenAuthLimit'] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '0', 'OpenAuthLimitAfterCommit');
        Methods.removeMultipleSpecialChars(['$', ','], vars['OpenAuthLimitAfterCommit'], 'OpenAuthLimitAfterCommit');
        Methods.trimtestdata(vars['OpenAuthLimitAfterCommit'], 'OpenAuthLimitAfterCommit');
        log.info('OpenAuthLimitAfterCommit: ' + vars['OpenAuthLimitAfterCommit']);
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '1', 'OpenAuthLimitPercentageAfterCommit');
        Methods.removeMultipleSpecialChars([')', '%'], vars['OpenAuthLimitPercentageAfterCommit'], 'OpenAuthLimitPercentageAfterCommit');
        vars['AuthLimitAfterCommit'] = await priceOfferedPage.Auth_Limit.textContent() || '';
        log.info('AuthLimitAfterCommit: ' + vars['AuthLimitAfterCommit']);
        vars['LastCommittedBidAfterCommit'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.splitBySpecialChar(vars['LastCommittedBidAfterCommit'], '|', '0', 'LastCommittedBidAfterCommit');
        Methods.trimtestdata(vars['LastCommittedBidAfterCommit'], 'LastCommittedBidAfterCommitDateAndTime');
        vars['LastCommittedBidLoanAmountAfterCommit'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
        Methods.removeCharactersFromPosition(vars['LastCommittedBidLoanAmountAfterCommit'], '3', '0', 'LastCommittedBidLoanAmountAfterCommit');     
        log.stepPass('Post-commit data captured from Price Offered screen');
      } catch (e) {
        log.stepFail(page, 'Failed to capture post-commit data from Price Offered screen');
        throw e;
      }

      log.step('Calculating expected values and verifying auth limit, open auth limit and last committed bid');
      try {
        Methods.performArithmetic(vars['OpenAuthLimitBeforeCommit'], 'SUBTRACTION', vars['SelectedLoanAmount'], 'ExpectedOpenAuthLimit', 0);
        Methods.performArithmetic(vars['ExpectedOpenAuthLimit'], 'DIVISION', vars['AuthLimitBeforeCommit'], 'ExpectedOpenAuthLimitPercentage', 4);
        Methods.performArithmetic(vars['ExpectedOpenAuthLimitPercentage'], 'MULTIPLICATION', '100', 'ExpectedOpenAuthLimitPercentage', 2);
        Methods.verifyComparison(vars['OpenAuthLimitAfterCommit'], '==', vars['ExpectedOpenAuthLimit']);
        Methods.verifyComparison(vars['OpenAuthLimitPercentageAfterCommit'], '==', vars['ExpectedOpenAuthLimitPercentage']);
        Methods.verifyString(vars['AuthLimitBeforeCommit'], 'equals', vars['AuthLimitAfterCommit']);
        Methods.verifyString(vars['LastCommittedBidDateAndTimeBeforeCommit'], 'equals', vars['LastCommittedBidAfterCommitDateAndTime']);
        Methods.verifyString(vars['LastCommittedLoanAmountBeforeCommit'], 'equals', vars['LastCommittedBidLoanAmountAfterCommit']);
        vars['CommittedLoanCountAfterCommit'] = await priceOfferedPage.LockedCommitted_Loans_Count.textContent() || '';
        Methods.verifyComparison(vars['CommittedLoanCountAfterCommit'], '>', vars['CommittedLoansCountBeforeCommit']);
        log.stepPass('Auth limit, open auth limit and last committed bid all verified successfully');
      } catch (e) {
        log.stepFail(page, 'Verification failed for auth limit and open auth limit values');
        throw e;
      }

      log.step('Verifying committed loan icon, locked loans tab and commitment order');
      try {
        await expect(priceOfferedPage.Committed_Corr_LoanLocked_Icon(vars["CommittedCorrLoan"])).toBeVisible();
        await expect(priceOfferedPage.Committed_CorrLoan(vars["CommittedCorrLoan"])).toBeVisible();
        await priceOfferedPage.LockedCommitted_Loans.click();
        await priceOfferedPage.Paste_Loans_ButtonPrice_Offered_Page.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).not.toBeVisible();
        vars['CommitmentOrderAfterCommit'] = await priceOfferedPage.Commitment_OrderPrice_Offred(vars["CommittedCorrLoan"]).textContent() || '';
        Methods.verifyString(vars['ExpectedCommitmentOrder'], 'equals', vars['CommitmentOrderAfterCommit']);
        await stepGroups.stepGroup_Verifying_the_Committed_Loan_DetailsPrice_Offered(page, vars);
        log.stepPass('Committed loan icon, locked loans tab and commitment order verified successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to verify committed loan icon, locked loans tab or commitment order');
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