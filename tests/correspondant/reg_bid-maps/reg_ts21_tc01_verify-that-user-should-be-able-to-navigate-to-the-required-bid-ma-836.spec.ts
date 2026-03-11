// [POM-APPLIED]
import { test, expect, Page } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { P2142530YrFreddieMacFixedDropdownPage } from '../../../src/pages/correspondant/p-2142530-yr-freddie-mac-fixed-dropdown';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = "REG_TS21_TC01";
const TC_TITLE = "Verify that user should be able to navigate to the required bid map details screen";

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let p2142530YrFreddieMacFixedDropdownPage: P2142530YrFreddieMacFixedDropdownPage;
  let spinnerPage: SpinnerPage;
  let helpers: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    p2142530YrFreddieMacFixedDropdownPage = new P2142530YrFreddieMacFixedDropdownPage(page);
    spinnerPage = new SpinnerPage(page);
    helpers = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      log.step("Step 1: Login to CORR Portal and verify dashboard");
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await correspondentPortalPage.Heading_Dashboard.waitFor({ state: 'visible', timeout: 18000 });
        log.stepPass("Step 1 passed: Logged in to CORR Portal successfully and dashboard is visible");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Failed to login to CORR Portal or dashboard not visible");
        throw error;
      }

      log.step("Step 2: Enable Smart Mapper");
      try {
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        log.stepPass("Step 2 passed: Smart Mapper enabled successfully");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Failed to enable Smart Mapper");
        throw error;
      }

      log.step("Step 3: Create Bid Map up to Header Mapping");
      try {
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
        log.stepPass("Step 3 passed: Bid Map created up to Header Mapping successfully");
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Failed to create Bid Map up to Header Mapping");
        throw error;
      }

      log.step("Step 4: Edit Header Mapping");
      try {
        await stepGroups.stepGroup_Edition_in_Header_Mapping(page, vars);
        log.stepPass("Step 4 passed: Header Mapping edited successfully");
      } catch (error) {
        log.stepFail(page, "Step 4 failed: Failed to edit Header Mapping");
        throw error;
      }

      log.step("Step 5: Delete entries in Enumeration Mapping");
      try {
        await stepGroups.stepGroup_Deletion_in_Enumeration_Mapping(page, vars);
        log.stepPass("Step 5 passed: Enumeration Mapping entries deleted successfully");
      } catch (error) {
        log.stepFail(page, "Step 5 failed: Failed to delete entries in Enumeration Mapping");
        throw error;
      }

      log.step("Step 6: Import Rule in Mapping");
      try {
        await stepGroups.stepGroup_Import_Rule_in_Mapping(page, vars);
        log.stepPass("Step 6 passed: Rule imported in Mapping successfully");
      } catch (error) {
        log.stepFail(page, "Step 6 failed: Failed to import Rule in Mapping");
        throw error;
      }

      log.step("Step 7: Navigate to Bid Map details and verify map name");
      try {
        await correspondentPortalPage.Bid_Maps_name(vars["BidMap"]).click();

        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(p2142530YrFreddieMacFixedDropdownPage.Bid_Maps_Name)
          .toContainText(vars["BidMap"]);
        log.stepPass("Step 7 passed: Navigated to Bid Map details and verified map name: " + vars["CreateNewMap"]);
      } catch (error) {
        log.stepFail(page, "Step 7 failed: Failed to navigate to Bid Map details or verify map name");
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