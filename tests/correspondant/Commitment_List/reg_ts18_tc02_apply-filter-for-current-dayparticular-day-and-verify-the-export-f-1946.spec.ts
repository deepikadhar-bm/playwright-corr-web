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
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { ENV } from '@config/environments';


const TC_ID = 'REG_TS18_TC02';
const TC_TITLE = 'Apply filter for current day/particular day and verify the Export functionality';

test.describe('Commitment List - TS_2', () => { 
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Login to Correspondent Portal');
      try {
        vars['DownloadDir'] = path.join(process.cwd(), 'downloads');
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Logged in to Correspondent Portal successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to login to Correspondent Portal');
        throw e;
      }

      log.step('Navigate to Commitment List');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        log.stepPass('Navigated to Commitment List successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Commitment List');
        throw e;
      }

      log.step('Apply current day date filter and verify date chip is visible');
      try {
        await priceOfferedPage.Filter_Dropdown1.click();
        await correspondentPortalPage.Select_Date_Range_Dropdown.click();
        await correspondentPortalPage.Current_Date_On_Filters.click();
        Methods.getCurrentTimestamp(appconstants. DATE_FORMAT_DMYYYY, 'CurrentDate', appconstants.AMERICA_NEW_YORK);
        log.info('CurrentDate: ' + vars['CurrentDate']);
        await correspondentPortalPage.Select_Current_DateAdd_Config(vars['CurrentDate']).click();
        await correspondentPortalPage.Apply_Button.click();
        await applyFiltersButtonPage.Apply_Filters_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });
        await page.waitForTimeout(6000);
        log.stepPass('Current day date filter applied and chip is visible for date: ' + vars['CurrentDate']);
      } catch (e) {
        await log.stepFail(page, 'Failed to apply current day date filter for date: ' + vars['CurrentDate']);
        throw e;
      }

      log.step('Capture total row count across all pages from UI');
      try {
        const pagination = correspondentPortalPage.Pagination_Count;
        if (await pagination.isVisible()) {
          vars['PageCount'] = await pagination.textContent() || '';
          Methods.removeCharactersFromPosition(vars['PageCount'], '10', '0', 'PageCount');
        } else {
          vars['PageCount'] = appconstants.ONE;
          log.info('Pagination not visible, defaulting to 1');
        }
        log.info('PageCount: ' + vars['PageCount']);

        vars['Count1'] = appconstants.ONE;
        vars['TotalRowsAllPagesUI'] = appconstants.ZERO;
        while (parseFloat(String(vars['Count1'])) <= parseFloat(String(vars['PageCount']))) {
          vars['RowCountUI'] = String(await priceOfferedPage.RowCount.count());
          Methods.MathematicalOperation(vars['TotalRowsAllPagesUI'], '+', vars['RowCountUI'], 'TotalRowsAllPagesUI');
          const NextButton = correspondentPortalPage.Go_to_Next_Page_Button;
          if (await NextButton.isVisible() && await NextButton.isEnabled()) {
            await NextButton.click();
            log.info('Clicked on Next Page button');
          }
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          Methods.MathematicalOperation(vars['Count1'], '+', 1, 'Count1');
        }
        log.info('Total Rows All Pages UI: ' + vars['TotalRowsAllPagesUI']);
        log.stepPass('Total rows across all pages captured from UI: ' + vars['TotalRowsAllPagesUI']);
      } catch (e) {
        await log.stepFail(page, 'Failed to capture total row count from UI. TotalRowsAllPagesUI: ' + vars['TotalRowsAllPagesUI']);
        throw e;
      }

      log.step('Capture export selected count and row count from UI');
      try {
        await priceOfferedPage.Select_All_Loan_Num.check();
        await expect(priceOfferedPage.Select_All_Loan_Num).toBeChecked();
        vars['ExportedCountUI'] = await commitmentListPage.Export_Selected.textContent() || '';
        Methods.trimtestdata(vars['ExportedCountUI'], 'ExportedCountUI');
        Methods.removeMultipleSpecialChars(['(', ')', ' '], vars['ExportedCountUI'], 'ExportedCountUI');
        log.info('ExportedCountUI: ' + vars['ExportedCountUI']);
        vars['RowCount'] = String(await priceOfferedPage.Row_Count_UI.count());
        Methods.MathematicalOperation(vars['RowCount'], '-', 1, 'RowCountInUI');
        log.info('RowCountInUI: ' + vars['RowCountInUI']);
        log.stepPass('Export selected count and row count captured from UI successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture export selected count or row count from UI');
        throw e;
      }

      log.step('Export selected records and save the downloaded file');
      try {
        Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'TimeStamp', appconstants.ASIA_KOLKATA);
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          correspondentPortalPage.Export_Selected_1_Button.click()
        ]);
        vars['SavedFileName'] = vars['TimeStamp'] + '_' + download.suggestedFilename();
        vars['DownloadedFilePath'] = path.join(vars['DownloadDir'], vars['SavedFileName']);
        await download.saveAs(vars['DownloadedFilePath']);
        await page.waitForTimeout(2000);
        log.info('Downloaded file saved at: ' + vars['DownloadedFilePath']);
        log.stepPass('Export file downloaded and saved successfully: ' + vars['SavedFileName']);
      } catch (e) {
        await log.stepFail(page, 'Failed to export or save the downloaded file: ' + vars['SavedFileName']);
        throw e;
      }

      log.step('Verify exported Excel row count matches UI row count and export selected count');
      try {
        vars['ExcelRowCount'] = String(excelHelper.getAllRowCount(vars['DownloadedFilePath'], 0));
        Methods.MathematicalOperation(vars['ExcelRowCount'], '-', 1, 'ExcelRowCount');
        log.info('ExcelRowCount (excluding header): ' + vars['ExcelRowCount']);
        log.info('ExportedCountUI: ' + vars['ExportedCountUI']);
        expect(Methods.verifyComparison(vars['TotalRowsAllPagesUI'], '==', vars['ExcelRowCount']));
        expect(Methods.verifyComparison(vars['TotalRowsAllPagesUI'], '==', vars['ExportedCountUI']));
        log.stepPass('UI rows count is matched with excel rows count');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify UI rows count with excel rows count');
        throw e;
      }

      log.step('Verify exported Excel column headers match UI column headers');
      try {
        vars['Count'] = appconstants.ONE;
        vars['count'] = appconstants.ONE;
        vars['ExcelHeader'] = '0';
        vars['CountOfHeaders'] = String(await commitmentListPage.Headers_UI_Commitment_List.count());
        log.info('CountOfHeaders: ' + vars['CountOfHeaders']);
        vars['HeaderValuesExcel'] = excelHelper.readEntireRow(vars['DownloadedFilePath'], 0, vars['ExcelHeader'], 'HeaderValuesExcel');
        while (parseFloat(String(vars['Count'])) <= parseFloat(String(vars['CountOfHeaders']))) {
          vars['IndividualHeaders'] = await commitmentListPage.Individual_Header_Name_UIClosed_List(vars['Count']).textContent() || '';
          Methods.trimtestdata(vars['IndividualHeaders'], 'IndividualHeadersUI');
          Methods.splitStringByRegConditionWithPosition(vars['HeaderValuesExcel'], ',', vars['count'], 'IndividualExcelHeaders');
          Methods.trimtestdata(vars['IndividualExcelHeaders'], 'IndividualExcelHeaders');
          log.info('UI Header [' + vars['Count'] + ']: ' + vars['IndividualHeadersUI'] + ' | Excel Header [' + vars['count'] + ']: ' + vars['IndividualExcelHeaders']);
          expect(Methods.verifyTestdataIgnoreCase(vars['IndividualHeadersUI'], 'contains', vars['IndividualExcelHeaders']));
          Methods.MathematicalOperation(vars['Count'], '+', 1, 'Count');
          Methods.MathematicalOperation(vars['count'], '+', 1, 'count');
        }
        log.stepPass('All ' + vars['CountOfHeaders'] + ' column headers in Excel match UI headers');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify UI headers with excel headers');
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