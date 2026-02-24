import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../step-groups';
import * as excelHelper from '../excel-helpers';

export async function runPrereq_2234(page: Page, vars: Record<string, string>): Promise<void> {

  // Set up download handler
  page.on('download', async (download) => {
    const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
    await download.saveAs(filePath);
    vars['_lastDownloadPath'] = filePath;
  });

  await stepGroups.stepGroup_Rename_File(page, vars);
  if (vars['_lastDownloadPath']) { require('fs').copyFileSync(vars['_lastDownloadPath'], vars['_lastDownloadPath'] + '.copy'); }
  vars["LoanNum1"] = excelHelper.readCell(vars["File"], "1", "0", "0");
  // [DISABLED] Write hj into file at File where row is 2 and column is 0
  // // TODO: Write to file - Write hj into file at File where row is 2 and column is 0
  vars["LoanNum2"] = excelHelper.readCell(vars["File"], "2", "0", "0");
  excelHelper.writeCell(vars["File"], "2", "0", String(vars["LoanNum1"]), "0");
  vars["LoanNum2"] = excelHelper.readCell(vars["File"], "2", "0", "0");
  expect(String(vars["LoanNum1"])).toBe(vars["LoanNum2"]);
}
