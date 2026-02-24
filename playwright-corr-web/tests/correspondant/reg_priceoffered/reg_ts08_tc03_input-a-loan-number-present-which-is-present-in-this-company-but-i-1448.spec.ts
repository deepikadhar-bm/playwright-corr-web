// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS08_TC03_Input a loan number present which is present in this company, but is not in this bid/price offered record', async ({ page }) => {
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
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    // [DISABLED] Store RequestIDCreated1stScenario in Bidreq_ID
    // vars["Bidreq_ID"] = testData["RequestIDCreated1stScenario"];
    await priceOfferedPage.Bid_Request_IDCompany_Name_Partial_or_Price_Offered.click();
    await priceOfferedPage.Bid_Request_IDprice_offered.waitFor({ state: 'visible' });
    vars["Bidreq_ID"] = await priceOfferedPage.Bid_Request_IDprice_offered.textContent() || '';
    vars["Companyname"] = await priceOfferedPage.Company_NamePriceoffered.textContent() || '';
    vars["Companyname"] = String(vars["Companyname"]).trim();
    vars["BidLoanNumberCompany"] = await priceOfferedPage.Corr_Loan_Number_ID.textContent() || '';
    await page.reload();
    await priceOfferedPage.Bid_Req_Id_other_than_the_given_id_Company_Name_Price_offered_or_Partial.waitFor({ state: 'visible' });
    await priceOfferedPage.Bid_Req_Id_other_than_the_given_id_Company_Name_Price_offered_or_Partial.click();
    await priceOfferedPage.Company_NamePriceoffered.waitFor({ state: 'visible' });
    await expect(page.getByText(vars["BidLoanNumberCompany"])).not.toBeVisible();
    await expect(priceOfferedPage.Company_NamePriceoffered).toContainText(vars["Companyname"]);
    await correspondentPortalPage.Paste_Loans_Button1.click();
    await correspondentPortalPage.Paste_loan_numbers_here1.click();
    await correspondentPortalPage.Paste_loan_numbers_here1.fill(vars["BidLoanNumberCompany"]);
    vars["BidLoanNumberPopup"] = await correspondentPortalPage.Paste_loan_numbers_here1.inputValue() || '';
    expect(String(vars["BidLoanNumberCompany"])).toBe(vars["BidLoanNumberPopup"]);
    await priceOfferedPage.Validate_ButtonPrice_Offered_Page.click();
    await priceOfferedPage.Loan_Number_Text.waitFor({ state: 'visible' });
    await priceOfferedPage.Error_message.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Loan_Number_Text).toHaveCSS('border', "rgba(255, 0, 0, 1)");
    await expect(priceOfferedPage.Error_message).toHaveAttribute('aria-label', "text-danger");
    await expect(priceOfferedPage.Unidentified_Loan_Name).toContainText(vars["BidLoanNumberCompany"]);
    await correspondentPortalPage.Remove_errors_and_continue_CheckboxPopup.check();
    await expect(correspondentPortalPage.Add_to_Commit).toBeVisible();
    await priceOfferedPage.CloseButtonPopup.click();
  });
});
