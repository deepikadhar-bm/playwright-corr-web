// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedDetailsPage } from '../../../src/pages/correspondant/price-offered-details';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1389 } from '../../../src/helpers/prereqs/prereq-1389';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedDetailsPage: PriceOfferedDetailsPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1389(page, vars);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedDetailsPage = new PriceOfferedDetailsPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS22_TC01.2_Perform commit action and verify that the status is updated to partially committed when few loans from the bid is committed(Two Execution Type)', async ({ page }) => {

    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["BidReqIdPriceOffered"] = vars["RequestIDDetails"];
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqIdPriceOffered"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Commits_an_Fresh_Loan_Num_Chase_Direct(page, vars);
    await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
    await page.waitForLoadState('networkidle');
    vars["CommittedLoanNumChaseDirect"] = await priceOfferedDetailsPage.Locked_Loan_Num_Price_Offered_details.textContent() || '';
    await priceOfferedPage.BackTo_PriceofferedPage.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["BidStatusChasePriceOffered"] = await priceOfferedPage.Bid_Status_Chase_DirectPrice_Offered_Page.textContent() || '';
    vars["BidStatusChasePriceOffered"] = String(vars["BidStatusChasePriceOffered"]).trim();
    expect(String(vars["BidStatusChasePriceOffered"])).toBe("Partially Committed");
    vars["BidStatusStandardPriceOffered"] = await priceOfferedPage.Bid_Status_StandardPrice_Offered_Page.textContent() || '';
    vars["BidStatusStandardPriceOffered"] = String(vars["BidStatusStandardPriceOffered"]).trim();
    expect(String(vars["BidStatusStandardPriceOffered"])).toBe("Price Offered");
    await correspondentPortalPage.Bid_Requests.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqIdPriceOffered"]);
    await page.keyboard.press('Enter');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestPage.Bid_Status_BidRequestsPage.waitFor({ state: 'visible' });
    vars["StatusBidReqPage"] = await bidRequestPage.Bid_Status_BidRequestsPage.textContent() || '';
    vars["StatusBidReqPage"] = String(vars["StatusBidReqPage"]).trim();
    expect(String(vars["StatusBidReqPage"])).toBe("Partially Committed");
    await bidRequestPage.Required_Bid_Req_IDBid_Req_Page.click();
    await bidRequestPage.Bid_StatusBid_Req_Details.waitFor({ state: 'visible' });
    vars["StatusBidReqDetails"] = await bidRequestPage.Bid_StatusBid_Req_Details.textContent() || '';
    expect(String(vars["StatusBidReqDetails"])).toBe("Partially Committed");
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqIdPriceOffered"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidReqId_Standard.click();
    await stepGroups.stepGroup_Commits_an_Fresh_Loan_Num_Standard(page, vars);
    await priceOfferedPage.BackTo_PriceofferedPage.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["BidStatusChasePriceOffered"] = await priceOfferedPage.Bid_Status_Chase_DirectPrice_Offered_Page.textContent() || '';
    vars["BidStatusChasePriceOffered"] = String(vars["BidStatusChasePriceOffered"]).trim();
    expect(String(vars["BidStatusChasePriceOffered"])).toBe("Partially Committed");
    vars["BidStatusStandardPriceOffered"] = await priceOfferedPage.Bid_Status_StandardPrice_Offered_Page.textContent() || '';
    vars["BidStatusStandardPriceOffered"] = String(vars["BidStatusStandardPriceOffered"]).trim();
    expect(String(vars["BidStatusStandardPriceOffered"])).toBe("Partially Committed");
    await correspondentPortalPage.Bid_Requests.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqIdPriceOffered"]);
    await page.keyboard.press('Enter');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestPage.Bid_Status_BidRequestsPage.waitFor({ state: 'visible' });
    vars["StatusBidReqPage"] = await bidRequestPage.Bid_Status_BidRequestsPage.textContent() || '';
    vars["StatusBidReqPage"] = String(vars["StatusBidReqPage"]).trim();
    expect(String(vars["StatusBidReqPage"])).toBe("Partially Committed");
    await bidRequestPage.Required_Bid_Req_IDBid_Req_Page.click();
    await bidRequestPage.Bid_StatusBid_Req_Details.waitFor({ state: 'visible' });
    vars["StatusBidReqDetails"] = await bidRequestPage.Bid_StatusBid_Req_Details.textContent() || '';
    expect(String(vars["StatusBidReqDetails"])).toBe("Partially Committed");
    // Write to test data profile: "RequestIDfrom22-1.2" = vars["BidReqIdPriceOffered"]
  });
});
