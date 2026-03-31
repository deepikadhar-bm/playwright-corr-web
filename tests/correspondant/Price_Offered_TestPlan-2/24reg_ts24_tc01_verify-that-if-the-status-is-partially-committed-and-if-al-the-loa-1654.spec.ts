import { test, expect } from '@playwright/test';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1394 } from '../../../src/helpers/prereqs/prereq-1394';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS24_TC01';
const TC_TITLE = 'Verify that if the status is partially committed and if all the loans from the list is uncommitted, then the status should be updated back as price offered';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;


  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1394(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
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

      log.step('Navigating to Price Offered and capturing pre-uncommit baseline data');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        vars['BidReqIdPriceOffered'] = vars['RequestIDDetails'];
        log.info('BidReqIdPriceOffered: ' + vars['BidReqIdPriceOffered']);
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidRequestIDPrice_Offered(vars["BidReqIdPriceOffered"]).click();
        await priceOfferedPage.Last_Committed_Bid.waitFor({ state: 'visible' });
        vars['LastCommittedBidBeforeUncommit'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.splitBySpecialChar(vars['LastCommittedBidBeforeUncommit'], '|', '0', 'LastCommittedBidBeforeUncommit');
        log.info('LastCommittedBidBeforeUncommit: ' + vars['LastCommittedBidBeforeUncommit']);
        Methods.trimtestdata(vars['LastCommittedBidBeforeUncommit'], 'LastCommittedBidBeforeUncommit');
        vars['LastCommittedLoanAmountBeforeUncommit'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
        Methods.removeCharactersFromPosition(vars['LastCommittedLoanAmountBeforeUncommit'], '3', '0', 'LastCommittedLoanAmountBeforeUncommit');
        log.stepPass('Pre-uncommit baseline data captured successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to capture pre-uncommit baseline data');
        throw e;
      }

      log.step('Committing a loan and calculating total committed loan amount from locked loans list');
      try {
        await priceOfferedPage.Check_the_Loan_Num.first().click();
        await priceOfferedPage.Get_Price_Button.waitFor({ state: 'visible' });
        await priceOfferedPage.Get_Price_Button.click();
        await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
        await priceOfferedPage.Okay_ButtonPopup.click();
        await priceOfferedPage.LockedCommitted_Loans_2.click();
        await correspondentPortalPage.Paste_Loans_Button1.waitFor({ state: 'hidden' });
        vars['TotalCountLoanAmounts'] = String(await priceOfferedPage.Locked_Loan_AmountCommitment_List.count());
        vars['TotalCommittedLoanAmount'] = appconstants.ZERO;
        vars['count'] = appconstants.ONE;
        while (parseFloat(vars['count']) <= parseFloat(vars['TotalCountLoanAmounts'])) {
          vars['IndividualCommittedLoanAmount'] = await bidRequestDetailsPage.Individual_Loan_Amount(vars["count"]).textContent() || '';
          Methods.performArithmetic(vars['TotalCommittedLoanAmount'], 'ADDITION', vars['IndividualCommittedLoanAmount'], 'TotalCommittedLoanAmount', 0);
          Methods.MathematicalOperation(vars['count'], '+', '1', 'count');
        }
        log.info('TotalCommittedLoanAmount: ' + vars['TotalCommittedLoanAmount']);
        vars['UncommittedLoanAmount'] = vars['TotalCommittedLoanAmount'];
        vars['OpenAuthLimit'] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '0', 'OpenAuthLimitBeforeUncommit');
        log.info('OpenAuthLimitBeforeUncommit: ' + vars['OpenAuthLimitBeforeUncommit']);
        vars['AuthLimitBeforeUncommit'] = await priceOfferedPage.Auth_Limit.textContent() || '';
        log.stepPass('Loan committed and total committed loan amount calculated: ' + vars['TotalCommittedLoanAmount']);
      } catch (e) {
        log.stepFail(page, 'Failed to commit loan or calculate total committed loan amount');
        throw e;
      }

      log.step('Verifying bid status is Partially Committed');
      try {
        await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.clear();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars["BidReqIdPriceOffered"])).toContainText(appconstants.PARTIALLYCOMMITTED_STATUS);
        log.stepPass('Bid status confirmed as Partially Committed');
      } catch (e) {
        log.stepFail(page, 'Failed to verify bid status as Partially Committed');
        throw e;
      }

      log.step('Uncommitting all loans from Commitment List');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Search_In_Committed_Page.clear();
        await priceOfferedPage.Search_In_Committed_Page.type(vars['BidReqIdPriceOffered']);
        await priceOfferedPage.Search_In_Committed_Page.click();
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.waitFor({ state: 'visible' });
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await priceOfferedPage.CommitmentID(vars["BidReqIdPriceOffered"]).waitFor({ state: 'visible' });
        await priceOfferedPage.CommitmentID(vars["BidReqIdPriceOffered"]).click();
        vars['CommittedLoansCountBeforeUncommit'] = await priceOfferedPage.Total_Committed_LoansCommitment_List.textContent() || '';
        log.info('CommittedLoansCountBeforeUncommit: ' + vars['CommittedLoansCountBeforeUncommit']);
        while (await priceOfferedPage.Select_all_for_Checkbox.isVisible()) {
          await priceOfferedPage.Select_all_for_Checkbox.check();
          await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
          await priceOfferedPage.Commit_Selected_1_Dropdown.click();
          await priceOfferedPage.Yes_Uncommit_Button.click();
          await correspondentPortalPage.Okay_Button1.waitFor({ state: 'visible' });
          await correspondentPortalPage.Okay_Button1.click();
          await commitmentListPage.Total_Committed_Loans_Tab.waitFor({ state: 'visible' });
          await commitmentListPage.Total_Committed_Loans_Tab.click();
        }
        log.stepPass('All loans uncommitted successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to uncommit all loans from Commitment List');
        throw e;
      }

      log.step('Capturing post-uncommit data and calculating expected open auth limit');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.clear();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars["BidReqIdPriceOffered"]).waitFor({ state: 'visible' });
        vars['BidStatusPriceOfferedPage'] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars["BidReqIdPriceOffered"]).textContent() || '';
        Methods.trimtestdata(vars['BidStatusPriceOfferedPage'], 'BidStatusPriceOfferedPage');
        Methods.verifyString(vars['BidStatusPriceOfferedPage'], 'equals', appconstants.PRICEOFFERED_STATUS);
        await priceOfferedPage.BidRequestIDPrice_Offered(vars["BidReqIdPriceOffered"]).click();
        await correspondentPortalPage.Open_Auth_Limit_Total_Loan.waitFor({ state: 'visible' });
        vars['OpenAuthLimit'] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '0', 'OpenAuthLimitAfterUncommit');
        Methods.removeMultipleSpecialChars(['$', ','], vars['OpenAuthLimitAfterUncommit'], 'OpenAuthLimitAfterUncommit');
        Methods.trimtestdata(vars['OpenAuthLimitAfterUncommit'], 'OpenAuthLimitAfterUncommit');
        log.info('OpenAuthLimitAfterUncommit: ' + vars['OpenAuthLimitAfterUncommit']);
        Methods.splitBySpecialChar(vars['OpenAuthLimit'], '(', '1', 'OpenAuthLimitPercentageAfterUncommit');
        Methods.removeMultipleSpecialChars([')', '%'], vars['OpenAuthLimitPercentageAfterUncommit'], 'OpenAuthLimitPercentageAfterUncommit');
        vars['AuthLimitAfterUncommit'] = await priceOfferedPage.Auth_Limit.textContent() || '';
        vars['LastCommittedBidAfterUncommit'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.splitBySpecialChar(vars['LastCommittedBidAfterUncommit'], '|', '0', 'LastCommittedBidAfterUncommit');
        Methods.trimtestdata(vars['LastCommittedBidAfterUncommit'], 'LastCommittedBidAfterUncommit');
        vars['LastCommittedLoanAmountAfterUncommit'] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
        Methods.removeCharactersFromPosition(vars['LastCommittedLoanAmountAfterUncommit'], '3', '0', 'LastCommittedLoanAmountAfterUncommit');
        Methods.performArithmetic(vars['OpenAuthLimitBeforeUncommit'], 'ADDITION', vars['UncommittedLoanAmount'], 'ExpectedOpenAuthLimit', 0);
        log.info('ExpectedOpenAuthLimit: ' + vars['ExpectedOpenAuthLimit']);
        Methods.performArithmetic(vars['ExpectedOpenAuthLimit'], 'DIVISION', vars['AuthLimitAfterUncommit'], 'ExpectedOpenAuthPercentage', 4);
        Methods.performArithmetic(vars['ExpectedOpenAuthPercentage'], 'MULTIPLICATION', '100', 'ExpectedOpenAuthPercentage', 2);
        log.stepPass('Post-uncommit data captured and expected values calculated');
      } catch (e) {
        log.stepFail(page, 'Failed to capture post-uncommit data or calculate expected values');
        throw e;
      }

      log.step('Verifying open auth limit, auth limit and last committed bid values after uncommit');
      try {
        Methods.verifyString(vars['ExpectedOpenAuthLimit'], 'equals', vars['OpenAuthLimitAfterUncommit']);
        Methods.verifyString(vars['ExpectedOpenAuthPercentage'], 'equals', vars['OpenAuthLimitPercentageAfterUncommit']);
        Methods.verifyString(vars['AuthLimitBeforeUncommit'], 'equals', vars['AuthLimitAfterUncommit']);
        Methods.verifyString(vars['LastCommittedBidBeforeUncommit'], 'equals', vars['LastCommittedBidAfterUncommit']);
        Methods.verifyString(vars['LastCommittedLoanAmountBeforeUncommit'], 'equals', vars['LastCommittedLoanAmountAfterUncommit']);
        await expect(priceOfferedPage.LockedCommitted_Loans_Count).not.toBeVisible();
        log.stepPass('All open auth limit, auth limit and last committed bid values verified successfully');
      } catch (e) {
        log.stepFail(page, 'Verification failed for open auth limit or last committed bid values');
        throw e;
      }

      log.step('Verifying bid status is Price Offered on Bid Requests page and Bid Request Details page');
      try {
        await correspondentPortalPage.Bid_Requests.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['BidStatusBidReqPage'] = await bidRequestPage.Bid_Status_BidRequestsPage(vars["BidReqIdPriceOffered"]).textContent() || '';
        Methods.trimtestdata(vars['BidStatusBidReqPage'], 'BidStatusBidReqPage');
        Methods.verifyString(vars['BidStatusBidReqPage'], 'equals', appconstants.PRICEOFFERED_STATUS);
        await bidRequestPage.Required_Bid_Req_IDBid_Req_Page(vars["BidReqIdPriceOffered"]).click();
        await bidRequestPage.Bid_StatusBid_Req_Details.waitFor({ state: 'visible' });
        vars['StatusBidReqDetails'] = await bidRequestPage.Bid_StatusBid_Req_Details.textContent() || '';
        Methods.verifyString(vars['StatusBidReqDetails'], 'equals', appconstants.PRICEOFFERED_STATUS);
        testDataManager.updateProfileData('Price Offered', { 'RequestIDfrom24-1': vars['BidReqIdPriceOffered'] });
        log.stepPass('Bid status confirmed as Price Offered on Bid Requests page and Bid Request Details page');
      } catch (e) {
        log.stepFail(page, 'Failed to verify bid status on Bid Requests page or Bid Request Details page');
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