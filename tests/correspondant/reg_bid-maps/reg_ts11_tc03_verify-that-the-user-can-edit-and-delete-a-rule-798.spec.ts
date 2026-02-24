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

  test.beforeEach(async ({ page }) => {
    vars = {};
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
  });

  test('REG_TS11_TC03_Verify that the user can Edit and Delete a rule.', async ({ page }) => {

    const testData: Record<string, string> = {
  "UpdatedWhenBidFieldName": "Correspondent Loan Number",
  "Operator": "LESS_OR_EQUAL",
  "UpdatedBidEnumeratedTapeValue": "SAIKAT_18_FEB_002",
  "WhenBidFieldValue-3": "Appraised Value",
  "Operator 3": "CONTAINS",
  "BidEnumeraedTapeValue - 3": "425000",
  "WhenBidFieldName - Block 2": "Amortization Type",
  "Operator - Block 2": "GREATER",
  "BidEnumeratedTapeValue - Block 2": "Fixed",
  "UniqueColHeader/Enum": "TsSearchUniqueColHeaderEnum",
  "Save and Move to Next Page": "Save and Move to Next Page",
  "CSS Attribute": "2px solid rgb(227, 82, 5)",
  "Used Headers": "Show Used Headers",
  "2-4 Unit": "2-4 Unit",
  "Search Map Input": "Deepika Aug1",
  "Chase_Field_Name1": "Mortgage Type",
  "Rule Name": "Rule 1",
  "Unidentified Headers": "Show Unidentified Headers",
  "Operations": "GREATER",
  "BidFields.": "DTI",
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
  "Bid Field": "Base Loan Amount",
  "Chase  Values": "False",
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
  "BidEnumeratedTapeValue": "800",
  "Chase Fields Name": "Amortization Type, Appraised Value, Attachment Type, Aus List, Borrower First Name, Borrower Last Name, Buy Down, CLTV, City, DTI, Fico, First Time Home Buyer, First Time Homebuyer Credit Fee Waiver, Impound Types, Income Ami Ratio, Ineligible, Interest Only, LTV, Loan Amount, Loan Number, Loan Purpose, Loan Term, Monthly Income, Mortgage Limit, Mortgage Types, Note Rate, Number Of Unit, Occupancy Type, Product Name, Property Type, Property Valuation Type, Purchase Price, State, Street, Subordinate Loan Amount, TPO, Total Loan Amount, Unpaid Principal Balance, Zip",
  "Unique Chase Field Name": "Street",
  "Chase Value": "Fixed rate",
  "Search_Input": "TS_SEARCHMAP21",
  "Unused Headers": "Show Unused Headers",
  "Upload File Text Verification": "Drag and drop files here or click to browse. Allowed formats: .xls,.xlsx,.csv,.txt",
  "Bid Enumerated Tape Value": "80",
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
  "Execution Type": "CHASE_DIRECT",
  "UniqueColumnHeaderSearch": "TsSearchUniqueColumnHeader",
  "Start Time in Hour": "8",
  "UniqueWhenBidFieldSearch": "TsSearchWhenBidField",
  "EmptyChaseFieldName": "Select",
  "Unique Chase Value": "AndoverBirchDrive",
  "BidFields": "CLTV",
  "Loan Purpose": "Refinance (R&T)",
  "Advanced Search": "Fico",
  "ChaseFieldNames": "Aus List",
  "NO of Batches": "05",
  "CompanyName3": "American Pacific  - A4257",
  "SelectingChaseFieldName": "7",
  "Search Input": "Test",
  "Company name 1": "Freedom",
  "Expected Company Name": "Freedom",
  "Operation2": "GREATER",
  "Operation1": "LESS",
  "Bid Tape Value": "Fixed",
  "Search Field": "free",
  "Created Map Id": "Testsigma_05/07/2025/20:55:58",
  "Rule Name(Updated)": "UP Rule 1",
  "Operator 1 Symbol": "<",
  "UniqueChaseValueSearch": "TsSearchChaseValue",
  "Import Rule": "Testsigma_02/23/2026/01:02:39",
  "Duplicated Rule Name": "Rule 2",
  "Condition Bid Field": "FICO Score",
  "Chasevalues": "Variable rate",
  "DeleteId": "Testsigma_05/05/2025/16:23:13",
  "Unidentified fields Message": "You have unidentified fields do you want to proceed further.",
  "UniqueBidEnumTapeSearch": "TsSearchBidEnumTape",
  "Unidentified Fields Error Message": "You have unidentified fields.",
  "UniqueRuleNameSearch": "TsSearchUniqueRuleName"
}; // Profile: "Bid_Maps", row: 0

    await page.waitForLoadState('networkidle');
    await correspondentPortalPage.Bid_Maps_name.click();
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
    vars["Rule Name"] = await correspondentPortalPage.Enter_a_Rule_Name_Field.inputValue() || '';
    await correspondentPortalPage.Enter_a_Rule_Name_Field.fill(Array.from({length: 2}, () => "ab".charAt(Math.floor(Math.random() * 2))).join(''));
    vars["UpdatedRuleName"] = await correspondentPortalPage.Enter_a_Rule_Name_Field.inputValue() || '';
    expect(String(vars["Rule Name"])).toBe(vars["UpdatedRuleName"]);
    await statusInactivePage.Selected1_Dropdown.click();
    await chaseFieldNamePage.Ineligible_Category.check();
    await chaseFieldNamePage.Apply_Selected_Button_for_Category.click();
    await expect(chaseFieldNamePage.Updated_SelectCategory).toBeVisible();
    await chaseFieldNamePage.Updated_SelectCategory.click();
    await expect(chaseFieldNamePage.Product_Category).toBeVisible();
    await expect(chaseFieldNamePage.Ineligible_Category).toBeVisible();
    await chaseFieldNamePage.Apply_Selected_Button_for_Category.click();
    vars["BeforeWhenBidField1"] = await statusInactivePage.AfterWhenBidField1.inputValue() || '';
    vars["BeforeOperator1"] = await chaseFieldNamePage.BeforeOperator1.inputValue() || '';
    vars["BeforeBidEnumTapeValue1"] = await chaseFieldNamePage.BidEnumeratedTapeValueField_1.inputValue() || '';
    vars["BeforeActionChaseFieldName1"] = await chaseFieldNamePage.UpdatingActionChaseFieldName_1.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    vars["BeforeActionChaseValue1"] = await statusInactivePage.AfterActionChaseValue1.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    await statusInactivePage.AfterWhenBidField1.click();
    await rulesAndActionsPage.Search_Input_under_When_Bid_Field.fill(testData["UpdatedWhenBidFieldName"]);
    await correspondentPortalPage.UpdatedWhenBidField1.click();
    await expect(statusInactivePage.AfterWhenBidField1).toContainText(testData["UpdatedWhenBidFieldName"]);
    await chaseFieldNamePage.BeforeOperator1.selectOption({ label: testData["Operator"] });
    await expect(chaseFieldNamePage.BeforeOperator1).toHaveValue(testData["Operator"]);
    await chaseFieldNamePage.BidEnumeratedTapeValueField_1.click();
    await correspondentPortalPage.Bid_EnumeratedTape_value_Existing_RowDropdown.click();
    await expect(chaseFieldNamePage.BidEnumeratedTapeValueField_1).toContainText(testData["UpdatedBidEnumeratedTapeValue"]);
    vars["ActionChaseFiledNew1"] = await chaseFieldNamePage.Chase_field_Name_New_one.textContent() || '';
    await chaseFieldNamePage.UpdatingActionChaseFieldName_1.selectOption({ index: parseInt("4") });
    await expect(chaseFieldNamePage.UpdatingActionChaseFieldName_1).toContainText(vars["ActionChaseFiledNew1"]);
    vars["ActionChaseValueNameNew1"] = await chaseFieldNamePage.ActionChaseValueNameNew1.textContent() || '';
    await statusInactivePage.AfterActionChaseValue1.selectOption({ index: parseInt("2") });
    await expect(statusInactivePage.AfterActionChaseValue1).toContainText(vars["ActionChaseValueNameNew1"]);
    vars["AfterWhenBidField1"] = await statusInactivePage.AfterWhenBidField1.inputValue() || '';
    vars["AfterOperator1"] = await chaseFieldNamePage.BeforeOperator1.inputValue() || '';
    vars["AfterBidEnurmeratedTapeValue1"] = await chaseFieldNamePage.BidEnumeratedTapeValueField_1.inputValue() || '';
    vars["AfterActionChaseFieldName1"] = await chaseFieldNamePage.UpdatingActionChaseFieldName_1.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    vars["AfterActionChaseValue1"] = await statusInactivePage.AfterActionChaseValue1.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    expect(String(vars["BeforeWhenBidField1"])).toBe(vars["AfterWhenBidField1"]);
    expect(String(vars["BeforeOperator1"])).toBe(vars["AfterOperator1"]);
    expect(String(vars["BeforeBidEnumTapeValue1"])).toBe(vars["AfterBidEnurmeratedTapeValue1"]);
    expect(String(vars["BeforeActionChaseFieldName1"])).toBe(vars["AfterActionChaseFieldName1"]);
    expect(String(vars["BeforeActionChaseValue1"])).toBe(vars["AfterActionChaseValue1"]);
    await p15ActivePage.Add_Condition.click();
    await chaseFieldNamePage.WhenBidField_3.click();
    await chaseFieldNamePage.Search_Input_under_When_Bid_Field_for_four_row.fill(testData["WhenBidFieldValue-3"]);
    await correspondentPortalPage.WhenBidFieldValue_3.click();
    await chaseFieldNamePage.Operator_3.selectOption({ label: testData["Operator 3"] });
    await p15ActivePage.BidEnumeraedTapeValue_3.click();
    await correspondentPortalPage.BidEnumeratedTapeValue_3.click();
    await expect(chaseFieldNamePage.WhenBidField_3).toContainText(testData["WhenBidFieldValue-3"]);
    await expect(chaseFieldNamePage.Operator_3).toHaveValue(testData["Operator 3"]);
    await expect(p15ActivePage.BidEnumeraedTapeValue_3).toContainText(testData["BidEnumeraedTapeValue - 3"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await p1morePage.Add_0R_Block.click();
    await chaseFieldNamePage.WhenBidFieldName_Block2.click();
    await chaseFieldNamePage.Search_Input_under_When_Bid_Field_for_Add_or_block.fill(testData["WhenBidFieldName - Block 2"]);
    await correspondentPortalPage.WhenBidFieldValue_Block_2.click();
    await expect(chaseFieldNamePage.WhenBidFieldName_Block2).toContainText(testData["WhenBidFieldName - Block 2"]);
    await chaseFieldNamePage.When_Bid_field_for_add_or_block_in_field2.selectOption({ label: testData["Operator - Block 2"] });
    await expect(chaseFieldNamePage.When_Bid_field_for_add_or_block_in_field2).toHaveValue(testData["Operator - Block 2"]);
    await chaseFieldNamePage.Bid_EnumeratedTapeField_Block_2.click();
    await correspondentPortalPage.BidEnumeratedTapeValue_Block_2.click();
    await expect(chaseFieldNamePage.Bid_EnumeratedTapeField_Block_2).toContainText(testData["BidEnumeratedTapeValue - Block 2"]);
    await duplicatecopyButtonPage.DuplicateCopy_Button.click();
    await chaseFieldNamePage.Duplicate_Rule_Name.fill(Array.from({length: 1}, () => "a".charAt(Math.floor(Math.random() * 1))).join(''));
    vars["Updated Rules and Actions name"] = await chaseFieldNamePage.Duplicate_Rule_Name.inputValue() || '';
    await rulesActionPage.Delete_last_Rule.click();
    await expect(correspondentPortalPage.Delete_Rule).toBeVisible();
    await correspondentPortalPage.Yes_Proceed_Button.click();
    await page.getByText(vars["Updated Rules and Actions name"]).waitFor({ state: 'hidden' });
    await expect(page.getByText(vars["Updated Rules and Actions name"])).not.toBeVisible();
    await page.waitForLoadState('networkidle');
    await statusInactivePage.AfterWhenBidField1.click();
    vars["Field"] = await chaseFieldNamePage.UpdatedWhenBidField_1.textContent() || '';
    await rulesAndActionsPage.Search_Input_under_When_Bid_Field.fill(vars["Field"]);
    await correspondentPortalPage.Select_under_When_field_name.click();
    await expect(statusInactivePage.AfterWhenBidField1).toContainText(vars["Field"]);
    await chaseFieldNamePage.BidEnumeratedTapeValueField_1.click();
    vars["UpdatedTapevalueField"] = await chaseFieldNamePage.UpdatedBidEnumeartedTapeValue_1.textContent() || '';
    await chaseFieldNamePage.Search_Tape_Field.fill(vars["UpdatedTapevalueField"]);
    await correspondentPortalPage.Select_under_When_field_name.click();
    await expect(chaseFieldNamePage.BidEnumeratedTapeValueField_1).toContainText(vars["UpdatedTapevalueField"]);
    await chaseFieldNamePage.UpdatingActionChaseFieldName_1.click();
    vars["ChaseFieldName"] = await addedOnPage.ChaseFiedName_1.textContent() || '';
    vars["ChaseFieldName"] = String(vars["ChaseFieldName"]).trim();
    await chaseFieldNamePage.UpdatingActionChaseFieldName_1.selectOption({ index: parseInt("4") });
    await expect(chaseFieldNamePage.UpdatingActionChaseFieldName_1).toContainText(vars["ChaseFieldName"]);
    vars["ChaseValue"] = await addHeaderPage.UpdatingChaseValue_1.textContent() || '';
    vars["ChaseValue"] = String(vars["ChaseValue"]).trim();
    await statusInactivePage.AfterActionChaseValue1.selectOption({ index: parseInt("1") });
    await expect(statusInactivePage.AfterActionChaseValue1).toContainText(vars["ChaseValue"]);
    await stepGroups.stepGroup_Add_Actions_In_Rules_and_Actions(page, vars);
    await expect(saveAndPublishButtonPage.Save_and_Publish_Button).toBeVisible();
    await saveAndPublishButtonPage.Save_and_Publish_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortalPage.Status).toContainText("ACTIVE");
    vars["Version"] = await correspondentPortalPage.Version.textContent() || '';
    await expect(page.getByText(vars["Version"])).toBeVisible();
  });
});
