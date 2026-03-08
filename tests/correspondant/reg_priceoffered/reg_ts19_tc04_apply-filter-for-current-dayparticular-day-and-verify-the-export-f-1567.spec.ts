// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { Logger as log } from '../../../src/helpers/log-helper';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
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
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });
  const TC_ID = 'REG_TS19_TC04';
  const TC_TITLE = 'Apply filter for current day/particular day and verify the Export functionality.';

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {
      // log.step('Setup: download handler');
      // try {
      //   page.on('download', async (download) => {
      //     const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      //     await download.saveAs(filePath);
      //     vars['_lastDownloadPath'] = filePath;
      //   });
      //   log.stepPass('Download handler configured');
      // } catch (error) {
      //   log.stepFail(page, 'Failed to configure download handler');
      //   throw error;
      // }

      log.step('Step 1: Login and open Price Offered');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        log.stepPass('Step 1 passed: Logged in and navigated to Price Offered');
      } catch (error) {
        log.stepFail(page, 'Step 1 failed: Login or navigation failed');
        throw error;
      }

      log.step('Step 2: Open Date range filter and select current date');
      try {
        await priceOfferedPage.Filter_Dropdown1.click();
        await correspondentPortalPage.Select_Date_Range_Dropdown.click();
        await correspondentPortalPage.Current_Date_On_Filters.click();
        Methods.getCurrentTimestamp('d-M-yyyy', 'CurrentDate', 'Asia/Kolkata');
        log.stepPass('Step 2 passed: Current date selected in filter');
      } catch (error) {
        log.stepFail(page, 'Step 2 failed: Date filter selection failed');
        throw error;
      }
      // Step 3: Adjust date (previous day) and apply filters
      log.step('Step 3: Adjust date to previous day and apply filters');
      try {
        Methods.addDaysToDate(vars['CurrentDate'], 'd-M-yyyy', 0, 'd-M-yyyy', 'CurrentDate');
        await correspondentPortalPage.Select_Current_DateAdd_Config(vars["CurrentDate"]).click();
        await correspondentPortalPage.Apply_Button.click();
        await applyFiltersButtonPage.Apply_Filters_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'visible' });
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Step 3 passed: Date adjusted and filters applied');
      } catch (error) {
        log.stepFail(page, 'Step 3 failed: Date adjust or filter apply failed');
        throw error;
      }
      
      // Step 4: Count rows across pages
      log.step('Step 4: Count rows across result pages');
      try {
        if (!(await correspondentPortalPage.Go_to_Next_Page_Button.isVisible())) /* Element Pagination Count is not visible */ {
          vars["PageCount"] = "1";
        } else {
          vars["PageCount"] = await correspondentPortalPage.Pagination_Count.textContent() || '';
          vars["PageCount"] = String(vars["PageCount"]).substring(10);
        }
        vars["Count1"] = "1";
        vars["TotalRowsAllPages"] = "0";
        while (parseFloat(String(vars["Count1"])) <= parseFloat(String(vars["PageCount"]))) {
          vars["RowCountUI"] = String(await priceOfferedPage.RowCount.count());
          vars["TotalRowsAllPages"] = (parseFloat(String(vars["TotalRowsAllPages"])) + parseFloat(String(vars["RowCountUI"]))).toFixed(0);
          if (await correspondentPortalPage.Go_to_Next_Page_Button.isVisible()) /* Element Go to Next Page Button is enabled */ {
            await correspondentPortalPage.Go_to_Next_Page_Button.click();
          }
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          vars["Count1"] = (parseFloat(String("1")) + parseFloat(String(vars["Count1"]))).toFixed(0);
        }
        log.stepPass('Step 4 passed: Row counts aggregated across pages');
      } catch (error) {
        log.stepFail(page, 'Step 4 failed: Error counting rows across pages');
        throw error;
      }

      await page.pause();

      // Step 5: Export selected rows and validate Excel row count
      log.step('Step 5: Export selected rows and validate Excel row count');
      try {
        await priceOfferedPage.Select_All_Loan_Num.click();
        await correspondentPortalPage.Export_Selected_1_Button.click();
        const downloadPromise = page.waitForEvent('download');
        await correspondentPortalPage.Export_Selected_1_Button.click();
        const download = await downloadPromise;
        const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
        await download.saveAs(filePath);
        vars['_lastDownloadPath'] = filePath;
        await page.waitForTimeout(2000);
        vars["File"] = vars['_lastDownloadPath'] || '';
        vars["ExcelRowCount"] = String(excelHelper.getRowCount(vars["File"], "0"));
        vars["ExcelRowCount"] = (parseFloat(String(vars["ExcelRowCount"])) - parseFloat(String("1"))).toFixed(0);
        // vars["ExcelRowCount"] = (parseFloat(String(vars["ExcelRowCount"]))).toFixed(0);
        expect(String(vars["TotalRowsAllPages"])).toBe(vars["ExcelRowCount"]);
        log.stepPass('Step 5 passed: Exported and Excel row count matches UI count');
      } catch (error) {
        log.stepFail(page, 'Step 5 failed: Export or Excel row count validation failed');
        throw error;
      }

      // Step 6: Verify headers between UI and Excel
      log.step('Step 6: Verify headers between UI and Excel');
      try {
        vars["Count"] = "1";
        vars["count"] = "1";
        vars["ExcelHeader"] = "0";
        vars["CountOfHeaders"] = String(await priceOfferedPage.Headers_UI.count());
        vars["HeaderValuesExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', vars["ExcelHeader"], "0");
        while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["CountOfHeaders"]))) {
          const headerIndex = parseInt(String(vars["count"]));
          const expectedExcelHeader = String(vars["HeaderValuesExcel"]).split(",")[headerIndex] || '';
          const uiLocator = priceOfferedPage.Individual_Headers.nth(headerIndex - 1);
          let uiHeader = await uiLocator.textContent() || '';
          uiHeader = String(uiHeader).trim();
          let normalizedUIHeader = uiHeader;
          if (String(normalizedUIHeader) === String("BidReq.ID")) normalizedUIHeader = "BidRequestID";
          if (String(normalizedUIHeader) === String("ExecutionType")) normalizedUIHeader = "Exe.Type";
          await Methods.verifyElementTextContainsCaseInsensitive(uiLocator, undefined, String(expectedExcelHeader).trim());
          vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
          vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
        }
        log.stepPass('Step 6 passed: UI headers match Excel headers');
      } catch (error) {
        log.stepFail(page, 'Step 6 failed: Header verification failed');
        throw error;
      }

      log.tcEnd('PASS');
    } catch (error) {
      log.captureOnFailure(page, TC_ID, error);
      log.tcEnd('FAIL');
      throw error;
    }
  });
});
