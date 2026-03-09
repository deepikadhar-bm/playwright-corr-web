import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'REG_TS25_TC03';
const TC_TITLE = 'Verify the Resend commitment letter action';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Step 1: Load Credentials ─────────────────────────────────────────
      log.step('Loading credentials');
      try {
        const crederntials = ENV.getCredentials('internal');
        vars["Username"] = crederntials.username;
        vars["Password"] = crederntials.password;
        log.stepPass('Credentials loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Loading credentials failed');
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

      // ── Step 3: Navigate to Commitments and open Closed List ─────────────
      log.step('Navigating to Commitments Side Menu and opening Closed List');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await commitmentListPage.Closed_List_Tab.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Commitments and Closed List opened successfully');
      } catch (e) {
        await log.stepFail(page, 'Navigating to Commitments or opening Closed List failed');
        throw e;
      }

      // ── Step 4: Click Commitment Letter ──────────────────────────────────
      log.step('Clicking Commitment Letter');
      try {
        await commitmentListPage.Commitment_Letter.first().click();
        await correspondentPortalPage.Send_Email_ButtonCommitment_List.waitFor({ state: 'visible' });
        log.stepPass('Commitment Letter clicked and Send Email button is visible');
      } catch (e) {
        await log.stepFail(page, 'Clicking Commitment Letter or waiting for Send Email button failed');
        throw e;
      }

      // ── Step 5: Send Email and verify success message ─────────────────────
      log.step('Clicking Send Email and verifying commitment letter email success message');
      try {
        await correspondentPortalPage.Send_Email_ButtonCommitment_List.click();
        await page.getByText("Commitment letter email triggered successfully!").waitFor({ state: 'visible' });
        await expect(page.getByText("Commitment letter email triggered successfully!")).toBeVisible();
        log.stepPass('Commitment letter email triggered successfully message verified');
      } catch (e) {
        await log.stepFail(page, 'Sending email or verifying success message failed');
        throw e;
      }

      // ── Step 6: Close the popup ───────────────────────────────────────────
      log.step('Clicking OK and Close buttons to dismiss the popup');
      try {
        await correspondentPortalPage.OK_ButtonCommitment_List.click();
        await correspondentPortalPage.Close_ButtonCommitment_List.click();
        log.stepPass('Popup dismissed successfully');
      } catch (e) {
        await log.stepFail(page, 'Clicking OK or Close button failed');
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