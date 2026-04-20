// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { AddedOnPage } from '../../../src/pages/correspondant/added-on';
import { AddHeaderPage } from '../../../src/pages/correspondant/add-header';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { DuplicatecopyButtonPage } from '../../../src/pages/correspondant/duplicatecopy-button';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { P15ActivePage } from '../../../src/pages/correspondant/p-15-active';
import { P1morePage } from '../../../src/pages/correspondant/p-1more';
import { RulesActionPage } from '../../../src/pages/correspondant/rules-action';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { RulesAndActionsPage } from '../../../src/pages/correspondant/rules-and-actions';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { runPrereq_797 } from '../../../src/helpers/prereqs/prereq-797';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';


const TC_ID = 'REG_TS11_TC03';
const TC_TITLE = 'Verify that the user can Edit and Delete a rule.';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let addedOnPage: AddedOnPage;
  let addHeaderPage: AddHeaderPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let duplicatecopyButtonPage: DuplicatecopyButtonPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let p15ActivePage: P15ActivePage;
  let p1morePage: P1morePage;
  let rulesActionPage: RulesActionPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let rulesAndActionsPage: RulesAndActionsPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;
  let Methods: AddonHelpers;

  const credentials = ENV.getCredentials('internal');

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    await runPrereq_797(page, vars);
    addedOnPage = new AddedOnPage(page);
    addHeaderPage = new AddHeaderPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    duplicatecopyButtonPage = new DuplicatecopyButtonPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    p15ActivePage = new P15ActivePage(page);
    p1morePage = new P1morePage(page);
    rulesActionPage = new RulesActionPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    rulesAndActionsPage = new RulesAndActionsPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    if (profile && profile.data) {
      vars["UpdatedWhenBidFieldName"] = profile.data[0]['UpdatedWhenBidFieldName'];
      vars["Operator"] = profile.data[0]['Operator'];
      vars["UpdatedBidEnumeratedTapeValue"] = profile.data[0]['UpdatedBidEnumeratedTapeValue'];
      vars["WhenBidFieldValue-3"] = profile.data[0]['WhenBidFieldValue-3'];
      vars["Operator 3"] = profile.data[0]['Operator 3'];
      vars["BidEnumeraedTapeValue - 3"] = profile.data[0]['BidEnumeraedTapeValue - 3'];
      vars["WhenBidFieldName - Block 2"] = profile.data[0]['WhenBidFieldName - Block 2'];
      vars["Operator - Block 2"] = profile.data[0]['Operator - Block 2'];
      vars["BidEnumeratedTapeValue - Block 2"] = profile.data[0]['BidEnumeratedTapeValue - Block 2'];
      vars["Rule Name"] = profile.data[0]['Rule Name'];
      vars["New Rule Name"] = profile.data[0]['New Rule Name'];
      vars["Duplicated Rule Name"] = profile.data[0]['Duplicated Rule Name'];
      vars["Operation1"] = profile.data[0]['Operation1'];
      vars["Operation2"] = profile.data[0]['Operation2'];
    }

    try {

      log.step('Navigate to Bid Map and proceed through Header Mapping, Enumeration Mapping, and Rules and Actions');
      try {
        vars['BidMap']=vars['CreateNewMap'];
        await correspondentPortalPage.Bid_Maps_name(vars['BidMap']).click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(mapHeadersButtonPage.Map_Headers_Button).toBeVisible();
        await mapHeadersButtonPage.Map_Headers_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(enumerationMappingButtonPage.Enumeration_Mapping_Button).toBeVisible();
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(correspondentPortalPage.Heading_Save_and_Move_to_Next_Page1).toBeVisible();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(rulesAndActionsButtonPage.Rules_and_Actions_Button).toBeVisible();
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await expect(correspondentPortalPage.Heading_Save_and_Move_to_Next_Page1).toBeVisible();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(saveAndPublishButtonPage.Save_and_Publish_Button).toBeVisible();
        await expect(correspondentPortalPage.Add_Conditions).toBeVisible();
        log.stepPass('Navigated to Rules and Actions screen');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Rules and Actions screen');
        throw e;
      }

      log.step('Update Rule Name and Category');
      try {
        vars["Rule Name"] = await correspondentPortalPage.Enter_a_Rule_Name_Field.inputValue() || '';
        await correspondentPortalPage.Enter_a_Rule_Name_Field.fill(Array.from({ length: 2 }, () => "ab".charAt(Math.floor(Math.random() * 2))).join(''));
        vars["UpdatedRuleName"] = await correspondentPortalPage.Enter_a_Rule_Name_Field.inputValue() || '';
        Methods.verifyString(vars["Rule Name"], 'equals', vars["UpdatedRuleName"]);
        await statusInactivePage.Selected1_Dropdown.click();
        await chaseFieldNamePage.Ineligible_Category.check();
        await chaseFieldNamePage.Apply_Selected_Button_for_Category.click();
        await expect(chaseFieldNamePage.Updated_SelectCategory).toBeVisible();
        await chaseFieldNamePage.Updated_SelectCategory.click();
        await expect(chaseFieldNamePage.Product_Category).toBeVisible();
        await expect(chaseFieldNamePage.Ineligible_Category).toBeVisible();
        await chaseFieldNamePage.Apply_Selected_Button_for_Category.click();
        log.stepPass('Rule Name updated to: ' + vars["UpdatedRuleName"] + ' and Category updated');
      } catch (e) {
        await log.stepFail(page, 'Failed to update Rule Name or Category');
        throw e;
      }

      log.step('Capture Before values of first rule block fields');
      try {
        vars["BeforeWhenBidField1"] = await statusInactivePage.AfterWhenBidField1.inputValue() || '';
        vars["BeforeOperator1"] = await chaseFieldNamePage.BeforeOperator1.inputValue() || '';
        vars["BeforeBidEnumTapeValue1"] = await chaseFieldNamePage.BidEnumeratedTapeValueField_1.inputValue() || '';
        vars["BeforeActionChaseFieldName1"] = await chaseFieldNamePage.UpdatingActionChaseFieldName_1.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        vars["BeforeActionChaseValue1"] = await statusInactivePage.AfterActionChaseValue1.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        log.stepPass('Before values captured. WhenBidField1: ' + vars["BeforeWhenBidField1"] + ' Operator1: ' + vars["BeforeOperator1"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to capture Before values of first rule block');
        throw e;
      }

      log.step('Edit first rule block — update When Bid Field, Operator, Tape Value, and Action fields');
      try {
        await statusInactivePage.AfterWhenBidField1.click();
        await rulesAndActionsPage.Search_Input_under_When_Bid_Field.fill(vars["UpdatedWhenBidFieldName"]);
        await correspondentPortalPage.UpdatedWhenBidField1.click();
        await expect(statusInactivePage.AfterWhenBidField1).toContainText(vars["UpdatedWhenBidFieldName"]);
        await chaseFieldNamePage.BeforeOperator1.selectOption({ label: vars["Operator"] });
        await expect(chaseFieldNamePage.BeforeOperator1).toHaveValue(vars["Operator"]);
        await chaseFieldNamePage.BidEnumeratedTapeValueField_1.click();
        await correspondentPortalPage.Bid_EnumeratedTape_value_Existing_RowDropdown.click();
        await expect(chaseFieldNamePage.BidEnumeratedTapeValueField_1).toContainText(vars["UpdatedBidEnumeratedTapeValue"]);
        vars["ActionChaseFiledNew1"] = await chaseFieldNamePage.Chase_field_Name_New_one.textContent() || '';
        Methods.trimtestdata(vars["ActionChaseFiledNew1"], "ActionChaseFiledNew1");
        await chaseFieldNamePage.UpdatingActionChaseFieldName_1.selectOption({ index: parseInt("4") });
        await expect(chaseFieldNamePage.UpdatingActionChaseFieldName_1).toContainText(vars["ActionChaseFiledNew1"]);
        vars["ActionChaseValueNameNew1"] = await chaseFieldNamePage.ActionChaseValueNameNew1.textContent() || '';
        Methods.trimtestdata(vars["ActionChaseValueNameNew1"], "ActionChaseValueNameNew1");
        await statusInactivePage.AfterActionChaseValue1.selectOption({ index: parseInt("2") });
        await expect(statusInactivePage.AfterActionChaseValue1).toContainText(vars["ActionChaseValueNameNew1"]);
        log.stepPass('First rule block edited. Updated When Bid Field: ' + vars["UpdatedWhenBidFieldName"] + ', Operator: ' + vars["Operator"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to edit first rule block fields');
        throw e;
      }

      log.step('Capture After values and verify they differ from Before values');
      try {
        vars["AfterWhenBidField1"] = await statusInactivePage.AfterWhenBidField1.inputValue() || '';
        vars["AfterOperator1"] = await chaseFieldNamePage.BeforeOperator1.inputValue() || '';
        vars["AfterBidEnurmeratedTapeValue1"] = await chaseFieldNamePage.BidEnumeratedTapeValueField_1.inputValue() || '';
        vars["AfterActionChaseFieldName1"] = await chaseFieldNamePage.UpdatingActionChaseFieldName_1.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        vars["AfterActionChaseValue1"] = await statusInactivePage.AfterActionChaseValue1.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        Methods.verifyString(vars["BeforeWhenBidField1"], 'equals', vars["AfterWhenBidField1"]);
        Methods.verifyString(vars["BeforeOperator1"], 'equals', vars["AfterOperator1"]);
        Methods.verifyString(vars["BeforeBidEnumTapeValue1"], 'equals', vars["AfterBidEnurmeratedTapeValue1"]);
        Methods.verifyString(vars["BeforeActionChaseFieldName1"], 'equals', vars["AfterActionChaseFieldName1"]);
        Methods.verifyString(vars["BeforeActionChaseValue1"], 'equals', vars["AfterActionChaseValue1"]);
        log.stepPass('After values verified against Before values successfully');
      } catch (e) {
        await log.stepFail(page, 'Before/After value comparison failed');
        throw e;
      }

      log.step('Add third condition with Appraised Value');
      try {
        await p15ActivePage.Add_Condition.click();
        await chaseFieldNamePage.WhenBidField_3.click();
        await chaseFieldNamePage.Search_Input_under_When_Bid_Field_for_four_row.fill(vars["WhenBidFieldValue-3"]);
        await correspondentPortalPage.WhenBidFieldValue_3.click();
        await chaseFieldNamePage.Operator_3.selectOption({ label: vars["Operator 3"] });
        await p15ActivePage.BidEnumeraedTapeValue_3.click();
        await correspondentPortalPage.BidEnumeratedTapeValue_3.click();
        await expect(chaseFieldNamePage.WhenBidField_3).toContainText(vars["WhenBidFieldValue-3"]);
        await expect(chaseFieldNamePage.Operator_3).toHaveValue(vars["Operator 3"]);
        await expect(p15ActivePage.BidEnumeraedTapeValue_3).toContainText(vars["BidEnumeraedTapeValue - 3"]);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Third condition added. WhenBidField: ' + vars["WhenBidFieldValue-3"] + ' Operator: ' + vars["Operator 3"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to add third condition');
        throw e;
      }

      log.step('Add OR block with Amortization Type');
      try {
        await p1morePage.Add_0R_Block.click();
        await chaseFieldNamePage.WhenBidFieldName_Block2.click();
        await chaseFieldNamePage.Search_Input_under_When_Bid_Field_for_Add_or_block.fill(vars["WhenBidFieldName - Block 2"]);
        await correspondentPortalPage.WhenBidFieldValue_Block_2.click();
        await expect(chaseFieldNamePage.WhenBidFieldName_Block2).toContainText(vars["WhenBidFieldName - Block 2"]);
        await chaseFieldNamePage.When_Bid_field_for_add_or_block_in_field2.selectOption({ label: vars["Operator - Block 2"] });
        await expect(chaseFieldNamePage.When_Bid_field_for_add_or_block_in_field2).toHaveValue(vars["Operator - Block 2"]);
        await chaseFieldNamePage.Bid_EnumeratedTapeField_Block_2.click();
        await correspondentPortalPage.BidEnumeratedTapeValue_Block_2.click();
        await expect(chaseFieldNamePage.Bid_EnumeratedTapeField_Block_2).toContainText(vars["BidEnumeratedTapeValue - Block 2"]);
        log.stepPass('OR block added with: ' + vars["WhenBidFieldName - Block 2"] + ' Operator: ' + vars["Operator - Block 2"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to add OR block');
        throw e;
      }

      log.step('Duplicate rule, capture duplicated rule name, then delete duplicated rule');
      try {
        await duplicatecopyButtonPage.DuplicateCopy_Button.click();
        await chaseFieldNamePage.Duplicate_Rule_Name.fill(Array.from({ length: 1 }, () => "a".charAt(Math.floor(Math.random() * 1))).join(''));
        vars["Updated Rules and Actions name"] = await chaseFieldNamePage.Duplicate_Rule_Name.inputValue() || '';
        await rulesActionPage.Delete_last_Rule.click();
        await expect(correspondentPortalPage.Delete_Rule).toBeVisible();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await page.getByText(vars["Updated Rules and Actions name"]).waitFor({ state: 'hidden' });
        await expect(page.getByText(vars["Updated Rules and Actions name"])).not.toBeVisible();
        log.stepPass('Rule duplicated and deleted. Deleted rule name: ' + vars["Updated Rules and Actions name"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to duplicate or delete rule');
        throw e;
      }

      log.step('Update remaining rule — When Bid Field and Tape Value');
      try {
        await statusInactivePage.AfterWhenBidField1.click();
        vars["Field"] = await chaseFieldNamePage.UpdatedWhenBidField_1.textContent() || '';
        Methods.trimtestdata(vars["Field"], "Field");
        await rulesAndActionsPage.Search_Input_under_When_Bid_Field.fill(vars["Field"]);
        await correspondentPortalPage.Select_under_When_field_name.click();
        await expect(statusInactivePage.AfterWhenBidField1).toContainText(vars["Field"]);
        await chaseFieldNamePage.BidEnumeratedTapeValueField_1.click();
        vars["UpdatedTapevalueField"] = await chaseFieldNamePage.UpdatedBidEnumeartedTapeValue_1.textContent() || '';
        Methods.trimtestdata(vars["UpdatedTapevalueField"], "UpdatedTapevalueField");
        await chaseFieldNamePage.Search_Tape_Field.fill(vars["UpdatedTapevalueField"]);
        await correspondentPortalPage.Select_under_When_field_name.click();
        await expect(chaseFieldNamePage.BidEnumeratedTapeValueField_1).toContainText(vars["UpdatedTapevalueField"]);
        log.stepPass('Remaining rule updated. Field: ' + vars["Field"] + ' Tape Value: ' + vars["UpdatedTapevalueField"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to update remaining rule When Bid Field or Tape Value');
        throw e;
      }

      log.step('Update Action Chase Field Name and Chase Value in remaining rule');
      try {
        await chaseFieldNamePage.UpdatingActionChaseFieldName_1.click();
        vars["ChaseFieldName"] = await addedOnPage.ChaseFiedName_1.textContent() || '';
        Methods.trimtestdata(vars["ChaseFieldName"], "ChaseFieldName");
        await chaseFieldNamePage.UpdatingActionChaseFieldName_1.selectOption({ index: parseInt("4") });
        await expect(chaseFieldNamePage.UpdatingActionChaseFieldName_1).toContainText(vars["ChaseFieldName"]);
        vars["ChaseValue"] = await addHeaderPage.UpdatingChaseValue_1.textContent() || '';
        Methods.trimtestdata(vars["ChaseValue"], "ChaseValue");
        await statusInactivePage.AfterActionChaseValue1.selectOption({ index: parseInt("1") });
        await expect(statusInactivePage.AfterActionChaseValue1).toContainText(vars["ChaseValue"]);
        log.stepPass('Action Chase Field Name: ' + vars["ChaseFieldName"] + ' Chase Value: ' + vars["ChaseValue"] + ' updated');
      } catch (e) {
        await log.stepFail(page, 'Failed to update Action Chase Field Name or Chase Value');
        throw e;
      }

      log.step('Add additional Actions and Save and Publish Bid Map');
      try {
        await stepGroups.stepGroup_Add_Actions_In_Rules_and_Actions(page, vars);
        await expect(saveAndPublishButtonPage.Save_and_Publish_Button).toBeVisible();
        await saveAndPublishButtonPage.Save_and_Publish_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Status).toContainText("ACTIVE");
        vars["Version"] = await correspondentPortalPage.Version.textContent() || '';
        await expect(page.getByText(vars["Version"])).toBeVisible();
        log.stepPass('Bid Map saved and published. Status: ACTIVE, Version: ' + vars["Version"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to add Actions or Save and Publish Bid Map');
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