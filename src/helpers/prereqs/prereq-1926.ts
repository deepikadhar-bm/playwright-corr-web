import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { CommitmentListPage } from '../../pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { runPrereq_1913 } from './prereq-1913';
import * as excelHelper from '../excel-helpers';
import { Logger as log } from '@helpers/log-helper';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';

const TC_ID = 'PREREQ_1926(REG_TS14_TC02.1)';
const TC_TITLE = 'Perform add to commit action and verify that latest commitment letter should be displayed with the latest value';

const profileName = 'Cover Letter Details2';
const profile = testDataManager.getProfileByName(profileName);
const dataList = profile?.data as Record<string, any>[];

export async function runPrereq_1926(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1913(page, vars);

  const commitmentListPage = new CommitmentListPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const Methods = new AddonHelpers(page, vars);



  log.tcStart(TC_ID, TC_TITLE);

  try {

    // verification of static data in excel
    log.step('Reading and verifying Cover Letter Header and Data from Excel Part 1');
    try {
      vars['CoverLetterHeaderExcelPart1'] = excelHelper.readCellByColAndRowIndex(vars['FilePath'], 0, 3, 0);
      Methods.verifyString(vars['CoverLetterHeaderExcelPart1'], 'equals', appconstants.CORR_NAME_WITHCCODE);
      vars['CoverLetterDataExcelPart1'] = excelHelper.readCellByColAndRowIndex(vars['FilePath'], 0, 3, 1);
      Methods.trimWhitespace(vars['CoverLetterDataExcelPart1'], 'CoverLetterDataExcelPart1');
      Methods.verifyString(vars['CoverLetterDataExcelPart1'], 'contains', vars['CompanyNameWithCCodeUI']);
      vars['CoverLetterHeaderExcelPart1'] = excelHelper.readCellByColAndRowIndex(vars['FilePath'], 0, 3, 3);
      Methods.verifyString(vars['CoverLetterHeaderExcelPart1'], 'equals', appconstants.USER_NAME_TEXT);
      vars['CoverLetterDataExcelPart1'] = excelHelper.readCellByColAndRowIndex(vars['FilePath'], 0, 3, 4);
      Methods.verifyString(vars['CoverLetterDataExcelPart1'], 'contains', appconstants.CHASE_CORR_TEXT);
      log.stepPass('Successfully verified Cover Letter Header and Data from Excel Part 1');
    } catch (e) {
      log.stepFail(page, 'Failed to verify Cover Letter Header and Data from Excel Part 1');
      throw e;
    }

    // verification of Cover Letter Details
    log.step('Iterating rows 9 to 15 and verifying row data against TestDataProfile');
    try {
      vars['RowCount'] = appconstants.NINE;
      vars['tdpcount'] = appconstants.ZERO;

      while (parseFloat(String(vars['RowCount'])) <= parseFloat(String(appconstants.FIFTEEN))) {
        log.info('Excel Row Data:' + vars['RowCount']);
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
            log.info('Excel Column Data:' + vars['ColumnCount']);
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

            if (String(vars['IndividualHeaderNameExcel']) === 'null' || String(vars['IndividualValueExcel']) === 'N/A') {
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

    // verification of Loan Number
    log.step('Verifying Loan Number from Excel against CommittedCorrLoan');
    try {
      vars['LoanNumberExcel'] = excelHelper.readCellByColAndRowIndex(vars['FilePath'], 1, 2, 3);
      Methods.verifyString(vars['LoanNumberExcel'], 'equals', vars['CommittedCorrLoan']);
      log.stepPass('Successfully verified Loan Number from Excel against CommittedCorrLoan');
    } catch (e) {
      log.stepFail(page, 'Failed to verify Loan Number from Excel against CommittedCorrLoan');
      throw e;
    }

    log.step('Closing the Commitment Letter');
    try {
      await correspondentPortalPage.Close_ButtonCommitment_List.click();
      log.stepPass('Successfully closed the Commitment Letter');
    } catch (e) {
      log.stepFail(page, 'Failed to close the Commitment Letter');
      throw e;
    }

    log.tcEnd('PASS');
  } catch (e) {
    await log.captureOnFailure(page, TC_ID, e);
    log.tcEnd('FAIL');
    throw e;
  }
}