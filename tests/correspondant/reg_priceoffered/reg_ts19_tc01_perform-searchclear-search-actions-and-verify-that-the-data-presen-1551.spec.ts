// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS19_TC01_Perform search/Clear search actions and verify that the data present in the list screen', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
    vars["ThreeDigitBidId"] = "874";
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["ThreeDigitBidId"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["count"] = "1";
    vars["Count"] = "1";
    vars["PageCount"] = await correspondentPortalPage.Pagination_Count.textContent() || '';
    vars["PageCount"] = String(vars["PageCount"]).substring(10);
    while (parseFloat(String(vars["count"])) <= parseFloat(String("2"))) {
      vars["BidReqIdPriceOffered"] = String(await correspondentPortalPage.First_Bid_Req_Id.count());
      while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["BidReqIdPriceOffered"]))) {
        vars["IndividualBidReqIds"] = await priceOfferedPage.Individual_Bid_Request_Ids.textContent() || '';
        expect(String(vars["IndividualBidReqId's"])).toBe(vars["ThreeDigitBidId"]);
        vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
      }
      if (true) /* Element Go to Next Page Button is enabled */ {
        await correspondentPortalPage.Go_to_Next_Page_Button.click();
        vars["Count"] = (parseFloat(String(vars["Count"])) - parseFloat(String("19"))).toFixed(0);
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["FirstBidReqId"] = await correspondentPortalPage.First_Bid_Request_ID.textContent() || '';
    vars["FirstBidReqId"] = String(vars["FirstBidReqId"]).trim();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["FirstBidReqId"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["CountBidReqIdPriceOffered"] = String(await correspondentPortalPage.First_Bid_Req_Id.count());
    vars["Count1"] = "1";
    while (parseFloat(String(vars["Count1"])) <= parseFloat(String(vars["CountBidReqIdPriceOffered"]))) {
      vars["IndividualBidIds"] = await priceOfferedPage.Bid_Ids.textContent() || '';
      expect(String(vars["IndividualBidIds"])).toBe(vars["FirstBidReqId"]);
      vars["Count1"] = (parseFloat(String("1")) + parseFloat(String(vars["Count1"]))).toFixed(0);
    }
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["CountBidReqIdPriceOffered"] = String(await correspondentPortalPage.First_Bid_Req_Id.count());
    expect(String(vars["CountBidReqIdPriceOffered"])).toBe("2");
  });
});
