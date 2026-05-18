import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { setupDownloadHandler } from '../../../src/helpers/wait-helpers';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS11_TC01';
const TC_TITLE = 'Verify the Export action - Commitment List';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const crederntials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
    vars["Username"] = crederntials.username;
    vars["Password"] = crederntials.password;
    vars['DownloadDir'] = path.join(process.cwd(), 'downloads');
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {

    try {
      log.tcStart(TC_ID, TC_TITLE);
      try {
        log.step('Login to Correspondent Portal');
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to Correspondent Portal successful');
      } catch (e) {
        await log.stepFail(page, 'Login to Correspondent Portal failed');
        throw e;
      }
      try {
        log.step('Navigate to Commitment List and perform Export action');
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        vars["FirstCommitmentId"] = await commitmentListPage.First_Commitment_IDCommitment_List.first().textContent() || '';
        vars["FirstCommitmentId"] = String(vars["FirstCommitmentId"]).trim();
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars["FirstCommitmentId"]);
        await priceOfferedPage.Commitment_Id_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["RowCount"] = String(await priceOfferedPage.Total_Rows_Count_UIDetails.count());
        log.info('Total rows count: ' + vars['RowCount']);
        vars["RowCountUI"] = "1";
        vars["RowCountExcel"] = "1";
        await priceOfferedPage.Select_All_Loan_Num.click();
        await correspondentPortalPage.Export_Selected_1_Button.waitFor({ state: 'visible' });
        await expect(correspondentPortalPage.Export_Selected_1_Button).toBeEnabled();
        setupDownloadHandler(page, vars);
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          correspondentPortalPage.Export_Selected_1_Button.click(),
        ]);
        Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'TimeStamp', appconstants.ASIA_KOLKATA);
         vars['SavedFileName'] = vars['TimeStamp'] + '_' + download.suggestedFilename();
        vars['DownloadedExportFile'] = path.join(vars['DownloadDir'], vars['SavedFileName']);
        await download.saveAs(vars['DownloadedExportFile']);
        const downloadPath = await download.path();
        vars['_lastDownloadPath'] = downloadPath!;
        log.info('_lastDownloadPath: ' + vars['_lastDownloadPath']);
        log.stepPass('Export action completed and file downloaded successfully');
      } catch (e) {
        log.stepFail(page, 'Error in exporting the file');
        throw e; // Rethrow to ensure test is marked as failed
      }
      try {
        log.step('Verify headers in the exported file');
        await stepGroups.stepGroup_Headers_Verification(page, vars);
        log.stepPass('Headers verification completed successfully');
      } catch (e) {
        log.stepFail(page, 'Error in verifying headers');
        throw e; // Rethrow to ensure test is marked as failed
      }
      try {
        log.step('Verify cell data from Excel to UI, excluding headers');
        await stepGroups.stepGroup_Verification_of_Data_from_Excel_to_UI_Excluding_Headers_Comm(page, vars);
        log.stepPass('Cell Data verification from Excel to UI completed successfully');
      } catch (e) {
        log.stepFail(page, 'Error in verifying cell data');
        throw e; // Rethrow to ensure test is marked as failed
      }
      log.tcEnd('PASS');
    }
    catch (e) {
      console.error(`Error in test ${TC_ID} - ${TC_TITLE}:`, e);
      throw e; // Rethrow to ensure test is marked as failed
    }
  });
});