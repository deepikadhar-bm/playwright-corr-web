// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { ContinueEditingButtonPage } from '../../../src/pages/correspondant/continue-editing-button';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { EnumerationMappingPage } from '../../../src/pages/correspondant/enumeration-mapping';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { MapHeaderPage } from '../../../src/pages/correspondant/map-header';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { NewMapPage } from '../../../src/pages/correspondant/new-map';
import { P15Active2Page } from '../../../src/pages/correspondant/p-15-active-2';
import { P1MoreButtonPage } from '../../../src/pages/correspondant/p-1-more-button';
import { P2142530YrFreddieMacFixedDropdownPage } from '../../../src/pages/correspondant/p-2142530-yr-freddie-mac-fixed-dropdown';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { runPrereq_814 } from '../../../src/helpers/prereqs/prereq-814';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let chaseFieldNamePage: ChaseFieldNamePage;
  let continueEditingButtonPage: ContinueEditingButtonPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let enumerationMappingPage: EnumerationMappingPage;
  let headerMappingPage: HeaderMappingPage;
  let mapHeaderPage: MapHeaderPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let newMapPage: NewMapPage;
  let p15Active2Page: P15Active2Page;
  let p1MoreButtonPage: P1MoreButtonPage;
  let p2142530YrFreddieMacFixedDropdownPage: P2142530YrFreddieMacFixedDropdownPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_814(page, vars);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    continueEditingButtonPage = new ContinueEditingButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    enumerationMappingPage = new EnumerationMappingPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    mapHeaderPage = new MapHeaderPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    newMapPage = new NewMapPage(page);
    p15Active2Page = new P15Active2Page(page);
    p1MoreButtonPage = new P1MoreButtonPage(page);
    p2142530YrFreddieMacFixedDropdownPage = new P2142530YrFreddieMacFixedDropdownPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test('REG_TS26_TC02_Verify that if there are multiple versions in a bid, then user should be able to restore the required active map version.', async ({ page }) => {

    const testData: Record<string, string> = {
  "Unidentified Fields Error Message": "You have unidentified fields.",
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
  "Duplicated Rule Name": "Rule 2",
  "Condition Bid Field": "FICO Score",
  "BidEnumeraedTapeValue - 3": "425000",
  "Chasevalues": "Variable rate",
  "DeleteId": "Testsigma_05/05/2025/16:23:13",
  "UpdatedWhenBidFieldName": "Correspondent Loan Number",
  "Unidentified fields Message": "You have unidentified fields do you want to proceed further.",
  "UniqueBidEnumTapeSearch": "TsSearchBidEnumTape",
  "UniqueRuleNameSearch": "TsSearchUniqueRuleName"
}; // Profile: "Bid_Maps", row: 0

    if (await continueEditingButtonPage.Continue_Editing_Button.isVisible()) {
      await continueEditingButtonPage.Continue_Editing_Button.click();
    }
    await correspondentPortalPage.Version.waitFor({ state: 'visible' });
    vars["Version"] = await correspondentPortalPage.Version.textContent() || '';
    await expect(page.getByText(vars["Version"])).toBeVisible();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText(vars["Create New Map"])).toBeVisible();
    await statusInactive2Page.Download_Map_Button.click();
    await expect(page.getByText(vars["Version"])).toBeVisible();
    await statusInactive2Page.Download_Map.hover();
    vars["DownloadMapName"] = await statusInactive2Page.Download_Map.textContent() || '';
    await expect(page.getByText(vars["DownloadMapName"])).toBeVisible();
    vars["ActiveVersion"] = await p2142530YrFreddieMacFixedDropdownPage.Version_Number.textContent() || '';
    await expect(page.getByText(vars["ActiveVersion"])).toBeVisible();
    vars["CreatedOn"] = await statusInactive2Page.Cretaed_On.textContent() || '';
    await expect(correspondentPortalPage.Restore_this_version_Button).toBeVisible();
    await expect(page.getByText(vars["CreatedOn"])).toBeVisible();
    await correspondentPortalPage.Restore_this_version_Button.click();
    vars["VersionNumber"] = await p2142530YrFreddieMacFixedDropdownPage.Version_Number.textContent() || '';
    await expect(page.getByText(vars["VersionNumber"])).toBeVisible();
    await chaseFieldNamePage.Ok_Button_Bid_Request.click();
    await expect(page.getByText(vars["Version"])).toBeVisible();
    await statusInactive2Page.Bid_Map_In_List_Screen.click();
    await expect(newMapPage.Individual_Selected_Company).toContainText(vars["SelectedCompanyName"]);
    await expect(page.getByText(vars["Create New Map"])).toBeVisible();
    await expect(p1MoreButtonPage.Uploaded_FileName).toContainText(vars["UploadedFileName"]);
    await expect(mapHeaderPage.Execution_Type_Dropdown_New).toHaveValue(vars["ExecutionType"]);
    await expect(mapHeaderPage.Execution_Type_Dropdown_New).not.toContainText(vars["ExecutionVersion2"]);
    await mapHeadersButtonPage.Map_Headers_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(headerMappingPage.Custom_Header).toBeVisible();
    vars["EditedChaseFieldNameVersion3"] = await headerMappingPage.Updated_Element_In_Header_Mapping.getAttribute('title') || '';
    expect(String(vars["EditedChaseFieldNameVersion3"])).toBe(vars["EditedChaseFieldNameVersion2"]);
    await expect(headerMappingPage.Deleted_Header_In_HeaderMaping).toBeVisible();
    await expect(chaseFieldNamePage.Header_2).toBeVisible();
    await stepGroups.stepGroup_Verification_Of_BidSampleNames_In_Header_Mapping_From_TDP(page, vars);
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await expect(statusInactivePage.You_have_unidentified_Fields_This_action_will_save_and_Move_to_Next_Page).toBeVisible();
    await correspondentPortalPage.Yes_Proceed_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["Bid Tape Value for After Deleted\\r"] = await p15Active2Page.Bid_Tape_Value.inputValue() || '';
    expect(String(vars["BidTapeValueforBeforeDeleted"])).toBe(vars["Bid Tape Value for After Deleted"]);
    vars["ChaseValueRestored"] = await enumerationMappingPage.To_be_edited_Chase_Value_ListEnum.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    vars["ChaseValueRestored"] = String(vars["ChaseValueRestored"]).trim();
    vars["EditedChaseValueVersion2"] = String(vars["EditedChaseValueVersion2"]).trim();
    expect(String(vars["ChaseValueRestored"])).toBe(vars["EditedChaseValueVersion2"]);
    await expect(enumerationMappingPage.Deleted_Field_In_Enumeration).toBeVisible();
    await stepGroups.stepGroup_Verifying_the_bidsample_to_bidtape_mapping_in_Enumpage_from_(page, vars);
    await stepGroups.stepGroup_Verifying_the_Mapping_of_ChaseField_and_ChaseValues_in_Enum_(page, vars);
    await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
    await expect(page.getByText(testData["Unidentified Fields Error Message"])).toBeVisible();
    await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(rulesAndActionsButtonPage.Condition_BidField_1).not.toContainText(vars["EditedBidField[RulesAndActions]"]);
    await expect(rulesAndActionsButtonPage.Condition_BidTape1).not.toContainText(vars["EditedBidTape[RulesAndActions]"]);
    await expect(correspondentPortalPage.Enter_a_Rule_Name_Field).toHaveValue(vars["First Rule Name"]);
    await expect(page.getByText(vars["SecondRuleName"])).not.toBeVisible();
    await expect(page.getByText(vars["ThirdRuleName"])).not.toBeVisible();
    await stepGroups.stepGroup_Verification_of_Rules_and_Action_Values_Before_EditingActive(page, vars);
    await saveAndPublishButtonPage.Save_and_Publish_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  });
});
