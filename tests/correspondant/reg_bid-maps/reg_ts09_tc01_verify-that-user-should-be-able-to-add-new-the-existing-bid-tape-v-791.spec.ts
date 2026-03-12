// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ENV } from '@config/environments'
import { Logger as log } from '../../../src/helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';

const TC_ID = "REG_TS09_TC01";
const TC_TITLE = "Verify that user should be able to Add new the existing bid tape value under the enum and also should be able to update the chase values";

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let spinnerPage: SpinnerPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });


  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);
  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      log.step("Step 1: Login to CORR Portal and prepare Bid Map up to Header Mapping");
      try {
         if (profile && profile.data) {
        const chaseValue = profile.data[0]['Chase Value'];
        const bidTapeValue = profile.data[0]['Bid Tape Value'];
        vars["Chase Value"] = chaseValue;
        vars["Bid Tape Value"] = bidTapeValue;
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
            }
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
        await expect(correspondentPortalPage.Rules_and_Actions_Step_4_of_4).toBeVisible();
        log.stepPass("Step 1 passed: Logged in, enabled Smart Mapper, and navigated to Rules and Actions step.");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Unable to login, enable Smart Mapper, or reach Rules and Actions step.");
        throw error;
      }
      
      log.step("Step 2: Navigate to Enumeration Mapping screen");
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.waitFor({ state: 'visible' });
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await correspondentPortalPage.Heading_Save_and_Move_to_Next_Page1.waitFor({ state: 'visible' });
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Rules_and_Actions_Step_4_of_4).toBeVisible();
        log.stepPass("Step 2 passed: Navigated to Enumeration Mapping and returned to Rules and Actions step.");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Unable to navigate to Enumeration Mapping or return to Rules and Actions step.");
        throw error;
      }

      log.step("Step 3: Add new bid tape value under enum and save draft");
      try {
        await correspondentPortalPage.Add_Field_Button.click();
        await correspondentPortalPage.Chase_Value.selectOption({ label: vars["Chase Value"] });
        await correspondentPortalPage.Bid_Tape_Value.fill(vars["Bid Tape Value"]);
        await correspondentPortalPage.Save_Draft_Button_in_Enumeration_Mapping.click();
        await expect(rulesAndActionsButtonPage.Rules_and_Actions_Button).toBeVisible();
        log.stepPass("Step 3 passed: New bid tape value added and draft saved successfully.");
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Unable to add new bid tape value or save draft.");
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
