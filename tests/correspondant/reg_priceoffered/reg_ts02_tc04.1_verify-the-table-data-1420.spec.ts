// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1386 } from '../../../src/helpers/prereqs/prereq-1386';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1386(page, vars);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS02_TC04.1_Verify the table data', async ({ page }) => {

    const testData: Record<string, string> = {
  "Loan Number (ChaseDirect)": "TestSigma_22-02-2026_SC1_2w_592 | PQ | PS",
  "Last Name(Chase Direct)": " LN_Deepika_JULY_16_12 ",
  "Loan Amount(Chase Direct)": " $150,025 ",
  "Loan Number(Standard)": "",
  "Last Name(Standard)": "",
  "Loan Amount(Standard)": ""
} // Profile: "Chase Direct Loan Details Table", row 0;

    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.waitFor({ state: 'visible' });
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["count"] = "1";
    await priceOfferedPage.BidReqId_Chase_Direct.click();
    await correspondentPortalPage.Corr_Loan_Column_Sort_Arrow.waitFor({ state: 'visible' });
    vars["ExecutionType(price offered screen1)"] = await priceOfferedPage.Eceution_Type_Price_Offered_Details.textContent() || '';
    expect(String(vars["ExecutionType(price offered screen1)"])).toBe("CHASE_DIRECT");
    vars["TotalRowCount(price offered screen)"] = String(await priceOfferedPage.Row_Count_For_Loan_Numberprice_offered_screen.count());
    await correspondentPortalPage.Corr_Loan_Column_Sort_Arrow.click();
    await priceOfferedPage.Corr_Loan_Down_Arrow_Sort.waitFor({ state: 'visible' });
    vars["count1"] = "1";
    while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["TotalRowCount(price offered screen)"]))) {
      for (let dataIdx = parseInt(vars["count1"]); dataIdx <= parseInt(vars["count1"]); dataIdx++) {
        await expect(priceOfferedPage.Loan_Numberprice_offered_screen_table).toContainText(testData["Loan Number (ChaseDirect)"]);
        await expect(priceOfferedPage.Last_Nameprice_offered_screen_table).toContainText(testData["Last Name(Chase Direct)"]);
        await expect(priceOfferedPage.Loan_Amountprice_offered_screen_table).toContainText(testData["Loan Amount(Chase Direct)"]);
      }
      vars["InterestRateFromTable"] = await priceOfferedPage.Int_Rateprice_offered_screen_table.textContent() || '';
      vars["InterestRateFromTable"] = String(vars["InterestRateFromTable"]).trim();
      expect(String(vars["InterestRateFromTable"])).toMatch(/^\d+\.\d{3}%$/);
      vars["Product(price offered screen)"] = await priceOfferedPage.Productprice_offered.textContent() || '';
      await expect(priceOfferedPage.Ref_Sec_Prodprice_offered_screen_table).toContainText(vars["Product(price offered screen)"]);
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
    await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidReqId_Standard.click();
    await correspondentPortalPage.Corr_Loan_Column_Sort_Arrow.waitFor({ state: 'visible' });
    await correspondentPortalPage.Corr_Loan_Column_Sort_Arrow.click();
    await priceOfferedPage.Corr_Loan_Down_Arrow_Sort.waitFor({ state: 'visible' });
    vars["TotalRowCount(price offered screen)"] = String(await priceOfferedPage.Row_Count_For_Loan_Numberprice_offered_screen.count());
    vars["ExecutionType(price offered screen1)"] = await priceOfferedPage.Eceution_Type_Price_Offered_Details.textContent() || '';
    expect(String(vars["ExecutionType(price offered screen1)"])).toBe("STANDARD");
    vars["count1"] = "1";
    while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["TotalRowCount(price offered screen)"]))) {
      for (let dataIdx = parseInt(vars["count1"]); dataIdx <= parseInt(vars["count1"]); dataIdx++) {
        await expect(priceOfferedPage.Loan_Numberprice_offered_screen_table).toContainText(testData["Loan Number(Standard)"]);
        await expect(priceOfferedPage.Last_Nameprice_offered_screen_table).toContainText(testData["Last Name(Standard)"]);
        await expect(priceOfferedPage.Loan_Amountprice_offered_screen_table).toContainText(testData["Loan Amount(Standard)"]);
      }
      vars["InterestRateFromTable"] = await priceOfferedPage.Int_Rateprice_offered_screen_table.textContent() || '';
      vars["InterestRateFromTable"] = String(vars["InterestRateFromTable"]).trim();
      expect(String(vars["InterestRateFromTable"])).toMatch(/^\d+\.\d{3}%$/);
      vars["Product(price offered screen)"] = await priceOfferedPage.Productprice_offered.textContent() || '';
      await expect(priceOfferedPage.Ref_Sec_Prodprice_offered_screen_table).toContainText(vars["Product(price offered screen)"]);
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
  });
});
