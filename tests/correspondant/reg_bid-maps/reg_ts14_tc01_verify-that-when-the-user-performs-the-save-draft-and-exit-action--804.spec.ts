// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ActionruleheaderPage } from '../../../src/pages/correspondant/actionruleheader';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CompanybidmapPage } from '../../../src/pages/correspondant/companybidmap';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { FirstPagePage } from '../../../src/pages/correspondant/first-page';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { MapHeaderPage } from '../../../src/pages/correspondant/map-header';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { MapNameFieldInBidMapsPage } from '../../../src/pages/correspondant/map-name-field-in-bid-maps';
import { NewMapPage } from '../../../src/pages/correspondant/new-map';
import { P1MoreButtonPage } from '../../../src/pages/correspondant/p-1-more-button';
import { SaveDraftExitButtonPage } from '../../../src/pages/correspondant/save-draft-exit-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let actionruleheaderPage: ActionruleheaderPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let companybidmapPage: CompanybidmapPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let firstPagePage: FirstPagePage;
  let headerMappingPage: HeaderMappingPage;
  let mapHeaderPage: MapHeaderPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let mapNameFieldInBidMapsPage: MapNameFieldInBidMapsPage;
  let newMapPage: NewMapPage;
  let p1MoreButtonPage: P1MoreButtonPage;
  let saveDraftExitButtonPage: SaveDraftExitButtonPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    actionruleheaderPage = new ActionruleheaderPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    companybidmapPage = new CompanybidmapPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    firstPagePage = new FirstPagePage(page);
    headerMappingPage = new HeaderMappingPage(page);
    mapHeaderPage = new MapHeaderPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    mapNameFieldInBidMapsPage = new MapNameFieldInBidMapsPage(page);
    newMapPage = new NewMapPage(page);
    p1MoreButtonPage = new P1MoreButtonPage(page);
    saveDraftExitButtonPage = new SaveDraftExitButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS14_TC01_Verify that when the user performs the \\\"Save Draft and Exit\\\" action on each screen, a draft version is saved, and the user is redirected to the bid map list screen.[New BidMap and Head', async ({ page }) => {
    const testData: Record<string, string> = {
  "Company name 1": "Freedom",
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
    vars["Companyname"] = testData["Company name 1"];
    await stepGroups.stepGroup_Creating_New_BidMap_Upto_Upload_File(page, vars);
    vars["SelectedCompanyName"] = await newMapPage.Individual_Selected_Company.textContent() || '';
    vars["ExecutionType"] = await mapHeaderPage.Execution_Type_Dropdown_New.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    vars["UploadedFileName"] = await firstPagePage.Uploaded_File_Name.textContent() || '';
    await saveDraftExitButtonPage.Save_Draft_Exit_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await mapNameFieldInBidMapsPage.Bid_Map_Name_Field_In_Row.click();
    await mapHeadersButtonPage.Map_Headers_Button.waitFor({ state: 'visible' });
    await expect(companybidmapPage.New_Map_Name).toHaveValue(vars["Create New Map"]);
    await expect(newMapPage.Individual_Selected_Company).toContainText(vars["SelectedCompanyName"]);
    await expect(mapHeaderPage.Execution_Type_Dropdown_New).toHaveValue(vars["ExecutionType"]);
    await expect(p1MoreButtonPage.Uploaded_FileName).toContainText(vars["UploadedFileName"]);
    await mapHeadersButtonPage.Map_Headers_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Enumeration_Mapping_Button1.waitFor({ state: 'visible' });
    await stepGroups.stepGroup_Creating_New_Header_In_Header_Mapping_Screen(page, vars);
    await stepGroups.stepGroup_Editing_Header_Mapping(page, vars);
    vars["DeletedHeader[HeaderMapping]"] = await headerMappingPage.Deleting_Header.textContent() || '';
    await stepGroups.stepGroup_Delete_a_Header_In_Header_Mapping(page, vars);
    await headerMappingPage.First_Header_Checkbox.check();
    vars["FirstHeaderName"] = await headerMappingPage.First_Header_Bid_Sample_Name.textContent() || '';
    await actionruleheaderPage.Second_Header_Checkbox.check();
    vars["SecondHeaderName"] = await headerMappingPage.Second_Header_Bid_Sample_Name.textContent() || '';
    await expect(saveDraftExitButtonPage.Save_Draft_Exit_Button).toBeVisible();
    await saveDraftExitButtonPage.Save_Draft_Exit_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(mapNameFieldInBidMapsPage.Bid_Map_Name_Field_In_Row).toBeVisible();
    await mapNameFieldInBidMapsPage.Bid_Map_Name_Field_In_Row.click();
    await mapHeadersButtonPage.Map_Headers_Button.waitFor({ state: 'visible' });
    await mapHeadersButtonPage.Map_Headers_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.waitFor({ state: 'visible' });
    await expect(headerMappingPage.Custom_Header).toBeVisible();
    await expect(headerMappingPage.Custom_Header).toContainText(vars["customheadername"]);
    vars["CustomHeaderChaseValue"] = await headerMappingPage.Custom_Header_Chase_Value.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    expect(String(vars["clmfieldname"])).toBe(vars["CustomHeaderChaseValue"]);
    await expect(headerMappingPage.Updated_BidSample_Name).toContainText(vars["UpdatedBidSampleNameHeaderMapping"]);
    vars["ChaseFieldNameHeaderMapping"] = await headerMappingPage.Updated_Element_In_Header_Mapping.getAttribute('title') || '';
    expect(String(vars["ChaseFieldNameHeaderMapping"])).toBe(vars["UpdatedChaseFieldNameHeaderMapping"]);
    await expect(headerMappingPage.Deleted_Header_In_HeaderMaping).toBeVisible();
    await expect(headerMappingPage.Header_1).toBeVisible();
    await expect(chaseFieldNamePage.Header_2).toBeVisible();
    await headerMappingPage.Header_1.uncheck();
    await expect(headerMappingPage.Header_1).toBeVisible();
    await saveDraftExitButtonPage.Save_Draft_Exit_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await mapNameFieldInBidMapsPage.Bid_Map_Name_Field_In_Row.click();
    await expect(page.getByText(vars["Create New Map"])).toBeVisible();
    await mapHeadersButtonPage.Map_Headers_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(headerMappingPage.Header_1).toBeVisible();
    await expect(chaseFieldNamePage.Header_2).toBeVisible();
  });
});
