import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedDetailsPage } from '../../../src/pages/correspondant/price-offered-details';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1389 } from '../../../src/helpers/prereqs/prereq-1389';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
// import { ENV } from '@config/environments';


const TC_ID = 'REG_TS22_TC01.2';
const TC_TITLE = 'Perform commit action and verify that the status is updated to partially committed when few loans from the bid is committed (Two Execution Type)';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedDetailsPage: PriceOfferedDetailsPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  // const credentials = ENV.getCredentials('internal');


  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1389(page, vars);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedDetailsPage = new PriceOfferedDetailsPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    //            vars['Username'] = credentials.username;
    // vars['Password'] = credentials.password;
    // await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Navigating to Price Offered and committing a Chase Direct loan');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['BidReqIdPriceOffered'] = vars['RequestIDDetails'];
        // vars['BidReqIdPriceOffered'] = '879MBD1B9B48';
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Commits_an_Fresh_Loan_Num_Chase_Direct(page, vars);
        await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
        vars['CommittedLoanNumChaseDirect'] = await priceOfferedDetailsPage.Locked_Loan_Num_Price_Offered_details.first().textContent() || '';
        log.info('CommittedLoanNumChaseDirect: ' + vars['CommittedLoanNumChaseDirect']);
        log.stepPass('Chase Direct loan committed successfully for Bid Request ID: ' + vars['BidReqIdPriceOffered']);
      } catch (e) {
        log.stepFail(page, 'Failed to commit Chase Direct loan on Price Offered page');
        throw e;
      }

      log.step('Verifying Chase Direct status is Partially Committed and Standard status is Price Offered');
      try {
        await priceOfferedPage.BackTo_PriceofferedPage.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['BidStatusChasePriceOffered'] = await priceOfferedPage.Bid_Status_Chase_DirectPrice_Offered_Page.textContent() || '';
        Methods.trimtestdata(vars['BidStatusChasePriceOffered'], 'BidStatusChasePriceOffered');
        log.info('BidStatus Chase Direct: ' + vars['BidStatusChasePriceOffered']);
        Methods.verifyString(vars['BidStatusChasePriceOffered'], 'equals', appconstants.PARTIALLYCOMMITTED);
        vars['BidStatusStandardPriceOffered'] = await priceOfferedPage.Bid_Status_StandardPrice_Offered_Page.textContent() || '';
        Methods.trimtestdata(vars['BidStatusStandardPriceOffered'], 'BidStatusStandardPriceOffered');
        log.info('BidStatus Standard: ' + vars['BidStatusStandardPriceOffered']);
        Methods.verifyString(vars['BidStatusStandardPriceOffered'], 'equals', appconstants.PRICEOFFERED); 
        log.stepPass('Chase Direct confirmed Partially Committed and Standard confirmed Price Offered');
      } catch (e) {
        log.stepFail(page, 'Failed to verify Chase Direct or Standard status on Price Offered page');
        throw e;
      }

      log.step('Verifying bid status is Partially Committed on Bid Requests page and Bid Request Details page');
      try {
        await correspondentPortalPage.Bid_Requests.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await bidRequestPage.Bid_Status_BidRequestsPage(vars['BidReqIdPriceOffered']).waitFor({ state: 'visible' });
        vars['StatusBidReqPage'] = await bidRequestPage.Bid_Status_BidRequestsPage(vars['BidReqIdPriceOffered']).textContent() || '';
        Methods.trimtestdata(vars['StatusBidReqPage'], 'StatusBidReqPage');
        log.info('BidStatus on Bid Requests page: ' + vars['StatusBidReqPage']);
        Methods.verifyString(vars['StatusBidReqPage'], 'equals', appconstants.PARTIALLYCOMMITTED);
        await bidRequestPage.Required_Bid_Req_IDBid_Req_Page(vars['BidReqIdPriceOffered']).click();
        await bidRequestPage.Bid_StatusBid_Req_Details.waitFor({ state: 'visible' });
        vars['StatusBidReqDetails'] = await bidRequestPage.Bid_StatusBid_Req_Details.textContent() || '';
        log.info('BidStatus on Bid Request Details: ' + vars['StatusBidReqDetails']);
        Methods.verifyString(vars['StatusBidReqDetails'], 'equals', appconstants.PARTIALLYCOMMITTED);
        log.stepPass('Bid status confirmed as Partially Committed on Bid Requests page and Bid Request Details page');
      } catch (e) {
        log.stepFail(page, 'Failed to verify Partially Committed status on Bid Requests or Bid Request Details page');
        throw e;
      }

      log.step('Navigating to Price Offered and committing a Standard loan');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidReqId_Standard.click();
        await stepGroups.stepGroup_Commits_an_Fresh_Loan_Num_Standard(page, vars);
        log.stepPass('Standard loan committed successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to commit Standard loan on Price Offered page');
        throw e;
      }

      log.step('Verifying both Chase Direct and Standard statuses are Partially Committed');
      try {
        await priceOfferedPage.BackTo_PriceofferedPage.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['BidStatusChasePriceOffered'] = await priceOfferedPage.Bid_Status_Chase_DirectPrice_Offered_Page.textContent() || '';
        Methods.trimtestdata(vars['BidStatusChasePriceOffered'], 'BidStatusChasePriceOffered');
        log.info('BidStatus Chase Direct: ' + vars['BidStatusChasePriceOffered']);
        Methods.verifyString(vars['BidStatusChasePriceOffered'], 'equals', appconstants.PARTIALLYCOMMITTED);
        vars['BidStatusStandardPriceOffered'] = await priceOfferedPage.Bid_Status_StandardPrice_Offered_Page.textContent() || '';
        Methods.trimtestdata(vars['BidStatusStandardPriceOffered'], 'BidStatusStandardPriceOffered');
        log.info('BidStatus Standard: ' + vars['BidStatusStandardPriceOffered']);
        Methods.verifyString(vars['BidStatusStandardPriceOffered'], 'equals', appconstants.PARTIALLYCOMMITTED);      
        log.stepPass('Both Chase Direct and Standard confirmed as Partially Committed');
      } catch (e) {
        log.stepFail(page, 'Failed to verify both Chase Direct and Standard statuses as Partially Committed');
        throw e;
      }

      log.step('Verifying bid status is Partially Committed on Bid Requests and Bid Request Details page and writing to test data profile');
      try {
        await correspondentPortalPage.Bid_Requests.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await bidRequestPage.Bid_Status_BidRequestsPage(vars['BidReqIdPriceOffered']).waitFor({ state: 'visible' });
        vars['StatusBidReqPage'] = await bidRequestPage.Bid_Status_BidRequestsPage(vars['BidReqIdPriceOffered']).textContent() || '';
        Methods.trimtestdata(vars['StatusBidReqPage'], 'StatusBidReqPage');
        log.info('BidStatus on Bid Requests page: ' + vars['StatusBidReqPage']);
        Methods.verifyString(vars['StatusBidReqPage'], 'equals', appconstants.PARTIALLYCOMMITTED);
        await bidRequestPage.Required_Bid_Req_IDBid_Req_Page(vars['BidReqIdPriceOffered']).click();
        await bidRequestPage.Bid_StatusBid_Req_Details.waitFor({ state: 'visible' });
        vars['StatusBidReqDetails'] = await bidRequestPage.Bid_StatusBid_Req_Details.textContent() || '';
        log.info('BidStatus on Bid Request Details: ' + vars['StatusBidReqDetails']);
        Methods.verifyString(vars['StatusBidReqDetails'], 'equals', appconstants.PARTIALLYCOMMITTED);       
        testDataManager.updateProfileData('Price Offered', { 'RequestIDfrom22-1.2': vars['BidReqIdPriceOffered'] });
        log.stepPass('Bid status confirmed as Partially Committed on both pages and profile updated');
      } catch (e) {
        log.stepFail(page, 'Failed to verify status or update test data profile');
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