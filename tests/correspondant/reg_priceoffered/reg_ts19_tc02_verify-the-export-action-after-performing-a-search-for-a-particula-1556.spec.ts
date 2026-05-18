import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { Logger as log } from '../../../src/helpers/log-helper';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { ENV } from '@config/environments';


const TC_ID = 'REG_TS19_TC02';
const TC_TITLE = 'Verify the Export action after performing a search for a particular bid.';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    vars['DownloadDir'] = path.join(process.cwd(), 'downloads');
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Login to CORR Portal and navigate to Price Offered list');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        log.stepPass('Login to CORR Portal and navigated to Price Offered list successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to login to CORR Portal or navigate to Price Offered list');
        throw e;
      }

      log.step('Capture first bid request ID and search for it');
      try {
        vars['FirstBidReqId'] = await correspondentPortalPage.First_Bid_Request_ID.first().textContent() || '';
        Methods.trimtestdata(vars['FirstBidReqId'], 'FirstBidReqId');
        log.info('FirstBidReqId: ' + vars['FirstBidReqId']);
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.type(vars['FirstBidReqId']);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['RowCount'] = String(await priceOfferedPage.Total_Rows_Count_UIDetails.count());
        log.info('Total rows count UI: ' + vars['RowCount']);
        log.stepPass('First bid request ID captured and searched successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture first bid request ID or search for it');
        throw e;
      }

      log.step('Select all loans and verify Export Selected button is enabled');
      try {
        await priceOfferedPage.Select_All_Loan_Num.check();
        await expect(priceOfferedPage.Select_All_Loan_Num).toBeChecked();
        await correspondentPortalPage.Export_Selected_1_Button.waitFor({ state: 'visible' });
        await expect(correspondentPortalPage.Export_Selected_1_Button).toBeEnabled();
        log.stepPass('All loans selected and Export Selected button verified as enabled successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to select all loans or verify Export Selected button');
        throw e;
      }

      log.step('Download exported file and save');
      try {
        Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'TimeStamp', appconstants.ASIA_KOLKATA);
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          correspondentPortalPage.Export_Selected_1_Button.click()
        ]);
        vars['SavedFileName'] = vars['TimeStamp'] + '_' + download.suggestedFilename();
        vars['ExportFilePath'] = path.join(vars['DownloadDir'], vars['SavedFileName']);
        await download.saveAs(vars['ExportFilePath']);
        log.info('SavedFileName: ' + vars['SavedFileName']);
        log.info('ExportFilePath: ' + vars['ExportFilePath']);
        log.stepPass('Exported file downloaded and saved successfully. FileName: ' + vars['SavedFileName']);
      } catch (e) {
        await log.stepFail(page, 'Failed to download or save exported file');
        throw e;
      }

      log.step('Verify headers of exported file against UI headers');
      try {
        await stepGroups.stepGroup_Headers_Verification_Price_Offered(page, vars);
        log.stepPass('Headers of exported file verified against UI headers successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify headers of exported file');
        throw e;
      }

      log.step('Verify row and column data between UI and exported Excel file');
      try {
        vars['RowCountUI'] = appconstants.ONE;
        vars['RowCountExcel'] = appconstants.ONE;
        while (parseFloat(String(vars['RowCountUI'])) <= parseFloat(String(vars['RowCount']))) {
          log.info('Row iteration - RowCountUI: ' + vars['RowCountUI'] + ' | RowCountExcel: ' + vars['RowCountExcel']);
          vars['ColumnCountUI'] = appconstants.TWO;
          vars['indexExcel'] = appconstants.ONE;
          vars['EntireRowDataExcel'] = excelHelper.readEntireRow(vars['ExportFilePath'], 0, vars['RowCountExcel'], 'EntireRowDataExcel');

          while (parseFloat(String(vars['ColumnCountUI'])) <= parseFloat(String('9'))) {
            log.info('Column iteration - ColumnCountUI: ' + vars['ColumnCountUI'] + ' | indexExcel: ' + vars['indexExcel']);
            Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataExcel'], ',', vars['indexExcel'], 'IndividualCellValueExcel');
            Methods.trimWhitespace(vars['IndividualCellValueExcel'], 'IndividualCellValueExcel');
            vars['IndividualCellValueUI'] = await priceOfferedPage.Individual_Cell_UI(vars['RowCountUI'], vars['ColumnCountUI']).textContent() || '';
            Methods.trimWhitespace(vars['IndividualCellValueUI'], 'IndividualCellValueUI');
            vars['HeadersUI'] = await priceOfferedPage.Headers(vars['indexExcel']).textContent() || '';
            log.info('Header Name UI: ' + vars['HeadersUI']);
            log.info('IndividualCellValueExcel: ' + vars['IndividualCellValueExcel']);
            log.info('IndividualCellValueUI: ' + vars['IndividualCellValueUI']);

            //Handle ET datetime format in Excel value
            if (String(vars['IndividualCellValueExcel']).includes(appconstants.ET)) {
              Methods.removeCharactersFromPosition(vars['IndividualCellValueExcel'], '0', '7', 'IndividualCellValueExcel');
            } else if (String(vars['IndividualCellValueExcel']).includes('_')) {
              Methods.removeSpecialChar('_', vars['IndividualCellValueExcel'], 'IndividualCellValueExcel');
            }

            //Handle special chars in UI value
            if (String(vars['IndividualCellValueUI']).includes('_')) {
              Methods.removeSpecialChar('_', vars['IndividualCellValueUI'], 'IndividualCellValueUI');
            } else if (String(vars['IndividualCellValueUI']).includes('$')) {
              Methods.removeMultipleSpecialChars(['$', ','], vars['IndividualCellValueUI'], 'IndividualCellValueUI');
            }

            // Verify cell value — use contains for status column, equals for all others
            if (String(vars['HeadersUI']).includes(appconstants.STATUS_HEADER_NAME_UI_PRICEOFFERED_LISTSCREEN)) {
              Methods.verifyTestdataIgnoreCase(vars['IndividualCellValueUI'], 'contains', vars['IndividualCellValueExcel']);
            } else {
              Methods.verifyString(vars['IndividualCellValueUI'], 'equals', vars['IndividualCellValueExcel']);
            }

            Methods.MathematicalOperation(vars['ColumnCountUI'], '+', '1', 'ColumnCountUI');
            Methods.MathematicalOperation(vars['indexExcel'], '+', '1', 'indexExcel');
          }
          Methods.MathematicalOperation(vars['RowCountExcel'], '+', '1', 'RowCountExcel');
          Methods.MathematicalOperation(vars['RowCountUI'], '+', '1', 'RowCountUI');
        }
        log.stepPass('Row and column data verified between UI and exported Excel file successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify row and column data between UI and Excel at Row: ' + vars['RowCountUI'] + ' Column: ' + vars['ColumnCountUI']);
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