// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { CorrespondentPortal3Page } from '../../../src/pages/correspondant/correspondent-portal-3';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { DeleteIdPage } from '../../../src/pages/correspondant/delete-id';
import { DeleteMapPage } from '../../../src/pages/correspondant/delete-map';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { MapnamePage } from '../../../src/pages/correspondant/mapname';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { ShowAllPage } from '../../../src/pages/correspondant/show-all';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { ThisActionWillSaveTheChangesAndMoveToNextPagePage } from '../../../src/pages/correspondant/this-action-will-save-the-changes-and-move-to-next-page';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let bidmapPage: BidmapPage;
  let correspondentPortal3Page: CorrespondentPortal3Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let deleteIdPage: DeleteIdPage;
  let deleteMapPage: DeleteMapPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let mapnamePage: MapnamePage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let showAllPage: ShowAllPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let thisActionWillSaveTheChangesAndMoveToNextPagePage: ThisActionWillSaveTheChangesAndMoveToNextPagePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidmapPage = new BidmapPage(page);
    correspondentPortal3Page = new CorrespondentPortal3Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    deleteIdPage = new DeleteIdPage(page);
    deleteMapPage = new DeleteMapPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    mapnamePage = new MapnamePage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    showAllPage = new ShowAllPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    thisActionWillSaveTheChangesAndMoveToNextPagePage = new ThisActionWillSaveTheChangesAndMoveToNextPagePage(page);
  });

  test('REG_TS28_TC01_Verify that user should be able to delete the required bid map, and should be allowed to create a new one using the same name that is deleted.', async ({ page }) => {
    const testData: Record<string, string> = {
  "Save and Move to Next Page": "Save and Move to Next Page",
  "Unidentified fields Message": "You have unidentified fields do you want to proceed further.",
  "UniqueColHeader/Enum": "TsSearchUniqueColHeaderEnum",
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
  "UniqueBidEnumTapeSearch": "TsSearchBidEnumTape",
  "Unidentified Fields Error Message": "You have unidentified fields.",
  "UniqueRuleNameSearch": "TsSearchUniqueRuleName"
}; // Profile: "Bid_Maps", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.Bid_Maps_Menu.click();
    await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await expect(page.getByText(testData["Save and Move to Next Page"])).toBeVisible();
    await expect(page.getByText(testData["Unidentified fields Message"])).toBeVisible();
    await bidmapPage.Yes_Proceed_Button_Text.click();
    await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
    await expect(page.getByText(testData["Save and Move to Next Page"])).toBeVisible();
    await expect(page.getByText(testData["Unidentified fields Message"])).toBeVisible();
    await bidmapPage.Yes_Proceed_Button_Text.click();
    await stepGroups.stepGroup_Import_Rule_In_Rules_and_Actions(page, vars);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await saveAndPublishButtonPage.Save_and_Publish_Button.click();
    await page.reload();
    await page.waitForLoadState('networkidle');
    await statusInactive2Page.SearchFilter_Fields.click();
    await page.waitForLoadState('networkidle');
    await statusInactive2Page.SearchFilter_Fields.fill(vars["Create New Map"]);
    if (true) /* Element Highlighted Map Name is visible */ {
    }
    await showAllPage.Show_All_2.hover();
    await deleteIdPage.Click_on_Show_All.click();
    await page.waitForLoadState('networkidle');
    await deleteMapPage.Delete_Option.click();
    await correspondentPortalPage.Yes_Proceed_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText("No result")).toBeVisible();
    await correspondentPortalPage.Add_New_Mapping_Button.click();
    await mapnamePage.mapNamefiled.fill(vars["Create New Map"]);
    await page.waitForLoadState('networkidle');
    vars["BidMap"] = await mapnamePage.mapNamefiled.inputValue() || '';
    await correspondentPortalPage.Create_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortal3Page.Create_New_Map_Field).toHaveValue(vars["BidMap"]);
    await correspondentPortalPage.Select_Companys_Dropdown.click();
    await statusInactive2Page.Select_Required_Company_Name.click();
    await correspondentPortalPage.Apply_Selected.click();
    await expect(correspondentPortalPage.Upload_File).toHaveValue('');
    await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, 'test-data', "Bid Maps File.xlsx"));
    await mapHeadersButtonPage.Map_Headers_Button.click();
    await expect(thisActionWillSaveTheChangesAndMoveToNextPagePage.This_action_will_save_the_changes_and_Move_to_Next_Page).toBeVisible();
    await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  });
});
