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
import { runPrereq_1405 } from '../../../src/helpers/prereqs/prereq-1405';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1405(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS01_TC04_Verify the table data..', async ({ page }) => {

    await correspondentPortalPage.Bid_Requestsside_bar_menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.First_Bid_Request_ID.click();
    await correspondentPortalPage.Corr_Loan_Column_Sort_Arrow.waitFor({ state: 'visible' });
    vars["ExecutionTypeCheck"] = await bidRequestDetailsPage.Execution_Type_from_Details_table1.textContent() || '';
    if (String(vars["ExecutionTypeCheck"]).includes(String("Standard"))) {
      await correspondentPortalPage.Corr_Loan_Column_Sort_Arrow.click();
      await priceOfferedPage.Corr_Loan_Down_Arrow_Sort.waitFor({ state: 'visible' });
      await page.waitForLoadState('networkidle');
      vars["SuccessStatusCount(table1)"] = String(await bidRequestDetailsPage.Success_Rowtable1_bid_request_details.count());
      vars["count"] = "1";
      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["SuccessStatusCount(table1)"]))) {
        for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseInt(vars["count"]); dataIdx++) {
          await bidRequestDetailsPage.Bid_Request_Details_Text.click();
          vars["LoanNumber(table1)"] = await bidRequestDetailsPage.Corr_Loantable1_bid_request_details.textContent() || '';
          vars["LoanNumber(table1)"] = String(vars["LoanNumber(table1)"]).substring(0, String(vars["LoanNumber(table1)"]).length - 7);
          // Write to test data profile: "Loan Number(Standard)" = vars["LoanNumber(table1)"]
          // [DISABLED] Click on Last Name Sort Button
          // await bidRequestDetailsPage.Last_Name_Sort_Button.click();
          // [DISABLED] Wait until the current page is loaded completely
          // await page.waitForLoadState('networkidle');
          // [DISABLED] Wait until the element Last Name Down Arrow Sort is visible
          // await priceOfferedPage.Last_Name_Down_Arrow_Sort.waitFor({ state: 'visible' });
          vars["LastName(table1)"] = await bidRequestDetailsPage.Last_Nametable1_bid_request_details.textContent() || '';
          // Write to test data profile: "Last Name(Standard)" = vars["LastName(table1)"]
          // [DISABLED] Click on Loan Amount Sort Button
          // await bidRequestDetailsPage.Loan_Amount_Sort_Button.click();
          // [DISABLED] Wait until the current page is loaded completely
          // await page.waitForLoadState('networkidle');
          // [DISABLED] Wait until the element Loan Amount Down Arrow Sort is visible
          // await priceOfferedPage.Loan_Amount_Down_Arrow_Sort.waitFor({ state: 'visible' });
          vars["LoanAmount(table1)"] = await bidRequestDetailsPage.Loan_Amounttable1_bid_request_details.textContent() || '';
          // Write to test data profile: "Loan Amount(Standard)" = vars["LoanAmount(table1)"]
        }
        vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
      }
    }
  });
});
