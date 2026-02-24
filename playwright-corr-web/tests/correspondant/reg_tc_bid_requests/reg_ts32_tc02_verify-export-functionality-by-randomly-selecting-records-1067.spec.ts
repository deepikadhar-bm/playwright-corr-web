// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as excelHelper from '../../../src/helpers/excel-helpers';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS32_TC02_Verify Export Functionality by randomly selecting records', async ({ page }) => {
    // Set up download handler
    page.on('download', async (download) => {
      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      await download.saveAs(filePath);
      vars['_lastDownloadPath'] = filePath;
    });

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await expect(correspondentPortalPage.Bid_Requests).toBeVisible();
    await correspondentPortalPage.Bid_Requests.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortalPage.Export_Selected_Button_Bid_Request).toBeVisible();
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String("8"))) {
      vars["RandomNumber"] = String(Math.floor(Math.random() * (10 - 1 + 1)) + 1);
      await correspondentPortalPage.Random_BidRequest_Checkbox.check();
      await expect(correspondentPortalPage.Random_BidRequest_Checkbox).toBeVisible();
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    await expect(correspondentPortalPage.Export_Selected_Button_Bid_Request).toBeVisible();
    vars["CountOfRequestsUI"] = await correspondentPortalPage.Export_Records_Count.textContent() || '';
    vars["CountOfRequestsUI"] = String(vars["CountOfRequestsUI"]).trim();
    vars["CountOfRequestsUI"] = String(vars["CountOfRequestsUI"]).substring(1, String(vars["CountOfRequestsUI"]).length - 1);
    await correspondentPortalPage.Export_Selected_Button_Bid_Request.click();
    // Wait for download - handled by Playwright download events
    await page.waitForTimeout(2000);
    vars["File"] = vars['_lastDownloadPath'] || '';
    vars["CountOfRequestsExcel"] = String(excelHelper.getRowCount(vars["File"], "0"));
    vars["CountOfRequestsExcel"] = (parseFloat(String(vars["CountOfRequestsExcel"])) - parseFloat(String("1"))).toFixed(0);
    expect(String(vars["CountOfRequestsUI"])).toBe(vars["CountOfRequestsExcel"]);
    await stepGroups.stepGroup_Verification_of_Column_Headers_Count_and_Column_Names_From_U(page, vars);
  });
});
