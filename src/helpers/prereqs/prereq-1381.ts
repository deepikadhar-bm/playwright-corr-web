import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import path from 'path';
// import * as stepGroups from '../step-groups';  // ❌ Removed - rename file stepgroup not needed
import * as excelHelper from '../excel-helpers';

export async function runPrereq_1381(page: Page, vars: Record<string, string>): Promise<void> {

  // ❌ Removed - download handler was only needed for rename file stepgroup
  // page.on('download', async (download) => {
  //   const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
  //   await download.saveAs(filePath);
  //   vars['_lastDownloadPath'] = filePath;
  // });

  // ❌ Removed - rename file stepgroup not needed
  // await stepGroups.stepGroup_Rename_File(page, vars);

  // ❌ Removed - file copy was only needed after rename file stepgroup
  // if (vars['_lastDownloadPath']) { require('fs').copyFileSync(vars['_lastDownloadPath'], vars['_lastDownloadPath'] + '.copy'); }

  // ✅ Updated - New loan number update logic
  console.log('\n========== PREREQ 1 START: Updating Loan Numbers In File ==========');
  const filePath = path.resolve(__dirname, '../../../uploads/Bid_file_success_error_newly_updated (10).xlsx');
  console.log('[PREREQ 1] File path: ' + filePath);

  let totalRows = excelHelper.getRowCount(filePath, 'Sheet1');
  console.log('[PREREQ 1] Total Rows (with header): ' + totalRows);
  //totalRows = totalRows - 1; // Adjust for header row
  //console.log('[PREREQ 1] Total Rows (excluding header): ' + totalRows);

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

  console.log('========== PREREQ 1 COMPLETE: Loan Numbers Updated ==========\n');

  // ❌ Removed - old date formatting logic replaced by new logic above
  // vars["CurrentDate"] = (() => {
  //   const d = new Date();
  //   const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
  //   const fmt = "dd-MM-yyyy";
  //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', ...}).formatToParts(d);
  //   ...
  // })();

  // ❌ Removed - old string building logic replaced by new logic above
  // vars["Str1"] = String("TestSigma_") + String(vars["CurrentDate"]);
  // vars["Str2"] = String(vars["Str1"]) + String("_SC1");
  // vars["ColumnCount"] = "0";
  // vars["count"] = "1";
  // vars["RowsCountExcel"] = String(excelHelper.getRowCount(vars["File"], "0"));

  // ❌ Removed - old while loop replaced by new for loop above
  // await page.waitForTimeout(5000);
  // while (parseFloat(String(vars["count"])) < parseFloat(String(vars["RowsCountExcel"]))) {
  //   vars["RandomString"] = Array.from({length: 2}, () => '...'.charAt(Math.floor(Math.random() * 62))).join('');
  //   vars["RandomNumber"] = String(Math.floor(Math.random() * (999 - 100 + 1)) + 100);
  //   vars["FormattedLoanNumber"] = vars["Str2"] + "_" + vars["RandomString"] + "_" + vars["RandomNumber"];
  //   excelHelper.writeCell(vars["File"], vars["count"], vars["ColumnCount"], String(vars["FormattedLoanNumber"]), "0");
  //   vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  // }

}