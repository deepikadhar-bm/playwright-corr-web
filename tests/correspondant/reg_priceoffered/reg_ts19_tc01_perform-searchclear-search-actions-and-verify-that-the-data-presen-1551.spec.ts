import { test, expect, Page } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = "REG_TS19_TC01";
const TC_TITLE = "Perform search/Clear search actions and verify that the data present in the list screen";

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let helpers: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    helpers = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      log.step(`Step 1: Login to CORR Portal`);
      try {

        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass(`Step 1 passed: Logged in to CORR Portal successfully`);

      } catch (error) {
        log.stepFail(page, `Step 1 failed: Failed to login to CORR Portal`);
        throw error; // Rethrow to fail the test
      }

      log.step(`Step 2: Click to expand Commitments side menu`);
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();

      } catch (error) {
        log.stepFail(page, `Step 2 failed: Failed to click and expand Commitments side menu `);
        throw error;
      }

      log.step("Step 3: Select Price Offered from dropdown");
      try {
        await spinnerPage.Spinner.waitFor({ state: 'visible', timeout: 10000 });
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 10000 });
        log.stepPass(`Step 3 passed: Price Offered selected from dropdown successfully`);
      } catch (error) {
        log.stepFail(page, `Step 3 failed: Failed to select Price Offered from dropdown`);
        throw error;
      }

      log.step("Step 4: Perform search by Bid Request ID");
      try {
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
        vars["ThreeDigitBidId"] = "874";
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.type(vars["ThreeDigitBidId"], { delay: 250 });
        await spinnerPage.Spinner.waitFor({ state: 'visible', timeout: 10000 });
        await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 10000 });
        vars["count"] = "1";
        vars["Count"] = "1";
        vars["PageCount"] = await correspondentPortalPage.Pagination_Count.textContent() || '';
        helpers.extractSubstringAfterReference(vars["PageCount"], "of ", 2, "PageCount");
        log.stepPass(`Step 4 passed: Search by Bid Request ID performed successfully`);

      } catch (error) {
        log.stepFail(page, `Step 4 failed: Failed to click on Search by Bid Request ID field`);
        throw error;
      }

      log.step("Step 5: Verify the search results and pagination");
      try {
        while (parseFloat(String(vars["count"])) <= parseFloat(String("2"))) {
          vars["BidReqIdPriceOffered"] = String(await correspondentPortalPage.First_Bid_Req_Id.count());
          await helpers.verifyMultipleElementsHavePartialText(correspondentPortalPage.First_Bid_Req_Id, vars["ThreeDigitBidId"]);
          if (await correspondentPortalPage.Go_to_Next_Page_Button.isEnabled()) /* Element Go to Next Page Button is enabled */ {
            await correspondentPortalPage.Go_to_Next_Page_Button.click();
            vars["Count"] = (parseFloat(String(vars["Count"])) - (parseFloat(vars["BidReqIdPriceOffered"]) - 1)).toFixed(0);
          }
          vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
        }
        log.stepPass(`Step 5 passed: Search results and pagination verified successfully`);
      } catch (error) {
        log.stepFail(page, `Step 5 failed: Failed to verify the search results and pagination`);
        throw error;
      }

      log.step("Step 6: Clear the search field and verify results reset");
      try {
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
        log.stepPass(`Step 6 passed: Search field cleared successfully`);
      } catch (error) {
        log.stepFail(page, `Step 6 failed: Failed to clear the search field and verify results reset`);
        throw error;
      }

      log.step("Step 7: Wait for filter reset and persist first Bid Request ID for next test steps");
      try {
        await spinnerPage.Spinner.waitFor({ state: 'visible', timeout: 15000 });
        await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 10000 });
        vars["FirstBidReqId"] = await correspondentPortalPage.First_Bid_Request_ID.first().textContent() || '';
        helpers.trimtestdata(vars["FirstBidReqId"], "FirstBidReqId");
        log.stepPass(`Step 7 passed: Filter reset and first Bid Request ID persisted successfully`);
      } catch (error) {
        log.stepFail(page, `Step 7 failed: Failed to wait for filter reset and persist first Bid Request ID for next test steps`);
        throw error;
      }

      log.step("Step 8: Perform search by persisted Bid Request ID and verify results");
      try {
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.type(vars["FirstBidReqId"], { delay: 250 });
        await spinnerPage.Spinner.waitFor({ state: 'visible', timeout: 15000 });
        await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 10000 });
        vars["CountBidReqIdPriceOffered"] = String(await correspondentPortalPage.First_Bid_Req_Id.count());
        vars["Count1"] = "1";
        await helpers.verifyMultipleElementsHaveSameText(correspondentPortalPage.First_Bid_Req_Id, vars["FirstBidReqId"]);
        log.stepPass(`Step 8 passed: Search by persisted Bid Request ID performed and results verified successfully`);
      } catch (error) {
        log.stepFail(page, `Step 8 failed: Failed to click on Search by Bid Request ID field`);
        throw error;
      }

      log.step("Step 9: Clear the search field again and verify all results are displayed");
      try {
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
        await spinnerPage.Spinner.waitFor({ state: 'visible', timeout: 15000 });
        await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 10000 });
        vars["CountBidReqIdPriceOffered"] = String(await correspondentPortalPage.First_Bid_Req_Id.count());
        expect(parseFloat(vars["CountBidReqIdPriceOffered"])).toBeGreaterThanOrEqual(parseFloat("2"));
        log.stepPass(`Step 9 passed: Search field cleared again and count of results displayed verified successfully`);
      } catch (error) {
        log.stepFail(page, `Step 9 failed: Failed to clear the search field again and verify the count of results displayed`);
        throw error;
      }

    } catch (error) {
      log.captureOnFailure(page, TC_ID, error);
      log.tcEnd('FAIL')
      throw error; // Rethrow to ensure the test is marked as failed
    }
  });

});
