// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortal8Page } from '../../../src/pages/correspondant/correspondent-portal-8';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { HeadingDashboardPage } from '../../../src/pages/correspondant/heading-dashboard';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { CorrespondentPortal7Page } from '../../../src/pages/correspondant/correspondent-portal-7';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'REG_TS05_TC01';
const TC_TITLE = 'Verify that the user can search for the required bid sample field name and view the relevant headers (used, unused, or unidentified) based on the dropdown selection.';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortal7Page: CorrespondentPortal7Page;
  let correspondentPortal8Page: CorrespondentPortal8Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let headingDashboardPage: HeadingDashboardPage;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortal7Page = new CorrespondentPortal7Page(page);
    correspondentPortal8Page = new CorrespondentPortal8Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    headingDashboardPage = new HeadingDashboardPage(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Step 1: Load Credentials ─────────────────────────────────────────
      const profileName = "Bid_Maps";
      const profile = testDataManager.getProfileByName(profileName);
      if (profile && profile.data) {
        const UnidentifiedHeaders = profile.data[0]['Unidentified Headers'];
        const UnusedHeaders = profile.data[0]['Unused Headers'];
        const UsedHeaders = profile.data[0]['Used Headers'];
        vars["Unidentified Headers"] = UnidentifiedHeaders;
        vars["Unused Headers"] = UnusedHeaders;
        vars["Used Headers"] = UsedHeaders;
        console.log("Unidentified Headers: ", UnidentifiedHeaders);
        console.log("Unused Headers: ", UnusedHeaders);
        console.log("Used Headers: ", UsedHeaders);
      }
      else {
        console.warn(`Test data for profile "${profileName}" not found or is empty.`);
      }
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

      // ── Step 4: Check Required Checkboxes ───────────────────────────────
      log.step('Checking First Bid Request checkbox and Header Mapping Dropdowns checkbox');
      try {
        await correspondentPortalPage.First_Checkbox_Bid_Request.check();
        await statusInactivePage.Checkbox_for_Header_Mapping_Dropdowns.check();
        log.stepPass('Required checkboxes checked successfully');
      } catch (e) {
        await log.stepFail(page, 'Checking required checkboxes failed');
        throw e;
      }

      // ── Step 5: Select Unidentified Headers and verify ───────────────────
      log.step('Selecting Unidentified Headers from dropdown and verifying attributes');
      try {

        await correspondentPortalPage.Header_Mapping_Dropdown_New.click();
        await correspondentPortalPage.Header_Mapping_Dropdown_New.selectOption({ value: vars["Unidentified Headers"] });
        //await correspondentPortalPage.Header_Mapping_Dropdown_New.selectOption({ label: testData["Unidentified Headers"] });
        //await expect(correspondentPortalPage.First_Checkbox_Header_Mapping).toHaveText("Select");
        await expect(correspondentPortalPage.First_Checkbox_Header_Mapping).toHaveAttribute('title', '');
        await expect(correspondentPortalPage.Select_Dropdown_in_Headers_Mapping).toHaveAttribute("title", "");
        //await expect(correspondentPortalPage.Select_Dropdown_in_Headers_Mapping).toHaveValue("Select");
        log.stepPass('Unidentified Headers selected and attributes verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Selecting Unidentified Headers or verifying attributes failed');
        throw e;
      }

      // ── Step 6: Select Unused Headers and verify ─────────────────────────
      log.step('Selecting Unused Headers from dropdown and verifying attributes');
      try {
        await correspondentPortalPage.Header_Mapping_Dropdown_New.selectOption({ value: vars["Unused Headers"] });
        await expect(correspondentPortalPage.Header_Mapping_for_the_Dropdowns).toHaveAttribute("title", "");
        await expect(headingDashboardPage.Harp_Indicator_Field).toHaveAttribute("title", "");
        log.stepPass('Unused Headers selected and attributes verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Selecting Unused Headers or verifying attributes failed');
        throw e;
      }

      // ── Step 7: Select Used Headers and verify ───────────────────────────
      log.step('Selecting Used Headers from dropdown and verifying visibility');
      try {
        await correspondentPortalPage.Header_Mapping_Dropdown_New.selectOption({ value: vars["Used Headers"] });
        await expect(correspondentPortalPage.First_Checkbox_Bid_Request).toBeVisible();
        await expect(correspondentPortal7Page.Header_Mapping_checkbox).toBeVisible();
        log.stepPass('Used Headers selected and visibility verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Selecting Used Headers or verifying visibility failed');
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