import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1394 } from '../../../src/helpers/prereqs/prereq-1394';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS22_TC01.1';
const TC_TITLE = 'Perform commit action and verify that the status is updated to partially committed when few loans from the bid is committed (One Execution Types)';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1394(page, vars);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Navigating to Price Offered, committing a fresh loan and verifying status is Partially Committed');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['BidReqIdPriceOffered'] = vars['RequestIDDetails'];
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Commits_an_Fresh_Loan_Num(page, vars);
        await priceOfferedPage.BackTo_PriceofferedPage.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['BidStatusPriceOfferedPage'] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars["BidReqIdPriceOffered"]).textContent() || '';
        Methods.trimtestdata(vars['BidStatusPriceOfferedPage'], 'BidStatusPriceOfferedPage');
        log.info('BidStatus on Price Offered page: ' + vars['BidStatusPriceOfferedPage']);
        Methods.verifyString(vars['BidStatusPriceOfferedPage'], 'equals', appconstants.PARTIALLYCOMMITTED_STATUS);
        log.stepPass('Bid status confirmed as Partially Committed on Price Offered page');
      } catch (e) {
        log.stepFail(page, 'Failed to commit loan or verify Partially Committed status on Price Offered page');
        throw e;
      }

      log.step('Navigating to Bid Requests page and verifying status is Partially Committed');
      try {
        await correspondentPortalPage.Bid_Requests.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['BidStatusBidReqPage'] = await bidRequestPage.Bid_Status_BidRequestsPage(vars["BidReqIdPriceOffered"]).textContent() || '';
        Methods.trimtestdata(vars['BidStatusBidReqPage'], 'BidStatusBidReqPage');
        Methods.verifyString(vars['BidStatusBidReqPage'], 'equals', appconstants.PARTIALLYCOMMITTED_STATUS);
        log.info('BidStatus on Bid Requests page: ' + vars['BidStatusBidReqPage']);
        log.stepPass('Bid status confirmed as Partially Committed on Bid Requests page');
      } catch (e) {
        log.stepFail(page, 'Failed to verify Partially Committed status on Bid Requests page');
        throw e;
      }

      log.step('Navigating to Bid Request Details and verifying status is Partially Committed');
      try {
        await bidRequestPage.Required_Bid_Req_IDBid_Req_Page(vars["BidReqIdPriceOffered"]).click();
        await bidRequestPage.Bid_StatusBid_Req_Details.waitFor({ state: 'visible' });
        vars['StatusBidReqDetails'] = await bidRequestPage.Bid_StatusBid_Req_Details.textContent() || '';
        log.info('BidStatus on Bid Request Details: ' + vars['StatusBidReqDetails']);
        Methods.verifyString(vars['StatusBidReqDetails'], 'equals', appconstants.PARTIALLYCOMMITTED_STATUS);
        log.stepPass('Bid status confirmed as Partially Committed on Bid Request Details page');
        testDataManager.updateProfileData('Price Offered', { 'RequestIDfrom22-1.1': vars['BidReqIdPriceOffered'] });
      } catch (e) {
        log.stepFail(page, 'Failed to verify Partially Committed status on Bid Request Details page');
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