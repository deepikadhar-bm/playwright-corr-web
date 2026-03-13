import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CommitmentListPage } from '../../pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1394 } from './prereq-1394';
import { AddonHelpers } from '../AddonHelpers';
import { Logger as log } from '../log-helper';
import { APP_CONSTANTS as appconstants } from '../../constants/app-constants';
import { testDataManager } from 'testdata/TestDataManager';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ENV } from '@config/environments';

//REG_TS01_TC01
export async function runPrereq_1738(page: Page, vars: Record<string, string>): Promise<void> {
  // await runPrereq_1394(page, vars);
  const bidRequestsPage = new BidRequestsPage(page);
  const commitmentListPage = new CommitmentListPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);
  const Methods = new AddonHelpers(page, vars);
  const crederntials = ENV.getCredentials('internal');


  log.tcStart('prereq-REG_TS01_TC01', 'Pre-requisite setup for test REG_TS01_TC03');
  
   vars["Username"] = crederntials.username;
    vars["Password"] = crederntials.password;
    vars['BidReqId']="87YE6062594F";
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
  try {
    log.step('Navigating to Price Offered and searching by Bid Request ID');
    try {
      Methods.getCurrentTimestamp(appconstants.DATE_FORMATE_, 'CurrentEstDate', appconstants.America_New_York);
      vars['DatePriceOfferedScreen'] = vars['CurrentEstDate'];
      await correspondentPortalPage.Commitments_Side_Menu.click();
      await correspondentPortalPage.Price_Offered_List_Dropdown.click();
      vars['BidReqId'] = vars['RequestIDDetails'];
      vars['BidReqId']="87YE6062594F";
      testDataManager.updateProfileData('CommitmentList', { 'RequestIDFromPRE_PR_1-1': vars['BidReqId'] });
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqId']);
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.info('BidReqId: ' + vars['BidReqId']);
      log.stepPass('[prereq-1738] Navigated to Price Offered and searched for Bid Request ID: ' + vars['BidReqId']);
    } catch (e) {
      log.stepFail(page, '[prereq-1738] Failed to navigate to Price Offered list');
      throw e;
    }

    log.step('Committing selected loan from Price Offered');
    try {
      await priceOfferedPage.BidRequestIDPrice_Offered_New(vars['BidReqId']).click();
      await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.first().waitFor({ state: 'visible' });
      await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.first().check();
      vars['CommittedCorrLoan'] = await priceOfferedPage.Checked_Corr_Loan.textContent() || '';
      await priceOfferedPage.Get_Price_Button.waitFor({ state: 'visible' });
      await priceOfferedPage.Get_Price_Button.click();
      await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
      await priceOfferedPage.Commit_Selected_1_Dropdown.click();
      await priceOfferedPage.Yes_Commit_ButtonPopup.click();
      Methods.getCurrentTimestamp(appconstants.DATE_FORMATE_, 'ExpectedCommitDate', appconstants.UTC);
      Methods.getCurrentTimestamp(appconstants.TIME_FORMATE, 'CommitTimePriceOffered', appconstants.UTC);
      await priceOfferedPage.Yes_Commit_ButtonPopup.waitFor({ state: 'hidden' });
      await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
      vars['CommitmentIDPriceOffered'] = await priceOfferedPage.Commitment_IdPrice_Offered.textContent() || '';
      Methods.trimtestdata(vars['CommitmentIDPriceOffered'], 'CommitmentIDPriceOffered');
      await priceOfferedPage.Okay_ButtonPopup.click();
      await priceOfferedPage.Locked_Loans_Count.waitFor({ state: 'visible' });
      vars['LockedLoansCount'] = await priceOfferedPage.Locked_Loans_Count.textContent() || '';
      vars['CommitmentOrderPriceOffered'] = await priceOfferedPage.Commitment_OrderPrice_Offred(vars['CommittedCorrLoan']).textContent() || '';
      vars['MaraketValuePriceOffered'] = await priceOfferedPage.Current_Marketprice_offered.textContent() || '';
      vars['LockedLoanAmountPriceOffered'] = await priceOfferedPage.Locked_Loan_Amount.textContent() || '';
      log.stepPass('[prereq-1738] Loan committed. Commitment ID: ' + vars['CommitmentIDPriceOffered']);
    } catch (e) {
      log.stepFail(page, '[prereq-1738] Failed to commit selected loan');
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
      await priceOfferedPage.Search_Dropdown.type(vars['BidReqId']);
      await priceOfferedPage.Search_Dropdown.click();
      await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
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
      log.stepPass('[prereq-1738] Commitment List data captured for Bid Request ID: ' + vars['BidReqId']);
    } catch (e) {
      log.stepFail(page, 'Failed to capture Commitment List data');
      throw e;
    }

    log.step('Verifying commitment data matches between Price Offered and Commitment List');
    try {
      Methods.verifyString(vars['CompanyCCodePriceOfferedScreen'], 'equals', vars['CCodeInCommitmentList']);
      Methods.verifyString(vars['CommitmentIDPriceOffered'], 'equals', vars['CommitmentIdInCommitmentList']);
      await expect(commitmentListPage.First_Bid_Req_IDCommitment_List).toContainText(vars['BidRequestIdPriceOffered']);
      Methods.verifyString(vars['CompanyNamePriceOfferedScreen'], 'equals', vars['CompanyInCommitmentList']);
      Methods.verifyString(vars['LockedLoanAmountPriceOffered'], 'equals', vars['CommAmountCommitmentList']);
      Methods.verifyString(vars['LockedLoansCount'], 'equals', vars['CommLoansCommitmentList']);
      Methods.verifyString(vars['ExpectedCommitDate'], 'equals', vars['CommittedDateCommitmentList']);
      Methods.verifyString(vars['ExecutionTypePriceOfferedScreen'], 'equals', vars['ExecutionTypeCommitmentList']);
      Methods.verifyString(appconstants.ZEROWITHDOLLER, 'equals', vars['AmountDeliveredCommitmentList']);
      Methods.verifyString(appconstants.ZEROWITHDOLLER, 'equals', vars['AmountFundedCommitmentList']);
      Methods.verifyString(appconstants.ZEROWITHDOLLER, 'equals', vars['AmountPairedOffCommitmentList']);
      Methods.verifyString(vars['ExpectedExpirationDate'], 'equals', vars['ExpirationDateCommitmentList']);
      log.stepPass('All commitment data verified successfully');
    } catch (e) {
      log.stepFail(page, 'Verification failed for commitment data');
      throw e;
    }
    log.tcEnd('PASS');
  } catch (e) {
    await log.captureOnFailure(page, 'REG_TS01_TC01', e);
    log.tcEnd('FAIL');
    throw e;
  }
}