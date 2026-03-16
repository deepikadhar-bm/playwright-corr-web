import { test, expect } from '@playwright/test';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1389 } from '../../../src/helpers/prereqs/prereq-1389';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID    = 'REG_TS22_TC02.2';
const TC_TITLE = 'Perform commit action and verify that during the commitment progress, the status is updated to commitment in progress -> Verify in both list and detail screen (Two Execution Types)';

test.describe('REG_PriceOffered', () => {

  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;


  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1389(page, vars);
    bidRequestPage          = new BidRequestPage(page);
    bidRequestsPage         = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage        = new PriceOfferedPage(page);
    spinnerPage             = new SpinnerPage(page);
    Methods                 = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Navigate to Price Offered list and search by Bid Request ID');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        vars['BidReqIdPriceOffered'] = vars['RequestIDDetails'];
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Bid Request ID: ' + vars['BidReqIdPriceOffered']);
        log.stepPass('Navigated to Price Offered list Bid Request ID: ' + vars['BidReqIdPriceOffered']);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Price Offered list or search by Bid Request ID');
        throw e;
      }

      log.step('Open bid request details and capture execution type');
      try {
        await priceOfferedPage.BidReqId_Chase_Direct.click();
        await priceOfferedPage.Execution_TypeDetails.waitFor({ state: 'visible' });
        vars['ExecutionTypePriceOfferedDetails'] = await priceOfferedPage.Execution_TypeDetails.textContent() || '';
        Methods.trimtestdata(vars['ExecutionTypePriceOfferedDetails'], 'ExecutionTypePriceOfferedDetails');
        log.info('Execution type: ' + vars['ExecutionTypePriceOfferedDetails']);
        log.stepPass('Bid request details opened. Execution type: ' + vars['ExecutionTypePriceOfferedDetails']);
      } catch (e) {
        await log.stepFail(page, 'Failed to open bid request details or capture execution type');
        throw e;
      }

      log.step('Select all loans and perform commit action');
      try {
        await priceOfferedPage.Select_all_for_Checkbox.check();
        await priceOfferedPage.Get_Price_Button.click();
        await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        vars['CurrentPageUrl'] = page.url();
        log.info('Current page URL captured before commit: ' + vars['CurrentPageUrl']);
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        log.stepPass('Commit action triggered successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to perform commit action');
        throw e;
      }

      log.step('Verify Bid Request status is "Commitment in progress" on Bid Requests page');
      try {
        // Open new tab and re-instantiate all POM objects with newPage
        const newPage                    = await page.context().newPage();
        await newPage.goto(vars['CurrentPageUrl']);
        const newCorrespondentPortalPage = new CorrespondentPortalPage(newPage);
        const newBidRequestsPage         = new BidRequestsPage(newPage);
        const newBidRequestPage          = new BidRequestPage(newPage);
        const newSpinnerPage             = new SpinnerPage(newPage);
        const newMethods                 = new AddonHelpers(newPage, vars);

        await newCorrespondentPortalPage.Bid_Requests.waitFor({ state: 'visible' });
        await newCorrespondentPortalPage.Bid_Requests.click();
        await newBidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
        await newPage.keyboard.press('Enter');
        await newSpinnerPage.Spinner.waitFor({ state: 'hidden' });
        await newBidRequestPage.Bid_Status_BidRequestsPage(vars["BidReqIdPriceOffered"]).waitFor({ state: 'visible' });
        vars['StatusBidReqPage'] = await newBidRequestPage.Bid_Status_BidRequestsPage(vars["BidReqIdPriceOffered"]).textContent() || '';
        newMethods.trimtestdata(vars['StatusBidReqPage'], 'StatusBidReqPage');
        log.info('Bid status on Bid Requests page: ' + vars['StatusBidReqPage']);
        if (vars['StatusBidReqPage'].includes(appconstants.PRICEOFFERED)) {
          log.info('Status is Price Offered — re-searching to wait for status update');
          await newBidRequestsPage.Search_by_Bid_Request_ID_Field.click();
          await newBidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
          await newSpinnerPage.Spinner.waitFor({ state: 'hidden' });
          await newBidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
          await newPage.keyboard.press('Enter');
          await newSpinnerPage.Spinner.waitFor({ state: 'hidden' });
          vars['StatusBidReqPage'] = await newBidRequestPage.Bid_Status_BidRequestsPage(vars["BidReqIdPriceOffered"]).textContent() || '';
          newMethods.trimtestdata(vars['StatusBidReqPage'], 'StatusBidReqPage');
          log.info('Bid status after re-search: ' + vars['StatusBidReqPage']);
        }
        expect(newMethods.verifyString(vars['StatusBidReqPage'], 'equals', appconstants.COMMITMENT_IN_PROGRESS));
        log.stepPass('Bid Request page status verified: ' + vars['StatusBidReqPage']);

        log.step('Verify status on Price Offered list page for Chase Direct and Standard execution types');
        const newPriceOfferedPage = new PriceOfferedPage(newPage);
        await newCorrespondentPortalPage.Commitments_Side_Menu.click();
        await newCorrespondentPortalPage.Price_Offered_List_Dropdown.click();
        await newCorrespondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await newPage.keyboard.press('Enter');
        await newSpinnerPage.Spinner.waitFor({ state: 'hidden' });

        vars['BidStatusChasePriceOffered'] = await newPriceOfferedPage.Bid_Status_Chase_DirectPrice_Offered_Page.textContent() || '';
        newMethods.trimtestdata(vars['BidStatusChasePriceOffered'], 'BidStatusChasePriceOffered');
        log.info('Chase Direct status on Price Offered page: ' + vars['BidStatusChasePriceOffered']);
        expect(newMethods.verifyString(vars['BidStatusChasePriceOffered'], 'equals', appconstants.COMMITMENT_IN_PROGRESS));

        vars['BidStatusStandardPriceOffered'] = await newPriceOfferedPage.Bid_Status_StandardPrice_Offered_Page.textContent() || '';
        newMethods.trimtestdata(vars['BidStatusStandardPriceOffered'], 'BidStatusStandardPriceOffered');
        log.info('Standard status on Price Offered page: ' + vars['BidStatusStandardPriceOffered']);
        expect(newMethods.verifyString(vars['BidStatusStandardPriceOffered'], 'equals', appconstants.PRICEOFFERED));

        log.stepPass('Price Offered page status verified. Chase Direct: ' + vars['BidStatusChasePriceOffered'] + ' | Standard: ' + vars['BidStatusStandardPriceOffered']);
        await newPage.close();
      } catch (e) {
        await log.stepFail(page, 'Status verification failed. Bid Req: ' + vars['StatusBidReqPage'] + ' | Chase: ' + vars['BidStatusChasePriceOffered'] + ' | Standard: ' + vars['BidStatusStandardPriceOffered']);
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