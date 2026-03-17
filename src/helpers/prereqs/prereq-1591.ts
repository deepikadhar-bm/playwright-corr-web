import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidRequestPage } from '../../pages/correspondant/bid-request';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../constants/app-constants';
import { ENV } from '@config/environments';

// TS22_TC03.2
export async function runPrereq_1591(page: Page, vars: Record<string, string>): Promise<void> {
  const bidRequestPage          = new BidRequestPage(page);
  const bidRequestsPage         = new BidRequestsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage        = new PriceOfferedPage(page);
  const spinnerPage             = new SpinnerPage(page);
  const Methods                 = new AddonHelpers(page, vars);
  const credentials             = ENV.getCredentials('internal');
  const profileName             = 'Price Offered';
  const profile                 = testDataManager.getProfileByName(profileName);

  log.step('Prereq TS22_TC03.2: Login to CORR portal');
  try {
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    log.stepPass('Prereq: Login successful');
  } catch (e) {
    await log.stepFail(page, 'Prereq: Login failed');
    throw e;
  }

  log.step('Prereq: Set Bid Request ID and uncommit existing committed loans');
  try {
    if (profile && profile.data) {
      vars['BidReqIdPriceOffered'] = profile.data[0]['RequestIDfrom22-1.2'];
      log.info('Prereq - TestData key: RequestIDfrom22-1.2 | Bid Request ID: ' + vars['BidReqIdPriceOffered']);
    }
    await stepGroups.stepGroup_Uncommits_the_Committed_Loans_Two_Exe_Type(page, vars);
    log.stepPass('Prereq: Uncommit step completed for Bid Request ID: ' + vars['BidReqIdPriceOffered']);
  } catch (e) {
    await log.stepFail(page, 'Prereq: Failed to uncommit committed loans for Bid Request ID: ' + vars['BidReqIdPriceOffered']);
    throw e;
  }

  log.step('Prereq: Navigate to Price Offered list and search by Bid Request ID');
  try {
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
    await page.keyboard.press('Enter');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    log.stepPass('Prereq: Navigated to Price Offered list. Bid Request ID: ' + vars['BidReqIdPriceOffered']);
  } catch (e) {
    await log.stepFail(page, 'Prereq: Failed to navigate to Price Offered list');
    throw e;
  }

  log.step('Prereq: Commit all Chase Direct loans and capture execution type');
  try {
    await stepGroups.stepGroup_Commit_All_Loans_Chase_Direct(page, vars);
    vars['ExecutionTypePriceOfferedDetails'] = await priceOfferedPage.Execution_TypeDetails.textContent() || '';
    Methods.trimtestdata(vars['ExecutionTypePriceOfferedDetails'], 'ExecutionTypePriceOfferedDetails');
    log.info('Prereq - Execution type: ' + vars['ExecutionTypePriceOfferedDetails']);
    await priceOfferedPage.BackTo_PriceofferedPage.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    log.stepPass('Prereq: All Chase Direct loans committed. Execution type: ' + vars['ExecutionTypePriceOfferedDetails']);
  } catch (e) {
    await log.stepFail(page, 'Prereq: Failed to commit Chase Direct loans');
    throw e;
  }

  log.step('Prereq: Verify committed status on Price Offered list page for both execution types');
  try {
    vars['BidStatusChasePriceOffered'] = await priceOfferedPage.Bid_Status_Chase_DirectPrice_Offered_Page.textContent() || '';
    Methods.trimtestdata(vars['BidStatusChasePriceOffered'], 'BidStatusChasePriceOffered');
    log.info('Prereq - Chase Direct status: ' + vars['BidStatusChasePriceOffered']);
    expect(Methods.verifyString(vars['BidStatusChasePriceOffered'], 'equals', appconstants.COMMITTED));

    vars['BidStatusStandardPriceOffered'] = await priceOfferedPage.Bid_Status_StandardPrice_Offered_Page.textContent() || '';
    Methods.trimtestdata(vars['BidStatusStandardPriceOffered'], 'BidStatusStandardPriceOffered');
    log.info('Prereq - Standard status: ' + vars['BidStatusStandardPriceOffered']);
    expect(Methods.verifyString(vars['BidStatusStandardPriceOffered'], 'equals', appconstants.PRICEOFFERED));

    log.stepPass('Prereq: Price Offered status verified. Chase Direct: ' + vars['BidStatusChasePriceOffered'] + ' | Standard: ' + vars['BidStatusStandardPriceOffered']);
  } catch (e) {
    await log.stepFail(page, 'Prereq: Price Offered status verification failed. Chase Direct: ' + vars['BidStatusChasePriceOffered'] + ' | Standard: ' + vars['BidStatusStandardPriceOffered']);
    throw e;
  }

  log.step('Prereq: Verify committed status on Bid Requests list page');
  try {
    await correspondentPortalPage.Bid_Requests.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
    await page.keyboard.press('Enter');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestPage.Bid_Status_BidRequestsPage(vars['BidReqIdPriceOffered']).waitFor({ state: 'visible' });
    vars['StatusBidReqPage'] = await bidRequestPage.Bid_Status_BidRequestsPage(vars['BidReqIdPriceOffered']).textContent() || '';
    Methods.trimtestdata(vars['StatusBidReqPage'], 'StatusBidReqPage');
    log.info('Prereq - Bid Request list status: ' + vars['StatusBidReqPage']);
    expect(Methods.verifyString(vars['StatusBidReqPage'], 'equals', appconstants.COMMITTED));
    log.stepPass('Prereq: Bid Requests list status verified: ' + vars['StatusBidReqPage']);
  } catch (e) {
    await log.stepFail(page, 'Prereq: Bid Requests list status verification failed. Status: ' + vars['StatusBidReqPage']);
    throw e;
  }

  log.step('Prereq: Verify committed status on Bid Request details page');
  try {
    await bidRequestPage.Required_Bid_Req_IDBid_Req_Page(vars['BidReqIdPriceOffered']).click();
    await bidRequestPage.Bid_StatusBid_Req_Details.waitFor({ state: 'visible' });
    vars['StatusBidReqDetails'] = await bidRequestPage.Bid_StatusBid_Req_Details.textContent() || '';
    Methods.trimtestdata(vars['StatusBidReqDetails'], 'StatusBidReqDetails');
    log.info('Prereq - Bid Request details status: ' + vars['StatusBidReqDetails']);
    expect(Methods.verifyString(vars['StatusBidReqDetails'], 'equals', appconstants.COMMITTED));
    log.stepPass('Prereq: Bid Request details status verified: ' + vars['StatusBidReqDetails']);
  } catch (e) {
    await log.stepFail(page, 'Prereq: Bid Request details status verification failed. Status: ' + vars['StatusBidReqDetails']);
    throw e;
  }

  log.info('Prereq TS22_TC03.2 completed successfully BidReqIdPriceOffered: ' + vars['BidReqIdPriceOffered']);
}