// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import * as fileHelper from '../../../src/helpers/file-helpers';
import { SpinnerPage } from '@pages/correspondant/spinner';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS17_TC01_Perform download action for PQ file and verify the details', async ({ page }) => {
    vars['DownloadDir'] = path.join(process.cwd(), 'downloads');

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await commitmentListPage.First_Commitment_IDCommitment_List.first().click();
    await page.waitForLoadState('networkidle');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });

    vars["SourceLoanNumUI"] = await priceOfferedPage.BidRequestIDTextDetails.textContent() || '';
    vars["SourceLoanNumUI"] = `"sourceLoanNumber":"${vars["SourceLoanNumUI"]}`;

    vars["FirstLoanCorrNumberUI"] = await commitmentListPage.First_Loan_NumberCommitment_List.first().textContent() || '';
    vars['ExpectedFileName1'] = `pricing-request-${vars["FirstLoanCorrNumberUI"]}`;
    console.log('Expected PQ File Name:', vars['ExpectedFileName1']);

    vars["FirstLoanCorrNumberUI1"] = `"corrLoanNumber":"${vars["FirstLoanCorrNumberUI"]}"`;

    vars["CCodeInUI"] = await priceOfferedPage.CCode_In_UI.textContent() || '';
    vars["CCodeInUI"] = `"corrCode":"${vars["CCodeInUI"]}"`;

    await commitmentListPage.First_Loan_NumberCommitment_List.first().click();
    await commitmentListPage.Loan_Details_Text_Popup.waitFor({ state: 'visible' });
    vars["FICOValue"] = await commitmentListPage.FICO_Value.textContent() || '';
    vars["FICOValue"] = vars["FICOValue"].trim();
    await correspondentPortalPage.Close_Buttonemail_config.click();

    const PQButton = commitmentListPage.First_PQ_Button.first();
    await PQButton.scrollIntoViewIfNeeded();

    const [download1] = await Promise.all([
      page.waitForEvent('download'),
      PQButton.evaluate(el => el.dispatchEvent(new MouseEvent('click', { bubbles: true })))
    ]);

    vars['FilePathTotalLoans'] = path.join(vars['DownloadDir'], download1.suggestedFilename());
    await download1.saveAs(vars['FilePathTotalLoans']);

    vars["PQFileDataAllLoans"] = fileHelper.readJsonValue(vars['FilePathTotalLoans'], "");

    expect(String(download1.suggestedFilename())).toContain(vars['ExpectedFileName1']);
    expect(String(vars["PQFileDataAllLoans"])).toContain(vars["SourceLoanNumUI"]);
    expect(String(vars["PQFileDataAllLoans"])).toContain(vars["FirstLoanCorrNumberUI1"]);
    expect(String(vars["PQFileDataAllLoans"])).toContain(vars["CCodeInUI"]);
    expect(String(vars["PQFileDataAllLoans"])).toContain(vars["FICOValue"]);

    await commitmentListPage.Total_LoansCommitment_List.click();
    await page.waitForLoadState('networkidle');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Lock_Icon.first().waitFor({ state: 'visible' });

    vars["LockedCorrLoan"] = await commitmentListPage.First_Loan_NumberCommitment_List.first().textContent() || '';
    vars["LockedCorrLoan1"] = `"corrLoanNumber":"${vars["LockedCorrLoan"]}"`;
    vars['ExpectedFileName2'] = `pricing-request-${vars["LockedCorrLoan"]}`;
    console.log('Expected Locked PQ File Name:', vars['ExpectedFileName2']);

    await commitmentListPage.First_Loan_NumberCommitment_List.first().click();
    await commitmentListPage.Loan_Details_Text_Popup.waitFor({ state: 'visible' });
    vars["LockedFICOValue"] = await commitmentListPage.FICO_Value.first().textContent() || '';
    vars["LockedFICOValue"] = vars["LockedFICOValue"].trim();
    await correspondentPortalPage.Close_Buttonemail_config.click();

    const [download2] = await Promise.all([
      page.waitForEvent('download'),
      bidRequestDetailsPage.PQ_button.first().evaluate(el => el.dispatchEvent(new MouseEvent('click', { bubbles: true })))
    ]);

    vars['FilePathLockedLoans'] = path.join(vars['DownloadDir'], download2.suggestedFilename());
    await download2.saveAs(vars['FilePathLockedLoans']);

    vars['PQFileDataLockedLoans'] = fileHelper.readJsonValue(vars['FilePathLockedLoans'], "");

    expect(String(download2.suggestedFilename())).toContain(vars['ExpectedFileName2']);
    expect(String(vars["PQFileDataLockedLoans"])).toContain(vars["SourceLoanNumUI"]);
    expect(String(vars["PQFileDataLockedLoans"])).toContain(vars["LockedCorrLoan1"]);
    expect(String(vars["PQFileDataLockedLoans"])).toContain(vars["CCodeInUI"]);
    expect(String(vars["PQFileDataLockedLoans"])).toContain(vars["LockedFICOValue"]);
  });
});