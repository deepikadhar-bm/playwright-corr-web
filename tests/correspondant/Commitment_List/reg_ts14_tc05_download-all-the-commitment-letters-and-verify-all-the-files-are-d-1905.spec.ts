import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { ENV } from '@config/environments'
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { getZipFileNames1 } from '../../../src/helpers/file-helpers';

const TC_ID = "REG_TS14_TC05";
const TC_TITLE = "Download all the commitment letters and verify all the files are downloaded";

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let Methods: AddonHelpers;
  let spinnerPage: SpinnerPage;
  let priceOfferedPage: PriceOfferedPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
    priceOfferedPage = new PriceOfferedPage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    vars['DownloadDir'] = path.join(process.cwd(), 'downloads');
    vars["Username"] = credentials.username;
    vars["Password"] = credentials.password;
    log.tcStart(TC_ID, TC_TITLE);
    try {
      log.step('Login to corr application');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to corr application successful');
      } catch (e) {
        log.stepFail(page, 'Failed to login corr application');
        throw e;
      }

      log.step('Navigating to commitment open list tab and download the all commitment letters zip file');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Commitment_List_Text.waitFor({ state: 'visible' });
        await expect(commitmentListPage.Commitment_List_Text).toBeVisible();
        vars["CommitID"] = await commitmentListPage.First_Commitment_IDCommitment_List.first().textContent() || '';
        Methods.concatenate("Commitment_", vars["CommitID"], "ExpectedFileName");
        Methods.concatenate(vars["ExpectedFileName"], "_all_letters.zip", "ExpectedFileName");
        Methods.trimWhitespace(vars["ExpectedFileName"], "ExpectedFileName");
        await commitmentListPage.Commitment_Letter.first().click();
        await expect(commitmentListPage.AllFiles_File_Name).toContainText(vars["ExpectedFileName"]);
        Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'TimeStamp', appconstants.ASIA_KOLKATA);
        await correspondentPortalPage.ALL_Files.hover();
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          correspondentPortalPage.ALL_Files.evaluate(el => (el as HTMLElement).click())
        ]);
        log.info("Successfully download the all commitment letters zip file");
        vars['DownloadedFileName'] = vars['TimeStamp'] + '_' + download.suggestedFilename();
        vars['DownloadedFilePath'] = path.join(vars['DownloadDir'], vars['DownloadedFileName']);
        await download.saveAs(vars['DownloadedFilePath']);
        vars['ZipFileNames'] = getZipFileNames1(vars['DownloadedFilePath']);
        log.info("Zip file names: " + vars['ZipFileNames']);
        vars["FilesCount"] = String(await commitmentListPage.Files_Count.count());
        vars["count"] = "1";
        while (parseFloat(vars["count"]) <= parseFloat(vars["FilesCount"])) {
          vars["IndividualFileName1"] = await commitmentListPage.File_NameCommitment_List(vars["count"]).textContent() || '';
          Methods.trimtestdata(vars["IndividualFileName1"],"IndividualFileName1");
          Methods.verifyString(vars['ZipFileNames'], "contains", vars["IndividualFileName1"]);
          Methods.MathematicalOperation(vars["count"], "+", "1", "count");
        }
        log.stepPass('Successfully downloaded all commitment letters and verified file names');
      } catch (e) {
        log.stepFail(page, 'Failed to download all commitment letters and verify file names');
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