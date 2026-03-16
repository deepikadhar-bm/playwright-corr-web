import { test, expect } from '@playwright/test';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1591 } from '../../../src/helpers/prereqs/prereq-1591';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID    = 'REG_TS22_TC03.3';
const TC_TITLE = 'Perform Expired action and verify that the status is updated to Expired and other execution type is not updated';

test.describe('REG_PriceOffered', () => {

  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1591(page, vars);
    bidRequestPage          = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage        = new PriceOfferedPage(page);
    spinnerPage             = new SpinnerPage(page);
    Methods                 = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Navigate to Price Offered list and perform Expire action');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Bid Request ID: ' + vars['BidReqIdPriceOffered']);
        await priceOfferedPage.Expire_Button_Standard(vars["BidReqIdPriceOffered"]).click();
        await priceOfferedPage.Yes_Expire_Button.waitFor({ state: 'visible' });
        await priceOfferedPage.Yes_Expire_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Expire action performed for Bid Request ID: ' + vars['BidReqIdPriceOffered']);
      } catch (e) {
        await log.stepFail(page, 'Failed to perform Expire action for Bid Request ID: ' + vars['BidReqIdPriceOffered']);
        throw e;
      }

      log.step('Verify status on Price Offered list page for both execution types');
      try {
        vars['BidStatusChasePriceOffered'] = await priceOfferedPage.Bid_Status_Chase_DirectPrice_Offered_Page.textContent() || '';
        Methods.trimtestdata(vars['BidStatusChasePriceOffered'], 'BidStatusChasePriceOffered');
        log.info('Chase Direct status: ' + vars['BidStatusChasePriceOffered']);
        expect(Methods.verifyString(vars['BidStatusChasePriceOffered'], 'equals', appconstants.COMMITTED));

        vars['BidStatusStandardPriceOffered'] = await priceOfferedPage.Bid_Status_StandardPrice_Offered_Page.textContent() || '';
        Methods.trimtestdata(vars['BidStatusStandardPriceOffered'], 'BidStatusStandardPriceOffered');
        log.info('Standard status: ' + vars['BidStatusStandardPriceOffered']);
        expect(Methods.verifyString(vars['BidStatusStandardPriceOffered'], 'equals', appconstants.EXPIRED));

        log.stepPass('Price Offered page status verified. Chase Direct: ' + vars['BidStatusChasePriceOffered'] + ' | Standard: ' + vars['BidStatusStandardPriceOffered']);
      } catch (e) {
        await log.stepFail(page, 'Price Offered status verification failed. Chase Direct: ' + vars['BidStatusChasePriceOffered'] + ' | Standard: ' + vars['BidStatusStandardPriceOffered']);
        throw e;
      }

      log.step('Verify committed status on Bid Requests list page');
      try {
        await correspondentPortalPage.Bid_Requests.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await bidRequestPage.Bid_Status_BidRequestsPage(vars["BidReqIdPriceOffered"]).waitFor({ state: 'visible' });
        vars['StatusBidReqPage'] = await bidRequestPage.Bid_Status_BidRequestsPage(vars["BidReqIdPriceOffered"]).textContent() || '';
        Methods.trimtestdata(vars['StatusBidReqPage'], 'StatusBidReqPage');
        log.info('Bid Request list status: ' + vars['StatusBidReqPage']);
        expect(Methods.verifyString(vars['StatusBidReqPage'], 'equals', appconstants.COMMITTED));
        log.stepPass('Bid Requests list status verified: ' + vars['StatusBidReqPage']);
      } catch (e) {
        await log.stepFail(page, 'Bid Requests list status verification failed. Status: ' + vars['StatusBidReqPage']);
        throw e;
      }

      log.step('Verify committed status on Bid Request details page');
      try {
        await bidRequestPage.Required_Bid_Req_IDBid_Req_Page(vars["BidReqIdPriceOffered"]).click();
        await bidRequestPage.Bid_StatusBid_Req_Details.waitFor({ state: 'visible' });
        vars['StatusBidReqDetails'] = await bidRequestPage.Bid_StatusBid_Req_Details.textContent() || '';
        Methods.trimtestdata(vars['StatusBidReqDetails'], 'StatusBidReqDetails');
        log.info('Bid Request details status: ' + vars['StatusBidReqDetails']);
        expect(Methods.verifyString(vars['StatusBidReqDetails'], 'equals', appconstants.COMMITTED));
        log.stepPass('Bid Request details status verified: ' + vars['StatusBidReqDetails']);
      } catch (e) {
        await log.stepFail(page, 'Bid Request details status verification failed. Status: ' + vars['StatusBidReqDetails']);
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