// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1394 } from '../../../src/helpers/prereqs/prereq-1394';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1394(page, vars);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS03_TC01_Verify the Get price action can be performed when the status is price offered', async ({ page }) => {

    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText("Price Offered\r\r")).toBeVisible();
    await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
    // Write to test data profile: "RequestIDCreated3rdScenario" = vars["RequestIDDetails"]
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.First_bid_id.click();
    await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Current_Marketprice_offered).toContainText("-");
    await expect(priceOfferedPage.Current_Market_Diffprice_offered).toContainText("-");
    vars["count1"] = "1";
    vars["TotalRowCountInPriceOffered"] = String(await priceOfferedPage.All_Bid_Request_ID_Rowsprice_offered_screen1.count());
    while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["TotalRowCountInPriceOffered"]))) {
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
      await expect(priceOfferedPage.Mark_Adjprice_offered_screen_table).toContainText("-");
      await expect(priceOfferedPage.Curr_Grossprice_offered_screen_table).toContainText("-");
      vars["count1"] = (parseFloat(String("1")) + parseFloat(String(vars["count1"]))).toFixed(0);
    }
    await correspondentPortalPage.Get_Price_Button.click();
    await page.waitForLoadState('networkidle');
    await priceOfferedPage.Remaining_Timeprice_offered.waitFor({ state: 'visible' });
    vars["CurrentMarketValue"] = await priceOfferedPage.Current_Marketprice_offered.textContent() || '';
    vars["CurrentMarketValue"] = String(vars["CurrentMarketValue"]).trim();
    expect(String(vars["CurrentMarketValue"])).toMatch(/^\d+\.\d{3}$/);
    vars["CurrentMarketDiffValue"] = await priceOfferedPage.Current_Market_Diffprice_offered.textContent() || '';
    vars["CurrentMarketDiffValue"] = String(vars["CurrentMarketDiffValue"]).trim();
    expect(String(vars["CurrentMarketDiffValue"])).toMatch(/^[+-]?\d+\.\d{3}$/);
    vars["count1"] = "1";
    vars["TotalRowCountInPriceOffered"] = String(await priceOfferedPage.All_Bid_Request_ID_Rowsprice_offered_screen1.count());
    while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["TotalRowCountInPriceOffered"]))) {
      vars["IntRateValue"] = await priceOfferedPage.Int_Rateprice_offered_screen_table.textContent() || '';
      vars["IntRateValue"] = String(vars["IntRateValue"]).trim();
      expect(String(vars["IntRateValue"])).toMatch(/^\d+\.\d{3}%$/);
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
  });
});
