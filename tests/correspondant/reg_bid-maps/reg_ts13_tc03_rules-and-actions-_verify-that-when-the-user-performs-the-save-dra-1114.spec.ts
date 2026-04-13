import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ActionruleheaderPage } from '../../../src/pages/correspondant/actionruleheader';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { ChaseFieldName2Page } from '../../../src/pages/correspondant/chase-field-name-2';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { ChaseValuePage } from '../../../src/pages/correspondant/chase-value';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { DuplicatecopyButtonPage } from '../../../src/pages/correspondant/duplicatecopy-button';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { RulecheckbidMapPage } from '../../../src/pages/correspondant/rulecheckbid-map';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { RulesAndActionsPage } from '../../../src/pages/correspondant/rules-and-actions';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactive4Page } from '../../../src/pages/correspondant/status-inactive--4';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';


const TC_ID = 'REG_TS13_TC03';
const TC_TITLE = 'Verify that when the user performs the "Save Draft" action on each screen, a draft version is saved.[Rules and Actions]';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let actionruleheaderPage: ActionruleheaderPage;
  let bidmapPage: BidmapPage;
  let chaseFieldName2Page: ChaseFieldName2Page;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let chaseValuePage: ChaseValuePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let duplicatecopyButtonPage: DuplicatecopyButtonPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let rulecheckbidMapPage: RulecheckbidMapPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let rulesAndActionsPage: RulesAndActionsPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactive4Page: StatusInactive4Page;
  let statusInactivePage: StatusInactivePage;
  let Methods: AddonHelpers;

  const credentials = ENV.getCredentials('internal');

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    actionruleheaderPage = new ActionruleheaderPage(page);
    bidmapPage = new BidmapPage(page);
    chaseFieldName2Page = new ChaseFieldName2Page(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    chaseValuePage = new ChaseValuePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    duplicatecopyButtonPage = new DuplicatecopyButtonPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    rulecheckbidMapPage = new RulecheckbidMapPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    rulesAndActionsPage = new RulesAndActionsPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactive4Page = new StatusInactive4Page(page);
    statusInactivePage = new StatusInactivePage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    if (profile && profile.data) {
      vars["New Rule Name"] = profile.data[0]['New Rule Name'];
      vars["Operation2"] = profile.data[0]['Operation2'];
      vars["Duplicated Rule Name"] = profile.data[0]['Duplicated Rule Name'];
      vars["Rule Name"] = profile.data[0]['Rule Name'];
      vars["BidEnumeratedTapeValue"] = profile.data[0]['BidEnumeratedTapeValue'];
      vars["BidFields"] = profile.data[0]['BidFields'];
      vars["Bid Enumerated Tape Value"] = profile.data[0]['Bid Enumerated Tape Value'];
      vars["Condition Bid Field"] = profile.data[0]['Condition Bid Field'];
      vars["Operation1"] = profile.data[0]['Operation1'];
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
        log.stepPass('Smart Mapper enabled and Bid Map created up to Header Mapping');
      } catch (e) {
        await log.stepFail(page, 'Failed to enable Smart Mapper or create Bid Map');
        throw e;
      }

      log.step('Navigate through Enumeration Mapping and Rules and Actions');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(rulesAndActionsButtonPage.Rules_and_Actions_Button).toBeVisible();
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await bidmapPage.Yes_Proceed_Button_Text.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Rules and Actions screen');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Rules and Actions screen');
        throw e;
      }

      log.step('Add Rules and Actions in Rules and Actions screen');
      try {
        await stepGroups.stepGroup_Adding_Rules_In_Rules_and_Actions_Screen(page, vars);
        await stepGroups.stepGroup_Add_Actions_in_Rules_and_Actions(page, vars);
        vars['ActionChaseFieldName'] = vars["ChaseFiledNameonAddActions"];
        vars['ActionChaseValue'] = vars["ChasevalueOnAddActions"];
        log.stepPass('Rules and Actions added successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to add Rules and Actions');
        throw e;
      }

      log.step('Save Draft and verify draft is saved on the same screen');
      try {
        await correspondentPortalPage.Save_Draft_Button1.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Enter_a_Rule_Name_Field).toHaveValue(vars["Rule Name"]);
        await statusInactivePage.Selected1_Dropdown.click();
        await expect(rulesAndActionsPage.get_Category_In_Dropdown(vars['CategoryName'])).toBeVisible();
        await correspondentPortalPage.Apply_Selected_1_button_in_Rule.click();
        await expect(rulesAndActionsButtonPage.Condition_BidField_1).toContainText(vars["RuleBidField"]);
        await expect(chaseFieldNamePage.Operation_Dropdowns).toHaveValue(vars["RuleCondition"]);
        await expect(rulesAndActionsButtonPage.Condition_BidTape1).toContainText(vars["RuleBidTapeValue"]);
        // await expect(chaseFieldName2Page.Add_Actions_Chase_Field_Name).toHaveValue(vars["ActionChaseFieldName"]);
        await expect(chaseFieldName2Page.Add_Actions_Chase_Field_Name.locator('option:checked')).toHaveText(vars["ActionChaseFieldName"]);
        // await expect(chaseValuePage.Add_Actions_Chase_Value).toHaveValue(vars["ActionChaseValue"]);
        await expect(chaseValuePage.Add_Actions_Chase_Value.locator('option:checked')).toHaveText(vars["ActionChaseValue"]);
        log.stepPass('Draft verified: Rule Name, Condition, and Action fields match saved values');
      } catch (e) {
        await log.stepFail(page, 'Draft verification failed after Save Draft');
        throw e;
      }

      log.step('Edit Conditions and Actions in the saved draft rule');
      try {
        await stepGroups.stepGroup_Editing_of_Add_Conditions_and_Add_Actions(page, vars);
        await correspondentPortalPage.Enter_a_Rule_Name_Field.clear();
        await correspondentPortalPage.Enter_a_Rule_Name_Field.type(vars["New Rule Name"]);
        await expect(correspondentPortalPage.Enter_a_Rule_Name_Field).toHaveValue(vars["New Rule Name"]);
        await statusInactive4Page.Select_Category_Dropdown1.click();
        vars["EditedCategory"] = await rulesAndActionsPage.Second_Category_In_Dropdown.textContent() || '';
        await rulesAndActionsPage.Second_Category_Checkbox.check();
        await correspondentPortalPage.Apply_Selected_button_in_Rule.click();
        // await chaseFieldNamePage.Operation_Dropdowns.selectOption({ label: vars["Operation2"] });
        await chaseFieldNamePage.Operation_Dropdowns.selectOption({ value: vars["Operation2"] });
        // await expect(chaseFieldNamePage.Operation_Dropdowns).toHaveValue(vars["Operation2"]);
        await expect(chaseFieldNamePage.Operation_Dropdowns).toHaveValue(vars["Operation2"]);
        await actionruleheaderPage.Action_Chase_Field_Name_1.selectOption({ index: parseInt("17") });
        vars["EditedActionChaseFieldName"] = await actionruleheaderPage.Action_Chase_Field_Name_1.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        await rulecheckbidMapPage.Action_Chase_Value1.selectOption({ index: parseInt("1") });
        vars["EditedActionChaseValue"] = await rulecheckbidMapPage.Action_Chase_Value_1.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        log.stepPass('Conditions and Actions edited. Edited Action Chase Field Name: ' + vars["EditedActionChaseFieldName"] + ', Value: ' + vars["EditedActionChaseValue"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to edit Conditions and Actions');
        throw e;
      }

      log.step('Duplicate rule block and fill duplicated rule name');
      try {
        await duplicatecopyButtonPage.DuplicateCopy_Button.click();
        await expect(rulesAndActionsPage.Duplicated_Block).toBeVisible();
        await statusInactive2Page.Rule_Name.clear();
        await statusInactive2Page.Rule_Name.type(vars["Duplicated Rule Name"]);
        await expect(statusInactive2Page.Rule_Name).toHaveValue(vars["Duplicated Rule Name"]);
        log.stepPass('Rule duplicated with name: ' + vars["Duplicated Rule Name"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to duplicate rule block');
        throw e;
      }

      log.step('Save Draft and verify all edited rule blocks are preserved');
      try {
        await page.waitForTimeout(3000);
        await correspondentPortalPage.Save_Draft_Button1.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(rulesAndActionsButtonPage.Added_Rule_Block.first()).toBeVisible();
        vars["BlocksCount"] = String(await rulesAndActionsButtonPage.Added_Rule_Block.count());
        vars["count"] = appconstants.ONE;
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["BlocksCount"]))) {
          log.info('Iteration: ' + vars["count"]);
          await rulesAndActionsPage.Select_Category_DropdownNew(vars['count']).evaluate(el => (el as HTMLElement).click());
          if (String(vars["count"]) === String("1")) {
            vars["count1"] = appconstants.TWO;
            await expect(rulesAndActionsPage.Edited_Category_In_Dropdown(vars['EditedCategory'], vars['count1'])).toBeChecked();
          }
          if (String(vars["count"]) === String("2")) {
            vars["count1"] = appconstants.TWO;
            await expect(rulesAndActionsPage.Edited_Category_In_Dropdown(vars['EditedCategory'], vars['count1'])).toBeChecked();
          }
          await rulesAndActionsPage.Select_Category_DropdownNew(vars['count']).evaluate(el => (el as HTMLElement).click());
          await expect(rulesAndActionsPage.Common_Bid_Field_Rule(vars['count'])).toContainText(vars["EditedRuleBidField[RulesAndActions]"]);
          await expect(rulesAndActionsButtonPage.Condition_BidTape1).toContainText(vars["EditedRuleBidTape[RulesAndActions]"]);
          await expect(correspondentPortalPage.Operations_Dropdown_Rules(vars['count'])).toHaveValue(vars["Operation2"]);
          await expect(rulesAndActionsPage.Common_Action_Chase_Field_Name(vars['count'])).toContainText(vars["EditedActionChaseFieldName"]);
          await expect(rulesAndActionsPage.Common_Action_Chase_Value(vars['count'])).toContainText(vars["EditedActionChaseValue"]);
          Methods.performArithmetic(vars["count"], 'ADDITION', '1', 'count', 0);
        }
        await expect(correspondentPortalPage.Enter_a_Rule_Name_Field.first()).toHaveValue(vars["New Rule Name"]);
        await expect(statusInactive2Page.Rule_Name).toHaveValue(vars["Duplicated Rule Name"]);
        log.stepPass('All edited rule blocks verified. Rule Name: ' + vars["New Rule Name"] + ', Duplicated Rule Name: ' + vars["Duplicated Rule Name"]);
      } catch (e) {
        await log.stepFail(page, 'Rule block verification failed after Save Draft');
        throw e;
      }

      log.step('Delete rule and verify deletion is saved via Save Draft');
      try {
        await stepGroups.stepGroup_Deleting_the_Rule_in_Rules_and_Actions_Page(page, vars);
        await correspondentPortalPage.Save_Draft_Button1.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars["Duplicated Rule Name"])).not.toBeVisible();
        await expect(rulesAndActionsPage.Duplicated_Block).toBeHidden();
        log.stepPass('Deleted rule is not visible after Save Draft; duplicated block remains visible');
      } catch (e) {
        await log.stepFail(page, 'Rule deletion or Save Draft verification failed');
        throw e;
      }

      log.step('Save and Publish the Bid Map');
      try {
        await saveAndPublishButtonPage.Save_and_Publish_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Bid Map saved and published successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to Save and Publish the Bid Map');
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