// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as excelHelper from '../../../src/helpers/excel-helpers';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS32_TC03_Verify Export Functionality by searching through request ID', async ({ page }) => {
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
    await correspondentPortalPage.Go_to_Next_Page_Button_2.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["RandomNumber"] = String(Math.floor(Math.random() * (10 - 1 + 1)) + 1);
    vars["RandomRequestID"] = await correspondentPortalPage.Random_BidRequest.textContent() || '';
    vars["RandomRequestID"] = String(vars["RandomRequestID"]).trim();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["RandomRequestID"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestPage.Searched_BidRequest.waitFor({ state: 'visible' });
    await expect(correspondentPortalPage.Export_Selected_Button_Bid_Request).toBeVisible();
    await expect(bidRequestPage.Searched_BidRequest).toContainText(vars["RandomRequestID"]);
    await correspondentPortalPage.First_Checkbox_Bid_Request.check();
    await expect(correspondentPortalPage.First_Checkbox_Bid_Request).toBeVisible();
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
    vars["RequestIDExcel"] = excelHelper.readCell(vars['_lastDownloadPath'] || '', "1", "1", "0");
    expect(String(vars["RandomRequestID"])).toBe(vars["RequestIDExcel"]);
    await stepGroups.stepGroup_Verification_of_Column_Headers_Count_and_Column_Names_From_U(page, vars);
  });
});
