// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BackButtonPage } from '../../../src/pages/correspondant/back-button';
import { ContinueEditingButtonPage } from '../../../src/pages/correspondant/continue-editing-button';
import { CorrespondentPortal18Page } from '../../../src/pages/correspondant/correspondent-portal-18';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ENV } from '@config/environments'
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = "REG_TS04_TC06_CASE-01";
const TC_TITLE = "If they haven't changed any value and they have only unidentified fields - Message should be 'You have unidentified fields do you want to proceed further', with just 'Yes, Proceed' button.";

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let backButtonPage: BackButtonPage;
  let continueEditingButtonPage: ContinueEditingButtonPage;
  let correspondentPortal18Page: CorrespondentPortal18Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let spinnerPage: SpinnerPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    backButtonPage = new BackButtonPage(page);
    continueEditingButtonPage = new ContinueEditingButtonPage(page);
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      log.step("Step 1: Login and create Bid Map up to Header Mapping with Smart Mapper ON");
      try {
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
        log.stepPass("Step 1 passed: Logged in, Smart Mapper ON, and Bid Map created up to header mapping.");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Unable to login, toggle Smart Mapper ON, or create Bid Map up to header mapping.");
        throw error;
      }

      log.step("Step 2: Verify unidentified fields popup with Yes, Proceed button and close it");
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
        await expect(correspondentPortalPage.Yes_Proceed_Button).toBeVisible();
        await correspondentPortalPage.close_pop_up_bid_request_details.click();
        log.stepPass("Step 2 passed: Unidentified fields popup displayed with Yes, Proceed button and closed successfully.");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Unable to display unidentified fields popup or Yes, Proceed button.");
        throw error;
      }

      log.step("Step 3: Use Continue Editing option on unidentified fields popup");
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
        await continueEditingButtonPage.Continue_Editing_Button.click();
        log.stepPass("Step 3 passed: Continue Editing option used from unidentified fields popup.");
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Unable to use Continue Editing option from unidentified fields popup.");
        throw error;
      }

      log.step("Step 4: Proceed from unidentified fields popup and navigate back to mapping list");
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
        await correspondentPortal18Page.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(backButtonPage.BACK_Button).toBeVisible();
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Select_All_Checkbox).toBeVisible();
        log.stepPass("Step 4 passed: Proceeded from popup, reached next page, and returned to mapping list.");
      } catch (error) {
        log.stepFail(page, "Step 4 failed: Unable to proceed from popup, navigate forward, or return to mapping list.");
        throw error;
      }

      log.tcEnd('PASS');
    } catch (error) {
      await log.captureOnFailure(page, TC_ID, error);
      log.tcEnd('FAIL');
      throw error;
    }
  });
});
