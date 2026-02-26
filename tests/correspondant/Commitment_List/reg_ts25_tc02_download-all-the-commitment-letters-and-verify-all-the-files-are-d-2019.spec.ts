// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import * as fileHelper from '../../../src/helpers/file-helpers';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
  });

  test('REG_TS25_TC02_Download all the commitment letters and verify all the files are downloaded', async ({ page }) => {
    // Set up download handler
    page.on('download', async (download) => {
      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      await download.saveAs(filePath);
      vars['_lastDownloadPath'] = filePath;
    });

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await commitmentListPage.Closed_List_Tab.click();
    await commitmentListPage.Download_Commitment_Letter_Button.click();
    // [DISABLED] Click on Commitment Letter
    // await commitmentListPage.Commitment_Letter.click();
    await correspondentPortalPage.ALL_Files.click();
    await page.waitForTimeout(1000);
    vars["AllFilesFileNameUI"] = await commitmentListPage.AllFiles_File_Name.textContent() || '';
    vars[""] = vars['_lastDownloadPath'] ? require('path').basename(vars['_lastDownloadPath']) : '';
    vars[""] = fileHelper.getZipFileNames(vars['_lastDownloadPath'] || '');
    await page.waitForTimeout(5000);
    vars[""] = fileHelper.unzip(vars['_lastDownloadPath'] || '');
    vars["count"] = "1";
    vars["FilesCount"] = String(await commitmentListPage.Files_Count.count());
    expect(String(vars["DownloadedFileName"])).toBe(vars["AllFilesFileNameUI"]);
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["FilesCount"]))) {
      vars["IndividualFileName1"] = await commitmentListPage.File_NameCommitment_List.textContent() || '';
      expect(require('fs').existsSync(require('path').join(String(''), String('')))).toBeTruthy();
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
  });
});
