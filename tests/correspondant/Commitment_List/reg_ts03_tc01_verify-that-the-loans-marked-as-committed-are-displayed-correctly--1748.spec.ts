// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1738 } from '../../../src/helpers/prereqs/prereq-1738';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1738(page, vars);
    bidRequestsPage = new BidRequestsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS03_TC01_Verify that the loans marked as committed are displayed correctly on the respective commitment detail screen under that commitment section', async ({ page }) => {

    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqId"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidRequestIDPrice_Offered_New.click();
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
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["BidReqId"]);
    await priceOfferedPage.Dropdown_Commitment_ID_Bid_Request_ID.click();
    await priceOfferedPage.Commitment_IDCommitment_List_Page_New.click();
    await priceOfferedPage.Current_Market_ValueDetails_Screen.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Commit_OrderCommitment_List).toContainText(vars["CommitmentOrderPriceOffered"]);
    await expect(priceOfferedPage.Commit_IDCommitment_List).toContainText(vars["CommitmentIDPriceOffered"]);
    await expect(commitmentListPage.Commit_TimeCommitment_Screen).toContainText(vars["CommitTimePriceOffered"]);
    await expect(commitmentListPage.No_ofLoansCommitment_List_Details).toContainText(vars["LockedLoansCount"]);
    await expect(commitmentListPage.Market_ValueCommitment_List).toContainText(vars["MaraketValuePriceOffered"]);
    await expect(priceOfferedPage.Current_Market_ValueDetails_Screen).toContainText(vars["MaraketValuePriceOffered"]);
    // [DISABLED] Verify that the element Current Market Value(Details Screen) displays text MaraketValuePriceOffered and With Scrollable FALSE
    // await expect(priceOfferedPage.Current_Market_ValueDetails_Screen).toContainText(vars["MaraketValuePriceOffered"]);
    await expect(page.getByText(vars["LockedCorrLoanNumPriceOffered"])).toBeVisible();
    await expect(priceOfferedPage.Locked_Last_NameCommitment_List).toContainText(vars["LockedLastNamePriceOffered"]);
    await expect(priceOfferedPage.Locked_Loan_AmountCommitment_List).toContainText(vars["LockedLoanAmountPriceOffered"]);
    await expect(priceOfferedPage.Locked_RefSecProdCommitment_List).toContainText(vars["LockedRefSecProdPriceOffered"]);
    await expect(priceOfferedPage.Locked_RefSecPriceCommitment_List).toContainText(vars["LockedRefSecPricePriceOffered"]);
    await expect(priceOfferedPage.Locked_GrossPriceCommitment_List).toContainText(vars["LockedGrossPriceOffered"]);
    await expect(priceOfferedPage.Locked_Hedge_RatioCommitment_List).toContainText(vars["LockedHedgeRatioPriceOffered"]);
    await expect(priceOfferedPage.Locked_MarkAdjCommitment_List).toContainText(vars["LockedMarkAdjPriceOffered"]);
    await expect(priceOfferedPage.Locked_CurrGrossCommitment_List).toContainText(vars["LockedCurrGrossPriceOffered"]);
  });
});
