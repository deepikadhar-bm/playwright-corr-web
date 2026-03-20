import { test, expect } from '@playwright/test';
import path from 'path';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { ENV } from '@config/environments';


const TC_ID = 'REG_TS06_TC01';
const TC_TITLE = 'Updating the Loan Numbers In File';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Generate base loan number string from current date');
      try {
        const filePath = path.resolve(__dirname, '../../../uploads/Bid_file_success_error_newly_updated_(6)_(1).xlsx');
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
        throw e;
      }

      log.step('Update loan numbers in Excel file');
      try {
        // getAllRowCount returns total rows INCLUDING header
        // subtract 1 to get data rows only so we don't write into extra empty rows
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
  });
});