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

  test('REG_TS16_TC02_Perform download action for PS file and verify the details', async ({ page }) => {
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
    await bidRequestDetailsPage.PS_button.click();
    // Wait for download - handled by Playwright download events
    await page.waitForTimeout(2000);
    vars[""] = vars['_lastDownloadPath'] ? require('path').basename(vars['_lastDownloadPath']) : '';
    vars["BidReqIDUI"] = await priceOfferedPage.BidRequestIDTextDetails.textContent() || '';
    vars["SourceLoanNumUI"] = "\"sourceLoanNumber\":\"" + vars["BidReqIDUI"];
    vars["CorrLoanNumUI"] = await priceOfferedDetailsPage.First_Loan_NumberCommited_or_Uncommitted.textContent() || '';
    vars["CorrLoanNumUI1"] = "\"corrLoanNumber\":\"" + vars["CorrLoanNumUI"] + "\"";
    vars["RefSecProdUI"] = await priceOfferedPage.Ref_Sec_Prod.textContent() || '';
    vars["RefSecProdUI"] = String(vars["RefSecProdUI"]).trim();
    vars["RefSecProdUI"] = "\"referenceSecurityName\":\"" + vars["RefSecProdUI"] + "\"";
    vars["RefSecPriceLoanUI"] = await priceOfferedDetailsPage.Reference_Security_PricePrice_Offered.textContent() || '';
    vars["RefSecPriceLoanUI"] = String(vars["RefSecPriceLoanUI"]).trim();
    await stepGroups.stepGroup_Verifying_and_Removing_If_the_Last_Digits_are_Zeroes(page, vars);
    vars["RefSecPriceLoanUI"] = "\"referenceSecurityPrice\":" + vars["RefSecPriceLoanUI"];
    vars["SecMonthName"] = await priceOfferedPage.Sec_Month.textContent() || '';
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String("12"))) {
      vars[""] = new Date(2000, parseInt(String("MonthName")) - 1, 1).toLocaleString('en-US', { month: 'long' });
      vars["Position"] = String(vars["MonthName"]).substring(0, parseInt("3"));
      vars["MonthName2"] = vars["MonthName1"];
      vars["MonthNames"] = String(vars["MonthName2"]).split(",")["1"] || '';
      if (String(vars["MonthNames"]) === String(vars["SecMonthName"])) {
        break;
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    vars["MonthNumUI"] = vars["count"];
    vars["MonthNumUI"] = "\"referenceSecurityMonth\":" + vars["MonthNumUI"];
    vars["CorrLoanNumUI"] = String('') + String('');
    expect(String(vars["PSDownloadedFile1"])).toBe(vars["ExpectedFileName"]);
    vars["PSFilePath1"] = vars['_lastDownloadPath'] || '';
    vars[""] = fileHelper.readJsonValue('', "");
    expect(String(vars["PSFileData1"])).toBe(vars["SourceLoanNumUI"]);
    expect(String(vars["PSFileData1"])).toBe(vars["CorrLoanNumUI1"]);
    expect(String(vars["PSFileData1"])).toBe(vars["RefSecProdUI"]);
    expect(String(vars["PSFileData1"])).toBe(vars["RefSecPriceLoanUI"]);
    expect(String(vars["PSFileData1"])).toBe(vars["MonthNumUI"]);
    await priceOfferedPage.LockedCommitted_Loans.click();
    await priceOfferedPage.PS_Button_Locked_Loan.click();
    // Wait for download - handled by Playwright download events
    await page.waitForTimeout(2000);
    vars[""] = vars['_lastDownloadPath'] ? require('path').basename(vars['_lastDownloadPath']) : '';
    vars["LockedCorrLoanUI"] = await priceOfferedPage.Locked_CorrLoan.textContent() || '';
    vars["LockedCorrLoanUI1"] = "\"corrLoanNumber\":\"" + vars["LockedCorrLoanUI"] + "\"";
    vars["RefSecPriceLockedLoanUI"] = await priceOfferedDetailsPage.Reference_Security_PricePrice_Offered.textContent() || '';
    vars["RefSecPriceLockedLoansUI"] = String(vars["RefSecPriceLockedLoanUI"]).trim();
    await stepGroups.stepGroup_Verifying_and_Removing_If_the_Last_Digits_are_Zeroes(page, vars);
    vars["RefSecPriceLockedLoansUI"] = "\"referenceSecurityPrice\":" + vars["RefSecPriceLockedLoansUI"];
    vars["LockedCorrLoanUI"] = String('') + String('');
    expect(String(vars["PSDownloadedFile2"])).toBe(vars["ExpectedFileNamePSLockedLoan"]);
    vars["PSFilePath2"] = vars['_lastDownloadPath'] || '';
    vars[""] = fileHelper.readJsonValue('', "");
    expect(String(vars["PSFileData2"])).toBe(vars["SourceLoanNumUI"]);
    expect(String(vars["PSFileData2"])).toBe(vars["RefSecPriceLockedLoansUI"]);
    expect(String(vars["PSFileData2"])).toBe(vars["LockedCorrLoanUI1"]);
    expect(String(vars["PSFileData2"])).toBe(vars["RefSecProdUI"]);
    expect(String(vars["PSFileData2"])).toBe(vars["MonthNumUI"]);
  });
});
