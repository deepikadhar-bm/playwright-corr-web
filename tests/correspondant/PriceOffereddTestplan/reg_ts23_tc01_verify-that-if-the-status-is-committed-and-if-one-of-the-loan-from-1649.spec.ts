import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS23_TC01';
const TC_TITLE = 'Verify that if the status is committed and if one of the loan from the list is uncommitted, then the status should be updated as partially committed';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
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
    bidRequestPage = new BidRequestPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Reading test data from the testdataprofiles');
      try {
        if (profile && profile.data) {
          vars['BidReqIdPriceOffered'] = profile.data[0]['RequestIDfrom22-3.1'];
          log.info('BidReqIdPriceOffered: ' + vars['BidReqIdPriceOffered']);
        }
         log.stepPass('successfully read the testdata from the testdataprofiles');
      } catch (e) {
        log.stepFail(page, 'Failed to read test data');
        throw e;
      }
       log.step('Login to corr application');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('successfully login to the corr application');
      } catch (e) {
        log.stepFail(page, 'Failed to login to CORR portal');
        throw e;
      }

      log.step('Navigating to Price Offered and capturing pre-uncommit baseline data');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidRequestIDPrice_Offered(vars["BidReqIdPriceOffered"]).click();
        await priceOfferedPage.LockedCommitted_Loans_Count.waitFor({ state: 'visible' });
        vars['CommittedLoansCountBeforeUnommit'] = await priceOfferedPage.LockedCommitted_Loans_Count.textContent() || '';
        vars['OpenAuthLimit'] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '0', 'OpenAuthLimitBeforeUncommit');
        log.info('OpenAuthLimitBeforeUncommit: ' + vars['OpenAuthLimitBeforeUncommit']);
        vars['AuthLimitBeforeUncommit'] = await priceOfferedPage.Auth_Limit.textContent() || '';
        log.info('AuthLimitBeforeUncommit: ' + vars['AuthLimitBeforeUncommit']);
        vars['LastCommittedBidBeforeUncommit'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.splitBySpecialChar(vars['LastCommittedBidBeforeUncommit'], '|', '0', 'LastCommittedBidBeforeUncommit');
        Methods.trimtestdata(vars['LastCommittedBidBeforeUncommit'], 'LastCommittedBidBeforeUncommit');
        vars['LastCommittedLoanAmountBeforeUncommit'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
        Methods.removeCharactersFromPosition(vars['LastCommittedLoanAmountBeforeUncommit'], '3', '0', 'LastCommittedLoanAmountBeforeUncommit');       
        log.stepPass('Pre-uncommit baseline data captured successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to capture pre-uncommit baseline data');
        throw e;
      }

      log.step('Navigating to Commitment List and uncommitting a single loan');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Search_In_Committed_Page.type(vars['BidReqIdPriceOffered']);
        await priceOfferedPage.Search_In_Committed_Page.click();
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.CommitmentID(vars["BidReqIdPriceOffered"]).first().waitFor({ state: 'visible' });
        await priceOfferedPage.CommitmentID(vars["BidReqIdPriceOffered"]).first().click();
        await priceOfferedPage.Check_the_Loan_Num.first().check();
        vars['UncommittedLoanNum'] = await priceOfferedPage.Checked_Corr_Loan.textContent() || '';
        log.info('UncommittedLoanNum: ' + vars['UncommittedLoanNum']);
        vars['UncommittedLoanAmount'] = await priceOfferedPage.Checked_Loan_Amount.textContent() || '';
        log.info('UncommittedLoanAmount: ' + vars['UncommittedLoanAmount']);
        await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await priceOfferedPage.Yes_Uncommit_Button.click();
        await correspondentPortalPage.Okay_Button1.waitFor({ state: 'visible' });
        await correspondentPortalPage.Okay_Button1.click();
        log.stepPass('Loan uncommitted successfully: ' + vars['UncommittedLoanNum']);
      } catch (e) {
        log.stepFail(page, 'Failed to uncommit loan from Commitment List');
        throw e;
      }

      log.step('Navigating back to Price Offered and verifying bid status is Partially Committed');
      try {
        await page.reload();
        await correspondentPortalPage.Commitments_Side_Menu.waitFor({ state: 'visible' });
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        while (!(await priceOfferedPage.Partially_Committed_Status.isVisible())) {
          await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
          await page.keyboard.press('Enter');
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars['BidReqIdPriceOffered']).waitFor({ state: 'visible' });
          await page.reload();
        }
        vars['BidStatusPriceOfferedPage'] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars['BidReqIdPriceOffered']).textContent() || '';
        log.info('BidStatus on Price Offered page: ' + vars['BidStatusPriceOfferedPage']);
        Methods.trimtestdata(vars['BidStatusPriceOfferedPage'], 'BidStatusPriceOfferedPage');
        expect(Methods.verifyString(vars['BidStatusPriceOfferedPage'], 'equals', appconstants.PARTIALLYCOMMITTED_STATUS));
        log.stepPass('Bid status confirmed as Partially Committed on Price Offered page');
      } catch (e) {
        log.stepFail(page, 'Failed to verify Partially Committed status on Price Offered page');
        throw e;
      }
      log.step('Capturing post-uncommit data and calculating expected open auth limit');
      try {
        await priceOfferedPage.BidRequestIDPrice_Offered(vars["BidReqIdPriceOffered"]).click();
        await priceOfferedPage.Uncommitted_Loan_Number(vars["UncommittedLoanNum"]).waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Uncommitted_Loan_Number(vars["UncommittedLoanNum"])).toBeVisible();
        vars['OpenAuthLimit'] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '0', 'OpenAuthLimitAfterUncommit');
        Methods.removeMultipleSpecialChars(['$', ','], vars['OpenAuthLimitAfterUncommit'], 'OpenAuthLimitAfterUncommit');
        Methods.trimtestdata(vars['OpenAuthLimitAfterUncommit'], 'OpenAuthLimitAfterUncommit');
        log.info('OpenAuthLimitAfterUncommit: ' + vars['OpenAuthLimitAfterUncommit']);
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '1', 'OpenAuthLimitPercentageAfterUncommit');
        Methods.removeMultipleSpecialChars([')', '%'], vars['OpenAuthLimitPercentageAfterUncommit'], 'OpenAuthLimitPercentageAfterUncommit');
        vars['AuthLimitAfterUncommit'] = await priceOfferedPage.Auth_Limit.textContent() || '';
        vars['LastCommittedBidAfterUnommit'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.splitBySpecialChar(vars['LastCommittedBidAfterUnommit'], '|', '0', 'LastCommittedBidAfterUnommit');
        Methods.trimtestdata(vars['LastCommittedBidAfterUnommit'], 'LastCommittedBidAfterUnommit');
        vars['LastCommittedLoanAmountAfterUncommit'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
        Methods.removeCharactersFromPosition(vars['LastCommittedLoanAmountAfterUncommit'], '3', '0', 'LastCommittedLoanAmountAfterUncommit');
        Methods.performArithmetic(vars['OpenAuthLimitBeforeUncommit'], 'ADDITION', vars['UncommittedLoanAmount'], 'ExpectedOpenAuthLimit', 0);
        Methods.performArithmetic(vars['ExpectedOpenAuthLimit'], 'DIVISION', vars['AuthLimitAfterUncommit'], 'ExpectedOpenAuthPercentage', 4);
        log.info('ExpectedOpenAuthLimit: ' + vars['ExpectedOpenAuthLimit']);
        Methods.performArithmetic(vars['ExpectedOpenAuthPercentage'], 'MULTIPLICATION', '100', 'ExpectedOpenAuthPercentage', 2);
        log.stepPass('Post-uncommit data captured and expected values calculated');
      } catch (e) {
        log.stepFail(page, 'Failed to capture post-uncommit data or calculate expected values');
        throw e;
      }

      log.step('Verifying locked loans tab and all auth limit values after uncommit');
      try {
        await priceOfferedPage.LockedCommitted_Loans.click();
        await priceOfferedPage.Paste_Loans_ButtonPrice_Offered_Page.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Paste_Loans_ButtonPrice_Offered_Page).not.toBeVisible();
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).not.toBeVisible();
        await expect(priceOfferedPage.Uncommitted_Loan_Number(vars["UncommittedLoanNum"])).not.toBeVisible();
        expect(Methods.verifyString(vars['ExpectedOpenAuthLimit'], 'equals', vars['OpenAuthLimitAfterUncommit']));
        expect(Methods.verifyString(vars['ExpectedOpenAuthPercentage'], 'equals', vars['OpenAuthLimitPercentageAfterUncommit']));
        expect(Methods.verifyString(vars['AuthLimitBeforeUncommit'], 'equals', vars['AuthLimitAfterUncommit']));
        expect(Methods.verifyString(vars['LastCommittedBidBeforeUncommit'], 'equals', vars['LastCommittedBidAfterUnommit']));
        expect(Methods.verifyString(vars['LastCommittedLoanAmountBeforeUncommit'], 'equals', vars['LastCommittedLoanAmountAfterUncommit']));
        vars['CommittedLoansCountAfterUncommit'] = await priceOfferedPage.LockedCommitted_Loans_Count.textContent() || '';
        expect(Methods.verifyComparison(vars['CommittedLoansCountBeforeUnommit'],'>',vars['CommittedLoansCountAfterUncommit']));
        log.stepPass('All auth limit, open auth limit and committed loans count verified successfully');
      } catch (e) {
        log.stepFail(page, 'Verification failed for auth limit or committed loans count values');
        throw e;
      }

      log.step('Verifying bid status is Partially Committed on Bid Requests page and Bid Request Details page');
      try {
        await correspondentPortalPage.Bid_Requests.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['BidStatusBidReqPage'] = await bidRequestPage.Bid_Status_BidRequestsPage(vars["BidReqIdPriceOffered"]).textContent() || '';
        Methods.trimtestdata(vars['BidStatusBidReqPage'], 'BidStatusBidReqPage');
        log.info('BidStatus on Bid Requests page: ' + vars['BidStatusBidReqPage']);
        expect(Methods.verifyString(vars['BidStatusBidReqPage'], 'equals', appconstants.PARTIALLYCOMMITTED_STATUS));
        await bidRequestPage.Required_Bid_Req_IDBid_Req_Page(vars["BidReqIdPriceOffered"]).click();
        await bidRequestPage.Bid_StatusBid_Req_Details.waitFor({ state: 'visible' });
        vars['StatusBidReqDetails'] = await bidRequestPage.Bid_StatusBid_Req_Details.textContent() || '';
        log.info('BidStatus on Bid Request Details: ' + vars['StatusBidReqDetails']);
        expect(Methods.verifyString(vars['StatusBidReqDetails'], 'equals', appconstants.PARTIALLYCOMMITTED_STATUS));
        log.stepPass('Bid status confirmed as Partially Committed on Bid Requests page and Bid Request Details page');
      } catch (e) {
        log.stepFail(page, 'Failed to verify Partially Committed status on Bid Requests or Bid Request Details page');
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