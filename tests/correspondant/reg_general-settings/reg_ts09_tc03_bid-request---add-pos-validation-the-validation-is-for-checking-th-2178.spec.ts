// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestConfigPage } from '../../../src/pages/correspondant/bid-request-config';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';

const TC_ID = 'REG_TS09_TC03';
const TC_TITLE = 'Bid Request - Add POS Validation, the Validation is for Checking the Bid Uploaded, and for the Verification';
let reg_ts09_tc03_testFailed = false;

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let bidRequestConfigPage: BidRequestConfigPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestConfigPage = new BidRequestConfigPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS09_TC03_Bid Request - Add POS Validation, the Validation is for Checking the Bid Uploaded, and for the Verification', async ({ page }) => {
    
    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Login and credentials setup ────────────────────────────────────
      log.step('Logging in to Correspondent Portal');
      try {
        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Successfully logged in to Correspondent Portal');
      } catch (e) {
        await log.stepFail(page, 'Failed to log in to Correspondent Portal');
        throw e;
      }

      // ── Navigate to Administration Menu ──────────────────────────────
      log.step('Navigating to Administration Menu');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        log.info('Clicked Administration Menu');
        log.stepPass('Successfully navigated to Administration Menu');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Administration Menu');
        throw e;
      }

      // ── Navigate to General Settings Menu ───────────────────────────
      log.step('Navigating to General Settings Menu');
      try {
        await correspondentPortalPage.GeneralSettings_Menu.click();
        log.info('Clicked General Settings Menu');
        log.stepPass('Successfully navigated to General Settings Menu');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to General Settings Menu');
        throw e;
      }

      // ── Wait for page load ─────────────────────────────────────────
      log.step('Waiting for spinner to disappear');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - page load completed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for spinner to disappear');
        throw e;
      }

      // ── Navigate to Bid Request Config Menu ────────────────────────────
      log.step('Navigating to Bid Request Config Menu');
      try {
        await bidRequestPage.Bid_Request_Config_Menu.click();
        log.info('Clicked Bid Request Config Menu');
        log.stepPass('Successfully navigated to Bid Request Config Menu');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bid Request Config Menu');
        throw e;
      }

      // ── Wait for page load ─────────────────────────────────────────
      log.step('Waiting for spinner to disappear');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner disappeared - page load completed');
        log.stepPass('Page loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to wait for spinner to disappear');
        throw e;
      }

      // ── Click Add POS Validation Button ────────────────────────────────
      log.step('Clicking Add POS Validation Button');
      try {
        await correspondentPortalPage.Add_POS_Validation_Button.click();
        log.info('Clicked Add POS Validation Button');
        log.stepPass('Add POS Validation Button clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Add POS Validation Button');
        throw e;
      }

      // ── Verify Newly Added Input POS is visible ───────────────────────
      log.step('Verifying Newly Added Input POS is visible');
      try {
        await expect(bidRequestConfigPage.Newly_Added_Inputpos).toBeVisible();
        log.info('Newly Added Input POS is visible');
        log.stepPass('Newly Added Input POS visibility verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Newly Added Input POS visibility');
        throw e;
      }

      // ── Select option from Newly Added Dropdown Input POS ──────────────
      log.step('Selecting option from Newly Added Dropdown Input POS');
      try {
        await bidRequestConfigPage.Newly_Added_Dropdown_InputPOS.selectOption({ label: "Choice" });
        log.info('Selected "Choice" option from Newly Added Dropdown Input POS');
        log.stepPass('Option selected successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to select option from Newly Added Dropdown Input POS');
        throw e;
      }

      // ── Verify selected value in Newly Added Dropdown Input POS ────────
      log.step('Verifying selected value in Newly Added Dropdown Input POS');
      try {
        await expect(bidRequestConfigPage.Newly_Added_Dropdown_InputPOS).toHaveValue("Choice");
        log.info('Dropdown Input POS has value: "Choice"');
        log.stepPass('Selected value verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify selected value in Newly Added Dropdown Input POS');
        throw e;
      }

      // ── Fill Newly Added Input POS with text ───────────────────────────
      log.step('Filling Newly Added Input POS with text');
      try {
        await bidRequestConfigPage.Newly_Added_Inputpos.pressSequentially("Text");
        log.info('Filled Newly Added Input POS with: "Text"');
        log.stepPass('Newly Added Input POS filled successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to fill Newly Added Input POS');
        throw e;
      }

      // ── Click Delete Button ────────────────────────────────────────────
      log.step('Clicking Delete Button');
      try {
        await bidRequestConfigPage.Delete_Button_pos.click();
        log.info('Clicked Delete Button');
        log.stepPass('Delete Button clicked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to click Delete Button');
        throw e;
      }

      // ── Verify Newly Added Dropdown Input POS is not visible ───────────────
      log.step('Verifying Newly Added Dropdown Input POS is not visible');
      try {
        await expect(bidRequestConfigPage.Newly_Added_Dropdown_InputPOS).not.toBeVisible();
        log.info('Newly Added Dropdown Input POS is not visible');
        log.stepPass('Newly Added Dropdown Input POS visibility verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Newly Added Dropdown Input POS visibility');
        throw e;
      }

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      reg_ts09_tc03_testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }

  });

});