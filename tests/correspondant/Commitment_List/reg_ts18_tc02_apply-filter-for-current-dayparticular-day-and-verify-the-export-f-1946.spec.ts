// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as excelHelper from '../../../src/helpers/excel-helpers';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS18_TC02_Apply filter for current day/particular day and verify the Export functionality', async ({ page }) => {
    // Set up download handler
    page.on('download', async (download) => {
      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      await download.saveAs(filePath);
      vars['_lastDownloadPath'] = filePath;
    });

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_Date_Range_Dropdown.click();
    await correspondentPortalPage.Current_Date_On_Filters.click();
    vars["CurrentDate"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
      const fmt = "d-M-yyyy";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
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
    vars["TotalRowsAllPagesUI"] = "0";
    while (parseFloat(String(vars["Count1"])) <= parseFloat(String(vars["PageCount"]))) {
      vars["RowCountUI"] = String(await priceOfferedPage.RowCount.count());
      vars["TotalRowsAllPagesUI"] = (parseFloat(String(vars["TotalRowsAllPagesUI"])) + parseFloat(String(vars["RowCountUI"]))).toFixed(0);
      if (true) /* Element Go to Next Page Button is enabled */ {
        await correspondentPortalPage.Go_to_Next_Page_Button.click();
      }
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      vars["Count1"] = (parseFloat(String("1")) + parseFloat(String(vars["Count1"]))).toFixed(0);
    }
    await priceOfferedPage.Select_All_Loan_Num.click();
    vars["ExportedCountUI"] = await commitmentListPage.Export_Selected.textContent() || '';
    vars["ExportedCountUI"] = String(vars["ExportedCountUI"]).trim();
    vars["ExportedCountUI"] = String(vars["ExportedCountUI"]).replace(/\(\)/g, '');
    vars["RowCount"] = String(await priceOfferedPage.Row_Count_UI.count());
    vars["RowCountInUI"] = (parseFloat(String(vars["RowCount"])) - parseFloat(String("1"))).toFixed(0);
    await correspondentPortalPage.Export_Selected_1_Button.click();
    // Wait for download - handled by Playwright download events
    await page.waitForTimeout(2000);
    vars["File"] = vars['_lastDownloadPath'] || '';
    vars["ExcelRowCount"] = String(excelHelper.getRowCount(vars["File"], "0"));
    vars["ExcelRowCount"] = (parseFloat(String(vars["ExcelRowCount"])) - parseFloat(String("1"))).toFixed(0);
    expect(String(vars["TotalRowsAllPagesUI"])).toBe(vars["ExcelRowCount"]);
    expect(String(vars["TotalRowsAllPagesUI"])).toBe(vars["ExportedCountUI"]);
    vars["Count"] = "1";
    vars["count"] = "1";
    vars["ExcelHeader"] = "0";
    vars["CountOfHeaders"] = String(await commitmentListPage.Headers_UI_Commitment_List.count());
    vars["HeaderValuesExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', vars["ExcelHeader"], "0");
    while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["CountOfHeaders"]))) {
      vars["IndividualHeaders"] = await commitmentListPage.Individual_Header_Name_UIClosed_List.textContent() || '';
      vars["IndividualHeadersUI"] = String(vars["IndividualHeaders"]).trim();
      vars["IndividualExcelHeaders"] = String(vars["HeaderValuesExcel"]).split(",")[parseInt(String(vars["count"]))] || '';
      vars["IndividualExcelHeaders"] = String(vars["IndividualExcelHeaders"]).trim();
      if (String(vars["IndividualHeadersUI"]) === String("BidReq.ID")) {
        vars["IndividualHeadersUI"] = "BidRequestID";
      }
      expect(String(vars["IndividualHeadersUI"]).toLowerCase()).toContain(String(vars["IndividualExcelHeaders"]).toLowerCase());
      vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
  });
});
