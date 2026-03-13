import type { Page } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { AddonHelpers } from '../AddonHelpers';
import { Logger as log } from '../log-helper';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { test, expect } from '@playwright/test';


//REG_TS25_TC01
export async function runPrereq_1669(page: Page, vars: Record<string, string>): Promise<void> {
  const credentials = ENV.getCredentials('internal');
  const profileName = 'Price Offered';
  const profile = testDataManager.getProfileByName(profileName);

  const bidRequestsPage = new BidRequestsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);

  vars['Username'] = credentials.username;
  vars['Password'] = credentials.password;
  const Methods = new AddonHelpers(page, vars);

  log.tcStart('prereq-1669', 'Pre-requisite setup for REG_TS25_TC01 - Expire and restore bid to Price Offered');
  if (profile && profile.data) {
    vars['BidReqIdPriceOffered'] = profile.data[0]['RequestIDfrom24-1'];
    log.info('BidReqIdPriceOffered: ' + vars['BidReqIdPriceOffered']);
  }
  try {
    log.step('login to CORR portal');
    try {
      await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
      log.stepPass('Login successful');
    } catch (e) {
      log.stepFail(page, 'Failed to login to CORR portal');
      throw e;
    }

    log.step('Navigating to Price Offered and verifying bid status is Price Offered');
    try {
      await correspondentPortalPage.Commitments_Side_Menu.click();
      await correspondentPortalPage.Price_Offered_List_Dropdown.click();
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
      await priceOfferedPage.Bid_Req_IdPrice_Offered_Page(vars['BidReqIdPriceOffered']).waitFor({ state: 'visible' });
      vars['BidStatusPriceOffered'] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars['BidReqIdPriceOffered']).textContent() || '';
      Methods.trimtestdata(vars['BidStatusPriceOffered'], 'BidStatusPriceOffered');
      Methods.verifyString(vars['BidStatusPriceOffered'], 'equals', appconstants.PRICEOFFERED);
      vars['BidValuePriceOffered'] = await priceOfferedPage.Bid_ValuePrice_Offered_Page(vars['BidReqIdPriceOffered']).textContent() || '';
      vars['TotalLoansPriceOffered'] = await priceOfferedPage.Total_LoansPrice_Offered_Page(vars['BidReqIdPriceOffered']).textContent() || '';
      log.info('BidStatus: ' + vars['BidStatusPriceOffered']);
      log.stepPass('Bid status confirmed as Price Offered for Bid Request ID: ' + vars['BidReqIdPriceOffered']);
    } catch (e) {
      log.stepFail(page, 'Failed to verify bid status as Price Offered');
      throw e;
    }

    log.step('Performing expire action and verifying expire popup data');
    try {
      await priceOfferedPage.Expire_Pricing_ButtonPrice_Offered(vars['BidReqIdPriceOffered']).click();
      await priceOfferedPage.Bid_Req_IdExpire_Popup.waitFor({ state: 'visible' });
      await priceOfferedPage.Bid_Req_IdExpire_Popup.getByText(vars['BidReqIdPriceOffered']).waitFor({ state: 'visible' });
      await priceOfferedPage.Bid_ValueActions_Popup.getByText(vars['BidValuePriceOffered']).waitFor({ state: 'visible' });
      await priceOfferedPage.Total_LoansActions_Popup.getByText(vars['TotalLoansPriceOffered']).waitFor({ state: 'visible' });
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
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
      vars['RequiredBidID'] = vars['BidReqIdPriceOffered'];
      await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars['BidReqIdPriceOffered']).waitFor({ state: 'visible' });
      vars['BidStatusPriceOffered'] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars['BidReqIdPriceOffered']).textContent() || '';
      Methods.trimtestdata(vars['BidStatusPriceOffered'], 'BidStatusPriceOffered');
      Methods.verifyString(vars['BidStatusPriceOffered'], 'equals', appconstants.EXPIRED);
      log.info('BidStatus after expire: ' + vars['BidStatusPriceOffered']);
      log.stepPass('Bid status confirmed as Expired');
    } catch (e) {
      log.stepFail(page, 'Failed to verify bid status as Expired after reload');
      throw e;
    }

    log.step('Opening expired bid and verifying Get Price button is visible');
    try {
      await priceOfferedPage.Bid_Req_IdPrice_Offered_Page(vars['BidReqIdPriceOffered']).click();
      await correspondentPortalPage.Get_Price_Button.waitFor({ state: 'visible' });
      await expect(correspondentPortalPage.Get_Price_Button).toBeDisabled();
      log.stepPass('Get Price button is disabled on expired bid');
    } catch (e) {
      log.stepFail(page, 'Failed to verify Get Price button on expired bid');
      throw e;
    }

    log.step('Changing status back to Price Offered and verifying');
    try {
      await priceOfferedPage.BackTo_PriceofferedPage.click();
      await priceOfferedPage.Change_StatusPrice_Offered(vars['BidReqIdPriceOffered']).click();
      await priceOfferedPage.Change_Status_ButtonPopup.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
      await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars['BidReqIdPriceOffered']).waitFor({ state: 'visible' });
      await page.waitForTimeout(10000);
      vars['BidStatusPriceOffered'] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars['BidReqIdPriceOffered']).textContent() || '';
      Methods.trimtestdata(vars['BidStatusPriceOffered'], 'BidStatusPriceOffered');
      Methods.verifyString(vars['BidStatusPriceOffered'], 'equals', appconstants.PRICEOFFERED);
      log.info('BidStatus after change: ' + vars['BidStatusPriceOffered']);
      log.stepPass('Bid status successfully restored to Price Offered');
    } catch (e) {
      log.stepFail(page, 'Failed to change bid status back to Price Offered');
      throw e;
    }

    log.tcEnd('PASS');
  } catch (e) {
    await log.captureOnFailure(page, 'prereq-1669', e);
    log.tcEnd('FAIL');
    throw e;
  }
}