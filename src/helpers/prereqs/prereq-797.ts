import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ActionruleheaderPage } from '../../../src/pages/correspondant/actionruleheader';
import { AmortizationTypePage } from '../../../src/pages/correspondant/amortization-type';
import { BackButtonPage } from '../../../src/pages/correspondant/back-button';
import { BidSampleFieldNamePage } from '../../../src/pages/correspondant/bid-sample-field-name';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { ContinueEditingButtonPage } from '../../../src/pages/correspondant/continue-editing-button';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { HeaderamappingPage } from '../../../src/pages/correspondant/headeramapping';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { P1MoreButtonPage } from '../../../src/pages/correspondant/p-1-more-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { RulesAndActionsPage } from '../../../src/pages/correspondant/rules-and-actions';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SelectFieldForBaseLoanAmounts1Page } from '../../../src/pages/correspondant/select-field-for-base-loan-amounts1';
import { SelectFieldForBaseLoanAmounts3Page } from '../../../src/pages/correspondant/select-field-for-base-loan-amounts3';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive4Page } from '../../../src/pages/correspondant/status-inactive--4';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { WhenBidFieldPage } from '../../../src/pages/correspondant/when-bid-field';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import path from 'path';


const TC_ID = 'PREREQ_797(REG_TS11_TC01)';
const TC_TITLE = 'Verify that the user can Create and Duplicate rule.';

export async function runPrereq_797(page: Page, vars: Record<string, string>): Promise<void> {
  const actionruleheaderPage = new ActionruleheaderPage(page);
  const amortizationTypePage = new AmortizationTypePage(page);
  const backButtonPage = new BackButtonPage(page);
  const bidSampleFieldNamePage = new BidSampleFieldNamePage(page);
  const chaseFieldNamePage = new ChaseFieldNamePage(page);
  const continueEditingButtonPage = new ContinueEditingButtonPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
  const headeramappingPage = new HeaderamappingPage(page);
  const headerMappingPage = new HeaderMappingPage(page);
  const p1MoreButtonPage = new P1MoreButtonPage(page);
  const rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
  const rulesAndActionsPage = new RulesAndActionsPage(page);
  const saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
  const selectFieldForBaseLoanAmounts1Page = new SelectFieldForBaseLoanAmounts1Page(page);
  const selectFieldForBaseLoanAmounts3Page = new SelectFieldForBaseLoanAmounts3Page(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactive4Page = new StatusInactive4Page(page);
  const statusInactivePage = new StatusInactivePage(page);
  const whenBidFieldPage = new WhenBidFieldPage(page);
  const Methods = new AddonHelpers(page, vars);


  const credentials = ENV.getCredentials('internal');
  vars['Username'] = credentials.username;
  vars['Password'] = credentials.password;

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

  const ProfileHeaderMappingValues = 'Header Mapping Values';

  log.tcStart(TC_ID, TC_TITLE);

  if (profile && profile.data) {
    vars["Rule Name"] = profile.data[0]['Rule Name'];
    vars["BidEnumeratedTapeValue"] = profile.data[0]['BidEnumeratedTapeValue'];
    vars["BidField"] = profile.data[0]['Bid Field'];
    vars["BidFields"] = profile.data[0]['BidFields'];
    vars["Bid Enumerated Tape Value"] = profile.data[0]['Bid Enumerated Tape Value'];
    vars["BidFields."] = profile.data[0]['BidFields.'];
    vars["Chase  Values"] = profile.data[0]['Chase  Values'];
    vars["New Rule Name"] = profile.data[0]['New Rule Name'];
    vars["Duplicated Rule Name"] = profile.data[0]['Duplicated Rule Name'];
    vars["Condition Bid Field"] = profile.data[0]['Condition Bid Field'];
    vars["Operation1"] = profile.data[0]['Operation1'];
    vars["Operation2"] = profile.data[0]['Operation2'];
    vars["same Income"] = profile.data[0]['same Income'];
    vars["HeaderMapping"] = profile.data[0]['HeaderMapping'];
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

    log.step('Collect Bid Sample values from Header Mapping');
    try {
      await page.waitForTimeout(3000);
      await expect(correspondentPortalPage.Rules_and_Actions_Step_4_of_4).toBeVisible();
      vars["Count of the Bid Sample"] = String(await bidSampleFieldNamePage.Common_Xpath_For_Bid_Sample.count());
      vars["count"] = appconstants.ONE;
      log.info('Count of the Bid Sample: ' + vars["Count of the Bid Sample"]);

      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["Count of the Bid Sample"]))) {
        log.info('Iteration count: ' + vars["count"]);
        vars["Bid Sample Value"] = await bidSampleFieldNamePage.Bid_Sample_Value(vars['count']).textContent() || '';
        log.info('Bid Sample Value: ' + vars['Bid Sample Value']);
        // Write to test data profile: "HeaderMapping" = vars["Bid Sample Value"]
        testDataManager.updatePartialProfileDataByDataIndex(ProfileHeaderMappingValues, {
          'HeaderMapping': vars['Bid Sample Value'],
        }, vars['count']);
        Methods.performArithmetic(vars["count"], 'ADDITION', '1', 'count', 0);
        await headeramappingPage.Header_Mapping_Title.click();
      }
      log.stepPass('Bid Sample values collected. Count: ' + vars["Count of the Bid Sample"]);
    } catch (e) {
      await log.stepFail(page, 'Failed to collect Bid Sample values from Header Mapping');
      throw e;
    }

    log.step('Navigate through Enumeration Mapping and Rules and Actions');
    try {
      await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
      await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
      await correspondentPortalPage.Yes_Proceed_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(correspondentPortalPage.Rules_and_Actions_Step_4_of_4).toBeVisible();
      await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
      await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
      await correspondentPortalPage.Yes_Proceed_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(correspondentPortalPage.Rules_and_Actions_Step_4_of_4).toBeVisible();
      log.stepPass('Navigated through Enumeration Mapping and Rules and Actions');
    } catch (e) {
      await log.stepFail(page, 'Failed to navigate through Enumeration Mapping or Rules and Actions');
      throw e;
    }

    log.step('Add Rule and verify When Bid Field dropdown options match Header Mapping values');
    try {
      await correspondentPortalPage.Add_Rule_Button.click();
      await whenBidFieldPage.When_Bid_Field_Dropdown.waitFor({ state: 'visible' });
      await whenBidFieldPage.When_Bid_Field_Dropdown.click();
      vars["total"] = appconstants.ONE;
      const profile2 = testDataManager.getProfileByName(ProfileHeaderMappingValues);
      const dataList = profile2?.data as Record<string, any>[];
      let i = 0;
      vars["Count of the Bid Field Options"] = String(await whenBidFieldPage.Common_Xpath_for_Options_Under_When_Bid_Field.count());
      log.info('Count of the Bid Field Options: ' + vars["Count of the Bid Field Options"]);
      while (parseFloat(String(vars["total"])) <= parseFloat(String(vars["Count of the Bid Field Options"]))) {
        log.info('Bid Field Option iteration total: ' + vars["total"]);
        vars["Option under When Bid Field"] = await whenBidFieldPage.Option_under_When_Bid_Field(vars['total']).textContent() || '';
        vars['HeaderMapping'] = dataList[i]['HeaderMapping'];
        log.info('Option under When Bid Field: ' + vars['Option under When Bid Field']);
        log.info('Header Mapping: ' + vars['HeaderMapping']);
        Methods.verifyString(vars["Option under When Bid Field"], 'equals', vars["HeaderMapping"]);
        await actionruleheaderPage.Rules_and_Actions_Heading.click();
        Methods.performArithmetic(vars["total"], 'ADDITION', '1', 'total', 0);
        i++;

      }
      log.stepPass('When Bid Field dropdown options verified against Header Mapping values');
    } catch (e) {
      await log.stepFail(page, 'Failed to verify When Bid Field dropdown options');
      throw e;
    }

    log.step('Attempt Save and Publish without required fields and verify validation errors');
    try {
      await saveAndPublishButtonPage.Save_and_Publish_Button.click();
      await page.getByText("Rules and Actions").first().waitFor({ state: 'visible' });
      await continueEditingButtonPage.Continue_Editing_Button.click();
      await correspondentPortalPage.Rule_Name_is_required.first().waitFor({ state: 'visible' });
      await expect(whenBidFieldPage.When_Bid_Field_Dropdown_Red_Color.first()).toBeVisible();
      await expect(rulesAndActionsPage.Chase_Value_Dropdown_Red_Color.first()).toBeVisible();
      await expect(rulesAndActionsPage.Chase_Field_Name_Dropdown_Red_Color.first()).toBeVisible();
      log.stepPass('Validation errors displayed for required fields as expected');
    } catch (e) {
      await log.stepFail(page, 'Validation errors not displayed as expected');
      throw e;
    }

    log.step('Read XLS column data and fetch Income value, then fill When Bid Field with Income (Monthly)');
    try {
      // await stepGroups.stepGroup_Reading_Column_Data_from_XLS(page, vars);
      vars['FilePath'] = path.join(process.cwd(), 'uploads', fileconstants.BID_QA_FILE_COMMON);
      vars["Total exl"] = excelHelper.readEntireColumnByColIndex(vars['FilePath'], 1, 0);
      await stepGroups.stepGroup_Fetching_Income_Value_From_XLS(page, vars);
      await whenBidFieldPage.When_Bid_Field_Dropdown.click();
      await rulesAndActionsPage.Search_Input_under_When_Bid_Field.first().waitFor({ state: 'visible' });
      await rulesAndActionsPage.Search_Input_under_When_Bid_Field.first().fill("Income (Monthly)");
      await rulesAndActionsPage.Income_Option.click();
      await expect(amortizationTypePage.When_Bid_Field_in_ImportRule).toContainText("Income (Monthly)");
      await rulesAndActionsPage.Bid_Enumerated_Tape_Value_Dropdown.click();
      vars["income Value From UI"] = await rulesAndActionsPage.income_Value_From_UI.textContent() || '';
      const ProfileDuplicateIncomeValues = 'Duplicate Income Values';
      const profile2 = testDataManager.getProfileByName(ProfileDuplicateIncomeValues);
      if (profile2 && profile2.data) {
        vars["same Income"] = profile2.data[1]['same Income'];
      }

      Methods.trimtestdata(vars["income Value From UI"], "income Value From UI");
      Methods.verifyString(vars["income Value From UI"], 'equals', vars["same Income"]);
      log.stepPass('Income value from UI verified: ' + vars["income Value From UI"]);
    } catch (e) {
      await log.stepFail(page, 'Failed to fetch or verify Income value from UI');
      throw e;
    }

    log.step('Fill Rule Name, select Category, and add Conditions');
    try {
      await correspondentPortalPage.Enter_a_Rule_Name_Field.type(vars["Rule Name"]);
      vars["RuleName"] = await correspondentPortalPage.Enter_a_Rule_Name_Field.inputValue() || '';
      Methods.verifyString(vars["Rule Name"], 'equals', vars["RuleName"]);
      await statusInactive4Page.Select_Category_Dropdown.click();
      vars["SelectCategory"] = await rulesAndActionsButtonPage.Select_Category_On_Rules_and_Actions.inputValue() || '';
      await correspondentPortalPage.First_Checkbox_Bid_Request.check();
      await correspondentPortalPage.Apply_Selected_1_button_in_Rule.click();
      await expect(correspondentPortalPage.Add_Conditions).toBeVisible();
      await chaseFieldNamePage.Operation_Dropdowns.selectOption({ value: "LESS" });
      await expect(chaseFieldNamePage.Operation_Dropdowns).toBeVisible();
      await correspondentPortalPage.Bid_Enumeration_Tape_Value_in_rule.click();
      await correspondentPortalPage.Search_Field_in_Bid_Enumerated_Tape_Value.click();
      // await correspondentPortalPage.Dropdown_Select_105_202530_Yr_FHA_FixedGNMA_I_105.type(vars["BidEnumeratedTapeValue"]);
      await correspondentPortalPage.Search_Field.type(vars["BidEnumeratedTapeValue"]);
      // await expect(correspondentPortalPage.Search_Field).toHaveValue(vars["BidEnumeratedTapeValue"]);
      await correspondentPortalPage.Select_Button.click();
      await expect(chaseFieldNamePage.BidEnumeratedTapeValueField_1).toContainText(vars["BidEnumeratedTapeValue"]);
      log.stepPass('Rule Name, Category, and first Condition filled. Rule Name: ' + vars["RuleName"]);
    } catch (e) {
      await log.stepFail(page, 'Failed to fill Rule Name, Category, or first Condition');
      throw e;
    }

    log.step('Add OR block and fill second condition with Base Loan Amount');
    try {
      await expect(correspondentPortalPage.Add_OR_Block_Button).toBeVisible();
      await correspondentPortalPage.Add_OR_Block_Button.click();
      await correspondentPortalPage.When_Bid_Field_in_Add_Conditions.click();
      await correspondentPortalPage.Search_Field_in_Add_Condition.click();
      await correspondentPortalPage.Search_Field_in_Add_Condition.type(vars["BidField"]);
      vars["Bid Field"] = await correspondentPortalPage.Search_Field_in_Add_Condition.inputValue() || '';
      await expect(correspondentPortalPage.When_Bid_Field_Search_List(vars['BidField'])).toContainText(vars["Bid Field"]);
      await correspondentPortalPage.Base_Loan_Amount_Dropdown.click();
      await expect(statusInactivePage.When_Bid_Field).toContainText(vars["Bid Field"]);
      await correspondentPortalPage.Operations_Dropdown2.selectOption({ value: "LESS" });
      await expect(correspondentPortalPage.Operations_Dropdown2).toBeVisible();
      await continueEditingButtonPage.select_field_for_Base_loan_amounts.click();
      await correspondentPortalPage.Bid_Enumerated_Tape_Values_Dropdown.click();
      await expect(chaseFieldNamePage.When_Bid_Field).toBeVisible();
      log.stepPass('OR block added with Base Loan Amount condition. Bid Field: ' + vars["Bid Field"]);
    } catch (e) {
      await log.stepFail(page, 'Failed to add OR block or fill Base Loan Amount condition');
      throw e;
    }

    log.step('Add third condition with CLTV and Bid Enumerated Tape Value');
    try {
      await expect(correspondentPortalPage.Add_Condition_Button).toBeVisible();
      await correspondentPortalPage.Add_Condition_Button.click();
      await selectFieldForBaseLoanAmounts1Page.select_field_for_Base_loan_amounts2.click();
      await correspondentPortalPage.When_Bid_Fields_Dropdown.click();
      await correspondentPortalPage.When_Bid_Fields_Dropdown.type(vars["BidFields"]);
      await expect(correspondentPortalPage.When_Bid_Fields_Dropdown).toHaveValue(vars["BidFields"]);
      await correspondentPortalPage.Select_Button.click();
      await expect(statusInactivePage.Bid_Enumeration_TapeValue).toContainText(vars["BidFields"]);
      await selectFieldForBaseLoanAmounts3Page.select_field_for_CLTV2.first().click();
      await correspondentPortalPage.Select_Bid_Enumerated_Bid_Tape_values.click();
      await correspondentPortalPage.Select_Bid_Enumerated_Bid_Tape_values.type(vars["Bid Enumerated Tape Value"]);
      await expect(correspondentPortalPage.Select_Bid_Enumerated_Bid_Tape_values).toHaveValue(vars["Bid Enumerated Tape Value"]);
      await correspondentPortalPage.Select_Button.click();
      await expect(statusInactivePage.When_BidEnumerated_Tape_Value).toContainText(vars["Bid Enumerated Tape Value"]);
      log.stepPass('Third condition added with CLTV. BidFields: ' + vars["BidFields"] + ' Tape Value: ' + vars["Bid Enumerated Tape Value"]);
    } catch (e) {
      await log.stepFail(page, 'Failed to add third condition with CLTV');
      throw e;
    }

    log.step('Add fourth condition with DTI');
    try {
      await expect(correspondentPortalPage.Add_Condition_Button).toBeVisible();
      await correspondentPortalPage.Add_Condition_Button.click();
      await selectFieldForBaseLoanAmounts1Page.select_field_for_Base_loan_amounts2.click();
      await p1MoreButtonPage.Search_Fields.click();
      await p1MoreButtonPage.Search_Fields.type(vars["BidFields."]);
      // await expect(correspondentPortalPage.BId_Field_Data).toContainText(vars["BidFields."]);
      vars['BidFields1'] = vars["BidFields."];
      await correspondentPortalPage.DTI_Dropdown(vars['BidFields1']).click();
      await correspondentPortalPage.Operation_Dropdown2.selectOption({ value: "LESS_OR_EQUAL" });
      await expect(correspondentPortalPage.Operation_Dropdown2).toBeVisible();
      await selectFieldForBaseLoanAmounts3Page.select_field_for_CLTV2.first().click();
      await backButtonPage.Bid_Enumerated_Tape_Values_for_DTI.click();
      log.stepPass('Fourth condition added with DTI. BidFields.: ' + vars["BidFields."]);
    } catch (e) {
      await log.stepFail(page, 'Failed to add fourth condition with DTI');
      throw e;
    }

    log.step('Add Actions — first and second action chase fields and values');
    try {
      await expect(correspondentPortalPage.Add_Actions).toBeVisible();
      vars["Chasefield_action"] = await chaseFieldNamePage.Chase_Field_Name_for_Add_action.textContent() || '';
      Methods.trimtestdata(vars["Chasefield_action"], "Chasefield_action");
      await headerMappingPage.Chase_Field_Name_in_Rule.selectOption({ index: parseInt("16") });
      // await expect(headerMappingPage.Chase_Field_Name_in_Rule).toHaveValue(vars["Chasefield_action"]);
      await expect(headerMappingPage.Chase_Field_Name_in_Rule.locator('option:checked')).toHaveText(vars["Chasefield_action"]);
      await correspondentPortalPage.Select_False_True_Dropdown.selectOption({ label: vars["Chase  Values"] });
      await expect(correspondentPortalPage.Select_False_True_Dropdown).toContainText("False");
      await correspondentPortalPage.Add_Action_Button.click();
      vars["Chase Field Name _Rule"] = await rulesAndActionsPage.Chase_Field_Name_Dropdwon.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
      Methods.trimtestdata(vars["Chase Field Name _Rule"], "Chase Fieldname_Rule");
      await correspondentPortalPage.Chase_Field_Name_in_Rule.selectOption({ index: parseInt("3") });
      await expect(correspondentPortalPage.Chase_Field_Name_in_Rule).toContainText(vars["Chase Fieldname_Rule"]);
      await correspondentPortalPage.Chase_Value_in_RulesandActions.selectOption({ value: "Attached" });
      await expect(correspondentPortalPage.Chase_Value_in_RulesandActions).toContainText("Attached");
      log.stepPass('Actions added. Chase Field Action: ' + vars["Chasefield_action"] + ', Chase Value: Attached');
    } catch (e) {
      await log.stepFail(page, 'Failed to add Actions');
      throw e;
    }

    log.step('Delete block, action, and condition then verify remaining fields');
    try {
      await correspondentPortalPage.Delete_Block_Button.first().click();
      await expect(chaseFieldNamePage.When_Bid_FieldValue_In_AddActions).not.toBeVisible();
      await correspondentPortalPage.Delete_Button_In_AddActions.click();
      await expect(statusInactivePage.Chase_Field_Name_in_AddActions).not.toBeVisible();
      await correspondentPortalPage.Delete_Button_inAddConditions.click();
      await expect(statusInactivePage.When_Bid_Field_in_AddConditions).not.toBeVisible();
      log.stepPass('Block, Action, and Condition deleted and remaining fields verified');
    } catch (e) {
      await log.stepFail(page, 'Failed to delete block, action, or condition');
      throw e;
    }

    log.step('Save and Publish Bid Map and verify ACTIVE status');
    try {
      await saveAndPublishButtonPage.Save_and_Publish_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(correspondentPortalPage.Status).toContainText("ACTIVE");
      vars["Version"] = await correspondentPortalPage.Version.textContent() || '';
      await expect(page.getByText(vars["Version"]).first()).toBeVisible();
      log.stepPass('Bid Map saved and published. Status: ACTIVE, Version: ' + vars["Version"]);
    } catch (e) {
      await log.stepFail(page, 'Failed to Save and Publish or verify ACTIVE status');
      throw e;
    }

    log.tcEnd('PASS');

  } catch (e) {
    await log.captureOnFailure(page, TC_ID, e);
    log.tcEnd('FAIL');
    throw e;
  }
}