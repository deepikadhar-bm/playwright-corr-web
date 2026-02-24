// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1398 } from '../../../src/helpers/prereqs/prereq-1398';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1398(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS01_TC04.1_Verify the table data..', async ({ page }) => {

    const testData: Record<string, string> = {
  "Loan Number(Standard)": "TestSigma_23-02-2026_SC1_c5_270 | PQ | PS",
  "Last Name(Standard)": " LN_Deepika_JULY_16_13 ",
  "Loan Amount(Standard)": " $150,025 "
} // Profile: "Standard Loan Details Table", row 0;

    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["TotalRowCountValue"] = String(await priceOfferedPage.All_Bid_Request_IDprice_offered1.count());
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalRowCountValue"]))) {
      vars["ExecutionType(price offered screen1)"] = await priceOfferedPage.All_Execution_Typeprice_offered_screen1.textContent() || '';
      if (String(vars["ExecutionType(price offered screen1)"]).includes(String("STANDARD"))) {
        await priceOfferedPage.All_Bid_Request_IDprice_offered2.click();
        await page.waitForLoadState('networkidle');
        vars["TotalRowCount(price offered screen)"] = String(await priceOfferedPage.Row_Count_For_Loan_Numberprice_offered_screen.count());
        await correspondentPortalPage.Corr_Loan_Column_Sort_Arrow.click();
        await priceOfferedPage.Corr_Loan_Down_Arrow_Sort.waitFor({ state: 'visible' });
        await page.waitForLoadState('networkidle');
        vars["count1"] = "1";
        while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["TotalRowCount(price offered screen)"]))) {
          await priceOfferedPage.BidRequestIDTextDetails.click();
          for (let dataIdx = parseInt(vars["count1"]); dataIdx <= parseInt(vars["count1"]); dataIdx++) {
            await expect(priceOfferedPage.Loan_Numberprice_offered_screen_table).toContainText(testData["Loan Number(Standard)"]);
            // [DISABLED] Click on Last Name Sort Button
            // await bidRequestDetailsPage.Last_Name_Sort_Button.click();
            // [DISABLED] Wait until the current page is loaded completely
            // await page.waitForLoadState('networkidle');
            // [DISABLED] Wait until the element Last Name Down Arrow Sort is visible
            // await priceOfferedPage.Last_Name_Down_Arrow_Sort.waitFor({ state: 'visible' });
            await expect(priceOfferedPage.Last_Nameprice_offered_screen_table).toContainText(testData["Last Name(Standard)"]);
            // [DISABLED] Click on Loan Amount Sort Button
            // await bidRequestDetailsPage.Loan_Amount_Sort_Button.click();
            // [DISABLED] Wait until the current page is loaded completely
            // await page.waitForLoadState('networkidle');
            // [DISABLED] Wait until the element Loan Amount Down Arrow Sort is visible
            // await priceOfferedPage.Loan_Amount_Down_Arrow_Sort.waitFor({ state: 'visible' });
            await expect(priceOfferedPage.Loan_Amountprice_offered_screen_table).toContainText(testData["Loan Amount(Standard)"]);
          }
          vars["InterestRateFromTable"] = await priceOfferedPage.Int_Rateprice_offered_screen_table.textContent() || '';
          vars["InterestRateFromTable"] = String(vars["InterestRateFromTable"]).trim();
          expect(String(vars["InterestRateFromTable"])).toMatch(/^\d+\.\d{3}%$/);
          vars["ProductPriceOfferedScreen"] = await priceOfferedPage.Productprice_offered.textContent() || '';
          vars["ProductPriceOfferedScreen"] = String(vars["ProductPriceOfferedScreen"]).trim();
          await expect(priceOfferedPage.Ref_Sec_Prodprice_offered_screen_table).toContainText(vars["ProductPriceOfferedScreen"]);
          vars["ReferencePriceFromTable"] = await priceOfferedPage.Ref_Sec_Priceprice_offered_screen_table.textContent() || '';
          vars["ReferencePriceFromTable"] = String(vars["ReferencePriceFromTable"]).trim();
          expect(String(vars["ReferencePriceFromTable"])).toMatch(/^\d+\.\d{3}$/);
          vars["GrossPriceFromTable"] = await priceOfferedPage.Gross_Priceprice_offered_screen_table.textContent() || '';
          vars["GrossPriceFromTable"] = String(vars["GrossPriceFromTable"]).trim();
          expect(String(vars["GrossPriceFromTable"])).toMatch(/^\d+\.\d{3}$/);
          vars["HedgeRationFromTable"] = await priceOfferedPage.Hedge_Ratioprice_offered_screen_table.textContent() || '';
          vars["HedgeRationFromTable"] = String(vars["HedgeRationFromTable"]).trim();
          expect(String(vars["HedgeRationFromTable"])).toMatch(/^\d+\.\d{3}$/);
          await expect(priceOfferedPage.Mark_Adjprice_offered_screen_table).toContainText("-");
          await expect(priceOfferedPage.Curr_Grossprice_offered_screen_table).toContainText("-");
          vars["count1"] = (parseFloat(String("1")) + parseFloat(String(vars["count1"]))).toFixed(0);
        }
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
  });
});
