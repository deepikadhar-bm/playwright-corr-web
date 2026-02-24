// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as excelHelper from '../../../src/helpers/excel-helpers';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS19_TC02_Verify the Export action after performing a search for a particular bid.', async ({ page }) => {
    // Set up download handler
    page.on('download', async (download) => {
      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      await download.saveAs(filePath);
      vars['_lastDownloadPath'] = filePath;
    });

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    vars["FirstBidReqId"] = await correspondentPortalPage.First_Bid_Request_ID.textContent() || '';
    vars["FirstBidReqId"] = String(vars["FirstBidReqId"]).trim();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["FirstBidReqId"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["RowCount"] = String(await priceOfferedPage.Total_Rows_Count_UIDetails.count());
    vars["RowCountUI"] = "1";
    vars["RowCountExcel"] = "1";
    await priceOfferedPage.Select_All_Loan_Num.click();
    await correspondentPortalPage.Export_Selected_1_Button.waitFor({ state: 'visible' });
    await correspondentPortalPage.Export_Selected_1_Button.click();
    // Wait for download - handled by Playwright download events
    await page.waitForTimeout(2000);
    // [DISABLED] Headers Verification
    // await stepGroups.stepGroup_Headers_Verification(page, vars);
    await stepGroups.stepGroup_Headers_Verification_Price_Offered(page, vars);
    while (parseFloat(String(vars["RowCountUI"])) <= parseFloat(String(vars["RowCount"]))) {
      vars["ColumnCountUI"] = "2";
      vars["indexExcel"] = "1";
      vars["RowDataExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', vars["RowCountExcel"], "0");
      while (parseFloat(String(vars["ColumnCountUI"])) <= parseFloat(String("9"))) {
        vars["CellValueInExcel"] = String(vars["RowDataExcel"]).split(",")[parseInt(String(vars["indexExcel"]))] || '';
        vars["CellValueInExcel"] = String(vars["CellValueInExcel"]).trim();
        vars["CellValuesUI "] = await priceOfferedPage.Individual_Cell_UI.textContent() || '';
        vars["CellValuesUI"] = String(vars["CellValuesUI "]).trim();
        vars["HeadersUI"] = await priceOfferedPage.Headers.textContent() || '';
        vars["HeadersUI"] = String(vars["HeadersUI"]).trim();
        if (String(vars["CellValuesUI"]).includes(String("$"))) {
          vars["CellValuesUI"] = String(vars["CellValuesUI"]).replace(/\$\,/g, '');
        }
        if (String(vars["CellValueInExcel"]).includes(String("ET"))) {
          vars["CellValueInExcel"] = String(vars["CellValueInExcel"]).substring(0, String(vars["CellValueInExcel"]).length - 7);
        }
        if (String(vars["CellValuesUI"]).includes(String("_"))) {
          vars["CellValuesUI"] = String(vars["CellValuesUI"]).replace(/_/g, '');
        }
        if (String(vars["CellValueInExcel"]).includes(String("_"))) {
          vars["CellValueInExcel"] = String(vars["CellValueInExcel"]).replace(/_/g, '');
        }
        if (String(vars["HeadersUI"]) === String("Status")) {
          expect(String(vars["CellValuesUI"]).toLowerCase()).toContain(String(vars["CellValueInExcel"]).toLowerCase());
        } else {
          expect(String(vars["CellValueInExcel"])).toBe(vars["CellValuesUI"]);
        }
        vars["ColumnCountUI"] = (parseFloat(String("1")) + parseFloat(String(vars["ColumnCountUI"]))).toFixed(0);
        vars["indexExcel"] = (parseFloat(String("1")) + parseFloat(String(vars["indexExcel"]))).toFixed(0);
      }
      vars["RowCountExcel"] = (parseFloat(String("1")) + parseFloat(String(vars["RowCountExcel"]))).toFixed(0);
      vars["RowCountUI"] = (parseFloat(String("1")) + parseFloat(String(vars["RowCountUI"]))).toFixed(0);
    }
  });
});
