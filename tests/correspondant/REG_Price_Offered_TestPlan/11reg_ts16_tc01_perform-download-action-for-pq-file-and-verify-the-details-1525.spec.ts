import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedDetailsPage } from '../../../src/pages/correspondant/price-offered-details';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '@pages/correspondant';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import * as fileHelper from '../../../src/helpers/file-helpers';



const TC_ID    = 'REG_TS16_TC01';
const TC_TITLE = 'Perform download action for PQ file and verify the details';

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

      log.step('Capture source loan, corr loan and corr code from UI');
      try {
        vars['SourceLoanUI'] = (await priceOfferedPage.BidRequestIDTextDetails.first().textContent())|| '';
        vars['CorrLoanUI']   = (await priceOfferedDetailsPage.First_Loan_NumberCommited_or_Uncommitted.textContent())|| '';
        vars['CorrCodeUI']   = (await priceOfferedPage.CCode_In_UI.textContent())?.trim() || '';
        Methods.concatenateWithSpecialChar(appconstants.SOURCE_LOAN_NUMBER, vars['SourceLoanUI'], '"', 'SourceLoanExpected');
        Methods.concatenateWithSpecialChar(appconstants.CORR_LOAN_NUMBER, vars['CorrLoanUI'], '"', 'CorrLoanExpected');
        Methods.concatenateWithSpecialChar(appconstants.CORR_CODE, vars['CorrCodeUI'], '"', 'CorrCodeExpected');
        Methods.concatenateWithSpecialChar(appconstants.PRICING_REQUEST, vars['CorrLoanUI'], '-', 'ExpectedFileName1');
        log.info('Source loan: ' + vars['SourceLoanUI']);
        log.info('Corr loan: ' + vars['CorrLoanUI']);
        log.info('Expected PQ file name: ' + vars['ExpectedFileName1']);
        log.stepPass('Source loan, corr loan and corr code captured');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture loan details from UI');
        throw e;
      }

      log.step('Download PQ file for first loan and verify file content');
      try {
        Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'TimeStamp1', appconstants.ASIA_KOLKATA);
        const pq = priceOfferedDetailsPage.First_PQ_Button_Committed_or_Uncommited;
        await pq.scrollIntoViewIfNeeded();
        const [download1] = await Promise.all([
          page.waitForEvent('download'),
          pq.evaluate(el => el.dispatchEvent(new MouseEvent('click', { bubbles: true })))
        ]);
        Methods.concatenateWithSpecialChar(vars['TimeStamp1'], download1.suggestedFilename(), '_','SavedFileName1');
        vars['FilePathAllLoans'] = path.join(vars['DownloadDir'], vars['SavedFileName1']);
        await download1.saveAs(vars['FilePathAllLoans']);
        vars['FileTextAllLoans'] = fileHelper.readJsonValue(vars['FilePathAllLoans'], '');
        expect(Methods.verifyString(vars['SavedFileName1'], 'contains', vars['ExpectedFileName1']));
        expect(Methods.verifyString(vars['FileTextAllLoans'], 'contains', vars['SourceLoanExpected']));
        expect(Methods.verifyString(vars['FileTextAllLoans'], 'contains', vars['CorrLoanExpected']));
        expect(Methods.verifyString(vars['FileTextAllLoans'], 'contains', vars['CorrCodeExpected']));
        log.info('Saved file name: ' + vars['SavedFileName1']);
        log.stepPass('PQ file downloaded and verified. File: ' + vars['SavedFileName1']);
      } catch (e) {
        await log.stepFail(page, 'PQ file download or content verification failed for first loan: ' + vars['CorrLoanUI']);
        throw e;
      }

      log.step('Navigate to Locked Committed Loans tab and capture locked loan details');
      try {
        await priceOfferedPage.LockedCommitted_Loans.click();
        await priceOfferedPage.LockSymbolOpen.waitFor({ state: 'visible' });
        vars['LockedCorrLoanUI'] = (await priceOfferedPage.Locked_CorrLoan.first().textContent())|| '';
        Methods.concatenateWithSpecialChar(appconstants.PRICING_REQUEST, vars['LockedCorrLoanUI'], '-', 'ExpectedFileName2');
        Methods.concatenateWithSpecialChar(appconstants.CORR_LOAN_NUMBER, vars['LockedCorrLoanUI'], '"', 'LockedCorrLoanExpected');
        log.info('Locked corr loan: ' + vars['LockedCorrLoanUI']);
        log.info('Expected locked PQ file name: ' + vars['ExpectedFileName2']);
        log.stepPass('Locked loan captured: ' + vars['LockedCorrLoanUI']);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Locked Committed Loans tab');
        throw e;
      }

      log.step('Download PQ file for locked loan and verify file content');
      try {
        Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'TimeStamp2', appconstants.ASIA_KOLKATA);
        const [download2] = await Promise.all([
          page.waitForEvent('download'),
          bidRequestDetailsPage.PQ_button.first().evaluate(el => el.dispatchEvent(new MouseEvent('click', { bubbles: true })))
        ]);
        Methods.concatenateWithSpecialChar(vars['TimeStamp2'],  download2.suggestedFilename(),'_', 'SavedFileName2');
        vars['FilePathLockedLoans'] = path.join(vars['DownloadDir'], vars['SavedFileName2']);
        await download2.saveAs(vars['FilePathLockedLoans']);
        vars['FileTextLockedLoans'] = fileHelper.readJsonValue(vars['FilePathLockedLoans'], '');
        expect(Methods.verifyString(vars['SavedFileName2'], 'contains', vars['ExpectedFileName2']));
        expect(Methods.verifyString(vars['FileTextLockedLoans'], 'contains', vars['SourceLoanExpected']));
        expect(Methods.verifyString(vars['FileTextLockedLoans'], 'contains', vars['LockedCorrLoanExpected']));
        expect(Methods.verifyString(vars['FileTextLockedLoans'], 'contains', vars['CorrCodeExpected']));
        log.info('Saved file name: ' + vars['SavedFileName2']);
        log.stepPass('Locked loan PQ file downloaded and verified. File: ' + vars['SavedFileName2']);
      } catch (e) {
        await log.stepFail(page, 'PQ file download or content verification failed for locked loan: ' + vars['LockedCorrLoanUI']);
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