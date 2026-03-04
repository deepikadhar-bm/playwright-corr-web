import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../../src/pages/correspondant/bid-request-details';
import { CommitmentListPage } from '../../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../../src/pages/correspondant/spinner';
import * as excelHelper from '../../../../src/helpers/excel-helpers';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
test.describe('Commitment List Suite', () => {
  test.describe('Commitment List - TS_1', () => {
    let vars: Record<string, string> = {};
    let bidRequestDetailsPage: BidRequestDetailsPage;
    let commitmentListPage: CommitmentListPage;
    let correspondentPortalPage: CorrespondentPortalPage;
    let priceOfferedPage: PriceOfferedPage;
    let spinnerPage: SpinnerPage;
    let Methods: AddonHelpers;

    test.beforeEach(async ({ page }) => {
      vars = {};
      bidRequestDetailsPage = new BidRequestDetailsPage(page);
      commitmentListPage = new CommitmentListPage(page);
      correspondentPortalPage = new CorrespondentPortalPage(page);
      priceOfferedPage = new PriceOfferedPage(page);
      spinnerPage = new SpinnerPage(page);
      Methods = new AddonHelpers(page, vars);
    });

    test('REG_TS16_TC01_Verify the download file action and it should contain the all loans and locked loans information as present in the UI', async ({ page }) => {
      vars['DownloadDir'] = path.join(process.cwd(), 'downloads');
      await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
      await correspondentPortalPage.Commitments_Side_Menu.click();
      await commitmentListPage.Committed_List_Dropdown.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      vars["BidReqId"] = await commitmentListPage.First_Bid_Req_IDCommitment_List.first().textContent() || '';
      Methods.trimtestdata(vars["BidReqId"], "BidReqId");
      await commitmentListPage.First_Commitment_IDCommitment_List.first().click();
      await commitmentListPage.Total_LoansCommitment_List.waitFor({ state: 'visible' });
      await commitmentListPage.Total_LoansCommitment_List.click();
      await priceOfferedPage.Download_File.waitFor({ state: 'visible' });
      Methods.concatenate('Price_Offer_details_', vars['BidReqId'], 'ExpectedFileName');
      Methods.getCurrentTimestamp('dd-MM-yyyy HH-mm-ss', 'TimeStamp', 'Asia/Kolkata');
      const [download] = await Promise.all([page.waitForEvent('download'), priceOfferedPage.Download_File.click()]);
      log.info("File was downloaded successfully")
      Methods.getCurrentTimestamp('MM/dd/yyyy HH:mm', 'CurresntEstDateAndTime', 'America/New_York');
      Methods.concatenateWithSpace(vars["CurresntEstDateAndTime"], "ET", "ExpectedReportGenTime");
      vars['SavedFileName'] = vars['TimeStamp'] + '_' + download.suggestedFilename();
      vars['FilePathTotalLoans'] = path.join(vars['DownloadDir'], vars['SavedFileName']);
      await download.saveAs(vars['FilePathTotalLoans']);
      expect(vars['SavedFileName']).toContain(vars['ExpectedFileName']);
      log.info(vars['SavedFileName'] +"contains" + vars['ExpectedFileName1'])
      vars["TotalLoansRowsCountUI"] = String(await priceOfferedPage.Row_Count_UI.count());
      console.log("Rows Count UI:", vars["TotalLoansRowsCountUI"]);
      //storing Excel rows Count
      vars["AllLoansRowsCountExcel"] = String(excelHelper.getAllRowCount(vars["FilePathTotalLoans"], 0));
      console.log("RowsCountExcel:", vars["AllLoansRowsCountExcel"]);
      expect(vars["TotalLoansRowsCountUI"]).toBe(vars["AllLoansRowsCountExcel"]);
      log.info("Headers verification UI to excel")
      vars["HeaderNamesTotalLoansExcel"] = excelHelper.readEntireRow(vars["FilePathTotalLoans"], 0, 0, "HeaderNamesTotalLoansExcel");
      Methods.removeSpecialChar(".", vars["HeaderNamesTotalLoansExcel"], "HeaderNamesTotalLoansExcel");
      vars["CountofHeaderNamesUI"] = String(await commitmentListPage.Headers_Names_UICommitment_List.count());
      vars["count"] = "1";
      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountofHeaderNamesUI"]))) {
        vars["IndividualHeaderNameTotalLoansUI"] = await commitmentListPage.Individual_Header_Names_UICommitment_List(vars["count"]).textContent() || '';
        if (String(vars["IndividualHeaderNameTotalLoansUI"]).includes(String("."))) {
          Methods.removeSpecialChar(".", vars["IndividualHeaderNameTotalLoansUI"], "IndividualHeaderNameTotalLoansUI");
        }
        Methods.trimWhitespace(vars["IndividualHeaderNameTotalLoansUI"], "IndividualHeaderNameTotalLoansUI");
        Methods.splitStringByRegConditionWithPosition(vars["HeaderNamesTotalLoansExcel"], ",", vars["count"], "IndividualHeaderNameTotalLoansExcel");
        Methods.trimWhitespace(vars["IndividualHeaderNameTotalLoansExcel"], "IndividualHeaderNameTotalLoansExcel");
        if (String(vars["IndividualHeaderNameTotalLoansUI"]) === String("LoanAmount")) {
          expect(String(vars["IndividualHeaderNameTotalLoansExcel"])).toBe("LoanAmt");
        } else {
          expect(String(vars["IndividualHeaderNameTotalLoansUI"])).toContain(vars["IndividualHeaderNameTotalLoansExcel"]);
          log.info(vars["IndividualHeaderNameTotalLoansUI"] + " contains " + vars["IndividualHeaderNameTotalLoansExcel"]);
        }
        // vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
        Methods.MathematicalOperation(vars["count"], "+", "1", "count");
      }
      console.log("UI Data verification of Total Loans Excel");
      vars["TotalRowsCountUITotalLoans"] = String(await priceOfferedPage.Total_Rows_Count_UIDetails.count());
      await bidRequestDetailsPage.Last_Name_Sort_Button.click();
      await priceOfferedPage.Last_Name_Down_ArrowDetails.waitFor({ state: 'visible' });
      vars["count"] = "1";
      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalRowsCountUITotalLoans"]))) {
        vars["EntireRowDataTotalLoansExcel"] = excelHelper.readEntireRow(vars["FilePathTotalLoans"], 0, vars["count"], "EntireRowDataTotalLoansExcel");
        await priceOfferedPage.BidRequestIDTextDetails.click();
        vars["ColumnCountUITotalLoans"] = String(await commitmentListPage.Column_Count_UICommitment_List(vars["count"]).count());
        vars["Count"] = "1";
        while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["ColumnCountUITotalLoans"]))) {
          vars["IndividualCellDataTotalLoansUI"] = await commitmentListPage.Individual_Cell_Data_UITotal_Loans_Tab(vars["count"], vars["Count"]).textContent() || '';
          if (String(vars["IndividualCellDataTotalLoansUI"]).includes(String("$"))) {
            Methods.removeMultipleSpecialChars(['$', ',', ' '], vars["IndividualCellDataTotalLoansUI"], "IndividualCellDataTotalLoansUI");
          } else if (String(vars["IndividualCellDataTotalLoansUI"]).includes(String("| PQ | PS"))) {
            Methods.removeCharactersFromPosition(vars["IndividualCellDataTotalLoansUI"], "0", "10", "IndividualCellDataTotalLoansUI");
          } else if (String(vars["IndividualCellDataTotalLoansUI"]).includes(String("%"))) {
            Methods.removeSpecialChar("%", vars["IndividualCellDataTotalLoansUI"], "IndividualCellDataTotalLoansUI");
          }
          Methods.trimtestdata(vars["IndividualCellDataTotalLoansUI"], "IndividualCellDataTotalLoansUI");
          Methods.splitStringByRegConditionWithPosition(vars["EntireRowDataTotalLoansExcel"], ",", vars["Count"], "IndividualRowDataTotalLoansExcel");
          expect(String(vars["IndividualCellDataTotalLoansUI"])).toContain(vars["IndividualRowDataTotalLoansExcel"]);
          log.info(vars["IndividualCellDataTotalLoansUI"] + " contains " + vars["IndividualRowDataTotalLoansExcel"]);
          // vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
          Methods.MathematicalOperation(vars["Count"], "+", "1", "Count");
        }
        // vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
        Methods.MathematicalOperation(vars["count"], "+", "1", "count");
      }
      // console.log("Headers verification of Locked Loans Excel");
      log.info("Headers verification of Locked Loans Excel")
      await stepGroups.stepGroup_Verifying_Header_Names_From_UI_to_ExcelCommitment_List(page, vars);
      log.info("UI Data verification of Locked Loans Excel")
      await stepGroups.stepGroup_Verifying_Locked_Loans_Data_UI_to_Excel_CommitmentList(page, vars);
      log.info("MetaInfo verification of Excel");
      vars["EntireRowDataExcelMetaInfo1"] = excelHelper.readEntireRow(vars["FilePathTotalLoans"], 2, 0, "EntireRowDataExcelMetaInfo1");
      Methods.splitStringByRegConditionWithPosition(vars["EntireRowDataExcelMetaInfo1"], ",", 1, "BidReqNumTextExcelMetaInfo");
      expect(String(vars["BidReqNumTextExcelMetaInfo"])).toBe("BID REQUEST NUMBER");
      Methods.splitStringByRegConditionWithPosition(vars["EntireRowDataExcelMetaInfo1"], ",", 2, "BidReqIdExcelMetaInfo");
      expect(String(vars["BidReqIdExcelMetaInfo"])).toBe(vars["BidReqId"]);
      vars["EntireRowDataExcelMetaInfo3"] = excelHelper.readEntireRow(vars["FilePathTotalLoans"], 2, 1, "EntireRowDataExcelMetaInfo3");
      Methods.splitStringByRegConditionWithPosition(vars["EntireRowDataExcelMetaInfo3"], ",", 1, "ReportGenerationTextExcelMetaInfo");
      expect(String(vars["ReportGenerationTextExcelMetaInfo"])).toBe("REPORT GENERATION TIME");
      Methods.splitStringByRegConditionWithPosition(vars["EntireRowDataExcelMetaInfo3"], ",", 2, "ReportGenTimeExcelMetaInfo");
      expect(String(vars["ExpectedReportGenTime"])).toBe(vars["ReportGenTimeExcelMetaInfo"]);
      log.info("Successfully completed testcase-TS16_TC01")
    });
  });
});
