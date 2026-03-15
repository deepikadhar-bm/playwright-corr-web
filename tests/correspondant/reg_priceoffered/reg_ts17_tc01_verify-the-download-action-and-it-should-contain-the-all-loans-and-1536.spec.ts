import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { runPrereq_1394 } from '../../../src/helpers/prereqs/prereq-1394';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
// import { ENV } from '@config/environments';


const TC_ID = 'REG_TS17_TC01';
const TC_TITLE = 'Verify the download action and it should contain the all loans and locked loans information as present in the UI';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  // const credentials = ENV.getCredentials('internal');


  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1394(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    // vars['Username'] = credentials.username;
    // vars['Password'] = credentials.password;
    // await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    vars['DownloadDir'] = path.join(process.cwd(), 'downloads');
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Navigating to Price Offered and committing a fresh loan');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['BidReqID'] = vars['RequestIDDetails'];
         log.info('BidReqID: ' + vars['BidReqID']);
         vars['BidReqID'] = "870Q25B27A61";
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqID']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Commits_an_Fresh_Loan_Num(page, vars);
        log.stepPass('successfully committed a fresh loan number for Bid Request ID: ' + vars['BidReqID']);
      } catch (e) {
        log.stepFail(page, 'Failed to commit fresh loan on Price Offered page');
        throw e;
      }

      log.step('Downloading the Price Offer details file and verifying filename');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.clear();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqID']);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.keyboard.press('Enter');
        await  priceOfferedPage.Required_BidRequestID(vars["BidReqID"]).first().click();
        await priceOfferedPage.Download_File.waitFor({ state: 'visible' });
        Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'TimeStamp', appconstants.ASIA_KOLKATA);
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          priceOfferedPage.Download_File.click()
        ]);
        Methods.getCurrentTimestamp(appconstants.DATE_TIME_FORMAT_EXCEL_EST, 'CurrentDateAndTime', appconstants.America_New_York);
        Methods.concatenateWithSpace(vars['CurrentDateAndTime'], 'ET', 'ExpectedReportGenTime');
        log.info('Expected Report Gen Time: ' + vars['ExpectedReportGenTime']);
        vars['DownloadedFileName'] = vars['TimeStamp'] + '_' + download.suggestedFilename();
        log.info('Downloaded File Name: ' + vars['DownloadedFileName']);
        vars['RecentDownloadedFilePath'] = path.join(vars['DownloadDir'], vars['DownloadedFileName']);
        await download.saveAs(vars['RecentDownloadedFilePath']);
        vars['ExpectedDownloadedFileName'] = 'Price_Offer_details_' + vars['BidReqID'];
        expect(Methods.verifyString(vars['DownloadedFileName'], 'contains', vars['ExpectedDownloadedFileName'])); 
        log.stepPass('File downloaded and filename verified: ' + vars['SavedFileName']);
      } catch (e) {
        log.stepFail(page, 'Failed to download file or verify filename');
        throw e;
      }

      log.step('Verifying All Loans row count and header names match between UI and Excel');
      try {
        vars['AllLoansRowsCountUI'] = String(await priceOfferedPage.Row_Count.count());
        log.info('AllLoans Rows Count UI: ' + vars['AllLoansRowsCountUI']);
        vars['AllLoansRowsCountExcel'] = String(excelHelper.getAllRowCount(vars['RecentDownloadedFilePath'], 0));
        Methods.MathematicalOperation(vars['AllLoansRowsCountExcel'],"-","1",'AllLoansRowsCountExcel');
        expect(Methods.verifyComparison(vars['AllLoansRowsCountUI'], '==', vars['AllLoansRowsCountExcel']));
        vars['HeaderNamesExcelAllLoans'] = excelHelper.readEntireRow(vars['RecentDownloadedFilePath'], 0, 0, 'HeaderNamesExcelAllLoans');
        Methods.removeSpecialChar('.', vars['HeaderNamesExcelAllLoans'], 'HeaderNamesExcelAllLoans');
        vars['CountofHeaderNamesUI'] = String(await priceOfferedPage.Header_Names_UI.count());
        vars['count'] = appconstants.ONE;
        while (parseFloat(vars['count']) <= parseFloat(vars['CountofHeaderNamesUI'])) {
          vars['IndividualHeaderNameUIAllLoans'] = await priceOfferedPage.Individual_Header_Name_UI(vars['count']).textContent() || '';
          if (vars['IndividualHeaderNameUIAllLoans'].includes('.')) {
            Methods.removeSpecialChar('.', vars['IndividualHeaderNameUIAllLoans'], 'IndividualHeaderNameUIAllLoans');
          }
          Methods.trimWhitespace(vars['IndividualHeaderNameUIAllLoans'], 'IndividualHeaderNameUIAllLoans');
          Methods.splitStringByRegConditionWithPosition(vars['HeaderNamesExcelAllLoans'], ',', vars['count'], 'IndividualHeaderNameExcelAllLoans');
          Methods.trimWhitespace(vars['IndividualHeaderNameExcelAllLoans'], 'IndividualHeaderNameExcelAllLoans');
          if (vars['IndividualHeaderNameUIAllLoans'] === 'LoanAmount') {
            expect(Methods.verifyString(vars['IndividualHeaderNameExcelAllLoans'], 'equals', appconstants.LOANAMOUNT_HEADER_EXCEL));
          } else {
            expect(Methods.verifyString(vars['IndividualHeaderNameUIAllLoans'], 'contains', vars['IndividualHeaderNameExcelAllLoans']));
          }
          Methods.MathematicalOperation(vars['count'], '+', '1', 'count');
        }
        log.stepPass('All Loans row count and header names verified against Excel');
      } catch (e) {
        log.stepFail(page, 'Failed to verify All Loans row count or header names against Excel');
        throw e;
      }
      log.step('Verifying All Loans row data matches between UI and Excel');
      try {
        vars['TotalRowsCountUIAllLoans'] = String(await priceOfferedPage.Total_Rows_Count_UIDetails.count());
        await bidRequestDetailsPage.Last_Name_Sort_Button.first().click();
        await priceOfferedPage.Last_Name_Down_ArrowDetails.first().waitFor({ state: 'visible' });
        vars['count'] = appconstants.ONE;
        while (parseFloat(vars['count']) <= parseFloat(vars['TotalRowsCountUIAllLoans'])) {
          await priceOfferedPage.BidRequestIDTextDetails.click();
          vars['EntireRowDataExcelAllLoans'] = excelHelper.readEntireRow(vars['RecentDownloadedFilePath'], 0, vars['count'], 'EntireRowDataExcelAllLoans');
          vars['ColumnCountUIAllLoans'] = String(await priceOfferedPage.Column_Count_UIPrice_Offered_Details(vars["count"]).count());
          vars['Count'] = appconstants.ONE;
          while (parseFloat(vars['Count']) <= parseFloat(vars['ColumnCountUIAllLoans'])) {
            vars['IndividualCellDataAllLoansUI'] = await priceOfferedPage.Individual_Cell_Data_UI(vars["Count"],vars["count"]).textContent() || '';
            log.info("IndividualCellDataAllLoansUI:"+vars['IndividualCellDataAllLoansUI']);
            if (vars['IndividualCellDataAllLoansUI'].includes(appconstants.DOLLAR_SYMBOL)) {
              Methods.removeMultipleSpecialChars(['$', ',', ' '], vars['IndividualCellDataAllLoansUI'], 'IndividualCellDataAllLoansUI');
            } else if (vars['IndividualCellDataAllLoansUI'].includes(appconstants.PQ_PR)) {
              Methods.removeCharactersFromPosition(vars['IndividualCellDataAllLoansUI'], '0', '10', 'IndividualCellDataAllLoansUI');
            } else if (vars['IndividualCellDataAllLoansUI'].includes(appconstants.PERCENTAGE_SYMBOL)) {
              Methods.removeSpecialChar('%', vars['IndividualCellDataAllLoansUI'], 'IndividualCellDataAllLoansUI');
            }
            Methods.trimtestdata(vars['IndividualCellDataAllLoansUI'], 'IndividualCellDataAllLoansUI');
            Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataExcelAllLoans'], ',', vars['Count'], 'IndividualRowDataExcelAllLoans');
            if (vars['IndividualCellDataAllLoansUI'] === '-') {
              expect(Methods.verifyString(vars['IndividualRowDataExcelAllLoans'], 'equals', '0.000'));
            } else {
              expect(Methods.verifyString(vars['IndividualCellDataAllLoansUI'], 'contains', vars['IndividualRowDataExcelAllLoans']));
            }
            Methods.MathematicalOperation(vars['Count'], '+', '1', 'Count');
          }
          Methods.MathematicalOperation(vars['count'], '+', '1', 'count');
        }
        log.info('TotalRowsCountUIAllLoans: ' + vars['TotalRowsCountUIAllLoans']);
        log.stepPass('All Loans row data verified successfully against Excel');
      } catch (e) {
        log.stepFail(page, 'Failed to verify All Loans row data against Excel');
        throw e;
      }

      log.step('Navigating to Locked Loans tab and verifying header names and locked loan data against Excel');
      try {
        await priceOfferedPage.LockedCommitted_Loans.click();
        await expect(priceOfferedPage.Paste_Loans_ButtonPrice_Offered_Page).not.toBeVisible();
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).not.toBeVisible();
        vars['LockedLoansRowsCountUI'] = String(await priceOfferedPage.Row_Count.count());
        log.info('Locked loans Rows Count UI: ' + vars['LockedLoansRowsCountUI']);
        vars['LockedLoansRowsCountExcel'] = String(excelHelper.getAllRowCount(vars['RecentDownloadedFilePath'], 1));
        Methods.MathematicalOperation(vars['LockedLoansRowsCountExcel'],"-","1",'LockedLoansRowsCountExcel');
        expect(Methods.verifyComparison(vars['LockedLoansRowsCountUI'], '==', vars['LockedLoansRowsCountExcel']));
        await stepGroups.stepGroup_Verifying_Header_Names_From_UI_to_Excel(page, vars);
        await stepGroups.stepGroup_Verifying_Locked_Loans_Data_from_UI_to_Excel(page, vars);
        log.stepPass('Locked Loans header names and data verified successfully against Excel');
      } catch (e) {
        log.stepFail(page, 'Failed to verify Locked Loans header names or data against Excel');
        throw e;
      }
      log.step('Verifying Excel metadata - Bid Request Number and Report Generation Time');
      try {
        vars['EntireRowDataExcelMetaInfo1'] = excelHelper.readEntireRow(vars['RecentDownloadedFilePath'], 2, 0, 'EntireRowDataExcelMetaInfo1');
        Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataExcelMetaInfo1'], ',', 1, 'BidReqNumTextExcelMetaInfo');
        expect(Methods.verifyString(vars['BidReqNumTextExcelMetaInfo'], 'equals', appconstants.BIDREQUESTNUMBER_METAINFO));
        Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataExcelMetaInfo1'], ',', 2, 'BidReqIdExcelMetaInfo');
        expect(Methods.verifyString(vars['BidReqIdExcelMetaInfo'], 'equals', vars['BidReqID']));
        vars['EntireRowDataExcelMetaInfo2'] = excelHelper.readEntireRow(vars['RecentDownloadedFilePath'], 2, 1, 'EntireRowDataExcelMetaInfo2');
        Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataExcelMetaInfo2'], ',', 1, 'ReportGenerationTextExcelMetaInfo');
        expect(Methods.verifyString(vars['ReportGenerationTextExcelMetaInfo'], 'equals', appconstants.REPORTGENERATIONTIME_METAINFO));
        Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataExcelMetaInfo2'], ',', 2, 'ReportGenTimeExcelMetaInfo');
        expect(Methods.verifyString(vars['ExpectedReportGenTime'], 'equals', vars['ReportGenTimeExcelMetaInfo']));
        log.info('BidReqIdExcelMetaInfo: ' + vars['BidReqIdExcelMetaInfo']);
        log.info('ReportGenTimeExcelMetaInfo: ' + vars['ReportGenTimeExcelMetaInfo']);
        log.stepPass('Excel metadata verified — Bid Request Number and Report Generation Time match');
      } catch (e) {
        log.stepFail(page, 'Failed to verify Excel metadata for Bid Request Number or Report Generation Time');
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