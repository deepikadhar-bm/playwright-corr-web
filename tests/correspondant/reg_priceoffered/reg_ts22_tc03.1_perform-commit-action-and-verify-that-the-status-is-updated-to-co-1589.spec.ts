import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS22_TC03.1';
const TC_TITLE = 'Perform commit action and verify that the status is updated to committed when all the loans from the bid is committed (One Execution Types)';

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
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Reading test data from the testdataprofiles');
      try {
        if (profile && profile.data) {
          vars['BidReqIdPriceOffered'] = profile.data[0]['RequestIDfrom22-1.1'];
          log.info('BidReqIdPriceOffered: ' + vars['BidReqIdPriceOffered']);
        }
         log.stepPass('successfully read the testdata from the testdataprofiles');
         } catch (e) {
        log.stepFail(page, 'Failed to read the testdata from the testdataprofiles');
        throw e;
      }
        log.step('Login to corr application');
        try{
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
         log.stepPass('successfully login to the corr application ');
         } catch (e) {
        log.stepFail(page, 'Failed to login corr application');
        throw e;
      }
        log.step('Uncommitting the existing committed loans in commitment list');
        try{
        await stepGroups.stepGroup_Uncommits_the_Committed_Loans_One_Exe_Type(page, vars);
        log.stepPass('successfully uncommitted the existing committed loans in commitment list');
      } catch (e) {
        log.stepFail(page, 'Failed to uncommit existing committed loans in commitment list');
        throw e;
      }

      log.step('Navigating to Price Offered and committing all loans');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.First_Bid_Request_ID.click();
        await priceOfferedPage.Select_all_for_Checkboxprice_offered_screen.check();
        await priceOfferedPage.Get_Price_Button.click();
        await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        await priceOfferedPage.Yes_Commit_ButtonPopup.waitFor({ state: 'hidden' });
        await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
        await priceOfferedPage.Okay_ButtonPopup.click();
        log.stepPass('All loans committed successfully for Bid Request ID: ' + vars['BidReqIdPriceOffered']);
      } catch (e) {
        log.stepFail(page, 'Failed to commit all loans on Price Offered page');
        throw e;
      }

      log.step('Verifying bid status is Committed on Price Offered page');
      try {
        await priceOfferedPage.BackTo_PriceofferedPage.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['BidStatusPriceOfferedPage'] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars["BidReqIdPriceOffered"]).textContent() || '';
        Methods.trimtestdata(vars['BidStatusPriceOfferedPage'], 'BidStatusPriceOfferedPage');
        log.info('BidStatus on Price Offered page: ' + vars['BidStatusPriceOfferedPage']);
        Methods.verifyString(vars['BidStatusPriceOfferedPage'], 'equals', appconstants.COMMITTED);
        log.stepPass('Bid status confirmed as Committed on Price Offered page');
      } catch (e) {
        log.stepFail(page, 'Failed to verify Committed status on Price Offered page');
        throw e;
      }

      log.step('Verifying bid status is Committed on Bid Requests page');
      try {
        await correspondentPortalPage.Bid_Requests.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['BidStatusBidReqPage'] = await bidRequestPage.Bid_Status_BidRequestsPage(vars["BidReqIdPriceOffered"]).textContent() || '';
        Methods.trimtestdata(vars['BidStatusBidReqPage'], 'BidStatusBidReqPage');
        log.info('BidStatus on Bid Requests page: ' + vars['BidStatusBidReqPage']);
        Methods.verifyString(vars['BidStatusBidReqPage'], 'equals', appconstants.COMMITTED);
        log.stepPass('Bid status confirmed as Committed on Bid Requests page');
      } catch (e) {
        log.stepFail(page, 'Failed to verify Committed status on Bid Requests page');
        throw e;
      }

      log.step('Verifying bid status is Committed on Bid Request Details page and writing to test data profile');
      try {
        await bidRequestPage.Required_Bid_Req_IDBid_Req_Page(vars["BidReqIdPriceOffered"]).click();
        await bidRequestPage.Bid_StatusBid_Req_Details.waitFor({ state: 'visible' });
        vars['StatusBidReqDetails'] = await bidRequestPage.Bid_StatusBid_Req_Details.textContent() || '';
        log.info('BidStatus on Bid Request Details: ' + vars['StatusBidReqDetails']);
        Methods.verifyString(vars['StatusBidReqDetails'], 'equals', appconstants.COMMITTED);
        testDataManager.updateProfileData('Price Offered', { 'RequestIDfrom22-3.1': vars['BidReqIdPriceOffered'] });
        log.stepPass('Bid status confirmed as Committed on Bid Request Details page');
      } catch (e) {
        log.stepFail(page, 'Failed to verify Committed status on Bid Request Details page');
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