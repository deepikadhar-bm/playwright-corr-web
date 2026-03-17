// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortal8Page } from '../../../src/pages/correspondant/correspondent-portal-8';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SaveDraftExitButtonPage } from '../../../src/pages/correspondant/save-draft-exit-button';
import { CorrespondentPortal7Page } from '../../../src/pages/correspondant/correspondent-portal-7';
import { ENV } from '@config/environments'
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = "REG_TS02_TC07";
const TC_TITLE = "Verify that user should be allowed to select / deselect the required fields via individual fields. Allow users to enable / disable the checkboxes / header values."

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortal7Page: CorrespondentPortal7Page;
  let correspondentPortal8Page: CorrespondentPortal8Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let saveDraftExitButtonPage: SaveDraftExitButtonPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortal7Page = new CorrespondentPortal7Page(page);
    correspondentPortal8Page = new CorrespondentPortal8Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    saveDraftExitButtonPage = new SaveDraftExitButtonPage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      vars["Username"] = credentials.username;
      vars["Password"] = credentials.password;

      log.step("Step 1: Login to CORR Portal");
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass("Step 1 passed: Logged in to CORR Portal successfully");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Failed to login to CORR Portal");
        throw error;
      }

      log.step("Step 2: Create Bid Map up to Header Mapping page");
      try {
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
        log.stepPass("Step 2 passed: Navigated to Header Mapping page successfully");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Failed to create Bid Map up to Header Mapping");
        throw error;
      }

      log.step("Step 3: Select individual checkboxes");
      try {
        await expect(correspondentPortalPage.First_Checkbox_Bid_Request).toBeEnabled();
        await correspondentPortalPage.First_Checkbox_Bid_Request.check();

        await expect(saveDraftExitButtonPage.Save_Draft_Exit_Button).toBeVisible();

        await expect(correspondentPortal7Page.Header_Mapping_checkbox).toBeEnabled();
        await correspondentPortal7Page.Header_Mapping_checkbox.check();

        log.stepPass("Step 3 passed: Individual checkboxes selected successfully");
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Failed to select individual checkboxes");
        throw error;
      }

      log.step("Step 4: Deselect the selected checkboxes");
      try {
        await correspondentPortalPage.First_Checkbox_Bid_Request.uncheck();
        await correspondentPortal7Page.Header_Mapping_checkbox.uncheck();

        await expect(correspondentPortalPage.First_Checkbox_Bid_Request).toBeVisible();
        await expect(correspondentPortal7Page.Header_Mapping_checkbox).toBeVisible();

        log.stepPass("Step 4 passed: Checkboxes deselected successfully");
      } catch (error) {
        log.stepFail(page, "Step 4 failed: Failed to deselect checkboxes");
        throw error;
      }

      log.tcEnd('PASS');

    } catch (error) {
      log.captureOnFailure(page, TC_ID, error);
      log.tcEnd('FAIL');
      throw error;
    }
  });
});