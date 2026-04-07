import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS08_TC04';
const TC_TITLE = 'Input the duplicate, unidentified and fresh loan number and verify the error messages should be displayed and also user should be allowed to proceed with commit action since it contains valid loan';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    bidRequestsPage = new BidRequestsPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  const profileName = 'Price Offered';
  const profile = testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      if (profile && profile.data) {
        vars['RequestIDCreated3rdScenario'] = profile.data[0]['RequestIDCreated3rdScenario'];
        log.info('RequestIDCreated3rdScenario: ' + vars['RequestIDCreated3rdScenario']);
      }
      log.step('Login to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Logged in to Correspondent Portal');
      } catch (e) {
        await log.stepFail(page, 'Failed to login to Correspondent Portal');
        throw e;
      }

      log.step('Navigate to Price Offered List and open bid request');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.waitFor({ state: 'visible' });
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['RequestIDCreated3rdScenario']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.First_bid_id.click();
        log.stepPass('Navigated to Price Offered List and opened bid: ' + vars['RequestIDCreated3rdScenario']);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Price Offered List or open bid: ' + vars['RequestIDCreated3rdScenario']);
        throw e;
      }

      log.step('Capture committed, fresh and unidentified loan numbers');
      try {
        vars['CommittedLoanNumber'] = await priceOfferedPage.First_Comitted_loan_Number.first().textContent() || '';
        Methods.removeCharactersFromPosition(vars['CommittedLoanNumber'], '0', '10', 'CommittedLoanNumber');
        log.info('CommittedLoanNumber: ' + vars['CommittedLoanNumber']);
        vars['FreshLoanNumber'] = await priceOfferedPage.First_Loan_Num_Price_offered.first().textContent() || '';
        Methods.trimtestdata(vars['FreshLoanNumber'], 'FreshLoanNumber');
        log.info('FreshLoanNumber: ' + vars['FreshLoanNumber']);
        Methods.removeCharactersFromPosition(vars['FreshLoanNumber'], '0', '5', 'UnidentifiedLoanNumber');
        log.info('UnidentifiedLoanNumber: ' + vars['UnidentifiedLoanNumber']);
        Methods.concatenateWithSpecialChar(vars['CommittedLoanNumber'], vars['FreshLoanNumber'], ',', 'CommittedFreshLoan');
        Methods.concatenateWithSpecialChar(vars['CommittedFreshLoan'], vars['UnidentifiedLoanNumber'], ',', 'CommittedFreshUnidentifiedLoan');
        log.info('CommittedFreshUnidentifiedLoan: ' + vars['CommittedFreshUnidentifiedLoan']);
        log.stepPass('Successfully stored the required loan numbers');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture loan numbers');
        throw e;
      }

      log.step('Paste combined loan numbers and validate — verify 2 errors found');
      try {
        await correspondentPortalPage.Paste_Loans_Button1.click();
        await correspondentPortalPage.Paste_loan_numbers_here1.fill(vars['CommittedFreshUnidentifiedLoan']);
        await priceOfferedPage.Validate_Button_Paste_loan_popup.click();
        await expect(correspondentPortalPage.Errors_Foundred_text_danger).toBeVisible();
        await expect(correspondentPortalPage.Errors_Foundred_text_danger).toContainText('2 Errors Found');
        await expect(correspondentPortalPage.Errors_Foundred_text_danger).toContainClass('text-danger');
        log.stepPass('2 Errors Found displayed as expected');
      } catch (e) {
        await log.stepFail(page, 'Error count mismatch or errors not displayed in popup');
        throw e;
      }

      log.step('Verify committed and unidentified loan numbers shown in errors found popup');
      try {
        await expect(priceOfferedPage.Duplicate_Loanerrors_found_popup).toContainText(vars['CommittedLoanNumber']);
        vars['CommittedLoanNumberFromPopup'] = await priceOfferedPage.Duplicate_Loanerrors_found_popup.textContent() || '';
        Methods.trimtestdata(vars['CommittedLoanNumberFromPopup'], 'CommittedLoanNumberFromPopup');
        log.info('CommittedLoanNumber (table): ' + vars['CommittedLoanNumber']);
        log.info('CommittedLoanNumber (popup): ' + vars['CommittedLoanNumberFromPopup']);
        Methods.verifyString(vars['CommittedLoanNumber'], 'equals', vars['CommittedLoanNumberFromPopup']);
        await expect(priceOfferedPage.Unidentified_Loanerrors_found_popup).toContainText(vars['UnidentifiedLoanNumber']);
        vars['UnidentifiedLoanNumberFromPopup'] = await priceOfferedPage.Unidentified_Loanerrors_found_popup.textContent() || '';
        Methods.trimtestdata(vars['UnidentifiedLoanNumberFromPopup'], 'UnidentifiedLoanNumberFromPopup');
        log.info('UnidentifiedLoanNumber (popup): ' + vars['UnidentifiedLoanNumberFromPopup']);
        Methods.verifyString(vars['UnidentifiedLoanNumber'], 'equals', vars['UnidentifiedLoanNumberFromPopup']);
        log.stepPass('Committed and unidentified loan numbers verified in errors popup');
      } catch (e) {
        await log.stepFail(page, 'Loan number mismatch in errors popup');
        throw e;
      }

      log.step('Verify error color for unidentified loan, verify class and title attributes');
      try {
        await Methods.getCSSProperty(priceOfferedPage.Unidentified_Loantext_box_popup(vars['UnidentifiedLoanNumberFromPopup']), 'color', 'ColorValueUnidentifiedLoan');
        log.info('ColorValueUnidentifiedLoan : ' + vars['ColorValueUnidentifiedLoan']);
        if (String(vars['ColorValueUnidentifiedLoan']) === 'rgb(255, 0, 0)') {
          vars['ColorValueUnidentifiedLoan'] = 'red';
        } 
        // else {
        //   vars['ColorValueUnidentifiedLoan'] = 'othercolor';
        // }
        log.info('ColorValueUnidentifiedLoan: ' + vars['ColorValueUnidentifiedLoan']);
        Methods.verifyString(vars['ColorValueUnidentifiedLoan'], 'equals', 'red');
        await expect(priceOfferedPage.Unidentified_Loantext_box_popup(vars['UnidentifiedLoanNumberFromPopup'])).toHaveClass('error-loan');
        log.stepPass('Unidentified loan color is red and title is error-loan');
      } catch (e) {
        await log.stepFail(page, 'Unidentified loan color or title verification failed');
        throw e;
      }

      log.step('Verify error color for duplicate loan, verify class and title attributes');
      try {
        await Methods.getCSSProperty(priceOfferedPage.Duplicate_Loantext_box_popup(vars['CommittedLoanNumberFromPopup']), 'color', 'ColorValueDuplicateLoan');
        log.info('ColorValueDuplicateLoan : ' + vars['ColorValueDuplicateLoan']);
        if (String(vars['ColorValueDuplicateLoan']) === 'rgb(255, 0, 0)') {
          vars['ColorValueDuplicateLoan'] = 'red';
        }
        //  else {
        //   vars['ColorValueDuplicateLoan'] = 'othercolor';
        // }
        log.info('ColorValueDuplicateLoan: ' + vars['ColorValueDuplicateLoan']);
        Methods.verifyString(vars['ColorValueDuplicateLoan'], 'equals', 'red');
        await expect(priceOfferedPage.Duplicate_Loantext_box_popup(vars['CommittedLoanNumberFromPopup'])).toHaveClass('error-loan');
        log.stepPass('Duplicate loan color is red and title is error-loan');
      } catch (e) {
        await log.stepFail(page, 'Duplicate loan color or title verification failed');
        throw e;
      }

      log.step('Verify fresh loan color is black (no error)');
      try {
        await Methods.getCSSProperty(priceOfferedPage.color_text, 'color', 'ColorValueFreshLoan');
        log.info('ColorValueFreshLoan : ' + vars['ColorValueFreshLoan']);
        if (String(vars['ColorValueFreshLoan']) === 'rgb(33, 37, 41)') {
          vars['ColorValueFreshLoan'] = 'black';
        } 
        // else {
        //   vars['ColorValueFreshLoan'] = 'othercolor';
        // }
        log.info('ColorValueFreshLoan: ' + vars['ColorValueFreshLoan']);
        Methods.verifyString(vars['ColorValueFreshLoan'], 'equals', 'black');
        log.stepPass('Fresh loan color is black — no error');
      } catch (e) {
        await log.stepFail(page, 'Fresh loan color verification failed');
        throw e;
      }

      log.step('Check remove errors and continue, then add to commit and verify fresh loan selected');
      try {
        await expect(priceOfferedPage.Remove_errors_and_continue_Checkbox).toBeVisible();
        await priceOfferedPage.Remove_errors_and_continue_Checkbox.check();
        await expect(priceOfferedPage.Remove_errors_and_continue_Checkbox).toBeChecked();
        await expect(chaseFieldNamePage.Add_to_Commit_Buttonpaste_loan_popup).toContainText(appconstants.ADD_TO_COMMIT_TEXT);
        await expect(chaseFieldNamePage.Add_to_Commit_Buttonpaste_loan_popup).toBeEnabled();
        await chaseFieldNamePage.Add_to_Commit_Buttonpaste_loan_popup.click();
        Methods.concatenateWithSpecialChar(vars['CommittedLoanNumber'], vars['FreshLoanNumber'], ',', 'CommittedFreshLoan');
        await expect(priceOfferedPage.Fresh_Loan_Num_Price_Offered_after_Error_check(vars['FreshLoanNumber'])).toContainText(vars['FreshLoanNumber']);
        await expect(priceOfferedPage.Selected_loan_Checkboxprice_offered_screen.first()).toBeVisible();
        await expect(priceOfferedPage.Selected_loan_Checkboxprice_offered_screen.first()).toBeChecked();
        await expect(priceOfferedPage.Commit_Selected_Count_Footer_Displayprice_offered).toContainText(appconstants.ONE);
        log.stepPass('Remove errors checked, added to commit and fresh loan selected with count 1');
      } catch (e) {
        await log.stepFail(page, 'Failed to remove errors and proceed with commit or fresh loan not selected');
        throw e;
      }

      log.step('Paste fresh loan only, validate and verify no errors — Add to Commit button visible');
      try {
        await correspondentPortalPage.Paste_Loans_Button1.click();
        await correspondentPortalPage.Paste_loan_numbers_here1.fill(vars['FreshLoanNumber']);
        await priceOfferedPage.Validate_Button_Paste_loan_popup.click();
        await expect(priceOfferedPage.Remove_errors_and_continue_Checkbox).not.toBeVisible();
        await expect(chaseFieldNamePage.Add_to_Commit_Buttonpaste_loan_popup).toBeEnabled();
        log.stepPass('Fresh loan validated — Add to Commit button visible with no blocking errors');
      } catch (e) {
        await log.stepFail(page, 'Fresh loan validation failed or Add to Commit button not visible');
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