import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CommitmentDetailsPage } from '../../../src/pages/correspondant/commitment-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '@pages/correspondant/spinner';
import * as fileHelper from '../../../src/helpers/file-helpers';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';

const TC_ID    = 'REG_TS17_TC02';
const TC_TITLE = 'Perform download action for PS file and verify the details';

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
    vars['DownloadDir'] = path.join(process.cwd(), 'downloads');
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

      log.step('Navigate to Commitment List and open first commitment');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await commitmentListPage.First_Commitment_IDCommitment_List.first().click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidRequestIDTextDetails.waitFor({ state: 'visible' });
        log.stepPass('Navigated to Commitment List and opened first commitment');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Commitment List');
        throw e;
      }

      log.step('Capture source loan number, corr loan number and ref security details from UI');
      try {
        vars['BidReqIDUI'] = await priceOfferedPage.BidRequestIDTextDetails.textContent() || '';
        Methods.concatenateWithSpecialChar(appconstants.SOURCE_LOAN_NUMBER, vars['BidReqIDUI'], '"', 'SourceLoanNumUI');

        vars['CorrLoanNumUI'] = await commitmentListPage.First_Loan_NumberCommitment_List.first().textContent() || '';
        Methods.concatenateWithSpecialChar(appconstants.CORR_LOAN_NUMBER, vars['CorrLoanNumUI'], '"', 'CorrLoanNumUI1');

        vars['RefSecProdUI'] = await priceOfferedPage.Locked_RefSecProdCommitment_List.first().textContent() || '';
        Methods.trimtestdata(vars['RefSecProdUI'], 'RefSecProdUI');
        Methods.concatenateWithSpecialChar(appconstants.REF_SEC_NAME, vars['RefSecProdUI'], '"', 'RefSecProdUI');

        Methods.concatenateWithSpecialChar(appconstants.PRICING_RESPONSE, vars['CorrLoanNumUI'], '-', 'ExpectedFileName');

        log.info('Source loan: ' + vars['BidReqIDUI']);
        log.info('Corr loan: ' + vars['CorrLoanNumUI']);
        log.info('Ref security product: ' + vars['RefSecProdUI']);
        log.info('Expected PS file name: ' + vars['ExpectedFileName']);
        log.stepPass('Source loan, corr loan and ref security details captured');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture loan details from UI');
        throw e;
      }

      log.step('Capture and process ref security price for first loan');
      try {
        vars['RefSecPriceLoanUI'] = await priceOfferedPage.Locked_RefSecPriceCommitment_List.first().textContent() || '';
        Methods.trimtestdata(vars['RefSecPriceLoanUI'], 'RefSecPriceLoanUI');
        log.info('Ref security price raw: ' + vars['RefSecPriceLoanUI']);
        vars['RuntimeValue'] = vars['RefSecPriceLoanUI'];
        await stepGroups.stepGroup_Verifying_and_Removing_If_the_Last_Digits_are_Zeroes(page, vars);
        vars['RefSecPriceLoanUI'] = vars['RuntimeValue'];
        Methods.removeSpecialChar('.', vars['RefSecPriceLoanUI'], 'RefSecPriceLoanUI');
        Methods.concatenate(appconstants.REF_SEC_PRICE, vars['RefSecPriceLoanUI'], 'RefSecPriceLoanUI');
        log.info('Ref security price processed: ' + vars['RefSecPriceLoanUI']);
        log.stepPass('Ref security price captured and processed for first loan');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture or process ref security price for first loan');
        throw e;
      }

      log.step('Download PS file for first loan and verify file content');
      try {
        Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'TimeStamp1', appconstants.ASIA_KOLKATA);
        const psButton1 = bidRequestDetailsPage.PS_button.first();
        await psButton1.scrollIntoViewIfNeeded();
        const [download1] = await Promise.all([
          page.waitForEvent('download'),
          psButton1.evaluate(el => el.dispatchEvent(new MouseEvent('click', { bubbles: true })))
        ]);
        Methods.concatenateWithSpecialChar(vars['TimeStamp1'], download1.suggestedFilename(), '_' ,'PSDownloadedFile1');
        vars['PSFilePath1'] = path.join(vars['DownloadDir'], vars['PSDownloadedFile1']);
        await download1.saveAs(vars['PSFilePath1']);
        vars['PSFileData1'] = fileHelper.readJsonValue(vars['PSFilePath1'], '');
        expect(Methods.verifyString(vars['PSDownloadedFile1'], 'contains', vars['ExpectedFileName']));
        expect(Methods.verifyString(vars['PSFileData1'], 'contains', vars['SourceLoanNumUI']));
        expect(Methods.verifyString(vars['PSFileData1'], 'contains', vars['CorrLoanNumUI1']));
        expect(Methods.verifyString(vars['PSFileData1'], 'contains', vars['RefSecProdUI']));
        expect(Methods.verifyString(vars['PSFileData1'], 'contains', vars['RefSecPriceLoanUI']));
        log.info('Saved file name: ' + vars['PSDownloadedFile1']);
        log.stepPass('PS file downloaded and verified. File: ' + vars['PSDownloadedFile1']);
      } catch (e) {
        await log.stepFail(page, 'PS file download or content verification failed for first loan: ' + vars['CorrLoanNumUI']);
        throw e;
      }

      log.step('Navigate to Total Loans tab and capture locked loan details');
      try {
        await commitmentListPage.Total_LoansCommitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Lock_Icon.first().waitFor({ state: 'visible' });
        vars['LockedCorrLoanUI'] = await commitmentDetailsPage.First_Locked_Loan_NumCommitments_Details.textContent() || '';
        Methods.concatenateWithSpecialChar(appconstants.CORR_LOAN_NUMBER, vars['LockedCorrLoanUI'], '"', 'LockedCorrLoanUI1');
        Methods.concatenateWithSpecialChar(appconstants.PRICING_RESPONSE, vars['LockedCorrLoanUI'], '-', 'ExpectedFileNamePSLockedLoan');
        log.info('Locked corr loan: ' + vars['LockedCorrLoanUI']);
        log.info('Expected locked PS file name: ' + vars['ExpectedFileNamePSLockedLoan']);
        log.stepPass('Total Loans tab loaded. Locked loan: ' + vars['LockedCorrLoanUI']);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Total Loans tab or capture locked loan details');
        throw e;
      }

      log.step('Capture and process ref security price for locked loan');
      try {
        vars['RefSecPriceLockedLoanUI'] = await priceOfferedPage.Locked_RefSecPriceCommitment_List.first().textContent() || '';
        Methods.trimtestdata(vars['RefSecPriceLockedLoanUI'], 'RefSecPriceLockedLoanUI');
        log.info('Locked loan ref security price raw: ' + vars['RefSecPriceLockedLoanUI']);
        vars['RuntimeValue'] = vars['RefSecPriceLockedLoanUI'];
        await stepGroups.stepGroup_Verifying_and_Removing_If_the_Last_Digits_are_Zeroes(page, vars);
        vars['RefSecPriceLockedLoansUI'] = vars['RuntimeValue'];
        Methods.removeSpecialChar('.', vars['RefSecPriceLockedLoansUI'], 'RefSecPriceLockedLoansUI');
        Methods.concatenate(appconstants.REF_SEC_PRICE, vars['RefSecPriceLockedLoansUI'], 'RefSecPriceLockedLoansUI');
        log.info('Locked loan ref security price processed: ' + vars['RefSecPriceLockedLoansUI']);
        log.stepPass('Ref security price captured and processed for locked loan');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture or process ref security price for locked loan: ' + vars['LockedCorrLoanUI']);
        throw e;
      }

      log.step('Download PS file for locked loan and verify file content');
      try {
        Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'TimeStamp2', appconstants.ASIA_KOLKATA);
        const psButton2 = commitmentListPage.PS_Button_Committed_Loan.first();
        await psButton2.scrollIntoViewIfNeeded();
        const [download2] = await Promise.all([
          page.waitForEvent('download'),
          psButton2.evaluate(el => el.dispatchEvent(new MouseEvent('click', { bubbles: true })))
        ]);
        Methods.concatenateWithSpecialChar(vars['TimeStamp2'],  download2.suggestedFilename(),'_', 'PSDownloadedFile2');
        vars['PSFilePath2'] = path.join(vars['DownloadDir'], vars['PSDownloadedFile2']);
        await download2.saveAs(vars['PSFilePath2']);
        vars['PSFileData2'] = fileHelper.readJsonValue(vars['PSFilePath2'], '');
        expect(Methods.verifyString(vars['PSDownloadedFile2'], 'contains', vars['ExpectedFileNamePSLockedLoan']));
        expect(Methods.verifyString(vars['PSFileData2'], 'contains', vars['SourceLoanNumUI']));
        expect(Methods.verifyString(vars['PSFileData2'], 'contains', vars['LockedCorrLoanUI1']));
        expect(Methods.verifyString(vars['PSFileData2'], 'contains', vars['RefSecProdUI']));
        expect(Methods.verifyString(vars['PSFileData2'], 'contains', vars['RefSecPriceLockedLoansUI']));
        log.info('Saved file name: ' + vars['PSDownloadedFile2']);
        log.stepPass('Locked loan PS file downloaded and verified. File: ' + vars['PSDownloadedFile2']);
      } catch (e) {
        await log.stepFail(page, 'PS file download or content verification failed for locked loan: ' + vars['LockedCorrLoanUI']);
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