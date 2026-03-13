// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BackButtonPage } from '../../../src/pages/correspondant/back-button';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { ClickOnAddRuleOrImportRulePage } from '../../../src/pages/correspondant/click-on-add-rule-or-import-rule';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ThisActionWillSaveTheChangesAndMoveToNextPagePage } from '../../../src/pages/correspondant/this-action-will-save-the-changes-and-move-to-next-page';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments'
import { testDataManager } from 'testdata/TestDataManager';

const TC_ID = "REG_TS08_TC11_CASE-04";
const TC_TITLE = "No changes / No unidentified fields: Directly move to next screen without prompt.";

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let backButtonPage: BackButtonPage;
  let bidmapPage: BidmapPage;
  let clickOnAddRuleOrImportRulePage: ClickOnAddRuleOrImportRulePage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let spinnerPage: SpinnerPage;
  let thisActionWillSaveTheChangesAndMoveToNextPagePage: ThisActionWillSaveTheChangesAndMoveToNextPagePage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    backButtonPage = new BackButtonPage(page);
    bidmapPage = new BidmapPage(page);
    clickOnAddRuleOrImportRulePage = new ClickOnAddRuleOrImportRulePage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    thisActionWillSaveTheChangesAndMoveToNextPagePage = new ThisActionWillSaveTheChangesAndMoveToNextPagePage(page);
  });

  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {

    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step("Step 1: Load test data and login credentials");
      try {
        if (profile && profile.data) {
          const unidentified_Fields_Message = profile.data[0]['Unidentified fields Message'];
          vars["Unidentified fields Message"] = unidentified_Fields_Message;
          vars["Username"] = credentials.username;
          vars["Password"] = credentials.password;
        }
        log.stepPass("Step 1 passed: Test data and credentials loaded successfully.");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Unable to load test data or credentials.");
        throw error;
      }

      log.step("Step 2: Login, enable Smart Mapper and create Bid Map up to Header Mapping");
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
        log.stepPass("Step 2 passed: Successfully logged in and created Bid Map up to Header Mapping.");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Unable to login, enable Smart Mapper, or create Bid Map up to Header Mapping.");
        throw error;
      }

      log.step("Step 3: Open Enumeration Mapping and handle unidentified fields popup");
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(page.getByText(vars["Unidentified fields Message"])).toBeVisible();
        if (await bidmapPage.Yes_Proceed_Button_Text.isVisible()) {
          await bidmapPage.Yes_Proceed_Button_Text.click();
        } else {
          await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        }
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass("Step 3 passed: Enumeration Mapping opened and popup handled.");
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Unable to open Enumeration Mapping or handle unidentified fields popup.");
        throw error;
      }

      log.step("Step 4: Verify Chase Values in Enumeration Mapping and navigate to Rules and Actions");
      try {
        await stepGroups.stepGroup_Verifying_ChaseValue_In_EnumerationMapping(page, vars);
        await expect(rulesAndActionsButtonPage.Rules_and_Actions_Button).toBeVisible();
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.waitFor({ state: 'visible' });
        await expect(page.getByText("This action will save the changes and Move to Next Page")).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(clickOnAddRuleOrImportRulePage.Click_on_Add_Rule_Or_Import_Rule).toBeVisible();
        log.stepPass("Step 4 passed: Chase values verified and navigation to Rules and Actions successful.");
      } catch (error) {
        log.stepFail(page, "Step 4 failed: Unable to verify chase values or navigate to Rules and Actions.");
        throw error;
      }

      log.step("Step 5: Navigate back and verify no prompt appears");
      try {
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await expect(thisActionWillSaveTheChangesAndMoveToNextPagePage.This_action_will_save_the_changes_and_Move_to_Next_Page).not.toBeVisible();
        if (await bidmapPage.Yes_Proceed_Button_Text.isVisible()) {
          await bidmapPage.Yes_Proceed_Button_Text.click();
        }
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(clickOnAddRuleOrImportRulePage.Click_on_Add_Rule_Or_Import_Rule).toBeVisible();
        log.stepPass("Step 5 passed: Returned to Rules and Actions without prompt and verified next screen.");
      } catch (error) {
        log.stepFail(page, "Step 5 failed: Unable to navigate back or verify absence of prompt.");
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