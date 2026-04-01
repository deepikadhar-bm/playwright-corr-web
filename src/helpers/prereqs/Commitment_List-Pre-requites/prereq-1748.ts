import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BidRequestsPage } from '../../../pages/correspondant/bid-requests';
import { CommitmentListPage } from '../../../pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../../pages/correspondant/spinner';
// import { runPrereq_1738 } from './prereq-1738';
import { runPrereq_1738 } from '../../../helpers/prereqs/Commitment_List-Pre-requites/prereq-1738';
import { Logger as log } from '../../../../src/helpers/log-helper';


const TC_ID = 'PREREQ_1748(REG_TS03_TC01)';
const TC_TITLE = 'Verify that the loans marked as committed are displayed correctly on the respective commitment detail screen under that commitment section';

export async function runPrereq_1748(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1738(page, vars);

  const bidRequestsPage = new BidRequestsPage(page);
  const commitmentListPage = new CommitmentListPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);


   log.tcStart(TC_ID, TC_TITLE);
  try {

    log.step('Navigating to Price Offered and capturing locked loan details');
    try {
      await correspondentPortalPage.Commitments_Side_Menu.click();
      await correspondentPortalPage.Price_Offered_List_Dropdown.click();
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqId"]);
      await page.keyboard.press('Enter');
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await priceOfferedPage.BidRequestIDPrice_Offered_New(vars["BidReqId"]).click();
      vars["LockedCorrLoanNumPriceOffered"] = await priceOfferedPage.Locked_Corr_LoanPrice_Offered.textContent() || '';
      vars["LockedLastNamePriceOffered"] = await priceOfferedPage.Locked_Last_namePrice_Offered.textContent() || '';
      vars["LockedLoanAmountPriceOffered"] = await priceOfferedPage.Locked_Loan_AmountPrice_Offered.textContent() || '';
      vars["LockedInterestRatePriceOffered"] = await priceOfferedPage.LockedInterest_ratePrice_Offered.textContent() || '';
      vars["LockedRefSecProdPriceOffered"] = await priceOfferedPage.Locked_Ref_Sec_ProdPrice_Offered.textContent() || '';
      vars["LockedRefSecPricePriceOffered"] = await priceOfferedPage.LockedRefSecPricePriceOffered.textContent() || '';
      vars["LockedGrossPriceOffered"] = await priceOfferedPage.Locked_Gross_PricePrice_Offered.textContent() || '';
      vars["LockedHedgeRatioPriceOffered"] = await priceOfferedPage.Locked_Hedge_RatioPrice_Offered.textContent() || '';
      vars["LockedMarkAdjPriceOffered"] = await priceOfferedPage.Locked_MarkAdjPrice_Offered.textContent() || '';
      vars["LockedCurrGrossPriceOffered"] = await priceOfferedPage.Locked_CurrGrossPrice_Offered.textContent() || '';
      log.stepPass('Locked loan details captured for Bid Request ID: ' + vars['BidReqId']);
    } catch (e) {
      log.stepFail(page, 'Failed to capture locked loan details from Price Offered');
      throw e;
    }

    log.step('Navigating to Commitment List and opening commitment details screen');
    try {
      await correspondentPortalPage.Commitments_Side_Menu.click();
      await commitmentListPage.Committed_List_Dropdown.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await priceOfferedPage.Search_Dropdown.type(vars["BidReqId"]);
      await priceOfferedPage.Search_Dropdown.click();
      await priceOfferedPage.Dropdown_Commitment_ID_Bid_Request_ID.waitFor({ state: 'visible' });
      await priceOfferedPage.Dropdown_Commitment_ID_Bid_Request_ID.click();
      await priceOfferedPage.Commitment_IDCommitment_List_Page_New(vars["BidReqId"]).click();
      await priceOfferedPage.Current_Market_ValueDetails_Screen.waitFor({ state: 'visible' });
      log.stepPass('Navigated to Commitment Details screen for Bid Request ID: ' + vars['BidReqId']);
    } catch (e) {
      log.stepFail(page, 'Failed to navigate to Commitment Details screen');
      throw e;
    }

    log.step('Verifying commitment details match Price Offered data');
    try {
      await expect(priceOfferedPage.Commit_OrderCommitment_List).toContainText(vars['CommitmentOrderPriceOffered']);
      log.info("element Commit_OrderCommitment_List contains text:" + vars['CommitmentOrderPriceOffered']);
      await expect(priceOfferedPage.Commit_IDCommitment_List).toContainText(vars['CommitmentIDPriceOffered']);
      log.info("element Commit_IDCommitment_List contains text:" + vars['CommitmentIDPriceOffered']);
      await expect(commitmentListPage.Commit_TimeCommitment_Screen).toContainText(vars['CommitTimePriceOffered']);
      log.info("element Commit_TimeCommitment_Screen contains text:" + vars['CommitTimePriceOffered']);
      await expect(commitmentListPage.No_ofLoansCommitment_List_Details).toContainText(vars['LockedLoansCount']);
      log.info("element No_ofLoansCommitment_List_Details contains text:" + vars['LockedLoansCount']);
      await expect(commitmentListPage.Market_ValueCommitment_List).toContainText(vars['MaraketValuePriceOffered']);
      log.info("element Market_ValueCommitment_List contains text:" + vars['MaraketValuePriceOffered']);
      await expect(priceOfferedPage.Current_Market_ValueDetails_Screen).toContainText(vars['MaraketValuePriceOffered']);
      log.info("element Current_Market_ValueDetails_Screen contains text:" + vars['MaraketValuePriceOffered']);
      await expect(page.getByText(vars['LockedCorrLoanNumPriceOffered'])).toBeVisible();
      log.info("Sucessfully verified Current page is displaying the text:" + vars['LockedCorrLoanNumPriceOffered']);
      await expect(priceOfferedPage.Locked_Last_NameCommitment_List).toContainText(vars['LockedLastNamePriceOffered']);
      log.info("element Locked_Last_NameCommitment_List contains text" + vars['LockedLastNamePriceOffered']);
      await expect(priceOfferedPage.Locked_Loan_AmountCommitment_List).toContainText(vars['LockedLoanAmountPriceOffered']);
      log.info("element Locked_Loan_AmountCommitment_List contains text:" + vars['LockedLoanAmountPriceOffered']);
      await expect(priceOfferedPage.Locked_RefSecProdCommitment_List).toContainText(vars['LockedRefSecProdPriceOffered']);
      log.info("element Locked_RefSecProdCommitment_List contains text:" + vars['LockedRefSecProdPriceOffered']);
      await expect(priceOfferedPage.Locked_RefSecPriceCommitment_List).toContainText(vars['LockedRefSecPricePriceOffered']);
      log.info("element Locked_RefSecPriceCommitment_List contains text:" + vars['LockedRefSecPricePriceOffered']);
      await expect(priceOfferedPage.Locked_GrossPriceCommitment_List).toContainText(vars['LockedGrossPriceOffered']);
      log.info("element Locked_GrossPriceCommitment_List contains text:" + vars['LockedGrossPriceOffered']);
      await expect(priceOfferedPage.Locked_Hedge_RatioCommitment_List).toContainText(vars['LockedHedgeRatioPriceOffered']);
      log.info("element Locked_Hedge_RatioCommitment_List contains text:" + vars['LockedHedgeRatioPriceOffered']);
      await expect(priceOfferedPage.Locked_MarkAdjCommitment_List).toContainText(vars['LockedMarkAdjPriceOffered']);
      log.info("element Locked_MarkAdjCommitment_List contains text:" + vars['LockedMarkAdjPriceOffered']);
      await expect(priceOfferedPage.Locked_CurrGrossCommitment_List).toContainText(vars['LockedCurrGrossPriceOffered']);
      log.info("element Locked_CurrGrossCommitment_List contains text:" + vars['LockedCurrGrossPriceOffered']);
      log.stepPass('All commitment details verified successfully');
    } catch (e) {
      log.stepFail(page, 'Verification failed for commitment details');
      throw e;
    }

    log.tcEnd('PASS');
  } catch (e) {
    await log.captureOnFailure(page, TC_ID, e);
    log.tcEnd('FAIL');
    throw e;
  }
}