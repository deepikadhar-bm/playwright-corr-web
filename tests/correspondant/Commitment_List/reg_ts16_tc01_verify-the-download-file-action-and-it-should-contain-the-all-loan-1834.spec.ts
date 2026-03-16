import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID    = 'REG_TS16_TC01';
const TC_TITLE = 'Verify the download file action and it should contain the all loans and locked loans information as present in the UI';

test.describe('Commitment List - TS_1', () => {

  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
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
    bidRequestDetailsPage   = new BidRequestDetailsPage(page);
    commitmentListPage      = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage        = new PriceOfferedPage(page);
    spinnerPage             = new SpinnerPage(page);
    Methods                 = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    vars['DownloadDir'] = path.join(process.cwd(), 'downloads');
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

      log.step('Navigate to Commitment List and capture Bid Request ID');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['BidReqId'] = await commitmentListPage.First_Bid_Req_IDCommitment_List.first().textContent() || '';
        Methods.trimtestdata(vars['BidReqId'], 'BidReqId');
        log.stepPass('Navigated to Commitment List BidReqId: ' + vars['BidReqId']);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Commitment List');
        throw e;
      }

      log.step('Open Total Loans tab and download committed loans file');
      try {
        await commitmentListPage.First_Commitment_IDCommitment_List.first().click();
        await commitmentListPage.Total_LoansCommitment_List.waitFor({ state: 'visible' });
        await commitmentListPage.Total_LoansCommitment_List.click();
        await priceOfferedPage.Download_File.waitFor({ state: 'visible' });
        Methods.concatenate('Price_Offer_details_', vars['BidReqId'], 'ExpectedFileName');
        Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'TimeStamp', appconstants.ASIA_KOLKATA);
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          priceOfferedPage.Download_File.click()
        ]);
        Methods.getCurrentTimestamp(appconstants.DATE_TIME_FORMAT_EXCEL_EST, 'CurresntEstDateAndTime', appconstants.America_New_York);
        Methods.concatenateWithSpace(vars['CurresntEstDateAndTime'], 'ET', 'ExpectedReportGenTime');
        vars['SavedFileName'] = vars['TimeStamp'] + '_' + download.suggestedFilename();
        vars['FilePathTotalLoans'] = path.join(vars['DownloadDir'], vars['SavedFileName']);
        await download.saveAs(vars['FilePathTotalLoans']);
        expect(Methods.verifyString(vars['SavedFileName'], 'contains', vars['ExpectedFileName']));
        log.stepPass('File downloaded. FileName: ' + vars['SavedFileName']);
      } catch (e) {
        await log.stepFail(page, 'Failed to download committed loans file');
        throw e;
      }

      log.step('Validate row count between UI and Excel');
      try {
        vars['TotalLoansRowsCountUI'] = String(await priceOfferedPage.Row_Count_UI.count());
        log.info('Rows count UI: ' + vars['TotalLoansRowsCountUI']);
        vars['AllLoansRowsCountExcel'] = String(excelHelper.getAllRowCount(vars['FilePathTotalLoans'], 0));
        log.info('Rows count Excel: ' + vars['AllLoansRowsCountExcel']);
        expect(Methods.verifyComparison(vars['TotalLoansRowsCountUI'], '==', vars['AllLoansRowsCountExcel']));
        log.stepPass('Rows count verified with rows count  UI: ' + vars['TotalLoansRowsCountUI'] + ' Excel: ' + vars['AllLoansRowsCountExcel']);
      } catch (e) {
        await log.stepFail(page, 'Row count mismatch. UI: ' + vars['TotalLoansRowsCountUI'] + ' Excel: ' + vars['AllLoansRowsCountExcel']);
        throw e;
      }

      log.step('Validate Total Loans header names between UI and Excel');
      try {
        vars['HeaderNamesTotalLoansExcel'] = excelHelper.readEntireRow(vars['FilePathTotalLoans'], 0, 0, 'HeaderNamesTotalLoansExcel');
        Methods.removeSpecialChar('.', vars['HeaderNamesTotalLoansExcel'], 'HeaderNamesTotalLoansExcel');
        vars['CountofHeaderNamesUI'] = String(await commitmentListPage.Headers_Names_UICommitment_List.count());
        vars['count'] = appconstants.ONE;
        while (parseFloat(vars['count']) <= parseFloat(vars['CountofHeaderNamesUI'])) {
          log.info("Iteration:"+vars['count']);
          vars['IndividualHeaderNameTotalLoansUI'] = await commitmentListPage.Individual_Header_Names_UICommitment_List(vars['count']).textContent() || '';
          if (vars['IndividualHeaderNameTotalLoansUI'].includes('.')) {
            Methods.removeSpecialChar('.', vars['IndividualHeaderNameTotalLoansUI'], 'IndividualHeaderNameTotalLoansUI');
          }
          Methods.trimWhitespace(vars['IndividualHeaderNameTotalLoansUI'], 'IndividualHeaderNameTotalLoansUI');
          Methods.splitStringByRegConditionWithPosition(vars['HeaderNamesTotalLoansExcel'], ',', vars['count'], 'IndividualHeaderNameTotalLoansExcel');
          Methods.trimWhitespace(vars['IndividualHeaderNameTotalLoansExcel'], 'IndividualHeaderNameTotalLoansExcel');
          if (vars['IndividualHeaderNameTotalLoansUI'] === 'LoanAmount') {
            expect(Methods.verifyString(vars['IndividualHeaderNameTotalLoansExcel'], 'equals', appconstants.LOANAMOUNT_HEADER_EXCEL));
          } else {
            expect(Methods.verifyString(vars['IndividualHeaderNameTotalLoansUI'], 'contains', vars['IndividualHeaderNameTotalLoansExcel']));
          }
          Methods.MathematicalOperation(vars['count'], '+', '1', 'count');
        }
        log.stepPass('Total Loans header names verified between UI and Excel');
      } catch (e) {
        await log.stepFail(page, 'Total Loans header name mismatch. UI: ' + vars['IndividualHeaderNameTotalLoansUI'] + ' | Excel: ' + vars['IndividualHeaderNameTotalLoansExcel']);
        throw e;
      }

      log.step('Validate Total Loans row data between UI and Excel');
      try {
        vars['TotalRowsCountUITotalLoans'] = String(await priceOfferedPage.Total_Rows_Count_UIDetails.count());
        await bidRequestDetailsPage.Last_Name_Sort_Button.click();
        await priceOfferedPage.Last_Name_Down_ArrowDetails.waitFor({ state: 'visible' });
        vars['count'] = appconstants.ONE;
        while (parseFloat(vars['count']) <= parseFloat(vars['TotalRowsCountUITotalLoans'])) {
          log.info("Row No:"+ vars['count']);
          vars['EntireRowDataTotalLoansExcel'] = excelHelper.readEntireRow(vars['FilePathTotalLoans'], 0, vars['count'], 'EntireRowDataTotalLoansExcel');
          await priceOfferedPage.BidRequestIDTextDetails.click();
          vars['ColumnCountUITotalLoans'] = String(await commitmentListPage.Column_Count_UICommitment_List(vars['count']).count());
          vars['Count'] = appconstants.ONE;
          while (parseFloat(vars['Count']) <= parseFloat(vars['ColumnCountUITotalLoans'])) {
            log.info("Iteration:"+vars['Count']);
            vars['IndividualCellDataTotalLoansUI'] = await commitmentListPage.Individual_Cell_Data_UITotal_Loans_Tab(vars['count'], vars['Count']).textContent() || '';
            if (vars['IndividualCellDataTotalLoansUI'].includes(appconstants.DOLLAR_SYMBOL)) {
              Methods.removeMultipleSpecialChars(['$', ',', ' '], vars['IndividualCellDataTotalLoansUI'], 'IndividualCellDataTotalLoansUI');
            } else if (vars['IndividualCellDataTotalLoansUI'].includes(appconstants.PQ_PR)) {
              Methods.removeCharactersFromPosition(vars['IndividualCellDataTotalLoansUI'], '0', '10', 'IndividualCellDataTotalLoansUI');
            } else if (vars['IndividualCellDataTotalLoansUI'].includes(appconstants.PERCENTAGE_SYMBOL)) {
              Methods.removeSpecialChar('%', vars['IndividualCellDataTotalLoansUI'], 'IndividualCellDataTotalLoansUI');
            }
            Methods.trimtestdata(vars['IndividualCellDataTotalLoansUI'], 'IndividualCellDataTotalLoansUI');
            Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataTotalLoansExcel'], ',', vars['Count'], 'IndividualRowDataTotalLoansExcel');
            expect(Methods.verifyString(vars['IndividualCellDataTotalLoansUI'], 'contains', vars['IndividualRowDataTotalLoansExcel']));
            Methods.MathematicalOperation(vars['Count'], '+', '1', 'Count');
          }
          Methods.MathematicalOperation(vars['count'], '+', '1', 'count');
        }
        log.stepPass('Total Loans row data verified  Rows: ' + vars['TotalRowsCountUITotalLoans']);
      } catch (e) {
        await log.stepFail(page, 'Total Loans row data mismatch at row: ' + vars['count'] + ' col: ' + vars['Count']);
        throw e;
      }

      log.step('Validate Locked Loans header names between UI and Excel');
      try {
        await stepGroups.stepGroup_Verifying_Header_Names_From_UI_to_ExcelCommitment_List(page, vars);
        log.stepPass('Locked Loans header names verified');
      } catch (e) {
        await log.stepFail(page, 'Locked Loans header name verification failed');
        throw e;
      }

      log.step('Validate Locked Loans row data between UI and Excel');
      try {
        await stepGroups.stepGroup_Verifying_Locked_Loans_Data_UI_to_Excel_CommitmentList(page, vars);
        log.stepPass('Locked Loans row data verified');
      } catch (e) {
        await log.stepFail(page, 'Locked Loans row data verification failed');
        throw e;
      }

      log.step('Validate Excel meta info sheet data');
      try {
        vars['EntireRowDataExcelMetaInfo1'] = excelHelper.readEntireRow(vars['FilePathTotalLoans'], 2, 0, 'EntireRowDataExcelMetaInfo1');
        Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataExcelMetaInfo1'], ',', 1, 'BidReqNumTextExcelMetaInfo');
        expect(Methods.verifyString(vars['BidReqNumTextExcelMetaInfo'], 'equals', appconstants.BIDREQUESTNUMBER_METAINFO));
        Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataExcelMetaInfo1'], ',', 2, 'BidReqIdExcelMetaInfo');
        expect(Methods.verifyString(vars['BidReqIdExcelMetaInfo'], 'equals', vars['BidReqId']));
        vars['EntireRowDataExcelMetaInfo3'] = excelHelper.readEntireRow(vars['FilePathTotalLoans'], 2, 1, 'EntireRowDataExcelMetaInfo3');
        Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataExcelMetaInfo3'], ',', 1, 'ReportGenerationTextExcelMetaInfo');
        expect(Methods.verifyString(vars['ReportGenerationTextExcelMetaInfo'], 'equals', appconstants.REPORTGENERATIONTIME_METAINFO));
        Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataExcelMetaInfo3'], ',', 2, 'ReportGenTimeExcelMetaInfo');
        expect(Methods.verifyString(vars['ExpectedReportGenTime'], 'equals', vars['ReportGenTimeExcelMetaInfo']));
        log.stepPass('Excel meta info sheet verified. BidReqId: ' + vars['BidReqId']);
      } catch (e) {
        await log.stepFail(page, 'Excel meta info sheet verification failed');
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