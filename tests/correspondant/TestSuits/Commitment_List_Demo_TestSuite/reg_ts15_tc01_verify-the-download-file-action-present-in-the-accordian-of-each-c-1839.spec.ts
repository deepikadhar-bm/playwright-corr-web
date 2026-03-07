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

  test('REG_TS15_TC01_Verify download file and committed loans details', async ({ page }) => {
    vars['DownloadDir'] = path.join(process.cwd(), 'downloads');
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);

    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });

    vars["BidReqId"] = (await commitmentListPage.First_Bid_Req_IDCommitment_List.first().textContent() || '');
    Methods.trimtestdata(vars["BidReqId"], "BidReqId");

    await commitmentListPage.First_Commitment_IDCommitment_List.first().click();
    await commitmentListPage.Total_Committed_Loans_Tab.waitFor({ state: 'visible' });
    await commitmentListPage.Total_Committed_Loans_Tab.click();

    await priceOfferedPage.Download_File.first().waitFor({ state: 'visible' });

    vars["CommitmentID"] = (await priceOfferedPage.Commit_IDCommitment_List.first().textContent() || '');
    Methods.trimtestdata(vars["CommitmentID"], "CommitmentID");
    Methods.concatenate('commitment_', vars['CommitmentID'], 'ExpectedFileName');
    Methods.getCurrentTimestamp('dd-MM-yyyy HH-mm-ss','TimeStamp','Asia/Kolkata');

    const [download] = await Promise.all([page.waitForEvent('download'), priceOfferedPage.Download_File.first().click()]);
    log.info("File was downloaded successfully")
    Methods.getCurrentTimestamp('MM/dd/yyyy HH:mm', 'CurresntEstDateAndTime', 'America/New_York');
    Methods.concatenateWithSpace(vars["CurresntEstDateAndTime"], "ET", "ExpectedReportGenTime");
    vars['SavedFileName'] = vars['TimeStamp'] + '_' + download.suggestedFilename();
    vars['FilePathTotalCommittedLoans'] = path.join(vars['DownloadDir'], vars['SavedFileName']);
    await download.saveAs(vars['FilePathTotalCommittedLoans']);
    expect(vars['SavedFileName']).toContain(vars['ExpectedFileName']);
    log.info(vars['SavedFileName'] + "conains" + vars['ExpectedFileName'])

    // Validate Row Count UI
    vars["TotalLoansRowsCountUI"] = String(await commitmentListPage.First_Commitment_Rows.count());
    console.log("Rows Count UI:", vars["TotalLoansRowsCountUI"]);
    //storing Excel rows Count
    vars["AllLoansRowsCountExcel"] = String(excelHelper.getAllRowCount(vars["FilePathTotalCommittedLoans"], 0));
    console.log("RowsCountExcel:", vars["AllLoansRowsCountExcel"]);
    expect(vars["TotalLoansRowsCountUI"]).toBe(vars["AllLoansRowsCountExcel"]);

    // HEADER VALIDATION
    log.info("Headers verification UI to excel")
    vars["HeaderNamesAllCommitmentLoansExcel"] = excelHelper.readEntireRow(vars["FilePathTotalCommittedLoans"], 0,0,"HeaderNamesAllCommitmentLoansExcel");
    console.log("HeaderNamesAllCommitmentLoansExcel:", vars["HeaderNamesAllCommitmentLoansExcel"]);
    Methods.removeSpecialChar(".", vars["HeaderNamesAllCommitmentLoansExcel"], "HeaderNamesAllCommitmentLoansExcel");
    console.log("HeaderNamesAllCommitmentLoansExcel:", vars["HeaderNamesAllCommitmentLoansExcel"]);
    vars["CountofHeaderNamesUI"] = String(await commitmentListPage.Headers_UIFirst_Commitment.count());
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountofHeaderNamesUI"]))) {
      vars["IndividualHeaderNameCommittedLoansUI"] = await priceOfferedPage.Individual_Header_Name_UI(vars["count"]).textContent() || '';
      if (String(vars["IndividualHeaderNameCommittedLoansUI"]).includes(String("."))) {
        Methods.removeSpecialChar(".", vars["IndividualHeaderNameCommittedLoansUI"],"IndividualHeaderNameCommittedLoansUI");
      }
      Methods.trimWhitespace(vars["IndividualHeaderNameCommittedLoansUI"],"IndividualHeaderNameCommittedLoansUI");
      console.log("IndividualHeaderNameCommittedLoansUI:",vars["IndividualHeaderNameCommittedLoansUI"])
      Methods.splitStringByRegConditionWithPosition(vars["HeaderNamesAllCommitmentLoansExcel"], ",", vars["count"], "IndividualHeaderNameAllCommitmentsLoansExcel");
      console.log("IndividualHeaderNameAllCommitmentsLoansExcel:",vars["IndividualHeaderNameAllCommitmentsLoansExcel"]);
      Methods.trimWhitespace(vars["IndividualHeaderNameAllCommitmentsLoansExcel"],"IndividualHeaderNameAllCommitmentsLoansExcel");
      if (String(vars["IndividualHeaderNameCommittedLoansUI"]) === String("LoanAmount")) {
        expect(String(vars["IndividualHeaderNameAllCommitmentsLoansExcel"])).toBe("LoanAmt");
      } else if (String(vars["IndividualHeaderNameCommittedLoansUI"]) === String("CurrMarketValue")) {
        expect(String(vars["IndividualHeaderNameAllCommitmentsLoansExcel"])).toBe("CurrentMarketValue");
      } else {
        expect(String(vars["IndividualHeaderNameCommittedLoansUI"])).toContain(vars["IndividualHeaderNameAllCommitmentsLoansExcel"]);
        log.info(vars["IndividualHeaderNameCommittedLoansUI"] + " contains " + vars["IndividualHeaderNameAllCommitmentsLoansExcel"]);      }
      // vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
         Methods.MathematicalOperation(vars["count"], "+", "1", "count");
    }
    log.info("verification of UI data to excel data")
    vars["TotalRowsCountUIFirstCommitment"] = String(await commitmentListPage.Total_Rows_Count_UIFirst_Commitment.count());
    await bidRequestDetailsPage.Last_Name_Sort_Button.first().click();
    await priceOfferedPage.Last_Name_Down_ArrowDetails.first().waitFor({ state: 'visible' });
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalRowsCountUIFirstCommitment"]))) {
      await priceOfferedPage.BidRequestIDTextDetails.click();
      vars["ColumnCountUITotalCommittedLoans"] = String(await commitmentListPage.Column_Count_UICommitted_Loans1(vars["count"]).count());
      vars["EntireRowDataAllCommitmentLoansExcel"] = excelHelper.readEntireRow(vars["FilePathTotalCommittedLoans"], 0,vars["count"],"EntireRowDataAllCommitmentLoansExcel");
      vars["Count"] = "1";
      while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["ColumnCountUITotalCommittedLoans"]))) {
        vars["IndividualCellDataTotalCommittedLoansUI"] = await commitmentListPage.Individual_Cell_DataCommitted_Loans1(vars["count"],vars["Count"]).textContent() || '';
        if (String(vars["IndividualCellDataTotalCommittedLoansUI"]).includes(String("$"))) {
            Methods.removeMultipleSpecialChars(['$', ',', ' '], vars["IndividualCellDataTotalCommittedLoansUI"], "IndividualCellDataTotalCommittedLoansUI");

        } else if (String(vars["IndividualCellDataTotalCommittedLoansUI"]).includes(String("| PQ | PS"))) {
          Methods.removeCharactersFromPosition(vars["IndividualCellDataTotalCommittedLoansUI"],"0", "10","IndividualCellDataTotalCommittedLoansUI");
        } else if (String(vars["IndividualCellDataTotalCommittedLoansUI"]).includes(String("%"))) {
          Methods.removeSpecialChar("%",vars["IndividualCellDataTotalCommittedLoansUI"], "IndividualCellDataTotalCommittedLoansUI");
        }
        Methods.trimtestdata(vars["IndividualCellDataTotalCommittedLoansUI"], "IndividualCellDataTotalCommittedLoansUI");
        Methods.splitStringByRegConditionWithPosition(vars["EntireRowDataAllCommitmentLoansExcel"],",",vars["Count"],"IndividualRowDataAllCommitmentLoansExcel");
        console.log("IndividualRowDataAllCommitmentLoansExcel:",vars["IndividualRowDataAllCommitmentLoansExcel"]);
        expect(String(vars["IndividualCellDataTotalCommittedLoansUI"])).toContain(vars["IndividualRowDataAllCommitmentLoansExcel"]);
        log.info(vars["IndividualCellDataTotalCommittedLoansUI"] + " contains " + vars["IndividualRowDataAllCommitmentLoansExcel"]);      
        // vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
        Methods.MathematicalOperation(vars["Count"], "+", "1", "Count");
      }
      // vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
      Methods.MathematicalOperation(vars["count"], "+", "1", "count");
    }
    log.info("verification of UI data to excel data")
    vars["EntireRowDataExcelMetaInfo1"] = excelHelper.readEntireRow(vars["FilePathTotalCommittedLoans"], 1,0,"EntireRowDataExcelMetaInfo1");
    Methods.splitStringByRegConditionWithPosition(vars["EntireRowDataExcelMetaInfo1"],",",1,"BidReqNumTextExcelMetaInfo");
    expect(String(vars["BidReqNumTextExcelMetaInfo"])).toBe("BID REQUEST NUMBER");
    Methods.splitStringByRegConditionWithPosition(vars["EntireRowDataExcelMetaInfo1"],",",2,"BidReqIdExcelMetaInfo");
    expect(String(vars["BidReqIdExcelMetaInfo"])).toBe(vars["BidReqId"]);
    vars["EntireRowDataExcelMetaInfo2"] = excelHelper.readEntireRow(vars["FilePathTotalCommittedLoans"], 1,1,"EntireRowDataExcelMetaInfo2");
    Methods.splitStringByRegConditionWithPosition(vars["EntireRowDataExcelMetaInfo2"],",",1,"CommitmentOrderNumTextExcelMetaInfo");
    expect(String(vars["CommitmentOrderNumTextExcelMetaInfo"])).toBe("COMMIT ORDER NUMBER");
    Methods.splitStringByRegConditionWithPosition(vars["EntireRowDataExcelMetaInfo2"],",",2,"CommitmentIdExcelMetaInfo");
    expect(String(vars["CommitmentIdExcelMetaInfo"])).toBe(vars["CommitmentID"]);
    vars["EntireRowDataExcelMetaInfo3"] = excelHelper.readEntireRow(vars["FilePathTotalCommittedLoans"], 1,2,"EntireRowDataExcelMetaInfo3");
    Methods.splitStringByRegConditionWithPosition(vars["EntireRowDataExcelMetaInfo3"],",",1,"ReportGenerationTextExcelMetaInfo");
    expect(String(vars["ReportGenerationTextExcelMetaInfo"])).toBe("REPORT GENERATION TIME");
    Methods.splitStringByRegConditionWithPosition(vars["EntireRowDataExcelMetaInfo3"],",",2,"ReportGenTimeExcelMetaInfo");
    expect(String(vars["ExpectedReportGenTime"])).toBe(vars["ReportGenTimeExcelMetaInfo"]);
    log.info("Successfully completed testcase-TS15_TC01")
  });
});
});