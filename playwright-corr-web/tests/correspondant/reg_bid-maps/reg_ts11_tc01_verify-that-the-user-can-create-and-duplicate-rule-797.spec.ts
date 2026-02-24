// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
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

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let actionruleheaderPage: ActionruleheaderPage;
  let amortizationTypePage: AmortizationTypePage;
  let backButtonPage: BackButtonPage;
  let bidSampleFieldNamePage: BidSampleFieldNamePage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let continueEditingButtonPage: ContinueEditingButtonPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let headeramappingPage: HeaderamappingPage;
  let headerMappingPage: HeaderMappingPage;
  let p1MoreButtonPage: P1MoreButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let rulesAndActionsPage: RulesAndActionsPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let selectFieldForBaseLoanAmounts1Page: SelectFieldForBaseLoanAmounts1Page;
  let selectFieldForBaseLoanAmounts3Page: SelectFieldForBaseLoanAmounts3Page;
  let spinnerPage: SpinnerPage;
  let statusInactive4Page: StatusInactive4Page;
  let statusInactivePage: StatusInactivePage;
  let whenBidFieldPage: WhenBidFieldPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    actionruleheaderPage = new ActionruleheaderPage(page);
    amortizationTypePage = new AmortizationTypePage(page);
    backButtonPage = new BackButtonPage(page);
    bidSampleFieldNamePage = new BidSampleFieldNamePage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    continueEditingButtonPage = new ContinueEditingButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    headeramappingPage = new HeaderamappingPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    p1MoreButtonPage = new P1MoreButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    rulesAndActionsPage = new RulesAndActionsPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    selectFieldForBaseLoanAmounts1Page = new SelectFieldForBaseLoanAmounts1Page(page);
    selectFieldForBaseLoanAmounts3Page = new SelectFieldForBaseLoanAmounts3Page(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive4Page = new StatusInactive4Page(page);
    statusInactivePage = new StatusInactivePage(page);
    whenBidFieldPage = new WhenBidFieldPage(page);
  });

  test('REG_TS11_TC01_Verify that the user can Create and Duplicate rule.', async ({ page }) => {
    const testData: Record<string, string> = {
  "HeaderMapping": "",
  "same Income": "",
  "Rule Name": "Rule 1",
  "BidEnumeratedTapeValue": "800",
  "Bid Field": "Base Loan Amount",
  "BidFields": "CLTV",
  "Bid Enumerated Tape Value": "80",
  "BidFields.": "DTI",
  "Chase  Values": "False",
  "UniqueColHeader/Enum": "TsSearchUniqueColHeaderEnum",
  "Save and Move to Next Page": "Save and Move to Next Page",
  "CSS Attribute": "2px solid rgb(227, 82, 5)",
  "Used Headers": "Show Used Headers",
  "2-4 Unit": "2-4 Unit",
  "Search Map Input": "Deepika Aug1",
  "Chase_Field_Name1": "Mortgage Type",
  "Unidentified Headers": "Show Unidentified Headers",
  "Operations": "GREATER",
  "Search Fields": "hii",
  "Operator 2 Symbol": ">",
  "Time Interval": "05",
  "Unidentified Enumerations": "Show Unidentified Enumerations",
  "Show All Enumerations": "Show All Enumerations",
  "Unidentfied and Save Message": "You have unidentified fields.  This action will save the changes and Move to Next Page.",
  "BidField": "FICO Score",
  "Search_Map": "Deepika Aug",
  "CustomHeader": "Header 02",
  "New Rule Name": "New Rule",
  "Assigned Companies1": "Wik1C BeuLD MoJbr CoEmy LLpoJ",
  "Unique Chase Value1": "AndoverBirchDrive1",
  "Company name 2": "Wik1C BeuLD MoJbr CoEmy LLpoJ  - A2964",
  "ChaseValue": "Attached",
  "Unused Enumerations": "Show Unused Enumerations",
  "Reason For Cancellation": "To Be Cancelled",
  "Reason For Deletion": "To Be Deleted",
  "ChaseValues.": "False",
  "Chase_Field_Name": "Mortgage Limit",
  "Header Mapping": "Show All Headers",
  "Chase Field Name": "Amortization Type",
  "ChaseFieldName": "Appraised Value",
  "UniqueBidEnumTapeValue": "852345",
  "Chase Fields Name": "Amortization Type, Appraised Value, Attachment Type, Aus List, Borrower First Name, Borrower Last Name, Buy Down, CLTV, City, DTI, Fico, First Time Home Buyer, First Time Homebuyer Credit Fee Waiver, Impound Types, Income Ami Ratio, Ineligible, Interest Only, LTV, Loan Amount, Loan Number, Loan Purpose, Loan Term, Monthly Income, Mortgage Limit, Mortgage Types, Note Rate, Number Of Unit, Occupancy Type, Product Name, Property Type, Property Valuation Type, Purchase Price, State, Street, Subordinate Loan Amount, TPO, Total Loan Amount, Unpaid Principal Balance, Zip",
  "Unique Chase Field Name": "Street",
  "Chase Value": "Fixed rate",
  "Search_Input": "TS_SEARCHMAP21",
  "Unused Headers": "Show Unused Headers",
  "Upload File Text Verification": "Drag and drop files here or click to browse. Allowed formats: .xls,.xlsx,.csv,.txt",
  "Search Field Company Name": "Wik1C",
  "Create Map": "Testsigma_04/03/2025/",
  "Custom Header": "Header01",
  "Investment (NOO)": "Investment (NOO)",
  "PropertyValuation": "1004Desktop",
  "ImportRuleName": "TEst",
  "Action Save message": "This action will save the changes and Move to Next Page",
  "SearchFields": "Hii",
  "Start Time in Minutes": "31",
  "Execution Type1": "STANDARD",
  "BidEnumeratedTapeValue - Block 2": "Fixed",
  "Execution Type": "CHASE_DIRECT",
  "UniqueColumnHeaderSearch": "TsSearchUniqueColumnHeader",
  "Start Time in Hour": "8",
  "UniqueWhenBidFieldSearch": "TsSearchWhenBidField",
  "WhenBidFieldName - Block 2": "Amortization Type",
  "EmptyChaseFieldName": "Select",
  "WhenBidFieldValue-3": "Appraised Value",
  "Unique Chase Value": "AndoverBirchDrive",
  "Loan Purpose": "Refinance (R&T)",
  "Advanced Search": "Fico",
  "ChaseFieldNames": "Aus List",
  "NO of Batches": "05",
  "CompanyName3": "American Pacific  - A4257",
  "Operator": "LESS_OR_EQUAL",
  "SelectingChaseFieldName": "7",
  "UpdatedBidEnumeratedTapeValue": "SAIKAT_18_FEB_002",
  "Search Input": "Test",
  "Company name 1": "Freedom",
  "Operator 3": "CONTAINS",
  "Expected Company Name": "Freedom",
  "Operation2": "GREATER",
  "Operation1": "LESS",
  "Operator - Block 2": "GREATER",
  "Bid Tape Value": "Fixed",
  "Search Field": "free",
  "Created Map Id": "Testsigma_05/07/2025/20:55:58",
  "Rule Name(Updated)": "UP Rule 1",
  "Operator 1 Symbol": "<",
  "UniqueChaseValueSearch": "TsSearchChaseValue",
  "Import Rule": "Testsigma_02/23/2026/01:02:39",
  "Duplicated Rule Name": "Rule 2",
  "Condition Bid Field": "FICO Score",
  "BidEnumeraedTapeValue - 3": "425000",
  "Chasevalues": "Variable rate",
  "DeleteId": "Testsigma_05/05/2025/16:23:13",
  "UpdatedWhenBidFieldName": "Correspondent Loan Number",
  "Unidentified fields Message": "You have unidentified fields do you want to proceed further.",
  "UniqueBidEnumTapeSearch": "TsSearchBidEnumTape",
  "Unidentified Fields Error Message": "You have unidentified fields.",
  "UniqueRuleNameSearch": "TsSearchUniqueRuleName"
}; // Profile: "Bid_Maps", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
    await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
    await expect(correspondentPortalPage.Rules_and_Actions_Step_4_of_4).toBeVisible();
    vars["Count of the Bid Sample"] = String(await bidSampleFieldNamePage.Common_Xpath_For_Bid_Sample.count());
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["Count of the Bid Sample"]))) {
      vars["Bid Sample Value"] = await bidSampleFieldNamePage.Bid_Sample_Value.textContent() || '';
      for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseInt(vars["count"]); dataIdx++) {
        // Write to test data profile: "HeaderMapping" = vars["Bid Sample Value"]
        vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
        await headeramappingPage.Header_Mapping_Title.click();
      }
    }
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
    await correspondentPortalPage.Add_Rule_Button.click();
    await whenBidFieldPage.When_Bid_Field_Dropdown.waitFor({ state: 'visible' });
    await whenBidFieldPage.When_Bid_Field_Dropdown.click();
    vars["total"] = "1";
    vars["Count of the Bid Field Options"] = String(await whenBidFieldPage.Common_Xpath_for_Options_Under_When_Bid_Field.count());
    while (parseFloat(String(vars["total"])) <= parseFloat(String(vars["Count of the Bid Field Options"]))) {
      vars["Option under When Bid Field"] = await whenBidFieldPage.Option_under_When_Bid_Field.textContent() || '';
      for (let dataIdx = parseInt(vars["total"]); dataIdx <= parseInt(vars["total"]); dataIdx++) {
        expect(String(vars["Option under When Bid Field"])).toBe(testData["HeaderMapping"]);
        await actionruleheaderPage.Rules_and_Actions_Heading.click();
        vars["total"] = (parseFloat(String(vars["total"])) + parseFloat(String("1"))).toFixed(0);
      }
    }
    await saveAndPublishButtonPage.Save_and_Publish_Button.click();
    await page.getByText("Rules and Actions").waitFor({ state: 'visible' });
    await continueEditingButtonPage.Continue_Editing_Button.click();
    await correspondentPortalPage.Rule_Name_is_required.waitFor({ state: 'visible' });
    await expect(whenBidFieldPage.When_Bid_Field_Dropdown_Red_Color).toBeVisible();
    await expect(rulesAndActionsPage.Chase_Value_Dropdown_Red_Color).toBeVisible();
    await expect(rulesAndActionsPage.Chase_Field_Name_Dropdown_Red_Color).toBeVisible();
    await expect(rulesAndActionsPage.Chase_Field_Name_Dropdown_Red_Color).toBeVisible();
    await stepGroups.stepGroup_Reading_Column_Data_from_XLS(page, vars);
    await stepGroups.stepGroup_Fetching_Income_Value_From_XLS(page, vars);
    await whenBidFieldPage.When_Bid_Field_Dropdown.click();
    await rulesAndActionsPage.Search_Input_under_When_Bid_Field.waitFor({ state: 'visible' });
    await rulesAndActionsPage.Search_Input_under_When_Bid_Field.fill("Income (Monthly)");
    await rulesAndActionsPage.Income_Option.click();
    await expect(amortizationTypePage.When_Bid_Field_in_ImportRule).toContainText("Income (Monthly)");
    await rulesAndActionsPage.Bid_Enumerated_Tape_Value_Dropdown.click();
    vars["income Value From UI"] = await rulesAndActionsPage.income_Value_From_UI.textContent() || '';
    expect(String(vars["income Value From UI"])).toBe(testData["same Income"] /* set: 02 */);
    await correspondentPortalPage.Enter_a_Rule_Name_Field.fill(testData["Rule Name"]);
    vars["RuleName"] = await correspondentPortalPage.Enter_a_Rule_Name_Field.inputValue() || '';
    expect(String(testData["Rule Name"])).toBe(vars["RuleName"]);
    await statusInactive4Page.Select_Category_Dropdown.click();
    vars["SelectCategory"] = await rulesAndActionsButtonPage.Select_Category_On_Rules_and_Actions.inputValue() || '';
    await correspondentPortalPage.First_Checkbox_Bid_Request.check();
    await correspondentPortalPage.Apply_Selected_1_button_in_Rule.click();
    // [DISABLED] Verify that the current page displays text SelectCategory
    // await expect(page.getByText(vars["SelectCategory"])).toBeVisible();
    await expect(correspondentPortalPage.Add_Conditions).toBeVisible();
    await chaseFieldNamePage.Operation_Dropdowns.selectOption({ label: "LESS" });
    await expect(chaseFieldNamePage.Operation_Dropdowns).toBeVisible();
    await correspondentPortalPage.Bid_Enumeration_Tape_Value_in_rule.click();
    await correspondentPortalPage.Search_Field_in_Bid_Enumerated_Tape_Value.click();
    await correspondentPortalPage.Dropdown_Select_105_202530_Yr_FHA_FixedGNMA_I_105.fill(testData["BidEnumeratedTapeValue"]);
    await expect(correspondentPortalPage.Dropdown_Select_105_202530_Yr_FHA_FixedGNMA_I_105).toHaveValue(testData["BidEnumeratedTapeValue"]);
    await correspondentPortalPage.Select_Button.click();
    await expect(chaseFieldNamePage.BidEnumeratedTapeValueField_1).toContainText(testData["BidEnumeratedTapeValue"]);
    await expect(correspondentPortalPage.Add_OR_Block_Button).toBeVisible();
    await correspondentPortalPage.Add_OR_Block_Button.click();
    await correspondentPortalPage.When_Bid_Field_in_Add_Conditions.click();
    await correspondentPortalPage.Search_Field_in_Add_Condition.click();
    await correspondentPortalPage.Search_Field_in_Add_Condition.fill(testData["Bid Field"]);
    vars["Bid Field"] = await correspondentPortalPage.Search_Field_in_Add_Condition.inputValue() || '';
    await expect(correspondentPortalPage.When_Bid_Field_Search_List).toContainText(vars["Bid Field"]);
    await correspondentPortalPage.Base_Loan_Amount_Dropdown.click();
    await expect(statusInactivePage.When_Bid_Field).toContainText(vars["Bid Field"]);
    await correspondentPortalPage.Operations_Dropdown2.selectOption({ label: "LESS" });
    await expect(correspondentPortalPage.Operations_Dropdown2).toBeVisible();
    await continueEditingButtonPage.select_field_for_Base_loan_amounts.click();
    await correspondentPortalPage.Bid_Enumerated_Tape_Values_Dropdown.click();
    await expect(chaseFieldNamePage.When_Bid_Field).toBeVisible();
    await expect(correspondentPortalPage.Add_Condition_Button).toBeVisible();
    await correspondentPortalPage.Add_Condition_Button.click();
    await selectFieldForBaseLoanAmounts1Page.select_field_for_Base_loan_amounts2.click();
    await correspondentPortalPage.When_Bid_Fields_Dropdown.click();
    await correspondentPortalPage.When_Bid_Fields_Dropdown.fill(testData["BidFields"]);
    await expect(correspondentPortalPage.When_Bid_Fields_Dropdown).toHaveValue(testData["BidFields"]);
    await correspondentPortalPage.Select_Button.click();
    await expect(statusInactivePage.Bid_Enumeration_TapeValue).toContainText(testData["BidFields"]);
    await selectFieldForBaseLoanAmounts3Page.select_field_for_CLTV2.click();
    await correspondentPortalPage.Select_Bid_Enumerated_Bid_Tape_values.click();
    await correspondentPortalPage.Select_Bid_Enumerated_Bid_Tape_values.fill(testData["Bid Enumerated Tape Value"]);
    await expect(correspondentPortalPage.Select_Bid_Enumerated_Bid_Tape_values).toHaveValue(testData["Bid Enumerated Tape Value"]);
    await correspondentPortalPage.Select_Button.click();
    await expect(statusInactivePage.When_BidEnumerated_Tape_Value).toContainText(testData["Bid Enumerated Tape Value"]);
    await expect(correspondentPortalPage.Add_Condition_Button).toBeVisible();
    await correspondentPortalPage.Add_Condition_Button.click();
    await selectFieldForBaseLoanAmounts1Page.select_field_for_Base_loan_amounts2.click();
    await p1MoreButtonPage.Search_Fields.click();
    await p1MoreButtonPage.Search_Fields.fill(testData["BidFields."]);
    await expect(correspondentPortalPage.BId_Field_Data).toContainText(testData["BidFields."]);
    await correspondentPortalPage.DTI_Dropdown.click();
    await correspondentPortalPage.Operation_Dropdown2.selectOption({ label: "LESS_OR_EQUAL" });
    await expect(correspondentPortalPage.Operation_Dropdown2).toBeVisible();
    await selectFieldForBaseLoanAmounts3Page.select_field_for_CLTV2.click();
    await backButtonPage.Bid_Enumerated_Tape_Values_for_DTI.click();
    await expect(correspondentPortalPage.Add_Actions).toBeVisible();
    vars["Chasefield_action"] = await chaseFieldNamePage.Chase_Field_Name_for_Add_action.textContent() || '';
    vars["Chasefield_action"] = String(vars["Chasefield_action"]).trim();
    await headerMappingPage.Chase_Field_Name_in_Rule.selectOption({ index: parseInt("16") });
    await expect(headerMappingPage.Chase_Field_Name_in_Rule).toHaveValue(vars["Chasefield_action"]);
    await correspondentPortalPage.Select_False_True_Dropdown.selectOption({ label: testData["Chase  Values"] });
    await expect(correspondentPortalPage.Select_False_True_Dropdown).toContainText("False");
    await correspondentPortalPage.Add_Action_Button.click();
    vars["Chase Field Name _Rule"] = await rulesAndActionsPage.Chase_Field_Name_Dropdwon.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    vars["Chase Fieldname_Rule"] = String(vars["Chase Field Name _Rule"]).trim();
    await correspondentPortalPage.Chase_Field_Name_in_Rule.selectOption({ index: parseInt("3") });
    await expect(correspondentPortalPage.Chase_Field_Name_in_Rule).toContainText(vars["Chase Fieldname_Rule"]);
    await correspondentPortalPage.Chase_Value_in_RulesandActions.selectOption({ label: "Attached" });
    await expect(correspondentPortalPage.Chase_Value_in_RulesandActions).toContainText("Attached");
    await correspondentPortalPage.Delete_Block_Button.click();
    await expect(chaseFieldNamePage.When_Bid_FieldValue_In_AddActions).toBeVisible();
    await correspondentPortalPage.Delete_Button_In_AddActions.click();
    await expect(statusInactivePage.Chase_Field_Name_in_AddActions).toBeVisible();
    await correspondentPortalPage.Delete_Button_inAddConditions.click();
    await expect(statusInactivePage.When_Bid_Field_in_AddConditions).toBeVisible();
    await saveAndPublishButtonPage.Save_and_Publish_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortalPage.Status).toContainText("ACTIVE");
    vars["Version"] = await correspondentPortalPage.Version.textContent() || '';
    await expect(page.getByText(vars["Version"])).toBeVisible();
  });
});
