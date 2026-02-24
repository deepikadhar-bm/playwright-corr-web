// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { runPrereq_1455 } from '../../../src/helpers/prereqs/prereq-1455';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let priceOfferedPage: PriceOfferedPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1455(page, vars);
    priceOfferedPage = new PriceOfferedPage(page);
  });

  test('REG_TS10_TC01.1_Perform selecting a unique loan Verify the bid, loan value, and selected loan count displayed in the Commit Selected Loans popup', async ({ page }) => {

    const testData: Record<string, string> = {
  "CommitOrder": "1",
  "Corr Loan": "TestSigma_19-02-2026_SC1_dz_818",
  "Last Name": " LN_Deepika_JULY_16_11 ",
  "Loan Amount": " $150,023 ",
  "Int Rate": " 6.500% ",
  "Ref Sec Prod": " FN30 ",
  "Ref Sec Price": " 117.000 ",
  "Gross Price": " 125.250 ",
  "Hedge Ratio": " 1.550 ",
  "Mark Adj": " -36.619 ",
  "Curr Gross": " 88.631 "
}; // Profile: "All Loans Tab - Committed Loans Tab(Price offered)", row: 0

    vars["count"] = "1";
    for (let dataIdx = -1; dataIdx <= 2; dataIdx++) {
      await expect(priceOfferedPage.Locked_Loan_CommitOrder).toContainText(testData["CommitOrder"]);
      await expect(priceOfferedPage.Corr_Loan_price_offered_table).toContainText(testData["Corr Loan"]);
      await expect(priceOfferedPage.Last_Nameprice_offered_table).toContainText(testData["Last Name"]);
      await expect(priceOfferedPage.Loan_Amountprice_offered_table).toContainText(testData["Loan Amount"]);
      await expect(priceOfferedPage.Int_Rateprice_offered_table).toContainText(testData["Int Rate"]);
      await expect(priceOfferedPage.Ref_Sec_Prodprice_offered_table).toContainText(testData["Ref Sec Prod"]);
      await expect(priceOfferedPage.Ref_Sec_Priceprice_offered_table).toContainText(testData["Ref Sec Price"]);
      await expect(priceOfferedPage.Gross_Priceprice_offered_table).toContainText(testData["Gross Price"]);
      await expect(priceOfferedPage.Hedge_Ratioprice_offered_table).toContainText(testData["Hedge Ratio"]);
      await expect(priceOfferedPage.Mark_Adjprice_offered_table).toContainText(testData["Mark Adj"]);
      await expect(priceOfferedPage.Curr_Grossprice_offered_table).toContainText(testData["Curr Gross"]);
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    await expect(priceOfferedPage.LockedCommitted_Loans_Count).toContainText(vars["CountOfCommittedLoans"]);
    expect(String(vars["ActualOpenAuthLimit"])).toBe(vars["ExpectedOpenAuthLimit"]);
    expect(String(vars["ActualOpenAuthLimitPercentage"])).toBe(vars["ExpectedOpenAuthLimitPercentage"]);
    await expect(priceOfferedPage.Auth_Limit).toContainText(vars["ActualAuthLimit"]);
    expect(String(vars["LastCommittedBidTimeAndDate"])).toBe(vars["BidCommittedDateAndTime"]);
    expect(String(vars["LastCommittedBidLoanLoanAmount"])).toBe(vars["TotalLoanAmountSelectedBids"]);
  });
});
