import { test, expect, Page } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS19_TC01';
const TC_TITLE = 'Perform search/Clear search actions and verify that the data present in the list screen';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars["Username"] = credentials.username;
    vars["Password"] = credentials.password;
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Login to CORR Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Logged in to CORR Portal successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to login to CORR Portal');
        throw e;
      }

      log.step('Navigate to Price Offered');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 20000 });
        log.stepPass('Navigated to Price Offered successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to navigate to Price Offered');
        throw e;
      }

      log.step('Search by partial Bid Request ID and verify results on each page contain the search term');
      try {
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
        vars["ThreeDigitBidId"] = appconstants.ThreeDigitBidID;
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.type(vars["ThreeDigitBidId"]);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 20000 });
        log.info('ThreeDigitBidId: ' + vars['ThreeDigitBidId']);

        vars["count"] = appconstants.ONE;
        vars["PageCount"] = await correspondentPortalPage.Pagination_Count.textContent() || '';
        Methods.removeCharactersFromPosition(vars["PageCount"], "10", '0', "PageCount");
        log.info('PageCount: ' + vars['PageCount']);
        while (parseFloat(vars["count"]) <= parseFloat("2")) {
          log.info('Page: ' + vars['count']);
          await Methods.verifyMultipleElementsHavePartialText(correspondentPortalPage.First_Bid_Req_Id, vars["ThreeDigitBidId"]);
          if (await correspondentPortalPage.Go_to_Next_Page_Button.isEnabled()) {
            await correspondentPortalPage.Go_to_Next_Page_Button.click();
          }
          Methods.MathematicalOperation(vars["count"], '+', 1, 'count');
        }
        log.stepPass('Partial Bid Request ID search results verified successfully across pages');
      } catch (e) {
        log.stepFail(page, 'Partial Bid Request ID search results verification failed');
        throw e;
      }

      log.step('Clear search field and capture first Bid Request ID from reset results');
      try {
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
        await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 20000 });
        vars["FirstBidReqId"] = await correspondentPortalPage.First_Bid_Request_ID.first().textContent() || '';
        Methods.trimtestdata(vars["FirstBidReqId"], 'FirstBidReqId');
        log.info('First Bid Request ID: ' + vars['FirstBidReqId']);
        log.stepPass('Search field cleared and first Bid Request ID captured successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to clear search field or capture first Bid Request ID');
        throw e;
      }

      log.step('Search by exact Bid Request ID and store count of matching records');
      try {
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.type(vars["FirstBidReqId"]);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 20000 });
        vars["CountBidReqIdAfterSearch"] = String(await priceOfferedPage.Bid_Req_Id_Price_Offered.count());
        log.info('Count of BidReqId after search: ' + vars['CountBidReqIdAfterSearch']);
        await Methods.verifyMultipleElementsHaveSameText(priceOfferedPage.Bid_Req_Id_Price_Offered, vars["FirstBidReqId"]);
        log.stepPass('Successfully searched for exact Bid Request ID and stored count of matching records');
      } catch (e) {
        log.stepFail(page, 'Failed to search for exact Bid Request ID or store count of matching records');
        throw e;
      }

      log.step('Clear search field again and verify results are reset to show multiple records');
      try {
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
        await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 20000 });
        vars["CountBidReqIdAfterClear"] = String(await priceOfferedPage.Bid_Req_Id_Price_Offered.count());
        log.info('Count of BidReqId PriceOffered after clear: ' + vars['CountBidReqIdAfterClear']);
        expect(Methods.verifyComparison(vars["CountBidReqIdAfterClear"], '>=', vars['CountBidReqIdAfterSearch']));
        log.stepPass('Search cleared and results reset successfully to show multiple records');
      } catch (e) {
        log.stepFail(page, 'Failed to clear search field or verify that results were reset to show multiple records');
        throw e;
      }

      log.tcEnd('PASS');
    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});