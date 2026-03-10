import { test, expect } from '@playwright/test';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1394 } from '../../../src/helpers/prereqs/prereq-1394';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';

const TC_ID = 'REG_TS01_TC01';
const TC_TITLE = 'Verify that once when the user performs commit action from the price offered module, then a newly created commitment will be displayed';

test.describe('Commitment List - TS_2', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const crederntials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    test.setTimeout(1_200_000);
    vars = {};
    await runPrereq_1394(page, vars);
    bidRequestsPage = new BidRequestsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {
      log.step('Navigating to Price Offered list and searching by Bid Request ID');
      try {
        Methods.getCurrentTimestamp(appconstants.DATE_FORMATE_, 'CurrentEstDate', appconstants.America_New_York);
        vars['DatePriceOfferedScreen'] = vars['CurrentEstDate'];
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        vars['BidReqId'] = vars['RequestIDDetails'];
        testDataManager.updateProfileData('CommitmentList', { 'RequestIDFromPRE_PR_1-1': vars['BidReqId'] });
        await page.waitForTimeout(6000);
        log.info("BidReqId:"+vars['BidReqId']);
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.type(vars['BidReqId']);
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.press('Enter');
        await spinnerPage.Spinner.first().waitFor({ state: 'hidden' });
        await page.waitForTimeout(2000);
        log.stepPass('Navigated to Price Offered and searched for Bid Request ID: ' + vars['BidReqId']);
      } catch (e) {
        log.stepFail(page, 'Failed to navigate to Price Offered list');
        throw e;
      }

      log.step('Committing selected loan from Price Offered');
      try {
        await priceOfferedPage.BidRequestIDPrice_Offered_New(vars['BidReqId']).click();
        await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.first().waitFor({ state: 'visible' });
        await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.first().check();
        await expect(priceOfferedPage.Check_Bid_Loan_NumChase_Exe.first()).toBeChecked();
        vars['CommittedCorrLoan'] = await priceOfferedPage.Checked_Corr_Loan.textContent() || '';
        await priceOfferedPage.Get_Price_Button.waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Get_Price_Button).toBeEnabled();
        await priceOfferedPage.Get_Price_Button.click();
        await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        Methods.getCurrentTimestamp(appconstants.DATE_FORMATE_, 'ExpectedCommitDate', appconstants.UTC);
        Methods.getCurrentTimestamp(appconstants.TIME_FORMATE, 'CommitTimePriceOffered', appconstants.UTC);
        await priceOfferedPage.Yes_Commit_ButtonPopup.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Yes_Commit_ButtonPopup).not.toBeVisible();
        await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Okay_ButtonPopup).toBeVisible();
        vars['CommitmentIDPriceOffered'] = await priceOfferedPage.Commitment_IdPrice_Offered.textContent() || '';
        Methods.trimtestdata(vars['CommitmentIDPriceOffered'], 'CommitmentIDPriceOffered');
        await priceOfferedPage.Okay_ButtonPopup.click();
        await priceOfferedPage.Locked_Loans_Count.waitFor({ state: 'visible' });
        vars['LockedLoansCount'] = await priceOfferedPage.Locked_Loans_Count.textContent() || '';
        vars['CommitmentOrderPriceOffered'] = await priceOfferedPage.Commitment_OrderPrice_Offred(vars['CommittedCorrLoan']).textContent() || '';
        vars['MaraketValuePriceOffered'] = await priceOfferedPage.Current_Marketprice_offered.textContent() || '';
        vars['LockedLoanAmountPriceOffered'] = await priceOfferedPage.Locked_Loan_Amount.textContent() || '';
        log.stepPass('Loan committed successfully. Commitment ID: ' + vars['CommitmentIDPriceOffered']);
      } catch (e) {
        log.stepFail(page, 'Failed to commit selected loan');
        throw e;
      }

      log.step('Capturing Price Offered screen data and calculating expiration date');
      try {
        await priceOfferedPage.BackTo_PriceofferedPage.click();
        await spinnerPage.Spinner.first().waitFor({ state: 'hidden' });
        vars['CompanyCCodePriceOfferedScreen'] = await priceOfferedPage.Company_CCodePrice_Offered_Screen(vars['BidReqId']).textContent() || '';
        Methods.trimtestdata(vars['CompanyCCodePriceOfferedScreen'], 'CompanyCCodePriceOfferedScreen');
        vars['CompanyNamePriceOfferedScreen'] = await priceOfferedPage.Company_NamePrice_Offered_Screen(vars['BidReqId']).textContent() || '';
        vars['ExecutionTypePriceOfferedScreen'] = await priceOfferedPage.Execution_TypePrice_Offered_Screen(vars['BidReqId']).textContent() || '';
        vars['StatusPriceOfferedScreen'] = await priceOfferedPage.StatusPrice_Offered_Screen(vars['BidReqId']).textContent() || '';
        Methods.addDaysToDate(vars['DatePriceOfferedScreen'], appconstants.DATE_FORMATE_, 3, appconstants.DATE_FORMATE_, 'DateAfterAdding3Days');
        Methods.getDayFromDate(vars['DateAfterAdding3Days'], appconstants.DATE_FORMATE_, 'DayAfter3Days');
        if (String(vars['DayAfter3Days']) === String(appconstants.SATURDAY)) {
          Methods.addDaysToDate(vars['DateAfterAdding3Days'], appconstants.DATE_FORMATE_, 2, appconstants.DATE_FORMATE_, 'ExpectedExpirationDate');
        } else if (String(vars['DayAfter3Days']) === String(appconstants.SUNDAY)) {
          Methods.addDaysToDate(vars['DateAfterAdding3Days'], appconstants.DATE_FORMATE_, 1, appconstants.DATE_FORMATE_, 'ExpectedExpirationDate');
        } else {
          Methods.addDaysToDate(vars['DateAfterAdding3Days'], appconstants.DATE_FORMATE_, 0, appconstants.DATE_FORMATE_, 'ExpectedExpirationDate');
        }
        log.stepPass('Price Offered data captured. Expected expiration date: ' + vars['ExpectedExpirationDate']);
      } catch (e) {
        log.stepFail(page, 'Failed to capture Price Offered screen data');
        throw e;
      }

      log.step('Navigating to Commitment List and capturing commitment data');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.click();
        await commitmentListPage.Commitment_List_Text.waitFor({ state: 'visible' });
        await expect(commitmentListPage.Commitment_List_Text).toBeVisible();
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars['BidReqId']);
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await page.waitForTimeout(2000);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['BidRequestIdPriceOffered'] = vars['BidReqId'];
        vars['CCodeInCommitmentList'] = await priceOfferedPage.CCode_In_Commitment_List(vars['BidReqId']).textContent() || '';
        Methods.trimtestdata(vars['CCodeInCommitmentList'], 'CCodeInCommitmentList');
        vars['CommitmentIdInCommitmentList'] = await priceOfferedPage.Commitment_IDCommitment_List(vars['BidReqId']).textContent() || '';
        Methods.trimtestdata(vars['CommitmentIdInCommitmentList'], 'CommitmentIdInCommitmentList');
        vars['CompanyInCommitmentList'] = await priceOfferedPage.Company_In_Commitment_List(vars['BidReqId']).textContent() || '';
        vars['CommAmountCommitmentList'] = await priceOfferedPage.Comm_AmountCommitment_List(vars['BidReqId']).textContent() || '';
        vars['CommLoansCommitmentList'] = await priceOfferedPage.CommLoans_Commitment_List(vars['BidReqId']).textContent() || '';
        Methods.trimtestdata(vars['CommLoansCommitmentList'], 'CommLoansCommitmentList');
        vars['CommittedDateCommitmentList'] = await priceOfferedPage.Committed_DateCommitment_List(vars['BidReqId']).textContent() || '';
        Methods.trimtestdata(vars['CommittedDateCommitmentList'], 'CommittedDateCommitmentList');
        vars['ExpirationDateCommitmentList'] = await priceOfferedPage.Expiration_DateCommitment_List(vars['BidReqId']).textContent() || '';
        Methods.trimtestdata(vars['ExpirationDateCommitmentList'], 'ExpirationDateCommitmentList');
        vars['ExecutionTypeCommitmentList'] = await priceOfferedPage.Execution_TypeCommitment_List(vars['BidReqId']).textContent() || '';
        vars['AmountDeliveredCommitmentList'] = await priceOfferedPage.Amount_DeliveredCommitment_List(vars['BidReqId']).textContent() || '';
        Methods.trimtestdata(vars['AmountDeliveredCommitmentList'], 'AmountDeliveredCommitmentList');
        vars['AmountFundedCommitmentList'] = await priceOfferedPage.Amount_FundedCommitment_List(vars['BidReqId']).textContent() || '';
        Methods.trimtestdata(vars['AmountFundedCommitmentList'], 'AmountFundedCommitmentList');
        vars['AmountPairedOffCommitmentList'] = await priceOfferedPage.Amount_Paired_OffCommitment_List(vars['BidReqId']).textContent() || '';
        Methods.trimtestdata(vars['AmountPairedOffCommitmentList'], 'AmountPairedOffCommitmentList');
        log.stepPass('Commitment List data captured for Bid Request ID: ' + vars['BidReqId']);
      } catch (e) {
        log.stepFail(page, 'Failed to capture Commitment List data');
        throw e;
      }

      log.step('Verifying commitment data matches between Price Offered and Commitment List');
      try {
        expect(Methods.verifyString(vars['CompanyCCodePriceOfferedScreen'], 'equals', vars['CCodeInCommitmentList']));
        expect(Methods.verifyString(vars['CommitmentIDPriceOffered'], 'equals', vars['CommitmentIdInCommitmentList']));
        await expect(commitmentListPage.First_Bid_Req_IDCommitment_List).toContainText(vars['BidRequestIdPriceOffered']);
        expect(Methods.verifyString(vars['CompanyNamePriceOfferedScreen'], 'equals', vars['CompanyInCommitmentList']));
        expect(Methods.verifyString(vars['LockedLoanAmountPriceOffered'], 'equals', vars['CommAmountCommitmentList']));
        expect(Methods.verifyString(vars['LockedLoansCount'], 'equals', vars['CommLoansCommitmentList']));
        expect(Methods.verifyString(vars['ExpectedCommitDate'], 'equals', vars['CommittedDateCommitmentList']));
        expect(Methods.verifyString(vars['ExecutionTypePriceOfferedScreen'], 'equals', vars['ExecutionTypeCommitmentList']));
        expect(Methods.verifyString(appconstants.ZEROWITHDOLLER, 'equals', vars['AmountDeliveredCommitmentList']));
        expect(Methods.verifyString(appconstants.ZEROWITHDOLLER, 'equals', vars['AmountFundedCommitmentList']));
        expect(Methods.verifyString(appconstants.ZEROWITHDOLLER, 'equals', vars['AmountPairedOffCommitmentList']));
        expect(Methods.verifyString(vars['ExpectedExpirationDate'], 'equals', vars['ExpirationDateCommitmentList']));
        log.stepPass('All commitment data verified successfully');
      } catch (e) {
        log.stepFail(page, 'Verification failed for commitment data');
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