import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';

export async function runPrereq_1669(page: Page, vars: Record<string, string>): Promise<void> {
  const bidRequestsPage = new BidRequestsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);


  const testData: Record<string, string> = {
  "RequestIDfrom24-1": "87E42DCFAFE8",
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
  "Static Last Name(Pop Up Verfication)": "LN_Deepika_JULY_16_13",
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
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
  vars["BidReqIdPriceOffered"] = testData["RequestIDfrom24-1"];
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(String(vars["BidReqIdPriceOffered"]));
  // [DISABLED] Enter BidReqIdPriceOffered in the Search by Bid Request ID Field field
  // await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqIdPriceOffered"]);
  await priceOfferedPage.Bid_Req_IdPrice_Offered_Page.waitFor({ state: 'visible' });
  vars["BidStatusPriceOffered"] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1.textContent() || '';
  vars["BidStatusPriceOffered"] = String(vars["BidStatusPriceOffered"]).trim();
  expect(String(vars["BidStatusPriceOffered"])).toBe("Price Offered");
  vars["BidValuePriceOffered"] = await priceOfferedPage.Bid_ValuePrice_Offered_Page.textContent() || '';
  vars["TotalLoansPriceOffered"] = await priceOfferedPage.Total_LoansPrice_Offered_Page.textContent() || '';
  await priceOfferedPage.Expire_Pricing_ButtonPrice_Offered.click();
  await expect(priceOfferedPage.Bid_Req_IdExpire_Popup).toContainText(vars["BidReqIdPriceOffered"]);
  await expect(priceOfferedPage.Bid_ValueActions_Popup).toContainText(vars["BidValuePriceOffered"]);
  await expect(priceOfferedPage.Total_LoansActions_Popup).toContainText(vars["TotalLoansPriceOffered"]);
  await priceOfferedPage.Yes_Expire_Button.click();
  await page.reload();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(String(vars["BidReqIdPriceOffered"]));
  // [DISABLED] Enter BidReqIdPriceOffered in the Search by Bid Request ID Field field
  // await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqIdPriceOffered"]);
  vars["RequiredBidID"] = vars["BidReqIdPriceOffered"];
  await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1.waitFor({ state: 'visible' });
  vars["BidStatusPriceOffered"] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1.textContent() || '';
  vars["BidStatusPriceOffered"] = String(vars["BidStatusPriceOffered"]).trim();
  expect(String(vars["BidStatusPriceOffered"])).toBe("Expired");
  await priceOfferedPage.Bid_Req_IdPrice_Offered_Page.click();
  await correspondentPortalPage.Get_Price_Button.waitFor({ state: 'visible' });
  await expect(correspondentPortalPage.Get_Price_Button).toBeVisible();
  await priceOfferedPage.BackTo_PriceofferedPage.click();
  await priceOfferedPage.Change_StatusPrice_Offered.click();
  await priceOfferedPage.Change_Status_ButtonPopup.click();
  // [DISABLED] Click on the Refresh button in the browser
  // await page.reload();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(String(vars["BidReqIdPriceOffered"]));
  // [DISABLED] Enter BidReqIdPriceOffered in the Search by Bid Request ID Field field
  // await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqIdPriceOffered"]);
  await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1.waitFor({ state: 'visible' });
  await page.waitForTimeout(10000);
  vars["BidStatusPriceOffered"] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1.textContent() || '';
  vars["BidStatusPriceOffered"] = String(vars["BidStatusPriceOffered"]).trim();
  expect(String(vars["BidStatusPriceOffered"])).toBe("Price Offered");
}
