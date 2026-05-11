import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../step-groups';
import * as excelHelper from '../excel-helpers';
import { FILE_CONSTANTS as fileconstants } from '../../constants/file-constants';
import { Logger as log } from '../log-helper';

export async function runPrereq_2234(page: Page, vars: Record<string, string>): Promise<void> {
  // // Set up download handler
  // page.on('download', async (download) => {
  //   const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
  //   await download.saveAs(filePath);
  //   vars['_lastDownloadPath'] = filePath;
  // });
  
  log.step('Setting up file path for duplicate loan file');
  try {
    vars["filepath"] = path.resolve(__dirname, '../../../uploads', fileconstants.Duplicate_Loan_File);
    log.info(`File path set to: ${vars["filepath"]}`);
    log.stepPass('File path setup completed successfully');
  } catch (e) {
    log.stepFail(page, 'Failed to set up file path');
    throw e;
  }

  // await stepGroups.stepGroup_Rename_File(page, vars);
  //if (vars['_lastDownloadPath']) { require('fs').copyFileSync(vars['_lastDownloadPath'], vars['_lastDownloadPath'] + '.copy'); }
  
  log.step('Reading loan number 1 from Excel file');
  try {
    //vars["LoanNum1"] = excelHelper.readCell(vars["File"], "1", "0", "0");
    vars['LoanNum1'] = excelHelper.readCellByColAndRowIndex(vars['filepath'], 0, 1, 0);
    log.info(`LoanNum1 retrieved: ${vars['LoanNum1']}`);
    log.stepPass('Successfully read loan number 1');
  } catch (e) {
    log.stepFail(page, 'Failed to read loan number 1 from Excel file');
    throw e;
  }

  // [DISABLED] Write hj into file at File where row is 2 and column is 0
  // // TODO: Write to file - Write hj into file at File where row is 2 and column is 0
  
  log.step('Reading loan number 2 from Excel file');
  try {
    vars["LoanNum2"] = excelHelper.readCellByColAndRowIndex(vars['filepath'], 0, 2, 0);
    log.info(`LoanNum2 retrieved: ${vars["LoanNum2"]}`);
    log.stepPass('Successfully read loan number 2');
  } catch (e) {
    log.stepFail(page, 'Failed to read loan number 2 from Excel file');
    throw e;
  }

  // excelHelper.writeCell(vars["File"], "2", "0", String(vars["LoanNum1"]), "0");
  
  log.step('Writing loan number 1 to row 2, column 0');
  try {
    excelHelper.writeCellByColAndRowIndex(vars['filepath'], 0, 2, 0, vars['LoanNum1']);
    log.info(`Wrote value to Excel file: ${vars['LoanNum1']}`);
    log.stepPass('Successfully wrote loan number 1 to Excel file');
  } catch (e) {
    log.stepFail(page, 'Failed to write loan number 1 to Excel file');
    throw e;
  }

  log.step('Verifying written value by reading loan number 2 again');
  try {
    vars["LoanNum2"] = excelHelper.readCellByColAndRowIndex(vars['filepath'], 0, 2, 0);
    log.info(`LoanNum2 after write operation: ${vars["LoanNum2"]}`);
    log.stepPass('Successfully read updated loan number 2');
  } catch (e) {
    log.stepFail(page, 'Failed to read updated loan number 2 from Excel file');
    throw e;
  }

  log.step('Verifying loan numbers match');
  try {
    expect(String(vars["LoanNum1"])).toBe(vars["LoanNum2"]);
    log.info(`Assertion passed: LoanNum1 (${vars["LoanNum1"]}) matches LoanNum2 (${vars["LoanNum2"]})`);
    log.stepPass('Loan numbers verified successfully');
  } catch (e) {
    log.stepFail(page, 'Failed to verify loan numbers match');
    throw e;
  }
}