// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidrequestPage } from '../../../src/pages/correspondant/bidrequest';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as excelHelper from '../../../src/helpers/excel-helpers';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidrequestPage: BidrequestPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidrequestPage = new BidrequestPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS18_TC01_Download the file from the grid view and validate the data present in the file', async ({ page }) => {
    // Set up download handler
    page.on('download', async (download) => {
      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      await download.saveAs(filePath);
      vars['_lastDownloadPath'] = filePath;
    });

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Bid_Requests_Side_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_Bid_Request_Status.click();
    await bidRequestPage.Search_FieldFilters.fill("Upload Expired");
    await bidRequestPage.Upload_Expired_Checkbox.check();
    await correspondentPortalPage.Apply_Selected2.waitFor({ state: 'visible' });
    await correspondentPortalPage.Apply_Selected2.click();
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await bidRequestPage.Bid_Req_IDUpload_Expired.waitFor({ state: 'visible' });
    await bidRequestPage.Bid_Req_IDUpload_Expired.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["BidReqIdUI"] = await bidRequestPage.Bid_Req_IdBid_Req_Details.textContent() || '';
    await bidRequestDetailsPage.Last_Name_Sort_Button.click();
    await priceOfferedPage.Last_Name_Down_ArrowDetails.waitFor({ state: 'visible' });
    vars["TablesCount"] = String(await bidRequestPage.Data_Tables_Count.count());
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TablesCount"]))) {
      await bidRequestPage.Download_Grid_Button.scrollIntoViewIfNeeded();
      await bidRequestPage.Download_Grid_Button.click();
      // Wait for download - handled by Playwright download events
      await page.waitForTimeout(2000);
      vars["space"] = "key_blank";
      vars["DateAndTimeFormat"] = "MM/dd/yyyy" + vars["space"] + "HH:mm";
      vars["CurrentEstDateAndTime"] = (() => {
        const d = new Date();
        const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
        const fmt = "DateAndTimeFormat";
        // Map Java date format to Intl parts
        const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
        const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
        return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
      })();
      vars["ExpectedReportGenTime"] = vars["CurrentEstDateAndTime"] + vars["space"] + "ET";
      vars["ErrorLoansCountUI"] = String(await bidRequestPage.Total_Error_Loan_Num.count());
      vars["EntireHeadersDataExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "0", "1");
      await bidRequestPage.BidRequest_Details_Text.click();
      vars["HeadersCount"] = "1";
      while (parseFloat(String(vars["HeadersCount"])) <= parseFloat(String("5"))) {
        vars["IndividualHeaderNameExcel"] = String(vars["EntireHeadersDataExcel"]).split(",")[parseInt(String(vars["HeadersCount"]))] || '';
        vars["IndividualHeaderNameExcel"] = String(vars["IndividualHeaderNameExcel"]).trim();
        vars["IndividualHeaderNameUI"] = await bidRequestPage.Header_Name_UIBid_Request.textContent() || '';
        if (String(vars["IndividualHeaderNameUI"]).includes(String("."))) {
          vars["IndividualHeaderNameUI"] = String(vars["IndividualHeaderNameUI"]).replace(/\./g, '');
        }
        vars["IndividualHeaderNameUI"] = String(vars["IndividualHeaderNameUI"]).trim();
        expect(String(vars["IndividualHeaderNameUI"])).toBe(vars["IndividualHeaderNameExcel"]);
        vars["HeadersCount"] = (parseFloat(String(vars["HeadersCount"])) + parseFloat(String("1"))).toFixed(0);
      }
      vars["TotalRowsCountUI"] = String(await bidRequestPage.Rows_CountBid_Request.count());
      vars["RowsCount"] = "1";
      while (parseFloat(String(vars["RowsCount"])) <= parseFloat(String(vars["TotalRowsCountUI"]))) {
        vars["ColumnCount"] = "1";
        vars["EntireRowDataGeneralViewExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', vars["RowsCount"], "1");
        await bidRequestPage.BidRequest_Details_Text.click();
        while (parseFloat(String(vars["ColumnCount"])) <= parseFloat(String("5"))) {
          vars["IndividualColumnDataUI"] = await bidRequestPage.Individual_Column_Data_UIBid_Request.textContent() || '';
          if (String(vars["IndividualColumnDataUI"]).includes(String("$"))) {
            vars["IndividualColumnDataUI"] = String(vars["IndividualColumnDataUI"]).replace(/\$\,/g, '');
          } else if (String(vars["IndividualColumnDataUI"]).includes(String("| PQ | PS"))) {
            vars["IndividualColumnDataUI"] = String('').split("|")["0"] || '';
          }
          vars["IndividualColumnDataUI"] = String(vars["IndividualColumnDataUI"]).trim();
          vars["IndiualGeneralViewDataExcel"] = String(vars["EntireRowDataGeneralViewExcel"]).split(",")[parseInt(String(vars["ColumnCount"]))] || '';
          expect(String(vars["IndividualColumnDataUI"])).toBe(vars["IndiualGeneralViewDataExcel"]);
          vars["ColumnCount"] = (parseFloat(String(vars["ColumnCount"])) + parseFloat(String("1"))).toFixed(0);
        }
        vars["RowsCount"] = (parseFloat(String(vars["RowsCount"])) + parseFloat(String("1"))).toFixed(0);
      }
      vars["count1"] = "1";
      vars["EntireHeadersErrorsDetailsExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "0", "2");
      vars["IndividualHeaderNameErrordDetailsExcel"] = String(vars["EntireHeadersErrorsDetailsExcel"]).split(",")["1"] || '';
      expect(String(vars["IndividualHeaderNameErrordDetailsExcel"])).toBe("Corr Loan #");
      vars["IndividualHeaderNameErrordDetailsExcel"] = String(vars["EntireHeadersErrorsDetailsExcel"]).split(",")["2"] || '';
      expect(String(vars["IndividualHeaderNameErrordDetailsExcel"])).toBe("Error");
      vars["IndividualHeaderNameErrordDetailsExcel"] = String(vars["EntireHeadersErrorsDetailsExcel"]).split(",")["3"] || '';
      expect(String(vars["IndividualHeaderNameErrordDetailsExcel"])).toBe("Error Details");
      while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["ErrorLoansCountUI"]))) {
        await bidRequestPage.BidRequest_Details_Text.click();
        vars["IndividualLoanNum"] = await bidRequestPage.Individual_Loan_NumDetails_Screen.textContent() || '';
        vars["IndividualLoanNum"] = String('').split("|")["0"] || '';
        vars["IndividualLoanNum"] = String(vars["IndividualLoanNum"]).trim();
        await bidRequestPage.Mouse_Over_the_Error_Loan.scrollIntoViewIfNeeded();
        await bidRequestPage.Mouse_Over_the_Error_Loan.hover();
        vars["ErrorsCount"] = String(await bidRequestDetailsPage.Errors_count_in_the_tool_tip.count());
        vars["count2"] = "1";
        while (parseFloat(String(vars["count2"])) <= parseFloat(String(vars["ErrorsCount"]))) {
          await bidRequestPage.Mouse_Over_the_Error_Loan.hover();
          vars["DangerHeaderErrorText"] = await bidRequestPage.Invalid_Error_TextDanger.textContent() || '';
          vars["ErrorTextBody"] = await bidrequestPage.Danger_Error_Body_Text.textContent() || '';
          vars["EntireRowDataErrorDetailsExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', vars["count2"], "2");
          vars["COUNT3"] = "1";
          while (parseFloat(String(vars["COUNT3"])) <= parseFloat(String("3"))) {
            vars["IndividualRowDataErrorDetailsExcel"] = String(vars["EntireRowDataErrorDetailsExcel"]).split(",")[parseInt(String(vars["COUNT3"]))] || '';
            if (String(vars["IndividualLoanNum"]) === String(vars["IndividualRowDataErrorDetailsExcel"])) {
            } else if (String(vars["DangerHeaderErrorText"]) === String(vars["IndividualRowDataErrorDetailsExcel"])) {
            } else if (String(vars["ErrorTextBody"]) === String(vars["IndividualRowDataErrorDetailsExcel"])) {
            }
            vars["COUNT3"] = (parseFloat(String(vars["COUNT3"])) + parseFloat(String("1"))).toFixed(0);
          }
          vars["count2"] = (parseFloat(String(vars["count2"])) + parseFloat(String("1"))).toFixed(0);
        }
        vars["count1"] = (parseFloat(String(vars["count1"])) + parseFloat(String("1"))).toFixed(0);
      }
      vars["EntireRowDataExcelMetaInfo1"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "0", "3");
      vars["BidReqNumTextExcelMetaInfo"] = String(vars["EntireRowDataExcelMetaInfo1"]).split(",")["1"] || '';
      expect(String(vars["BidReqNumTextExcelMetaInfo"])).toBe("BID REQUEST NUMBER");
      vars["BidReqIdExcelMetaInfo"] = String(vars["EntireRowDataExcelMetaInfo1"]).split(",")["2"] || '';
      expect(String(vars["BidReqIdExcelMetaInfo"])).toBe(vars["BidReqIdUI"]);
      vars["EntireRowDataExcelMetaInfo2"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "1", "3");
      vars["ReportGenerationTextExcelMetaInfo"] = String(vars["EntireRowDataExcelMetaInfo2"]).split(",")["1"] || '';
      expect(String(vars["ReportGenerationTextExcelMetaInfo"])).toBe("REPORT GENERATION TIME");
      vars["ReportGenTimeExcelMetaInfo"] = String(vars["EntireRowDataExcelMetaInfo2"]).split(",")["2"] || '';
      expect(String(vars["ReportGenTimeExcelMetaInfo"])).toBe(vars["ExpectedReportGenTime"]);
      vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
    }
  });
});
