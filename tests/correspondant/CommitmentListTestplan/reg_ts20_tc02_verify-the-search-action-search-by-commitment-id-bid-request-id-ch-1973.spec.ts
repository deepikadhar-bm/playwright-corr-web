import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CommitmentDetailsPage } from '../../../src/pages/correspondant/commitment-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID    = 'REG_TS20_TC02';
const TC_TITLE = 'Verify the search action, Search by Commitment ID, Bid Request ID, Chase Loan Number and the Correspondent Loan Number for 3 digit input';

test.describe('Commitment List - TS_1', () => {

  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let commitmentDetailsPage: CommitmentDetailsPage;
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
    bidRequestDetailsPage   = new BidRequestDetailsPage(page);
    commitmentDetailsPage   = new CommitmentDetailsPage(page);
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

      log.step('Navigate to Commitment List and open Closed List tab');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
        await commitmentListPage.Closed_List_Tab.evaluate((el: HTMLElement) => {
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
          el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
          el.click();
        });
        await commitmentListPage.Commitment_List_Text.waitFor({ state: 'visible' });
        await expect(commitmentListPage.Commitment_List_Text).toBeVisible();
        await commitmentListPage.Closed_Date.waitFor({ state: 'visible' });
        await expect(commitmentListPage.Closed_Date).toBeVisible();
        log.stepPass('Navigated to Closed List tab');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Closed List tab');
        throw e;
      }

      log.step('Capture first 3 characters of Commitment ID, Bid Request ID, Chase Loan Number and Correspondent Loan Number');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 15000 });
        await commitmentListPage.First_Commitment_IDCommitment_List.first().waitFor({ state: 'visible' });
        await commitmentListPage.First_Commitment_IDCommitment_List.first().click();
        await priceOfferedPage.Commit_IDCommitment_List.first().waitFor({ state: 'visible' });
        vars['CommitmentID'] = await priceOfferedPage.Commit_IDCommitment_List.first().textContent() || '';
        Methods.splitRangeOfCharacters(vars['CommitmentID'], 0, 3, 'CommitmentID');
        vars['BidRequestId'] = await priceOfferedPage.BidRequestIDTextDetails.textContent() || '';
        Methods.splitRangeOfCharacters(vars['BidRequestId'], 0, 3, 'BidRequestId');
        vars['ChaseLoanNumber'] = await commitmentDetailsPage.Chase_Loan_NumberCommitments_Details.first().textContent() || '';
        Methods.splitRangeOfCharacters(vars['ChaseLoanNumber'], 0, 3, 'ChaseLoanNumber');
        vars['CorrespondentLoanNumber'] = await commitmentListPage.Corr_Loan_NumCommitments_Details.first().textContent() || '';
        Methods.splitRangeOfCharacters(vars['CorrespondentLoanNumber'], 0, 3, 'CorrespondentLoanNumber');
        log.info('Commitment ID (3 chars): ' + vars['CommitmentID']);
        log.info('Bid Request ID (3 chars): ' + vars['BidRequestId']);
        log.info('Chase Loan Number (3 chars): ' + vars['ChaseLoanNumber']);
        log.info('Correspondent Loan Number (3 chars): ' + vars['CorrespondentLoanNumber']);
        await priceOfferedPage.Back_To_Commitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('First 3 characters captured for all search fields');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture search field values from commitment details');
        throw e;
      }

      log.step('Search by Commitment ID and verify results');
      try {
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars['CommitmentID']);
        await priceOfferedPage.Commitment_Id_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Commit_IDCommitment_List_Screen.first().waitFor({ state: 'visible' });
        await Methods.verifyMultipleElementsHavePartialText(commitmentListPage.Commit_IDCommitment_List_Screen, vars['CommitmentID']);
        log.stepPass('Commitment ID search verified for input: ' + vars['CommitmentID']);
      } catch (e) {
        await log.stepFail(page, 'Commitment ID search verification failed for input: ' + vars['CommitmentID']);
        throw e;
      }

      log.step('Search by Bid Request ID and verify results');
      try {
        await commitmentListPage.Search_Cancel_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars['BidRequestId']);
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.First_Bid_Req_IDCommitment_List.first().waitFor({ state: 'visible' });
        await Methods.verifyMultipleElementsHavePartialText(commitmentListPage.First_Bid_Req_IDCommitment_List, vars['BidRequestId']);
        log.stepPass('Bid Request ID search verified for input: ' + vars['BidRequestId']);
      } catch (e) {
        await log.stepFail(page, 'Bid Request ID search verification failed for input: ' + vars['BidRequestId']);
        throw e;
      }

      log.step('Search by Chase Loan Number and verify results across all commitments');
      try {
        await commitmentListPage.Search_Cancel_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars['ChaseLoanNumber']);
        await commitmentListPage.Chase_Loan_Number_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['ChaseLoanNumbersCount'] = String(await commitmentListPage.First_Bid_Req_IDCommitment_List.count());
        log.info('Chase Loan Number search results count: ' + vars['ChaseLoanNumbersCount']);
        vars['count'] = appconstants.ONE;
        while (parseFloat(vars['count']) <= parseFloat(vars['ChaseLoanNumbersCount'])) {
          vars['CommitID'] = await commitmentListPage.Individual_Commitment_IDList_Screen(vars['count']).textContent() || '';
          Methods.trimtestdata(vars['CommitID'], 'CommitID');
          await commitmentListPage.Individual_Commitment_IDList_Screen(vars['count']).click();
          await commitmentListPage.Required_Chase_Loan_Num(vars['CommitID'], vars['ChaseLoanNumber']).first().scrollIntoViewIfNeeded();
          await Methods.verifyElementContainsTextIgnoreCase(commitmentListPage.Required_Chase_Loan_Num(vars['CommitID'], vars['ChaseLoanNumber']).first(), vars['ChaseLoanNumber']);
          log.info('Chase Loan Number verified for CommitID: ' + vars['CommitID']);
          await priceOfferedPage.Back_To_Commitment_List.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          Methods.MathematicalOperation(vars['count'], '+', '1', 'count');
        }
        log.stepPass('Chase Loan Number search verified across ' + vars['ChaseLoanNumbersCount'] + ' commitment(s) for input: ' + vars['ChaseLoanNumber']);
      } catch (e) {
        await log.stepFail(page, 'Chase Loan Number search verification failed for input: ' + vars['ChaseLoanNumber']);
        throw e;
      }

      log.step('Search by Correspondent Loan Number and verify results across all commitments');
      try {
        await commitmentListPage.Search_Cancel_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars['CorrespondentLoanNumber']);
        log.info('Correspondent Loan Number search input: ' + vars['CorrespondentLoanNumber']);
        await commitmentListPage.Correspondent_Loan_Num_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['CorrespondentLoanNumberCount'] = String(await commitmentListPage.First_Bid_Req_IDCommitment_List.count());
        log.info('Correspondent Loan Number search results count: ' + vars['CorrespondentLoanNumberCount']);
        vars['count'] = appconstants.ONE;
        while (parseFloat(vars['count']) <= parseFloat(vars['CorrespondentLoanNumberCount'])) {
          await commitmentListPage.Individual_Commitment_IDList_Screen(vars['count']).scrollIntoViewIfNeeded();
          vars['CommitID'] = await commitmentListPage.Individual_Commitment_IDList_Screen(vars['count']).textContent() || '';
          Methods.trimtestdata(vars['CommitID'], 'CommitID');
          await commitmentListPage.Individual_Commitment_IDList_Screen(vars['count']).click();
          await bidRequestDetailsPage.Loan_Amount_Sort_Button.first().waitFor({ state: 'visible' });
          const ReqCorrLoanNum = commitmentListPage.Req_CarrLoan_Num(vars['CommitID'], vars['CorrespondentLoanNumber']);
          if (await ReqCorrLoanNum.isVisible()) {
            log.info('Correspondent Loan Number visible in list for CommitID: ' + vars['CommitID']);
          } else {
            await Methods.verifyElementContainsTextIgnoreCase(commitmentDetailsPage.First_Corr_Loan_Numbercommitments.first(), vars['CorrespondentLoanNumber']);
            log.info('Correspondent Loan Number verified in details for CommitID: ' + vars['CommitID']);
          }
          await priceOfferedPage.Back_To_Commitment_List.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          Methods.MathematicalOperation(vars['count'], '+', '1', 'count');
        }
        log.stepPass('Correspondent Loan Number search verified across ' + vars['CorrespondentLoanNumberCount'] + ' commitment(s) for input: ' + vars['CorrespondentLoanNumber']);
      } catch (e) {
        await log.stepFail(page, 'Correspondent Loan Number search verification failed for input: ' + vars['CorrespondentLoanNumber']);
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