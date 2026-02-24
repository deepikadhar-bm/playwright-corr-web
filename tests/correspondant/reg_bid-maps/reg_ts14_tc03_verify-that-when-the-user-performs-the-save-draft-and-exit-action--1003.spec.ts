// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ActionruleheaderPage } from '../../../src/pages/correspondant/actionruleheader';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { ChaseFieldName2Page } from '../../../src/pages/correspondant/chase-field-name-2';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { ChaseValuePage } from '../../../src/pages/correspondant/chase-value';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { DuplicatecopyButtonPage } from '../../../src/pages/correspondant/duplicatecopy-button';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { MapNameFieldInBidMapsPage } from '../../../src/pages/correspondant/map-name-field-in-bid-maps';
import { RulecheckbidMapPage } from '../../../src/pages/correspondant/rulecheckbid-map';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { RulesAndActionsPage } from '../../../src/pages/correspondant/rules-and-actions';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SaveDraftExitButtonPage } from '../../../src/pages/correspondant/save-draft-exit-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactive4Page } from '../../../src/pages/correspondant/status-inactive--4';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';

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
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let mapNameFieldInBidMapsPage: MapNameFieldInBidMapsPage;
  let rulecheckbidMapPage: RulecheckbidMapPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let rulesAndActionsPage: RulesAndActionsPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let saveDraftExitButtonPage: SaveDraftExitButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactive4Page: StatusInactive4Page;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    actionruleheaderPage = new ActionruleheaderPage(page);
    bidmapPage = new BidmapPage(page);
    chaseFieldName2Page = new ChaseFieldName2Page(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    chaseValuePage = new ChaseValuePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    duplicatecopyButtonPage = new DuplicatecopyButtonPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    mapNameFieldInBidMapsPage = new MapNameFieldInBidMapsPage(page);
    rulecheckbidMapPage = new RulecheckbidMapPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    rulesAndActionsPage = new RulesAndActionsPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    saveDraftExitButtonPage = new SaveDraftExitButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactive4Page = new StatusInactive4Page(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test('REG_TS14_TC03_Verify that when the user performs the \\\"Save Draft and Exit\\\" action on each screen, a draft version is saved, and the user is redirected to the bid map list screen.[Rules and Actions]]', async ({ page }) => {
    const testData: Record<string, string> = {
  "New Rule Name": "New Rule",
  "Operation2": "GREATER",
  "Duplicated Rule Name": "Rule 2",
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
  "BidEnumeratedTapeValue - Block 2": "Fixed",
  "Execution Type": "CHASE_DIRECT",
  "UniqueColumnHeaderSearch": "TsSearchUniqueColumnHeader",
  "Start Time in Hour": "8",
  "UniqueWhenBidFieldSearch": "TsSearchWhenBidField",
  "WhenBidFieldName - Block 2": "Amortization Type",
  "EmptyChaseFieldName": "Select",
  "WhenBidFieldValue-3": "Appraised Value",
  "Unique Chase Value": "AndoverBirchDrive",
  "BidFields": "CLTV",
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
  "Operation1": "LESS",
  "Operator - Block 2": "GREATER",
  "Bid Tape Value": "Fixed",
  "Search Field": "free",
  "Created Map Id": "Testsigma_05/07/2025/20:55:58",
  "Rule Name(Updated)": "UP Rule 1",
  "Operator 1 Symbol": "<",
  "UniqueChaseValueSearch": "TsSearchChaseValue",
  "Import Rule": "Testsigma_02/23/2026/01:02:39",
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
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await correspondentPortalPage.Yes_Proceed_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(rulesAndActionsButtonPage.Rules_and_Actions_Button).toBeVisible();
    await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
    await bidmapPage.Yes_Proceed_Button_Text.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Adding_Rules_In_Rules_and_Actions_Screen(page, vars);
    await stepGroups.stepGroup_Add_Actions_in_Rules_and_Actions(page, vars);
    await stepGroups.stepGroup_Save_Draft_exit_and_Navigating_To_Rules_And_Actions(page, vars);
    await expect(correspondentPortalPage.Enter_a_Rule_Name_Field).toHaveValue(vars["Rule Name"]);
    await statusInactivePage.Selected1_Dropdown.click();
    await expect(rulesAndActionsPage.Category_In_Dropdown).toBeVisible();
    await correspondentPortalPage.Apply_Selected_1_button_in_Rule.click();
    await expect(rulesAndActionsButtonPage.Condition_BidField_1).toContainText(vars["RuleBidField"]);
    await expect(chaseFieldNamePage.Operation_Dropdowns).toHaveValue(vars["RuleCondition"]);
    await expect(rulesAndActionsButtonPage.Condition_BidTape1).toContainText(vars["RuleBidTapeValue"]);
    await expect(chaseFieldName2Page.Add_Actions_Chase_Field_Name).toHaveValue(vars["ActionChaseFieldName"]);
    await expect(chaseValuePage.Add_Actions_Chase_Value).toHaveValue(vars["ActionChaseValue"]);
    await stepGroups.stepGroup_Editing_of_Add_Conditions_and_Add_Actions(page, vars);
    await correspondentPortalPage.Enter_a_Rule_Name_Field.clear();
    await correspondentPortalPage.Enter_a_Rule_Name_Field.fill(testData["New Rule Name"]);
    await expect(correspondentPortalPage.Enter_a_Rule_Name_Field).toHaveValue(testData["New Rule Name"]);
    await statusInactive4Page.Select_Category_Dropdown.click();
    vars["EditedCategory"] = await rulesAndActionsPage.Second_Category_In_Dropdown.textContent() || '';
    await rulesAndActionsPage.Second_Category_Checkbox.check();
    await correspondentPortalPage.Apply_Selected_1_button_in_Rule.click();
    await chaseFieldNamePage.Operation_Dropdowns.selectOption({ label: testData["Operation2"] });
    await expect(chaseFieldNamePage.Operation_Dropdowns).toHaveValue(testData["Operation2"]);
    await actionruleheaderPage.Action_Chase_Field_Name_1.selectOption({ index: parseInt("17") });
    vars["EditedActionChaseFieldName"] = await actionruleheaderPage.Action_Chase_Field_Name_1.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    await rulecheckbidMapPage.Action_Chase_Value1.selectOption({ index: parseInt("1") });
    vars["EditedActionChaseValue"] = await rulecheckbidMapPage.Action_Chase_Value_1.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    await duplicatecopyButtonPage.DuplicateCopy_Button.click();
    await expect(rulesAndActionsPage.Duplicated_Block).toBeVisible();
    await statusInactive2Page.Rule_Name.clear();
    await statusInactive2Page.Rule_Name.fill(testData["Duplicated Rule Name"]);
    await expect(statusInactive2Page.Rule_Name).toHaveValue(testData["Duplicated Rule Name"]);
    await page.waitForLoadState('networkidle');
    await saveDraftExitButtonPage.Save_Draft_Exit_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await mapNameFieldInBidMapsPage.Bid_Map_Name_Field_In_Row.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText(vars["Create New Map"])).toBeVisible();
    await mapHeadersButtonPage.Map_Headers_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await expect(correspondentPortalPage.Heading_Save_and_Move_to_Next_Page1).toBeVisible();
    await correspondentPortalPage.Yes_Proceed_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
    await expect(correspondentPortalPage.Heading_Save_and_Move_to_Next_Page1).toBeVisible();
    await correspondentPortalPage.Yes_Proceed_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(rulesAndActionsButtonPage.Added_Rule_Block).toBeVisible();
    vars["BlocksCount"] = String(await rulesAndActionsButtonPage.Added_Rule_Block.count());
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["BlocksCount"]))) {
      await rulesAndActionsPage.Select_Category_DropdownNew.evaluate(el => (el as HTMLElement).click());
      if (String(vars["count"]) === String("1")) {
        vars["count1"] = "2";
        await expect(rulesAndActionsPage.Edited_Category_In_Dropdown).toBeVisible();
      }
      if (String(vars["count"]) === String("2")) {
        vars["count1"] = "2";
        await expect(rulesAndActionsPage.Edited_Category_In_Dropdown).toBeVisible();
      }
      await rulesAndActionsPage.Select_Category_DropdownNew.evaluate(el => (el as HTMLElement).click());
      await expect(rulesAndActionsPage.Common_Bid_Field_Rule).toContainText(vars["EditedRuleBidField[RulesAndActions]"]);
      await expect(rulesAndActionsButtonPage.Condition_BidTape1).toContainText(vars["EditedRuleBidTape[RulesAndActions]"]);
      await expect(correspondentPortalPage.Operations_Dropdown_Rules).toHaveValue(testData["Operation2"]);
      await expect(rulesAndActionsPage.Common_Action_Chase_Field_Name).toHaveValue(vars["EditedActionChaseFieldName"]);
      await expect(rulesAndActionsPage.Common_Action_Chase_Value).toHaveValue(vars["EditedActionChaseValue"]);
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    await expect(correspondentPortalPage.Enter_a_Rule_Name_Field).toHaveValue(testData["New Rule Name"]);
    await expect(statusInactive2Page.Rule_Name).toHaveValue(testData["Duplicated Rule Name"]);
    await stepGroups.stepGroup_Deleting_the_Rule_in_Rules_and_Actions_Page(page, vars);
    await stepGroups.stepGroup_Save_Draft_exit_and_Navigating_To_Rules_And_Actions(page, vars);
    await expect(page.getByText(testData["Duplicated Rule Name"])).not.toBeVisible();
    await expect(rulesAndActionsPage.Duplicated_Block).toBeVisible();
    await saveAndPublishButtonPage.Save_and_Publish_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  });
});
