import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments'


const TC_ID = "REG_TS23_TC01";
const TC_TITLE = "Closed List : Verify the Export action";

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let Methods: AddonHelpers;
  let spinnerPage: SpinnerPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars["Username"] = credentials.username;
    vars["Password"] = credentials.password;
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    Methods = new AddonHelpers(page, vars);
    spinnerPage = new SpinnerPage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    vars['DownloadDir'] = path.join(process.cwd(), 'downloads');
    log.tcStart(TC_ID, TC_TITLE);
    try {
      log.step('Login to corr application');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to corr appication successful');
      }
      catch (e) {
        log.stepFail(page, 'Fail to Login corr appication Failed');
        throw e;
      }
      log.step('Navigating to commitment closed list tab');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
        await commitmentListPage.Closed_List_Tab.evaluate((el: HTMLElement) => {
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
          el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
          el.click();
        });
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });  
        await commitmentListPage.Commitment_List_Text.waitFor({ state: 'visible' });
        await expect(commitmentListPage.Commitment_List_Text).toBeVisible();
        await commitmentListPage.Closed_Date.waitFor({ state: 'visible' });
        await expect(commitmentListPage.Closed_Date).toBeVisible();
        log.stepPass('Successsfully Navigate to closed list tab');

      }
      catch (e) {
        log.stepFail(page, 'Fail to navigate closed list tab');
        throw e;
      }
      log.step('Select the required loan number and verify the export functionality by comparing the UI data with the Excel file');
      try {
        await commitmentListPage.Required_Record.first().waitFor({ state: 'visible' });
        await commitmentListPage.Required_Record.first().check();
        expect(await commitmentListPage.Required_Record.first().isChecked());
        vars["TotalRowsCountUI"] = String(await commitmentListPage.Row_CountClosed_List.count());
        await correspondentPortalPage.Export_Selected_1_Button.isEnabled();
        Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'TimeStamp', appconstants.ASIA_KOLKATA);
        const [download] = await Promise.all([page.waitForEvent('download'), correspondentPortalPage.Export_Selected_1_Button.first().click()]);
        log.info("Selcted record File was downloaded successfully");
        vars['SavedFileName'] = vars['TimeStamp'] + '_' + download.suggestedFilename();
        vars['ExportsFilePath'] = path.join(vars['DownloadDir'], vars['SavedFileName']);
        await download.saveAs(vars['ExportsFilePath']);
        log.step('verifying the UI headers to Excel headers');
        try {
          await stepGroups.stepGroup_Headers_Verification_in_Closed_List(page, vars);
          log.stepPass('verifying the UI headers to Excel headers is successful');
        }
        catch (e) {
          log.stepFail(page, 'Fail to verify UI headers to Excel headers');
          throw e;
        }
        log.step('verifying the UI column data to Excel column data');
        try {
          await stepGroups.stepGroup_Verification_of_Data_from_Excel_to_UIClosed_List(page, vars);
          log.stepPass('verifying the UI column data to Excel column data is successful');
        }
        catch (e) {
          log.stepFail(page, 'Fail to verify column data to Excel column data');
          throw e;
        }
        log.stepPass('Select the required loan number and verify the export functionality by comparing the UI data with the Excel file is successful');
      }
      catch (e) {
        log.stepFail(page, 'Fail to Select the required loan number and verify the export functionality by comparing the UI data with the Excel file');
        throw e;
      }
    }
    catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});