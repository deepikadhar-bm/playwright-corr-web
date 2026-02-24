// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestsPage = new BidRequestsPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS08_TC04_Input the duplicate, unidentified and fresh loan number and verify the error messages should be displayed and also user should be allowed to proceed with commit action since it contains ', async ({ page }) => {
    const testData: Record<string, string> = {
  "RequestIDCreated3rdScenario": "87YK9A2E0311",
  "CompanyNameInFilters": "Fre",
  "RequestIdfor22-2.1": "87BQ7DB5C69B",
  "BidMappingID": "Deepika Aug1",
  "RequestIdfor22-2.2": "87TS8C74F49F",
  "RequestIDfrom13-1": "87RS88D43BB6",
  "RequestIDfrom13-2": "578FE9EDEC6C",
  "RequestIDfrom22-1.2": "874KBED58307",
  "RequestIDfrom10-2": "872V960789CD",
  "RequestIDfrom11-1": "87ZB36778D61",
  "EditedChaseUsersTime": "3",
  "RequestIDCreated1stScenario": "87P80EB790BD",
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
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(testData["RequestIDCreated3rdScenario"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.First_bid_id.click();
    await page.waitForLoadState('networkidle');
    vars["CommittedLoanNumber(price offered table)"] = await priceOfferedPage.First_Comitted_loan_Number.textContent() || '';
    vars["CommittedLoanNumber(price offered table)"] = String(vars["CommittedLoanNumber(price offered table)"]).substring(0, String(vars["CommittedLoanNumber(price offered table)"]).length - 10);
    vars["FreshLoanNumber(price offered table)"] = await priceOfferedPage.First_Loan_Num_Price_offered.textContent() || '';
    // [DISABLED] Remove the no of ( 0,10 ) positions of given string FreshLoanNumber(price offered table) and store into runtime variable FreshLoanNumber(price offered table)
    // vars["FreshLoanNumber(price offered table)"] = String(vars["FreshLoanNumber(price offered table)"]).substring(0, String(vars["FreshLoanNumber(price offered table)"]).length - 10);
    vars["UnidentifiedLoanNumber(price offered table)"] = String(vars["FreshLoanNumber(price offered table)"]).substring(0, String(vars["FreshLoanNumber(price offered table)"]).length - 5);
    vars["CommittedFreshLoan"] = String(vars["CommittedLoanNumber(price offered table)"]) + "," + String(vars["FreshLoanNumber(price offered table)"]);
    vars["CommittedFreshUnidentifiedLoan(price offered table)"] = String(vars["CommittedFreshLoan"]) + "," + String(vars["UnidentifiedLoanNumber(price offered table)"]);
    await correspondentPortalPage.Paste_Loans_Button1.click();
    await correspondentPortalPage.Paste_loan_numbers_here1.fill(vars["CommittedFreshUnidentifiedLoan(price offered table)"]);
    await priceOfferedPage.Validate_Button_Paste_loan_popup.click();
    await page.waitForLoadState('networkidle');
    await expect(correspondentPortalPage.Errors_Foundred_text_danger).toBeVisible();
    await expect(correspondentPortalPage.Errors_Foundred_text_danger).toContainText("2 Errors Found");
    await expect(correspondentPortalPage.Errors_Foundred_text_danger).toHaveAttribute('aria-label', "text-danger");
    await expect(priceOfferedPage.Duplicate_Loanerrors_found_popup).toContainText(vars["CommittedLoanNumber(price offered table)"]);
    vars["CommittedLoanNumber(errors found popup)"] = await priceOfferedPage.Duplicate_Loanerrors_found_popup.textContent() || '';
    expect(String(vars["CommittedLoanNumber(price offered table)"])).toBe(vars["CommittedLoanNumber(errors found popup)"]);
    await expect(priceOfferedPage.Unidentified_Loanerrors_found_popup).toContainText(vars["UnidentifiedLoanNumber(price offered table)"]);
    vars["UnidentifiedLoanNumber(errors found popup)"] = await priceOfferedPage.Unidentified_Loanerrors_found_popup.textContent() || '';
    expect(String(vars["UnidentifiedLoanNumber(price offered table)"])).toBe(vars["UnidentifiedLoanNumber(errors found popup)"]);
    vars[""] = await priceOfferedPage.Unidentified_Loantext_box_popup.evaluate((el) => window.getComputedStyle(el as HTMLElement).color);
    if (String(vars["ColorValueUnidentifiedLoan"]) === String("rgba(255, 0, 0, 1)")) {
      vars["ColorValueUnidentifiedLoan"] = "red";
    } else {
      vars["ColorValueUnidentifiedLoan"] = "othercolor";
    }
    expect(String(vars["ColorValueUnidentifiedLoan"])).toBe(String("red"));
    await expect(priceOfferedPage.Unidentified_Loantext_box_popup).toHaveAttribute('title', "error-loan");
    vars[""] = await priceOfferedPage.Duplicate_Loantext_box_popup.evaluate((el) => window.getComputedStyle(el as HTMLElement).color);
    if (String(vars["ColorValueDuplicateLoan"]) === String("rgba(255, 0, 0, 1)")) {
      vars["ColorValueDuplicateLoan"] = "red";
    } else {
      vars["ColorValueDuplicateLoan"] = "othercolor";
    }
    expect(String(vars["ColorValueDuplicateLoan"])).toBe(String("red"));
    await expect(priceOfferedPage.Duplicate_Loantext_box_popup).toHaveAttribute('title', "error-loan");
    vars[""] = await priceOfferedPage.color_text.evaluate((el) => window.getComputedStyle(el as HTMLElement).color);
    if (String(vars["ColorValueFreshLoan"]) === String("rgba(33, 37, 41, 1)")) {
      vars["ColorValueFreshLoan"] = "black";
    } else {
      vars["ColorValueFreshLoan"] = "othercolor";
    }
    expect(String(vars["ColorValueFreshLoan"])).toBe(String("black"));
    await expect(priceOfferedPage.Remove_errors_and_continue_Checkbox).toBeVisible();
    await priceOfferedPage.Remove_errors_and_continue_Checkbox.check();
    await expect(priceOfferedPage.Remove_errors_and_continue_Checkbox).toBeVisible();
    await expect(chaseFieldNamePage.Add_to_Commit_Buttonpaste_loan_popup).toContainText("Add to Commit");
    await expect(chaseFieldNamePage.Add_to_Commit_Buttonpaste_loan_popup).toBeVisible();
    await chaseFieldNamePage.Add_to_Commit_Buttonpaste_loan_popup.click();
    await expect(priceOfferedPage.Fresh_Loan_Num_Price_Offered_after_Error_check).toContainText(vars["FreshLoanNumber(price offered table)"]);
    await expect(priceOfferedPage.Selected_loan_Checkboxprice_offered_screen).toBeVisible();
    await expect(priceOfferedPage.Selected_loan_Checkboxprice_offered_screen).toBeVisible();
    await expect(priceOfferedPage.Commit_Selected_Count_Footer_Displayprice_offered).toContainText("1");
    await correspondentPortalPage.Paste_Loans_Button1.click();
    await correspondentPortalPage.Paste_loan_numbers_here1.fill(vars["FreshLoanNumber(price offered table)"]);
    await priceOfferedPage.Validate_Button_Paste_loan_popup.click();
    await page.waitForLoadState('networkidle');
    await expect(priceOfferedPage.Remove_errors_and_continue_Checkbox).toBeVisible();
    await expect(chaseFieldNamePage.Add_to_Commit_Buttonpaste_loan_popup).toBeVisible();
  });
});
