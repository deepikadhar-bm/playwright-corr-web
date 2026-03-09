// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { runPrereq_1913 } from '../../../src/helpers/prereqs/prereq-1913';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1913(page, vars);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
  });

  test('REG_TS14_TC02.1_Perform add to commit action and verify that latest commitment letter should be displayed with the latest value', async ({ page }) => {

    // Set up download handler
    page.on('download', async (download) => {
      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      await download.saveAs(filePath);
      vars['_lastDownloadPath'] = filePath;
    });

    const testData: Record<string, string> = {
  "HeaderName": "Commitment Number:",
  "ChaseInfo": "87EP7DBB"
} // Profile: "Cover Letter Details", row 0;

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
    vars["LoanNumberExcel"] = excelHelper.readCell(vars["FilePath"], "2", "3", "1");
    expect(String(vars["LoanNumberExcel"])).toBe(vars["CommittedCorrLoan"]);
    await correspondentPortalPage.Close_ButtonCommitment_List.click();
  });
});
