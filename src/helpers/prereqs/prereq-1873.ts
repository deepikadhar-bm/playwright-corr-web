import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import path from 'path';
import { BidRequestDetailsPage } from '../../pages/correspondant/bid-request-details';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CommitmentListPage } from '../../pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1394 } from './prereq-1394';
import { Logger as log } from '@helpers/log-helper';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';

const TC_ID = 'PREREQ_1873(REG_TS14_TC01)';
const TC_TITLE = 'Verify the download file action present in the according of each commitment, It should display the proper committed loans details';


export async function runPrereq_1873(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1394(page, vars);

  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const bidRequestsPage = new BidRequestsPage(page);
  const commitmentListPage = new CommitmentListPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);
  const Methods = new AddonHelpers(page, vars);

  vars['DownloadDir'] = path.join(process.cwd(), 'downloads');
  log.tcStart(TC_ID, TC_TITLE);


  try {

    log.step('Navigate to Price Offered and commit a loan');
    try {
      await correspondentPortalPage.Commitments_Side_Menu.click();
      await correspondentPortalPage.Price_Offered_List_Dropdown.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      vars['BidReqId'] = vars['RequestIDDetails'];
      log.info('BidReqId: ' + vars['BidReqId']);
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqId']);
      await page.keyboard.press('Enter');
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await priceOfferedPage.BidRequestIDPrice_Offered_New(vars['BidReqId']).click();
      await bidRequestDetailsPage.Last_Name_Sort_Button.waitFor({ state: 'visible' });
      vars['ReferenceMonth'] = await priceOfferedPage.Reference_Month.textContent() || '';
      Methods.trimtestdata(vars['ReferenceMonth'], 'ReferenceMonth');
      log.info('ReferenceMonth: ' + vars['ReferenceMonth']);
      await bidRequestDetailsPage.Last_Name_Sort_Button.click();
      await priceOfferedPage.Last_Name_Down_ArrowDetails.waitFor({ state: 'visible' });
      await priceOfferedPage.Check_the_Loan_Num.first().check();
      vars['CommittedCorrLoan'] = await priceOfferedPage.Checked_Corr_Loan.first().textContent() || '';
      Methods.trimtestdata(vars['CommittedCorrLoan'], 'CommittedCorrLoan');
      log.info('CommittedCorrLoan: ' + vars['CommittedCorrLoan']);
      await expect(priceOfferedPage.Get_Price_Button).toBeEnabled();
      await priceOfferedPage.Get_Price_Button.click();
      await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
      await priceOfferedPage.Commit_Selected_1_Dropdown.click();
      await priceOfferedPage.Yes_Commit_ButtonPopup.click();
      log.stepPass('Loan committed successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to commit loan');
      throw e;
    }

    log.step('Capture commit timestamp and commitment ID from popup');
    try {
      Methods.getCurrentTimestamp(appconstants.TIME_FORMAT_HHMMA, 'CurrentEstTime', appconstants.AMERICA_NEW_YORK);
      Methods.convertDateFormat(vars['CurrentEstTime'], appconstants.TIME_FORMAT_HHMMA, appconstants.TIME_FORMAT_HHMM, 'ActualCurrentEstTime');
      Methods.replaceExistingCharacter(vars['ActualCurrentEstTime'], ':', '_', 'ActualCurrentEstTime');
      Methods.getCurrentTimestamp(appconstants.DATE_FORMAT1_MMDDYYYY, 'CommittedDateUI1', appconstants.AMERICA_NEW_YORK);
      Methods.addMinutesToDatetime(vars['CurrentEstTime'], appconstants.TIME_FORMAT_HHMMA, 1, appconstants.TIME_FORMAT_HHMM, 'CurrentEstTimePlusOneMin');
      // Methods.replaceExistingCharacter()
      Methods.replaceExistingCharacter(vars['CurrentEstTimePlusOneMin'], ':', '_', 'CurrentEstTimePlusOneMin');
      Methods.subtractMinutesFromDatetime(vars['CurrentEstTime'], appconstants.TIME_FORMAT_HHMMA, 1, appconstants.TIME_FORMAT_HHMM, 'CurrentEstTimeMinusOneMin');
      Methods.replaceExistingCharacter(vars['CurrentEstTimeMinusOneMin'], ':', '_', 'CurrentEstTimeMinusOneMin');
      log.info('CurrentEstTime: ' + vars['CurrentEstTime']);
      log.info('CommittedDateUI1: ' + vars['CommittedDateUI1']);
      await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
      vars['CommitmentID'] = await priceOfferedPage.Commitment_IdPrice_Offered.textContent() || '';
      Methods.trimtestdata(vars['CommitmentID'], 'CommitmentID');
      log.info('CommitmentID: ' + vars['CommitmentID']);
      await priceOfferedPage.Okay_ButtonPopup.click();
      log.stepPass('Commit timestamp and commitment ID captured successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to capture commit timestamp or commitment ID');
      throw e;
    }

    log.step('Navigate to Commitment List and filter by CommitmentID');
    try {
      await correspondentPortalPage.Commitments_Side_Menu.click();
      await commitmentListPage.Committed_List_Dropdown.click();
      await priceOfferedPage.Search_Dropdown.type(vars['CommitmentID']);
      await priceOfferedPage.Search_Dropdown.click();
      await priceOfferedPage.Commitment_Id_DropdownCommitment_List_Page.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Filtered commitment list by CommitmentID: ' + vars['CommitmentID']);
    } catch (e) {
      await log.stepFail(page, 'Failed to navigate to Commitment List or filter by CommitmentID');
      throw e;
    }

    log.step('Store all required commitment details from the list');
    try {
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
      log.stepPass('All commitment list details stored successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to store commitment list details');
      throw e;
    }

    log.step('Navigate to commitment details and store Product Name, Ref Sec Coupon, Current Market Value and loan-level details');
    try {
      await priceOfferedPage.Commitment_IDCommitment_List_Page_New(vars['BidReqId']).first().click();
      vars['ProductNameUI'] = await priceOfferedPage.Product_NameDetails.first().textContent() || '';
      Methods.trimtestdata(vars['ProductNameUI'], 'ProductNameUI');
      vars['RefSecCouponUI'] = await priceOfferedPage.Ref_Sec_CouponDetails.first().textContent() || '';
      Methods.trimtestdata(vars['RefSecCouponUI'], 'RefSecCouponUI');
      vars['CurrentMarketValueUI'] = await commitmentListPage.Current_Market_ValueCommitment_List.first().textContent() || '';
      Methods.trimtestdata(vars['CurrentMarketValueUI'], 'CurrentMarketValueUI');
      vars['ChaseLoanNumUI'] = await commitmentListPage.Chase_Loan_Num(vars['CommittedCorrLoan']).textContent() || '';
      Methods.trimtestdata(vars['ChaseLoanNumUI'], 'ChaseLoanNumUI');
      vars['LastNameUI'] = await commitmentListPage.Last_NameCommitment_List(vars['CommittedCorrLoan']).textContent() || '';
      Methods.trimtestdata(vars['LastNameUI'], 'LastNameUI');
      vars['InterestRateUI'] = await priceOfferedPage.Committed_Interest_RatePrice_Offered(vars['CommittedCorrLoan']).textContent() || '';
      Methods.trimtestdata(vars['InterestRateUI'], 'InterestRateUI');
      vars['CommittedPriceUI'] = await correspondentPortalPage.Curr_GrossCommitment_List(vars['CommittedCorrLoan']).textContent() || '';
      Methods.trimtestdata(vars['CommittedPriceUI'], 'CommittedPriceUI');
      vars['HedgeRatioUI'] = await priceOfferedPage.Committed_Hedge_RatioPrice_Offered(vars['CommittedCorrLoan']).textContent() || '';
      Methods.trimtestdata(vars['HedgeRatioUI'], 'HedgeRatioUI');
      log.info('ProductNameUI: ' + vars['ProductNameUI']);
      log.info('RefSecCouponUI: ' + vars['RefSecCouponUI']);
      log.info('CurrentMarketValueUI: ' + vars['CurrentMarketValueUI']);
      log.stepPass('Commitment details stored successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to store commitment details');
      throw e;
    }

    log.step('Open committed loan popup and capture Product Code, LMI Price and LMI Type');
    try {
      await priceOfferedPage.Committed_CorrLoan(vars['CommittedCorrLoan']).click();
      await correspondentPortalPage.Search_Fields_Input.waitFor({ state: 'visible' });
      await commitmentListPage.Product_CodePopup_Details.scrollIntoViewIfNeeded();
      vars['ProductCodeUI'] = await commitmentListPage.Product_CodePopup_Details.textContent() || '';
      Methods.trimtestdata(vars['ProductCodeUI'], 'ProductCodeUI');
      await commitmentListPage.LMI_PricePopup_Details.scrollIntoViewIfNeeded();
      vars['LMIPriceUI'] = await commitmentListPage.LMI_PricePopup_Details.textContent() || '';
      Methods.trimtestdata(vars['LMIPriceUI'], 'LMIPriceUI');
      if (await commitmentListPage.LMI_TypePopup_Details.isVisible()) {
        vars['LMITypeUI'] = await commitmentListPage.LMI_TypePopup_Details.textContent() || '';
        Methods.trimtestdata(vars['LMITypeUI'], 'LMITypeUI');
      } else {
        vars['LMITypeUI'] = 'Null';
      }
      log.info('ProductCodeUI: ' + vars['ProductCodeUI']);
      log.info('LMIPriceUI: ' + vars['LMIPriceUI']);
      log.info('LMITypeUI: ' + vars['LMITypeUI']);
      await correspondentPortalPage.Close_Buttonemail_config.click();
      log.stepPass('Loan popup details captured successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to capture loan popup details');
      throw e;
    }

    log.step('Concatenate all cover letter details and store to test data profile');
    try {
      const coverLetterProfileName = 'Cover Letter Details';
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
      log.stepPass('Cover letter details concatenated and stored to test data profile');
    } catch (e) {
      await log.stepFail(page, 'Failed to concatenate or store cover letter details');
      throw e;
    }

    log.step('Concatenate all loan details and store to test data profile');
    try {
      const loanDetailsProfileName = 'Loan Level Pricing Details';
      Methods.concatenateWithSpecialChar(vars['CCodeUI'], vars['CommitmentIdUI'], ';', 'AllLoanDetailsUI');
      Methods.concatenateWithSpecialChar(vars['AllLoanDetailsUI'], vars['ChaseLoanNumUI'], ';', 'AllLoanDetailsUI');
      Methods.concatenateWithSpecialChar(vars['AllLoanDetailsUI'], vars['CommittedCorrLoan'], ';', 'AllLoanDetailsUI');
      Methods.concatenateWithSpecialChar(vars['AllLoanDetailsUI'], vars['LastNameUI'], ';', 'AllLoanDetailsUI');
      Methods.concatenateWithSpecialChar(vars['AllLoanDetailsUI'], vars['ProductCodeUI'], ';', 'AllLoanDetailsUI');
      Methods.concatenateWithSpecialChar(vars['AllLoanDetailsUI'], vars['CommitmentLoanAmountUI'], ';', 'AllLoanDetailsUI');
      Methods.concatenateWithSpecialChar(vars['AllLoanDetailsUI'], vars['InterestRateUI'], ';', 'AllLoanDetailsUI');
      Methods.concatenateWithSpecialChar(vars['AllLoanDetailsUI'], vars['CommittedPriceUI'], ';', 'AllLoanDetailsUI');
      Methods.concatenateWithSpecialChar(vars['AllLoanDetailsUI'], vars['ExpiredDateUI'], ';', 'AllLoanDetailsUI');
      Methods.concatenateWithSpecialChar(vars['AllLoanDetailsUI'], vars['HedgeRatioUI'], ';', 'AllLoanDetailsUI');
      Methods.concatenateWithSpecialChar(vars['AllLoanDetailsUI'], vars['LMIPriceUI'], ';', 'AllLoanDetailsUI');
      Methods.concatenateWithSpecialChar(vars['AllLoanDetailsUI'], vars['LMITypeUI'], ';', 'AllLoanDetailsUI');
      log.info('AllLoanDetailsUI: ' + vars['AllLoanDetailsUI']);
      vars['SplitCount'] = appconstants.ONE;
      for (let count = 1; count <= 13; count++) {
        Methods.splitStringByRegConditionWithPosition(vars['AllLoanDetailsUI'], ';', vars['SplitCount'], 'IndividualLoanDetailsUI');
        Methods.trimtestdata(vars['IndividualLoanDetailsUI'], 'IndividualLoanDetailsUI');
        testDataManager.updatePartialProfileDataByDataIndex(loanDetailsProfileName, { 'LoanDetails(Loan Level Details)': vars['IndividualLoanDetailsUI'] }, count);
        Methods.MathematicalOperation(vars['SplitCount'], '+', '1', 'SplitCount');
      }
      log.stepPass('Loan details concatenated and stored to test data profile');
    } catch (e) {
      await log.stepFail(page, 'Failed to concatenate or store loan details');
      throw e;
    }

    log.step('Build expected file names and navigate back to download commitment letter');
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
      log.info('ExpectedFileName: ' + vars['ExpectedFileName']);
      log.info('ExpectedFileNamePlusOne: ' + vars['ExpectedFileNamePlusOne']);
      log.info('ExpectedFileNameMinusOne: ' + vars['ExpectedFileNameMinusOne']);
      log.stepPass('Expected file names built successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to build expected file names');
      throw e;
    }

    log.step('Download commitment letter and verify file name and creation date');
    try {
      await priceOfferedPage.Back_To_Commitment_List.click();
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
      vars['ActualDownloadedFileName1'] = vars['TimeStamp'] + '_' + download.suggestedFilename();
      vars['FilePath'] = path.join(vars['DownloadDir'], vars['ActualDownloadedFileName1']);
      await download.saveAs(vars['FilePath']);
      vars['ActualDownloadedFileName1'] = download.suggestedFilename();
      log.info('DownloadedFileName: ' + vars['ActualDownloadedFileName1']);
      if (String(vars['ActualDownloadedFileName1']).includes(String(vars['ExpectedFileName']))) {
        log.info('Downloaded file name matched ExpectedFileName: ' + vars['ExpectedFileName']);
      } else if (String(vars['ActualDownloadedFileName1']).includes(String(vars['ExpectedFileNamePlusOne']))) {
        log.info('Downloaded file name matched ExpectedFileNamePlusOne: ' + vars['ExpectedFileNamePlusOne']);
      } else {
        Methods.verifyString(vars['ActualDownloadedFileName1'], 'contains', vars['ExpectedFileNameMinusOne']);
      }
      log.stepPass('Commitment letter downloaded and file name verified successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to download commitment letter or verify file name');
      throw e;
    }

    log.tcEnd('PASS');

  } catch (e) {
    await log.captureOnFailure(page, TC_ID, e);
    log.tcEnd('FAIL');
    throw e;
  }
}