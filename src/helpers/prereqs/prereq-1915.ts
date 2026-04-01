import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import path from 'path';
import { CommitmentListPage } from '../../pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1926 } from './prereq-1926';
import { Logger as log } from '@helpers/log-helper';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';

const TC_ID = 'PREREQ_1915(REG_TS14_TC03)';
const TC_TITLE = 'Perform uncommit action and verify that latest commitment letter should be displayed with the latest value';

export async function runPrereq_1915(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1926(page, vars);

  const commitmentListPage = new CommitmentListPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);
  const Methods = new AddonHelpers(page, vars);

  vars['DownloadDir'] = path.join(process.cwd(), 'downloads');

  log.tcStart(TC_ID, TC_TITLE);
  try {

    log.step('Searching and navigating to Commitment List');
    try {
      if (await commitmentListPage.Search_Cancel_Button.isVisible()) /* Element Search Cancel Button is visible */ {
        await commitmentListPage.Search_Cancel_Button.click();
      }
      await priceOfferedPage.Search_Dropdown.click();
      await priceOfferedPage.Search_Dropdown.type(vars['BidReqId']);
      await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.waitFor({ state: 'visible' });
      await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
      await priceOfferedPage.Commitment_IDCommitment_List_Page_New(vars['BidReqId']).waitFor({ state: 'visible' });
      await priceOfferedPage.Commitment_IDCommitment_List_Page_New(vars['BidReqId']).first().click();
      await commitmentListPage.Total_Committed_Loans_Tab.waitFor({ state: 'visible' });
      log.stepPass('Successfully navigated to Commitment List');
    } catch (e) {
      await log.stepFail(page, 'Failed to navigate to Commitment List');
      throw e;
    }

    log.step('Selecting loan and performing Uncommit action');
    try {
      await priceOfferedPage.Check_the_Loan_Num.first().waitFor({ state: 'visible' });
      await priceOfferedPage.Check_the_Loan_Num.first().check();
      await expect(priceOfferedPage.Check_the_Loan_Num.first()).toBeChecked();
      vars['UncommittedLoanNum'] = await priceOfferedPage.Checked_Corr_Loan.textContent() || '';
      Methods.trimtestdata(vars['UncommittedLoanNum'], 'UncommittedLoanNum');
      log.info('UncommittedLoanNum: ' + vars['UncommittedLoanNum']);
      await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
      await priceOfferedPage.Commit_Selected_1_Dropdown.click();
      await priceOfferedPage.Yes_Uncommit_Button.click();
      log.stepPass('Successfully selected loan and performed Uncommit action');
    } catch (e) {
      await log.stepFail(page, 'Failed to select loan or perform Uncommit action');
      throw e;
    }

    log.step('Capturing current estimated time and computing time variations');
    try {
      Methods.getCurrentTimestamp(appconstants.TIME_FORMAT1_HHMMA, 'CurrentEstTime', appconstants.AMERICA_NEW_YORK);
      Methods.convertDateFormat(vars['CurrentEstTime'], appconstants.TIME_FORMAT1_HHMMA, appconstants.TIME_FORMAT_HHMM, 'ActualCurrentEstTime');
      Methods.replaceExistingCharacter(vars['ActualCurrentEstTime'], ':', '_', 'ActualCurrentEstTime');
      Methods.getCurrentTimestamp(appconstants.DATE_FORMAT1_MMDDYYYY, 'CommittedDateUI1', appconstants.AMERICA_NEW_YORK);
      Methods.addMinutesToDatetime(vars['CurrentEstTime'], appconstants.TIME_FORMAT1_HHMMA, 1, appconstants.TIME_FORMAT_HHMM, 'CurrentEstTimePlusOneMin');
      Methods.replaceExistingCharacter(vars['CurrentEstTimePlusOneMin'], ':', '_', 'CurrentEstTimePlusOneMin');
      Methods.subtractMinutesFromDatetime(vars['CurrentEstTime'], appconstants.TIME_FORMAT1_HHMMA, 1, appconstants.TIME_FORMAT_HHMM, 'CurrentEstTimeMinusOneMin');
      Methods.replaceExistingCharacter(vars['CurrentEstTimeMinusOneMin'], ':', '_', 'CurrentEstTimeMinusOneMin');
      log.info('CurrentEstTime: ' + vars['CurrentEstTime']);
      log.info('CommittedDateUI1: ' + vars['CommittedDateUI1']);
      log.info('CurrentEstTimePlusOneMin: ' + vars['CurrentEstTimePlusOneMin']);
      log.info('CurrentEstTimeMinusOneMin: ' + vars['CurrentEstTimeMinusOneMin']);
      log.stepPass('Successfully captured current estimated time and computed time variations');
    } catch (e) {
      await log.stepFail(page, 'Failed to capture current estimated time or compute time variations');
      throw e;
    }

    log.step('Handling Okay Button popup if visible');
    try {
      await priceOfferedPage.Yes_Uncommit_Button.waitFor({ state: 'hidden' });
      if (await priceOfferedPage.Okay_ButtonPopup.isVisible()) /* Element Okay Button(Popup) is visible */ {
        await priceOfferedPage.Okay_ButtonPopup.click();
      }
      log.stepPass('Successfully handled Okay Button popup');
    } catch (e) {
      await log.stepFail(page, 'Failed to handle Okay Button popup');
      throw e;
    }

    log.step('Verify the uncommitted loan number is not present in Total committed lons tab');
    try {
      await page.reload();
      await commitmentListPage.Total_Committed_Loans_Tab.waitFor({ state: 'visible' });
      await commitmentListPage.Total_Committed_Loans_Tab.click();
      await priceOfferedPage.Product_NameDetails.waitFor({ state: 'visible' });
      await expect(priceOfferedPage.Committed_Loan_NumLatest(vars['UncommittedLoanNum'])).not.toBeVisible();
      log.stepPass('Successfully Verified the uncommitted loan number is not present in Total committed lons tab');
    } catch (e) {
      await log.stepFail(page, 'Failed to Verify the uncommitted loan number is not present in Total committed lons tab');
      throw e;
    }

    log.step('Storing Product Name, Ref Sec Coupon, Commitment ID, Current Market Value and Commitment Rows Count');
    try {
      vars['ProductNameUI'] = await priceOfferedPage.Product_NameDetails.textContent() || '';
      Methods.trimtestdata(vars['ProductNameUI'], 'ProductNameUI');
      vars['RefSecCouponUI'] = await priceOfferedPage.Ref_Sec_CouponDetails.textContent() || '';
      Methods.trimtestdata(vars['RefSecCouponUI'], 'RefSecCouponUI');
      vars['CommitmentID'] = await priceOfferedPage.Commit_IDCommitment_List.textContent() || '';
      Methods.trimtestdata(vars['CommitmentID'], 'CommitmentID');
      vars['CurrentMarketValueUI'] = await commitmentListPage.Current_Market_ValueCommitment_List.textContent() || '';
      Methods.trimtestdata(vars['CurrentMarketValueUI'], 'CurrentMarketValueUI');
      vars['CommitmentRowsCount'] = String(await correspondentPortalPage.Commitment_Rows_Count.count());
      log.info('ProductNameUI: ' + vars['ProductNameUI']);
      log.info('RefSecCouponUI: ' + vars['RefSecCouponUI']);
      log.info('CommitmentID: ' + vars['CommitmentID']);
      log.info('CurrentMarketValueUI: ' + vars['CurrentMarketValueUI']);
      log.info('CommitmentRowsCount: ' + vars['CommitmentRowsCount']);
      log.stepPass('Successfully stored Product Name, Ref Sec Coupon, Commitment ID, Current Market Value and Commitment Rows Count');
    } catch (e) {
      await log.stepFail(page, 'Failed to store Product Name, Ref Sec Coupon, Commitment ID, Current Market Value or Commitment Rows Count');
      throw e;
    }

    log.step('Storing all required commitment details from the list');
    try {
      await priceOfferedPage.Back_To_Commitment_List.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await priceOfferedPage.Search_Dropdown.click();
      await priceOfferedPage.Search_Dropdown.type(vars['BidReqId']);
      await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.waitFor({ state: 'visible' });
      await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      vars['CCodeUI'] = await priceOfferedPage.CCode_In_Commitment_List(vars['BidReqId']).textContent() || '';
      Methods.trimtestdata(vars['CCodeUI'], 'CCodeUI');
      vars['CommitmentIdUI'] = await priceOfferedPage.Commitment_IDCommitment_List(vars['BidReqId']).textContent() || '';
      Methods.trimtestdata(vars['CommitmentIdUI'], 'CommitmentIdUI');
      vars['CompanyNameUI'] = await priceOfferedPage.Company_In_Commitment_List(vars['BidReqId']).textContent() || '';
      Methods.trimtestdata(vars['CompanyNameUI'], 'CompanyNameUI');
      vars['CommitmentLoanAmountUI'] = await priceOfferedPage.Comm_AmountCommitment_List(vars['BidReqId']).textContent() || '';
      Methods.trimtestdata(vars['CommitmentLoanAmountUI'], 'CommitmentLoanAmountUI');
      vars['CommittedLoansUI'] = await priceOfferedPage.CommLoans_Commitment_List(vars['BidReqId']).textContent() || '';
      Methods.trimtestdata(vars['CommittedLoansUI'], 'CommittedLoansUI');
      vars['CommittedDateUI'] = await priceOfferedPage.Committed_DateCommitment_List(vars['BidReqId']).textContent() || '';
      Methods.trimtestdata(vars['CommittedDateUI'], 'CommittedDateUI');
      vars['ExpiredDateUI'] = await priceOfferedPage.Expiration_DateCommitment_List(vars['BidReqId']).textContent() || '';
      Methods.trimtestdata(vars['ExpiredDateUI'], 'ExpiredDateUI');
      vars['ExecutionTypeUI'] = await priceOfferedPage.Execution_TypeCommitment_List(vars['BidReqId']).textContent() || '';
      Methods.trimtestdata(vars['ExecutionTypeUI'], 'ExecutionTypeUI');
      log.info('CCodeUI: ' + vars['CCodeUI']);
      log.info('CommitmentIdUI: ' + vars['CommitmentIdUI']);
      log.info('CompanyNameUI: ' + vars['CompanyNameUI']);
      log.info('CommittedDateUI: ' + vars['CommittedDateUI']);
      log.info('ExpiredDateUI: ' + vars['ExpiredDateUI']);
      log.info('ExecutionTypeUI: ' + vars['ExecutionTypeUI']);
      log.stepPass('Successfully stored all commitment list details');
    } catch (e) {
      await log.stepFail(page, 'Failed to store commitment list details');
      throw e;
    }

    log.step('Concatenating all cover letter details and storing to test data profile');
    try {
      const coverLetterProfileName = 'Cover Letter Details2';
      Methods.concatenateWithSpecialChar(vars['CommitmentIdUI'], vars['CommittedDateUI'], ';', 'AllCoverLetterDetailsUI');
      Methods.concatenateWithSpecialChar(vars['AllCoverLetterDetailsUI'], vars['ProductNameUI'], ';', 'AllCoverLetterDetailsUI');
      Methods.concatenateWithSpecialChar(vars['AllCoverLetterDetailsUI'], vars['CommitmentLoanAmountUI'], ';', 'AllCoverLetterDetailsUI');
      Methods.concatenateWithSpecialChar(vars['AllCoverLetterDetailsUI'], vars['ExpiredDateUI'], ';', 'AllCoverLetterDetailsUI');
      Methods.concatenateWithSpecialChar(vars['AllCoverLetterDetailsUI'], vars['RefSecCouponUI'], ';', 'AllCoverLetterDetailsUI');
      Methods.concatenateWithSpecialChar(vars['AllCoverLetterDetailsUI'], vars['CommittedLoansUI'], ';', 'AllCoverLetterDetailsUI');
      Methods.concatenateWithSpecialChar(vars['AllCoverLetterDetailsUI'], vars['BidReqId'], ';', 'AllCoverLetterDetailsUI');
      Methods.concatenateWithSpecialChar(vars['AllCoverLetterDetailsUI'], vars['ReferenceMonth'], ';', 'AllCoverLetterDetailsUI');
      Methods.concatenateWithSpecialChar(vars['AllCoverLetterDetailsUI'], vars['ExecutionTypeUI'], ';', 'AllCoverLetterDetailsUI');
      Methods.concatenateWithSpecialChar(vars['AllCoverLetterDetailsUI'], vars['CurrentMarketValueUI'], ';', 'AllCoverLetterDetailsUI');
      log.info('AllCoverLetterDetailsUI: ' + vars['AllCoverLetterDetailsUI']);
      vars['SplitCount'] = appconstants.ONE;
      for (let count = 1; count <= 11; count++) {
        Methods.splitStringByRegConditionWithPosition(vars['AllCoverLetterDetailsUI'], ';', vars['SplitCount'], 'IndividualCoverLetterDetailsUI');
        Methods.trimtestdata(vars['IndividualCoverLetterDetailsUI'], 'IndividualCoverLetterDetailsUI');
        testDataManager.updatePartialProfileDataByDataIndex(coverLetterProfileName, { ChaseInfo: vars['IndividualCoverLetterDetailsUI'] }, count);
        Methods.MathematicalOperation(vars['SplitCount'], '+', '1', 'SplitCount');
      }
      log.stepPass('Successfully concatenated and stored cover letter details to test data profile');
    } catch (e) {
      await log.stepFail(page, 'Failed to concatenate or store cover letter details');
      throw e;
    }

    log.step('Building CompanyNameWithCCodeUI and expected file names');
    try {
      vars['CompanyNameWithCCodeUI'] = vars['CompanyNameUI'] + ' - (' + vars['CCodeUI'] + ')';
      Methods.trimWhitespace(vars['CompanyNameWithCCodeUI'], 'CompanyNameWithCCodeUI');
      Methods.concatenate('CommitmentLetter_', vars['CommitmentIdUI'], 'ExpectedFileName');
      Methods.concatenateWithSpecialChar(vars['ExpectedFileName'], vars['CommittedDateUI1'], '_', 'ExpectedFileName');
      Methods.concatenateWithSpace(vars['ExpectedFileName'], vars['ActualCurrentEstTime'], 'ExpectedFileName');
      Methods.concatenate('CommitmentLetter_', vars['CommitmentIdUI'], 'ExpectedFileNamePlusOne');
      Methods.concatenateWithSpecialChar(vars['ExpectedFileNamePlusOne'], vars['CommittedDateUI1'], '_', 'ExpectedFileNamePlusOne');
      Methods.concatenateWithSpace(vars['ExpectedFileNamePlusOne'], vars['CurrentEstTimePlusOneMin'], 'ExpectedFileNamePlusOne');
      Methods.concatenate('CommitmentLetter_', vars['CommitmentIdUI'], 'ExpectedFileNameMinusOne');
      Methods.concatenateWithSpecialChar(vars['ExpectedFileNameMinusOne'], vars['CommittedDateUI1'], '_', 'ExpectedFileNameMinusOne');
      Methods.concatenateWithSpace(vars['ExpectedFileNameMinusOne'], vars['CurrentEstTimeMinusOneMin'], 'ExpectedFileNameMinusOne');
      log.info('CompanyNameWithCCodeUI: ' + vars['CompanyNameWithCCodeUI']);
      log.info('ExpectedFileName: ' + vars['ExpectedFileName']);
      log.info('ExpectedFileNamePlusOne: ' + vars['ExpectedFileNamePlusOne']);
      log.info('ExpectedFileNameMinusOne: ' + vars['ExpectedFileNameMinusOne']);
      log.stepPass('Successfully built CompanyNameWithCCodeUI and expected file names');
    } catch (e) {
      await log.stepFail(page, 'Failed to build CompanyNameWithCCodeUI or expected file names');
      throw e;
    }

    log.step('Downloading commitment letter and verifying file name and creation date');
    try {
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await commitmentListPage.Commitment_Letter.click();
      await commitmentListPage.File_NamePopup.first().waitFor({ state: 'visible' });
      vars['FileNamePopup'] = await commitmentListPage.File_NamePopup.first().textContent() || '';
      Methods.trimtestdata(vars['FileNamePopup'], 'FileNamePopup');
      log.info('FileNamePopup: ' + vars['FileNamePopup']);
      if (String(vars['FileNamePopup']).includes(String(vars['ExpectedFileName']))) {
        log.info('File name matched ExpectedFileName: ' + vars['ExpectedFileName']);
      } else if (String(vars['FileNamePopup']).includes(String(vars['ExpectedFileNamePlusOne']))) {
        log.info('File name matched ExpectedFileNamePlusOne: ' + vars['ExpectedFileNamePlusOne']);
      } else {
        Methods.verifyString(vars['FileNamePopup'], 'contains', vars['ExpectedFileNameMinusOne']);
      }
      vars['CreationDatePopup'] = await commitmentListPage.Creation_DatePopup.first().textContent() || '';
      Methods.trimtestdata(vars['CreationDatePopup'], 'CreationDatePopup');
      Methods.verifyString(vars['CommittedDateUI'], 'contains', vars['CreationDatePopup']);
      await commitmentListPage.Download_Commitment_Letter1(vars['FileNamePopup']).waitFor({ state: 'visible' });
      Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'TimeStamp', appconstants.ASIA_KOLKATA);
      // await commitmentListPage.Download_Commitment_Letter1(vars['FileNamePopup']).hover();
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        commitmentListPage.Download_Commitment_Letter1(vars['FileNamePopup']).evaluate(el => (el as HTMLElement).click())
      ]);
      log.info('Commitment Letter file downloaded successfully');
      vars['ActualDownloadedFileName'] = vars['TimeStamp'] + '_' + download.suggestedFilename();
      vars['FilePath'] = path.join(vars['DownloadDir'], vars['ActualDownloadedFileName']);
      await download.saveAs(vars['FilePath']);
      log.info('DownloadedFileName: ' + vars['ActualDownloadedFileName']);
      if (String(vars['ActualDownloadedFileName']).includes(String(vars['ExpectedFileName']))) {
        log.info('Downloaded file name matched ExpectedFileName: ' + vars['ExpectedFileName']);
      } else if (String(vars['ActualDownloadedFileName']).includes(String(vars['ExpectedFileNamePlusOne']))) {
        log.info('Downloaded file name matched ExpectedFileNamePlusOne: ' + vars['ExpectedFileNamePlusOne']);
      } else {
        Methods.verifyString(vars['ActualDownloadedFileName'], 'contains', vars['ExpectedFileNameMinusOne']);
      }
      log.stepPass('Successfully downloaded commitment letter and verified file name and creation date');
    } catch (e) {
      await log.stepFail(page, 'Failed to download commitment letter or verify file name and creation date');
      throw e;
    }

    log.tcEnd('PASS');
  } catch (e) {
    await log.captureOnFailure(page, TC_ID, e);
    log.tcEnd('FAIL');
    throw e;
  }
}
