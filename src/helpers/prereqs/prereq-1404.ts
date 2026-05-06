import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BidRequestDetailsPage } from '../../pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../pages/correspondant/bid-request';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1389 } from './prereq-1389';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { AddonHelpers } from '@helpers/AddonHelpers';


const TC_ID = 'PREREQ_1404(REG_TS02_TC02)';
const TC_TITLE = 'Verify that bid records data are displayed in the Price Offered screen once their status is updated to "Price Offered"';

export async function runPrereq_1404(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1389(page, vars);
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const bidRequestPage = new BidRequestPage(page);
  const bidRequestsPage = new BidRequestsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);
  const Methods = new AddonHelpers(page, vars);
  const profileName = 'Price Offered';


  log.tcStart(TC_ID, TC_TITLE);
  try {
    log.step('search for bid request');
    try {
      await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
      testDataManager.updateProfileData(profileName, { 'RequestIDCreated2ndScenario': vars['RequestIDDetails'] });
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['RequestIDDetails']);
      await page.keyboard.press('Enter');
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      vars['RequestedDate(bid requests)'] = await bidRequestPage.First_Requested_Date.first().textContent() || '';
      Methods.trimtestdata(vars['RequestedDate(bid requests)'], 'RequestedDate(bid requests)');
      log.info('Requested Date (bid requests): ' + vars['RequestedDate(bid requests)']);
      log.stepPass('Bid request search completed');
    } catch (e) {
      await log.stepFail(page, 'Failed to search for bid request: ' + vars['RequestIDDetails']);
      throw e;
    }

    log.step('Navigate to Bid Request Details and capture data');
    try {
      await correspondentPortalPage.First_Bid_Request_ID.first().click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(page.getByText("Bid Request Details")).toBeVisible();
      vars['CCode(bid request details)'] = await correspondentPortalPage.CCode_Valuebid_request_details.first().textContent() || '';
      // Methods.trimtestdata(vars['CCode(bid request details)'], 'CCode(bid request details)');
      log.info('CCode: ' + vars['CCode(bid request details)']);
      vars['Company(bid request details)'] = await bidRequestDetailsPage.Company_ValueBid_Request_Details.first().textContent() || '';
      Methods.removeCharactersFromPosition(vars['Company(bid request details)'], '1', '1', 'Company(bid request details)');
      log.info('Company: ' + vars['Company(bid request details)']);
      vars['RequestID(bid request details)'] = await bidRequestDetailsPage.Request_Id_From_Details.first().textContent() || '';
      log.info('Request ID: ' + vars['RequestID(bid request details)']);
      Methods.trimtestdata(vars['RequestID(bid request details)'], 'RequestID(bid request details)');
      vars['Status(bid request details)'] = await bidRequestDetailsPage.Statusbid_request_details.first().textContent() || '';
      Methods.trimtestdata(vars['Status(bid request details)'], 'Status(bid request details)');
      log.info('Status: ' + vars['Status(bid request details)']);
      log.stepPass('Bid Request Details captured successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to capture Bid Request Details');
      throw e;
    }

    log.step('Iterate through execution type rows and calculate total success loan amounts');
    try {
      vars['count'] = appconstants.ONE;
      vars['TotalRows'] = String(await bidRequestDetailsPage.Common_Execution_Type_Rowsbid_requests_details.count());
      log.info('Total execution type rows: ' + vars['TotalRows']);
      while (parseFloat(String(vars['count'])) <= parseFloat(String(vars['TotalRows']))) {
        log.info('Iteration Table:' + vars['count']);
        vars['ExecutionType'] = await bidRequestDetailsPage.ExecutionTypebid_requests_details_counter(vars['count']).first().textContent() || '';
        log.info('Execution Type:' + vars['ExecutionType']);
        if (String(vars['ExecutionType']).includes(String('Chase'))) {
          vars['SuccessLoan(CD)'] = await bidRequestDetailsPage.Heading_Successful_Loans_4.textContent() || '';
          Methods.trimtestdata(vars['SuccessLoan(CD)'], 'SuccessLoan(CD)');
          vars['count1'] = appconstants.ONE;
          vars['total'] = appconstants.ZERO;
          vars['TotalSuccessLoanAmountCount'] = String(await bidRequestDetailsPage.Success_Loan_Amountbid_request_details_table2.count());
          while (parseFloat(String(vars['count1'])) <= parseFloat(String(vars['TotalSuccessLoanAmountCount']))) {
            vars['SuccessLoanAmount'] = await bidRequestDetailsPage.All_Success_Loan_Amount_Textbid_request_details_tbl1(vars['count1']).textContent() || '';
            Methods.removeMultipleSpecialChars(['$', ','], vars['SuccessLoanAmount'], 'SuccessLoanAmount');
            Methods.performArithmetic(vars['total'], 'ADDITION', vars['SuccessLoanAmount'], 'total', 0);
            Methods.performArithmetic('1', 'ADDITION', vars['count1'], 'count1', 0);
          }
          vars['TotalSumOfSuccessLoanAmount(chase bid request details)'] = vars['total'];
          log.info('Chase total success loan amount: ' + vars['TotalSumOfSuccessLoanAmount(chase bid request details)']);
        } else if (String(vars['ExecutionType']).includes(String(appconstants.STANDARD_TEXT))) {
          vars['SuccessLoan(SFL)'] = await bidRequestDetailsPage.Success_Loansfl_bid_request_details.textContent() || '';
          Methods.trimtestdata(vars['SuccessLoan(SFL)'], 'SuccessLoan(SFL)');
          vars['count1'] = appconstants.ONE;
          vars['total'] = appconstants.ZERO;
          vars['TotalSuccessLoanAmountCount'] = String(await bidRequestDetailsPage.Total_Success_Loantable1_bid_request_details.count());
          while (parseFloat(String(vars['count1'])) <= parseFloat(String(vars['TotalSuccessLoanAmountCount']))) {
            vars['SuccessLoanAmount'] = await bidRequestDetailsPage.All_Success_Loan_Amount_Textbid_request_details_tbl1(vars['count1']).textContent() || '';
            Methods.removeMultipleSpecialChars(['$', ','], vars['SuccessLoanAmount'], 'SuccessLoanAmount');
            Methods.performArithmetic(vars['total'], 'ADDITION', vars['SuccessLoanAmount'], 'total', 0);
            Methods.performArithmetic('1', 'ADDITION', vars['count1'], 'count1', 0);
          }
          vars['TotalSumOfSuccessLoanAmount(standard bid requests details)'] = vars['total'];
          log.info('Standard total success loan amount: ' + vars['TotalSumOfSuccessLoanAmount(standard bid requests details)']);
        }
        Methods.performArithmetic('1', 'ADDITION', vars['count'], 'count', 0);
      }
      log.stepPass('Execution type rows iterated and loan amounts calculated');
    } catch (e) {
      await log.stepFail(page, 'Failed to iterate execution type rows or calculate loan amounts');
      throw e;
    }

    log.step('Navigate to Price Offered screen and search by Bid Request ID');
    try {
      await correspondentPortalPage.Commitments_Side_Menu.click();
      await correspondentPortalPage.Price_Offered_List_Dropdown.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['RequestIDDetails']);
      await page.keyboard.press('Enter');
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.info('Navigated to Price Offered screen and searched for: ' + vars['RequestIDDetails']);
      log.stepPass('Price Offered screen loaded and bid request searched');
    } catch (e) {
      await log.stepFail(page, 'Failed to navigate to Price Offered screen');
      throw e;
    }

    log.step('Verify Price Offered screen data matches Bid Request Details for each execution type');
    try {
      vars['count'] = appconstants.ONE;
      vars['AllRowsCount'] = String(await priceOfferedPage.All_Bid_Request_ID_Rowsprice_offered_screen1.count());
      log.info('Total rows in Price Offered screen: ' + vars['AllRowsCount']);
      while (parseFloat(String(vars['count'])) <= parseFloat(String(vars['AllRowsCount']))) {
        vars['ExecutionType1(price offered screen)'] = await priceOfferedPage.All_Execution_Typeprice_offered_screen1(vars['count']).textContent() || '';
        if (String(vars['ExecutionType1(price offered screen)']).includes(String('CHASE'))) {
          log.info('Verifying CHASE row at count: ' + vars['count']);
          await expect(priceOfferedPage.CCode1price_offered(vars['count'])).toContainText(vars['CCode(bid request details)']);
          await expect(priceOfferedPage.All_Bid_Request_ID2price_offered_screen1(vars['count'])).toContainText(vars['RequestID(bid request details)']);
          await expect(priceOfferedPage.Company1price_offered(vars['count'])).toContainText(vars['Company(bid request details)']);
          await expect(priceOfferedPage.Date_Price_Offered1price_offered(vars['count'])).toContainText(vars['RequestedDate(bid requests)']);
          vars['TotalLoanAmountChase'] = await priceOfferedPage.Bid_Value1price_offered(vars['count']).textContent() || '';
          Methods.removeMultipleSpecialChars(['$', ','], vars['TotalLoanAmountChase'], 'TotalLoanAmountChasePriceOffered');
          Methods.trimtestdata(vars['TotalLoanAmountChasePriceOffered'], 'TotalLoanAmountChasePriceOffered');
          log.info('Chase bid value (Price Offered): ' + vars['TotalLoanAmountChasePriceOffered']);
          Methods.verifyString(vars['TotalLoanAmountChasePriceOffered'], 'equals', vars['TotalSumOfSuccessLoanAmount(chase bid request details)']);
          await expect(priceOfferedPage.Loansprice_offered(vars['count'])).toContainText(vars['SuccessLoan(CD)']);
          await expect(priceOfferedPage.Status1price_offered(vars['count'])).toContainText(vars['Status(bid request details)']);
        } else if (String(vars['ExecutionType1(price offered screen)']).includes(String('STANDARD'))) {
          log.info('Verifying STANDARD row at count: ' + vars['count']);
          await expect(priceOfferedPage.CCode1price_offered(vars['count'])).toContainText(vars['CCode(bid request details)']);
          await expect(priceOfferedPage.All_Bid_Request_ID2price_offered_screen1(vars['count'])).toContainText(vars['RequestID(bid request details)']);
          await expect(priceOfferedPage.Company1price_offered(vars['count'])).toContainText(vars['Company(bid request details)']);
          await expect(priceOfferedPage.Date_Price_Offered1price_offered(vars['count'])).toContainText(vars['RequestedDate(bid requests)']);
          vars['TotalLoanAmountStandard'] = await priceOfferedPage.Bid_Value1price_offered(vars['count']).textContent() || '';
          Methods.removeMultipleSpecialChars(['$', ','], vars['TotalLoanAmountStandard'], 'TotalLoanAmountStandardPriceOffered');
          Methods.trimtestdata(vars['TotalLoanAmountStandardPriceOffered'], 'TotalLoanAmountStandardPriceOffered');
          log.info('Standard bid value (Price Offered): ' + vars['TotalLoanAmountStandardPriceOffered']);
          Methods.verifyString(vars['TotalLoanAmountStandardPriceOffered'], 'equals', vars['TotalSumOfSuccessLoanAmount(standard bid requests details)']);
          await expect(priceOfferedPage.Loansprice_offered(vars['count'])).toContainText(vars['SuccessLoan(SFL)']);
          await expect(priceOfferedPage.Status1price_offered(vars['count'])).toContainText(vars['Status(bid request details)']);
        }
        Methods.performArithmetic('1', 'ADDITION', vars['count'], 'count', 0);
      }
      log.stepPass('Price Offered screen data verified successfully for all rows');
    } catch (e) {
      await log.stepFail(page, 'Price Offered screen data verification failed');
      throw e;
    }

    log.tcEnd('PASS');

  } catch (e) {
    await log.captureOnFailure(page, TC_ID, e);
    log.tcEnd('FAIL');
    throw e;
  }
}