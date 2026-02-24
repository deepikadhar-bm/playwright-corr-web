// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1417 } from '../../../src/helpers/prereqs/prereq-1417';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1417(page, vars);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS03_TC02_Verify the Get price action can be performed when the status is partially committed', async ({ page }) => {

    await expect(priceOfferedPage.First_Check_Boxprice_offered_screen).toBeVisible();
    await expect(priceOfferedPage.First_Check_Boxprice_offered_screen).toBeVisible();
    await priceOfferedPage.First_Check_Boxprice_offered_screen.check();
    await expect(priceOfferedPage.First_Check_Boxprice_offered_screen).toBeVisible();
    await expect(priceOfferedPage.Commit_Selected_Footer_Buttonprice_offered).toBeVisible();
    await priceOfferedPage.Commit_Selected_Footer_Buttonprice_offered.click();
    await priceOfferedPage.Commit_Selected_Loanspopupprice_offered_screen.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Commit_Selected_Loanspopupprice_offered_screen).toContainText("Commit Selected Loans");
    await expect(page.getByText("Selecting “Yes, Commit” is confirmation of entering a Mandatory Commitment along with the pair-off risks associated with not meeting the conditions of the commitment.")).toBeVisible();
    await priceOfferedPage.Yes_Commit_Buttonpopup_price_offered_screen.click();
    await priceOfferedPage.Yes_Commit_Buttonpopup_price_offered_screen.waitFor({ state: 'hidden' });
    await expect(priceOfferedPage.Commit_Selected_Loans2popup_price_offered_screen).toContainText("updated successfully");
    await priceOfferedPage.Okay_Buttonpopup_price_offered_screen.click();
    // [DISABLED] Wait until the element Spinner is not visible
    // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await page.waitForLoadState('networkidle');
    await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(priceOfferedPage.Status1price_offered_standard).toContainText("Partially Committed");
    await priceOfferedPage.First_bid_id.click();
    await page.waitForLoadState('networkidle');
    await stepGroups.stepGroup_Price_offered_Details_Screen_Verification_Price_details_and_(page, vars);
    await correspondentPortalPage.Get_Price_Button.click();
    await page.waitForLoadState('networkidle');
    vars["CurrentMarketValue"] = await priceOfferedPage.Current_Marketprice_offered.textContent() || '';
    vars["CurrentMarketValue"] = String(vars["CurrentMarketValue"]).trim();
    expect(String(vars["CurrentMarketValue"])).toMatch(/^\d+\.\d{3}$/);
    vars["CurrentMarketDiffValue"] = await priceOfferedPage.Current_Market_Diffprice_offered.textContent() || '';
    vars["CurrentMarketDiffValue"] = String(vars["CurrentMarketDiffValue"]).trim();
    expect(String(vars["CurrentMarketDiffValue"])).toMatch(/^[+-]?\d+\.\d{3}$/);
    vars["count1"] = "1";
    vars["TotalRowsCountValue"] = String(await priceOfferedPage.All_Bid_Request_ID_Rowsprice_offered_screen1.count());
    while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["TotalRowsCountValue"]))) {
      vars["IntRateValue"] = await priceOfferedPage.Int_Rateprice_offered_screen_table.textContent() || '';
      vars["IntRateValue"] = String(vars["IntRateValue"]).trim();
      expect(String(vars["IntRateValue"])).toMatch(/^\d+\.\d{3}\%$/);
      vars["RefSecPriceValue"] = await priceOfferedPage.Ref_Sec_Priceprice_offered_screen_table.textContent() || '';
      vars["RefSecPriceValue"] = String(vars["RefSecPriceValue"]).trim();
      expect(String(vars["RefSecPriceValue"])).toMatch(/^\d+\.\d{3}$/);
      vars["GrossPriceValue"] = await priceOfferedPage.Gross_Priceprice_offered_screen_table.textContent() || '';
      vars["GrossPriceValue"] = String(vars["GrossPriceValue"]).trim();
      expect(String(vars["GrossPriceValue"])).toMatch(/^\d+\.\d{3}$/);
      vars["HedgeRatioValue"] = await priceOfferedPage.Hedge_Ratioprice_offered_screen_table.textContent() || '';
      vars["HedgeRatioValue"] = String(vars["HedgeRatioValue"]).trim();
      expect(String(vars["HedgeRatioValue"])).toMatch(/^\d+\.\d{3}$/);
      vars["MarkAdjValue"] = await priceOfferedPage.Mark_Adjprice_offered_screen_table.textContent() || '';
      vars["MarkAdjValue"] = String(vars["MarkAdjValue"]).trim();
      expect(String(vars["MarkAdjValue"])).toMatch(/^[+-]?\d+\.\d{3}$/);
      vars["CurrGrossValue"] = await priceOfferedPage.Curr_Grossprice_offered_screen_table.textContent() || '';
      vars["CurrGrossValue"] = String(vars["CurrGrossValue"]).trim();
      expect(String(vars["CurrGrossValue"])).toMatch(/^\d+\.\d{3}$/);
      vars["count1"] = (parseFloat(String("1")) + parseFloat(String(vars["count1"]))).toFixed(0);
    }
    // Write to test data profile: "RequestIDCreated3rdScenario" = vars["RequestIDDetails"]
  });
});
