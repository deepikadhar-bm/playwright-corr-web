import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'REG_TS08_TC02';
const TC_TITLE = 'Input the Unidentified loan numbers and verify that the error message should be displayed and user should not be able to proceed further';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const crederntials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
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
          vars["RequestIDCreated1stScenario"] = profile.data[0]['RequestIDCreated1stScenario'];
          log.info('RequestIDCreated1stScenario: ' + vars["RequestIDCreated1stScenario"]);
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
        vars["BidReqID"] = vars["RequestIDCreated1stScenario"];
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["RequestIDCreated1stScenario"]);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.First_bid_id.click();
        vars["BidLoanNumber(Loan Details)"] = await priceOfferedPage.Corr_Loan_Number_ID.first().textContent() || '';
        Methods.removeCharactersFromPosition(vars["BidLoanNumber(Loan Details)"],"0","9","BidLoanNumber");
        log.stepPass('Navigated to Price Offered. Bid Loan Number: ' + vars["BidLoanNumber"]);
      } catch (e) {
        log.stepFail(page, 'Failed to navigate to Price Offered');
        throw e;
      }

      log.step('Pasting unidentified loan number and verifying error message');
      try {
        await priceOfferedPage.Paste_Loans_ButtonPrice_Offered_Page.click();
        await correspondentPortalPage.Paste_loan_numbers_here1.fill(vars["BidLoanNumber"]);
        await priceOfferedPage.Validate_ButtonPrice_Offered_Page.click();
        await expect(priceOfferedPage.Errors_Found_Loan_error).toBeVisible();
        await expect(priceOfferedPage.Unidentified_Loan_Text).toBeVisible();
        await expect(priceOfferedPage.Loan_Number_Text).toHaveCSS('color', "rgb(255, 0, 0)");
        await expect(priceOfferedPage.Error_Found_Text).toContainClass("text-danger");
        await expect(priceOfferedPage.Error_Found_Text).toHaveCSS('color', 'rgb(220, 53, 69)');
        vars["UnidentifiedLoanNumber"] = await priceOfferedPage.Unidentified_Loan_Number.textContent() || '';
        expect(Methods.verifyString(vars["BidLoanNumber"],"equals",vars["UnidentifiedLoanNumber"]));
        log.stepPass('Unidentified loan error displayed and verified for loan: ' + vars["BidLoanNumber"]);
      } catch (e) {
        log.stepFail(page, 'Failed to verify unidentified loan error message');
        throw e;
      }

      log.step('Removing errors and closing popup');
      try {
        await priceOfferedPage.Remove_errors_and_continue_Checkbox.check();
        await expect(chaseFieldNamePage.Add_to_Commit_Buttonpaste_loan_popup).toBeVisible();
        await correspondentPortalPage.close_pop_up_bid_request_details.click();
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