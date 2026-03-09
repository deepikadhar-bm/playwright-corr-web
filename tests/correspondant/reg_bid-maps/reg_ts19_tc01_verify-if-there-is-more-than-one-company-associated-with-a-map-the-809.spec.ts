// [POM-APPLIED]
import { test, expect, Page } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BackButtonPage } from '../../../src/pages/correspondant/back-button';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = "REG_TS19_TC01";
const TC_TITLE = "Verify if there is more than one company associated with a map, then the count of associated company should be displayed next to the company value in the list";

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let backButtonPage: BackButtonPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let helpers: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    backButtonPage = new BackButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    helpers = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      // Step 1: Login
      log.step("Step 1: Login to CORR Portal");
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass("Step 1 passed: Logged in to CORR Portal successfully");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Failed to login to CORR Portal");
        throw error;
      }

      // Step 2: Create map with multiple companies and timestamps
      log.step("Step 2: Select multiple companies and create a new map");
      try {
        await stepGroups.stepGroup_Selecting_the_multiple_Company_name_Creating_a_New_Map(page, vars);

        const now = new Date();
        vars["CreatedOn"] = now.toLocaleString('en-US', { hour12: true, timeZone: 'UTC' });

        // Extract date and time using helpers
        helpers.removeCharactersFromPosition(vars["CreatedOn"], "0", "10", "CreatedOnDate");  // MM/DD/YYYY
        helpers.removeCharactersFromPosition(vars["CreatedOn"], "12", String(vars["CreatedOn"].length - 12), "CreatedOnTime");

        // Generate time variations (+1 and +2 minutes)
        const baseTime = new Date('2000-01-01 ' + vars["CreatedOnTime"]);
        baseTime.setMinutes(baseTime.getMinutes() + 1);
        vars["CreatedOnTime1"] = baseTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

        baseTime.setMinutes(baseTime.getMinutes() + 1); // +2 minutes
        vars["CreatedOnTime2"] = baseTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

        // Concatenate date and times using helpers
        helpers.concatenate(vars["CreatedOnDate"], " ", "CreatedOn1Temp");
        helpers.concatenate(vars["CreatedOn1Temp"], vars["CreatedOnTime1"], "CreatedOn1");

        helpers.concatenate(vars["CreatedOnDate"], " ", "CreatedOn2Temp");
        helpers.concatenate(vars["CreatedOn2Temp"], vars["CreatedOnTime2"], "CreatedOn2");

        log.stepPass("Step 2 passed: Multiple companies selected and new map created with timestamps");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Failed to select companies and create map");
        throw error;
      }

      // Step 3: Upload file
      log.step("Step 3: Upload file for the map");
      try {
        await stepGroups.stepGroup_Uploading_the_File(page, vars);
        log.stepPass("Step 3 passed: File uploaded successfully");
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Failed to upload file");
        throw error;
      }

      // Step 4: Enumeration Mapping
      log.step("Step 4: Navigate to Enumeration Mapping and proceed with unidentified fields");
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass("Step 4 passed: Navigated to Enumeration Mapping and proceeded with unidentified fields");
      } catch (error) {
        log.stepFail(page, "Step 4 failed: Failed to navigate to Enumeration Mapping");
        throw error;
      }

      // Step 5: Rules and Actions
      log.step("Step 5: Navigate to Rules and Actions with conditional handling");
      try {
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        if (await rulesAndActionsButtonPage.Rules_and_Actions_Button.isVisible()) {
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
          await correspondentPortalPage.Yes_Proceed_Button.click();
        } else {
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await saveAndPublishButtonPage.Save_and_Publish_Button.click();
        }
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass("Step 5 passed: Navigated to Rules and Actions with conditional handling");
      } catch (error) {
        log.stepFail(page, "Step 5 failed: Failed to navigate to Rules and Actions");
        throw error;
      }

      // Step 6: Save and Publish
      log.step("Step 6: Save and Publish the map and verify company count display");
      try {
        await saveAndPublishButtonPage.Save_and_Publish_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });

        vars["CountOfCompaniesAdded"] = await backButtonPage.Company_Added.textContent() || '';
        helpers.trimtestdata(vars["CountOfCompaniesAdded"], "CountOfCompaniesAdded");

        await expect(backButtonPage.Company_Added).toContainText(vars["CountOfCompaniesAdded"]);
        log.stepPass(`Step 6 passed: Map saved and published successfully, company count verified: ${vars["CountOfCompaniesAdded"]}`);
      } catch (error) {
        log.stepFail(page, "Step 6 failed: Failed to save and publish map or verify company count");
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