import { test, expect } from '@playwright/test';
import path from 'path';
// import fs from 'fs';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  //   test.only('REG_TS19_TC02_Verify the Export action after performing a search for a particular bid.', async ({ page }) => {
  //     await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
  //     await correspondentPortalPage.Commitments_Side_Menu.click();
  //     await correspondentPortalPage.Price_Offered_List_Dropdown.click();
  //     vars["FirstBidReqId"] = await correspondentPortalPage.First_Bid_Request_ID.first().textContent() || '';
  //     // vars["FirstBidReqId"] = String(vars["FirstBidReqId"]).trim();
  //     Methods.trimWhitespace(vars["FirstBidReqId"], "FirstBidReqId");
  //     // await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["FirstBidReqId"]);
  //     await bidRequestsPage.Search_by_Bid_Request_ID_Field.pressSequentially(vars["FirstBidReqId"]);

  //     await spinnerPage.Spinner.waitFor({ state: 'hidden' });

  //     vars["RowCount"] = String(await priceOfferedPage.Total_Rows_Count_UIDetails.count());
  //     vars["RowCountUI"] = "1";
  //     vars["RowCountExcel"] = "1";
  //     await priceOfferedPage.Select_All_Loan_Num.click();

  //     await correspondentPortalPage.Export_Selected_1_Button.waitFor({ state: 'visible' });

  //     // Wait for download event and handle it
  //     const downloadPromise = page.waitForEvent('download');
  //     await correspondentPortalPage.Export_Selected_1_Button.click();
  //     const download = await downloadPromise;

  //     // Save the downloaded file to a specific location
  //     const downloadDir = 'test-results/downloads';
  //     if (!fs.existsSync(downloadDir)) {
  //       fs.mkdirSync(downloadDir, { recursive: true });
  //     }
  //     const filePath = path.join(downloadDir, download.suggestedFilename());
  //     await download.saveAs(filePath);
  //     vars['_lastDownloadPath'] = filePath;

  //     // Debug: Verify the file was downloaded correctly
  //     if (!fs.existsSync(vars['_lastDownloadPath'])) {
  //       console.log('ERROR: File not found at:', vars['_lastDownloadPath']);
  //       throw new Error(`Downloaded file not found at: ${vars['_lastDownloadPath']}`);
  //     }
  //     const fileStats = fs.statSync(vars['_lastDownloadPath']);
  //     console.log('✓ File found at:', vars['_lastDownloadPath']);
  //     console.log('✓ File size:', fileStats.size, 'bytes');

  //     // [DISABLED] Headers Verification
  //     // await stepGroups.stepGroup_Headers_Verification(page, vars);
  //     await stepGroups.stepGroup_Headers_Verification_Price_Offered(page, vars);
  //     while (parseFloat(String(vars["RowCountUI"])) <= parseFloat(String(vars["RowCount"]))) {
  //       vars["ColumnCountUI"] = "2";
  //       vars["indexExcel"] = "1";

  //       // Debug: Log before reading row
  //       const excelRowIndex = parseInt(String(vars["RowCountExcel"]));
  //       console.log(`Reading Excel row index: ${excelRowIndex}`);

  //       vars["RowDataExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', vars["RowCountExcel"], "0");

  //       // Debug: Log what was read
  //       console.log(`Raw row data: "${vars["RowDataExcel"]}"`);

  //       if (!vars["RowDataExcel"]) {
  //         console.log(`WARNING: Empty row data at index ${excelRowIndex}. May have reached end of data.`);
  //       }
  //       while (parseFloat(String(vars["ColumnCountUI"])) <= parseFloat(String("9"))) {
  //         // Split row data and trim each cell value
  //         const cellsInRow = String(vars["RowDataExcel"]).split(",").map((cell: string) => cell.trim());
  //         vars["CellValueInExcel"] = cellsInRow[parseInt(String(vars["indexExcel"]))-1] || '';

  //         console.log(`Row: ${vars["RowCountUI"]}, Column: ${vars["ColumnCountUI"]}, Index: ${vars["indexExcel"]}, Excel Value BEFORE cleanup: "${vars["CellValueInExcel"]}"`);
  //         console.log(`  Full split array:`, cellsInRow);
  //         console.log(`  Total cells in row:`, cellsInRow.length);

  //         vars["CellValuesUI"] = await priceOfferedPage.getIndividual_Cell_UI(parseInt(String(vars["RowCountUI"])), parseInt(String(vars["ColumnCountUI"]))).textContent() || '';
  //         console.log(`  UI Value before trim: "${vars["CellValuesUI"]}"`);
  //         vars["CellValuesUI"] = String(vars["CellValuesUI"]).trim();
  //         console.log(`  UI Value after trim: "${vars["CellValuesUI"]}"`);

  //         // await page.pause()
  //         vars["HeadersUI"] = await priceOfferedPage.Headers.nth(parseInt(String(vars["indexExcel"]))).textContent() || '';
  //         vars["HeadersUI"] = String(vars["HeadersUI"]).trim();

  //         // Normalize values - remove extra whitespace and special characters
  //         vars["CellValueInExcel"] = String(vars["CellValueInExcel"]).trim();

  //         // Clean up UI currency values - remove $ and commas
  //         if (String(vars["CellValuesUI"]).includes(String("$"))) {
  //           vars["CellValuesUI"] = String(vars["CellValuesUI"]).replace(/[\$,]/g, '');
  //         }

  //         // Clean up Excel currency values - remove $ and commas
  //         if (String(vars["CellValueInExcel"]).includes(String("$"))) {
  //           vars["CellValueInExcel"] = String(vars["CellValueInExcel"]).replace(/[\$,]/g, '');
  //         }

  //         if (String(vars["CellValueInExcel"]).includes(String("ET"))) {
  //           vars["CellValueInExcel"] = String(vars["CellValueInExcel"]).substring(0, String(vars["CellValueInExcel"]).length - 7);
  //         }

  //         // Remove any trailing whitespace + numbers (cleanup artifacts)
  //         vars["CellValueInExcel"] = String(vars["CellValueInExcel"]).replace(/\s+\d+$/, '').trim();
  //         vars["CellValuesUI"] = String(vars["CellValuesUI"]).replace(/\s+\d+$/, '').trim();

  //         console.log(`  Excel Value AFTER cleanup: "${vars["CellValueInExcel"]}"`);
  //         console.log(`  UI Value AFTER cleanup: "${vars["CellValuesUI"]}"`);

  //         if (String(vars["CellValuesUI"]).includes(String("_"))) {
  //           vars["CellValuesUI"] = String(vars["CellValuesUI"]).replace(/_/g, ' ');
  //         }
  //         if (String(vars["CellValueInExcel"]).includes(String("_"))) {
  //           vars["CellValueInExcel"] = String(vars["CellValueInExcel"]).replace(/_/g, ' ');
  //         }

  //         if (String(vars["HeadersUI"]) === String("Status")) {
  //           expect(String(vars["CellValuesUI"]).toLowerCase()).toContain(String(vars["CellValueInExcel"]).toLowerCase());
  //         } else {
  //           // Use case-insensitive comparison for text values
  //           expect(String(vars["CellValueInExcel"]).toLowerCase()).toBe(String(vars["CellValuesUI"]).toLowerCase());
  //         }
  //         vars["ColumnCountUI"] = (parseFloat(String("1")) + parseFloat(String(vars["ColumnCountUI"]))).toFixed(0);
  //         vars["indexExcel"] = (parseFloat(String("1")) + parseFloat(String(vars["indexExcel"]))).toFixed(0);
  //       }
  //       vars["RowCountExcel"] = (parseFloat(String("1")) + parseFloat(String(vars["RowCountExcel"]))).toFixed(0);
  //       vars["RowCountUI"] = (parseFloat(String("1")) + parseFloat(String(vars["RowCountUI"]))).toFixed(0);
  //     }
  //   });
  // });


  test('REG_TS19_TC02_Verify the Export action after performing a search for a particular bid.', async ({ page }) => {
    // Set up download handler
    // page.on('download', async (download) => {
    //   const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
    //   await download.saveAs(filePath);
    //   vars['_lastDownloadPath'] = filePath;
    // });
    

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    vars["FirstBidReqId"] = await correspondentPortalPage.First_Bid_Request_ID.first().textContent() || '';
    // vars["FirstBidReqId"] = String(vars["FirstBidReqId"]).trim();
    Methods.trimWhitespace(vars["FirstBidReqId"], "FirstBidReqId");
    // await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["FirstBidReqId"]);
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.pressSequentially(vars["FirstBidReqId"])
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["RowCount"] = String(await priceOfferedPage.Total_Rows_Count_UIDetails.count());//total rows in UI
    vars["RowCountUI"] = "1";
    vars["RowCountExcel"] = "0";//leaves the first row for headers
    await page.waitForTimeout(3000);//wait for the UI to stabilize before clicking export
    await priceOfferedPage.Select_All_Loan_Num.click();

    await correspondentPortalPage.Export_Selected_1_Button.waitFor({ state: 'visible' });
    const downloadPromise = page.waitForEvent('download');
    await correspondentPortalPage.Export_Selected_1_Button.click();
    // await correspondentPortalPage.Export_Selected_1_Button.click();
    const download = await downloadPromise;
    const filePath = path.join('test-results','downloads',download.suggestedFilename());
    await download.saveAs(filePath);
    vars['_lastDownloadPath'] = filePath;
    console.log("Downloaded file saved at:", filePath);
    // Wait for download - handled by Playwright download events
    // await page.waitForTimeout(2000);
    // [DISABLED] Headers Verification
    // await stepGroups.stepGroup_Headers_Verification(page, vars);
    const excelRow = excelHelper.readRow(vars['_lastDownloadPath'] || '', 0, "0");
    await stepGroups.stepGroup_Headers_Verification_Price_Offered(page, vars);

    while (parseFloat(String(vars["RowCountUI"])) <= parseFloat(String(vars["RowCount"]))) {
      vars["ColumnCountUI"] = "2";//first column is for selection checkbox, so starting from 2
      vars["indexExcel"] = "0";//to read from the first column in excel which is Ccode
      //  vars["RowDataExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', vars["RowCountExcel"], "0");
      // vars["RowDataExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '',Number(vars["RowCountExcel"]), "0");
      // const excelRow = excelHelper.readRow(vars['_lastDownloadPath'] || '', Number(vars["RowCountExcel"]), "0");
            const excelRow = excelHelper.readRow(vars['_lastDownloadPath'] || '', 0, "0");


      const excelValues = Object.values(excelRow);
      console.log(`Raw row data: "${vars["RowDataExcel"]}"`);

      while (parseFloat(String(vars["ColumnCountUI"])) <= parseFloat(String("9"))) {
        await page.waitForTimeout(3000);//wait for UI to stabilize before reading cell values
        // vars["CellValueInExcel"] = String(vars["RowDataExcel"]).split(",")[parseInt(String(vars["indexExcel"]))] || '';
        vars["CellValueInExcel"] = String(excelValues[Number(vars["indexExcel"])] ?? '') || '';
        console.log("CellValueInExcel: " + vars["CellValueInExcel"]);
        // vars["CellValueInExcel"] = String(vars["CellValueInExcel"]).trim();
        Methods.trimWhitespace(vars["CellValueInExcel"], "CellValueInExcel");

        vars["CellValuesUI"] = await priceOfferedPage.Individual_Cell_UI(vars["RowCountUI"], vars["ColumnCountUI"]).textContent() || '';
        // vars["CellValuesUI"] = String(vars["CellValuesUI "]).trim();
        Methods.trimWhitespace(vars["CellValuesUI"], "CellValuesUI");
        vars["HeadersUI"] = await priceOfferedPage.Headers(vars["ColumnCountUI"]).textContent() || '';
        vars["HeadersUI"] = String(vars["HeadersUI"]).trim();

        Methods.removeMultipleSpecialChars(["_", "-", " "], vars["CellValuesUI"], "CellValuesUI");
        Methods.removeMultipleSpecialChars(["_", "-", " "], vars["CellValueInExcel"], "CellValueInExcel");

        //   if (String(vars["CellValuesUI"]).includes(String("$"))) {
        //     // vars["CellValuesUI"] = String(vars["CellValuesUI"]).replace(/\$\,/g, '');
        //     Methods.removeMultipleSpecialChars(["_", "-", " "], vars["CellValuesUI"], "CellValuesUI");

        //   }
        //   if (String(vars["CellValueInExcel"]).includes(String("ET"))) {
        //     vars["CellValueInExcel"] = String(vars["CellValueInExcel"]).substring(0, String(vars["CellValueInExcel"]).length - 9);//replaced 7 with 9
        //   }

        //   if (vars["CellValuesUI"].includes("/") || vars["CellValueInExcel"].includes("/")) {
        //   vars["CellValuesUI"] = vars["CellValuesUI"].split(" ")[0];
        //   vars["CellValueInExcel"] = vars["CellValueInExcel"].split(" ")[0];
        // }

        //   if (String(vars["CellValuesUI"]).includes(String("_"))) {
        //     // vars["CellValuesUI"] = String(vars["CellValuesUI"]).replace(/_/g, '');
        //     Methods.removeMultipleSpecialChars(["_", "-", " "], vars["CellValuesUI"], "CellValuesUI");
        //   }
        //   if (String(vars["CellValueInExcel"]).includes(String("_"))) {
        //     // vars["CellValueInExcel"] = String(vars["CellValueInExcel"]).replace(/_/g, '');
        //     Methods.removeMultipleSpecialChars(["_", "-", " "], vars["CellValueInExcel"], "CellValueInExcel");
        //   }

        //   if (vars["CellValuesUI"].includes("$") || vars["CellValueInExcel"].includes("$")) {
        //   vars["CellValuesUI"] = vars["CellValuesUI"].replace(/[\$,]/g, '');
        //   vars["CellValueInExcel"] = vars["CellValueInExcel"].replace(/[\$,]/g, '');
        //   }

        //   if (String(vars["HeadersUI"]) === String("Status")) {
        //     expect(String(vars["CellValuesUI"]).toLowerCase()).toContain(String(vars["CellValueInExcel"]).toLowerCase());
        // } else {

        // ================= NORMALIZE EXCEL VALUE =================

        Methods.trimWhitespace(vars["CellValueInExcel"], "CellValueInExcel");


        // ================= NORMALIZE EXCEL VALUE =================

        // Trim first
        Methods.trimWhitespace(vars["CellValueInExcel"], "CellValueInExcel");


        //STEP 1 — keep ONLY date part if datetime exists
        const dateMatch = vars["CellValueInExcel"].match(/\d{2}\/\d{2}\/\d{4}/);

        if (dateMatch) { vars["CellValueInExcel"] = dateMatch[0]; }


        //STEP 2 — remove currency formatting
        vars["CellValueInExcel"] = vars["CellValueInExcel"].replace(/[\$,]/g, '');


        //STEP 3 — remove remaining unwanted chars
        Methods.removeMultipleSpecialChars(["_", "-", " "], vars["CellValueInExcel"], "CellValueInExcel");


        // lowercase normalization
        vars["CellValueInExcel"] = vars["CellValueInExcel"].toLowerCase();

        // ================= NORMALIZE UI VALUE =================

        Methods.trimWhitespace(vars["CellValuesUI"], "CellValuesUI");

        vars["CellValuesUI"] = vars["CellValuesUI"].replace(/[\$,]/g, '');

        Methods.removeMultipleSpecialChars(["_", "-", " "], vars["CellValuesUI"], "CellValuesUI");

        vars["CellValuesUI"] = vars["CellValuesUI"].toLowerCase();




        expect(String(vars["CellValueInExcel"])).toBe(vars["CellValuesUI"]);
        // }
        vars["ColumnCountUI"] = (parseFloat(String("1")) + parseFloat(String(vars["ColumnCountUI"]))).toFixed(0);
        vars["indexExcel"] = (parseFloat(String("1")) + parseFloat(String(vars["indexExcel"]))).toFixed(0);
      }
      vars["RowCountExcel"] = (parseFloat(String("1")) + parseFloat(String(vars["RowCountExcel"]))).toFixed(0);
      vars["RowCountUI"] = (parseFloat(String("1")) + parseFloat(String(vars["RowCountUI"]))).toFixed(0);
    }
  });
});