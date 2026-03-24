import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';

const TC_ID    = 'REG_TS05_TC03';
const TC_TITLE = 'Perform commit action for duplicate loan and verify that commitment should be created and no loans should be displayed and that commitment record should not be displayed on list screen';

const profileName = 'CommitmentList';
const profile     = testDataManager.getProfileByName(profileName);

test.describe('Commitment List - TS_2', () => {

  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    commitmentListPage      = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage        = new PriceOfferedPage(page);
    spinnerPage             = new SpinnerPage(page);
    Methods                 = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Login to CORR portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login successful');
      } catch (e) {
        await log.stepFail(page, 'Login failed');
        throw e;
      }

      log.step('Navigate to Price Offered list, open Standard bid request and capture auth limit details');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.click();
        if (profile && profile.data) {
          vars['BidReqIdPriceOffered']   = profile.data[0]['RequestIdFrom5-1'];
          vars['BidReqIdCommitmentList'] = profile.data[0]['RequestIdFrom5-1'];
          log.info('TestData key: RequestIdFrom5-1 | Bid Request ID: ' + vars['BidReqIdPriceOffered']);
        }
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Bid_Req_IDStandard.click();
        await priceOfferedPage.All_Loans_PriceofferedPage.click();
        vars['CommittedLoanNumber'] = await priceOfferedPage.Committed_Loan.textContent() || '';
        Methods.trimtestdata(vars['CommittedLoanNumber'], 'CommittedLoanNumber');
        log.info('Committed Loan Number: ' + vars['CommittedLoanNumber']);
        await priceOfferedPage.Committed_Loan_icon(vars["CommittedLoanNumber"]).waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Committed_Loan_icon(vars["CommittedLoanNumber"])).toBeVisible();
        vars['OpenAuthLimitRaw'] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimitRaw'], '(', '0', 'OpenAuthLimitStandard');
       log.info('Open Auth Limit (Standard): ' + vars['OpenAuthLimitStandard']);
        Methods.splitBySpecialChar(vars['OpenAuthLimitRaw'], '(', '1', 'OpenAuthLimitPercentageStandard');
        Methods.removeMultipleSpecialChars([')', '%'], vars['OpenAuthLimitPercentageStandard'], 'OpenAuthLimitPercentageStandard');

        vars['AuthLimitStandard'] = await priceOfferedPage.Auth_Limit_All_Loans.textContent() || '';
        Methods.trimtestdata(vars['AuthLimitStandard'], 'AuthLimitStandard');
        log.info('Auth Limit (Standard): ' + vars['AuthLimitStandard']);
        vars['LastCommittedBid'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.splitBySpecialChar(vars['LastCommittedBid'], '|', '0', 'LastCommitedBidStandard');
        Methods.trimtestdata(vars['LastCommitedBidStandard'], 'LastCommitedBidStandard');
        log.info('Last Committed Bid (Standard): ' + vars['LastCommitedBidStandard']);
        vars['LastCommittedBidLoanAmount'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
        Methods.removeCharactersFromPosition(vars['LastCommittedBidLoanAmount'],'3','0', 'LastCommittedBidLoanAmountStandard');          
        log.stepPass('Standard auth limit values and committed loan details captured');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture Standard auth limit details for Bid Request ID: ' + vars['BidReqIdPriceOffered']);
        throw e;
      }

      log.step('Open Chase Direct, select duplicate loan and perform commit action');
      try {
        await priceOfferedPage.BackTo_PriceofferedPage.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Bid_Req_IDChase_Direct.click();
        await priceOfferedPage.Select_Loan_which_is_committed_in_Chase_Direct(vars["CommittedLoanNumber"]).waitFor({ state: 'visible' });
        await priceOfferedPage.Select_Loan_which_is_committed_in_Chase_Direct(vars["CommittedLoanNumber"]).check();
        await priceOfferedPage.Get_Price_Button.waitFor({ state: 'visible' });
        await priceOfferedPage.Get_Price_Button.click();
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        await correspondentPortalPage.Okay_Button1.waitFor({ state: 'visible' });
        vars['CommitmentID'] = await priceOfferedPage.Commitment_IdPrice_Offered.textContent() || '';
        Methods.trimtestdata(vars['CommitmentID'], 'CommitmentID');
        log.info('Commitment ID: ' + vars['CommitmentID']);
        await correspondentPortalPage.Okay_Button1.click();
        log.stepPass('Commit action performed Commitment ID: ' + vars['CommitmentID']);
      } catch (e) {
        await log.stepFail(page, 'Failed to perform commit action for duplicate loan');
        throw e;
      }

      log.step('Verify committed loan icon is visible in All Loans tab');
      try {
        await priceOfferedPage.All_Loans_Tabprice_offered_screen.waitFor({ state: 'visible' });
        await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
        await expect(priceOfferedPage.Committed_Loan_icon(vars["CommittedLoanNumber"])).not.toBeVisible();
        log.stepPass('Committed loan icon visible in All Loans tab');
      } catch (e) {
        await log.stepFail(page, 'Committed loan icon not visible in All Loans tab');
        throw e;
      }

      log.step('Navigate to Commitment List, search by Commitment ID and verify entry exists');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars['CommitmentID']);
        await priceOfferedPage.Commitment_Id_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Commitment_IdCommitment_List_Screen(vars["CommitmentID"])).not.toBeVisible();
        log.stepPass('Commitment ID found in Commitment List: ' + vars['CommitmentID']);
      } catch (e) {
        await log.stepFail(page, 'Commitment ID not found in Commitment List: ' + vars['CommitmentID']);
        throw e;
      }

      log.step('Search by Bid Request ID and verify Chase Direct commitment ID is not visible');
      try {
        await commitmentListPage.Search_Cancel_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars['BidReqIdCommitmentList']);
        await priceOfferedPage.Dropdown_Commitment_ID_Bid_Request_ID.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Commitment_IDChase_Direct.first().click();
        await expect(page.getByText(vars['CommitmentID'])).not.toBeVisible();
        log.stepPass('Duplicate commitment ID not visible under Chase Direct for Bid Request ID: ' + vars['BidReqIdCommitmentList']);
      } catch (e) {
        await log.stepFail(page, 'Chase Direct commitment ID visibility check failed');
        throw e;
      }

      log.step('Verify commitment order in Total Loans tab and verify auth limit matches Standard');
      try {
        await commitmentListPage.Total_LoansCommitment_List.click();
        await priceOfferedPage.Check_the_Loan_Num.first().waitFor({ state: 'visible' });
        await priceOfferedPage.Check_the_Loan_Num.first().click();
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await expect(commitmentListPage.Commitment_IdAdd_To_Commit_Dropdown(vars["CommitmentID"])).toBeVisible();
        vars['CommitmentOredrCommitmentList'] = await commitmentListPage.Commitment_OrderAdd_To_Commit_Dropdown(vars["CommitmentID"]).textContent() || '';
        Methods.getLastCharacters(vars['CommitmentOredrCommitmentList'], '1', 'CommitmentOredrCommitmentList');
        log.info('Commitment order (Commitment List): ' + vars['CommitmentOredrCommitmentList']);
        expect(Methods.verifyString(vars['CommitmentOredrCommitmentList'], 'equals', appconstants.TWO));
        vars['OpenAuthLimitRaw'] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimitRaw'], '(', '0', 'OpenAuthLimitCommitmentList');
        Methods.splitBySpecialChar(vars['OpenAuthLimitRaw'], '(', '1', 'OpenAuthLimitPercentageCommitmentList');
        Methods.removeMultipleSpecialChars([')', '%'], vars['OpenAuthLimitPercentageCommitmentList'], 'OpenAuthLimitPercentageCommitmentList');
        vars['AuthLimitCommitmentList'] = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
        Methods.trimtestdata(vars['AuthLimitCommitmentList'], 'AuthLimitCommitmentList');
        vars['LastCommittedBid'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.splitBySpecialChar(vars['LastCommittedBid'], '|', '0', 'LastCommittedBidCommitmentList');
        Methods.trimtestdata(vars['LastCommittedBidCommitmentList'], 'LastCommittedBidCommitmentList');
        vars['LastCommittedBidLoanAmount'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
        Methods.removeCharactersFromPosition(vars['LastCommittedBidLoanAmount'], '3','0','LastCommittedBidLoanAmountCommitmentList');
        log.info('Auth Limit (Commitment List): ' + vars['AuthLimitCommitmentList']);
        log.info('Last Committed Bid (Commitment List): ' + vars['LastCommittedBidCommitmentList']);
        expect(Methods.verifyString(vars['OpenAuthLimitStandard'], 'equals', vars['OpenAuthLimitCommitmentList']));
        expect(Methods.verifyString(vars['OpenAuthLimitPercentageStandard'], 'equals', vars['OpenAuthLimitPercentageCommitmentList']));
        expect(Methods.verifyString(vars['AuthLimitStandard'], 'equals', vars['AuthLimitCommitmentList']));
        expect(Methods.verifyString(vars['LastCommitedBidStandard'], 'equals', vars['LastCommittedBidCommitmentList']));
        expect(Methods.verifyString(vars['LastCommittedBidLoanAmountStandard'], 'equals', vars['LastCommittedBidLoanAmountCommitmentList']));
        log.stepPass('Commitment order and auth limit verified. Order: ' + vars['CommitmentOredrCommitmentList']);
      } catch (e) {
        await log.stepFail(page, 'Commitment order or auth limit verification failed. Standard: ' + vars['OpenAuthLimitStandard'] + ' | Commitment List: ' + vars['OpenAuthLimitCommitmentList']);
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