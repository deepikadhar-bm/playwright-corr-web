// [POM-APPLIED]
import { test, expect, Page } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger } from '../../../src/helpers/log-helper';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test('REG_TS19_TC01_Perform search/Clear search actions and verify that the data present in the list screen', async ({ page }) => {
    Logger.info("Test Case Started: REG_TS19_TC01_Perform search/Clear search actions and verify that the data present in the list screen");
    Logger.info("Log in started using stepgroup")
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    Logger.info("Login successful using stepgroup)")
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'visible', timeout: 10000 });
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    Logger.step("Clicked on Price Offered List Dropdown");
    await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 10000 });
    Logger.info("Searching for 3 digit present in BidID: 874");
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
    vars["ThreeDigitBidId"] = "874";
    // await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["ThreeDigitBidId"]); 
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.type(vars["ThreeDigitBidId"], { delay: 250 });
    Logger.step("Entered 3 digit of Bid Request ID in search field, waiting for spinner...");
    await spinnerPage.Spinner.waitFor({ state: 'visible', timeout: 10000 });
    await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 10000 });
    vars["count"] = "1";
    vars["Count"] = "1";
    vars["PageCount"] = await correspondentPortalPage.Pagination_Count.textContent() || '';
    Methods.extractSubstringAfterReference(vars["PageCount"],"of ",2,  "PageCount");// expected length
    // vars["PageCount"] = String(vars["PageCount"]).substring(10);//11--page
    // await page.pause();
    while (parseFloat(String(vars["count"])) <= parseFloat(String("2"))) {
      vars["BidReqIdPriceOffered"] = String(await correspondentPortalPage.First_Bid_Req_Id.count());//20 per page, 
      // const BidReqIdPriceOffered = await correspondentPortalPage.First_Bid_Req_Id.count();
      // while (parseFloat(vars["Count"]) <=parseFloat(vars["BidReqIdPriceOffered"])) {
      //   vars["IndividualBidReqIds"] = await priceOfferedPage.Bid_Ids(vars["Count"]).textContent() || '';
      //   expect(String(vars["IndividualBidReqIds"])).toContain(vars["ThreeDigitBidId"]);
      //   vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
      // }
      // await Methods.verifyMultipleElementsHavePartialText('xpath','//a[contains(@aria-label,"View details for price offered")]',vars["ThreeDigitBidId"]);
      await Methods.verifyMultipleElementsHavePartialText(correspondentPortalPage.First_Bid_Req_Id,vars["ThreeDigitBidId"]);
      if (await correspondentPortalPage.Go_to_Next_Page_Button.isEnabled()) /* Element Go to Next Page Button is enabled */ {
        await correspondentPortalPage.Go_to_Next_Page_Button.click();
        // vars["Count"] = (parseFloat(String(vars["Count"])) - parseFloat(String("19"))).toFixed(0);//vars["BidReqIdPriceOffered"]
        vars["Count"] = (parseFloat(String(vars["Count"])) - (parseFloat(vars["BidReqIdPriceOffered"])-1)).toFixed(0);
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();


    await spinnerPage.Spinner.waitFor({ state: 'visible', timeout: 15000 });
    await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 10000 });

    vars["FirstBidReqId"] = await correspondentPortalPage.First_Bid_Request_ID.first().textContent() || '';
    Logger.info("Search field cleared, searching for particular: "+vars["FirstBidReqId"]+"verifying if it is present");
    // vars["FirstBidReqId"] = String(vars["FirstBidReqId"]).trim();
    Methods.trimWhitespace(vars["FirstBidReqId"], "FirstBidReqId");
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
    // await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["FirstBidReqId"]);
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.type(vars["FirstBidReqId"], { delay: 250 });
Logger.step("entered bid request id in search field: "+vars["FirstBidReqId"]+"waiting for spinner...");
    await spinnerPage.Spinner.waitFor({ state: 'visible', timeout: 15000 });
    await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 10000 });
    vars["CountBidReqIdPriceOffered"] = String(await correspondentPortalPage.First_Bid_Req_Id.count()); // 2
    vars["Count1"] = "1";
 
    // while (parseFloat(String(vars["Count1"])) <= parseFloat(String(vars["CountBidReqIdPriceOffered"]))) {
    //   // vars["IndividualBidIds"] = await priceOfferedPage.Bid_Ids.nth(parseInt(vars["Count1"]) - 1).textContent() || '';
    //   vars["IndividualBidIds"] = await priceOfferedPage.Bid_Ids(vars["Count1"]).textContent() || '';
    //   vars["IndividualBidIds"] = String(vars["IndividualBidIds"]).trim();
    //   expect(vars["IndividualBidIds"]).toBe(vars["FirstBidReqId"].trim());
    //   vars["Count1"] = (parseFloat(String("1")) + parseFloat(String(vars["Count1"]))).toFixed(0); // 2 - 3
    // }
    await Methods.verifyMultipleElementsHaveSameText(correspondentPortalPage.First_Bid_Req_Id,vars["FirstBidReqId"]);
    // vars["Count1"] = (parseFloat(String("1")) + parseFloat(String(vars["Count1"]))).toFixed(0); // 2 - 3

    await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
    await spinnerPage.Spinner.waitFor({ state: 'visible', timeout: 15000 });
    await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 10000 });
    vars["CountBidReqIdPriceOffered"] = String(await correspondentPortalPage.First_Bid_Req_Id.count());
    expect(parseFloat(vars["CountBidReqIdPriceOffered"])).toBeGreaterThanOrEqual(parseFloat("2"));
    Logger.info("Verified that after clearing search, data is present in the list screen and count is: "+vars["CountBidReqIdPriceOffered"]+" which is greater than or equal to 2");
    Logger.success("Test Case Passed: REG_TS19_TC01_Perform search/Clear search actions and verify that the data present in the list screen");
    
  });
});
