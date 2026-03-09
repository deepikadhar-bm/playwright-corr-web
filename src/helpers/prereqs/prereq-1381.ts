import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import path from 'path';
import * as excelHelper from '../excel-helpers';
import { Logger as log } from '../log-helper';
const TC_ID = 'PREREQ-1381';
const TC_TITLE = 'Update Loan Numbers in the Bid File';

export async function runPrereq_1381(page: Page, vars: Record<string, string>): Promise<void> {

  log.tcStart(TC_ID, TC_TITLE);
  try {
    console.log('\n========== PREREQ 1 START: Updating Loan Numbers In File ==========');
    const filePath = path.resolve(__dirname, '../../../uploads/Bid_file_success_error_newly_updated (10).xlsx');
    console.log('[PREREQ 1] File path: ' + filePath);

    let totalRows = excelHelper.getRowCount(filePath, 'Sheet1');
    console.log('[PREREQ 1] Total Rows (with header): ' + totalRows);

    for (let i = 0; i < totalRows; i++) {
      console.log('[PREREQ 1] Processing row: ' + i);

      const d = new Date();
      const parts = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
      const currentDate = `${p.day}-${p.month}-${p.year}`;

      const newValue =
        `TestSigma_${currentDate}_SC1_` +
        Math.random().toString(36).substring(2, 4).toUpperCase() +
        '_' +
        (Math.floor(Math.random() * 900) + 100);

      console.log('[PREREQ 1] Row ' + i + ' - New value: ' + newValue);

      await excelHelper.updateCell({
        filePath,
        sheetName: 'Sheet1',
        columnHeader: 'Correspondent Loan Number',
        rowIndex: i,
        value: newValue,
      });

      console.log('[PREREQ 1] Row ' + i + ' - Updated successfully');
    }
    log.stepPass('========== PREREQ 1 COMPLETE: Loan Numbers Updated ==========\n');
    log.tcEnd('PASS');
  }
  catch (e) {
    await log.captureOnFailure(page, TC_ID, e);
    log.stepFail(page, 'Error updating loan numbers in file');
    log.tcEnd('FAIL');
    throw e
  }
}