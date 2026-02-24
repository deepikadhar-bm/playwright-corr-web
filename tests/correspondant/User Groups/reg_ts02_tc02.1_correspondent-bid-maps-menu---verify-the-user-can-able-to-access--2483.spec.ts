// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import * as fileHelper from '../../../src/helpers/file-helpers';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS02_TC02.1_Correspondent Bid Maps Menu - Verify the User can able to access  some of the features in the Bid Request.', async ({ page }) => {
    // Set up download handler
    page.on('download', async (download) => {
      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      await download.saveAs(filePath);
      vars['_lastDownloadPath'] = filePath;
    });

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Bid_Requests.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortalPage.Heading_Bid_Requests).toBeVisible();
    await bidRequestPage.Download_Bid_Request_Button.evaluate(el => (el as HTMLElement).click());
    await correspondentPortalPage.Download_File_Text.waitFor({ state: 'visible' });
    await expect(correspondentPortalPage.Download_File_Text).toBeVisible();
    await chaseFieldNamePage.Ok_Button_Bid_Request.click();
    await correspondentPortalPage.First_Bid_Request_ID.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestDetailsPage.Download_File_Button.click();
    await correspondentPortalPage.Download_File_Text.waitFor({ state: 'visible' });
    await expect(correspondentPortalPage.Download_File_Text).toBeVisible();
    await chaseFieldNamePage.Ok_Button_Bid_Request.click();
    await correspondentPortalPage.Download_Grid_Button1.click();
    await page.waitForTimeout(3000); // Wait for download to complete
    vars["DownloadedGridExcelData"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "1", "1");
    await bidRequestPage.Second_PQ_Button.click();
    await page.waitForTimeout(3000); // Wait for download to complete
    vars["PQFilePath"] = vars['_lastDownloadPath'] || '';
    vars[""] = fileHelper.readJsonValue('', "");
    await bidRequestPage.Second_PS_Button.click();
    await page.waitForTimeout(3000); // Wait for download to complete
    vars["PSFilePath"] = vars['_lastDownloadPath'] || '';
    vars[""] = fileHelper.readJsonValue('', "");
    await correspondentPortalPage.Second_MPRP_Button.click();
    await page.waitForTimeout(3000); // Wait for download to complete
    vars["MPRPExcelData"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "1", "1");
    await correspondentPortalPage.Bid_Requests.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["FirstBidRequestId"] = await correspondentPortalPage.First_Bid_Request_ID.textContent() || '';
    vars["FirstBidRequestId"] = String(vars["FirstBidRequestId"]).trim();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["FirstBidRequestId"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["ActualTotalRowsCount"] = String(await priceOfferedPage.Total_Rows_Count_UIDetails.count());
    vars["ExpectedTotalRowsCount"] = "1";
    expect(String(vars["ExpectedTotalRowsCount"])).toBe(vars["ActualTotalRowsCount"]);
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.check();
    await correspondentPortalPage.Export_Selected_1_Button.waitFor({ state: 'visible' });
    await correspondentPortalPage.Export_Selected_1_Button.click();
    await page.waitForTimeout(3000); // Wait for download to complete
    vars["ExportedExcelData"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "1", "1");
  });
});
