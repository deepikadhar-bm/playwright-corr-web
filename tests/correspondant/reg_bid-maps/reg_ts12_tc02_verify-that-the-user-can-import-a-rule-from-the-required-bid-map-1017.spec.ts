import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ActionruleheaderPage } from '../../../src/pages/correspondant/actionruleheader';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { ImportRulePage } from '../../../src/pages/correspondant/import-rule';
import { P15Active2Page } from '../../../src/pages/correspondant/p-15-active-2';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { RulesAndActionsPage } from '../../../src/pages/correspondant/rules-and-actions';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { runPrereq_788 } from '../../../src/helpers/prereqs/prereq-788';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS12_TC02';
const TC_TITLE = 'Verify that the user can import a rule from the required bid map.';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let actionruleheaderPage: ActionruleheaderPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let importRulePage: ImportRulePage;
  let p15Active2Page: P15Active2Page;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let rulesAndActionsPage: RulesAndActionsPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactivePage: StatusInactivePage;
  let Methods: AddonHelpers;


  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_788(page, vars);
    actionruleheaderPage = new ActionruleheaderPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    importRulePage = new ImportRulePage(page);
    p15Active2Page = new P15Active2Page(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    rulesAndActionsPage = new RulesAndActionsPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactivePage = new StatusInactivePage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    if (profile && profile.data) {
      vars["Rule Name"] = profile.data[0]['Rule Name'];
      vars["New Rule Name"] = profile.data[0]['New Rule Name'];
      vars["Duplicated Rule Name"] = profile.data[0]['Duplicated Rule Name'];
      vars["Condition Bid Field"] = profile.data[0]['Condition Bid Field'];
      vars["Operation1"] = profile.data[0]['Operation1'];
      vars["Operation2"] = profile.data[0]['Operation2'];
    }

    try {

      log.step('Create Bid Map up to Header Mapping');
      try {
        const fileName = fileconstants.BID_QA_FILE_COMMON;
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars, fileName);
        log.stepPass('Bid Map created up to Header Mapping');
      } catch (e) {
        await log.stepFail(page, 'Failed to create Bid Map up to Header Mapping');
        throw e;
      }

      log.step('Navigate through Enumeration Mapping and Rules and Actions');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await correspondentPortalPage.Heading_Save_and_Move_to_Next_Page1.waitFor({ state: 'visible' });
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Rules and Actions screen');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Rules and Actions screen');
        throw e;
      }

      log.step('Open Import Rule dialog and search by keyword');
      try {
        await correspondentPortalPage.Import_Rule_Button.click();
        Methods.splitBySpecialChar(vars["CreateNewMaps"], '_', '0', 'Bid Map Keyword');
        await statusInactive2Page.Search_Map_EnumerationMapping.fill(vars["Bid Map Keyword"]);
        await importRulePage.Searching.waitFor({ state: 'hidden' });
        await importRulePage.Keyword_Related_Maps.first().waitFor({ state: 'visible' });
        log.stepPass('Import Rule dialog opened and keyword search returned results. Keyword: ' + vars["Bid Map Keyword"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to open Import Rule dialog or search by keyword');
        throw e;
      }

      log.step('Search by full map name and verify active and draft rules visibility');
      try {
        await statusInactive2Page.Search_Map_EnumerationMapping.clear();
        await statusInactive2Page.Search_Map_EnumerationMapping.type(vars["CreateNewMaps"]);
        await importRulePage.Searching.waitFor({ state: 'hidden' });
        await statusInactive2Page.Import_Rule_dropdown(vars['CreateNewMaps']).click();
        await page.getByText(vars["First Active Rule Name"]).first().waitFor({ state: 'visible' });
        await expect(page.getByText(vars["Second Active Rule Name"]).first()).toBeVisible();
        await expect(page.getByText(vars["Draft Rule Name"])).not.toBeVisible();
        log.stepPass('Active rules visible; draft rule not visible in dropdown');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify active/draft rule visibility in dropdown');
        throw e;
      }

      log.step('Search rules by name and verify search results');
      try {
        await statusInactive2Page.Search_Field_ImportRule.clear();
        await statusInactive2Page.Search_Field_ImportRule.type(vars["Draft Rule Name"]);
        await importRulePage.No_Result_Message.waitFor({ state: 'visible' });
        await statusInactive2Page.Search_Field_ImportRule.clear();
        await statusInactive2Page.Search_Field_ImportRule.type(vars["First Active Rule Name"]);
        await page.getByText(vars["First Active Rule Name"]).waitFor({ state: 'visible' });
        await statusInactive2Page.Search_Field_ImportRule.clear();
        await statusInactive2Page.Search_Field_ImportRule.type(vars["Second Active Rule Name"]);
        await page.getByText(vars["Second Active Rule Name"]).last().waitFor({ state: 'visible' });
        await statusInactive2Page.Search_Field_ImportRule.clear();
        await page.waitForTimeout(3000);
        log.stepPass('Search by draft rule shows no result; search by active rules returns correct results');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify rule search results');
        throw e;
      }

      log.step('Select both active rules and verify Apply Selected count');
      try {
        await expect(importRulePage.Disabled_Apply_Selected_Button).toBeVisible();
        vars['FirstActiveRuleName'] = vars["First Active Rule Name"];
        await importRulePage.First_Active_Rule_Checkbox(vars['FirstActiveRuleName']).check();
        await expect(importRulePage.Disabled_Apply_Selected_Button).not.toBeVisible();
        await expect(importRulePage.Apply_Selected_Button).toBeEnabled();
        vars["Apply Selected Count"] = await importRulePage.Apply_Selected_Count.textContent() || '';
        Methods.trimtestdata(vars["Apply Selected Count"], "Apply Selected Count");
        Methods.verifyString(vars["Apply Selected Count"], 'equals', appconstants.ONE);
        vars['SecondActiveRuleName'] = vars['Second Active Rule Name'];
        await importRulePage.Second_Active_Rule_Checkbox(vars['SecondActiveRuleName']).check();
        vars["Apply Selected Count"] = await importRulePage.Apply_Selected_Count.textContent() || '';
        Methods.trimtestdata(vars["Apply Selected Count"], "Apply Selected Count");
        Methods.verifyString(vars["Apply Selected Count"], 'equals', appconstants.TWO);
        log.stepPass('Both active rules selected. Apply Selected count: ' + vars["Apply Selected Count"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to select rules or verify Apply Selected count');
        throw e;
      }

      log.step('Apply selected rules and verify first active rule fields are imported correctly');
      try {
        await p15Active2Page.Apply_Selected_Button_ruls.click();
        await actionruleheaderPage.Rules_and_Actions_Heading.waitFor({ state: 'visible' });
        await expect(rulesAndActionsPage.First_Rule_Name_Field).toHaveValue(vars["First Active Rule Name"]);

        log.info('Verifying First Active Rule Multiselected Value');
        vars["First Active Rule Multiselected Value from 2nd BidMp"] = await importRulePage.First_Active_Rule_Multiselected_Value.textContent() || '';
        Methods.trimWhitespace(vars["First Active Rule Multiselected Value from 2nd BidMp"], 'First Active Rule Multiselected Value from 2nd BidMp');
        Methods.trimWhitespace(vars["First Active Rule Multiselected Value"], 'First Active Rule Multiselected Value');
        Methods.verifyString(vars["First Active Rule Multiselected Value"], 'equals', vars["First Active Rule Multiselected Value from 2nd BidMp"]);

        log.info('Verifying Bid Field Selected Option from First Active Rule');
        vars["Bid Field Selected Option From Active 1st Rule from 2nd BidMap"] = await importRulePage.Bid_Field_Selected_Option_From_Active_1st_Rule.textContent() || '';
        Methods.trimWhitespace(vars["Bid Field Selected Option From Active 1st Rule from 2nd BidMap"], 'Bid Field Selected Option From Active 1st Rule from 2nd BidMap');
        Methods.trimWhitespace(vars["Bid Field Selected Option From Active 1st Rule"], 'Bid Field Selected Option From Active 1st Rule');
        Methods.verifyString(vars["Bid Field Selected Option From Active 1st Rule"], 'equals', vars["Bid Field Selected Option From Active 1st Rule from 2nd BidMap"]);

        log.info('Verifying Bid Enumerated Tape Value Selected Option from First Active Rule');
        vars["Bid Enumerated Tape Value Selected Option From Active 1st Rule from 2nd BidMap"] = await importRulePage.Bid_Enumerated_Tape_Value_Selected_Option_From_Active_1st_Rule.textContent() || '';
        Methods.trimWhitespace(vars["Bid Enumerated Tape Value Selected Option From Active 1st Rule from 2nd BidMap"], 'Bid Enumerated Tape Value Selected Option From Active 1st Rule from 2nd BidMap');
        Methods.trimWhitespace(vars["Bid Enumerated Tape Value Selected Option From Active 1st Rule"], 'Bid Enumerated Tape Value Selected Option From Active 1st Rule');
        Methods.verifyString(vars["Bid Enumerated Tape Value Selected Option From Active 1st Rule"], 'equals', vars["Bid Enumerated Tape Value Selected Option From Active 1st Rule from 2nd BidMap"]);

        log.info('Verifying Chase Field Name Selected Option from First Active Rule');
        vars["Chase Field Name Selected Option From Active 1st Rule from 2nd BidMap"] = await importRulePage.Chase_Field_Name_Selected_Option_From_Active_1st_Rule.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        Methods.trimWhitespace(vars["Chase Field Name Selected Option From Active 1st Rule from 2nd BidMap"], 'Chase Field Name Selected Option From Active 1st Rule from 2nd BidMap');
        Methods.trimWhitespace(vars["Chase Field Name Selected Option From Active 1st Rule"], 'Chase Field Name Selected Option From Active 1st Rule');
        Methods.verifyString(vars["Chase Field Name Selected Option From Active 1st Rule"], 'equals', vars["Chase Field Name Selected Option From Active 1st Rule from 2nd BidMap"]);

        log.info('Verifying Chase Value Selected Option from First Active Rule');
        vars["Chase Value Selected Option From Active 1st Rule from 2nd BidMap"] = await importRulePage.Chase_Value_Selected_Option_From_Active_1st_Rule.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        Methods.trimWhitespace(vars["Chase Value Selected Option From Active 1st Rule from 2nd BidMap"], 'Chase Value Selected Option From Active 1st Rule from 2nd BidMap');
        Methods.trimWhitespace(vars["Chase Value Selected Option From Active 1st Rule"], 'Chase Value Selected Option From Active 1st Rule');
        Methods.verifyString(vars["Chase Value Selected Option From Active 1st Rule"], 'equals', vars["Chase Value Selected Option From Active 1st Rule from 2nd BidMap"]);

        log.stepPass('First active rule imported and all fields verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify first active rule imported fields');
        throw e;
      }

      log.step('Verify second active rule fields are imported correctly');
      try {
        await expect(statusInactive2Page.Rule_Name).toHaveValue(vars["Second Active Rule Name"]);

        log.info('Verifying Second Active Rule Multiselected Value');
        vars["Second Active Rule Multiselected Value from 2nd Bid Map"] = await rulesAndActionsPage.Select_Category_DropdownDuplicated.textContent() || '';
        Methods.trimWhitespace(vars["Second Active Rule Multiselected Value from 2nd Bid Map"], 'Second Active Rule Multiselected Value from 2nd Bid Map');
        Methods.trimWhitespace(vars["Second Active Rule Multiselected Value"], 'Second Active Rule Multiselected Value');
        Methods.verifyString(vars["Second Active Rule Multiselected Value from 2nd Bid Map"], 'equals', vars["Second Active Rule Multiselected Value"]);

        log.info('Verifying Bid Field Selected Option from Second Active Rule');
        vars["Bid Field Selected Option From Active 2nd Rule from 2nd BidMap"] = await importRulePage.Bid_Field_Selected_Option_From_Active_2nd_Rule.textContent() || '';
        Methods.trimWhitespace(vars["Bid Field Selected Option From Active 2nd Rule from 2nd BidMap"], 'Bid Field Selected Option From Active 2nd Rule from 2nd BidMap');
        Methods.trimWhitespace(vars["Bid Field Selected Option From Active 2nd Rule"], 'Bid Field Selected Option From Active 2nd Rule');
        Methods.verifyString(vars["Bid Field Selected Option From Active 2nd Rule from 2nd BidMap"], 'equals', vars["Bid Field Selected Option From Active 2nd Rule"]);

        log.info('Verifying Bid Enumerated Tape Value Selected Option from Second Active Rule');
        Methods.trimWhitespace(vars["Bid Enumerated Tape Value Selected Option From Active 2nd Rule"], 'Bid Enumerated Tape Value Selected Option From Active 2nd Rule');
        vars["Bid Enumerated Tape Value Selected Option From Active 2nd Rule from 2nd Bid Map"] = await importRulePage.Bid_Enumerated_Tape_Value_Selected_Option_From_Active_2nd_Rule.textContent() || '';
        Methods.trimWhitespace(vars["Bid Enumerated Tape Value Selected Option From Active 2nd Rule from 2nd Bid Map"], 'Bid Enumerated Tape Value Selected Option From Active 2nd Rule from 2nd Bid Map');
        Methods.verifyString(vars["Bid Enumerated Tape Value Selected Option From Active 2nd Rule"], 'equals', vars["Bid Enumerated Tape Value Selected Option From Active 2nd Rule from 2nd Bid Map"]);

        log.info('Verifying Chase Field Name Selected Option from Second Active Rule');
        vars["Chase Field Name Selected Option From Active 2nd Rule from 2nd BidMap"] = await importRulePage.Chase_Field_Name_Selected_Option_From_Active_2nd_Rule.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        Methods.trimWhitespace(vars["Chase Field Name Selected Option From Active 2nd Rule from 2nd BidMap"], 'Chase Field Name Selected Option From Active 2nd Rule from 2nd BidMap');
        Methods.trimWhitespace(vars["Chase Field Name Selected Option From Active 2nd Rule"], 'Chase Field Name Selected Option From Active 2nd Rule');
        Methods.verifyString(vars["Chase Field Name Selected Option From Active 2nd Rule from 2nd BidMap"], 'equals', vars["Chase Field Name Selected Option From Active 2nd Rule"]);

        log.info('Verifying Chase Value Selected Option from Second Active Rule');
        vars["Chase Value Selected Option From Active 2nd Rule from 2nd BidMap"] = await importRulePage.Chase_Value_Selected_Option_From_Active_2nd_Rule.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        Methods.trimWhitespace(vars["Chase Value Selected Option From Active 2nd Rule from 2nd BidMap"], 'Chase Value Selected Option From Active 2nd Rule from 2nd BidMap');
        Methods.trimWhitespace(vars["Chase Value Selected Option From Active 2nd Rule"], 'Chase Value Selected Option From Active 2nd Rule');
        Methods.verifyString(vars["Chase Value Selected Option From Active 2nd Rule from 2nd BidMap"], 'equals', vars["Chase Value Selected Option From Active 2nd Rule"]);

        log.stepPass('Second active rule imported and all fields verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify second active rule imported fields');
        throw e;
      }

      log.step('Verify draft rule block fields are not present');
      try {
        await expect(statusInactivePage.Enter_Rule_Name).not.toBeVisible();
        await expect(importRulePage.Draft_Rule_Multiselected_Value).not.toBeVisible();
        await expect(importRulePage.Bid_Field_Selected_Option_From_Draft_Rule).not.toBeVisible();
        await expect(importRulePage.Bid_Enumerated_Tape_Value_Selected_Option_From_Draft_Rule).not.toBeVisible();
        await expect(importRulePage.Chase_Field_Name_Selected_Option_From_Draft_Rule).not.toBeVisible();
        await expect(importRulePage.Chase_Value_Selected_Option_From_Draft_Rule).not.toBeVisible();
        log.stepPass('All draft rule block fields are not present as expected');
      } catch (e) {
        await log.stepFail(page, 'Draft rule block fields are unexpectedly present');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});