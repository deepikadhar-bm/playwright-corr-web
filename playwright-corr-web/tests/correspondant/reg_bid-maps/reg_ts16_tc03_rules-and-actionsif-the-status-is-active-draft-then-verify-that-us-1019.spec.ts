// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { DeleteDraftButtonPage } from '../../../src/pages/correspondant/delete-draft-button';
import { DeleteDraftPage } from '../../../src/pages/correspondant/delete-draft';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { HeaderamappingPage } from '../../../src/pages/correspondant/headeramapping';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { MapNameFieldInBidMapsPage } from '../../../src/pages/correspondant/map-name-field-in-bid-maps';
import { MapNamePage } from '../../../src/pages/correspondant/map-name';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { ViewActiveVersionButtonPage } from '../../../src/pages/correspondant/view-active-version-button';
import { ViewDraftButtonPage } from '../../../src/pages/correspondant/view-draft-button';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let deleteDraftButtonPage: DeleteDraftButtonPage;
  let deleteDraftPage: DeleteDraftPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let headeramappingPage: HeaderamappingPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let mapNameFieldInBidMapsPage: MapNameFieldInBidMapsPage;
  let mapNamePage: MapNamePage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let viewActiveVersionButtonPage: ViewActiveVersionButtonPage;
  let viewDraftButtonPage: ViewDraftButtonPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    deleteDraftButtonPage = new DeleteDraftButtonPage(page);
    deleteDraftPage = new DeleteDraftPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    headeramappingPage = new HeaderamappingPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    mapNameFieldInBidMapsPage = new MapNameFieldInBidMapsPage(page);
    mapNamePage = new MapNamePage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    viewActiveVersionButtonPage = new ViewActiveVersionButtonPage(page);
    viewDraftButtonPage = new ViewDraftButtonPage(page);
  });

  test('REG_TS16_TC03_(Rules and Actions)If the status is active draft, then verify that user should be able to switch the view between active draft and should be able to delete the defat version if not requi', async ({ page }) => {
    const testData: Record<string, string> = {
  "Duplicated Rule Name": "Rule 2",
  "New Rule Name": "New Rule",
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
    await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
    await correspondentPortalPage.Yes_Proceed_Button.waitFor({ state: 'visible' });
    await correspondentPortalPage.Yes_Proceed_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Adding_Rules_In_Rules_and_Actions_Screen(page, vars);
    await stepGroups.stepGroup_Add_Actions_in_Rules_and_Actions(page, vars);
    await stepGroups.stepGroup_Duplicating_Rule_In_Enumeration_Mapping(page, vars);
    await saveAndPublishButtonPage.Save_and_Publish_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await mapNameFieldInBidMapsPage.Bid_Map_Name_Field_In_Row.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await mapHeadersButtonPage.Map_Headers_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await correspondentPortalPage.Yes_Proceed_Button.waitFor({ state: 'visible' });
    await correspondentPortalPage.Yes_Proceed_Button.evaluate(el => (el as HTMLElement).click());
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
    await correspondentPortalPage.Yes_Proceed_Button.waitFor({ state: 'visible' });
    await correspondentPortalPage.Yes_Proceed_Button.evaluate(el => (el as HTMLElement).click());
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Editing_All_Fields_In_a_Rule(page, vars);
    await stepGroups.stepGroup_Deleting_the_Rule_in_Rules_and_Actions_Page(page, vars);
    await expect(page.getByText(testData["Duplicated Rule Name"])).not.toBeVisible();
    await stepGroups.stepGroup_Duplicating_Rule_In_Enumeration_Mapping(page, vars);
    await chaseFieldNamePage.Save_Draft.click();
    await viewActiveVersionButtonPage.View_Active_Version_Button.waitFor({ state: 'visible' });
    await viewActiveVersionButtonPage.View_Active_Version_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(headeramappingPage.Disabled_Headers).toBeVisible();
    await stepGroups.stepGroup_Verifying_that_Changes_Are_Not_Updated_In_Active_VersionRule(page, vars);
    await stepGroups.stepGroup_Verification_of_Rules_and_Action_Values_Before_EditingActive(page, vars);
    await expect(statusInactive2Page.Rule_Name).toHaveValue(testData["Duplicated Rule Name"]);
    vars["Rulename"] = await statusInactive2Page.Rule_Name.inputValue() || '';
    expect(String(vars["Rulename"])).toBe(testData["New Rule Name"]);
    await viewDraftButtonPage.View_Draft_Button.click();
    await expect(headeramappingPage.Disabled_Headers).toBeVisible();
    await expect(viewActiveVersionButtonPage.View_Active_Version_Button).toBeVisible();
    await expect(deleteDraftButtonPage.Delete_Draft_Button).toBeVisible();
    await deleteDraftButtonPage.Delete_Draft_Button.click();
    await expect(deleteDraftPage.Text_In_Delete_Draft).toBeVisible();
    await expect(deleteDraftPage.Yes_proceed_On_Delete_Draft).toBeVisible();
    await deleteDraftPage.Yes_proceed_On_Delete_Draft.click();
    await expect(mapNamePage.Active_Map_Name).toContainText("ACTIVE");
  });
});
