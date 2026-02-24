import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import path from 'path';
import { CommitmentListPage } from '../../pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { runPrereq_1873 } from './prereq-1873';
import * as excelHelper from '../excel-helpers';

export async function runPrereq_1909(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1873(page, vars);

  const commitmentListPage = new CommitmentListPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);



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

  vars["CommitmentLetterHeaderExcelPart1"] = excelHelper.readCell(vars["FilePath"], "3", "0", "0");
  expect(String(vars["CommitmentLetterHeaderExcelPart1"])).toBe("Correspondent Name (Ccode):");
  vars["CommitmentLetterDataExcelPart1"] = excelHelper.readCell(vars["FilePath"], "3", "1", "0");
  expect(String(vars["CommitmentLetterDataExcelPart1"])).toBe(vars["CompanyNameWithCCodeUI"]);
  vars["CommitmentLetterHeaderExcelPart1"] = excelHelper.readCell(vars["FilePath"], "3", "3", "0");
  expect(String(vars["CommitmentLetterHeaderExcelPart1"])).toBe("User Name:");
  vars["CommitmentLetterDataExcelPart1"] = excelHelper.readCell(vars["FilePath"], "3", "4", "0");
  expect(String(vars["CommitmentLetterDataExcelPart1"])).toBe("Chase Correspondent");
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
    await commitmentListPage.Download_File_TextPopup.click();
    if (String(vars["SplitCount"]) === String("14")) {
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
      vars["Null"] = vars["IndividualColumnDataExcel"];
    }
    expect(String(testData["LoanDetails(Loan Level Details)"])).toBe(vars["IndividualColumnDataExcel"]);
    vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
    vars["SplitCount"] = (parseFloat(String(vars["SplitCount"])) + parseFloat(String("1"))).toFixed(0);
  }
  await correspondentPortalPage.Close_ButtonCommitment_List.click();
}
