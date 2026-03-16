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
    log.info('\n========== PREREQ 1 START: Updating Loan Numbers In File ==========');
    const filePath = path.resolve(__dirname, '../../../uploads/Bid_file_success_error_newly_updated (12).xlsx');
    log.info('[PREREQ 1] File path: ' + filePath);

    // ── Time checkpoint 1: before getRowCount ─────────────────────────────
    const t1 = Date.now();
    let totalRows = excelHelper.getRowCount(filePath, 'Sheet1');
    log.info(`[PREREQ 1] getRowCount took: ${Date.now() - t1}ms`);
    log.info('[PREREQ 1] Total Rows (with header): ' + totalRows);
    totalRows = totalRows - 1; // Exclude header row
    log.info('[PREREQ 1] Total Rows (excluding header): ' + totalRows);

    // ── Time checkpoint 2: before building updates array ──────────────────
    const t2 = Date.now();
    const updates: { columnHeader: string; rowIndex: number; value: string }[] = [];

    for (let i = 0; i < totalRows; i++) {
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

      updates.push({
        columnHeader: 'Correspondent Loan Number',
        rowIndex: i,
        value: newValue,
      });
    }
    log.info(`[PREREQ 1] Building ${updates.length} updates took: ${Date.now() - t2}ms`);

    // ── Time checkpoint 3: before updateCells ─────────────────────────────
    const t3 = Date.now();
    excelHelper.updateCells(filePath, updates, 'Sheet1');
    log.info(`[PREREQ 1] updateCells took: ${Date.now() - t3}ms`);

    log.info(`[PREREQ 1] Total prereq time: ${Date.now() - t1}ms`);
    log.stepPass('========== PREREQ 1 COMPLETE: Loan Numbers Updated ==========\n');
    log.tcEnd('PASS');
  }
  catch (e) {
    await log.captureOnFailure(page, TC_ID, e);
    log.stepFail(page, 'Error updating loan numbers in file');
    log.tcEnd('FAIL');
    throw e;
  }
}