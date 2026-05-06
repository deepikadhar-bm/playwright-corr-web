import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortal18Page } from '../../../src/pages/correspondant/correspondent-portal-18';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { ExitButtonPage } from '../../../src/pages/correspondant/exit-button';
import { NewMapPage } from '../../../src/pages/correspondant/new-map';
import { P1MoreButtonPage } from '../../../src/pages/correspondant/p-1-more-button';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS29_TC01';
const TC_TITLE = 'Verify that user should be able to perform export action for the required bids i.e exporting the list and the map details file.';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortal18Page: CorrespondentPortal18Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let exitButtonPage: ExitButtonPage;
  let newMapPage: NewMapPage;
  let p1MoreButtonPage: P1MoreButtonPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;
  let Methods: AddonHelpers;

  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    vars['DownloadDir'] = path.join(process.cwd(), 'downloads');
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    exitButtonPage = new ExitButtonPage(page);
    newMapPage = new NewMapPage(page);
    p1MoreButtonPage = new P1MoreButtonPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Login to CORR portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login successful');
      } catch (e) {
        await log.stepFail(page, 'Login failed');
        throw e;
      }

      log.step('Navigate to Bid Maps and open Header Mapping');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.Bid_Maps_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await statusInactivePage.BidMap_list_Screen.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await newMapPage.Map_Headers_Button_New.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Bid Maps and opened Header Mapping');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bid Maps or open Header Mapping');
        throw e;
      }

      log.step('Delete header and navigate through Enumeration Mapping to Exit');
      try {
        await statusInactivePage.Delete_Button_Header_Mapping.click();
        await correspondentPortal18Page.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(statusInactivePage.You_have_unidentified_Fields_This_action_will_save_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await exitButtonPage.Exit_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Header deleted, Enumeration Mapping processed, and exited to list screen');
      } catch (e) {
        await log.stepFail(page, 'Failed to delete header or navigate through Enumeration Mapping');
        throw e;
      }

      log.step('Select Bid Map checkbox and export list');
      try {
        await correspondentPortalPage.First_BidMap_Checkbox.check();
        await expect(correspondentPortalPage.First_BidMap_Checkbox).toBeChecked();
        await expect(p1MoreButtonPage.Export_Selected_Dropdown).toBeEnabled();
        await p1MoreButtonPage.Export_Selected_Dropdown.click();
        Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'TimeStamp', appconstants.ASIA_KOLKATA);
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          correspondentPortalPage.Export_List.click()
        ]);
        vars['SavedFileName'] = vars['TimeStamp'] + '_' + download.suggestedFilename();
        vars['FilePathExportList'] = path.join(vars['DownloadDir'], vars['SavedFileName']);
        await download.saveAs(vars['FilePathExportList']);
        log.stepPass('Export list downloaded. FileName: ' + vars['SavedFileName']);
      } catch (e) {
        await log.stepFail(page, 'Failed to select Bid Map or export list');
        throw e;
      }

      log.step('Verify the headers from the UI with the Excel headers data');
      try {
        vars["ColumnCount"] = appconstants.ONE;
        vars["EntireHeadersExcel"] = excelHelper.readEntireRow(vars['FilePathExportList'], "0", "0", 'BidMappingHeadersExcel');
        vars['TotalColumnCountUI'] = String(await bidRequestsPage.ColumnCountUI.count());
        log.info('Total Column Count UI: ' + vars["TotalColumnCountUI"]);
        while (parseFloat(String(vars["ColumnCount"])) <= parseFloat(String(vars["TotalColumnCountUI"]))) {
          log.info('Headers Verification Iteration: ' + vars["ColumnCount"]);
          vars["IndividualHeaderNameUI"] = await bidRequestsPage.IndividualHeadersUI(vars['ColumnCount']).textContent() || '';
          log.info('Individual Header Name UI: ' + vars["IndividualHeaderNameUI"]);
          Methods.splitStringByRegConditionWithPosition(vars["EntireHeadersExcel"], ',', vars["ColumnCount"], 'IndividualHeaderNameExcel');
          Methods.trimtestdata(vars["IndividualHeaderNameUI"], 'IndividualHeaderNameUI');
          expect(Methods.verifyTestdataIgnoreCase(vars['IndividualHeaderNameUI'], 'equals', vars['IndividualHeaderNameExcel']))
          Methods.performArithmetic(vars["ColumnCount"], 'ADDITION', '1', 'ColumnCount', 0);
        }

        log.stepPass('Successfully verified headers from UI with Excel');
      } catch (e) {
        await log.stepFail(page, 'Verification failed for headers from UI to Excel headers');
        throw e;
      }

      log.step('Verify exported file column and row data with the UI');
      try {
        vars['TotalSelectedRowsCountUI'] = String(await bidRequestsPage.SelectedRowsCountUI.count());
        log.info('Total Selected Rows Count UI: ' + vars["TotalSelectedRowsCountUI"]);
        vars["RowCount"] = appconstants.ONE;
        while (parseFloat(String(vars["RowCount"])) <= parseFloat(String(vars["TotalSelectedRowsCountUI"]))) {
          vars["EntireRowDataExcel"] = excelHelper.readEntireRow(vars['FilePathExportList'], "0", "1", 'EntireRowDataExcel');
          vars['TotalColumnCountUI'] = String(await bidRequestsPage.ColumnCountUI.count());
          vars['ColumnCount'] = appconstants.ONE;
          vars['SplitCount'] = appconstants.ONE;
          log.info('Row Iteration: ' + vars['RowCount']);
          log.info('Total Column Count UI: ' + vars["TotalColumnCountUI"]);
          while (parseFloat(String(vars["ColumnCount"])) <= parseFloat(String(vars["TotalColumnCountUI"]))) {
            log.info('Column Iteration: ' + vars['ColumnCount']);
            vars["IndividualHeaderNameUI"] = await bidRequestsPage.IndividualHeadersUI(vars['ColumnCount']).textContent() || '';
            log.info('Individual Header Name UI: ' + vars["IndividualHeaderNameUI"]);
            Methods.trimtestdata(vars["IndividualHeaderNameUI"], 'IndividualHeaderNameUI');
            vars["IndividualColumnDataUI"] = await bidRequestsPage.IndividualColumnDataUI(vars['RowCount'], vars['ColumnCount']).textContent() || '';
            log.info('Individual Column Data UI: ' + vars["IndividualColumnDataUI"]);
            Methods.trimtestdata(vars["IndividualColumnDataUI"], 'IndividualColumnDataUI');
            Methods.splitStringByRegConditionWithPosition(vars["EntireRowDataExcel"], ',', vars["SplitCount"], 'IndividualColumnDataExcel');
            log.info('IndividualColumnDataExcel: ' + vars['IndividualColumnDataExcel']);
            if (String(vars['IndividualColumnDataExcel']) === String('null')) {
              log.info('Excel column Data match with null');
              if (String(vars["IndividualHeaderNameUI"]) === String(appconstants.HEDER_NAME_CCODE)) {
                log.info('Individual Header Name UI match with CCode');
                vars['IndividualColumnDataUI'] = 'null';
              }
              else {
                vars['IndividualColumnDataExcel'] = '-';
              }

            }
            else if (String(vars['IndividualColumnDataUI']) === String(appconstants.ACTIVE_DRAFT_TEXT)) {
              log.info('Individual Column Data UI match with ACTIVE DRAFT');
              Methods.performArithmetic(vars["SplitCount"], 'ADDITION', '1', 'SplitCount', 0);
              Methods.splitStringByRegConditionWithPosition(vars["EntireRowDataExcel"], ',', vars["SplitCount"], 'IndividualColumnDataExcel1');
              Methods.concatenate(vars['IndividualColumnDataExcel'], vars['IndividualColumnDataExcel1'], 'IndividualColumnDataExcel');
              Methods.trimWhitespace(vars['IndividualColumnDataExcel'], 'IndividualColumnDataExcel');
            }

            else if (String(vars['IndividualColumnDataExcel']).includes(String(appconstants.ET))) {
              log.info('Excel Data row data contains ET');
              Methods.removeCharactersFromPosition(vars['IndividualColumnDataExcel'], '0', '9', 'IndividualColumnDataExcel');
            }

            expect(Methods.verifyString(vars['IndividualColumnDataUI'], 'equals', vars['IndividualColumnDataExcel']));

            Methods.performArithmetic(vars["ColumnCount"], 'ADDITION', '1', 'ColumnCount', 0);
            Methods.performArithmetic(vars["SplitCount"], 'ADDITION', '1', 'SplitCount', 0);
          }
          Methods.performArithmetic(vars["RowCount"], 'ADDITION', '1', 'RowCount', 0);
        }
        log.stepPass('Exported file row data verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Exported file row data verification failed at column: ' + vars["ColumnCount"] + 'Row: ' + vars["RowCount"]);
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