import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentDetailsPage } from '../../../src/pages/correspondant/commitment-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';


const TC_ID    = 'REG_TS20_TC03';
const TC_TITLE = 'Input the complete value for all search fields and verify the matched records are displayed as expected';

test.describe('Commitment List - TS_1', () => {

  let vars: Record<string, string> = {};
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

      log.step('Capture Commitment ID, Bid Request ID, Chase Loan Number and Correspondent Loan Number from first commitment');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 15000 });
        await commitmentListPage.First_Commitment_IDCommitment_List.first().waitFor({ state: 'visible' });
        await commitmentListPage.First_Commitment_IDCommitment_List.first().click();
        await priceOfferedPage.Commit_IDCommitment_List.first().waitFor({ state: 'visible' });
        vars['BidReqId']               = await priceOfferedPage.BidRequestIDTextDetails.textContent() || '';
        log.info('Bid Request ID: ' + vars['BidReqId']);
        vars['CommitmentID']           = await priceOfferedPage.Commit_IDCommitment_List.first().textContent() || '';
        log.info('Commitment ID: ' + vars['CommitmentID']);
        vars['ChaseLoanNumber']        = await commitmentDetailsPage.Chase_Loan_NumberCommitments_Details.first().textContent() || '';
        log.info('Chase Loan Number: ' + vars['ChaseLoanNumber']);
        vars['CorrespondentLoanNumber'] = await commitmentListPage.Corr_Loan_NumCommitments_Details.first().textContent() || '';        
        log.info('Correspondent Loan Number: ' + vars['CorrespondentLoanNumber']);
        await priceOfferedPage.Back_To_Commitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('All search field values captured from first commitment');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture search field values from commitment details');
        throw e;
      }

      log.step('Search by Commitment ID and verify result');
      try {
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars['CommitmentID']);
        await priceOfferedPage.Commitment_Id_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Commit_IDCommitment_List_Screen.first().waitFor({ state: 'visible' });
        await Methods.verifyMultipleElementsHaveSameText(commitmentListPage.Commit_IDCommitment_List_Screen, vars['CommitmentID']);
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
        await priceOfferedPage.Search_Dropdown.type(vars['BidReqId']);
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.First_Bid_Req_IDCommitment_List.first().waitFor({ state: 'visible' });
        await Methods.verifyMultipleElementsHaveSameText(commitmentListPage.First_Bid_Req_IDCommitment_List, vars['BidReqId']);
        log.stepPass('Bid Request ID search verified for input: ' + vars['BidReqId']);
      } catch (e) {
        await log.stepFail(page, 'Bid Request ID search verification failed for input: ' + vars['BidReqId']);
        throw e;
      }

      log.step('Search by Chase Loan Number and verify result');
      try {
        await commitmentListPage.Search_Cancel_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars['ChaseLoanNumber']);
        await commitmentListPage.Chase_Loan_Number_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars['CommitmentID'])).toBeVisible();
        await commitmentListPage.Commitment_IDCommitment_List_Page(vars['BidReqId']).first().click();
        await Methods.verifyElementContainsTextIgnoreCase(commitmentDetailsPage.Chase_Loan_NumberCommitments_Details.first(), vars['ChaseLoanNumber']);
        await priceOfferedPage.Back_To_Commitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Chase Loan Number search verified for input: ' + vars['ChaseLoanNumber']);
      } catch (e) {
        await log.stepFail(page, 'Chase Loan Number search verification failed for input: ' + vars['ChaseLoanNumber']);
        throw e;
      }

      log.step('Search by Correspondent Loan Number and verify result');
      try {
        await commitmentListPage.Search_Cancel_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars['CorrespondentLoanNumber']);
        await commitmentListPage.Correspondent_Loan_Num_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars['CommitmentID']).first()).toBeVisible();
        await commitmentListPage.Commitment_IDCommitment_List_Page(vars['BidReqId']).first().click();
        await Methods.verifyElementContainsTextIgnoreCase(commitmentListPage.Corr_Loan_NumCommitments_Details.first(), vars['CorrespondentLoanNumber']);
        log.stepPass('Correspondent Loan Number search verified for input: ' + vars['CorrespondentLoanNumber']);
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