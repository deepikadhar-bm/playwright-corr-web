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
import { runPrereq_1389 } from '../../../src/helpers/prereqs/prereq-1389';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1389(page, vars);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS22_TC02.2_Perform commit action and verify that during the commitment progress, the status is updated to commitment in progress. -> Verify in both list and detail screen(Two Execution Types)', async ({ page }) => {

    // [DISABLED] Login to CORR Portal
    // await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    vars["BidReqIdPriceOffered"] = vars["RequestIDDetails"];
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqIdPriceOffered"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidReqId_Chase_Direct.click();
    await priceOfferedPage.Execution_TypeDetails.waitFor({ state: 'visible' });
    vars["ExecutionTypePriceOfferedDetails"] = await priceOfferedPage.Execution_TypeDetails.textContent() || '';
    await priceOfferedPage.Select_all_for_Checkbox.check();
    await priceOfferedPage.Get_Price_Button.click();
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await priceOfferedPage.Yes_Commit_ButtonPopup.click();
    // [DISABLED] Wait until the element Okay Button(Popup) is visible
    // await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
    vars["CurrentPageUrl"] = page.url();
    const newPage = await page.context().newPage();
    await page.goto(vars["CurrentPageUrl"]);
    await correspondentPortalPage.Bid_Requests.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqIdPriceOffered"]);
    await page.keyboard.press('Enter');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    // [DISABLED] Wait until the text Commitment in progress is present on the current page
    // await page.getByText("Commitment in progress").waitFor({ state: 'visible' });
    await bidRequestPage.Bid_Status_BidRequestsPage.waitFor({ state: 'visible' });
    vars["StatusBidReqPage"] = await bidRequestPage.Bid_Status_BidRequestsPage.textContent() || '';
    vars["StatusBidReqPage"] = String(vars["StatusBidReqPage"]).trim();
    if (String(vars["StatusBidReqPage"]).includes(String("Price Offered"))) {
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(String(vars["BidReqIdPriceOffered"]));
      await page.keyboard.press('Enter');
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    }
    vars["StatusBidReqPage"] = await bidRequestPage.Bid_Status_BidRequestsPage.textContent() || '';
    vars["StatusBidReqPage"] = String(vars["StatusBidReqPage"]).trim();
    expect(String(vars["StatusBidReqPage"])).toBe("Commitment in progress");
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqIdPriceOffered"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["BidStatusChasePriceOffered"] = await priceOfferedPage.Bid_Status_Chase_DirectPrice_Offered_Page.textContent() || '';
    vars["BidStatusChasePriceOffered"] = String(vars["BidStatusChasePriceOffered"]).trim();
    if (true) /* Verify if BidStatusChasePriceOffered contains PriceOffered */ {
      // [DISABLED] Clear the existing text from Search By Bid Request ID Input and enter BidReqIdPriceOffered
      // await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(String(vars["BidReqIdPriceOffered"]));
    }
    expect(String(vars["BidStatusChasePriceOffered"])).toBe("Commitment in progress");
    vars["BidStatusStandardPriceOffered"] = await priceOfferedPage.Bid_Status_StandardPrice_Offered_Page.textContent() || '';
    vars["BidStatusStandardPriceOffered"] = String(vars["BidStatusStandardPriceOffered"]).trim();
    expect(String(vars["BidStatusStandardPriceOffered"])).toBe("Price Offered");
  });
});
