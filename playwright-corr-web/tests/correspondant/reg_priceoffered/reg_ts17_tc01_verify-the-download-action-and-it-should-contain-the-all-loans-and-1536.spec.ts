// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { runPrereq_1394 } from '../../../src/helpers/prereqs/prereq-1394';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1394(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS17_TC01_Verify the download action and it should contain the all loans and locked loans information as present in the UI', async ({ page }) => {

    // Set up download handler
    page.on('download', async (download) => {
      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      await download.saveAs(filePath);
      vars['_lastDownloadPath'] = filePath;
    });

    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["BidReqID"] = vars["RequestIDDetails"];
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqID"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Commits_an_Fresh_Loan_Num_Chase_Direct(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.clear();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqID"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await chaseFieldNamePage._872E288C12E7.click();
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
    vars["ExpectedDownloadedFileName"] = "Price_Offer_details_" + vars["BidReqID"];
    expect(String(vars["ActualDownloadedFileName"])).toBe(vars["ExpectedDownloadedFileName"]);
    vars["RecentDownloadedFilePath"] = vars['_lastDownloadPath'] || '';
    vars["AllLoansRowsCountUI"] = String(await priceOfferedPage.Row_Count_UI.count());
    vars["AllLoansRowsCountExcel"] = String(excelHelper.getRowCount(vars["RecentDownloadedFilePath"], "0"));
    expect(String(vars["AllLoansRowsCountUI"])).toBe(vars["AllLoansRowsCountExcel"]);
    vars["HeaderNamesExcelAllLoans"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "0", "1");
    vars["HeaderNamesExcelAllLoans"] = String(vars["HeaderNamesExcelAllLoans"]).replace(/\./g, '');
    vars["CountofHeaderNamesUI"] = String(await priceOfferedPage.Header_Names_UI.count());
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountofHeaderNamesUI"]))) {
      vars["IndividualHeaderNameUIAllLoans"] = await priceOfferedPage.Individual_Header_Name_UI.textContent() || '';
      if (String(vars["IndividualHeaderNameUIAllLoans"]).includes(String("."))) {
        vars["IndividualHeaderNameUIAllLoans"] = String(vars["IndividualHeaderNameUIAllLoans"]).replace(/\./g, '');
      }
      vars["IndividualHeaderNameUIAllLoans"] = String(vars["IndividualHeaderNameUIAllLoans"]).trim();
      vars["IndividualHeaderNameExcelAllLoans"] = String(vars["HeaderNamesExcelAllLoans"]).split(",")[parseInt(String(vars["count"]))] || '';
      vars["IndividualHeaderNameExcelAllLoans"] = String(vars["IndividualHeaderNameExcelAllLoans"]).trim();
      if (String(vars["IndividualHeaderNameUIAllLoans"]) === String("LoanAmount")) {
        expect(String(vars["IndividualHeaderNameExcelAllLoans"])).toBe("LoanAmt");
      } else {
        expect(String(vars["IndividualHeaderNameUIAllLoans"])).toBe(vars["IndividualHeaderNameExcelAllLoans"]);
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    vars["TotalRowsCountUIAllLoans"] = String(await priceOfferedPage.Total_Rows_Count_UIDetails.count());
    await bidRequestDetailsPage.Last_Name_Sort_Button.click();
    await priceOfferedPage.Last_Name_Down_ArrowDetails.waitFor({ state: 'visible' });
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalRowsCountUIAllLoans"]))) {
      await priceOfferedPage.BidRequestIDTextDetails.click();
      vars["EntireRowDataExcelAllLoans"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', vars["count"], "1");
      vars["ColumnCountUIAllLoans"] = String(await priceOfferedPage.Column_Count_UIPrice_Offered_Details.count());
      vars["Count"] = "1";
      while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["ColumnCountUIAllLoans"]))) {
        vars["IndividualCellDataAllLoansUI"] = await priceOfferedPage.Individual_Cell_Data_UI.textContent() || '';
        if (String(vars["IndividualCellDataAllLoansUI"]).includes(String("$"))) {
          vars["IndividualCellDataAllLoansUI"] = String(vars["IndividualCellDataAllLoansUI"]).replace(/\$\,/g, '');
        } else if (String(vars["IndividualCellDataAllLoansUI"]).includes(String("| PQ | PS"))) {
          vars["IndividualCellDataAllLoansUI"] = String(vars["IndividualCellDataAllLoansUI"]).substring(0, String(vars["IndividualCellDataAllLoansUI"]).length - 10);
        } else if (String(vars["IndividualCellDataAllLoansUI"]).includes(String("%"))) {
          vars["IndividualCellDataAllLoansUI"] = String(vars["IndividualCellDataAllLoansUI"]).replace(/%/g, '');
        }
        vars["IndividualCellDataAllLoansUI"] = String(vars["IndividualCellDataAllLoansUI"]).trim();
        vars["IndividualRowDataExcelAllLoans"] = String(vars["EntireRowDataExcelAllLoans"]).split(",")[parseInt(String(vars["Count"]))] || '';
        if (String(vars["IndividualCellDataAllLoansUI"]) === String("-")) {
          expect(String(vars["IndividualRowDataExcelAllLoans"])).toBe("0.000");
        } else {
          expect(String(vars["IndividualCellDataAllLoansUI"])).toBe(vars["IndividualRowDataExcelAllLoans"]);
        }
        vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    await priceOfferedPage.LockedCommitted_Loans.click();
    await page.waitForLoadState('networkidle');
    await expect(priceOfferedPage.Paste_Loans_ButtonPrice_Offered_Page).toBeVisible();
    await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeVisible();
    await stepGroups.stepGroup_Verifying_Header_Names_From_UI_to_Excel(page, vars);
    await stepGroups.stepGroup_Verifying_Locked_Loans_Data_from_UI_to_Excel(page, vars);
    vars["EntireRowDataExcelMetaInfo1"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "0", "3");
    vars["BidReqNumTextExcelMetaInfo"] = String(vars["EntireRowDataExcelMetaInfo1"]).split(",")["1"] || '';
    expect(String(vars["BidReqNumTextExcelMetaInfo"])).toBe("BID REQUEST NUMBER");
    vars["BidReqIdExcelMetaInfo"] = String(vars["EntireRowDataExcelMetaInfo1"]).split(",")["2"] || '';
    expect(String(vars["BidReqIdExcelMetaInfo"])).toBe(vars["BidReqID"]);
    vars["EntireRowDataExcelMetaInfo2"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "1", "3");
    vars["ReportGenerationTextExcelMetaInfo"] = String(vars["EntireRowDataExcelMetaInfo2"]).split(",")["1"] || '';
    expect(String(vars["ReportGenerationTextExcelMetaInfo"])).toBe("REPORT GENERATION TIME");
    vars["ReportGenTimeExcelMetaInfo"] = String(vars["EntireRowDataExcelMetaInfo2"]).split(",")["2"] || '';
    expect(String(vars["ReportGenTimeExcelMetaInfo"])).toBe(vars["ExpectedReportGenTime"]);
  });
});
