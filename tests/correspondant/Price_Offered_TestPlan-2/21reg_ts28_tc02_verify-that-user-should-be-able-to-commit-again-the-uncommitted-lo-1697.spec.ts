import { test, expect } from '@playwright/test';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1394 } from '../../../src/helpers/prereqs/prereq-1394';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import * as stepGroups from '../../../src/helpers/step-groups';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID    = 'REG_TS28_TC02';
const TC_TITLE = 'Verify that user should be able to commit again the uncommitted loan';

test.describe('REG_PriceOffered', () => {

  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;


  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1394(page, vars);
    bidRequestsPage         = new BidRequestsPage(page);
    commitmentListPage      = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage        = new PriceOfferedPage(page);
    spinnerPage             = new SpinnerPage(page);
    Methods                 = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {

    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Navigate to Price Offered list and commit a fresh loan');
      try {
        vars['BidReqIdPriceOffered'] = vars['RequestIDDetails'];
        log.info('Bid Request ID: ' + vars['BidReqIdPriceOffered']);
        testDataManager.updateProfileData('Price Offered', { 'RequestIDFrom28-2': vars['BidReqIdPriceOffered'] });
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await correspondentPortalPage.First_Bid_Request_ID.waitFor({ state: 'visible' });
        await stepGroups.stepGroup_Commits_an_Fresh_Loan_Num(page, vars);
        log.stepPass('Fresh loan committed for Bid Request ID: ' + vars['BidReqIdPriceOffered']);
      } catch (e) {
        await log.stepFail(page, 'Failed to commit fresh loan for Bid Request ID: ' + vars['BidReqIdPriceOffered']);
        throw e;
      }

      log.step('Navigate to Commitment List and uncommit a loan');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.fill(vars['BidReqIdPriceOffered']);
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Commitment_ID_2(vars["BidReqIdPriceOffered"]).click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Check_the_Loan_Num.check();
        vars['UncommittedLoanNum'] = await priceOfferedPage.Checked_Corr_Loan.textContent() || '';
        Methods.trimtestdata(vars['UncommittedLoanNum'], 'UncommittedLoanNum');
        log.info('Loan to uncommit: ' + vars['UncommittedLoanNum']);
        await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await priceOfferedPage.Yes_Uncommit_Button.click();
        await correspondentPortalPage.Okay_Button1.waitFor({ state: 'visible' });
        await correspondentPortalPage.Okay_Button1.click();
        log.stepPass('Loan uncommitted: ' + vars['UncommittedLoanNum']);
      } catch (e) {
        await log.stepFail(page, 'Failed to uncommit loan: ' + vars['UncommittedLoanNum']);
        throw e;
      }

      log.step('Verify uncommitted loan is visible in Total Committed Loans tab');
      try {
        await commitmentListPage.Total_LoansCommitment_List.waitFor({ state: 'visible' });
        await commitmentListPage.Total_Committed_Loans_Tab.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Uncommitted_Loan_Number(vars["UncommittedLoanNum"])).not.toBeVisible();
        log.stepPass('Uncommitted loan is visible in Total Committed Loans tab');
      } catch (e) {
        await log.stepFail(page, 'Uncommitted loan not visible in Total Committed Loans tab');
        throw e;
      }

      log.step('Re-commit the uncommitted loan from Price Offered page');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidRequestIDPrice_Offered(vars["BidReqIdPriceOffered"]).click();
        await priceOfferedPage.Uncommitted_LoanCheck_Box(vars["UncommittedLoanNum"]).waitFor({ state: 'visible' });
        await priceOfferedPage.Uncommitted_LoanCheck_Box(vars["UncommittedLoanNum"]).check();
        await priceOfferedPage.Get_Price_Button.click();
        await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
        await priceOfferedPage.Okay_ButtonPopup.click();
        log.stepPass('Uncommitted loan re-committed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to re-commit the uncommitted loan');
        throw e;
      }

      log.step('Verify re-committed loan on Locked/Committed Loans tab');
      try {
        await priceOfferedPage.LockedCommitted_Loans.waitFor({ state: 'visible' });
        await priceOfferedPage.LockedCommitted_Loans.click();
        await priceOfferedPage.Paste_Loans_ButtonPrice_Offered_Page.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).not.toBeVisible();
        await expect(priceOfferedPage.Committed_Loan_NumLatest(vars["UncommittedLoanNum"])).toBeVisible();
        await expect(priceOfferedPage.Commit_OrderLatest_Committed_Loan(vars["UncommittedLoanNum"])).toContainText(appconstants.TWO);
        log.stepPass('Re-committed loan verified on Locked/Committed Loans tab with commit order: ' + appconstants.TWO);
      } catch (e) {
        await log.stepFail(page, 'Locked/Committed Loans tab verification failed');
        throw e;
      }

      log.step('Verify re-committed loan on All Loans tab');
      try {
        await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
        await priceOfferedPage.Paste_Loans_ButtonPrice_Offered_Page.waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeVisible();
        await expect(priceOfferedPage.Committed_Loan_NumLatest(vars["UncommittedLoanNum"])).toBeVisible();
        await expect(priceOfferedPage.Locked_IconLatest_Committed_Loan(vars["UncommittedLoanNum"])).toBeVisible();
        await expect(priceOfferedPage.Commit_OrderLatest_Committed_Loan(vars["UncommittedLoanNum"])).toContainText(appconstants.TWO);
        log.stepPass('Re-committed loan verified on All Loans tab with commit order: ' + appconstants.TWO);
      } catch (e) {
        await log.stepFail(page, 'All Loans tab verification failed');
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