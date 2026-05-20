import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedDetailsPage } from '../../../src/pages/correspondant/price-offered-details';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';


const TC_ID = 'REG_TS10_TC04.1';
const TC_TITLE = 'Verify the loan details popup view present in the "Locked/Committed" loans - Should be same as present in all loans. Also verify the search / clear search actions';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedDetailsPage: PriceOfferedDetailsPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const crederntials = ENV.getCredentials('internal');


  test.beforeEach(async ({ page }) => {
    vars = {};
    vars["Username"] = crederntials.username;
    vars["Password"] = crederntials.password;
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedDetailsPage = new PriceOfferedDetailsPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Login to CORR Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);

        log.stepPass('Successfully logged in to CORR Portal');
      } catch (e) {
        log.stepFail(page, 'Failed to login CORR Portal');
        throw e;
      }

      log.step('Navigate to price offered page and store Partially Committed or Committed bid');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["BidRequestID"] = await priceOfferedPage.BidReqIDPartially_Committed_or_Committed.first().textContent() || '';
        Methods.trimtestdata(vars["BidRequestID"], 'BidRequestID');
        log.info('BidRequest ID Partially Committed or Committed: ' + vars['BidRequestID']);
        await priceOfferedPage.BidRequesIdPartially_or_Committed(vars['BidRequestID']).click();
        await priceOfferedDetailsPage.Locked_Loan_Num_Price_Offered_details.first().waitFor({ state: 'visible' });
        vars["CommittedLoanNum"] = await priceOfferedDetailsPage.Locked_Loan_Num_Price_Offered_details.first().textContent() || '';
        Methods.trimtestdata(vars["CommittedLoanNum"], 'CommittedLoanNum');
        log.info('CommittedLoanNum: ' + vars['CommittedLoanNum']);
        log.stepPass('Navigated into price offered page and stored the Partially Committed or Committed bid successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to navigate into price offered page or store the Partially Committed or Committed bid');
        throw e;
      }

      log.step('Open loan details popup from All Loans tab and capture popup values');
      try {
        await priceOfferedDetailsPage.Locked_Loan_Num_Price_Offered_details.first().click();
        vars["BidRequestIdAllLoans"] = await priceOfferedPage.BidReqIdLoan_Details_Popup.textContent() || '';
        Methods.trimtestdata(vars["BidRequestIdAllLoans"], 'BidRequestIdAllLoans');
        log.info('BidRequestIdAllLoans: ' + vars['BidRequestIdAllLoans']);
        vars["BidLoanNumAllLoans"] = await priceOfferedPage.Bid_Loan_NumLoan_Details_Popup.textContent() || '';
        Methods.trimtestdata(vars["BidLoanNumAllLoans"], 'BidLoanNumAllLoans');
        log.info('BidLoanNumAllLoans: ' + vars['BidLoanNumAllLoans']);
        vars["ErrorsCheckAllLoans"] = await priceOfferedPage.Errors_CheckLoan_Details_Popup.textContent() || '';
        Methods.trimtestdata(vars["ErrorsCheckAllLoans"], 'ErrorsCheckAllLoans');
        log.info('ErrorsCheckAllLoans: ' + vars['ErrorsCheckAllLoans']);
        log.stepPass('Loan details popup values captured from All Loans tab successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to capture loan details popup values from All Loans tab');
        throw e;
      }

      log.step('Store additional loan popup details from All Loans tab');
      try {
        await stepGroups.stepGroup_Storing_Loan_Popup_Details_From_All_Loans_Tab_in_to_the_tdp_(page, vars);
        log.stepPass('Additional loan popup details stored from All Loans tab successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to store loan popup details from All Loans tab');
        throw e;
      }

      log.step('Navigate to Locked/Committed Loans tab and open loan details popup');
      try {
        await priceOfferedPage.LockedCommitted_Loans_2.click();
        await expect(priceOfferedPage.Paste_Loans_ButtonPrice_Offered_Page).not.toBeVisible();
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).not.toBeVisible();
        await priceOfferedPage.Bid_Loan_Num_Committed_Loans(vars['BidLoanNumAllLoans']).click();
        log.stepPass('Navigated to Locked/Committed Loans tab and opened loan details popup successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to navigate to Locked/Committed Loans tab or open loan details popup');
        throw e;
      }

      log.step('Verify loan details popup values in Locked/Committed tab match All Loans tab values');
      try {
        await expect(priceOfferedPage.BidReqIdLoan_Details_Popup).toContainText(vars["BidRequestIdAllLoans"]);
        await expect(priceOfferedPage.Bid_Loan_NumLoan_Details_Popup).toContainText(vars["BidLoanNumAllLoans"]);
        await expect(priceOfferedPage.Errors_CheckLoan_Details_Popup).toContainText(vars["ErrorsCheckAllLoans"]);
        log.info('BidRequestIdAllLoans verified: ' + vars['BidRequestIdAllLoans']);
        log.info('BidLoanNumAllLoans verified: ' + vars['BidLoanNumAllLoans']);
        log.info('ErrorsCheckAllLoans verified: ' + vars['ErrorsCheckAllLoans']);
        log.stepPass('Loan details popup values match between Locked/Committed tab and All Loans tab');
      } catch (e) {
        log.stepFail(page, 'Loan details popup values mismatch between Locked/Committed tab and All Loans tab');
        throw e;
      }

      log.step('Verify full loan popup details from Locked Loans tab');
      try {
        await stepGroups.stepGroup_Verification_of_Loan_Pop_up_Details_From_Locked_Loans_Tab_Pr(page, vars);
        log.stepPass('Full loan popup details verified from Locked Loans tab successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to verify full loan popup details from Locked Loans tab');
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