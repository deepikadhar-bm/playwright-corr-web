// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedDetailsPage } from '../../../src/pages/correspondant/price-offered-details';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import * as fileHelper from '../../../src/helpers/file-helpers';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedDetailsPage: PriceOfferedDetailsPage;
  let priceOfferedPage: PriceOfferedPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedDetailsPage = new PriceOfferedDetailsPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
  });

  test('REG_TS16_TC01_Perform download action for PQ file and verify the details', async ({ page }) => {
    // Set up download handler
    page.on('download', async (download) => {
      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      await download.saveAs(filePath);
      vars['_lastDownloadPath'] = filePath;
    });

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await priceOfferedPage.BidReqIDPartially_Committed_or_Committed.click();
    await page.waitForLoadState('networkidle');
    vars["SourceLoanNumUI"] = await priceOfferedPage.BidRequestIDTextDetails.textContent() || '';
    vars["SourceLoanNumUI"] = "\"sourceLoanNumber\":\"" + vars["SourceLoanNumUI"];
    vars["FirstLoanCorrNumberUI"] = await priceOfferedDetailsPage.First_Loan_NumberCommited_or_Uncommitted.textContent() || '';
    vars["FirstLoanCorrNumberUI1"] = "\"corrLoanNumber\":\"" + vars["FirstLoanCorrNumberUI"] + "\"";
    vars["CCodeInUI"] = await priceOfferedPage.CCode_In_UI.textContent() || '';
    vars["CCodeInUI"] = "\"corrCode\":\"" + vars["CCodeInUI"] + "\"";
    await priceOfferedDetailsPage.First_PQ_Button_Committed_or_Uncommited.click();
    // Wait for download - handled by Playwright download events
    await page.waitForTimeout(2000);
    vars[""] = vars['_lastDownloadPath'] ? require('path').basename(vars['_lastDownloadPath']) : '';
    vars["FirstLoanCorrNumberUI"] = String('') + String('');
    expect(String(vars["DownloadedPQFileName"])).toBe(vars["ExpectedFileName"]);
    vars["PQFilePathAllLoans"] = vars['_lastDownloadPath'] || '';
    vars[""] = fileHelper.readJsonValue('', "");
    expect(String(vars["PQFileDataAllLoans"])).toBe(vars["SourceLoanNumUI"]);
    expect(String(vars["PQFileDataAllLoans"])).toBe(vars["FirstLoanCorrNumberUI1"]);
    expect(String(vars["PQFileDataAllLoans"])).toBe(vars["CCodeInUI"]);
    await priceOfferedPage.LockedCommitted_Loans.click();
    await page.waitForLoadState('networkidle');
    vars["LockedCorrLoan"] = await priceOfferedPage.Locked_CorrLoan.textContent() || '';
    vars["LockedCorrLoan1"] = "\"corrLoanNumber\":\"" + vars["LockedCorrLoan"] + "\"";
    await bidRequestDetailsPage.PQ_button.click();
    // Wait for download - handled by Playwright download events
    await page.waitForTimeout(2000);
    vars[""] = vars['_lastDownloadPath'] ? require('path').basename(vars['_lastDownloadPath']) : '';
    vars["LockedCorrLoan"] = String('') + String('');
    expect(String(vars["DownLoadedFileName2"])).toBe(vars["ExpectedFileName2"]);
    vars["PQFilePathLockedLoans"] = vars['_lastDownloadPath'] || '';
    vars[""] = fileHelper.readJsonValue('', "");
    expect(String(vars["PQFileDataLockedLoans"])).toBe(vars["SourceLoanNumUI"]);
    expect(String(vars["PQFileDataLockedLoans"])).toBe(vars["LockedCorrLoan1"]);
    expect(String(vars["PQFileDataLockedLoans"])).toBe(vars["CCodeInUI"]);
  });
});
