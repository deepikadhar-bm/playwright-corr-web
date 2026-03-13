// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { EnumerationMappingPage } from '../../../src/pages/correspondant/enumeration-mapping';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = "REG_TS08_TC08_CASE-01";
const TC_TITLE = 'Verify message "You have unidentified fields do you want to proceed further" when no value changed and unidentified fields exist and user clicks "Yes, Proceed".';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let enumerationMappingPage: EnumerationMappingPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let spinnerPage: SpinnerPage;

  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    enumerationMappingPage = new EnumerationMappingPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step("Step 1: Login to CORR Portal, enable Smart Mapper, and create Bid Map up to Header Mapping");
      try {
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;

        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);

        log.stepPass("Step 1 passed: Logged in successfully, Smart Mapper enabled, and Bid Map created up to Header Mapping.");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Unable to login, enable Smart Mapper, or create Bid Map up to Header Mapping.");
        throw error;
      }

      log.step("Step 2: Open Enumeration Mapping and proceed using Yes, Proceed button");
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();

        await expect(correspondentPortalPage.Yes_Proceed_Button).toBeVisible();

        await correspondentPortalPage.Yes_Proceed_Button.click();

        await spinnerPage.Spinner.waitFor({ state: 'hidden' });

        log.stepPass("Step 2 passed: Enumeration Mapping opened and proceeded using Yes, Proceed button.");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Unable to open Enumeration Mapping or click Yes, Proceed button.");
        throw error;
      }

      log.step("Step 3: Verify unidentified fields exist in Enumeration Mapping page");
      try {
        vars["UnidentifiedFieldsCount"] = String(await enumerationMappingPage.UnIdentified_Fields.count());

        expect(parseInt(vars["UnidentifiedFieldsCount"])).toBeGreaterThanOrEqual(1);

        log.stepPass("Step 3 passed: Unidentified fields detected successfully.");
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Unable to verify unidentified fields in Enumeration Mapping.");
        throw error;
      }

      log.step("Step 4: Navigate to Rules and Actions and verify unidentified fields message");
      try {
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();

        await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();

        await stepGroups.stepGroup_IF_Condition_for_Yes_Proceed_Button(page, vars);

        await spinnerPage.Spinner.waitFor({ state: 'hidden' });

        log.stepPass("Step 4 passed: Unidentified fields message verified and proceeded successfully.");
      } catch (error) {
        log.stepFail(page, "Step 4 failed: Unable to verify unidentified fields message or proceed.");
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