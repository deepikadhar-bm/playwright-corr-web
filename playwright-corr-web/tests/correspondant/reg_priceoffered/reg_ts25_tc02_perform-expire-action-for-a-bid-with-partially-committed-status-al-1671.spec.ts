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
import { runPrereq_1669 } from '../../../src/helpers/prereqs/prereq-1669';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1669(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS25_TC02_Perform expire action for a bid with partially committed status. Also verify that user should be able to update back to partially committed', async ({ page }) => {

    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequiredBidID"]);
    await priceOfferedPage.Bid_Req_IdPrice_Offered_Page.waitFor({ state: 'visible' });
    await stepGroups.stepGroup_Commits_an_Fresh_Loan_Num(page, vars);
    await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequiredBidID"]);
    await priceOfferedPage.Bid_Req_IdPrice_Offered_Page.waitFor({ state: 'visible' });
    vars["BidStatusPriceOffered"] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1.textContent() || '';
    vars["BidStatusPriceOffered"] = String(vars["BidStatusPriceOffered"]).trim();
    expect(String(vars["BidStatusPriceOffered"])).toBe("Partially Committed");
    await priceOfferedPage.Bid_Req_IdPrice_Offered_Page.click();
    vars["CompanyNameDetails"] = await priceOfferedPage.Company_NameDetails.textContent() || '';
    vars["count"] = "1";
    vars["TotalLoanAmount"] = "0";
    vars["CountOfUnlockedLoans"] = String(await priceOfferedPage.Count_Of_Unlocked_Loans.count());
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountOfUnlockedLoans"]))) {
      vars["UncommittedLoanAmount"] = await priceOfferedPage.Individual_Loans_AmountPrice_Offered_Details.textContent() || '';
      vars["TotalLoanAmount"] = (parseFloat(String(vars["TotalLoanAmount"])) + parseFloat(String(vars["UncommittedLoanAmount"]))).toFixed(0);
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    vars["TotalLoanAmount"] = String(vars["TotalLoanAmount"]).trim();
    await priceOfferedPage.BackTo_PriceofferedPage.click();
    await priceOfferedPage.Expire_Pricing_ButtonPrice_Offered.click();
    await priceOfferedPage.Bid_Req_IdExpire_Popup.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Bid_Req_IdExpire_Popup).toContainText(vars["RequiredBidID"]);
    await expect(priceOfferedPage.Company_NameActions_Popup).toContainText(vars["CompanyNameDetails"]);
    vars["BidValuePopUp"] = await priceOfferedPage.Bid_ValueActions_Popup.textContent() || '';
    vars["BidValuePopUp"] = String(vars["BidValuePopUp"]).replace(/\$\,/g, '');
    expect(String(vars["TotalLoanAmount"])).toBe(vars["BidValuePopUp"]);
    await expect(priceOfferedPage.Total_LoansActions_Popup).toContainText(vars["CountOfUnlockedLoans"]);
    await priceOfferedPage.Yes_Expire_Button.click();
    await page.reload();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqIdPriceOffered"]);
    await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1.waitFor({ state: 'visible' });
    vars["BidStatusPriceOffered"] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1.textContent() || '';
    vars["BidStatusPriceOffered"] = String(vars["BidStatusPriceOffered"]).trim();
    expect(String(vars["BidStatusPriceOffered"])).toBe("Expired");
    await priceOfferedPage.Bid_Req_IdPrice_Offered_Page.click();
    await correspondentPortalPage.Get_Price_Button.waitFor({ state: 'visible' });
    await expect(correspondentPortalPage.Get_Price_Button).toBeVisible();
    vars["TotalCountofLoans"] = String(await priceOfferedPage.Total_LoansDetails_Screen.count());
    vars["count"] = "1";
    vars["TotalLoanAmount"] = "0";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalCountofLoans"]))) {
      vars["IndividualLoanAmount"] = await bidRequestDetailsPage.Individual_Loan_Amount.textContent() || '';
      vars["TotalLoanAmount"] = (parseFloat(String(vars["TotalLoanAmount"])) + parseFloat(String(vars["IndividualLoanAmount"]))).toFixed(0);
      vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
    }
    await priceOfferedPage.BackTo_PriceofferedPage.click();
    await priceOfferedPage.Change_StatusPrice_Offered.waitFor({ state: 'visible' });
    await priceOfferedPage.Change_StatusPrice_Offered.click();
    await priceOfferedPage.Change_Status_ButtonPopup.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.BidReqIdChange_Status_Popoup).toContainText(vars["RequiredBidID"]);
    // [DISABLED] Verify that the element Company Name(Actions Popup) displays text CompanyNameDetails and With Scrollable FALSE
    // await expect(priceOfferedPage.Company_NameActions_Popup).toContainText(vars["CompanyNameDetails"]);
    await expect(priceOfferedPage.Company_NameActions_Popup).toContainText(vars["CompanyNameDetails"]);
    vars["BidValuePopup"] = await priceOfferedPage.Bid_ValueActions_Popup.textContent() || '';
    vars["BidValuePopup"] = String(vars["BidValuePopup"]).replace(/\$\,/g, '');
    expect(String(vars["TotalLoanAmount"])).toBe(vars["BidValuePopup"]);
    await expect(priceOfferedPage.Total_LoansActions_Popup).toContainText(vars["TotalCountofLoans"]);
    await priceOfferedPage.Change_Status_ButtonPopup.click();
    await page.reload();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqIdPriceOffered"]);
    await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1.waitFor({ state: 'visible' });
    vars["BidStatusPriceOffered"] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1.textContent() || '';
    vars["BidStatusPriceOffered"] = String(vars["BidStatusPriceOffered"]).trim();
    expect(String(vars["BidStatusPriceOffered"])).toBe("Partially Committed");
  });
});
