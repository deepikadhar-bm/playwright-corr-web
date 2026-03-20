// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ActionruleheaderPage } from '../../../src/pages/correspondant/actionruleheader';
import { CorrespondentPortal18Page } from '../../../src/pages/correspondant/correspondent-portal-18';
import { DuplicatecopyButtonPage } from '../../../src/pages/correspondant/duplicatecopy-button';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { RulesAndActionsPage } from '../../../src/pages/correspondant/rules-and-actions';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments'
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = "REG_TS11_TC02";
const TC_TITLE = "Verification Of Duplicating the Rule"

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let actionruleheaderPage: ActionruleheaderPage;
  let correspondentPortal18Page: CorrespondentPortal18Page;
  let duplicatecopyButtonPage: DuplicatecopyButtonPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let rulesAndActionsPage: RulesAndActionsPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let spinnerPage: SpinnerPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    actionruleheaderPage = new ActionruleheaderPage(page);
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
    duplicatecopyButtonPage = new DuplicatecopyButtonPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    rulesAndActionsPage = new RulesAndActionsPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step("Step 1: Prepare test data and login");
      try {
        if (profile && profile.data) {
          vars["Rule Name"] = profile.data[0]['Rule Name'];
          vars["Condition Bid Field"] = profile.data[0]['Condition Bid Field'];
          vars["BidEnumeratedTapeValue"] = profile.data[0]['BidEnumeratedTapeValue'];
          vars["Bid Enumerated Tape Value"] = profile.data[0]['Bid Enumerated Tape Value'];
          vars["Operation1"] = profile.data[0]['Operation1'];
          vars["Duplicated Rule Name"] = profile.data[0]["Duplicated Rule Name"];
          vars["Operation2"] = profile.data[0]['Operation2'];
          vars["BidFields"] = profile.data[0]["BidFields"];
          vars["Username"] = credentials.username;
          vars["Password"] = credentials.password;

          log.info(`Rule Name: ${vars["Rule Name"]}`);
          log.info(`Duplicated Rule Name: ${vars["Duplicated Rule Name"]}`);
          log.info(`BidFields: ${vars["BidFields"]}`);
        }

        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(
          page,
          vars,
          "DeepikaAugBidQA_(3)_(1)_(1)_(2).xlsx"
        );

        log.stepPass("Step 1 passed: Logged in and navigated to Header Mapping");
      } catch (error) {
        log.stepFail(page, "Step 1 failed");
        throw error;
      }

      log.step("Step 2: Navigate to Rules and Actions");
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();

        if (await correspondentPortal18Page.Yes_Proceed_Button.isVisible()) {
          await correspondentPortal18Page.Yes_Proceed_Button.click();
        }

        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await correspondentPortal18Page.Yes_Proceed_Button.click();

        await expect(actionruleheaderPage.Rules_and_Actions_Heading).toBeVisible();

        log.stepPass("Step 2 passed: Navigated to Rules and Actions");
      } catch (error) {
        log.stepFail(page, "Step 2 failed");
        throw error;
      }

      log.step("Step 3: Add Rules and Actions");
      try {
        await stepGroups.stepGroup_Adding_Rules_In_Rules_and_Actions_Screen(page, vars);
        await stepGroups.stepGroup_Add_Actions_in_Rules_and_Actions(page, vars);

        log.stepPass("Step 3 passed: Rules and Actions added");
      } catch (error) {
        log.stepFail(page, "Step 3 failed");
        throw error;
      }

      log.step("Step 4: Duplicate the Rule and validate");
      try {
        await duplicatecopyButtonPage.DuplicateCopy_Button.click();
        await expect(rulesAndActionsPage.Duplicated_Block).toBeVisible();

        await stepGroups.stepGroup_Verification_Of_Duplicated_Rule_Values(page, vars);

        log.stepPass("Step 4 passed: Rule duplicated and validated");
      } catch (error) {
        log.stepFail(page, "Step 4 failed");
        throw error;
      }

      log.step("Step 5: Modify duplicated rule and validate values");
      try {
        await stepGroups.stepGroup_Adding_Rules_In_Rules_and_Actions_Screen_Duplicated_Rule(page, vars);
        await stepGroups.stepGroup_Add_Actions_in_Rules_and_ActionsDuplicated_Rule(page, vars);

        await stepGroups.stepGroup_Verification_Of_Duplicated_Rule_Values_with_Duplicated_Rule_Name(page, vars);

        log.stepPass("Step 5 passed: Duplicated rule updated and verified");
      } catch (error) {
        log.stepFail(page, "Step 5 failed");
        throw error;
      }

      log.step("Step 6: Save and Publish");
      try {
        await saveAndPublishButtonPage.Save_and_Publish_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });

        log.stepPass("Step 6 passed: Changes saved and published");
      } catch (error) {
        log.stepFail(page, "Step 6 failed");
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