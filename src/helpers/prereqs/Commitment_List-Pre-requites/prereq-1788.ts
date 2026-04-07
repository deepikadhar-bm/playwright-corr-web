import type { Page } from '@playwright/test';
import path from 'path';
import * as excelHelper from '../../excel-helpers';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../constants/app-constants';
import { FILE_CONSTANTS as fileconstants } from '../../../../src/constants/file-constants';


const TC_ID = 'PREREQ_1788(REG_TS06_TC01)';
const TC_TITLE = 'Setup: Update Loan Numbers In File';

export async function runPrereq_1788(page: Page, vars: Record<string, string>): Promise<void> {
  const Methods = new AddonHelpers(page, vars);

  log.tcStart(TC_ID, TC_TITLE);
  try {
    log.step('Generate base loan number string from current date');
    try {
      const filePath = path.resolve(__dirname,'../../../../uploads',fileconstants.BID_FILE_4LOANS);
      vars['FilePath'] = filePath;
      log.info('File path: ' + vars['FilePath']);
      Methods.getCurrentTimestamp(appconstants.DATE_FORMAT_DDMMYYYY, 'CurrentDate', appconstants.UTC);
      log.info('CurrentDate: ' + vars['CurrentDate']);
      Methods.concatenate('TestSigma_', vars['CurrentDate'], 'Str1');
      log.info('Str1: ' + vars['Str1']);
      Methods.concatenate(vars['Str1'], '_SC1', 'Str2');
      log.info('Str2: ' + vars['Str2']);
      log.stepPass('Base loan number string generated: ' + vars['Str2']);
    } catch (e) {
      await log.stepFail(page, 'Failed to generate base loan number string');
      log.tcEnd('FAIL');
      throw e;
    }

    log.step('Update loan numbers in Excel file');
    try {
      vars['RowsCountExcel'] = String(excelHelper.getAllRowCount(vars['FilePath'], 0));
      log.info('RowsCountExcel (total including header): ' + vars['RowsCountExcel']);
      Methods.MathematicalOperation(vars['RowsCountExcel'], '-', 1, 'RowsCountExcel');
      log.info('RowsCountExcel (data rows only, excluding header): ' + vars['RowsCountExcel']);

      vars['RowIndex'] = appconstants.ONE;
      vars['ColIndex'] = appconstants.ZERO;

      while (parseFloat(String(vars['RowIndex'])) <= parseFloat(String(vars['RowsCountExcel']))) {
        Methods.generateRandomString('2', 'RandomString');
        Methods.generateRandomNumber('3', 'RandomNumber');
        Methods.concatenateWithSpecialChar(vars['Str2'], vars['RandomString'], '_', 'FormattedLoanNumber');
        Methods.concatenateWithSpecialChar(vars['FormattedLoanNumber'], vars['RandomNumber'], '_', 'FormattedLoanNumber');
        log.info('FormattedLoanNumber [row ' + vars['RowIndex'] + ']: ' + vars['FormattedLoanNumber']);
        excelHelper.writeCellByColAndRowIndex(vars['FilePath'], '0', vars['RowIndex'], vars['ColIndex'], vars['FormattedLoanNumber'], 'a');
        log.info('Written to sheet[0] row: ' + vars['RowIndex'] + ' | col: ' + vars['ColIndex']);
        Methods.MathematicalOperation(vars['RowIndex'], '+', 1, 'RowIndex');
      }
      log.info('Total rows updated: ' + vars['RowsCountExcel']);
      log.stepPass('Loan numbers updated in Excel file successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to update loan numbers in Excel file');
      throw e;
    }
    log.tcEnd('PASS');

  } catch (e) {
    await log.captureOnFailure(page, TC_ID, e);
    log.tcEnd('FAIL');
    throw e;
  }
}