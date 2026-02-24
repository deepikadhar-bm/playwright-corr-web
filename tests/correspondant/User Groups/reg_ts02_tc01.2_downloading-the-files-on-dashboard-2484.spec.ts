// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS02_TC01.2_Downloading the files on Dashboard', async ({ page }) => {
    // Set up download handler
    page.on('download', async (download) => {
      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      await download.saveAs(filePath);
      vars['_lastDownloadPath'] = filePath;
    });

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Select_Date_Range_Dropdown1.click();
    await correspondentPortalPage.Last_Month.waitFor({ state: 'visible' });
    await correspondentPortalPage.Last_Month.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["TotalCountOfDownloadButtons"] = String(await correspondentPortalPage.Download_Button.count());
    vars["Count"] = "1";
    while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["TotalCountOfDownloadButtons"]))) {
      await correspondentPortalPage.Individual_Download_Button.scrollIntoViewIfNeeded();
      await expect(correspondentPortalPage.Individual_Download_Button).toBeVisible();
      vars["ExpectedFileName"] = await correspondentPortalPage.Headers_Name.textContent() || '';
      vars[""] = String(vars["ExpectedFileName"]).replace(/ExpectedFileName/g, "");
      await correspondentPortalPage.Individual_Download_Button.evaluate(el => (el as HTMLElement).click());
      await page.waitForTimeout(3000); // Wait for download to complete
      await page.waitForTimeout(10000);
      vars[""] = vars['_lastDownloadPath'] ? require('path').basename(vars['_lastDownloadPath']) : '';
      expect(String(vars["DownloadedFileName"]).toLowerCase()).toContain(String(vars["ExpectedFileName"]).toLowerCase());
      await correspondentPortalPage.Expand_Button.click();
      await correspondentPortalPage.Download_ButtonPopup_Dashboard.waitFor({ state: 'visible' });
      await correspondentPortalPage.Download_ButtonPopup_Dashboard.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await correspondentPortalPage.Expand_Button.click();
      await correspondentPortalPage.Cancel_ButtonPopup_Dashboard.waitFor({ state: 'visible' });
      await correspondentPortalPage.Cancel_ButtonPopup_Dashboard.click();
      await page.waitForLoadState('networkidle');
      vars["Count"] = (parseFloat(String(vars["Count"])) + parseFloat(String("1"))).toFixed(0);
    }
  });
});
