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
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS19_TC04';
const TC_TITLE = 'Apply filter for current day/particular day and verify the Export functionality.';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    vars['DownloadDir'] = path.join(process.cwd(), 'downloads');
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;

    log.tcStart(TC_ID, TC_TITLE);
    try {
      log.step('Login and open Price Offered');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        log.stepPass('Successfully logged in and navigated to Price Offered');
      } catch (e) {
        log.stepFail(page, 'Failed to login or navigate to Price Offered');
        throw e;
      }
      log.step('Open Date range filter and select current date');
      try {
        await priceOfferedPage.Filter_Dropdown1.click();
        await correspondentPortalPage.Select_Date_Range_Dropdown.click();
        await correspondentPortalPage.Current_Date_On_Filters.click();
        Methods.getCurrentTimestamp(appconstants.DATE_FORMAT, 'CurrentDate', appconstants.ASIA_KOLKATA);
        Methods.subtractDaysFromDate(vars['CurrentDate'], 1, appconstants.DATE_FORMAT, appconstants.DATE_FORMAT, 'CurrentDate');
        await correspondentPortalPage.Select_Current_DateAdd_Config(vars['CurrentDate']).click();
        await correspondentPortalPage.Apply_Button.click();
        await applyFiltersButtonPage.Apply_Filters_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'visible' });
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass(`Successfully selected current date filter: ${vars['CurrentDate']}`);
      } catch (e) {
        log.stepFail(page, 'Failed to open date range filter or select current date');
        throw e;
      }
      log.step('Count rows across all result pages');
      try {
        const nextButtonLocator = correspondentPortalPage.Go_to_Next_Page_Button;
        const isNextVisible = await nextButtonLocator.isVisible().catch(() => false);
        if (!isNextVisible) {
          vars['PageCount'] = '1';
        } else {
          vars['PageCount'] = await correspondentPortalPage.Pagination_Count.textContent() || '';
          vars['PageCount'] = String(vars['PageCount']).substring(10);
        }
        log.info(`PageCount: ${vars['PageCount']}`);
        vars['Count1'] = '1';
        vars['TotalRowsAllPages'] = '0';
        while (parseFloat(String(vars['Count1'])) <= parseFloat(String(vars['PageCount']))) {
          vars['RowCountUI'] = String(await priceOfferedPage.RowCount.count());
          Methods.MathematicalOperation(vars['TotalRowsAllPages'], '+', vars['RowCountUI'], 'TotalRowsAllPages');
          const isVisible = await nextButtonLocator.isVisible().catch(() => false);
          if (isVisible) {
            const isDisabled = await nextButtonLocator.getAttribute('aria-disabled', { timeout: 5000 }).catch(() => null);
            if (isDisabled === 'false') {
              await correspondentPortalPage.Go_to_Next_Page_Button_2.click();
              await spinnerPage.Spinner.waitFor({ state: 'hidden' });
            }
          }

          Methods.MathematicalOperation(vars['Count1'], '+', 1, 'Count1');
        }

        log.stepPass(`Successfully counted total rows across all pages: ${vars['TotalRowsAllPages']}`);
      } catch (e) {
        log.stepFail(page, 'Failed to count rows across pages');
        throw e;
      }
      log.step('Select all rows and export to Excel');
      try {
        await priceOfferedPage.Select_All_Loan_Num.click();
        Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'TimeStamp', appconstants.ASIA_KOLKATA);

        const [download] = await Promise.all([
          page.waitForEvent('download'),
          correspondentPortalPage.Export_Selected_1_Button.click(),
        ]);

        vars['SavedFileName'] = vars['TimeStamp'] + '_' + download.suggestedFilename();
        vars['DownloadedFilePath'] = path.join(vars['DownloadDir'], vars['SavedFileName']);
        await download.saveAs(vars['DownloadedFilePath']);
        await page.waitForTimeout(2000);

        log.stepPass(`Successfully exported file: ${vars['SavedFileName']}`);
      } catch (e) {
        log.stepFail(page, 'Failed to select rows or export to Excel');
        throw e;
      }
      log.step('Verify Excel row count matches UI row count');
      try {
        vars['ExcelRowCount'] = String(excelHelper.getAllRowCount(vars['DownloadedFilePath'], 0));
        Methods.MathematicalOperation(vars['ExcelRowCount'], '-', 1, 'ExcelRowCount');
        expect(Methods.verifyComparison(vars['TotalRowsAllPages'], '==', vars['ExcelRowCount']));
        log.stepPass(`Successfully verified Excel row count: ${vars['ExcelRowCount']} matches UI count: ${vars['TotalRowsAllPages']}`);
      } catch (e) {
        log.stepFail(page, 'Failed to verify Excel row count against UI count');
        throw e;
      }
      log.step('Verify column headers between UI and Excel');
      try {
        vars['Count'] = '1';
        vars['count'] = '1';
        vars['ExcelHeader'] = '0';
        vars['CountOfHeaders'] = String(await priceOfferedPage.Headers_UI.count());
        vars['HeaderValuesExcel'] = excelHelper.readEntireRow(vars['DownloadedFilePath'], 0, vars['ExcelHeader'], 'HeaderValuesExcel');

        log.info(`ExcelHeaders: ${vars['HeaderValuesExcel']}`);

        while (parseFloat(String(vars['Count'])) <= parseFloat(String(vars['CountOfHeaders']))) {
          vars['IndividualHeaders'] = (await priceOfferedPage.Individual_Headers(vars['Count']).textContent()) || '';
          Methods.trimtestdata(vars['IndividualHeaders'], 'IndividualHeadersUI');
          Methods.splitStringByRegConditionWithPosition(vars['HeaderValuesExcel'], ',', vars['count'], 'IndividualExcelHeaders');
          Methods.trimtestdata(vars['IndividualExcelHeaders'], 'IndividualExcelHeaders');

          if (vars['IndividualHeadersUI'] === appconstants.BID_REQ_ID) {
            vars['IndividualHeadersUI'] = 'Bid Request ID';
          }
          if (vars['IndividualHeadersUI'] === 'Execution Type') {
            vars['IndividualHeadersUI'] = 'Exe. Type';
          }

          await Methods.verifyTestdataIgnoreCase(vars['IndividualHeadersUI'], 'contains', vars['IndividualExcelHeaders']);

          Methods.MathematicalOperation(vars['Count'], '+', 1, 'Count');
          Methods.MathematicalOperation(vars['count'], '+', 1, 'count');
        }

        log.stepPass('Successfully verified all column headers match between UI and Excel');
      } catch (e) {
        log.stepFail(page, 'Failed to verify column headers between UI and Excel');
        throw e;
      }
      log.tcEnd('PASS');
    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});