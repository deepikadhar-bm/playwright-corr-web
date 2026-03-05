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
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';


test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test('REG_TS18_TC02_Apply filter for current day/particular day and verify the Export functionality', async ({ page }) => {
    vars['DownloadDir'] = path.join(process.cwd(), 'downloads');
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_Date_Range_Dropdown.click();
    await correspondentPortalPage.Current_Date_On_Filters.click();
    Methods.getCurrentTimestamp('d-M-yyyy', 'CurrentDate', 'America/New_York');
    console.log("CurrentDate:", vars["CurrentDate"]);
    vars["CurrentDate"]="3-3-2026";
    await correspondentPortalPage.Select_Current_DateAdd_Config(vars["CurrentDate"]).click();
    await correspondentPortalPage.Apply_Button.click();
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });
    await page.waitForTimeout(6000);
    const pagination = correspondentPortalPage.Pagination_Count;
    let isVisible = false;
    try {
      isVisible = await pagination.isVisible();
    } catch (e) {
      isVisible = false;
    }
    console.log("isVisible:", isVisible);
    if (isVisible) {
      vars["PageCount"] = await pagination.textContent() || '';
      Methods.removeCharactersFromPosition(vars["PageCount"], "10", "0", "PageCount");
    } else {
      vars["PageCount"] = "1";
      console.log("Pagination not visible, defaulting to 1");
    }
    console.log("PageCount:", vars["PageCount"]);
    vars["Count1"] = "1";
    vars["TotalRowsAllPagesUI"] = "0";
    while (parseFloat(String(vars["Count1"])) <= parseFloat(String(vars["PageCount"]))) {
      vars["RowCountUI"] = String(await priceOfferedPage.RowCount.count());
      Methods.MathematicalOperation(vars["TotalRowsAllPagesUI"], '+', vars["RowCountUI"], "TotalRowsAllPagesUI");
      const nextButton = correspondentPortalPage.Go_to_Next_Page_Button;
      if (await nextButton.isVisible()) {
        await nextButton.click();
        console.log("Clicked Next Page button");
      }
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      vars["Count1"] = (parseFloat(String("1")) + parseFloat(String(vars["Count1"]))).toFixed(0);
    }
    await priceOfferedPage.Select_All_Loan_Num.check();
    await priceOfferedPage.Select_All_Loan_Num.isChecked();
    vars["ExportedCountUI"] = await commitmentListPage.Export_Selected.textContent() || '';
    Methods.trimtestdata(vars["ExportedCountUI"],"ExportedCountUI");
    Methods.removeMultipleSpecialChars(['(', ')', ' '], vars["ExportedCountUI"], "ExportedCountUI");
    vars["RowCount"] = String(await priceOfferedPage.Row_Count_UI.count());
     Methods.MathematicalOperation(vars["RowCount"], '-', 1, "RowCountInUI");
    Methods.getCurrentTimestamp('dd-MM-yyyy HH-mm-ss', 'TimeStamp', 'Asia/Kolkata');
    const [download] = await Promise.all([page.waitForEvent('download'), correspondentPortalPage.Export_Selected_1_Button.click()]);
    vars['SavedFileName'] = vars['TimeStamp'] + '_' + download.suggestedFilename();
    vars['DownloadedFilePath'] = path.join(vars['DownloadDir'], vars['SavedFileName']);
    await download.saveAs(vars['DownloadedFilePath']);
    await page.waitForTimeout(2000);
    vars["ExcelRowCount"] = String(excelHelper.getAllRowCount(vars["DownloadedFilePath"], 0));
    Methods.MathematicalOperation(vars["ExcelRowCount"], '-', 1, "ExcelRowCount");
    expect(String(vars["TotalRowsAllPagesUI"])).toBe(vars["ExcelRowCount"]);
    expect(String(vars["TotalRowsAllPagesUI"])).toBe(vars["ExportedCountUI"]);
    vars["Count"] = "1";
    vars["count"] = "1";
    vars["ExcelHeader"] = "0";
    vars["CountOfHeaders"] = String(await commitmentListPage.Headers_UI_Commitment_List.count());
    vars["HeaderValuesExcel"] = excelHelper.readEntireRow(vars["DownloadedFilePath"], 0,vars["ExcelHeader"],"HeaderValuesExcel");
    while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["CountOfHeaders"]))) {
      vars["IndividualHeaders"] = await commitmentListPage.Individual_Header_Name_UIClosed_List(vars["Count"]).textContent() || '';
      Methods.trimtestdata(vars["IndividualHeaders"],"IndividualHeadersUI");
      Methods.splitStringByRegConditionWithPosition(vars["HeaderValuesExcel"], ",", vars["count"], "IndividualExcelHeaders");
      Methods.trimtestdata(vars["IndividualExcelHeaders"],"IndividualExcelHeaders");
      // if (String(vars["IndividualHeadersUI"]) === String("BidReq.ID")) {
      //   vars["IndividualHeadersUI"] = "BidRequestID";
      // }
      expect(Methods.verifyTestdataIgnoreCase(vars["IndividualHeadersUI"],"contains",vars["IndividualExcelHeaders"]));
      vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
  });
});
