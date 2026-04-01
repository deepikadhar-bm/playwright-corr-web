import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOffered2Page } from '../../../src/pages/correspondant/price-offered-2';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1389 } from '../../../src/helpers/prereqs/prereq-1389';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS05_TC01';
const TC_TITLE = 'Perform commit action for valid loan and verify the commitment should be created and auth limit value should be updated';

test.describe('Commitment List - TS_2', () => {

  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOffered2Page: PriceOffered2Page;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1389(page, vars);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOffered2Page = new PriceOffered2Page(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Navigate to Price Offered list and capture execution type and auth limit before commit');
      try {
        vars['BidReqId'] = vars['RequestIDDetails'];
        log.info('Bid Request ID: ' + vars['BidReqId']);
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqId']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidReqId_Standard.click();
        vars['ExecutionType'] = await priceOfferedPage.Executiontype.textContent() || '';
        Methods.trimtestdata(vars['ExecutionType'], 'ExecutionType');
        log.info('Execution type: ' + vars['ExecutionType']);
        await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
        await stepGroups.stepGroup_Storing_Open_Auth_Limit_and_AuthLimit_Price_Offered(page, vars);
        vars["OpenAuthLimit"] = await priceOfferedPage.Open_Auth_Limit_All_Loans.textContent() || '';
        log.stepPass('Navigated to Price Offered list and stored Auth limit values before commit');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate or capture auth limit for Bid Request ID: ' + vars['BidReqId']);
        throw e;
      }

      log.step('Select loan and perform commit action');
      try {
        await priceOfferedPage.Required_Loan_Num.first().check();
        vars['ExpectedCommittedLoanAmount'] = await priceOfferedPage.Checked_Loan_Amount.textContent() || '';
        Methods.trimtestdata(vars['ExpectedCommittedLoanAmount'], 'ExpectedCommittedLoanAmount');
        log.info('Expected committed loan amount: ' + vars['ExpectedCommittedLoanAmount']);
        await priceOfferedPage.Get_Price_Button.click();
        await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });

        log.stepPass('Commit action performed for loan amount: ' + vars['ExpectedCommittedLoanAmount']);
      } catch (e) {
        await log.stepFail(page, 'Failed to perform commit action');
        throw e;
      }

      log.step('Capture commit timestamp and commitment ID from popup');
      try {
        Methods.getCurrentTimestamp(appconstants.DATE_TIME_FORMAT_COMMIT, 'ExpectedBidCommittedDateAndTime', appconstants.UTC);
        log.info('Expected commit time and date: ' + vars['ExpectedBidCommittedDateAndTime']);
        Methods.addMinutesToDatetime(vars['ExpectedBidCommittedDateAndTime'], appconstants.DATE_TIME_FORMAT_COMMIT, 1, appconstants.DATE_TIME_FORMAT_COMMIT, 'ExpectedLastCommittedBidDateAndTimeplus1');
        Methods.subtractMinutesFromDatetime(vars['ExpectedBidCommittedDateAndTime'], appconstants.DATE_TIME_FORMAT_COMMIT, 1, appconstants.DATE_TIME_FORMAT_COMMIT, "ExpectedLastCommittedBidDateAndTimeminus1");
        vars['CommitmentID'] = await priceOfferedPage.Commitment_IdPrice_Offered.textContent() || '';
        Methods.trimtestdata(vars['CommitmentID'], 'CommitmentID');

        log.info('Commitment ID: ' + vars['CommitmentID']);
        await priceOfferedPage.Okay_ButtonPopup.click();
        log.stepPass('Commitment ID captured: ' + vars['CommitmentID']);
      } catch (e) {
        await log.stepFail(page, 'Failed to capture commitment ID');
        throw e;
      }

      log.step('Verify committed loan is visible in All Loans tab');
      try {
        await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
        await priceOfferedPage.Committed_Loan.first().waitFor({ state: 'visible' });
        vars['CommittedLoanNumStandard'] = await priceOfferedPage.Committed_Loan.textContent() || '';
        Methods.trimtestdata(vars['CommittedLoanNumStandard'], 'CommittedLoanNumStandard');
        log.info('Committed loan: ' + vars['CommittedLoanNumStandard']);
        await expect(priceOffered2Page.Commited_Loan_Locked_Icon(vars["CommittedLoanNumStandard"])).toBeVisible();
        vars['CommitmentOrderPriceOffered'] = await priceOfferedPage.CommitedOrderStandard(vars["CommittedLoanNumStandard"]).textContent() || '';
        Methods.trimtestdata(vars['CommitmentOrderPriceOffered'], 'CommitmentOrderPriceOffered');
        log.info('Commitment order: ' + vars['CommitmentOrderPriceOffered']);
        log.stepPass('Committed loan visible in All Loans tab Loan: ' + vars['CommittedLoanNumStandard']);
      } catch (e) {
        await log.stepFail(page, 'Committed loan not visible in All Loans tab');
        throw e;
      }

      log.step('Search by Commitment ID in Commitment List and verify entry');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars['CommitmentID']);
        await priceOfferedPage.Commitment_Id_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Commitment_IdCommitment_List_Screen(vars["CommitmentID"])).toBeVisible();
        await expect(page.getByText(vars['BidReqId'])).toBeVisible();
        await priceOfferedPage.Commitment_IdCommitment_List_Screen(vars["CommitmentID"]).click();
        await expect(page.getByText(vars['CommitmentID'])).toBeVisible();
        log.stepPass('Commitment ID found in Commitment List: ' + vars['CommitmentID']);
      } catch (e) {
        await log.stepFail(page, 'Commitment ID not found in Commitment List: ' + vars['CommitmentID']);
        throw e;
      }

      log.step('Capture auth limit after commit and verify auth limit calculations');
      try {
        vars['OpenAuthLimit'] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '0', 'OpenAuthLimitAfterCommit');
        Methods.removeMultipleSpecialChars(['$', ','], vars['OpenAuthLimitAfterCommit'], 'OpenAuthLimitAfterCommit');
        Methods.trimtestdata(vars['OpenAuthLimitAfterCommit'], 'OpenAuthLimitAfterCommit');
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '1', 'OpenAuthLimitPercentageAfterCommit');
        Methods.removeMultipleSpecialChars([')', '%'], vars['OpenAuthLimitPercentageAfterCommit'], 'OpenAuthLimitPercentageAfterCommit');
        vars['AuthLimitAfterCommit'] = await priceOfferedPage.Auth_Limit.textContent() || '';
        Methods.trimtestdata(vars['AuthLimitAfterCommit'], 'AuthLimitAfterCommit');
        vars['LastCommittedBid'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.splitBySpecialChar(vars['LastCommittedBid'], '|', '0', 'LastCommittedBidAfterCommit');
        Methods.trimtestdata(vars['LastCommittedBidAfterCommit'], 'LastCommittedBidAfterCommit');
        vars['LastCommittedBidLoanAmountAfterCommit'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
        Methods.removeCharactersFromPosition(vars['LastCommittedBidLoanAmountAfterCommit'],'3','0',"LastCommittedBidLoanAmountAfterCommit");
        Methods.performArithmetic(vars['OpenAuthLimitBeforeCommit'], 'SUBTRACTION', vars['ExpectedCommittedLoanAmount'], 'ExpectedOpenAuthLimit', 0);
        Methods.performArithmetic(vars['ExpectedOpenAuthLimit'], 'DIVISION', vars['AuthLimitBeforeCommit'], 'ExpectedOpenAuthLimitPercentage', 4);
        Methods.performArithmetic(vars['ExpectedOpenAuthLimitPercentage'], 'MULTIPLICATION', '100', 'ExpectedOpenAuthLimitPercentage', 2);
        log.info('Open Auth Limit after commit: ' + vars['OpenAuthLimitAfterCommit']);
        log.info('Expected Open Auth Limit: ' + vars['ExpectedOpenAuthLimit']);
        expect(Methods.verifyString(vars['ExpectedOpenAuthLimit'], 'equals', vars['OpenAuthLimitAfterCommit']));
        expect(Methods.verifyString(vars['ExpectedOpenAuthLimitPercentage'], 'equals', vars['OpenAuthLimitPercentageAfterCommit']));
        expect(Methods.verifyString(vars['AuthLimitBeforeCommit'], 'equals', vars['AuthLimitAfterCommit']));
        // Allow ±1 minute tolerance for commit timestamp comparison
        if (String(vars["ExpectedBidCommittedDateAndTime"]) === String(vars["LastCommittedBidAfterCommit"])) {
        } else if (String(vars["ExpectedLastCommittedBidDateAndTimeplus1"]) === String(vars["LastCommittedBidAfterCommit"])) {
        } else {
          expect(Methods.verifyString(vars['ExpectedLastCommittedBidDateAndTimeminus1'], 'equals', vars['LastCommittedBidAfterCommit']));
        }
        expect(Methods.verifyString(vars['ExpectedCommittedLoanAmount'], 'equals', vars['LastCommittedBidLoanAmountAfterCommit']));
        log.stepPass('Auth limit values  verified after commit');
      } catch (e) {
        await log.stepFail(page, 'Auth limit avlues verification failed Expected ');
        throw e;
      }

      log.step('Verify commitment order in Total Loans tab matches Price Offered');
      try {
        await commitmentListPage.Total_LoansCommitment_List.click();
        await priceOfferedPage.Check_the_Loan_Num.first().waitFor({ state: 'visible' });
        await priceOfferedPage.Check_the_Loan_Num.first().check();
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await expect(commitmentListPage.Commitment_IdAdd_To_Commit_Dropdown(vars["CommitmentID"])).toBeVisible();
        vars['CommitmentOrderCommitmentList'] = await commitmentListPage.Commitment_OrderAdd_To_Commit_Dropdown(vars["CommitmentID"]).textContent() || '';
        Methods.getLastCharacters(vars['CommitmentOrderCommitmentList'], '1', 'CommitmentOrderCommitmentList');

        log.info('Commitment order (Commitment List): ' + vars['CommitmentOrderCommitmentList']);
        expect(Methods.verifyString(vars['CommitmentOrderPriceOffered'], 'equals', vars['CommitmentOrderCommitmentList']));
        testDataManager.updateProfileData('CommitmentList', { 'RequestIdFrom5-1': vars['BidReqId'] });
        log.stepPass('Commitment order verified Price Offered: ' + vars['CommitmentOrderPriceOffered'] + 'Commitment List: ' + vars['CommitmentOrderCommitmentList']);
      } catch (e) {
        await log.stepFail(page, 'Commitment order mismatch Price Offered: ' + vars['CommitmentOrderPriceOffered'] + '  Commitment List: ' + vars['CommitmentOrderCommitmentList']);
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