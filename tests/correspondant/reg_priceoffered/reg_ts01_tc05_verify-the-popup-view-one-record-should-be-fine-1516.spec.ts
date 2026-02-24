// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1425 } from '../../../src/helpers/prereqs/prereq-1425';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1425(page, vars);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS01_TC05_Verify the popup view [[ one record should be fine]', async ({ page }) => {

    const testData: Record<string, string> = {
  "Static Last Name(Pop Up Verfication)": "LN_Deepika_JULY_16_13",
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
  "RequestIDCreated1stScenario": "87P80EB790BD",
  "RequestIDfrom10-3": "874WDCCDC3CE",
  "RequestIDfrom22-3.1": "877V3BF90360",
  "Expected Product(price offered)": "FN30",
  "RequestIDfrom22-1.1": "877V3BF90360",
  "RequestIDCreated2ndScenario": "87462B751677",
  "Expected Coupon(price offered)": "3.5",
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

    await correspondentPortalPage.Bid_Requests.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
    await bidRequestPage.BidReqIDBid_Req_Page.waitFor({ state: 'visible' });
    await bidRequestPage.BidReqIDBid_Req_Page.click();
    vars["Last Name"] = testData["Static Last Name(Pop Up Verfication)"];
    await bidRequestPage.Success_Corr_Loan_Num.click();
    vars["BidReqIdBidReqPage"] = await priceOfferedPage.BidReqIdLoan_Details_Popup.textContent() || '';
    vars["BidLoanNumBidReqPage"] = await priceOfferedPage.Bid_Loan_NumLoan_Details_Popup.textContent() || '';
    vars["ErrorsCheckBidReqPage"] = await priceOfferedPage.Errors_CheckLoan_Details_Popup.textContent() || '';
    await correspondentPortalPage.Close_Buttonemail_config.click();
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
    await priceOfferedPage.BidReqIdPrice_Offered.waitFor({ state: 'visible' });
    await priceOfferedPage.BidReqIdPrice_Offered.click();
    await priceOfferedPage.Required_Loan_Number.waitFor({ state: 'visible' });
    await priceOfferedPage.Loan_Num_Required_Last_Name.click();
    await expect(priceOfferedPage.BidReqIdLoan_Details_Popup).toContainText(vars["BidReqIdBidReqPage"]);
    await expect(priceOfferedPage.Bid_Loan_NumLoan_Details_Popup).toContainText(vars["BidLoanNumBidReqPage"]);
    await expect(priceOfferedPage.Errors_CheckLoan_Details_Popup).toContainText(vars["ErrorsCheckBidReqPage"]);
    await stepGroups.stepGroup_Verification_of_Loan_Popup_Details_From_BidReq_Lon_Popup(page, vars);
  });
});
