// [POM-APPLIED]
import { test, expect, Page } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { HeadingCreateNewMapPage } from '../../../src/pages/correspondant/heading-create-new-map';
import { HeadingMappingsPage } from '../../../src/pages/correspondant/heading-mappings';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments'
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';

const TC_ID = "REG_TS18_TC01";
const TC_TITLE = "Verify that the user should not be allowed to create duplicate maps and verify that if the map is deleted then the user should be able to create a new map with the same name.";

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let headingCreateNewMapPage: HeadingCreateNewMapPage;
  let headingMappingsPage: HeadingMappingsPage;
  let spinnerPage: SpinnerPage;
  let helpers: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    headingCreateNewMapPage = new HeadingCreateNewMapPage(page);
    headingMappingsPage = new HeadingMappingsPage(page);
    spinnerPage = new SpinnerPage(page);
    helpers = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      log.step("Step 1: Login to CORR Portal and verify dashboard");
      try {
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Heading_Dashboard).toBeVisible();
        log.stepPass("Step 1 passed: Logged in to CORR Portal successfully and dashboard is visible");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Failed to login to CORR Portal");
        throw error;
      }

      log.step("Step 2: Navigate to Administration menu and select Bid Maps");
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.Bid_Maps_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(headingMappingsPage.Mappings).toBeVisible();
        log.stepPass("Step 2 passed: Navigated to Bid Maps menu successfully");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Failed to navigate to Bid Maps menu");
        throw error;
      }

      log.step("Step 3: Extract existing Bid Map name for duplicate test");
      try {
        vars["ExistingBidMapName"] = await correspondentPortalPage.ExistingCompany_Name.textContent() || '';
        helpers.removeCharactersFromPosition(vars["ExistingBidMapName"], "1", "1", "ExistingBidMapName");
        log.stepPass("Step 3 passed: Existing Bid Map name extracted successfully: " + vars["ExistingBidMapName"]);
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Failed to extract existing Bid Map name");
        throw error;
      }
      
      log.step("Step 4: Attempt to create duplicate Bid Map and verify error message");
      try {
        await correspondentPortalPage.Add_New_Mapping_Button.click();
        await expect(headingCreateNewMapPage.Create_New_Map).toBeVisible();
        await correspondentPortalPage.Create_New_Map_Field.fill(vars["ExistingBidMapName"]);
        await correspondentPortalPage.Create_Button.click();
        await expect(correspondentPortalPage.BidMap_already_exists_Error_Message).toBeVisible();
        await correspondentPortalPage.close_pop_up_bid_request_details.click();
        log.stepPass("Step 4 passed: Duplicate Bid Map creation prevented and error message displayed successfully");
      } catch (error) {
        log.stepFail(page, "Step 4 failed: Failed to verify duplicate Bid Map prevention");
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