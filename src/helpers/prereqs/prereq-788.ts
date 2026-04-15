import type { Page } from '@playwright/test';
import { test, expect } from '@playwright/test';
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
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'PRE_REQ(REG_TS12_TC01)';
const TC_TITLE = 'Verify that the user can import a rule from the required bid map.';

export async function runPrereq_788(page: Page, vars: Record<string, string>): Promise<void> {
  const chaseFieldNamePage = new ChaseFieldNamePage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const duplicatecopyButtonPage = new DuplicatecopyButtonPage(page);
  const enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
  const exitButtonPage = new ExitButtonPage(page);
  const importRulePage = new ImportRulePage(page);
  const mapHeadersButtonPage = new MapHeadersButtonPage(page);
  const p1MoreButtonPage = new P1MoreButtonPage(page);
  const p24UnitDropdownPage = new P24UnitDropdownPage(page);
  const rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
  const rulesAndActionsPage = new RulesAndActionsPage(page);
  const saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactive2Page = new StatusInactive2Page(page);
  const statusInactivePage = new StatusInactivePage(page);

  const credentials = ENV.getCredentials('internal');
  vars['Username'] = credentials.username;
  vars['Password'] = credentials.password;

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

  log.tcStart(TC_ID, TC_TITLE);

  if (profile && profile.data) {
    vars["Rule Name"] = profile.data[0]['Rule Name'];
    vars["New Rule Name"] = profile.data[0]['New Rule Name'];
    vars["Duplicated Rule Name"] = profile.data[0]['Duplicated Rule Name'];
    vars["Condition Bid Field"] = profile.data[0]['Condition Bid Field'];
    vars["Operation1"] = profile.data[0]['Operation1'];
    vars["Operation2"] = profile.data[0]['Operation2'];
    vars["BidEnumeratedTapeValue"] = profile.data[0]['BidEnumeratedTapeValue'];
    vars["BidEnumeratedTapeValue"] = profile.data[0]['BidEnumeratedTapeValue'];
  }

  try {

    log.step('Login to CORR portal');
    try {
      await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
      log.stepPass('Login successful');
    } catch (e) {
      await log.stepFail(page, 'Login failed');
      throw e;
    }

    log.step('Enable Smart Mapper and create Bid Map up to Header Mapping');
    try {
      await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
      const fileName = fileconstants.BID_QA_FILE_COMMON;
      await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars, fileName);
      vars["CreateNewMaps"] = vars['CreateNewMap'];
      // Write to test data profile: "Import Rule" = vars["Create New Maps"]
      testDataManager.updateProfileData(profileName, { "Import Rule": vars["CreateNewMaps"] });
      log.stepPass('Smart Mapper enabled and Bid Map created up to Header Mapping');
    } catch (e) {
      await log.stepFail(page, 'Failed to enable Smart Mapper or create Bid Map');
      throw e;
    }

    log.step('Navigate through Enumeration Mapping and Rules and Actions');
    try {
      await expect(correspondentPortalPage.Rules_and_Actions_Step_4_of_4).toBeVisible();
      await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
      await correspondentPortalPage.Heading_Save_and_Move_to_Next_Page1.waitFor({ state: 'visible' });
      await correspondentPortalPage.Yes_Proceed_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(correspondentPortalPage.Rules_and_Actions_Step_4_of_4).toBeVisible();
      await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
      await correspondentPortalPage.Heading_Save_and_Move_to_Next_Page1.waitFor({ state: 'visible' });
      await stepGroups.stepGroup_IF_Condition_for_Yes_Proceed_Button(page, vars);
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Navigated to Rules and Actions screen');
    } catch (e) {
      await log.stepFail(page, 'Failed to navigate to Rules and Actions screen');
      throw e;
    }

    log.step('Add Rules and Actions and duplicate rule block');
    try {
      await stepGroups.stepGroup_Adding_Rules_In_Rules_and_Actions_Screen(page, vars);
      await stepGroups.stepGroup_Add_Actions_in_Rules_and_Actions(page, vars);
      await duplicatecopyButtonPage.DuplicateCopy_Button.click();
      await expect(correspondentPortalPage.Rules_and_Actions_Step_4_of_4).toBeVisible();
      log.stepPass('Rules and Actions added and rule duplicated');
    } catch (e) {
      await log.stepFail(page, 'Failed to add Rules and Actions or duplicate rule');
      throw e;
    }

    log.step('Capture active rule name and verify first rule block fields');
    try {
      await correspondentPortalPage.Enter_a_Rule_Name_Field.first().click();
      await correspondentPortalPage.Enter_a_Rule_Name_Field.first().type(appconstants.RULE_NAME_CONST1);
      vars["ActiveRuleName"] = await correspondentPortalPage.Enter_a_Rule_Name_Field.first().inputValue() || '';
      vars["WhenBidFieldEnum"] = await statusInactivePage.When_Bid_Field_Enumeration_Mapping.textContent() || '';
      await expect(statusInactivePage.When_Bid_Field_Enumeration_Mapping).toContainText(vars["WhenBidFieldEnum"]);
      await expect(chaseFieldNamePage.When_Bid_Field).toBeVisible();
      await expect(statusInactivePage.Bid_Enumeration_TapeValue).toBeVisible();
      await expect(statusInactivePage.Chase_Field_Name_2).toBeVisible();
      await expect(p1MoreButtonPage.Chase_Value).toBeVisible();
      log.stepPass('Active Rule Name captured: ' + vars["ActiveRuleName"] + '. First rule block fields verified');
    } catch (e) {
      await log.stepFail(page, 'Failed to capture active rule name or verify first rule block fields');
      throw e;
    }

    log.step('Store first and second active rule field values for later comparison');
    try {
      vars["First Active Rule Name"] = await rulesAndActionsPage.First_Rule_Name_Field.inputValue() || '';
      vars["First Active Rule Multiselected Value"] = (await importRulePage.First_Active_Rule_Multiselected_Value.textContent() || '');
      vars["Bid Field Selected Option From Active 1st Rule"] = (await importRulePage.Bid_Field_Selected_Option_From_Active_1st_Rule.textContent() || '');
      vars["Bid Enumerated Tape Value Selected Option From Active 1st Rule"] = (await importRulePage.Bid_Enumerated_Tape_Value_Selected_Option_From_Active_1st_Rule.textContent() || '');
      vars["Chase Field Name Selected Option From Active 1st Rule"] = (await importRulePage.Chase_Field_Name_Selected_Option_From_Active_1st_Rule.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; }));
      vars["Chase Value Selected Option From Active 1st Rule"] = (await importRulePage.Chase_Value_Selected_Option_From_Active_1st_Rule.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; }));
      vars["Second Active Rule Name"] = await statusInactive2Page.Rule_Name.inputValue() || '';
      vars["Second Active Rule Multiselected Value"] = (await rulesAndActionsPage.Select_Category_DropdownDuplicated.textContent() || '');
      vars["Bid Field Selected Option From Active 2nd Rule"] = (await importRulePage.Bid_Field_Selected_Option_From_Active_2nd_Rule.textContent() || '');
      vars["Bid Enumerated Tape Value Selected Option From Active 2nd Rule"] = (await importRulePage.Bid_Enumerated_Tape_Value_Selected_Option_From_Active_2nd_Rule.textContent() || '');
      vars["Chase Field Name Selected Option From Active 2nd Rule"] = (await importRulePage.Chase_Field_Name_Selected_Option_From_Active_2nd_Rule.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; }));
      vars["Chase Value Selected Option From Active 2nd Rule"] = (await importRulePage.Chase_Value_Selected_Option_From_Active_2nd_Rule.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; }));
      log.stepPass('First Active Rule: ' + vars["First Active Rule Name"] + ', Second Active Rule: ' + vars["Second Active Rule Name"]);
    } catch (e) {
      await log.stepFail(page, 'Failed to store active rule field values');
      throw e;
    }

    log.step('Save and Publish the Bid Map and capture version');
    try {
      await saveAndPublishButtonPage.Save_and_Publish_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      vars["Version"] = await correspondentPortalPage.Version.textContent() || '';
      await expect(correspondentPortalPage.Version).toContainText(vars["Version"]);
      log.stepPass('Bid Map saved and published. Version: ' + vars["Version"]);
    } catch (e) {
      await log.stepFail(page, 'Failed to Save and Publish Bid Map');
      throw e;
    }

    log.step('Navigate back to Bid Map and proceed to Rules and Actions for draft creation');
    try {
      await correspondentPortalPage.Bid_Maps_name(vars['BidMap']).click();
      await mapHeadersButtonPage.Map_Headers_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
      await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
      await correspondentPortalPage.Yes_Proceed_Button.click();
      await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
      await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
      await correspondentPortalPage.Yes_Proceed_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Navigated back to Rules and Actions screen for draft rule creation');
    } catch (e) {
      await log.stepFail(page, 'Failed to navigate back to Rules and Actions screen');
      throw e;
    }

    log.step('Duplicate rule to create draft and verify draft rule block fields');
    try {
      await duplicatecopyButtonPage.DuplicateCopy_Button.click();
      await statusInactive2Page.Rule_Name.scrollIntoViewIfNeeded();
      await statusInactivePage.Enter_Rule_Name.click();
      await statusInactivePage.Enter_Rule_Name.type(appconstants.RULE_NAME_CONST2);
      vars["Rule_Name"] = await statusInactivePage.Enter_Rule_Name.inputValue() || '';
      await expect(statusInactive2Page.When_Bid_Field_Rules_and_Actions).toBeVisible();
      await expect(statusInactivePage.When_Bid_Field_2).toBeVisible();
      await expect(p1MoreButtonPage.Bid_Enumerated_Tape_Value).toBeVisible();
      await expect(statusInactivePage.Chase_Field_Name).toBeVisible();
      await expect(p24UnitDropdownPage.ChaseValue).toBeVisible();
      log.stepPass('Draft rule duplicated. Rule Name: ' + vars["Rule_Name"]);
    } catch (e) {
      await log.stepFail(page, 'Failed to duplicate rule or verify draft rule block fields');
      throw e;
    }

    log.step('Store draft rule field values for later comparison');
    try {
      vars["Draft Rule Name"] = await statusInactivePage.Enter_Rule_Name.inputValue() || '';
      vars["Draft Rule Multiselected Value"] = (await importRulePage.Draft_Rule_Multiselected_Value.textContent() || '');
      vars["Bid Field Selected Option From Draft Rule"] = (await importRulePage.Bid_Field_Selected_Option_From_Draft_Rule.textContent() || '');
      vars["Bid Enumerated Tape Value Selected Option From Draft Rule"] = (await importRulePage.Bid_Enumerated_Tape_Value_Selected_Option_From_Draft_Rule.textContent() || '');
      vars["Chase Field Name Selected Option From Draft Rule"] = (await importRulePage.Chase_Field_Name_Selected_Option_From_Draft_Rule.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; }));
      vars["Chase Value Selected Option From Draft Rule"] = (await importRulePage.Chase_Value_Selected_Option_From_Draft_Rule.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; }));
      log.stepPass('Draft Rule Name: ' + vars["Draft Rule Name"] + '. All draft rule field values stored');
    } catch (e) {
      await log.stepFail(page, 'Failed to store draft rule field values');
      throw e;
    }

    log.step('Save Draft, Exit, and verify status in Bid Map list screen');
    try {
      await correspondentPortalPage.Save_Draft_Button1.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await exitButtonPage.Exit_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      vars["StatusInListScreen"] = await p1MoreButtonPage.get_Status_In_BidMap_Listcreen(vars['CreateNewMap']).textContent() || '';
      await expect(p1MoreButtonPage.get_Status_In_BidMap_Listcreen(vars['CreateNewMap'])).toContainText(vars["StatusInListScreen"]);
      log.stepPass('Draft saved and exited. Status in list screen: ' + vars["StatusInListScreen"]);
    } catch (e) {
      await log.stepFail(page, 'Failed to Save Draft, Exit, or verify status in list screen');
      throw e;
    }

    log.tcEnd('PASS');

  } catch (e) {
    await log.captureOnFailure(page, TC_ID, e);
    log.tcEnd('FAIL');
    throw e;
  }
}