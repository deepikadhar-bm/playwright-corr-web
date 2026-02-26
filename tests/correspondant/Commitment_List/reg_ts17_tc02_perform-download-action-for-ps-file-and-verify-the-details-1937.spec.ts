// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CommitmentDetailsPage } from '../../../src/pages/correspondant/commitment-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import * as fileHelper from '../../../src/helpers/file-helpers';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let commitmentDetailsPage: CommitmentDetailsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    commitmentDetailsPage = new CommitmentDetailsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
  });

  test('REG_TS17_TC02_Perform download action for PS file and verify the details', async ({ page }) => {
    // Set up download handler
    page.on('download', async (download) => {
      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      await download.saveAs(filePath);
      vars['_lastDownloadPath'] = filePath;
    });

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await commitmentListPage.First_Commitment_IDCommitment_List.click();
    await bidRequestDetailsPage.PS_button.waitFor({ state: 'visible' });
    await bidRequestDetailsPage.PS_button.click();
    // Wait for download - handled by Playwright download events
    await page.waitForTimeout(2000);
    vars[""] = vars['_lastDownloadPath'] ? require('path').basename(vars['_lastDownloadPath']) : '';
    vars["BidReqIDUI"] = await priceOfferedPage.BidRequestIDTextDetails.textContent() || '';
    vars["SourceLoanNumUI"] = "\"sourceLoanNumber\":\"" + vars["BidReqIDUI"];
    vars["CorrLoanNumUI"] = await commitmentListPage.First_Loan_NumberCommitment_List.textContent() || '';
    vars["CorrLoanNumUI1"] = "\"corrLoanNumber\":\"" + vars["CorrLoanNumUI"] + "\"";
    vars["RefSecProdUI"] = await priceOfferedPage.Locked_RefSecProdCommitment_List.textContent() || '';
    vars["RefSecProdUI"] = String(vars["RefSecProdUI"]).trim();
    vars["RefSecProdUI"] = "\"referenceSecurityName\":\"" + vars["RefSecProdUI"] + "\"";
    vars["RefSecPriceLoanUI"] = await priceOfferedPage.Locked_RefSecPriceCommitment_List.textContent() || '';
    vars["RefSecPriceLoanUI"] = String(vars["RefSecPriceLoanUI"]).trim();
    await stepGroups.stepGroup_Verifying_and_Removing_If_the_Last_Digits_are_Zeroes(page, vars);
    vars["RefSecPriceLoanUI"] = "\"referenceSecurityPrice\":" + vars["RefSecPriceLoanUI"];
    vars["CorrLoanNumUI"] = String('') + String('');
    expect(String(vars["PSDownloadedFile1"])).toBe(vars["ExpectedFileName"]);
    vars["PSFilePath1"] = vars['_lastDownloadPath'] || '';
    vars[""] = fileHelper.readJsonValue('', "");
    expect(String(vars["PSFileData1"])).toBe(vars["SourceLoanNumUI"]);
    expect(String(vars["PSFileData1"])).toBe(vars["CorrLoanNumUI1"]);
    expect(String(vars["PSFileData1"])).toBe(vars["RefSecProdUI"]);
    expect(String(vars["PSFileData1"])).toBe(vars["RefSecPriceLoanUI"]);
    await commitmentListPage.Total_LoansCommitment_List.click();
    await commitmentListPage.PS_Button_Committed_Loan.click();
    // Wait for download - handled by Playwright download events
    await page.waitForTimeout(2000);
    vars[""] = vars['_lastDownloadPath'] ? require('path').basename(vars['_lastDownloadPath']) : '';
    vars["LockedCorrLoanUI"] = await commitmentDetailsPage.First_Locked_Loan_NumCommitments_Details.textContent() || '';
    vars["LockedCorrLoanUI"] = String(vars["LockedCorrLoanUI"]).substring(0, String(vars["LockedCorrLoanUI"]).length - 10);
    vars["LockedCorrLoanUI1"] = "\"corrLoanNumber\":\"" + vars["LockedCorrLoanUI"] + "\"";
    vars["RefSecPriceLockedLoanUI"] = await priceOfferedPage.Locked_RefSecPriceCommitment_List.textContent() || '';
    vars["RefSecPriceLockedLoansUI"] = String(vars["RefSecPriceLockedLoanUI"]).trim();
    await stepGroups.stepGroup_Verifying_and_Removing_If_the_Last_Digits_are_Zeroes(page, vars);
    vars["RefSecPriceLockedLoansUI"] = "\"referenceSecurityPrice\":" + vars["RefSecPriceLockedLoansUI"];
    vars["LockedCorrLoanUI"] = String('') + String('');
    expect(String(vars["PSDownloadedFile2"])).toBe(vars["ExpectedFileNamePSLockedLoan"]);
    vars["PSFilePath2"] = vars['_lastDownloadPath'] || '';
    vars[""] = fileHelper.readJsonValue('', "");
    expect(String(vars["PSFileData2"])).toBe(vars["SourceLoanNumUI"]);
    expect(String(vars["PSFileData2"])).toBe(vars["LockedCorrLoanUI1"]);
    expect(String(vars["PSFileData2"])).toBe(vars["RefSecPriceLockedLoansUI"]);
    expect(String(vars["PSFileData2"])).toBe(vars["RefSecProdUI"]);
  });
});
