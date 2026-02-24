// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS06_TC01_Verify that when the loans is selected for commitment, then we should be able to see the selected loan amount value and commit selected button should have that selected loan count displa', async ({ page }) => {
    const testData: Record<string, string> = {
  "RequestIDCreated1stScenario": "87P80EB790BD",
  "CompanyNameInFilters": "Fre",
  "RequestIdfor22-2.1": "87BQ7DB5C69B",
  "RequestIDCreated3rdScenario": "87YK9A2E0311",
  "BidMappingID": "Deepika Aug1",
  "RequestIdfor22-2.2": "87TS8C74F49F",
  "RequestIDfrom13-1": "87RS88D43BB6",
  "RequestIDfrom13-2": "578FE9EDEC6C",
  "RequestIDfrom22-1.2": "874KBED58307",
  "RequestIDfrom10-2": "872V960789CD",
  "RequestIDfrom11-1": "87ZB36778D61",
  "EditedChaseUsersTime": "3",
  "RequestIDfrom10-3": "874WDCCDC3CE",
  "RequestIDfrom22-3.1": "877V3BF90360",
  "Expected Product(price offered)": "FN30",
  "RequestIDfrom22-1.1": "877V3BF90360",
  "RequestIDCreated2ndScenario": "87462B751677",
  "Expected Coupon(price offered)": "3.5",
  "Static Last Name(Pop Up Verfication)": "LN_Deepika_JULY_16_13",
  "RequestIDfrom24-1": "87E42DCFAFE8",
  "Company Name": "Freedom - A4187",
  "RequestIDfrom29-1": "57EFC2170915",
  "RequestIDfrom28-1": "87E15439E568",
  "NO of Batches": "5",
  "RequestIDfrom27-1": "87DEF1EBA5BD",
  "RequestIDFrom28-2": "878S25D7D52F",
  "StatusInFilters": "Price",
  "RequestIDCreated4rthScenario": "87145580866E"
}; // Profile: "Price Offered", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.waitFor({ state: 'visible' });
    await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(testData["RequestIDCreated1stScenario"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.First_bid_id.click();
    await page.waitForLoadState('networkidle');
    await expect(correspondentPortalPage.Get_Price_Button).toBeVisible();
    await expect(priceOfferedPage.Select_all_for_Checkboxprice_offered_screen).toBeVisible();
    await expect(priceOfferedPage.First_Check_Boxprice_offered_screen).toBeVisible();
    await priceOfferedPage.First_Check_Boxprice_offered_screen.check();
    vars["LoanAmount(table)"] = await priceOfferedPage.Loan_amount_For_First_Selected_Check_Boxprice_offered_screen.textContent() || '';
    vars["TotalLoanAmountCount(table)"] = String(await priceOfferedPage.Loan_amount_For_First_Selected_Check_Boxprice_offered_screen.count());
    vars["TotalLoanAmount(table)"] = String(vars["LoanAmount(table)"]).replace(/\$/g, '');
    vars["TotalLoanAmount(table)"] = String(vars["TotalLoanAmount(table)"]).replace(/\,/g, '');
    vars["LoanAmount(footer)"] = await priceOfferedPage.Selected_Loan_Amount_Footer_Displayprice_offered.textContent() || '';
    vars["TotalLoanAmount(footer)"] = String(vars["LoanAmount(footer)"]).replace(/\$/g, '');
    vars["TotalLoanAmount(footer)"] = String(vars["TotalLoanAmount(footer)"]).replace(/\,/g, '');
    expect(String(vars["TotalLoanAmount(table)"])).toBe(vars["TotalLoanAmount(footer)"]);
    vars["LoanAmountCount(footer)"] = await priceOfferedPage.Commit_Selected_Count_Footer_Displayprice_offered.textContent() || '';
    vars["TotalLoanAmountCount(footer)"] = String(vars["LoanAmountCount(footer)"]).replace(/\(/g, '');
    vars["TotalLoanAmountCount(footer)"] = String(vars["TotalLoanAmountCount(footer)"]).replace(/\)/g, '');
    expect(String(vars["TotalLoanAmountCount(table)"])).toBe(vars["TotalLoanAmountCount(footer)"]);
    await expect(priceOfferedPage.Selected_Loan_Amt_Footer_Textprice_offered).toContainText("Selected Loan Amt");
    await priceOfferedPage.First_Check_Boxprice_offered_screen.uncheck();
    await expect(priceOfferedPage.First_Check_Boxprice_offered_screen).toBeVisible();
    await expect(priceOfferedPage.Select_all_for_Checkboxprice_offered_screen).toBeVisible();
    await expect(priceOfferedPage.Commit_Selected_Count_Footer_Displayprice_offered).toBeVisible();
    await expect(priceOfferedPage.Selected_Loan_Amount_Footer_Displayprice_offered).toBeVisible();
    await expect(priceOfferedPage.Selected_Loan_Amt_Footer_Textprice_offered).toBeVisible();
    vars["checkedboxcount(table)"] = "0";
    vars["total"] = "0";
    vars["count1"] = "1";
    vars["UncheckedCheckBoxCount(table)"] = String(await priceOfferedPage.All_UnChecked_Check_Boxprice_offered_screen.count());
    while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["UncheckedCheckBoxCount(table)"]))) {
      await priceOfferedPage.All_Unchecked_Check_box2price_offered_screen.check();
      await expect(priceOfferedPage.All_Unchecked_Check_box2price_offered_screen).toBeVisible();
      vars["SelectedLoanAmount(table)"] = await priceOfferedPage.Loan_Amount_Only_Selected_Check_Boxprice_offered_screen.textContent() || '';
      vars["SelectedLoanAmountValue(table)"] = String(vars["SelectedLoanAmount(table)"]).replace(/\$/g, '');
      vars["SelectedLoanAmountValue(table)"] = String(vars["SelectedLoanAmountValue(table)"]).replace(/\,/g, '');
      vars["checkedboxcount(table)"] = (parseFloat(String("1")) + parseFloat(String(vars["checkedboxcount(table)"]))).toFixed(0);
      vars["total"] = (parseFloat(String(vars["total"])) + parseFloat(String(vars["SelectedLoanAmountValue(table)"]))).toFixed(0);
      vars["count1"] = (parseFloat(String("1")) + parseFloat(String(vars["count1"]))).toFixed(0);
    }
    vars["totalcheckedboxcount(table)"] = vars["checkedboxcount(table)"];
    vars["TotalSelectedLoanAmountValue(table)"] = vars["total"];
    vars["LoanAmount(footer)"] = await priceOfferedPage.Selected_Loan_Amount_Footer_Displayprice_offered.textContent() || '';
    vars["TotalLoanAmount(footer)"] = String(vars["LoanAmount(footer)"]).replace(/\$/g, '');
    vars["TotalLoanAmount(footer)"] = String(vars["TotalLoanAmount(footer)"]).replace(/\,/g, '');
    expect(String(vars["TotalSelectedLoanAmountValue(table)"])).toBe(vars["TotalLoanAmount(footer)"]);
    await expect(priceOfferedPage.Commit_Selected_Footer_Buttonprice_offered).toBeVisible();
    vars["LoanCount(footer)"] = await priceOfferedPage.Commit_Selected_Count_Footer_Displayprice_offered.textContent() || '';
    vars["TotalLoanCount(footer)"] = String(vars["LoanCount(footer)"]).replace(/\(/g, '');
    vars["TotalLoanCount(footer)"] = String(vars["TotalLoanCount(footer)"]).replace(/\)/g, '');
    expect(String(vars["totalcheckedboxcount(table)"])).toBe(vars["TotalLoanCount(footer)"]);
    await expect(priceOfferedPage.Selected_Loan_Amt_Footer_Textprice_offered).toContainText("Selected Loan Amt");
    await expect(priceOfferedPage.First_Check_Boxprice_offered_screen).toBeVisible();
    await expect(priceOfferedPage.First_Check_Boxprice_offered_screen).toBeVisible();
    await priceOfferedPage.First_Check_Boxprice_offered_screen.uncheck();
    await expect(priceOfferedPage.First_Check_Boxprice_offered_screen).toBeVisible();
    vars["total"] = "0";
    vars["count1"] = "1";
    vars["TotalCheckedCount(from second checkbox)"] = String(await priceOfferedPage.Checked_Checkbox_Count_From_Second_Checkboxprice_offered_screen.count());
    while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["TotalCheckedCount(from second checkbox)"]))) {
      await expect(priceOfferedPage.Checked_Checkbox_Count_From_Second_Checkbox2price_offered_screen).toBeVisible();
      vars["LoanAmount"] = await priceOfferedPage.Loan_Amount_From_Second_Checked_Checkboxprice_offered.textContent() || '';
      vars["LoanAmountValue"] = String(vars["LoanAmount"]).replace(/\$/g, '');
      vars["LoanAmountValue"] = String(vars["LoanAmountValue"]).replace(/\,/g, '');
      vars["total"] = (parseFloat(String(vars["total"])) + parseFloat(String(vars["LoanAmountValue"]))).toFixed(0);
      vars["count1"] = (parseFloat(String("1")) + parseFloat(String(vars["count1"]))).toFixed(0);
    }
    vars["TotalDisplayedLoanAmount(table)"] = vars["total"];
    await expect(priceOfferedPage.Selected_Loan_Amount_Footer_Displayprice_offered).toBeVisible();
    vars["DisplayedLoanAmount(footer)"] = await priceOfferedPage.Selected_Loan_Amount_Footer_Displayprice_offered.textContent() || '';
    vars["TotalDisplayedLoanAmount(footer)"] = String(vars["DisplayedLoanAmount(footer)"]).replace(/\$/g, '');
    vars["TotalDisplayedLoanAmount(footer)"] = String(vars["TotalDisplayedLoanAmount(footer)"]).replace(/\,/g, '');
    expect(String(vars["TotalDisplayedLoanAmount(table)"])).toBe(vars["TotalDisplayedLoanAmount(footer)"]);
    await expect(priceOfferedPage.Commit_Selected_Footer_Buttonprice_offered).toBeVisible();
    vars["DisplayedLoanCount(footer)"] = await priceOfferedPage.Commit_Selected_Count_Footer_Displayprice_offered.textContent() || '';
    vars["TotalDisplayedLoanCount(footer)"] = String(vars["DisplayedLoanCount(footer)"]).replace(/\(/g, '');
    vars["TotalDisplayedLoanCount(footer)"] = String(vars["TotalDisplayedLoanCount(footer)"]).replace(/\)/g, '');
    expect(String(vars["TotalCheckedCount(from second checkbox)"])).toBe(vars["TotalDisplayedLoanCount(footer)"]);
    await expect(priceOfferedPage.Selected_Loan_Amt_Footer_Textprice_offered).toContainText("Selected Loan Amt");
  });
});
