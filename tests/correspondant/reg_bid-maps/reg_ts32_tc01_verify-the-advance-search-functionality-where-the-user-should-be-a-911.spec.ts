import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { CorrespondentPortal18Page } from '../../../src/pages/correspondant/correspondent-portal-18';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SaveDraftExitButtonPage } from '../../../src/pages/correspondant/save-draft-exit-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';
import { testDataManager } from 'testdata/TestDataManager';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { APP_CONSTANTS } from 'src/constants/app-constants';


const TC_ID = 'REG_TS32_TC01';
const TC_TITLE = 'Verify the advance search functionality, where the user should be able to perform search action based on the rules and actions.[Bidmap Creation]';

const profileName1 = 'Bid_Maps';
const profile1 = testDataManager.getProfileByName(profileName1);
let reg_ts32_testFailed = false;

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidmapPage: BidmapPage;
  let correspondentPortal18Page: CorrespondentPortal18Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let saveDraftExitButtonPage: SaveDraftExitButtonPage;
  let spinnerPage: SpinnerPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    bidmapPage = new BidmapPage(page);
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    saveDraftExitButtonPage = new SaveDraftExitButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    
    try {

      log.step('Login to CORR Portal and verify dashboard');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await expect(correspondentPortalPage.Heading_Dashboard).toBeVisible();
        log.stepPass('Login to CORR Portal and dashboard verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Login to CORR Portal or dashboard verification failed');
        throw e;
      }

      log.step('Enable Smart Mapper and create first Bid Map up to header mapping');
      try {
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping_for_Advanced_Search(page, vars, fileconstants.BID_QA_FILE_COMMON);
        vars['BidMapName1'] = vars['CreateNewMap'];
        log.info('BidMapName1: ' + vars['BidMapName1']);
        log.stepPass('Smart Mapper enabled and first Bid Map created successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to enable Smart Mapper or create first Bid Map');
        throw e;
      }

      log.step('Navigate through Enumeration Mapping and Rules and Actions for first Bid Map');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await bidmapPage.Yes_Proceed_Button_Text.click();
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.waitFor({ state: 'visible' });
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        if (await bidmapPage.Yes_Proceed_Button_Text.isVisible()) /* Element Yes Proceed Button Text is visible */ {
          await bidmapPage.Yes_Proceed_Button_Text.click();
        }
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated through Enumeration Mapping and Rules and Actions for first Bid Map successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate through Enumeration Mapping and Rules and Actions for first Bid Map');
        throw e;
      }

      log.step('Add rules and actions and save and publish first Bid Map');
      try {
        //await stepGroups.stepGroup_Adding_Rules_In_Rules_and_Actions_Screen(page, vars);
        const CorrPortalElem = new CorrPortalPage(page);

        await CorrPortalElem.Add_Rule_Button.click();
        await CorrPortalElem.Rule_Name_Field.pressSequentially(APP_CONSTANTS.RuleName1);
        vars["Rule Name"] = await CorrPortalElem.Rule_Name_Field.inputValue() || '';
        await expect(CorrPortalElem.Rule_Name_Field).toHaveValue(APP_CONSTANTS.RuleName1);
        await CorrPortalElem.Select_Category_Dropdown.click();
        vars["CategoryName"] = await CorrPortalElem.Select_Category_On_Rules_and_Actions.textContent() || '';
        await CorrPortalElem.Select_Category.check();
        await CorrPortalElem.Apply_Selected_1_button_in_Rule.click();
        await CorrPortalElem.When_Bid_Field_in_Add_Conditions.waitFor({ state: "visible" })
        await CorrPortalElem.When_Bid_Field_in_Add_Conditions.click();
        await CorrPortalElem.Search_Field.waitFor({ state: "visible" })
        await CorrPortalElem.Search_Field.fill(APP_CONSTANTS.ConditionBidField);
        vars["BidField"] = await CorrPortalElem.Search_Field.inputValue() || '';
        await CorrPortalElem.Select_Button.waitFor({ state: "visible" })
        await CorrPortalElem.Select_Button.click();
        expect(String(vars["BidField"])).toBe(APP_CONSTANTS.ConditionBidField);
        await CorrPortalElem.Operation_Dropdown.first().selectOption({ value: APP_CONSTANTS.Operation1 });
        await CorrPortalElem.Bid_Enumeration_Tape_Value_in_Rule.click();
        await CorrPortalElem.Search_Field_in_Bid_Enumerated_Tape_Value.click();
        await CorrPortalElem.Bid_Enumerated_Search_Field.fill(APP_CONSTANTS.BidEnumeratedTapeValue1);
        await expect(CorrPortalElem.Search_Field_in_Bid_Enumerated_Tape_Value).toHaveValue(APP_CONSTANTS.BidEnumeratedTapeValue1);
        await CorrPortalElem.Select_Button.click();
        vars["RuleBidField1"] = vars["BidField"];
        vars["RuleCondition1"] = await CorrPortalElem.Operation_Dropdown.inputValue() || '';
        vars["RuleBidTapeValue1"] = vars["BidEnumeratedTapeValue"];
        //await stepGroups.stepGroup_Adding_Actions_In_Rules_and_Actions_Screen(page, vars);
        const Methods = new AddonHelpers(page, vars);

        await CorrPortalElem.Chase_Field_Name.selectOption({ label: APP_CONSTANTS.UniqueChaseFieldName1 });
        await CorrPortalElem.Chase_Value_Dropdown_Rules_Actions.click();
        await CorrPortalElem.Chase_Value_Search_field.fill(APP_CONSTANTS.UniqueChaseValue1);
        await CorrPortalElem.Select_text_Chase_Value.click();
        vars["ChaseFieldNameAddActions1"] = await CorrPortalElem.Add_Actions_Chase_Field_Name.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        vars["ChaseValueAddActions1"] = await CorrPortalElem.Add_Actions_Chase_Value_Not_a_list.textContent() || '';
        Methods.trimtestdata(vars["ChaseValueAddActions1"], 'ChaseValueAddActions1');
        await saveAndPublishButtonPage.Save_and_Publish_Button.waitFor({ state: 'visible' });
        await saveAndPublishButtonPage.Save_and_Publish_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Rules and actions added and first Bid Map saved and published successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to add rules and actions or save and publish first Bid Map');
        throw e;
      }

      log.step('Create second Bid Map up to header mapping');
      try {
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping_for_Advanced_Search(page, vars, fileconstants.BID_QA_FILE_COMMON);
        vars['BidMapName2'] = vars['CreateNewMap'];
        log.info('BidMapName2: ' + vars['BidMapName2']);
        log.stepPass('Second Bid Map created successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to create second Bid Map');
        throw e;
      }

      log.step('Navigate through Enumeration Mapping and Rules and Actions for second Bid Map');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await correspondentPortal18Page.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await correspondentPortal18Page.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated through Enumeration Mapping and Rules and Actions for second Bid Map successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate through Enumeration Mapping and Rules and Actions for second Bid Map');
        throw e;
      }

      log.step('Add rules and actions and save and publish second Bid Map');
      try {
        //await stepGroups.stepGroup_Adding_Rules_In_Rules_and_Actions_Screen(page, vars);
        const CorrPortalElem = new CorrPortalPage(page);

        await CorrPortalElem.Add_Rule_Button.click();
        await CorrPortalElem.Rule_Name_Field.pressSequentially(APP_CONSTANTS.RuleName2);
        vars["Rule Name"] = await CorrPortalElem.Rule_Name_Field.inputValue() || '';
        await expect(CorrPortalElem.Rule_Name_Field).toHaveValue(APP_CONSTANTS.RuleName2);
        await CorrPortalElem.Select_Category_Dropdown.click();
        vars["CategoryName"] = await CorrPortalElem.Select_Category_On_Rules_and_Actions.textContent() || '';
        await CorrPortalElem.Select_Category.check();
        await CorrPortalElem.Apply_Selected_1_button_in_Rule.click();
        await CorrPortalElem.When_Bid_Field_in_Add_Conditions.waitFor({ state: "visible" })
        await CorrPortalElem.When_Bid_Field_in_Add_Conditions.click();
        await CorrPortalElem.Search_Field.waitFor({ state: "visible" })
        await CorrPortalElem.Search_Field.fill(APP_CONSTANTS.ConditionBidField);
        vars["BidField"] = await CorrPortalElem.Search_Field.inputValue() || '';
        await CorrPortalElem.Select_Button.waitFor({ state: "visible" })
        await CorrPortalElem.Select_Button.click();
        expect(String(vars["BidField"])).toBe(APP_CONSTANTS.ConditionBidField);
        await CorrPortalElem.Operation_Dropdown.first().selectOption({ value: APP_CONSTANTS.Operation2 });
        await CorrPortalElem.Bid_Enumeration_Tape_Value_in_Rule.click();
        await CorrPortalElem.Search_Field_in_Bid_Enumerated_Tape_Value.click();
        await CorrPortalElem.Bid_Enumerated_Search_Field.fill(APP_CONSTANTS.BidEnumeratedTapeValue2);
        await expect(CorrPortalElem.Search_Field_in_Bid_Enumerated_Tape_Value).toHaveValue(APP_CONSTANTS.BidEnumeratedTapeValue2);
        await CorrPortalElem.Select_Button.click();
        vars["RuleBidField2"] = vars["BidField"];
        vars["RuleCondition2"] = await CorrPortalElem.Operation_Dropdown.inputValue() || '';
        vars["RuleBidTapeValue2"] = vars["BidEnumeratedTapeValue2"];
        // await stepGroups.stepGroup_Adding_Actions_In_Rules_and_Actions_Screen(page, vars);
        // const CorrPortalElem = new CorrPortalPage(page);
        const Methods = new AddonHelpers(page, vars);

        await CorrPortalElem.Chase_Field_Name.selectOption({ label: APP_CONSTANTS.UniqueChaseFieldName1});
        await CorrPortalElem.Chase_Value_Dropdown_Rules_Actions.click();
        await CorrPortalElem.Chase_Value_Search_field.fill(APP_CONSTANTS.UniqueChaseValue1);
        await CorrPortalElem.Select_text_Chase_Value.click();
        vars["ChaseFiledNameActions2"] = await CorrPortalElem.Add_Actions_Chase_Field_Name.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        vars["ChaseValueAddActions2"] = await CorrPortalElem.Add_Actions_Chase_Value_Not_a_list.textContent() || '';
        Methods.trimtestdata(vars["ChaseValueAddActions2"], 'ChaseValueAddActions2');
        await saveAndPublishButtonPage.Save_and_Publish_Button.waitFor({ state: 'visible' });
        await saveAndPublishButtonPage.Save_and_Publish_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Rules and actions added and second Bid Map saved and published successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to add rules and actions or save and publish second Bid Map');
        throw e;
      }

      log.step('Create new Bid Mapping for search action based on rules');
      try {
        await stepGroups.stepGroup_Creating_New_Bid_Mapping_For_search_action_based_on_the_rule(page, vars);
        vars['Common Keyword'] = 'TS_AdvanceSearch';
        log.stepPass('New Bid Mapping for search action created successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to create new Bid Mapping for search action');
        throw e;
      }

      log.step('Create third Bid Map up to header mapping');
      try {
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping_for_Advanced_Search(page, vars, fileconstants.BID_QA_FILE_COMMON);
        vars['BidMapName3'] = vars['CreateNewMap'];
        log.info('BidMapName3: ' + vars['BidMapName3']);
        log.stepPass('Third Bid Map created successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to create third Bid Map');
        throw e;
      }

      log.step('Navigate through Enumeration Mapping and Rules and Actions for third Bid Map');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await bidmapPage.Yes_Proceed_Button_Text.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await correspondentPortal18Page.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated through Enumeration Mapping and Rules and Actions for third Bid Map successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate through Enumeration Mapping and Rules and Actions for third Bid Map');
        throw e;
      }

      log.step('Add rules and actions and save draft for third Bid Map');
      try {
        //await stepGroups.stepGroup_Adding_Rules_In_Rules_and_Actions_Screen(page, vars);
        const CorrPortalElem = new CorrPortalPage(page);

        await CorrPortalElem.Add_Rule_Button.click();
        await CorrPortalElem.Rule_Name_Field.pressSequentially(APP_CONSTANTS.RuleName3);
        vars["Rule Name"] = await CorrPortalElem.Rule_Name_Field.inputValue() || '';
        await expect(CorrPortalElem.Rule_Name_Field).toHaveValue(APP_CONSTANTS.RuleName3);
        await CorrPortalElem.Select_Category_Dropdown.click();
        vars["CategoryName"] = await CorrPortalElem.Select_Category_On_Rules_and_Actions.textContent() || '';
        await CorrPortalElem.Select_Category.check();
        await CorrPortalElem.Apply_Selected_1_button_in_Rule.click();
        await CorrPortalElem.When_Bid_Field_in_Add_Conditions.waitFor({ state: "visible" })
        await CorrPortalElem.When_Bid_Field_in_Add_Conditions.click();
        await CorrPortalElem.Search_Field.waitFor({ state: "visible" })
        await CorrPortalElem.Search_Field.fill(APP_CONSTANTS.ConditionBidField);
        vars["BidField"] = await CorrPortalElem.Search_Field.inputValue() || '';
        await CorrPortalElem.Select_Button.waitFor({ state: "visible" })
        await CorrPortalElem.Select_Button.click();
        expect(String(vars["BidField"])).toBe(APP_CONSTANTS.ConditionBidField);
        await CorrPortalElem.Operation_Dropdown.first().selectOption({ value: APP_CONSTANTS.Operation3 });
        await CorrPortalElem.Bid_Enumeration_Tape_Value_in_Rule.click();
        await CorrPortalElem.Search_Field_in_Bid_Enumerated_Tape_Value.click();
        await CorrPortalElem.Bid_Enumerated_Search_Field.fill(APP_CONSTANTS.BidEnumeratedTapeValue3);
        await expect(CorrPortalElem.Search_Field_in_Bid_Enumerated_Tape_Value).toHaveValue(APP_CONSTANTS.BidEnumeratedTapeValue3);
        await CorrPortalElem.Select_Button.click();
        vars["RuleBidField3"] = vars["BidField"];
        vars["RuleCondition3"] = await CorrPortalElem.Operation_Dropdown.inputValue() || '';
        vars["RuleBidTapeValue3"] = vars["BidEnumeratedTapeValue3"];
        //await stepGroups.stepGroup_Adding_Actions_In_Rules_and_Actions_Screen(page, vars);
        //const CorrPortalElem = new CorrPortalPage(page);
        const Methods = new AddonHelpers(page, vars);

        await CorrPortalElem.Chase_Field_Name.selectOption({ label: APP_CONSTANTS.UniqueChaseFieldName3 });
        await CorrPortalElem.Chase_Value_Dropdown_Rules_Actions.click();
        await CorrPortalElem.Chase_Value_Search_field.fill(APP_CONSTANTS.UniqueChaseValue3);
        await CorrPortalElem.Select_text_Chase_Value.click();
        vars["ChaseFiledNameAddActions3"] = await CorrPortalElem.Add_Actions_Chase_Field_Name.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        vars["ChaseValueAddActions3"] = await CorrPortalElem.Add_Actions_Chase_Value_Not_a_list.textContent() || '';
        Methods.trimtestdata(vars["ChaseValueAddActions3"], 'ChaseValueAddActions3');
        await saveDraftExitButtonPage.Save_Draft_Exit_Button.waitFor({ state: 'visible' });
        await saveDraftExitButtonPage.Save_Draft_Exit_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Rules and actions added and third Bid Map saved as draft successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to add rules and actions or save draft for third Bid Map');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      reg_ts32_testFailed = true;
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
  test.afterEach(async ({ page }) => {
    if (reg_ts32_testFailed) {
      log.info('Test failed, initiating cleanup of created advanced search bid maps');
      try {
        if (await correspondentPortalPage.CrossButton_Edit_Customer_Permissions.isVisible()) {
          await correspondentPortalPage.CrossButton_Edit_Customer_Permissions.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        }
        const CorrPortalElem = new CorrPortalPage(page);
        await CorrPortalElem.Administration_Menu.click();
        await CorrPortalElem.Bid_Maps_Menu.click();
        await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
        await expect(CorrPortalElem.Mappings).toBeVisible();
        const count = await CorrPortalElem.Advanced_Search_Bid_maps_Delete_Button_1.count();
        vars["Advanced_Search_Bid_maps_Count"] = String(count);
        log.info(`Found ${vars["Advanced_Search_Bid_maps_Count"]} advanced search bid maps to delete`);
        let iteration = 0;
        while (await CorrPortalElem.Advanced_Search_Bid_maps_Delete_Button_1.count() > 0) {
          iteration++;
          log.info(`Iteration ${iteration}`);
          log.info(`Attempting to delete advanced search bid map. Remaining count before deletion: ${await CorrPortalElem.Advanced_Search_Bid_maps_Delete_Button_1.count()}`);
        
            const deleteButton = CorrPortalElem.Advanced_Search_Bid_maps_Delete_Button_1.first();

            await deleteButton.waitFor({ state: 'visible' });

            await deleteButton.click();
            log.info(`Clicked delete button for one advanced search bid map`);

            // Confirm delete
            await correspondentPortal18Page.Yes_Proceed_Button.waitFor({ state: 'visible' });
            await correspondentPortal18Page.Yes_Proceed_Button.click();
            log.info(`Clicked on Yes Proceed button to confirm deletion of advanced search bid map`);
            await correspondentPortal18Page.Yes_Proceed_Button.waitFor({ state: 'hidden' });
            await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
        }
        const count1 = await CorrPortalElem.Advanced_Search_Bid_maps_Delete_Button_1.count();
        if (count1 === 0) {
          log.info('All advanced search bid maps deleted successfully');
        }
        else {
          log.info(`Some advanced search bid maps could not be deleted. Remaining count: ${count1}`);
        }
      } catch (e) {
        log.stepFail(page, 'Failed to delete the created advanced search bid maps in cleanup');
      }
    }
    else {
      log.info('No cleanup needed as test passed');
    }
  });
});