import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../step-groups';
import { BidRequestCreationPage } from '../../pages/correspondant/bid-request-creation';
import { BidRequestDetailsPage } from '../../pages/correspondant/bid-request-details';
import { CorrespondentPortal18Page } from '../../pages/correspondant/correspondent-portal-18';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../pages/correspondant/enumeration-mapping-button';
import { MapHeadersButtonPage } from '../../pages/correspondant/map-headers-button';
import { P15ActivePage } from '../../pages/correspondant/p-15-active';
import { ProceedWithSavingButtonPage } from '../../pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../pages/correspondant/save-and-publish-button';
import { SelectDropdownPage } from '../../pages/correspondant/select-dropdown';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { StatusInactivePage } from '../../pages/correspondant/status-inactive-';
import { ThisActionWillSaveTheChangesAndMoveToNextPagePage } from '../../pages/correspondant/this-action-will-save-the-changes-and-move-to-next-page';
import { UploadNewBidRequestButtonPage } from '../../pages/correspondant/upload-new-bid-request-button';

export async function runPrereq_892(page: Page, vars: Record<string, string>): Promise<void> {
  const bidRequestCreationPage = new BidRequestCreationPage(page);
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const correspondentPortal18Page = new CorrespondentPortal18Page(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
  const mapHeadersButtonPage = new MapHeadersButtonPage(page);
  const p15ActivePage = new P15ActivePage(page);
  const proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
  const rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
  const saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
  const selectDropdownPage = new SelectDropdownPage(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactivePage = new StatusInactivePage(page);
  const thisActionWillSaveTheChangesAndMoveToNextPagePage = new ThisActionWillSaveTheChangesAndMoveToNextPagePage(page);
  const uploadNewBidRequestButtonPage = new UploadNewBidRequestButtonPage(page);


  const testData: Record<string, string> = {
  "Company name 1": "Freedom",
  "Company name 2": "Wik1C BeuLD MoJbr CoEmy LLpoJ  - A2964",
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
  await stepGroups.stepGroup_Create_Bid_MapsCompanies_verification(page, vars);
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await correspondentPortalPage.Select_Companys_Dropdown.click();
  await correspondentPortalPage.Search_Text_Field.fill(testData["Company name 1"]);
  await p15ActivePage.Select_Company_Names.click();
  await correspondentPortalPage.Apply_Selected.click();
  await correspondentPortalPage.Select_Companys_Dropdown.click();
  await correspondentPortalPage.Search_Text_Field.fill(testData["Company name 2"]);
  await statusInactivePage.Select_Company_Name.click();
  await expect(correspondentPortalPage.Apply_Selected_for_Bid_Maps).toContainText("2");
  await correspondentPortalPage.Apply_Selected.click();
  await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, 'test-data', "DeepikaAugBidQA.xlsx"));
  await mapHeadersButtonPage.Map_Headers_Button.click();
  await expect(thisActionWillSaveTheChangesAndMoveToNextPagePage.This_action_will_save_the_changes_and_Move_to_Next_Page).toBeVisible();
  await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
  await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
  await correspondentPortal18Page.Yes_Proceed_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  // [DISABLED] Wait until the element You have unidentified fields do you want to proceed Further. is visible
  // await correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further.waitFor({ state: 'visible' });
  // [DISABLED] Verify that the element You have unidentified fields do you want to proceed Further. displays text You have unidentified fields do you want to proceed further. and With Scrollable FALSE
  // await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toContainText("You have unidentified fields do you want to proceed further.");
  await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
  await correspondentPortal18Page.Yes_Proceed_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await saveAndPublishButtonPage.Save_and_Publish_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await correspondentPortalPage.Bid_Requests.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await expect(uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button).toBeVisible();
  await uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await selectDropdownPage.Select_Company_In_BidRequest.click();
  await bidRequestCreationPage.Select_Company_Search_Input.fill(testData["Company name 1"]);
  await statusInactivePage.Required_Company_In_List.click();
  await expect(page.getByText(testData["Company name 1"])).toBeVisible();
  await correspondentPortalPage.Bid_Mapping_ID_Dropdown_2.click();
  await correspondentPortalPage.Search_boxBid_mapping_id.fill(vars["CreatedBidMap"]);
  await bidRequestDetailsPage.Searched_Data_in_List.waitFor({ state: 'visible' });
  // [DISABLED] Wait until the current page is loaded completely
  // await page.waitForLoadState('networkidle');
  // [DISABLED] Verify that the element Searched Data in List has value CreatedBidMap for title and With Scrollable FALSE
  // await expect(bidRequestDetailsPage.Searched_Data_in_List).toHaveAttribute('title', vars["CreatedBidMap"]);
}
