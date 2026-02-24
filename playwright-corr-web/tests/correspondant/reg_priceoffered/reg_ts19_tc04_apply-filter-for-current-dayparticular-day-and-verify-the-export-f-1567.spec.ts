// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as excelHelper from '../../../src/helpers/excel-helpers';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS19_TC04_Apply filter for current day/particular day and verify the Export functionality.', async ({ page }) => {
    // Set up download handler
    page.on('download', async (download) => {
      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      await download.saveAs(filePath);
      vars['_lastDownloadPath'] = filePath;
    });

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_Date_Range_Dropdown.click();
    await correspondentPortalPage.Current_Date_On_Filters.click();
    vars["CurrentDate"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata" };
      const fmt = "d-M-yyyy";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    // [DISABLED] Get date after adding 1 to date Current Date with input format dd and output format dd and store into Current Date
    // vars["Current Date"] = (() => {
    //   const d = new Date(String(vars["Current Date"]));
    //   d.setDate(d.getDate() + parseInt(String("1")));
    //   const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
    //   return "dd".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
    // })();
    vars["CurrentDate"] = (() => {
      const d = new Date(String(vars["CurrentDate"]));
      d.setDate(d.getDate() - parseInt(String("1")));
      return d.toLocaleDateString('en-US');
    })();
    await correspondentPortalPage.Select_Current_DateAdd_Config.click();
    await correspondentPortalPage.Apply_Button.click();
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    if (true) /* Element Pagination Count is not visible */ {
      vars["PageCount"] = "1";
    } else {
      vars["PageCount"] = await correspondentPortalPage.Pagination_Count.textContent() || '';
      vars["PageCount"] = String(vars["PageCount"]).substring(10);
    }
    vars["Count1"] = "1";
    vars["TotalRowsAllPages"] = "0";
    // [DISABLED] Verify if Count1 <= PageCount
    // expect(parseInt(vars["Count1"])).toBeLessThanOrEqual(parseInt(vars["PageCount"]));
    while (parseFloat(String(vars["Count1"])) <= parseFloat(String(vars["PageCount"]))) {
      vars["RowCountUI"] = String(await priceOfferedPage.RowCount.count());
      vars["TotalRowsAllPages"] = (parseFloat(String(vars["TotalRowsAllPages"])) + parseFloat(String(vars["RowCountUI"]))).toFixed(0);
      // [DISABLED] Perform subtraction on TotalRowsAllPages and 1 and store the result inside a RowCountUI considering 0 decimal places
      // vars["RowCountUI"] = (parseFloat(String(vars["TotalRowsAllPages"])) - parseFloat(String("1"))).toFixed(0);
      if (true) /* Element Go to Next Page Button is enabled */ {
        await correspondentPortalPage.Go_to_Next_Page_Button.click();
      }
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      vars["Count1"] = (parseFloat(String("1")) + parseFloat(String(vars["Count1"]))).toFixed(0);
    }
    // [DISABLED] Store the count of elements identified by locator Row Count UI into a variable RowCount
    // vars["RowCount"] = String(await priceOfferedPage.Row_Count_UI.count());
    if (true) /* Element Go to Next Page Button is enabled */ {
      // [DISABLED] Store the count of elements identified by locator Row Count UI into a variable RowCountPage1
      // vars["RowCountPage1"] = String(await priceOfferedPage.Row_Count_UI.count());
      // [DISABLED] Click on Go to Next Page Button
      // await correspondentPortalPage.Go_to_Next_Page_Button.click();
      // [DISABLED] Store the count of elements identified by locator RowCount into a variable RowCountPage2
      // vars["RowCountPage2"] = String(await priceOfferedPage.RowCount.count());
      // [DISABLED] Perform addition on RowCountPage1 and RowCountPage2 and store the result inside a RowCount considering 0 decimal places
      // vars["RowCount"] = (parseFloat(String(vars["RowCountPage1"])) + parseFloat(String(vars["RowCountPage2"]))).toFixed(0);
      // [DISABLED] Perform subtraction on RowCount and 1 and store the result inside a RowCount considering 0 decimal places
      // vars["RowCount"] = (parseFloat(String(vars["RowCount"])) - parseFloat(String("1"))).toFixed(0);
    } else {
      // [DISABLED] Store the count of elements identified by locator Row Count UI into a variable RowCount
      // vars["RowCount"] = String(await priceOfferedPage.Row_Count_UI.count());
    }
    await priceOfferedPage.Select_All_Loan_Num.click();
    await correspondentPortalPage.Export_Selected_1_Button.click();
    // Wait for download - handled by Playwright download events
    await page.waitForTimeout(2000);
    vars["File"] = vars['_lastDownloadPath'] || '';
    vars["ExcelRowCount"] = String(excelHelper.getRowCount(vars["File"], "0"));
    vars["ExcelRowCount"] = (parseFloat(String(vars["ExcelRowCount"])) - parseFloat(String("1"))).toFixed(0);
    expect(String(vars["TotalRowsAllPages"])).toBe(vars["ExcelRowCount"]);
    // [DISABLED] Store text from the element Headers UI into a variable HeadersUI
    // vars["HeadersUI"] = await priceOfferedPage.Headers_UI.textContent() || '';
    vars["Count"] = "1";
    vars["count"] = "1";
    vars["ExcelHeader"] = "0";
    vars["CountOfHeaders"] = String(await priceOfferedPage.Headers_UI.count());
    vars["HeaderValuesExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', vars["ExcelHeader"], "0");
    while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["CountOfHeaders"]))) {
      vars["IndividualHeaders"] = await priceOfferedPage.Individual_Headers.textContent() || '';
      vars["IndividualHeadersUI"] = String(vars["IndividualHeaders"]).trim();
      vars["IndividualExcelHeaders"] = String(vars["HeaderValuesExcel"]).split(",")[parseInt(String(vars["count"]))] || '';
      vars["IndividualExcelHeaders"] = String(vars["IndividualExcelHeaders"]).trim();
      if (String(vars["IndividualHeadersUI"]) === String("BidReq.ID")) {
        vars["IndividualHeadersUI"] = "BidRequestID";
      }
      if (String(vars["IndividualHeadersUI"]) === String("ExecutionType")) {
        vars["IndividualHeadersUI"] = "Exe.Type";
      }
      expect(String(vars["IndividualHeadersUI"]).toLowerCase()).toContain(String(vars["IndividualExcelHeaders"]).toLowerCase());
      vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
  });
});
