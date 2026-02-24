// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1591 } from '../../../src/helpers/prereqs/prereq-1591';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1591(page, vars);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS22_TC03.3_Perform Expired action and verify that the status is updated to Expired and other execution type is not updated', async ({ page }) => {

    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqIdPriceOffered"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Expire_Pricing_Button.click();
    await priceOfferedPage.Yes_Expire_Button.waitFor({ state: 'visible' });
    await priceOfferedPage.Yes_Expire_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["BidStatusChasePriceOffered"] = await priceOfferedPage.Bid_Status_Chase_DirectPrice_Offered_Page.textContent() || '';
    vars["BidStatusChasePriceOffered"] = String(vars["BidStatusChasePriceOffered"]).trim();
    expect(String(vars["BidStatusChasePriceOffered"])).toBe("Committed");
    vars["BidStatusStandardPriceOffered"] = await priceOfferedPage.Bid_Status_StandardPrice_Offered_Page.textContent() || '';
    vars["BidStatusStandardPriceOffered"] = String(vars["BidStatusStandardPriceOffered"]).trim();
    expect(String(vars["BidStatusStandardPriceOffered"])).toBe("Expired");
    await correspondentPortalPage.Bid_Requests.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqIdPriceOffered"]);
    await page.keyboard.press('Enter');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestPage.Bid_Status_BidRequestsPage.waitFor({ state: 'visible' });
    vars["StatusBidReqPage"] = await bidRequestPage.Bid_Status_BidRequestsPage.textContent() || '';
    vars["StatusBidReqPage"] = String(vars["StatusBidReqPage"]).trim();
    expect(String(vars["StatusBidReqPage"])).toBe("Committed");
    await bidRequestPage.Required_Bid_Req_IDBid_Req_Page.click();
    await bidRequestPage.Bid_StatusBid_Req_Details.waitFor({ state: 'visible' });
    vars["StatusBidReqDetails"] = await bidRequestPage.Bid_StatusBid_Req_Details.textContent() || '';
    expect(String(vars["StatusBidReqDetails"])).toBe("Committed");
  });
});
