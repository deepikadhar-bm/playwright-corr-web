import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';


const TC_ID = 'REG_TS10_TC04.2';
const TC_TITLE = 'Verify the loan details popup view present in the "Locked/Committed" loans - Should be same as present in all loans. Also verify the search / clear search actions';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Login to CORR portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to CORR portal successful');
      } catch (e) {
        log.stepFail(page, 'Failed to login to CORR portal');
        throw e;
      }

      log.step('Navigate to Locked/Committed loans');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await priceOfferedPage.Price_Offered_Text.waitFor({ state: 'visible' });
        expect(priceOfferedPage.Price_Offered_Text).toBeVisible();
        await priceOfferedPage.BidReqIDPartially_Committed_or_Committed.first().click();
        await priceOfferedPage.LockedCommitted_Loans.click();
        await correspondentPortalPage.Paste_Loans_Button1.waitFor({ state: 'hidden' });
        expect(correspondentPortalPage.Paste_Loans_Button1).not.toBeVisible();
        log.stepPass('Navigated to Locked/Committed Loans tab');
      } catch (e) {
        log.stepFail(page, 'Failed to navigate to Locked/Committed Loans');
        throw e;
      }

      log.step('Opening loan details popup and capturing Chase field name and value');
      try {
        await correspondentPortalPage.First_Corr_Loan.first().click();
        vars['ChaseFieldName'] = await priceOfferedPage.First_Chase_Field_Name.first().textContent() || '';
        // vars['ExpectedChaseFieldName'] = String(vars['ChaseFieldName']).substring(1);
        Methods.trimtestdata(vars['ChaseFieldName'],"ExpectedChaseFieldName");
        vars['ChaseValue'] = await correspondentPortalPage.First_Chase_Value.first().textContent() || '';
        Methods.trimWhitespace(vars['ChaseValue'], 'ExpectedChaseValue');
        log.info('ExpectedChaseFieldName: ' + vars['ExpectedChaseFieldName']);
        log.info('ExpectedChaseValue: ' + vars['ExpectedChaseValue']);
        log.stepPass('Loan details popup opened and Chase field data captured');
      } catch (e) {
        log.stepFail(page, 'Failed to open loan details popup or capture Chase field data');
        throw e;
      }

      log.step('Searching for Chase field and verifying filtered result');
      try {
        await correspondentPortalPage.Search_Fields_Input.click();
        await correspondentPortalPage.Search_Fields_Input.fill(vars['ExpectedChaseFieldName']);
        vars['ChaseFieldCount'] = String(await bidRequestDetailsPage.ChaseFields_Count_Popup_Loan_Details.count());
        expect(Methods.verifyComparison(vars['ChaseFieldCount'],"==","1"));
        await expect(priceOfferedPage.Loan_Term_Chase_Field_Name).toContainText(vars['ExpectedChaseFieldName']);
        await expect(correspondentPortalPage.First_Chase_Value).toContainText(vars['ExpectedChaseValue']);
        log.stepPass('Search filtered correctly Field count: ' + vars['ChaseFieldCount']);
      } catch (e) {
        log.stepFail(page, 'Search verification failed for Chase field');
        throw e;
      }

      log.step('Clearing search and verifying field count resets');
      try {
        await correspondentPortalPage.Search_Fields_Input.click();
        await correspondentPortalPage.Search_Fields_Input.clear();
        vars['ChaseFieldCount'] = String(await bidRequestDetailsPage.ChaseFields_Count_Popup_Loan_Details.count());
        expect(Methods.verifyComparison(vars['ChaseFieldCount'],">","1"));
        log.stepPass('Search cleared and field count verified: ' + vars['ChaseFieldCount']);
      } catch (e) {
        log.stepFail(page, 'Clear search verification failed');
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