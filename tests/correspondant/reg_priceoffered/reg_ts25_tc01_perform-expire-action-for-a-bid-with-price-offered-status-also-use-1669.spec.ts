import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS25_TC01';
const TC_TITLE = 'Perform expire action for a bid with price offered status, Also user should be able to update back to price offered';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  const profileName = 'Price Offered';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Reading test data and login to CORR portal');
      try {
        if (profile && profile.data) {
          vars['BidReqIdPriceOffered'] = profile.data[0]['RequestIDfrom24-1'];
          log.info('BidReqIdPriceOffered: ' + vars['BidReqIdPriceOffered']);
        }
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login successful');
      } catch (e) {
        log.stepFail(page, 'Failed to read test data or login to CORR portal');
        throw e;
      }

      log.step('Navigating to Price Offered and verifying bid status is Price Offered');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await priceOfferedPage.Bid_Req_IdPrice_Offered_Page(vars["BidReqIdPriceOffered"]).waitFor({ state: 'visible' });
        vars['BidStatusPriceOffered'] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars["BidReqIdPriceOffered"]).textContent() || '';
        Methods.trimtestdata(vars['BidStatusPriceOffered'], 'BidStatusPriceOffered');
        Methods.verifyString(vars['BidStatusPriceOffered'], 'equals', appconstants.PRICEOFFERED_STATUS);
        vars['BidValuePriceOffered'] = await priceOfferedPage.Bid_ValuePrice_Offered_Page(vars["BidReqIdPriceOffered"]).textContent() || '';
        vars['TotalLoansPriceOffered'] = await priceOfferedPage.Total_LoansPrice_Offered_Page(vars["BidReqIdPriceOffered"]).textContent() || '';
        log.info('BidStatus: ' + vars['BidStatusPriceOffered']);
        log.stepPass('Bid status confirmed as Price Offered for Bid Request ID: ' + vars['BidReqIdPriceOffered']);
      } catch (e) {
        log.stepFail(page, 'Failed to verify bid status as Price Offered');
        throw e;
      }
      log.step('Performing expire action and verifying popup data');
      try {
        await priceOfferedPage.Expire_Pricing_ButtonPrice_Offered(vars["BidReqIdPriceOffered"]).click();
        await expect(priceOfferedPage.Bid_Req_IdExpire_Popup).toContainText(vars['BidReqIdPriceOffered']);
        await expect(priceOfferedPage.Bid_ValueActions_Popup).toContainText(vars['BidValuePriceOffered']);
        await expect(priceOfferedPage.Total_LoansActions_Popup).toContainText(vars['TotalLoansPriceOffered']);
        await priceOfferedPage.Yes_Expire_Button.click();
        log.stepPass('Expire action performed and popup data verified');
      } catch (e) {
        log.stepFail(page, 'Failed to perform expire action or verify popup data');
        throw e;
      }

      log.step('Reloading page and verifying bid status is Expired');
      try {
        await page.reload();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
        vars['RequiredBidID'] = vars['BidReqIdPriceOffered'];
        await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars["BidReqIdPriceOffered"]).waitFor({ state: 'visible' });
        vars['BidStatusPriceOffered'] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars["BidReqIdPriceOffered"]).textContent() || '';
        Methods.trimtestdata(vars['BidStatusPriceOffered'], 'BidStatusPriceOffered');
        Methods.verifyString(vars['BidStatusPriceOffered'], 'equals', appconstants.EXPIRED_STATUS);
        log.info('BidStatus after expire: ' + vars['BidStatusPriceOffered']);
        log.stepPass('Bid status confirmed as Expired');
      } catch (e) {
        log.stepFail(page, 'Failed to verify bid status as Expired after reload');
        throw e;
      }

      log.step('Opening expired bid and verifying Get Price button is visible');
      try {
        await priceOfferedPage.Bid_Req_IdPrice_Offered_Page(vars["BidReqIdPriceOffered"]).click();
        await correspondentPortalPage.Get_Price_Button.waitFor({ state: 'visible' });
        await expect(correspondentPortalPage.Get_Price_Button).toBeDisabled();
        log.stepPass('Get Price button is visible on expired bid');
      } catch (e) {
        log.stepFail(page, 'Failed to verify Get Price button is disabled on expired bid');
        throw e;
      }

      log.step('Changing status back to Price Offered and verifying');
      try {
        await priceOfferedPage.BackTo_PriceofferedPage.click();
        await priceOfferedPage.Change_StatusPrice_Offered(vars["BidReqIdPriceOffered"]).click();
        await priceOfferedPage.Change_Status_ButtonPopup.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars["BidReqIdPriceOffered"]).waitFor({ state: 'visible' });
        await page.waitForTimeout(10000);
        vars['BidStatusPriceOffered'] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars["BidReqIdPriceOffered"]).textContent() || '';
        Methods.trimtestdata(vars['BidStatusPriceOffered'], 'BidStatusPriceOffered');
        Methods.verifyString(vars['BidStatusPriceOffered'], 'equals', appconstants.PRICEOFFERED_STATUS);
        log.info('BidStatus after change: ' + vars['BidStatusPriceOffered']);
        log.stepPass('Bid status successfully changed back to Price Offered');
      } catch (e) {
        log.stepFail(page, 'Failed to change bid status back to Price Offered');
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