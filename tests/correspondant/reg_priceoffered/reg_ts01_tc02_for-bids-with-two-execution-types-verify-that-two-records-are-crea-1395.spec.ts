import { test, expect } from '@playwright/test';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_2317 } from '../../../src/helpers/prereqs/prereq-2317';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants'


const TC_ID = 'REG_TS01_TC02';
const TC_TITLE = 'For bids with two execution types, verify that two records are created in the Price Offered screen, one for each execution type with proper bid records data.';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const profileName = 'Price Offered';

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_2317(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
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
      log.step('Search for Bid Request by ID in Bid Requests screen');
      try {
        await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
        await page.keyboard.press('Enter');
        testDataManager.updateProfileData(profileName, { 'RequestIDCreated3rdScenario': vars['RequestIDDetails'] });
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["RequestedDate(bid requests)"] = await bidRequestPage.First_Requested_Date.textContent() || '';
        log.info('Request ID: ' + vars["RequestIDDetails"]);
        log.info('Requested Date (Bid Requests): ' + vars["RequestedDate(bid requests)"]);
        log.stepPass('Bid Request found and Requested Date captured');
      } catch (e) {
        await log.stepFail(page, 'Failed to search for Bid Request ID: ' + vars["RequestIDDetails"]);
        throw e;
      }

      log.step('Navigate to Bid Request Details and capture field values');
      try {
        await correspondentPortalPage.First_Bid_Request_ID.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText("Bid Request Details")).toBeVisible();
        vars["CCode(bid request details)"] = await correspondentPortalPage.CCode_Valuebid_request_details.textContent() || '';
        vars["Company(bid request details)"] = await bidRequestDetailsPage.Company_ValueBid_Request_Details.textContent() || '';
        Methods.trimtestdata(vars["Company(bid request details)"], "Company(bid request details)");
        vars["RequestID(bid request details)"] = await bidRequestDetailsPage.Request_Id_From_Details.textContent() || '';
        vars["Status(bid request details)"] = await bidRequestDetailsPage.Statusbid_request_details.textContent() || '';
        vars["ExecutionFlow(SFL)"] = await bidRequestDetailsPage.Execution_Typesflbid_request_details.textContent() || '';
        // Methods.splitByWhiteSpace(vars["ExecutionFlow(SFL)"],'0', "ExecutionFlow(SFL)");
        vars["SuccessLoan(SFL)"] = await bidRequestDetailsPage.Success_Loansfl_bid_request_details.textContent() || '';
        log.info('CCode: ' + vars["CCode(bid request details)"]);
        log.info('Company: ' + vars["Company(bid request details)"]);
        log.info('Request ID (Details): ' + vars["RequestID(bid request details)"]);
        log.info('Status: ' + vars["Status(bid request details)"]);
        log.info('Success Loan (SFL): ' + vars["SuccessLoan(SFL)"]);
        log.stepPass('Bid Request Details fields captured successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture Bid Request Details fields');
        throw e;
      }

      log.step('Calculate total Bid Value from Success Loan Amount table');
      try {
        vars["count1"] = appconstants.ONE;
        vars["total"] = appconstants.ZERO;
        vars["TotalSuccessLoanAmountCount"] = String(await bidRequestDetailsPage.Total_Success_Loantable1_bid_request_details.count());
        log.info('Total Success Loan Amount rows: ' + vars["TotalSuccessLoanAmountCount"]);
        while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["TotalSuccessLoanAmountCount"]))) {
          log.info('Iterating row ' + vars["count1"]);
          vars["SuccessLoanAmount"] = await bidRequestDetailsPage.All_Success_Loan_Amount_Textbid_request_details_tbl1(vars['count1']).textContent() || '';
          Methods.removeMultipleSpecialChars(['$', ','],vars["SuccessLoanAmount"], "SuccessLoanAmount");
          Methods.performArithmetic(vars["total"], 'ADDITION', vars["SuccessLoanAmount"], "total", 0);
          Methods.performArithmetic('1', 'ADDITION', vars["count1"], "count1", 0);
        }
        vars["BidValue(SFL,bid request details)"] = vars["total"];
        log.info('Total Bid Value (SFL, Bid Request Details): ' + vars["BidValue(SFL,bid request details)"]);
        log.stepPass('Total Bid Value calculated: ' + vars["BidValue(SFL,bid request details)"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to calculate total Bid Value from Success Loan Amount table');
        throw e;
      }

      log.step('Navigate to Price Offered screen and search by Bid Request ID');
      try {
        await expect(correspondentPortalPage.Commitments_Side_Menu).toBeVisible();
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByRole('heading', { name: 'Price Offered' })).toBeVisible();
        log.stepPass('Navigated to Price Offered screen and search completed for Request ID: ' + vars["RequestIDDetails"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Price Offered screen or search by Request ID');
        throw e;
      }

      log.step('Verify Price Offered record fields match Bid Request Details');
      try {
        await expect(priceOfferedPage.CCode1price_offered_standard).toContainText(vars["CCode(bid request details)"]);
        await expect(priceOfferedPage.First_bid_id).toContainText(vars["RequestID(bid request details)"]);
        await expect(priceOfferedPage.Company1price_offered_standard).toContainText(vars["Company(bid request details)"]);
        await expect(priceOfferedPage.Date_Price_Offered1price_offered_standard).toContainText(vars["RequestedDate(bid requests)"]);
        log.stepPass('CCode, Request ID, Company, and Date fields verified on Price Offered screen');
      } catch (e) {
        await log.stepFail(page, 'Field mismatch between Price Offered screen and Bid Request Details');
        throw e;
      }

      log.step('Verify Bid Value on Price Offered screen matches calculated total from Bid Request Details');
      try {
        vars["TotalBidValue(SFL)"] = await priceOfferedPage.Bid_Value1price_offered_standard.textContent() || '';
        Methods.removeMultipleSpecialChars(['$', ','],vars["TotalBidValue(SFL)"], "TotalBidValueResult(SFL,price offered)");
        Methods.trimtestdata(vars["TotalBidValueResult(SFL,price offered)"], "TotalBidValueResult(SFL,price offered)");
        expect(Methods.verifyString(vars["TotalBidValueResult(SFL,price offered)"], 'equals', vars["BidValue(SFL,bid request details)"]));
        log.info('Bid Value (Price Offered): ' + vars["TotalBidValueResult(SFL,price offered)"]);
        log.info('Bid Value (Bid Request Details): ' + vars["BidValue(SFL,bid request details)"]);
        log.stepPass('Bid Value matched: ' + vars["TotalBidValueResult(SFL,price offered)"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Bid Value on Price Offered screen against calculated total from Bid Request Details');
        throw e;
      }

      log.step('Verify Loans count, Execution Type, and Status on Price Offered screen');
      try {
        await expect(priceOfferedPage.Loans1price_offered_standard).toContainText(vars["SuccessLoan(SFL)"]);
        vars["ExecutionType(price offered)"] = await priceOfferedPage.Execution_Type1price_offered.textContent() || '';
        await Methods.verifyElementContainsTextIgnoreCase(priceOfferedPage.Execution_Type1price_offered, vars["ExecutionFlow(SFL)"]);
        await expect(priceOfferedPage.Status1price_offered_standard).toContainText(vars["Status(bid request details)"]);
        log.info('Execution Type (Price Offered): ' + vars["ExecutionType(price offered)"]);
        log.stepPass('Loans count, Execution Type, and Status verified on Price Offered screen');
      } catch (e) {
        await log.stepFail(page, 'Loans count, Execution Type, or Status mismatch on Price Offered screen');
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