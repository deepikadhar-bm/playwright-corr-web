import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '@pages/correspondant/spinner';
import * as fileHelper from '../../../src/helpers/file-helpers';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID    = 'REG_TS17_TC01';
const TC_TITLE = 'Perform download action for PQ file and verify the details';

test.describe('Commitment List - TS_1', () => {

  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
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
        log.stepPass('Navigated to Commitment List and opened first commitment');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Commitment List');
        throw e;
      }

      log.step('Capture source loan number, corr loan number and corr code from UI');
      try {
        vars['SourceLoanNumUI'] = await priceOfferedPage.BidRequestIDTextDetails.textContent() || '';
        Methods.concatenateWithSpecialChar(appconstants.SOURCE_LOAN_NUMBER, vars['SourceLoanNumUI'], '"', 'SourceLoanNumUI');

        vars['FirstLoanCorrNumberUI'] = await commitmentListPage.First_Loan_NumberCommitment_List.first().textContent() || '';
        Methods.concatenateWithSpecialChar(appconstants.PRICING_REQUEST, vars['FirstLoanCorrNumberUI'], '-', 'ExpectedFileName1');
        Methods.concatenateWithSpecialChar(appconstants.CORR_LOAN_NUMBER, vars['FirstLoanCorrNumberUI'], '"', 'FirstLoanCorrNumberUI1');

        vars['CCodeInUI'] = await priceOfferedPage.CCode_In_UI.textContent() || '';
        Methods.concatenateWithSpecialChar(appconstants.CORR_CODE, vars['CCodeInUI'], '"', 'CCodeInUI');

        log.info('Source loan: ' + vars['SourceLoanNumUI']);
        log.info('Corr loan: ' + vars['FirstLoanCorrNumberUI']);
        log.info('Corr code: ' + vars['CCodeInUI']);
        log.info('Expected PQ file name: ' + vars['ExpectedFileName1']);
        log.stepPass('Source loan, corr loan and corr code captured');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture loan details from UI');
        throw e;
      }

      log.step('Capture FICO value from loan details popup');
      try {
        await commitmentListPage.First_Loan_NumberCommitment_List.first().click();
        await commitmentListPage.Loan_Details_Text_Popup.waitFor({ state: 'visible' });
        vars['FICOValue'] = await commitmentListPage.FICO_Value.textContent() || '';
        Methods.trimtestdata(vars['FICOValue'], 'FICOValue');
        await correspondentPortalPage.Close_Buttonemail_config.click();
        log.info('FICO value: ' + vars['FICOValue']);
        log.stepPass('FICO value captured from loan details popup');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture FICO value from loan details popup');
        throw e;
      }

      log.step('Download PQ file for first loan and verify file content');
      try {
        Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'TimeStamp1', appconstants.ASIA_KOLKATA);
        const PQButton = commitmentListPage.First_PQ_Button.first();
        await PQButton.scrollIntoViewIfNeeded();
        const [download1] = await Promise.all([
          page.waitForEvent('download'),
          PQButton.evaluate(el => el.dispatchEvent(new MouseEvent('click', { bubbles: true })))
        ]);
        Methods.concatenateWithSpecialChar(vars['TimeStamp1'],  download1.suggestedFilename(), '_', 'SavedFileName1');
        vars['FilePathTotalLoans'] = path.join(vars['DownloadDir'], vars['SavedFileName1']);
        await download1.saveAs(vars['FilePathTotalLoans']);
        vars['PQFileDataAllLoans'] = fileHelper.readJsonValue(vars['FilePathTotalLoans'], '');
        expect(Methods.verifyString(vars['SavedFileName1'], 'contains', vars['ExpectedFileName1']));
        expect(Methods.verifyString(vars['PQFileDataAllLoans'], 'contains', vars['SourceLoanNumUI']));
        expect(Methods.verifyString(vars['PQFileDataAllLoans'], 'contains', vars['FirstLoanCorrNumberUI1']));
        expect(Methods.verifyString(vars['PQFileDataAllLoans'], 'contains', vars['CCodeInUI']));
        expect(Methods.verifyString(vars['PQFileDataAllLoans'], 'contains', vars['FICOValue']));
        log.info('Saved file name: ' + vars['SavedFileName1']);
        log.stepPass('PQ file downloaded and verified. File: ' + vars['SavedFileName1']);
      } catch (e) {
        await log.stepFail(page, 'PQ file download or content verification failed for first loan: ' + vars['FirstLoanCorrNumberUI']);
        throw e;
      }

      log.step('Navigate to Total Loans tab and capture locked loan details');
      try {
        await commitmentListPage.Total_LoansCommitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Lock_Icon.first().waitFor({ state: 'visible' });
        vars['LockedCorrLoan'] = await commitmentListPage.First_Loan_NumberCommitment_List.first().textContent() || '';
        Methods.concatenateWithSpecialChar(appconstants.CORR_LOAN_NUMBER, vars['LockedCorrLoan'], '"', 'LockedCorrLoan1');
        Methods.concatenateWithSpecialChar(appconstants.PRICING_REQUEST, vars['LockedCorrLoan'], '-', 'ExpectedFileName2');
        log.info('Locked corr loan: ' + vars['LockedCorrLoan']);
        log.info('Expected locked PQ file name: ' + vars['ExpectedFileName2']);
        log.stepPass('Total Loans tab loaded. Locked loan: ' + vars['LockedCorrLoan']);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Total Loans tab or capture locked loan details');
        throw e;
      }

      log.step('Capture locked loan FICO value from loan details popup');
      try {
        await commitmentListPage.First_Loan_NumberCommitment_List.first().click();
        await commitmentListPage.Loan_Details_Text_Popup.waitFor({ state: 'visible' });
        vars['LockedFICOValue'] = await commitmentListPage.FICO_Value.first().textContent() || '';
        Methods.trimtestdata(vars['LockedFICOValue'], 'LockedFICOValue');
        await correspondentPortalPage.Close_Buttonemail_config.click();
        log.info('Locked loan FICO value: ' + vars['LockedFICOValue']);
        log.stepPass('Locked loan FICO value captured from loan details popup');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture locked loan FICO value from popup');
        throw e;
      }

      log.step('Download PQ file for locked loan and verify file content');
      try {
        Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'TimeStamp2', appconstants.ASIA_KOLKATA);
        const [download2] = await Promise.all([
          page.waitForEvent('download'),
          bidRequestDetailsPage.PQ_button.first().evaluate(el => el.dispatchEvent(new MouseEvent('click', { bubbles: true })))
        ]);
        Methods.concatenateWithSpecialChar(vars['TimeStamp2'], download2.suggestedFilename(), '_', 'SavedFileName2');
        vars['FilePathLockedLoans'] = path.join(vars['DownloadDir'], vars['SavedFileName2']);
        await download2.saveAs(vars['FilePathLockedLoans']);
        vars['PQFileDataLockedLoans'] = fileHelper.readJsonValue(vars['FilePathLockedLoans'], '');
        expect(Methods.verifyString(vars['SavedFileName2'], 'contains', vars['ExpectedFileName2']));
        expect(Methods.verifyString(vars['PQFileDataLockedLoans'], 'contains', vars['SourceLoanNumUI']));
        expect(Methods.verifyString(vars['PQFileDataLockedLoans'], 'contains', vars['LockedCorrLoan1']));
        expect(Methods.verifyString(vars['PQFileDataLockedLoans'], 'contains', vars['CCodeInUI']));
        expect(Methods.verifyString(vars['PQFileDataLockedLoans'], 'contains', vars['LockedFICOValue']));
        log.info('Saved file name: ' + vars['SavedFileName2']);
        log.stepPass('Locked loan PQ file downloaded and verified. File: ' + vars['SavedFileName2']);
      } catch (e) {
        await log.stepFail(page, 'PQ file download or content verification failed for locked loan: ' + vars['LockedCorrLoan']);
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