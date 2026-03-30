import { test, expect } from '@playwright/test';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { runPrereq_1873 } from '../../../src/helpers/prereqs/prereq-1873';
import { Logger as log } from '@helpers/log-helper';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS14_TC01.1';
const TC_TITLE = 'Verify the download file action present in the accordian of each commitment, It should display the proper committed loan details';

test.describe('Commitment List - TS_14', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1873(page, vars);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  const profileName = 'Cover Letter Details';
  const profile = testDataManager.getProfileByName(profileName);
  const dataList = profile?.data as Record<string, any>[];

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    
    try {
      //verification of static data in excel
      log.step('Reading and verifying Cover Letter Header and Data from Excel Part 1');
      try {
        vars['CommitmentLetterHeaderExcelPart1'] = excelHelper.readCellByColAndRowIndex(vars['FilePath'], 0, 3, 0);
        Methods.verifyString(vars['CommitmentLetterHeaderExcelPart1'], 'equals', appconstants.CORR_NAME_WITHCCODE);
        vars['CommitmentLetterDataExcelPart1'] = excelHelper.readCellByColAndRowIndex(vars['FilePath'], 0, 3, 1);
        Methods.trimWhitespace(vars['CommitmentLetterDataExcelPart1'], 'CommitmentLetterDataExcelPart1');
        Methods.verifyString(vars['CommitmentLetterDataExcelPart1'], 'contains', vars['CompanyNameWithCCodeUI']);
        vars['CommitmentLetterHeaderExcelPart1'] = excelHelper.readCellByColAndRowIndex(vars['FilePath'], 0, 3, 3);
        Methods.verifyString(vars['CommitmentLetterHeaderExcelPart1'], 'equals', appconstants.USER_NAME_TEXT);
        vars['CommitmentLetterDataExcelPart1'] = excelHelper.readCellByColAndRowIndex(vars['FilePath'], 0, 3, 4);
        Methods.verifyString(vars['CommitmentLetterDataExcelPart1'], 'contains', appconstants.CHASE_CORR_TEXT);
        log.stepPass('Successfully verified Cover Letter Header and Data from Excel Part 1');
      } catch (e) {
        log.stepFail(page, 'Failed to verify Cover Letter Header and Data from Excel Part 1');
        throw e;
      }
     //verification of Cover Letter Details
      log.step('Iterating rows 9 to 15 and verifying row data against TestDataProfile');
      try {
        vars['RowCount'] = appconstants.NINE;
        vars['tdpcount'] = appconstants.ZERO;
        while (parseFloat(String(vars['RowCount'])) <= parseFloat(String(appconstants.FIFTEEN))) {
           log.info('Excel Row Data:'+vars['RowCount']);
          vars['EntireRowDataExcel'] = excelHelper.readEntireRow(vars['FilePath'], 0, vars['RowCount'], 'EntireRowDataExcel');
          await commitmentListPage.Download_File_TextPopup.click();
          log.info('readed excel data:' + vars['EntireRowDataExcel']);

          if (String(vars['EntireRowDataExcel']).includes(String('null,null,null,null,null,null'))) {
            log.info('if condition is passed excel data contains null');
          } else if (String(vars['EntireRowDataExcel']).includes(String('N/A,null,N/A,null,N/A'))) {
            log.info('else if condition is passed excel data contains null');
          } else {
            vars['SplitHeaderCount'] = appconstants.ONE;
            vars['SplitIndex'] = appconstants.TWO;
            vars['ColumnCount'] = appconstants.ONE;

            while (parseFloat(String(vars['ColumnCount'])) <= parseFloat(String(appconstants.THREE))) {
              log.info('Excel Column Data:'+vars['ColumnCount']);
              Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataExcel'], ',', vars['SplitHeaderCount'], 'IndividualHeaderNameExcel');
              Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataExcel'], ',', vars['SplitIndex'], 'IndividualValueExcel');
              vars['HeaderName'] = dataList[Number(vars['tdpcount'])]['HeaderName'];
              log.info('Header Name from tdp: ' + vars['HeaderName']);
              vars['ChaseInfo'] = dataList[Number(vars['tdpcount'])]['ChaseInfo'];
              log.info('ChaseInfo from tdp: ' + vars['ChaseInfo']);

              if (String(vars['IndividualValueExcel']).includes(appconstants.DOLLAR_SYMBOL)) {
                Methods.countCharacter(vars['ChaseInfo'], ',', 'CountofCama');
                vars['count1'] = appconstants.ONE;
                while (parseFloat(String(vars['count1'])) <= parseFloat(String(vars['CountofCama']))) {
                  Methods.MathematicalOperation(vars['SplitIndex'], '+', '1', 'SplitIndex');
                  Methods.MathematicalOperation(vars['SplitHeaderCount'], '+', '1', 'SplitHeaderCount');
                  Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataExcel'], ',', vars['SplitIndex'], 'IndividualValueExcel2');
                  Methods.concatenateWithSpecialChar(vars['IndividualValueExcel'], vars['IndividualValueExcel2'], ',', 'IndividualValueExcel');
                  Methods.MathematicalOperation(vars['count1'], '+', '1', 'count1');
                }

              }

              if (String( vars['IndividualHeaderNameExcel']) === 'null' || String(vars['IndividualValueExcel']) === 'N/A') {
                Methods.MathematicalOperation(vars['tdpcount'], '-', '1', 'tdpcount');
                log.info('Individual Header Name Excel is null');
              } else {
                Methods.verifyString(vars['IndividualHeaderNameExcel'], 'equals', vars['HeaderName']);
              }
 
              if (String(vars['IndividualValueExcel']) === 'null' || String(vars['IndividualValueExcel']) === 'N/A') {
                log.info('Individual value Excel is null');
              } else {
                await Methods.verifyTestdataIgnoreCase(vars['IndividualValueExcel'], 'contains', vars['ChaseInfo']);
              }

              Methods.MathematicalOperation(vars['SplitHeaderCount'], '+', '2', 'SplitHeaderCount');
              Methods.MathematicalOperation(vars['SplitIndex'], '+', '2', 'SplitIndex');
              Methods.MathematicalOperation(vars['ColumnCount'], '+', '1', 'ColumnCount');
              Methods.MathematicalOperation(vars['tdpcount'], '+', '1', 'tdpcount');
            }
          }

          Methods.MathematicalOperation(vars['RowCount'], '+', '1', 'RowCount');
        }

        log.stepPass('Successfully verified all row data against TestDataProfile');
      } catch (e) {
        log.stepFail(page, 'Failed to verify row data against TestDataProfile');
        throw e;
      }
      //verification of Loan Level Pricing Details
      log.step('Verifying Loan Level header names and details from Excel with TestDataProfile');
      try {
        const profileLoanLevelDetails = 'Loan Level Pricing Details';
        const profileDetails = testDataManager.getProfileByName(profileLoanLevelDetails);
        const dataList1 = profileDetails?.data as Record<string, any>[];

        vars['EntireRowDataHeaderNamesExcel'] = excelHelper.readEntireRow(vars['FilePath'], '1', '0', 'EntireRowDataHeaderNamesExcel');
        vars['EntireRowDetailsExcel'] = excelHelper.readEntireRow(vars['FilePath'], '1', '1', 'EntireRowDetailsExcel');
        vars['count'] = appconstants.ONE;
        vars['SplitCount'] = appconstants.ONE;

        for (let Count = 0; Count < 13; Count++) {
          log.info('Iteration: ' + Count);
          Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataHeaderNamesExcel'], ',', vars['count'], 'IndividualHeaderNameExcel');
          Methods.splitStringByRegConditionWithPosition(vars['EntireRowDetailsExcel'], ',', vars['SplitCount'], 'IndividualColumnDataExcel');
          
          vars['HeaderName'] = dataList1[Count]['HeaderName(Loan Level Details)'];
          log.info('Header Name from tdp: ' + vars['HeaderName']);
          
          vars['LoanDetails'] = dataList1[Count]['LoanDetails(Loan Level Details)'];
          log.info('Loan Details from tdp: ' + vars['LoanDetails']);
          await commitmentListPage.Download_File_TextPopup.click();

          if (String(vars['IndividualColumnDataExcel']).includes(String(appconstants.DOLLAR_SYMBOL))) {
            vars['count1'] = appconstants.ONE;
             Methods.countCharacter(vars['LoanDetails'], ',', 'CountofCama');
                while (parseFloat(String(vars['count1'])) <= parseFloat(String(vars['CountofCama']))) {
                  Methods.MathematicalOperation(vars['SplitCount'], '+', '1', 'SplitCount');
                  Methods.splitStringByRegConditionWithPosition(vars['EntireRowDetailsExcel'], ',', vars['SplitCount'], 'IndividualValueExcel2');
                  Methods.concatenateWithSpecialChar(vars['IndividualColumnDataExcel'], vars['IndividualValueExcel2'], ',', 'IndividualColumnDataExcel');
                  Methods.MathematicalOperation(vars['count1'], '+', '1', 'count1');
                }
          }

          Methods.verifyString(vars['IndividualHeaderNameExcel'], 'equals', vars['HeaderName']);
          if (String(vars['IndividualColumnDataExcel']) === 'null') {
            log.info('Individual Column Data Excel is empty');
            vars['IndividualColumnDataExcel']='Null';
          }
          Methods.verifyString(vars['LoanDetails'], 'contains', vars['IndividualColumnDataExcel']);

          Methods.MathematicalOperation(vars['count'], '+', '1', 'count');
          Methods.MathematicalOperation(vars['SplitCount'], '+', '1', 'SplitCount');
        }

        log.stepPass('Successfully verified all header names and loan details from Excel against TestDataProfile');
      } catch (e) {
        log.stepFail(page, 'Failed to verify header names and loan details from Excel against TestDataProfile');
        throw e;
      }

      log.step('Closing the Commitment List');
      try {
        await correspondentPortalPage.Close_ButtonCommitment_List.click();
        log.stepPass('Successfully closed the Commitment List');
      } catch (e) {
        log.stepFail(page, 'Failed to close the Commitment List');
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