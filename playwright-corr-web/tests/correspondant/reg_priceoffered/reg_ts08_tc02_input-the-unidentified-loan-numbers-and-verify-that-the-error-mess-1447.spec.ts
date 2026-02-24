// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS08_TC02_Input the Unidentified loan numbers and verify that the error message should be displayed and user should not be able to proceed further', async ({ page }) => {
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
    vars["BidReqID"] = testData["RequestIDCreated1stScenario"];
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(testData["RequestIDCreated1stScenario"]);
    await page.keyboard.press('Enter');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.First_bid_id.click();
    vars["BidLoanNumber(Loan Details)"] = await priceOfferedPage.Corr_Loan_Number_ID.textContent() || '';
    vars["BidLoanNumber"] = String(vars["BidLoanNumber(Loan Details)"]).substring(0, String(vars["BidLoanNumber(Loan Details)"]).length - 9);
    await priceOfferedPage.Paste_Loans_ButtonPrice_Offered_Page.click();
    await correspondentPortalPage.Paste_loan_numbers_here1.fill(vars["BidLoanNumber"]);
    await priceOfferedPage.Validate_ButtonPrice_Offered_Page.click();
    await expect(priceOfferedPage.Errors_Found_Loan_error).toBeVisible();
    await expect(priceOfferedPage.Unidentified_Loan_Text).toBeVisible();
    await expect(priceOfferedPage.Loan_Number_Text).toHaveCSS('border', "rgba(255, 0, 0, 1)");
    await expect(priceOfferedPage.Error_Found_Text).toHaveAttribute('aria-label', "text-danger");
    vars["UnidentifiedLoanNumber"] = await priceOfferedPage.Unidentified_Loan_Number.textContent() || '';
    expect(String(vars["BidLoanNumber"])).toBe(vars["UnidentifiedLoanNumber"]);
    await priceOfferedPage.Remove_errors_and_continue_Checkbox.check();
    await expect(chaseFieldNamePage.Add_to_Commit_Buttonpaste_loan_popup).toBeVisible();
    await correspondentPortalPage.close_pop_up_bid_request_details.click();
  });
});
