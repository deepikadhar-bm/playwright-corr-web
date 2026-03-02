// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { runPrereq_1928 } from '../../../src/helpers/prereqs/prereq-1928';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1928(page, vars);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS14_TC04_Download any of previous file and verify that data should remain unchanged', async ({ page }) => {

    // Set up download handler
    page.on('download', async (download) => {
      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      await download.saveAs(filePath);
      vars['_lastDownloadPath'] = filePath;
    });

    const testData: Record<string, string> = {
  "HeaderName": "Commitment Number:",
  "ChaseInfo": "87EP7DBB",
  "HeaderName(Loan Level Details)": "",
  "LoanDetails(Loan Level Details)": ""
} // Profile: "Cover Letter Details", row 0;

    if (true) /* Element Search Cancel Button is visible */ {
      await commitmentListPage.Search_Cancel_Button.click();
    }
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["BidReqId"]);
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.waitFor({ state: 'visible' });
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Commitment_Letter.click();
    await commitmentListPage.Download_Commitment_LatterLast.waitFor({ state: 'visible' });
    await commitmentListPage.Download_Commitment_LatterLast.hover();
    await commitmentListPage.Download_Commitment_LatterLast.evaluate(el => (el as HTMLElement).click());
    await page.waitForTimeout(3000); // Wait for download to complete
    vars[""] = vars['_lastDownloadPath'] ? require('path').basename(vars['_lastDownloadPath']) : '';
    vars["ActualDownloadedFileName1"] = String(vars["ActualDownloadedFileName1"]).substring(0, String(vars["ActualDownloadedFileName1"]).length - 5);
    expect(String(vars["PreviousFileName"])).toBe(vars["ActualDownloadedFileName1"]);
    vars["CoverLetterHeaderExcelPart1"] = excelHelper.readCell(vars["FilePath"], "3", "0", "0");
    expect(String(vars["CoverLetterHeaderExcelPart1"])).toBe("Correspondent Name (Ccode):");
    vars["CoverLetterDataExcelPart1"] = excelHelper.readCell(vars["FilePath"], "3", "1", "0");
    vars["CoverLetterDataExcelPart1"] = String(vars["CoverLetterDataExcelPart1"]).trim();
    expect(String(vars["CoverLetterDataExcelPart1"])).toBe(vars["CompanyNameWithCCodeUI"]);
    vars["CoverLetterHeaderExcelPart1"] = excelHelper.readCell(vars["FilePath"], "3", "3", "0");
    expect(String(vars["CoverLetterHeaderExcelPart1"])).toBe("User Name:");
    vars["CoverLetterDataExcelPart1"] = excelHelper.readCell(vars["FilePath"], "3", "4", "0");
    expect(String(vars["CoverLetterDataExcelPart1"])).toBe("Chase Correspondent");
    vars["RowCount"] = "9";
    vars["tdpcount"] = "1";
    while (parseFloat(String(vars["RowCount"])) <= parseFloat(String("15"))) {
      vars["EntireRowDataExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', vars["RowCount"], "1");
      await commitmentListPage.Download_File_TextPopup.click();
      if (String(vars["EntireRowDataExcel"]).includes(String("N/A,null,N/A,null,N/A"))) {
      } else if (String(vars["EntireRowDataExcel"]).includes(String("null,null,null,null,N/A"))) {
      } else {
        vars["SplitHeaderCount"] = "1";
        vars["SplitIndex"] = "2";
        vars["ColumnCount"] = "1";
        while (parseFloat(String(vars["ColumnCount"])) <= parseFloat(String("3"))) {
          vars["IndividualHeaderNameExcel"] = String(vars["EntireRowDataExcel"]).split(",")[parseInt(String(vars["SplitHeaderCount"]))] || '';
          vars["IndividualValueExcel"] = String(vars["EntireRowDataExcel"]).split(",")[parseInt(String(vars["SplitIndex"]))] || '';
          if (String(vars["IndividualValueExcel"]).includes(String("$"))) {
            vars["SplitIndex"] = (parseFloat(String(vars["SplitIndex"])) + parseFloat(String("1"))).toFixed(0);
            vars["IndividualValueExcel2"] = String(vars["EntireRowDataExcel"]).split(",")[parseInt(String(vars["SplitIndex"]))] || '';
            vars["IndividualValueExcel"] = String(vars["IndividualValueExcel"]) + "," + String(vars["IndividualValueExcel2"]);
            vars["SplitHeaderCount"] = (parseFloat(String(vars["SplitHeaderCount"])) + parseFloat(String("1"))).toFixed(0);
          }
          for (let dataIdx = parseInt(vars["tdpcount"]); dataIdx <= parseInt(vars["tdpcount"]); dataIdx++) {
            if (String(vars["IndividualHeaderNameExcel"]) === String("null")) {
              vars["tdpcount"] = (parseFloat(String(vars["tdpcount"])) - parseFloat(String("1"))).toFixed(0);
            } else if (String(vars["IndividualHeaderNameExcel"]) === String("N/A")) {
              vars["tdpcount"] = (parseFloat(String(vars["tdpcount"])) - parseFloat(String("1"))).toFixed(0);
            } else {
              expect(String(vars["IndividualHeaderNameExcel"])).toBe(testData["HeaderName"]);
            }
            if (String(vars["IndividualValueExcel"]) === String("null")) {
            } else if (String(vars["IndividualValueExcel"]) === String("N/A")) {
            } else {
              expect(String(vars["IndividualValueExcel"]).toLowerCase()).toContain(String(testData["ChaseInfo"]).toLowerCase());
            }
          }
          vars["SplitHeaderCount"] = (parseFloat(String(vars["SplitHeaderCount"])) + parseFloat(String("2"))).toFixed(0);
          vars["SplitIndex"] = (parseFloat(String(vars["SplitIndex"])) + parseFloat(String("2"))).toFixed(0);
          vars["ColumnCount"] = (parseFloat(String(vars["ColumnCount"])) + parseFloat(String("1"))).toFixed(0);
          vars["tdpcount"] = (parseFloat(String(vars["tdpcount"])) + parseFloat(String("1"))).toFixed(0);
        }
      }
      vars["RowCount"] = (parseFloat(String(vars["RowCount"])) + parseFloat(String("1"))).toFixed(0);
    }
    vars["EntireRowDataHeaderNamesExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "0", "2");
    vars["EntireRowDetailsExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "1", "2");
    vars["count"] = "1";
    vars["SplitCount"] = "1";
    for (let dataIdx = parseInt(vars["count"]); dataIdx <= 13; dataIdx++) {
      vars["IndividualHeaderNameExcel"] = String(vars["EntireRowDataHeaderNamesExcel"]).split(",")[parseInt(String(vars["count"]))] || '';
      if (String(vars["SplitCount"]) === String("14")) {
        await page.waitForTimeout(3000);
        vars["IndividualColumnDataExcel"] = excelHelper.readCell(vars["FilePath"], "1", "12", "1");
      } else {
        vars["IndividualColumnDataExcel"] = String(vars["EntireRowDetailsExcel"]).split(",")[parseInt(String(vars["SplitCount"]))] || '';
      }
      if (String(vars["IndividualColumnDataExcel"]).includes(String("$"))) {
        vars["SplitCount"] = (parseFloat(String(vars["SplitCount"])) + parseFloat(String("1"))).toFixed(0);
        vars["IndividualColumnDataExcel2"] = String(vars["EntireRowDetailsExcel"]).split(",")[parseInt(String(vars["SplitCount"]))] || '';
        vars["IndividualColumnDataExcel"] = String(vars["IndividualColumnDataExcel"]) + "," + String(vars["IndividualColumnDataExcel2"]);
      }
      expect(String(testData["HeaderName(Loan Level Details)"])).toBe(vars["IndividualHeaderNameExcel"]);
      if (String(vars["IndividualColumnDataExcel"]) === String("key_blank")) {
        vars["IndividualColumnDataExcel"] = "Null";
      }
      expect(String(testData["LoanDetails(Loan Level Details)"])).toBe(vars["IndividualColumnDataExcel"]);
      vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
      vars["SplitCount"] = (parseFloat(String(vars["SplitCount"])) + parseFloat(String("1"))).toFixed(0);
    }
    await correspondentPortalPage.Close_ButtonCommitment_List.click();
  });
});
