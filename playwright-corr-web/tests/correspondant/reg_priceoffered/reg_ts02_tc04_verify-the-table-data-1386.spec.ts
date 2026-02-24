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
import { runPrereq_1380 } from '../../../src/helpers/prereqs/prereq-1380';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1380(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS02_TC04_Verify the table data', async ({ page }) => {

    await correspondentPortalPage.Bid_Requests_Side_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.First_Bid_Request_ID.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["ExecutionTypeCheck"] = await bidRequestDetailsPage.Execution_Type_from_Details_table1.textContent() || '';
    vars["SuccessStatusCount(table1)"] = String(await bidRequestDetailsPage.Success_Rowtable1_bid_request_details.count());
    await correspondentPortalPage.Corr_Loan_Column_Sort_Arrow.click();
    await priceOfferedPage.Corr_Loan_Down_Arrow_Sort.waitFor({ state: 'visible' });
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["SuccessStatusCount(table1)"]))) {
      await bidRequestDetailsPage.Bid_Request_Details_Text.click();
      for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseInt(vars["count"]); dataIdx++) {
        vars["LoanNumber(table1)"] = await bidRequestDetailsPage.Corr_Loantable1_bid_request_details.textContent() || '';
        vars["LoanNumber(table1)"] = String(vars["LoanNumber(table1)"]).substring(0, String(vars["LoanNumber(table1)"]).length - 7);
        // Write to test data profile: "Loan Number(Standard)" = vars["LoanNumber(table1)"]
        // [DISABLED] Click on Last Name Sort Button
        // await bidRequestDetailsPage.Last_Name_Sort_Button.click();
        // [DISABLED] Wait until the element Last Name Down Arrow Sort is visible
        // await priceOfferedPage.Last_Name_Down_Arrow_Sort.waitFor({ state: 'visible' });
        vars["LastName(table1)"] = await bidRequestDetailsPage.Last_Nametable1_bid_request_details.textContent() || '';
        // Write to test data profile: "Last Name(Standard)" = vars["LastName(table1)"]
        // [DISABLED] Click on Loan Amount Sort Button
        // await bidRequestDetailsPage.Loan_Amount_Sort_Button.click();
        // [DISABLED] Wait until the element Loan Amount Down Arrow Sort is visible
        // await priceOfferedPage.Loan_Amount_Down_Arrow_Sort.waitFor({ state: 'visible' });
        vars["LoanAmount(table1)"] = await bidRequestDetailsPage.Loan_Amounttable1_bid_request_details.textContent() || '';
        // Write to test data profile: "Loan Amount(Standard)" = vars["LoanAmount(table1)"]
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    vars["ExecutionTypeCheck"] = await bidRequestDetailsPage.Execution_Type_from_detailstable2.textContent() || '';
    vars["SuccessStatusCount(table2)"] = String(await bidRequestDetailsPage.Success_Rowtable2_bid_request_details.count());
    // [DISABLED] Click on Loan Number Sort Button 2
    // await bidRequestDetailsPage.Loan_Number_Sort_Button_2.click();
    // [DISABLED] Wait until the element Spinner is not visible
    // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["SuccessStatusCount(table2)"]))) {
      await bidRequestDetailsPage.Bid_Request_Details_Text.click();
      for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseInt(vars["count"]); dataIdx++) {
        vars["LoanNumber(table2)"] = await bidRequestDetailsPage.Corr_Loantable2_bid_request_details.textContent() || '';
        vars["LoanNumber(table2)"] = String(vars["LoanNumber(table2)"]).substring(0, String(vars["LoanNumber(table2)"]).length - 7);
        // Write to test data profile: "Loan Number (ChaseDirect)" = vars["LoanNumber(table2)"]
        // [DISABLED] Click on Last Name Sort Button 2
        // await bidRequestDetailsPage.Last_Name_Sort_Button_2.click();
        // [DISABLED] Wait until the element Spinner is not visible
        // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["LastName(table2)"] = await bidRequestDetailsPage.Last_Nametable2_bid_request_details.textContent() || '';
        // Write to test data profile: "Last Name(Chase Direct)" = vars["LastName(table2)"]
        // [DISABLED] Click on Loan Amount Sort Button 2
        // await bidRequestDetailsPage.Loan_Amount_Sort_Button_2.click();
        // [DISABLED] Wait until the element Spinner is not visible
        // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["LoanAmount(table2)"] = await bidRequestDetailsPage.Loan_Amounttable2_bid_request_details.textContent() || '';
        // Write to test data profile: "Loan Amount(Chase Direct)" = vars["LoanAmount(table2)"]
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
  });
});
