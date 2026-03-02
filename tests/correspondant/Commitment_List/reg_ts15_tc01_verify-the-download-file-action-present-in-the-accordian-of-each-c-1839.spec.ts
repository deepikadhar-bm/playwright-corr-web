// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as excelHelper from '../../../src/helpers/excel-helpers';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS15_TC01_Verify the download file action present in the accordian of each commitment, It should display the proper committed laons details', async ({ page }) => {
    // Set up download handler
    page.on('download', async (download) => {
      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      await download.saveAs(filePath);
      vars['_lastDownloadPath'] = filePath;
    });

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["BidReqId"] = await commitmentListPage.First_Bid_Req_IDCommitment_List.textContent() || '';
    vars["BidReqId"] = String(vars["BidReqId"]).trim();
    await commitmentListPage.First_Commitment_IDCommitment_List.click();
    await commitmentListPage.Total_Committed_Loans_Tab.waitFor({ state: 'visible' });
    await commitmentListPage.Total_Committed_Loans_Tab.click();
    await priceOfferedPage.Download_File.waitFor({ state: 'visible' });
    vars["CommitmentID"] = await priceOfferedPage.Commit_IDCommitment_List.textContent() || '';
    await priceOfferedPage.Download_File.click();
    vars["space"] = "key_blank";
    vars["DateAndTimeFormat"] = "MM/dd/yyyy" + vars["space"] + "HH:mm";
    vars["CurrentDateAndTime"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
      const fmt = "DateAndTimeFormat";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    vars["ExpectedReportGenTime"] = vars["CurrentDateAndTime"] + vars["space"] + "ET";
    vars[""] = vars['_lastDownloadPath'] ? require('path').basename(vars['_lastDownloadPath']) : '';
    vars["ExpectedDownloadedFileName"] = "commitment_" + vars["CommitmentID"];
    expect(String(vars["ActualDownloadedFileName"])).toBe(vars["ExpectedDownloadedFileName"]);
    vars["RecentDownloadedFilePath"] = vars['_lastDownloadPath'] || '';
    vars["TotalLoansRowsCountUI"] = String(await commitmentListPage.First_Commitment_Rows.count());
    vars["AllLoansRowsCountExcel"] = String(excelHelper.getRowCount(vars["RecentDownloadedFilePath"], "0"));
    expect(String(vars["TotalLoansRowsCountUI"])).toBe(vars["AllLoansRowsCountExcel"]);
    vars["HeaderNamesAllCommitmentLoansExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "0", "1");
    vars["HeaderNamesAllCommitmentLoansExcel"] = String(vars["HeaderNamesAllCommitmentLoansExcel"]).replace(/\./g, '');
    vars["CountofHeaderNamesUI"] = String(await commitmentListPage.Headers_UIFirst_Commitment.count());
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountofHeaderNamesUI"]))) {
      vars["IndividualHeaderNameCommittedLoansUI"] = await priceOfferedPage.Individual_Header_Name_UI.textContent() || '';
      if (String(vars["IndividualHeaderNameCommittedLoansUI"]).includes(String("."))) {
        vars["IndividualHeaderNameCommittedLoansUI"] = String(vars["IndividualHeaderNameCommittedLoansUI"]).replace(/\./g, '');
      }
      vars["IndividualHeaderNameCommittedLoansUI"] = String(vars["IndividualHeaderNameCommittedLoansUI"]).trim();
      vars["IndividualHeaderNameAllCommitmentsLoansExcel"] = String(vars["HeaderNamesAllCommitmentLoansExcel"]).split(",")[parseInt(String(vars["count"]))] || '';
      vars["IndividualHeaderNameAllCommitmentsLoansExcel"] = String(vars["IndividualHeaderNameAllCommitmentsLoansExcel"]).trim();
      if (String(vars["IndividualHeaderNameCommittedLoansUI"]) === String("LoanAmount")) {
        expect(String(vars["IndividualHeaderNameAllCommitmentsLoansExcel"])).toBe("LoanAmt");
      } else if (String(vars["IndividualHeaderNameCommittedLoansUI"]) === String("CurrMarketValue")) {
        expect(String(vars["IndividualHeaderNameAllCommitmentsLoansExcel"])).toBe("CurrentMarketValue");
      } else {
        expect(String(vars["IndividualHeaderNameCommittedLoansUI"])).toBe(vars["IndividualHeaderNameAllCommitmentsLoansExcel"]);
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    vars["TotalRowsCountUIFirstCommitment"] = String(await commitmentListPage.Total_Rows_Count_UIFirst_Commitment.count());
    await bidRequestDetailsPage.Last_Name_Sort_Button.click();
    await priceOfferedPage.Last_Name_Down_ArrowDetails.waitFor({ state: 'visible' });
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalRowsCountUIFirstCommitment"]))) {
      await priceOfferedPage.BidRequestIDTextDetails.click();
      vars["EntireRowDataAllCommitmentLoansExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', vars["count"], "1");
      vars["ColumnCountUITotalCommittedLoans"] = String(await commitmentListPage.Column_Count_UICommitted_Loans.count());
      vars["Count"] = "1";
      while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["ColumnCountUITotalCommittedLoans"]))) {
        vars["IndividualCellDataTotalCommittedLoansUI"] = await commitmentListPage.Individual_Cell_DataCommitted_Loans.textContent() || '';
        if (String(vars["IndividualCellDataTotalCommittedLoansUI"]).includes(String("$"))) {
          vars["IndividualCellDataTotalCommittedLoansUI"] = String(vars["IndividualCellDataTotalCommittedLoansUI"]).replace(/\$\,/g, '');
        } else if (String(vars["IndividualCellDataTotalCommittedLoansUI"]).includes(String("| PQ | PS"))) {
          vars["IndividualCellDataTotalCommittedLoansUI"] = String(vars["IndividualCellDataTotalCommittedLoansUI"]).substring(0, String(vars["IndividualCellDataTotalCommittedLoansUI"]).length - 10);
        } else if (String(vars["IndividualCellDataTotalCommittedLoansUI"]).includes(String("%"))) {
          vars["IndividualCellDataTotalCommittedLoansUI"] = String(vars["IndividualCellDataTotalCommittedLoansUI"]).replace(/%/g, '');
        }
        vars["IndividualCellDataTotalCommittedLoansUI"] = String(vars["IndividualCellDataTotalCommittedLoansUI"]).trim();
        vars["IndividualRowDataAllCommitmentLoansExcel"] = String(vars["EntireRowDataAllCommitmentLoansExcel"]).split(",")[parseInt(String(vars["Count"]))] || '';
        expect(String(vars["IndividualCellDataTotalCommittedLoansUI"])).toBe(vars["IndividualRowDataAllCommitmentLoansExcel"]);
        vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    vars["EntireRowDataExcelMetaInfo1"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "0", "2");
    vars["BidReqNumTextExcelMetaInfo"] = String(vars["EntireRowDataExcelMetaInfo1"]).split(",")["1"] || '';
    expect(String(vars["BidReqNumTextExcelMetaInfo"])).toBe("BID REQUEST NUMBER");
    vars["BidReqIdExcelMetaInfo"] = String(vars["EntireRowDataExcelMetaInfo1"]).split(",")["2"] || '';
    expect(String(vars["BidReqIdExcelMetaInfo"])).toBe(vars["BidReqId"]);
    vars["EntireRowDataExcelMetaInfo2"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "1", "2");
    vars["CommitmentOrderNumTextExcelMetaInfo"] = String(vars["EntireRowDataExcelMetaInfo2"]).split(",")["1"] || '';
    expect(String(vars["CommitmentOrderNumTextExcelMetaInfo"])).toBe("COMMIT ORDER NUMBER");
    vars["CommitmentIdExcelMetaInfo"] = String(vars["EntireRowDataExcelMetaInfo2"]).split(",")["2"] || '';
    expect(String(vars["CommitmentIdExcelMetaInfo"])).toBe(vars["CommitmentID"]);
    vars["EntireRowDataExcelMetaInfo3"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "2", "2");
    vars["ReportGenerationTextExcelMetaInfo"] = String(vars["EntireRowDataExcelMetaInfo3"]).split(",")["1"] || '';
    expect(String(vars["ReportGenerationTextExcelMetaInfo"])).toBe("REPORT GENERATION TIME");
    vars["ReportGenTimeExcelMetaInfo"] = String(vars["EntireRowDataExcelMetaInfo3"]).split(",")["2"] || '';
    expect(String(vars["ExpectedReportGenTime"])).toBe(vars["ReportGenTimeExcelMetaInfo"]);
  });
});
