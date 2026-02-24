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

  test('REG_TS16_TC01_Verify the download file action and it should contain the all loans and locked loans information as present in the UI', async ({ page }) => {
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
    await commitmentListPage.Total_LoansCommitment_List.waitFor({ state: 'visible' });
    await commitmentListPage.Total_LoansCommitment_List.click();
    await priceOfferedPage.Download_File.waitFor({ state: 'visible' });
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
    vars["ExpectedDownloadedFileName"] = "Price_Offer_details_" + vars["BidReqId"];
    expect(String(vars["ActualDownloadedFileName"])).toBe(vars["ExpectedDownloadedFileName"]);
    vars["RecentDownloadedFilePath"] = vars['_lastDownloadPath'] || '';
    vars["TotalLoansRowsCountUI"] = String(await priceOfferedPage.Row_Count_UI.count());
    vars["AllLoansRowsCountExcel"] = String(excelHelper.getRowCount(vars["RecentDownloadedFilePath"], "0"));
    expect(String(vars["TotalLoansRowsCountUI"])).toBe(vars["AllLoansRowsCountExcel"]);
    vars["HeaderNamesAllLoansExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "0", "1");
    vars["HeaderNamesAllLoansExcel"] = String(vars["HeaderNamesAllLoansExcel"]).replace(/\./g, '');
    vars["CountofHeaderNamesUI"] = String(await commitmentListPage.Headers_Names_UICommitment_List.count());
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountofHeaderNamesUI"]))) {
      vars["IndividualHeaderNameTotalLoansUI"] = await commitmentListPage.Individual_Header_Names_UICommitment_List.textContent() || '';
      if (String(vars["IndividualHeaderNameTotalLoansUI"]).includes(String("."))) {
        vars["IndividualHeaderNameTotalLoansUI"] = String(vars["IndividualHeaderNameTotalLoansUI"]).replace(/\./g, '');
      }
      vars["IndividualHeaderNameTotalLoansUI"] = String(vars["IndividualHeaderNameTotalLoansUI"]).trim();
      vars["IndividualHeaderNameAllLoansExcel"] = String(vars["HeaderNamesAllLoansExcel"]).split(",")[parseInt(String(vars["count"]))] || '';
      vars["IndividualHeaderNameAllLoansExcel"] = String(vars["IndividualHeaderNameAllLoansExcel"]).trim();
      if (String(vars["IndividualHeaderNameTotalLoansUI"]) === String("LoanAmount")) {
        expect(String(vars["IndividualHeaderNameAllLoansExcel"])).toBe("LoanAmt");
      } else {
        expect(String(vars["IndividualHeaderNameTotalLoansUI"])).toBe(vars["IndividualHeaderNameAllLoansExcel"]);
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    vars["TotalRowsCountUITotalLoans"] = String(await priceOfferedPage.Total_Rows_Count_UIDetails.count());
    await bidRequestDetailsPage.Last_Name_Sort_Button.click();
    await priceOfferedPage.Last_Name_Down_ArrowDetails.waitFor({ state: 'visible' });
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalRowsCountUITotalLoans"]))) {
      vars["EntireRowDataAllLoansExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', vars["count"], "1");
      await priceOfferedPage.BidRequestIDTextDetails.click();
      vars["ColumnCountUITotalLoans"] = String(await commitmentListPage.Column_Count_UICommitment_List.count());
      vars["Count"] = "1";
      while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["ColumnCountUITotalLoans"]))) {
        vars["IndividualCellDataTotalLoansUI"] = await commitmentListPage.Individual_Cell_Data_UITotal_Loans_Tab.textContent() || '';
        if (String(vars["IndividualCellDataTotalLoansUI"]).includes(String("$"))) {
          vars["IndividualCellDataTotalLoansUI"] = String(vars["IndividualCellDataTotalLoansUI"]).replace(/\$\,/g, '');
        } else if (String(vars["IndividualCellDataTotalLoansUI"]).includes(String("| PQ | PS"))) {
          vars["IndividualCellDataTotalLoansUI"] = String(vars["IndividualCellDataTotalLoansUI"]).substring(0, String(vars["IndividualCellDataTotalLoansUI"]).length - 10);
        } else if (String(vars["IndividualCellDataTotalLoansUI"]).includes(String("%"))) {
          vars["IndividualCellDataTotalLoansUI"] = String(vars["IndividualCellDataTotalLoansUI"]).replace(/%/g, '');
        }
        vars["IndividualCellDataTotalLoansUI"] = String(vars["IndividualCellDataTotalLoansUI"]).trim();
        vars["IndividualRowDataAllLoansExcel"] = String(vars["EntireRowDataAllLoansExcel"]).split(",")[parseInt(String(vars["Count"]))] || '';
        expect(String(vars["IndividualCellDataTotalLoansUI"])).toBe(vars["IndividualRowDataAllLoansExcel"]);
        vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    await stepGroups.stepGroup_Verifying_Header_Names_From_UI_to_ExcelCommitment_List(page, vars);
    await stepGroups.stepGroup_Verifying_Locked_Loans_Data_UI_to_ExcelCommitment_List(page, vars);
    vars["EntireRowDataExcelMetaInfo1"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "0", "3");
    vars["BidReqNumTextExcelMetaInfo"] = String(vars["EntireRowDataExcelMetaInfo1"]).split(",")["1"] || '';
    expect(String(vars["BidReqNumTextExcelMetaInfo"])).toBe("BID REQUEST NUMBER");
    vars["BidReqIdExcelMetaInfo"] = String(vars["EntireRowDataExcelMetaInfo1"]).split(",")["2"] || '';
    expect(String(vars["BidReqIdExcelMetaInfo"])).toBe(vars["BidReqId"]);
    vars["EntireRowDataExcelMetaInfo2"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "1", "3");
    vars["ReportGenerationTextExcelMetaInfo"] = String(vars["EntireRowDataExcelMetaInfo2"]).split(",")["1"] || '';
    expect(String(vars["ReportGenerationTextExcelMetaInfo"])).toBe("REPORT GENERATION TIME");
    vars["ReportGenTimeExcelMetaInfo"] = String(vars["EntireRowDataExcelMetaInfo2"]).split(",")["2"] || '';
    expect(String(vars["ExpectedReportGenTime"])).toBe(vars["ReportGenTimeExcelMetaInfo"]);
  });
});
