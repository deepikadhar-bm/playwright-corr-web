import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedDetailsPage } from '../../../src/pages/correspondant/price-offered-details';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import * as fileHelper from '../../../src/helpers/file-helpers';
import { SpinnerPage } from '@pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID    = 'REG_TS16_TC02';
const TC_TITLE = 'Perform download action for PS file and verify the details';

test.describe('REG_PriceOffered', () => {

  let vars: Record<string, string> = {};
  let Methods: AddonHelpers;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedDetailsPage: PriceOfferedDetailsPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    bidRequestDetailsPage   = new BidRequestDetailsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedDetailsPage = new PriceOfferedDetailsPage(page);
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

      log.step('Navigate to Price Offered list and open first bid request');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidReqIDPartially_Committed_or_Committed.first().click();
        await priceOfferedPage.BidRequestIDTextDetails.first().waitFor({ state: 'visible' });
        log.stepPass('Navigated to Price Offered list and opened first bid request');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Price Offered list');
        throw e;
      }

      log.step('Capture source loan, corr loan and ref security product from UI');
      try {
        vars['BidReqIDUI']    = (await priceOfferedPage.BidRequestIDTextDetails.textContent())?.trim() || '';
        vars['CorrLoanNumUI'] = (await priceOfferedDetailsPage.First_Loan_NumberCommited_or_Uncommitted.textContent())?.trim() || '';
        vars['RefSecProdUI']  = (await priceOfferedPage.Ref_Sec_Prod.first().textContent())?.trim() || '';
        Methods.concatenateWithSpecialChar(appconstants.SOURCE_LOAN_NUMBER, vars['BidReqIDUI'], '', 'SourceLoanExpected');
        Methods.concatenateWithSpecialChar(appconstants.CORR_LOAN_NUMBER, vars['CorrLoanNumUI'], '"', 'CorrLoanNumUI1');
        Methods.concatenateWithSpecialChar(appconstants.REF_SEC_NAME, vars['RefSecProdUI'], '"', 'RefSecProdUI');
        Methods.concatenateWithSpecialChar(appconstants.PRICING_RESPONSE, vars['CorrLoanNumUI'], '-', 'ExpectedFileName1');
        log.info('Source loan: ' + vars['BidReqIDUI']);
        log.info('Corr loan: ' + vars['CorrLoanNumUI']);
        log.info('Ref security product: ' + vars['RefSecProdUI']);
        log.info('Expected PS file name: ' + vars['ExpectedFileName1']);
        log.stepPass('Source loan, corr loan and ref security product captured');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture loan and ref security details from UI');
        throw e;
      }

      log.step('Capture and process ref security price for first loan');
      try {
        vars['RefSecPriceLoanUI'] = (await priceOfferedDetailsPage.Reference_Security_PricePrice_Offered.first().textContent())?.trim() || '';
        log.info('Ref security price raw: ' + vars['RefSecPriceLoanUI']);
        vars['RuntimeValue'] = vars['RefSecPriceLoanUI'];
        await stepGroups.stepGroup_Verifying_and_Removing_If_the_Last_Digits_are_Zeroes(page, vars);
        vars['RefSecPriceLoanUI'] = vars['RuntimeValue'];
        Methods.removeSpecialChar('.', vars['RefSecPriceLoanUI'], 'RefSecPriceLoanUI');
        Methods.concatenateWithSpecialChar(appconstants.REF_SEC_PRICE, vars['RefSecPriceLoanUI'], '', 'RefSecPriceLoanUI');
        log.info('Ref security price processed: ' + vars['RefSecPriceLoanUI']);
        log.stepPass('Ref security price captured and processed for first loan');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture or process ref security price for first loan');
        throw e;
      }

      log.step('Capture security month and resolve to month number');
      try {
        vars['SecMonthName'] = (await priceOfferedPage.Sec_Month.textContent())?.trim() || '';
        log.info('Security month from UI: ' + vars['SecMonthName']);
        Methods.convertDateFormat(vars['SecMonthName'], appconstants.MONTH_FORMAT, appconstants.MONTH_NUM_FORMAT, 'MonthNumUI');
        log.info('Security month number resolved: ' + vars['MonthNumUI']);
        log.stepPass('Security month resolved: ' + vars['SecMonthName'] + ' -> month number: ' + vars['MonthNumUI']);
      } catch (e) {
        await log.stepFail(page, 'Failed to resolve security month: ' + vars['SecMonthName']);
        throw e;
      }

      log.step('Download PS file for first loan and verify file content');
      try {
        Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'TimeStamp1', appconstants.ASIA_KOLKATA);
        const psUnlocked = bidRequestDetailsPage.PS_button.first();
        await psUnlocked.scrollIntoViewIfNeeded();
        const [download1] = await Promise.all([
          page.waitForEvent('download'),
          psUnlocked.evaluate(el => el.dispatchEvent(new MouseEvent('click', { bubbles: true })))
        ]);
        Methods.concatenateWithSpecialChar(vars['TimeStamp1'], download1.suggestedFilename(), '_', 'SavedFileName1');
        vars['FilePathAllLoans'] = path.join(vars['DownloadDir'], vars['SavedFileName1']);
        await download1.saveAs(vars['FilePathAllLoans']);
        vars['PSFileData1'] = fileHelper.readJsonValue(vars['FilePathAllLoans'], '');
        expect(Methods.verifyString(vars['SavedFileName1'], 'contains', vars['ExpectedFileName1']));
        expect(Methods.verifyString(vars['PSFileData1'], 'contains', vars['SourceLoanExpected']));
        expect(Methods.verifyString(vars['PSFileData1'], 'contains', vars['CorrLoanNumUI1']));
        expect(Methods.verifyString(vars['PSFileData1'], 'contains', vars['RefSecProdUI']));
        expect(Methods.verifyString(vars['PSFileData1'], 'contains', vars['RefSecPriceLoanUI']));
        expect(Methods.verifyString(vars['PSFileData1'], 'contains', vars['MonthNumUI']));
        log.info('Saved file name: ' + vars['SavedFileName1']);
        log.stepPass('PS file verified for first loan. File: ' + vars['SavedFileName1']);
      } catch (e) {
        await log.stepFail(page, 'PS file download or content verification failed for first loan: ' + vars['CorrLoanNumUI']);
        throw e;
      }

      log.step('Navigate to Locked Committed Loans tab and capture locked loan details');
      try {
        await priceOfferedPage.LockedCommitted_Loans.click();
        await priceOfferedPage.LockSymbolOpen.waitFor({ state: 'visible' });
        vars['LockedCorrLoanUI'] = (await priceOfferedPage.Locked_CorrLoan.first().textContent()) || '';
        Methods.trimtestdata(vars['LockedCorrLoanUI'], 'LockedCorrLoanUI');
        Methods.concatenateWithSpecialChar(appconstants.PRICING_RESPONSE, vars['LockedCorrLoanUI'], '-', 'ExpectedFileName2');
        Methods.concatenateWithSpecialChar(appconstants.CORR_LOAN_NUMBER, vars['LockedCorrLoanUI'], '"', 'LockedCorrLoanUI1');
        log.info('Locked corr loan: ' + vars['LockedCorrLoanUI']);
        log.info('Expected locked PS file name: ' + vars['ExpectedFileName2']);
        log.stepPass('Locked Committed Loans tab loaded. Locked loan: ' + vars['LockedCorrLoanUI']);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Locked Committed Loans tab or capture locked loan details');
        throw e;
      }

      log.step('Capture and process ref security price for locked loan');
      try {
        vars['RefSecPriceLockedLoanUI'] = (await priceOfferedDetailsPage.Reference_Security_PricePrice_Offered.first().textContent())?.trim() || '';
        log.info('Locked loan ref security price raw: ' + vars['RefSecPriceLockedLoanUI']);
        vars['RuntimeValue'] = vars['RefSecPriceLockedLoanUI'];
        await stepGroups.stepGroup_Verifying_and_Removing_If_the_Last_Digits_are_Zeroes(page, vars);
        vars['RefSecPriceLockedLoanUI'] = vars['RuntimeValue'];
        Methods.removeSpecialChar('.', vars['RefSecPriceLockedLoanUI'], 'RefSecPriceLockedLoansUI');
        Methods.concatenateWithSpecialChar(appconstants.REF_SEC_PRICE, vars['RefSecPriceLockedLoansUI'], '', 'RefSecPriceLockedLoansUI');
        log.info('Locked loan ref security price processed: ' + vars['RefSecPriceLockedLoansUI']);
        log.stepPass('Ref security price captured and processed for locked loan');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture or process ref security price for locked loan: ' + vars['LockedCorrLoanUI']);
        throw e;
      }

      log.step('Download PS file for locked loan and verify file content');
      try {
        Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'TimeStamp2', appconstants.ASIA_KOLKATA);
        const psLocked = priceOfferedPage.PS_Button_Locked_Loan.first();
        await psLocked.scrollIntoViewIfNeeded();
        const [download2] = await Promise.all([
          page.waitForEvent('download'),
          psLocked.evaluate(el => el.dispatchEvent(new MouseEvent('click', { bubbles: true })))
        ]);
        Methods.concatenateWithSpecialChar(vars['TimeStamp2'], download2.suggestedFilename(), '_', 'SavedFileName2');
        vars['FilepathLockedLoans'] = path.join(vars['DownloadDir'], vars['SavedFileName2']);
        await download2.saveAs(vars['FilepathLockedLoans']);
        vars['PSFileData2'] = fileHelper.readJsonValue(vars['FilepathLockedLoans'], '');
        expect(Methods.verifyString(vars['SavedFileName2'], 'contains', vars['ExpectedFileName2']));
        expect(Methods.verifyString(vars['PSFileData2'], 'contains', vars['SourceLoanExpected']));
        expect(Methods.verifyString(vars['PSFileData2'], 'contains', vars['LockedCorrLoanUI1']));
        expect(Methods.verifyString(vars['PSFileData2'], 'contains', vars['RefSecProdUI']));
        expect(Methods.verifyString(vars['PSFileData2'], 'contains', vars['RefSecPriceLockedLoansUI']));
        expect(Methods.verifyString(vars['PSFileData2'], 'contains', vars['MonthNumUI']));
        log.info('Saved file name: ' + vars['SavedFileName2']);
        log.stepPass('PS file verified for locked loan. File: ' + vars['SavedFileName2']);
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