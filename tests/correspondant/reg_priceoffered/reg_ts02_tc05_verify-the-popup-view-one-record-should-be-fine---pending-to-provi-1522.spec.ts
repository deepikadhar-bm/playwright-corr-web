// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1420 } from '../../../src/helpers/prereqs/prereq-1420';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1420(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS02_TC05_Verify the popup view [[ one record should be fine] -> Pending to provide steps', async ({ page }) => {

    const testData: Record<string, string> = {
  "Static Last Name(Pop Up Verfication)": "LN_Deepika_JULY_16_13",
  "ChaseFieldName": "",
  "ChaseValue": "",
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
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestPage.BidReqIDBid_Req_Page.click();
    vars["ExecutionTypesBidReq"] = String(await bidRequestPage.ExecutionType_BidReq.count());
    vars["Last Name"] = testData["Static Last Name(Pop Up Verfication)"];
    await bidRequestPage.Loan_Num_Chase_Direct.click();
    vars["BidReqIdBidReqPageChase"] = await priceOfferedPage.BidReqIdLoan_Details_Popup.textContent() || '';
    vars["BidLoanNumBidReqPageChase"] = await priceOfferedPage.Bid_Loan_NumLoan_Details_Popup.textContent() || '';
    vars["ErrorsCheckBidReqPageChase"] = await priceOfferedPage.Errors_CheckLoan_Details_Popup.textContent() || '';
    await correspondentPortalPage.Close_Buttonemail_config.click();
    await bidRequestPage.Loan_Num_Standard.waitFor({ state: 'visible' });
    await bidRequestPage.Loan_Num_Standard.click();
    vars["BidReqIdReqPageStandard"] = await priceOfferedPage.BidReqIdLoan_Details_Popup.textContent() || '';
    vars["BidLoanNumBidReqPageStandard"] = await priceOfferedPage.Bid_Loan_NumLoan_Details_Popup.textContent() || '';
    vars["ErrorsCheckBidReqPageStandard"] = await priceOfferedPage.Errors_CheckLoan_Details_Popup.textContent() || '';
    await correspondentPortalPage.Close_Buttonemail_config.click();
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
    await page.keyboard.press('Enter');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["ExecutionTypesPriceOffered"] = String(await priceOfferedPage.ExecutionType_From_PriceOffered.count());
    expect(String(vars["ExecutionTypesBidReq"])).toBe(vars["ExecutionTypesPriceOffered"]);
    await priceOfferedPage.BidReqId_Chase_Direct.click();
    await priceOfferedPage.Loan_Num_Required_Last_Name.waitFor({ state: 'visible' });
    await priceOfferedPage.Loan_Num_Required_Last_Name.click();
    await expect(priceOfferedPage.BidReqIdLoan_Details_Popup).toContainText(vars["BidReqIdBidReqPageChase"]);
    await expect(priceOfferedPage.Bid_Loan_NumLoan_Details_Popup).toContainText(vars["BidLoanNumBidReqPageChase"]);
    await expect(priceOfferedPage.Errors_CheckLoan_Details_Popup).toContainText(vars["ErrorsCheckBidReqPageChase"]);
    vars["ChaseFieldCountPopup"] = String(await bidRequestDetailsPage.ChaseFields_Count_Popup_Loan_Details.count());
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["ChaseFieldCountPopup"]))) {
      await priceOfferedPage.Bid_Loan_NumLoan_Details_Popup.click();
      vars["ChaseFieldNamePopupExeChase"] = await bidRequestDetailsPage.Individual_Chase_Field_Name_Popup.textContent() || '';
      vars["ChaseValuePopupExeChase"] = await priceOfferedPage.Chase_Field_Value_Exe_Chase.textContent() || '';
      for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseInt(vars["count"]); dataIdx++) {
        await expect(bidRequestDetailsPage.Individual_Chase_Field_Name_Popup).toContainText(testData["ChaseFieldName"]);
        if (String(vars["ChaseValuePopupExeChase"]) === String("key_blank")) {
          expect(String(testData["ChaseValue"])).toBe("Null");
        } else if (String(vars["ChaseFieldNamePopupExeChase"]) === String("Correspondent Loan Number")) {
          expect(String(vars["ChaseValuePopupExeChase"])).toBe(vars["BidLoanNumBidReqPageChase"]);
        } else {
          await expect(priceOfferedPage.Chase_Field_Value_Exe_Chase).toContainText(testData["ChaseValue"]);
        }
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    await correspondentPortalPage.Close_Buttonemail_config.click();
    await priceOfferedPage.BackTo_PriceofferedPage.click();
    await priceOfferedPage.BidReqId_Standard.waitFor({ state: 'visible' });
    await priceOfferedPage.BidReqId_Standard.click();
    await priceOfferedPage.Loan_Num_Required_Last_Name.waitFor({ state: 'visible' });
    await priceOfferedPage.Loan_Num_Required_Last_Name.click();
    await expect(priceOfferedPage.BidReqIdLoan_Details_Popup).toContainText(vars["BidReqIdReqPageStandard"]);
    await expect(priceOfferedPage.Bid_Loan_NumLoan_Details_Popup).toContainText(vars["BidLoanNumBidReqPageStandard"]);
    await expect(priceOfferedPage.Errors_CheckLoan_Details_Popup).toContainText(vars["ErrorsCheckBidReqPageStandard"]);
    vars["ChaseFieldCountPopup"] = String(await bidRequestDetailsPage.ChaseFields_Count_Popup_Loan_Details.count());
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["ChaseFieldCountPopup"]))) {
      await priceOfferedPage.Bid_Loan_NumLoan_Details_Popup.click();
      vars["ChaseFieldNamePopupExeStandard"] = await bidRequestDetailsPage.Individual_Chase_Field_Name_Popup.textContent() || '';
      vars["ChaseValuePopupExeStandard"] = await priceOfferedPage.Chase_Field_Value_Exe_Standard.textContent() || '';
      for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseInt(vars["count"]); dataIdx++) {
        await expect(bidRequestDetailsPage.Individual_Chase_Field_Name_Popup).toContainText(testData["ChaseFieldName"]);
        if (String(vars["ChaseValuePopupExeStandard"]) === String("key_blank")) {
          expect(String(testData["ChaseValue"])).toBe("Null");
        } else if (String(vars["ChaseFieldNamePopupExeStandard"]) === String("Correspondent Loan Number")) {
          expect(String(vars["ChaseValuePopupExeStandard"])).toBe(vars["BidLoanNumBidReqPageStandard"]);
        } else {
          await expect(priceOfferedPage.Chase_Field_Value_Exe_Standard).toContainText(testData["ChaseValue"]);
        }
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    await correspondentPortalPage.Close_Buttonemail_config.click();
  });
});
