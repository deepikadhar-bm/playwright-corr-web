// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CommitmentDetailsPage } from '../../../src/pages/correspondant/commitment-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import * as fileHelper from '../../../src/helpers/file-helpers';
import { SpinnerPage } from '@pages/correspondant/spinner';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let commitmentDetailsPage: CommitmentDetailsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    commitmentDetailsPage = new CommitmentDetailsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS17_TC02_Perform download action for PS file and verify the details', async ({ page }) => {
    vars['DownloadDir'] = path.join(process.cwd(), 'downloads');


    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await commitmentListPage.First_Commitment_IDCommitment_List.first().click();
    await page.waitForLoadState('networkidle');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });

    vars["BidReqIDUI"] = await priceOfferedPage.BidRequestIDTextDetails.textContent() || '';
    vars["SourceLoanNumUI"] = `"sourceLoanNumber":"${vars["BidReqIDUI"]}`;

    vars["CorrLoanNumUI"] = await commitmentListPage.First_Loan_NumberCommitment_List.first().textContent() || '';
    vars["CorrLoanNumUI1"] = `"corrLoanNumber":"${vars["CorrLoanNumUI"]}"`;

    vars["RefSecProdUI"] = (await priceOfferedPage.Locked_RefSecProdCommitment_List.first().textContent() || '').trim();
    vars["RefSecProdUI"] = `"referenceSecurityName":"${vars["RefSecProdUI"]}"`;

    vars["RefSecPriceLoanUI"] = (await priceOfferedPage.Locked_RefSecPriceCommitment_List.first().textContent() || '').trim();
    vars["RuntimeValue"] = vars["RefSecPriceLoanUI"];
    await stepGroups.stepGroup_Verifying_and_Removing_If_the_Last_Digits_are_Zeroes(page, vars);
    vars["RefSecPriceLoanUI"] = vars["RuntimeValue"];
    vars["RefSecPriceLoanUI"] = vars["RefSecPriceLoanUI"].replace(/\./g, '');
    vars["RefSecPriceLoanUI"] = `"referenceSecurityPrice":${vars["RefSecPriceLoanUI"]}`;

    vars["ExpectedFileName"] = `pricing-response-${vars["CorrLoanNumUI"]}`;
    console.log('Expected PS File Name:', vars["ExpectedFileName"]);

    const psButton1 = bidRequestDetailsPage.PS_button.first();
    await psButton1.scrollIntoViewIfNeeded();

    const [download1] = await Promise.all([
      page.waitForEvent('download'),
      psButton1.evaluate(el => el.dispatchEvent(new MouseEvent('click', { bubbles: true })))
    ]);

    vars["PSDownloadedFile1"] = download1.suggestedFilename();
    vars["PSFilePath1"] = path.join(vars['DownloadDir'], vars["PSDownloadedFile1"]);
    await download1.saveAs(vars["PSFilePath1"]);

    vars["PSFileData1"] = fileHelper.readJsonValue(vars["PSFilePath1"], "");

    expect(String(vars["PSDownloadedFile1"])).toContain(vars["ExpectedFileName"]);
    expect(String(vars["PSFileData1"])).toContain(vars["SourceLoanNumUI"]);
    expect(String(vars["PSFileData1"])).toContain(vars["CorrLoanNumUI1"]);
    expect(String(vars["PSFileData1"])).toContain(vars["RefSecProdUI"]);
    expect(String(vars["PSFileData1"])).toContain(vars["RefSecPriceLoanUI"]);

    await commitmentListPage.Total_LoansCommitment_List.click();
    await page.waitForLoadState('networkidle');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Lock_Icon.first().waitFor({ state: 'visible' });

    vars["LockedCorrLoanUI"] = await commitmentDetailsPage.First_Locked_Loan_NumCommitments_Details.textContent() || '';
    vars["LockedCorrLoanUI1"] = `"corrLoanNumber":"${vars["LockedCorrLoanUI"]}"`;

    vars["ExpectedFileNamePSLockedLoan"] = `pricing-response-${vars["LockedCorrLoanUI"]}`;
    console.log('Expected Locked PS File Name:', vars["ExpectedFileNamePSLockedLoan"]);

    vars["RefSecPriceLockedLoanUI"] = (await priceOfferedPage.Locked_RefSecPriceCommitment_List.first().textContent() || '').trim();
    vars["RuntimeValue"] = vars["RefSecPriceLockedLoanUI"];
    await stepGroups.stepGroup_Verifying_and_Removing_If_the_Last_Digits_are_Zeroes(page, vars);
    vars["RefSecPriceLockedLoansUI"] = vars["RuntimeValue"];
    vars["RefSecPriceLockedLoansUI"] = vars["RefSecPriceLockedLoansUI"].replace(/\./g, '');
    vars["RefSecPriceLockedLoansUI"] = `"referenceSecurityPrice":${vars["RefSecPriceLockedLoansUI"]}`;

    const psButton2 = commitmentListPage.PS_Button_Committed_Loan.first();
    await psButton2.scrollIntoViewIfNeeded();

    const [download2] = await Promise.all([
      page.waitForEvent('download'),
      psButton2.evaluate(el => el.dispatchEvent(new MouseEvent('click', { bubbles: true })))
    ]);

    vars["PSDownloadedFile2"] = download2.suggestedFilename();
    vars["PSFilePath2"] = path.join(vars['DownloadDir'], vars["PSDownloadedFile2"]);
    await download2.saveAs(vars["PSFilePath2"]);

    vars["PSFileData2"] = fileHelper.readJsonValue(vars["PSFilePath2"], "");

    expect(String(vars["PSDownloadedFile2"])).toContain(vars["ExpectedFileNamePSLockedLoan"]);
    expect(String(vars["PSFileData2"])).toContain(vars["SourceLoanNumUI"]);
    expect(String(vars["PSFileData2"])).toContain(vars["LockedCorrLoanUI1"]);
    expect(String(vars["PSFileData2"])).toContain(vars["RefSecProdUI"]);
    expect(String(vars["PSFileData2"])).toContain(vars["RefSecPriceLockedLoansUI"]);
  });
});