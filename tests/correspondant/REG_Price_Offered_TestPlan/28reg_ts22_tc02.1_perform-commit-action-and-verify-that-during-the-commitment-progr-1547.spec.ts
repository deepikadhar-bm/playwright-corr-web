import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID    = 'REG_TS22_TC02.1';
const TC_TITLE = 'Perform commit action and verify that during the commitment progress, the status is updated to commitment in progress -> Verify in both list and detail screen (One Execution Type)';

test.describe('REG_PriceOffered', () => {

  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  const profileName = 'Price Offered';
  const profile     = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
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

      log.step('Login to CORR portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login successful');
      } catch (e) {
        await log.stepFail(page, 'Login failed');
        throw e;
      }

      log.step('Navigate to Price Offered list and search by Bid Request ID');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        if (profile && profile.data) {
          vars['BidReqIdPriceOffered'] = profile.data[0]['RequestIDFrom28-2'];
          log.info('TestData key: RequestIDFrom28-2 | Bid Request ID: ' + vars['BidReqIdPriceOffered']);
        }
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.keyboard.press('Enter');
        log.stepPass('Navigated to Price Offered list. Bid Request ID: ' + vars['BidReqIdPriceOffered']);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Price Offered list or search by Bid Request ID');
        throw e;
      }

      log.step('Select all loans and perform commit action');
      try {
        await priceOfferedPage.BidRequestIDPrice_Offered(vars['BidReqIdPriceOffered']).click();
        await priceOfferedPage.Select_all_for_Checkbox.check();
        await correspondentPortalPage.Get_Price_Button.click();
        await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        vars['CurrentPageURL'] = page.url();
        log.info('Current page URL captured before commit: ' + vars['CurrentPageURL']);
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        log.stepPass('Commit action triggered successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to perform commit action');
        throw e;
      }

      log.step('Verify Bid Request status is "Commitment in progress" on Bid Requests page');
      try {
        const newPage = await page.context().newPage();
        await newPage.goto(vars['CurrentPageURL']);

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
        await newBidRequestPage.Bid_Status_BidRequestsPage(vars['BidReqIdPriceOffered']).waitFor({ state: 'visible' });
        vars['BidStatusBidReqPage'] = await newBidRequestPage.Bid_Status_BidRequestsPage(vars['BidReqIdPriceOffered']).textContent() || '';
        newMethods.trimtestdata(vars['BidStatusBidReqPage'], 'BidStatusBidReqPage');
        log.info('Bid status on Bid Requests page: ' + vars['BidStatusBidReqPage']);
        if (vars['BidStatusBidReqPage'].includes(appconstants.PARTIALLYCOMMITTED_STATUS)) {
          log.info('Status is Partially Committed — re-searching to wait for status update');
          await newBidRequestsPage.Search_by_Bid_Request_ID_Field.click();
          await newBidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
          await newSpinnerPage.Spinner.waitFor({ state: 'hidden' });
          await newBidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
          await newPage.keyboard.press('Enter');
          await newSpinnerPage.Spinner.waitFor({ state: 'hidden' });
          vars['BidStatusBidReqPage'] = await newBidRequestPage.Bid_Status_BidRequestsPage(vars['BidReqIdPriceOffered']).textContent() || '';
          newMethods.trimtestdata(vars['BidStatusBidReqPage'], 'BidStatusBidReqPage');
          log.info('Bid status after re-search: ' + vars['BidStatusBidReqPage']);
        }
        expect(newMethods.verifyString(vars['BidStatusBidReqPage'], 'equals', appconstants.COMMITMENT_IN_PROGRESS_STATUS));
        log.stepPass('Bid Request page status verified: ' + vars['BidStatusBidReqPage']);

        log.step('Verify Bid Request status is "Commitment in progress" on Price Offered list page');
        const newPriceOfferedPage = new PriceOfferedPage(newPage);
        await newCorrespondentPortalPage.Commitments_Side_Menu.click();
        await newCorrespondentPortalPage.Price_Offered_List_Dropdown.click();
        await newCorrespondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await newPage.keyboard.press('Enter');
        await newSpinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['BidStatusPriceOfferedPage'] = await newPriceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars['BidReqIdPriceOffered']).textContent() || '';
        newMethods.trimtestdata(vars['BidStatusPriceOfferedPage'], 'BidStatusPriceOfferedPage');
        log.info('Bid status on Price Offered page: ' + vars['BidStatusPriceOfferedPage']);
        expect(newMethods.verifyString(vars['BidStatusPriceOfferedPage'], 'equals', appconstants.COMMITMENT_IN_PROGRESS_STATUS));
        log.stepPass('Price Offered page status verified: ' + vars['BidStatusPriceOfferedPage']);

        await newPage.close();
      } catch (e) {
        await log.stepFail(page, 'Status verification failed. Bid Req status: ' + vars['BidStatusBidReqPage'] + ' | Price Offered status: ' + vars['BidStatusPriceOfferedPage']);
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