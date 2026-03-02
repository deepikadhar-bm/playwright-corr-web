// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedDetailsPage } from '../../../src/pages/correspondant/price-offered-details';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import * as fileHelper from '../../../src/helpers/file-helpers';
import { SpinnerPage } from '@pages/correspondant/spinner';
import { AddonHelpers } from 'src/helpers/AddonHelpers';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedDetailsPage: PriceOfferedDetailsPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};

    Methods = new AddonHelpers(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedDetailsPage = new PriceOfferedDetailsPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS16_TC02_Perform download action for PS file and verify the details', async ({ page }) => {

    vars['DownloadDir'] = path.join(process.cwd(), 'downloads');

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await priceOfferedPage.BidReqIDPartially_Committed_or_Committed.first().click();

    const psUnlocked = bidRequestDetailsPage.PS_button.first();

    const [download1] = await Promise.all([page.waitForEvent('download'), psUnlocked.evaluate(el => el.dispatchEvent(new MouseEvent('click', { bubbles: true })))]);

    vars['FilePathAllLoans'] = path.join(vars['DownloadDir'], download1.suggestedFilename());
    await download1.saveAs(vars['FilePathAllLoans']);
    
    vars["BidReqIDUI"] = await priceOfferedPage.BidRequestIDTextDetails.textContent() || '';
    // vars["SourceLoanNumUI"] = `"sourceLoanNumber":"${vars["BidReqIDUI"]}`;
    Methods.concatenate(`"sourceLoanNumber":"`, vars["BidReqIDUI"], 'SourceLoanExpected');

    vars["CorrLoanNumUI"] = await priceOfferedDetailsPage.First_Loan_NumberCommited_or_Uncommitted.textContent() || '';
    // vars["CorrLoanNumUI1"] = `"corrLoanNumber":"${vars["CorrLoanNumUI"]}"`;
    Methods.concatenate(`"corrLoanNumber":"`, vars["CorrLoanNumUI"], 'CorrLoanNumUI1');

    vars["RefSecProdUI"] =(await priceOfferedPage.Ref_Sec_Prod.first().textContent() || '').trim();
    // vars["RefSecProdUI"] = `"referenceSecurityName":"${vars["RefSecProdUI"]}"`;
    Methods.concatenate(`"referenceSecurityName":"`, vars["RefSecProdUI"], 'RefSecProdUI');

    vars["RefSecPriceLoanUI"] = (await priceOfferedDetailsPage.Reference_Security_PricePrice_Offered.first().textContent() || '').trim();
    vars["RuntimeValue"] = vars["RefSecPriceLoanUI"];
    await stepGroups.stepGroup_Verifying_and_Removing_If_the_Last_Digits_are_Zeroes(page, vars);
    vars["RefSecPriceLoanUI"] = vars["RuntimeValue"];
    vars["RefSecPriceLoanUI"] = vars["RefSecPriceLoanUI"].replace(/\./g, '');
    vars["RefSecPriceLoanUI"] = `"referenceSecurityPrice":${vars["RefSecPriceLoanUI"]}`;

    vars["SecMonthName"] = await priceOfferedPage.Sec_Month.textContent() || '';
    console.log('Extracted Security Month Name from UI:', vars["SecMonthName"]);
    vars["count"] = "1";

    while (parseFloat(vars["count"]) <= 12) {
      const monthName = new Date(
        2000,
        parseInt(vars["count"]) - 1,
        1
      ).toLocaleString('en-US', { month: 'short' });

      if (monthName === vars["SecMonthName"]) {
        console.log('Matched Month Name:', monthName);
        break;
      }

      vars["count"] = (parseInt(vars["count"]) + 1).toString();
    }

    vars["MonthNumUI"] = `"referenceSecurityMonth":${vars["count"]}`;
    vars["PSFileData1"] = fileHelper.readJsonValue(vars["FilePathAllLoans"], "");
    vars["ExpectedFileName1"] = `pricing-response-${vars["CorrLoanNumUI"]}`;
    console.log('Expected PS File Name:', vars["ExpectedFileName1"]);
    expect(String(download1.suggestedFilename())).toContain(vars['ExpectedFileName1']);

    expect(String(vars["PSFileData1"])).toContain(vars["SourceLoanNumUI"]);
    expect(String(vars["PSFileData1"])).toContain(vars["CorrLoanNumUI1"]);
    expect(String(vars["PSFileData1"])).toContain(vars["RefSecProdUI"]);
    expect(String(vars["PSFileData1"])).toContain(vars["RefSecPriceLoanUI"]);
    expect(String(vars["PSFileData1"])).toContain(vars["MonthNumUI"]);

    await priceOfferedPage.LockedCommitted_Loans.click();
    await priceOfferedPage.LockSymbolOpen.waitFor({ state: 'visible' });
    const psLocked = priceOfferedPage.PS_Button_Locked_Loan.first();

    const [download2] = await Promise.all([page.waitForEvent('download'),psLocked.evaluate(el =>el.dispatchEvent(new MouseEvent('click', { bubbles: true })))]);

    vars['FilepathLockedLaons'] = path.join(vars['DownloadDir'],download2.suggestedFilename());
    await download2.saveAs(vars['FilepathLockedLaons']);
    vars["LockedCorrLoanUI"] =await priceOfferedPage.Locked_CorrLoan.first().textContent() || '';
    vars["ExpectedFileName2"] = `pricing-response-${vars["LockedCorrLoanUI"]}`;
    console.log('Expected Locked PS File Name:', vars["ExpectedFileName2"]);
    expect(String(download2.suggestedFilename())).toContain(vars['ExpectedFileName2']);
    vars["LockedCorrLoanUI1"] = `"corrLoanNumber":"${vars["LockedCorrLoanUI"]}"`;
    vars["RefSecPriceLockedLoanUI"] = (await priceOfferedDetailsPage.Reference_Security_PricePrice_Offered.first().textContent() || '').trim();
    vars["RuntimeValue"] = vars["RefSecPriceLockedLoanUI"];
    await stepGroups.stepGroup_Verifying_and_Removing_If_the_Last_Digits_are_Zeroes(page, vars);
    vars["RefSecPriceLockedLoanUI"] = vars["RuntimeValue"];
    vars["RefSecPriceLockedLoanUI"] = vars["RefSecPriceLockedLoanUI"].replace(/\./g, '');
    vars["RefSecPriceLockedLoansUI"] = `"referenceSecurityPrice":${vars["RefSecPriceLockedLoanUI"]}`;
    vars["PSFileData2"] = fileHelper.readJsonValue(vars["FilepathLockedLaons"], "");
    expect(String(vars["PSFileData2"])).toContain(vars["SourceLoanNumUI"]);
    expect(String(vars["PSFileData2"])).toContain(vars["LockedCorrLoanUI1"]);
    expect(String(vars["PSFileData2"])).toContain(vars["RefSecProdUI"]);
    expect(String(vars["PSFileData2"])).toContain(vars["RefSecPriceLockedLoansUI"]);
    expect(String(vars["PSFileData2"])).toContain(vars["MonthNumUI"]);
  });
});