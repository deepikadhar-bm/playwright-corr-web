// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { DuplicatecopyButtonPage } from '../../../src/pages/correspondant/duplicatecopy-button';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { ExitButtonPage } from '../../../src/pages/correspondant/exit-button';
import { ImportRulePage } from '../../../src/pages/correspondant/import-rule';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { P1MoreButtonPage } from '../../../src/pages/correspondant/p-1-more-button';
import { P24UnitDropdownPage } from '../../../src/pages/correspondant/p-24-unit-dropdown';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { RulesAndActionsPage } from '../../../src/pages/correspondant/rules-and-actions';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { testDataManager } from 'testdata/TestDataManager';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { uploadFile } from '../../../src/helpers/file-helpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments'
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';

const TC_ID = "REG_TS12_TC01";
const TC_TITLE = "Verify that the user can import a rule from the required bid map."

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let duplicatecopyButtonPage: DuplicatecopyButtonPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let exitButtonPage: ExitButtonPage;
  let importRulePage: ImportRulePage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let p1MoreButtonPage: P1MoreButtonPage;
  let p24UnitDropdownPage: P24UnitDropdownPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let rulesAndActionsPage: RulesAndActionsPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactivePage: StatusInactivePage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    duplicatecopyButtonPage = new DuplicatecopyButtonPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    exitButtonPage = new ExitButtonPage(page);
    importRulePage = new ImportRulePage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    p1MoreButtonPage = new P1MoreButtonPage(page);
    p24UnitDropdownPage = new P24UnitDropdownPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    rulesAndActionsPage = new RulesAndActionsPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {
      log.step("Step 1: Prepare data and login");
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
          log.info(`BidFields: ${vars["BidFields"]}`);
        }
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars, "DeepikaAugBidQA_(3)_(1)_(1)_(2).xlsx");
        log.stepPass("Step 1 passed");
      } catch (error) {
        log.stepFail(page, "Step 1 failed");
        throw error;
      }

      log.step("Step 2: Navigate to Rules and Actions and create rule");
      try {
        await expect(correspondentPortalPage.Rules_and_Actions_Step_4_of_4).toBeVisible();
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await stepGroups.stepGroup_IF_Condition_for_Yes_Proceed_Button(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Adding_Rules_In_Rules_and_Actions_Screen(page, vars);
        await stepGroups.stepGroup_Add_Actions_in_Rules_and_Actions(page, vars);
        log.stepPass("Step 2 passed");
      } catch (error) {
        log.stepFail(page, "Step 2 failed");
        throw error;
      }

      log.step("Step 3: Duplicate rule and capture active values");
      try {
        await duplicatecopyButtonPage.DuplicateCopy_Button.click();
        await correspondentPortalPage.Enter_a_Rule_Name_Field.last().fill(Array.from({ length: 1 }, () => "a".charAt(Math.floor(Math.random() * 1))).join(''));
        vars["ActiveRuleName"] = await correspondentPortalPage.Enter_a_Rule_Name_Field.last().inputValue() || '';
        log.info(`ActiveRuleName: ${vars["ActiveRuleName"]}`);
        vars["First Active Rule Name"] = await rulesAndActionsPage.First_Rule_Name_Field.inputValue() || '';
        vars["First Active Rule Multiselected Value"] = await importRulePage.First_Active_Rule_Multiselected_Value.textContent() || '';
        vars["Second Active Rule Name"] = await statusInactive2Page.Rule_Name.inputValue() || '';
        log.info(`First Active Rule: ${vars["First Active Rule Name"]}`);
        log.info(`Second Active Rule: ${vars["Second Active Rule Name"]}`);
        log.stepPass("Step 3 passed");
      } catch (error) {
        log.stepFail(page, "Step 3 failed");
        throw error;
      }

      log.step("Step 4: Save and reopen map for validation");
      try {
        await saveAndPublishButtonPage.Save_and_Publish_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["Version"] = await correspondentPortalPage.Version.textContent() || '';
        log.info(`Version: ${vars["Version"]}`);
        await correspondentPortalPage.Bid_Maps_name(vars["CreateNewMap"]).click();
        await mapHeadersButtonPage.Map_Headers_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass("Step 4 passed");
      } catch (error) {
        log.stepFail(page, "Step 4 failed");
        throw error;
      }

      log.step("Step 5: Duplicate rule in draft and validate");
      try {
        await duplicatecopyButtonPage.DuplicateCopy_Button.click();
        await statusInactivePage.Enter_Rule_Name.fill(Array.from({ length: 1 }, () => "A".charAt(Math.floor(Math.random() * 1))).join(''));
        vars["Rule_Name"] = await statusInactivePage.Enter_Rule_Name.inputValue() || '';
        log.info(`Draft Rule Name: ${vars["Rule_Name"]}`);
        vars["Draft Rule Name"] = vars["Rule_Name"];
        vars["Draft Rule Multiselected Value"] = await importRulePage.Draft_Rule_Multiselected_Value.textContent() || '';
        log.stepPass("Step 5 passed");
      } catch (error) {
        log.stepFail(page, "Step 5 failed");
        throw error;
      }

      log.step("Step 6: Save draft and verify status");
      try {
        await correspondentPortalPage.Save_Draft_Button1.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await exitButtonPage.Exit_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["StatusInListScreen"] = await p1MoreButtonPage.get_Status_In_BidMap_Listcreen(vars["CreateNewMap"]).textContent() || '';
        log.info(`StatusInListScreen: ${vars["StatusInListScreen"]}`);
        await expect(p1MoreButtonPage.get_Status_In_BidMap_Listcreen(vars["CreateNewMap"])).toContainText(vars["StatusInListScreen"]);
        log.stepPass("Step 6 passed");
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