import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedDetailsPage } from '../../../src/pages/correspondant/price-offered-details';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '@pages/correspondant';
import { PlaywrightHelpers } from '../../../src/helpers/AddonHelpers';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string>;
  let Methods: PlaywrightHelpers;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedDetailsPage: PriceOfferedDetailsPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    Methods = new PlaywrightHelpers(page, vars);

    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedDetailsPage = new PriceOfferedDetailsPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS16_TC01_Perform download action for PQ file and verify the details', async ({ page }) => {

    vars['DownloadDir'] = path.join(process.cwd(), 'downloads');

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);

    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidReqIDPartially_Committed_or_Committed.first().click();
    await page.waitForLoadState('networkidle');

    vars['SourceLoanUI'] = (await priceOfferedPage.BidRequestIDTextDetails.first().textContent())?.trim() || '';
    vars['CorrLoanUI'] = (await priceOfferedDetailsPage.First_Loan_NumberCommited_or_Uncommitted.textContent())?.trim() || '';
    vars['CorrCodeUI'] = (await priceOfferedPage.CCode_In_UI.textContent())?.trim() || '';

    Methods.concatenate(`"sourceLoanNumber" : "`, vars['SourceLoanUI'], 'SourceLoanExpected');
    Methods.concatenate(`"corrLoanNumber" : "`, vars['CorrLoanUI'], 'CorrLoanExpected');
    Methods.concatenate(`"corrCode" : "`, vars['CorrCodeUI'], 'CorrCodeExpected');
    Methods.concatenate('pricing-request-', vars['CorrLoanUI'], 'ExpectedFileName1');

    Methods.getCurrentTimestamp('dd-MM-yyyy HH-mm-ss', 'TimeStamp');

    const pq = priceOfferedDetailsPage.First_PQ_Button_Committed_or_Uncommited;
    await pq.scrollIntoViewIfNeeded();

    const [download1] = await Promise.all([
      page.waitForEvent('download'),
      pq.evaluate(el => el.dispatchEvent(new MouseEvent('click', { bubbles: true })))
    ]);

    vars['SavedFileName1'] = vars['TimeStamp'] + '_' + download1.suggestedFilename();

    vars['FilePathAllLoans'] = path.join(
      vars['DownloadDir'],
      vars['SavedFileName1']
    );

    await download1.saveAs(vars['FilePathAllLoans']);

    expect(vars['SavedFileName1']).toContain(vars['ExpectedFileName1']);

    vars['FileTextAllLoans'] = fs.readFileSync(vars['FilePathAllLoans'], 'utf-8');

    expect(vars['FileTextAllLoans']).toContain(vars['SourceLoanExpected']);
    expect(vars['FileTextAllLoans']).toContain(vars['CorrLoanExpected']);
    expect(vars['FileTextAllLoans']).toContain(vars['CorrCodeExpected']);

    await priceOfferedPage.LockedCommitted_Loans.click();
    await priceOfferedPage.LockSymbolOpen.waitFor({ state: 'visible' });

    vars['LockedCorrLoanUI'] = (await priceOfferedPage.Locked_CorrLoan.first().textContent())?.trim() || '';

    Methods.concatenate('pricing-request-', vars['LockedCorrLoanUI'], 'ExpectedFileName2');
    Methods.concatenate(`"corrLoanNumber" : "`, vars['LockedCorrLoanUI'], 'LockedCorrLoanExpected');

    Methods.getCurrentTimestamp('dd-MM-yyyy HH-mm-ss', 'TimeStamp2');

    const [download2] = await Promise.all([
      page.waitForEvent('download'),
      bidRequestDetailsPage.PQ_button.first().evaluate(el => el.dispatchEvent(new MouseEvent('click', { bubbles: true })))
    ]);

    vars['SavedFileName2'] = vars['TimeStamp2'] + '_' + download2.suggestedFilename();

    vars['FilePathLockedLoans'] = path.join(
      vars['DownloadDir'],
      vars['SavedFileName2']
    );

    await download2.saveAs(vars['FilePathLockedLoans']);

    expect(vars['SavedFileName2']).toContain(vars['ExpectedFileName2']);

    vars['FileTextLockedLoans'] = fs.readFileSync(vars['FilePathLockedLoans'], 'utf-8');

    expect(vars['FileTextLockedLoans']).toContain(vars['SourceLoanExpected']);
    expect(vars['FileTextLockedLoans']).toContain(vars['LockedCorrLoanExpected']);
    expect(vars['FileTextLockedLoans']).toContain(vars['CorrCodeExpected']);
  });
});