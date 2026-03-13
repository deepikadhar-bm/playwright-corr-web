import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1394 } from '../../../src/helpers/prereqs/prereq-1394';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';
// import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS11_TC01';
const TC_TITLE = 'Perform uncommit action, and verify that that loan should no more be in committed state, and verify the auth limit, open auth limit and the Last committed bid values along with the [+cou';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  // const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    // vars['Username'] = credentials.username;
    // vars['Password'] = credentials.password;
    await runPrereq_1394(page, vars);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    // await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Navigate to Price Offered and store the required details before commiting a loan');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.click();
        vars['BidReqIdPriceOffered'] = vars['RequestIDDetails'];
        log.info('BidReqIdPriceOffered: ' + vars['BidReqIdPriceOffered']);
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidRequestIDPrice_Offered(vars["BidReqIdPriceOffered"]).click();
        await priceOfferedPage.Last_Committed_Bid.waitFor({ state: 'visible' });
        vars['LastCommittedBidBeforeCommit'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.splitBySpecialChar(vars['LastCommittedBidBeforeCommit'], '|', '0', 'LastCommittedBidBeforeCommit');
        log.info('OpenAuthLimitAfterCommit: ' + vars['LastCommittedBidBeforeCommit']);
        Methods.trimtestdata(vars['LastCommittedBidBeforeCommit'], 'LastCommittedBidBeforeCommit');
        vars['LastCommitLoanAmountBeforeCommit'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
        Methods.removeCharactersFromPosition(vars['LastCommitLoanAmountBeforeCommit'], '3', '0', 'LastCommitLoanAmountBeforeCommit'); 
        log.info('LastCommittedBidBeforeCommit: ' + vars['LastCommittedBidBeforeCommit']);
        log.stepPass('stored the required details before commiting a loan successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to capture pre-commit baseline data');
        throw e;
      }

      log.step('Selecting loan and committing');
      try {
        await priceOfferedPage.Check_UncommittedLoanNum1.check();
        vars['CommittedLoan'] = await priceOfferedPage.Committed_Loan_ID.textContent() || '';
        log.info('CommittedLoan: ' + vars['CommittedLoan']);
        await correspondentPortalPage.Get_Price_Button.waitFor({ state: 'visible' });
        await correspondentPortalPage.Get_Price_Button.click();
        await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
        await priceOfferedPage.Okay_ButtonPopup.click();
        await page.waitForLoadState('networkidle');
        vars['OpenAuthLimitAfterCommit'] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimitAfterCommit'], '(', '0', 'OpenAuthLimitAfterCommit');
        log.info('OpenAuthLimitAfterCommit: ' + vars['OpenAuthLimitAfterCommit']);
        vars['AuthLimitAfterCommit'] = await priceOfferedPage.Auth_Limit.textContent() || '';
        vars['CommittedLoansCountAfterCommit'] = await priceOfferedPage.LockedCommitted_Loans_Count.textContent() || '';
        log.stepPass('Loan committed successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to commit selected loan');
        throw e;
      }

      log.step('Navigating to Commitment List and performing uncommit action');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Commitment_List_Text.waitFor({ state: 'visible' });
        await expect(commitmentListPage.Commitment_List_Text).toBeVisible();
        await priceOfferedPage.Search_Dropdown.type(vars['BidReqIdPriceOffered']);
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Commitment_Page_Bid_Request_ID.waitFor({ state: 'visible' });
        await priceOfferedPage.Commitment_Page_Bid_Request_ID.click();
        await priceOfferedPage.CommitmentID(vars["BidReqIdPriceOffered"]).waitFor({ state: 'visible' });
        await priceOfferedPage.CommitmentID(vars["BidReqIdPriceOffered"]).click();
        await commitmentListPage.Committed_Loan_Number(vars["CommittedLoan"]).waitFor({ state: 'visible' });
        await commitmentListPage.Committed_Loan_Number(vars["CommittedLoan"]).check();
        vars['SelectedLoansCount'] = String(await priceOfferedPage.Checked_Row.count());
        vars['UncommittedLoanAmount'] = await priceOfferedPage.Selected_Uncommitted_Loan_Amount(vars["CommittedLoan"]).textContent() || '';
        vars['UncommittedLoanNum'] = await priceOfferedPage.Checked_Corr_Loan.textContent() || '';
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await expect(priceOfferedPage.BidRequestIdPopup).toContainText(vars['BidReqIdPriceOffered']);
        await expect(priceOfferedPage.Loan_ValuePopup).toContainText(vars['UncommittedLoanAmount']);
        await expect(priceOfferedPage.Selected_LoansPopup).toContainText(vars['SelectedLoansCount']);
        await priceOfferedPage.Yes_Uncommit_Button.click();
        await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Uncommitted_successfully).toContainText('Uncommitted successfully');
        await priceOfferedPage.Okay_ButtonPopup.click();
        log.info('UncommittedLoanAmount: ' + vars['UncommittedLoanAmount']);
        log.stepPass('Uncommit action completed and success message verified');
      } catch (e) {
        log.stepFail(page, 'Failed to perform uncommit action');
        throw e;
      }

      log.step('Calculating expected open auth limit and percentage after uncommit');
      try {
        Methods.performArithmetic(vars['OpenAuthLimitAfterCommit'], "ADDITION", vars['UncommittedLoanAmount'], "ExpectedOpenAuthLimit", 0);
        Methods.performArithmetic(vars['ExpectedOpenAuthLimit'], "DIVISION", vars['AuthLimitAfterCommit'], "ExpectedOpenAuthPercentage", 4);
        log.info('ExpectedOpenAuthLimit: ' + vars['ExpectedOpenAuthLimit']);
        Methods.performArithmetic(vars['ExpectedOpenAuthPercentage'], "MULTIPLICATION", "100", "ExpectedOpenAuthPercentage", 2);
        log.info('ExpectedOpenAuthPercentage: ' + vars['ExpectedOpenAuthPercentage']);
        log.stepPass('Expected open auth limit and percentage calculated');
      } catch (e) {
        log.stepFail(page, 'Failed to calculate expected open auth limit values');
        throw e;
      }

      log.step('Navigating to Price Offered and verifying loan state after uncommit');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidRequestIDPrice_Offered(vars["BidReqIdPriceOffered"]).click();
        await priceOfferedPage.All_Loans_Tabprice_offered_screen.waitFor({ state: 'visible' });
        await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
        await expect(priceOfferedPage.Committed_Loan_NumLatest(vars["UncommittedLoanNum"])).toBeVisible();
        await expect(priceOfferedPage.Locked_IconLatest_Committed_Loan(vars["UncommittedLoanNum"])).not.toBeVisible();
        await expect(priceOfferedPage.Uncommitted_LoanCheck_Box(vars["UncommittedLoanNum"])).toBeVisible();
        log.stepPass('Loan state verified — committed loan and uncommitted checkbox both visible');
      } catch (e) {
        log.stepFail(page, 'Failed to verify loan state after uncommit on Price Offered screen');
        throw e;
      }

      log.step('Verifying open auth limit, auth limit and last committed bid values after uncommit');
      try {
        vars['OpenAuthLimit'] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '0', 'OpenAuthLimitAfterUncommit');
        log.info("OpenAuthLimitAfterUncommit:"+vars["OpenAuthLimitAfterUncommit"]);
        Methods.removeMultipleSpecialChars(['$', ','], vars['OpenAuthLimitAfterUncommit'], 'OpenAuthLimitAfterUncommit');
        Methods.trimtestdata(vars['OpenAuthLimitAfterUncommit'], 'OpenAuthLimitAfterUncommit');
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '1', 'OpenAuthLimitPercentageAfterUncommit');
        Methods.removeMultipleSpecialChars([')', '%'], vars['OpenAuthLimitPercentageAfterUncommit'], 'OpenAuthLimitPercentageAfterUncommit');
        Methods.verifyString(vars['ExpectedOpenAuthLimit'], 'equals', vars['OpenAuthLimitAfterUncommit']);
        Methods.verifyString(vars['ExpectedOpenAuthPercentage'], 'equals', vars['OpenAuthLimitPercentageAfterUncommit']);
        vars['AuthLimitAfterUncommit'] = await priceOfferedPage.Auth_Limit.textContent() || '';
        Methods.verifyString(vars['AuthLimitAfterCommit'], 'equals', vars['AuthLimitAfterUncommit']);
        vars['LastCommittedBidAfterUncommit'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.splitBySpecialChar(vars['LastCommittedBidAfterUncommit'], '|', '0', 'LastCommittedBidAfterUncommit');
        Methods.trimtestdata(vars['LastCommittedBidAfterUncommit'], 'LastCommittedBidAfterUncommit');
        Methods.verifyString(vars['LastCommittedBidBeforeCommit'], 'equals', vars['LastCommittedBidAfterUncommit']);
        vars['LastCommitLoanAmountAfterUncommit'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
        Methods.removeCharactersFromPosition(vars['LastCommitLoanAmountAfterUncommit'], '3', '0', 'LastCommitLoanAmountAfterUncommit');
        Methods.verifyString(vars['LastCommitLoanAmountBeforeCommit'], 'equals', vars['LastCommitLoanAmountAfterUncommit']);
        const LockedLoansCount = await priceOfferedPage.LockedCommitted_Loans_Count;
        if (!(await LockedLoansCount.isVisible())) {
          expect(Methods.verifyComparison('0',"!=",vars['CommittedLoansCountAfterCommit']));
        } else {
          vars['CommittedLoansCountAfterUncommit'] = await priceOfferedPage.LockedCommitted_Loans_Count.textContent() || '';
          expect(Methods.verifyComparison(vars['CommittedLoansCountAfterUncommit'],"<",vars['CommittedLoansCountAfterCommit']));
        }
        testDataManager.updateProfileData('Price Offered', { 'RequestIDfrom11-1': vars['BidReqIdPriceOffered'] });
        log.stepPass('All values verified after uncommit — open auth limit, auth limit and last committed bid match');
      } catch (e) {
        log.stepFail(page, 'Verification failed for values after uncommit');
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