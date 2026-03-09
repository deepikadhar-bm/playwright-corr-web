// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'REG_TS07_TC01';
const TC_TITLE = 'Verified that the user should be notified if he tries to navigate to further with having an unidentified fields.';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
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
        // console.log("Test Data: ", testData);
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

      // ── Step 3: Create Bid Map up to Header Mapping ──────────────────────
      log.step('Creating Bid Map up to Header Mapping step');
      try {
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
        await expect(correspondentPortalPage.Rules_and_Actions_Step_4_of_4).toBeVisible();
        log.stepPass('Bid Map created up to Header Mapping — Step 4 of 4 is visible');
      } catch (e) {
        await log.stepFail(page, 'Creating Bid Map up to Header Mapping failed');
        throw e;
      }

      // ── Step 4: Click Enumeration Mapping and verify warning message ──────
      log.step('Clicking Enumeration Mapping button and verifying unidentified fields warning');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
        log.stepPass('Enumeration Mapping clicked and unidentified fields warning verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Clicking Enumeration Mapping or verifying warning message failed');
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