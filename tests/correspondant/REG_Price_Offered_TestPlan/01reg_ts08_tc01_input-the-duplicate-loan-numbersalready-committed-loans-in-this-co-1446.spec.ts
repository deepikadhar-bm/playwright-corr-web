import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { PriceOffredPage } from '../../../src/pages/correspondant/price-offred';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'REG_TS08_TC01';
const TC_TITLE = 'Input the duplicate loan numbers[Already committed loans in this company] and verify that the error message should be displayed and user should not be able to proceed further';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let priceOffredPage: PriceOffredPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const crederntials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    priceOffredPage = new PriceOffredPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  const profileName = 'Price Offered';
  const profile = testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    vars["Username"] = crederntials.username;
    vars["Password"] = crederntials.password;
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Reading test data and login to CORR portal');
      try {
        if (profile && profile.data) {
          vars["RequestIDCreated3rdScenario"] = profile.data[0]['RequestIDCreated3rdScenario'];
          log.info('RequestIDCreated3rdScenario: ' + vars["RequestIDCreated3rdScenario"]);
        }
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login successful');
      } catch (e) {
        log.stepFail(page, 'Failed to login to CORR portal');
        throw e;
      }

      log.step('Navigating to Price Offered and searching by Bid Request ID');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["RequestIDCreated3rdScenario"]);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["BidReqId"] = vars["RequestIDCreated3rdScenario"];
        await priceOfferedPage.BidRequestIDPrice_Offered_New(vars["BidReqId"]).waitFor({ state: 'visible' });
        await priceOfferedPage.BidRequestIDPrice_Offered_New(vars["BidReqId"]).click();
        await priceOfferedPage.Committed_Loan.first().waitFor({ state: 'visible' });
        vars["CommittedLoanNumber"] = await priceOfferedPage.Committed_Loan.first().textContent() || '';
        log.stepPass('Navigated to Price Offered. Committed Loan Number: ' + vars["CommittedLoanNumber"]);
      } catch (e) {
        log.stepFail(page, 'Failed to navigate to Price Offered');
        throw e;
      }

      log.step('Pasting duplicate loan number and validating error message');
      try {
        await correspondentPortalPage.Paste_Loans_Button1.click();
        await correspondentPortalPage.Paste_loan_numbers_here1.waitFor({ state: 'visible' });
        await correspondentPortalPage.Paste_loan_numbers_here1.click();
        await correspondentPortalPage.Paste_loan_numbers_here1.fill(vars["CommittedLoanNumber"]);
        await priceOfferedPage.Validate_Button_Paste_loan_popup.waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Validate_Button_Paste_loan_popup).toBeVisible();
        await priceOfferedPage.Validate_Button_Paste_loan_popup.click();
        await expect(priceOfferedPage.Duplicate_Loan).toBeVisible();
        vars["LoanNumberPopup"] = await correspondentPortalPage.Paste_loan_numbers_here1.textContent() || '';
        expect(Methods.verifyString(vars["LoanNumberPopup"], "equals", vars["CommittedLoanNumber"]));
        await expect(priceOfferedPage.Loan_Number_Text).toHaveCSS('color', 'rgb(255, 0, 0)');
        log.info("Successfully verified the Loan Number Text color")
        await expect(priceOfferedPage.Error_Found_Text).toContainClass("text-danger");
        await expect(priceOfferedPage.Error_Found_Text).toHaveCSS('color', 'rgb(220, 53, 69)');
        log.info("Successfully verified the Error Found Text color")
        await expect(page.getByText('1 Errors Found')).toBeVisible({ timeout: 60000 });
        await expect(priceOfferedPage.Duplicate_Loan).toBeVisible();
        vars["DuplicateLoanNumberPopup"] = await priceOffredPage.Duplicate_Loan_Number.textContent() || '';
        expect(Methods.verifyString(vars["CommittedLoanNumber"], "equals", vars["DuplicateLoanNumberPopup"]));
        log.stepPass('Duplicate loan error displayed and verified for loan: ' + vars["CommittedLoanNumber"]);
      } catch (e) {
        log.stepFail(page, 'Failed to verify duplicate loan error message');
        throw e;
      }

      log.step('Removing errors and closing popup');
      try {
        await priceOfferedPage.Remove_errors_and_continue_Checkbox.check();
        await expect(correspondentPortalPage.Add_to_Commit).toBeVisible();
        await priceOfferedPage.CloseButtonPopup.click();
        log.stepPass('Errors removed and popup closed successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to remove errors and close popup');
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