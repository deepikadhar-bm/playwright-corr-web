import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../step-groups';
import * as excelHelper from '../excel-helpers';

export async function runPrereq_2318(page: Page, vars: Record<string, string>): Promise<void> {

  // Set up download handler
  page.on('download', async (download) => {
    const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
    await download.saveAs(filePath);
    vars['_lastDownloadPath'] = filePath;
  });

  await stepGroups.stepGroup_Rename_File(page, vars);
  if (vars['_lastDownloadPath']) { require('fs').copyFileSync(vars['_lastDownloadPath'], vars['_lastDownloadPath'] + '.copy'); }
  vars["CurrentDate"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
    const fmt = "dd-MM-yyyy";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["Str1"] = String("TestSigma_") + String(vars["CurrentDate"]);
  vars["Str2"] = String(vars["Str1"]) + String("_SC1");
  vars["ColumnCount"] = "0";
  vars["count"] = "1";
  vars["RowsCountExcel"] = String(excelHelper.getRowCount(vars["File"], "0"));
  await page.waitForTimeout(5000);
  while (parseFloat(String(vars["count"])) < parseFloat(String(vars["RowsCountExcel"]))) {
    vars["RandomString"] = Array.from({length: 2}, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random() * 62))).join('');
    vars["RandomNumber"] = String(Math.floor(Math.random() * (999 - 100 + 1)) + 100);
    vars["FormattedLoanNumber"] = vars["Str2"] + "_" + vars["RandomString"] + "_" + vars["RandomNumber"];
    // [DISABLED] Write the data FormattedLoanNumber into Excel File with Cell value count , ColumnCount and Sheet 1
    // excelHelper.writeCell(vars["File"], vars["count"], vars["ColumnCount"], String(vars["FormattedLoanNumber"]), "1");
    excelHelper.writeCell(vars["File"], vars["count"], vars["ColumnCount"], String(vars["FormattedLoanNumber"]), "0");
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
}
