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

const TC_ID = 'REG_TS15_TC01';
const TC_TITLE = 'Verify download file and committed loans details';

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
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    vars['DownloadDir'] = path.join(process.cwd(), 'downloads');
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Login to CORR portal and navigate to Commitment List');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['BidReqId'] = (await commitmentListPage.First_Bid_Req_IDCommitment_List.first().textContent() || '');
        Methods.trimtestdata(vars['BidReqId'], 'BidReqId');
        log.stepPass('Login successful and navigated to Commitment List. BidReqId: ' + vars['BidReqId']);
      } catch (e) {
        log.stepFail(page, 'Failed to login or navigate to Commitment List');
        throw e;
      }

      log.step('Opening commitment details and downloading committed loans file');
      try {
        await commitmentListPage.First_Commitment_IDCommitment_List.first().click();
        await commitmentListPage.Total_Committed_Loans_Tab.waitFor({ state: 'visible' });
        await commitmentListPage.Total_Committed_Loans_Tab.click();
        await priceOfferedPage.Download_File.first().waitFor({ state: 'visible' });
        vars['CommitmentID'] = (await priceOfferedPage.Commit_IDCommitment_List.first().textContent() || '');
        Methods.trimtestdata(vars['CommitmentID'], 'CommitmentID');
        Methods.concatenate('commitment_', vars['CommitmentID'], 'ExpectedFileName');
        Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'TimeStamp', appconstants.ASIA_KOLKATA);
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          priceOfferedPage.Download_File.first().click()
        ]);
        log.info('File downloaded successfully');
        Methods.getCurrentTimestamp(appconstants.DATE_TIME_FORMAT_EXCEL_EST, 'CurresntEstDateAndTime', appconstants.AMERICA_NEW_YORK);
        Methods.concatenateWithSpace(vars['CurresntEstDateAndTime'], 'ET', 'ExpectedReportGenTime');
        vars['SavedFileName'] = vars['TimeStamp'] + '_' + download.suggestedFilename();
        vars['FilePathTotalCommittedLoans'] = path.join(vars['DownloadDir'], vars['SavedFileName']);
        await download.saveAs(vars['FilePathTotalCommittedLoans']);
        expect(Methods.verifyString(vars['SavedFileName'], "contains", vars['ExpectedFileName']));
        log.stepPass('File downloaded and saved CommitmentID:' + vars['CommitmentID']);
      } catch (e) {
        log.stepFail(page, 'Failed to open commitment details or download committed loans file');
        throw e;
      }

      log.step('Validating row count between UI and Excel');
      try {
        vars['TotalLoansRowsCountUI'] = String(await commitmentListPage.First_Commitment_Rows.count());
        log.info('Rows Count UI: ' + vars['TotalLoansRowsCountUI']);
        vars['AllLoansRowsCountExcel'] = String(excelHelper.getAllRowCount(vars['FilePathTotalCommittedLoans'], 0));
        log.info('Rows Count Excel: ' + vars['AllLoansRowsCountExcel']);
        expect(Methods.verifyComparison(vars['TotalLoansRowsCountUI'], "==", vars['AllLoansRowsCountExcel']));
        log.stepPass('Row count verified. UI: ' + vars['TotalLoansRowsCountUI'] + ' | Excel: ' + vars['AllLoansRowsCountExcel']);
      } catch (e) {
        log.stepFail(page, 'Row count mismatch between UI and Excel');
        throw e;
      }

      log.step('Validating header names between UI and Excel');
      try {
        vars['HeaderNamesAllCommitmentLoansExcel'] = excelHelper.readEntireRow(vars['FilePathTotalCommittedLoans'], 0, 0, 'HeaderNamesAllCommitmentLoansExcel');
        Methods.removeSpecialChar('.', vars['HeaderNamesAllCommitmentLoansExcel'], 'HeaderNamesAllCommitmentLoansExcel');
        vars['CountofHeaderNamesUI'] = String(await commitmentListPage.Headers_UIFirst_Commitment.count());
        vars['count'] = appconstants.ONE;
        while (parseFloat(String(vars['count'])) <= parseFloat(String(vars['CountofHeaderNamesUI']))) {
          vars['IndividualHeaderNameCommittedLoansUI'] = await priceOfferedPage.Individual_Header_Name_UI(vars['count']).textContent() || '';
          if (String(vars['IndividualHeaderNameCommittedLoansUI']).includes('.')) {
            Methods.removeSpecialChar('.', vars['IndividualHeaderNameCommittedLoansUI'], 'IndividualHeaderNameCommittedLoansUI');
          }
          Methods.trimWhitespace(vars['IndividualHeaderNameCommittedLoansUI'], 'IndividualHeaderNameCommittedLoansUI');
          Methods.splitStringByRegConditionWithPosition(vars['HeaderNamesAllCommitmentLoansExcel'], ',', vars['count'], 'IndividualHeaderNameAllCommitmentsLoansExcel');
          Methods.trimWhitespace(vars['IndividualHeaderNameAllCommitmentsLoansExcel'], 'IndividualHeaderNameAllCommitmentsLoansExcel');
          if (String(vars['IndividualHeaderNameCommittedLoansUI']) === 'LoanAmount') {
            expect(Methods.verifyString(vars['IndividualHeaderNameAllCommitmentsLoansExcel'], "equals", appconstants.LOANAMOUNT_HEADER_EXCEL));
          } else if (String(vars['IndividualHeaderNameCommittedLoansUI']) === 'CurrMarketValue') {
            expect(Methods.verifyString(vars['IndividualHeaderNameAllCommitmentsLoansExcel'], "equals", appconstants.CURRENTMARKETVALUE));

          } else {
            expect(Methods.verifyString(vars['IndividualHeaderNameCommittedLoansUI'], "contains", vars['IndividualHeaderNameAllCommitmentsLoansExcel']));
          }
          Methods.MathematicalOperation(vars['count'], "+", "1", "count");
        }
        log.stepPass('All header names verified between UI and Excel');
      } catch (e) {
        log.stepFail(page, 'Header name verification failed between UI and Excel');
        throw e;
      }

      log.step('Validating row data between UI and Excel');
      try {
        vars['TotalRowsCountUIFirstCommitment'] = String(await commitmentListPage.Total_Rows_Count_UIFirst_Commitment.count());
        await bidRequestDetailsPage.Last_Name_Sort_Button.first().click();
        await priceOfferedPage.Last_Name_Down_ArrowDetails.first().waitFor({ state: 'visible' });
        vars['count'] = appconstants.ONE;
        while (parseFloat(String(vars['count'])) <= parseFloat(String(vars['TotalRowsCountUIFirstCommitment']))) {
          await priceOfferedPage.BidRequestIDTextDetails.click();
          vars['ColumnCountUITotalCommittedLoans'] = String(await commitmentListPage.Column_Count_UICommitted_Loans1(vars['count']).count());
          vars['EntireRowDataAllCommitmentLoansExcel'] = excelHelper.readEntireRow(vars['FilePathTotalCommittedLoans'], 0, vars['count'], 'EntireRowDataAllCommitmentLoansExcel');
          vars['Count'] = appconstants.ONE;
          while (parseFloat(String(vars['Count'])) <= parseFloat(String(vars['ColumnCountUITotalCommittedLoans']))) {
            vars['IndividualCellDataTotalCommittedLoansUI'] = await commitmentListPage.Individual_Cell_DataCommitted_Loans1(vars['count'], vars['Count']).textContent() || '';
            if (String(vars['IndividualCellDataTotalCommittedLoansUI']).includes(appconstants.DOLLAR_SYMBOL)) {
              Methods.removeMultipleSpecialChars(['$', ',', ' '], vars['IndividualCellDataTotalCommittedLoansUI'], 'IndividualCellDataTotalCommittedLoansUI');
            } else if (String(vars['IndividualCellDataTotalCommittedLoansUI']).includes(appconstants.PQ_PR)) {
              Methods.removeCharactersFromPosition(vars['IndividualCellDataTotalCommittedLoansUI'], '0', '10', 'IndividualCellDataTotalCommittedLoansUI');
            } else if (String(vars['IndividualCellDataTotalCommittedLoansUI']).includes(appconstants.PERCENTAGE_SYMBOL)) {
              Methods.removeSpecialChar('%', vars['IndividualCellDataTotalCommittedLoansUI'], 'IndividualCellDataTotalCommittedLoansUI');
            }
            Methods.trimtestdata(vars['IndividualCellDataTotalCommittedLoansUI'], 'IndividualCellDataTotalCommittedLoansUI');
            Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataAllCommitmentLoansExcel'], ',', vars['Count'], 'IndividualRowDataAllCommitmentLoansExcel');
            expect(Methods.verifyString(vars['IndividualCellDataTotalCommittedLoansUI'], "contains", vars['IndividualRowDataAllCommitmentLoansExcel']));
            Methods.MathematicalOperation(vars['Count'], "+", "1", "Count");
          }
          Methods.MathematicalOperation(vars['count'], "+", "1", "count");
        }
        log.stepPass('All row data verified between UI and Excel');
      } catch (e) {
        log.stepFail(page, 'Row data verification failed between UI and Excel');
        throw e;
      }

      log.step('Validating Excel meta info sheet data');
      try {
        vars['EntireRowDataExcelMetaInfo1'] = excelHelper.readEntireRow(vars['FilePathTotalCommittedLoans'], 1, 0, 'EntireRowDataExcelMetaInfo1');
        Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataExcelMetaInfo1'], ',', 1, 'BidReqNumTextExcelMetaInfo');
        expect(Methods.verifyString(vars['BidReqNumTextExcelMetaInfo'], "equals", appconstants.BIDREQUESTNUMBER_METAINFO));
        Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataExcelMetaInfo1'], ',', 2, 'BidReqIdExcelMetaInfo');
        expect(Methods.verifyString(vars['BidReqIdExcelMetaInfo'], "equals", vars['BidReqId']));
        vars['EntireRowDataExcelMetaInfo2'] = excelHelper.readEntireRow(vars['FilePathTotalCommittedLoans'], 1, 1, 'EntireRowDataExcelMetaInfo2');
        Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataExcelMetaInfo2'], ',', 1, 'CommitmentOrderNumTextExcelMetaInfo');
        expect(Methods.verifyString(vars['CommitmentOrderNumTextExcelMetaInfo'], "equals", appconstants.COMMITORDERNUMBER_METAINFO));
        Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataExcelMetaInfo2'], ',', 2, 'CommitmentIdExcelMetaInfo');
        expect(Methods.verifyString(vars['CommitmentIdExcelMetaInfo'], "equals", vars['CommitmentID']));
        vars['EntireRowDataExcelMetaInfo3'] = excelHelper.readEntireRow(vars['FilePathTotalCommittedLoans'], 1, 2, 'EntireRowDataExcelMetaInfo3');
        Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataExcelMetaInfo3'], ',', 1, 'ReportGenerationTextExcelMetaInfo');
        expect(Methods.verifyString(vars['ReportGenerationTextExcelMetaInfo'], "equals", appconstants.REPORTGENERATIONTIME_METAINFO));
        Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataExcelMetaInfo3'], ',', 2, 'ReportGenTimeExcelMetaInfo');
        expect(Methods.verifyString(vars['ExpectedReportGenTime'], "equals", vars['ReportGenTimeExcelMetaInfo']));
        log.stepPass('Excel meta info sheet data verified successfully');
      } catch (e) {
        log.stepFail(page, 'Excel meta info sheet verification failed');
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