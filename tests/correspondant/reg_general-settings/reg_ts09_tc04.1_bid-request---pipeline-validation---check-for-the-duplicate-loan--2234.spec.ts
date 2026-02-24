import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import * as excelHelper from '../../../src/helpers/excel-helpers';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};

  test.beforeEach(async () => {
    vars = {};
  });

  test('REG_TS09_TC04.1_Bid Request - Pipeline Validation - Check for the Duplicate Loan Check, - by enable and disable upload the loan for verification.', async ({ page }) => {
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
  });
});
