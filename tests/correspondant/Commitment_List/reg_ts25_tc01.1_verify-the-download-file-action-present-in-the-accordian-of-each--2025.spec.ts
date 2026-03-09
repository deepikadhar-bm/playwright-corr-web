// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { runPrereq_2021 } from '../../../src/helpers/prereqs/prereq-2021';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_2021(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
  });

  test('REG_TS25_TC01.1_Verify the download file action present in the accordian of each commitment, It should display the proper committed loan details', async ({ page }) => {

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
          for (let dataIdx = parseInt(vars["tdpcount"]); dataIdx <= parseInt(vars["tdpcount"]); dataIdx++) {
            if (String(testData["HeaderName"]) === String("Commitment Amount:")) {
              vars["CountofCama"] = String((String(vars["ChaseInfo"]).split(",").length - 1));
              vars["count1"] = "1";
              while (parseFloat(String(vars["count1"])) < parseFloat(String(vars["CountofCama"]))) {
                vars["SplitIndex"] = (parseFloat(String(vars["SplitIndex"])) + parseFloat(String("1"))).toFixed(0);
                vars["SplitHeaderCount"] = (parseFloat(String(vars["SplitHeaderCount"])) + parseFloat(String("1"))).toFixed(0);
                vars["IndividualValueExcel2"] = String(vars["EntireRowDataExcel"]).split(",")[parseInt(String(vars["SplitIndex"]))] || '';
                vars["IndividualValueExcel"] = String(vars["IndividualValueExcel"]) + "," + String(vars["IndividualValueExcel2"]);
                vars["count1"] = (parseFloat(String(vars["count1"])) + parseFloat(String("1"))).toFixed(0);
              }
            }
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
    vars["Count"] = "1";
    for (let dataIdx = parseInt(vars["Count"]); dataIdx <= 13; dataIdx++) {
      vars["IndividualHeaderNameExcel"] = String(vars["EntireRowDataHeaderNamesExcel"]).split(",")[parseInt(String(vars["Count"]))] || '';
      expect(String(vars["IndividualHeaderNameExcel"])).toBe(testData["HeaderName"]);
      vars["Count"] = (parseFloat(String(vars["Count"])) + parseFloat(String("1"))).toFixed(0);
    }
    await correspondentPortalPage.Close_ButtonCommitment_List.click();
    await priceOfferedPage.Commitment_IDCommitment_List_Page_New.waitFor({ state: 'visible' });
    await priceOfferedPage.Commitment_IDCommitment_List_Page_New.click();
    await bidRequestDetailsPage.Last_Name_Sort_Button.waitFor({ state: 'visible' });
    await commitmentListPage.Chase_Loan_Button.click();
    await correspondentPortalPage.Header_Sort_Down.waitFor({ state: 'visible' });
    await stepGroups.stepGroup_Verification_of_Loan_Level_Pricing_Details(page, vars);
  });
});
