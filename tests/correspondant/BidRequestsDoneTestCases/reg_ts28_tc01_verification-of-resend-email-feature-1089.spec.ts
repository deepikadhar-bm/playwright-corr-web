// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidrequestPage } from '../../../src/pages/correspondant/bidrequest';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '../../../src/config/environments';

const TC_ID = 'REG_TS28_TC01';
const TC_TITLE = 'Verification Of Resend Email Feature';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let bidrequestPage: BidrequestPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    bidrequestPage = new BidrequestPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test(`${TC_ID}_${TC_TITLE}`, async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Step 1: Load Credentials and Test Data ───────────────────────────
      log.step('Loading credentials and test data');
      try {
        const credentials = ENV.getCredentials('internal');
            vars["Username"] = credentials.username;
            vars["Password"] = credentials.password;
            const profileName = 'Bid Requests'; // TDP sheet name
            const profile = testDataManager.getProfileByName(profileName);
            if (profile && profile.data) {
              const PriceOffered = profile.data[0]['Price Offered'];
              const EmailMessageVerification = profile.data[0]['Email Message Verification'];
              const EmailSuccessMessage = profile.data[0]['Email Success Message'];
              vars["Price Offered"] = PriceOffered;
              vars["Email Message Verification"] = EmailMessageVerification;
              vars["Email Success Message"] = EmailSuccessMessage;
            }
        log.stepPass('Credentials and test data loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Loading credentials and test data failed');
        throw e;
      }

      // ── Step 2: Login to Correspondent Portal ────────────────────────────
      log.step('Login to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to Correspondent Portal successful');
      } catch (e) {
        await log.stepFail(page, 'Login to Correspondent Portal failed');
        throw e;
      }

      // ── Step 3: Navigate to Bid Requests ─────────────────────────────────
      log.step('Navigating to Bid Requests');
      try {
        await expect(correspondentPortalPage.Bid_Requests).toBeVisible();
        await correspondentPortalPage.Bid_Requests.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Bid Requests successfully');
      } catch (e) {
        await log.stepFail(page, 'Navigating to Bid Requests failed');
        throw e;
      }

      // ── Step 4: Filter by Price Offered status ───────────────────────────
      log.step('Filtering by Price Offered status');
      try {
        await priceOfferedPage.Filter_Dropdown1.click();
        await bidRequestPage.Select_Bid_Request_Status_Dropdown.click();
        await bidrequestPage.Price_Offered_Checkbox.check();
        await expect(bidrequestPage.Price_Offered_Checkbox).toBeVisible();
        await correspondentPortalPage. Apply_Selected_1_button_in_Rule.first().click();
        await applyFiltersButtonPage.Apply_Filters_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(bidRequestPage.First_Status_In_Column).toContainText(vars["Price Offered"]);
        log.stepPass('Filtered by Price Offered status and verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Filtering by Price Offered status failed');
        throw e;
      }

      // ── Step 5: Send Email and verify confirmation pop-up ─────────────────
      log.step('Clicking Send Email button and verifying confirmation pop-up');
      try {
        await correspondentPortalPage.Send_Email_Button.first().click();
        await expect(page.getByText(vars["Email Message Verification"])).toBeVisible();
        await expect(correspondentPortalPage.Send_Email_Button_On_Pop_Up).toBeVisible();
        log.stepPass('Send Email button clicked and confirmation pop-up verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Clicking Send Email button or verifying confirmation pop-up failed');
        throw e;
      }

      // ── Step 6: Confirm Send Email and verify success message ─────────────
      log.step('Confirming Send Email and verifying success message');
      try {
        await correspondentPortalPage.Send_Email_Button_On_Pop_Up.click();
        await page.getByText(vars["Email Success Message"]).waitFor({ state: 'visible' });
        log.stepPass('Email sent successfully and success message verified');
      } catch (e) {
        await log.stepFail(page, 'Confirming Send Email or verifying success message failed');
        throw e;
      }

      // ── Step 7: API Verification ──────────────────────────────────────────
      log.step('Executing API verification: GET web.configuration.json');
      try {
        // API: Api1
        const _apiResponse_26670 = await page.request.get("https://ext-qa.lpcorrtest.com/cp/assets/configurations/web.configuration.json");
        expect(_apiResponse_26670.status()).toBe(200);
        log.stepPass('API response status verified: 200 OK');
      } catch (e) {
        await log.stepFail(page, 'API verification failed');
        throw e;
      }

      // ─── TC End: PASS ────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }

  });
});