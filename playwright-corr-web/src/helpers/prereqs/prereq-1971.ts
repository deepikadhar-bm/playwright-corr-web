import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidmapPage } from '../../pages/correspondant/bidmap';
import { BidMapsPage } from '../../pages/correspondant/bid-maps';
import { ChaseFieldNamePage } from '../../pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../pages/correspondant/enumeration-mapping-button';
import { EnumPage } from '../../pages/correspondant/enum';
import { MapHeadersButtonPage } from '../../pages/correspondant/map-headers-button';
import { P1MoreButtonPage } from '../../pages/correspondant/p-1-more-button';
import { RulesAndActionsButtonPage } from '../../pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { StatusInactive2Page } from '../../pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../pages/correspondant/status-inactive-';
import { runPrereq_1056 } from './prereq-1056';

export async function runPrereq_1971(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1056(page, vars);

  const bidmapPage = new BidmapPage(page);
  const bidMapsPage = new BidMapsPage(page);
  const chaseFieldNamePage = new ChaseFieldNamePage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
  const enumPage = new EnumPage(page);
  const mapHeadersButtonPage = new MapHeadersButtonPage(page);
  const p1MoreButtonPage = new P1MoreButtonPage(page);
  const rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
  const saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactive2Page = new StatusInactive2Page(page);
  const statusInactivePage = new StatusInactivePage(page);



  const testData: Record<string, string> = {
  "UniqueColHeader/Enum": "TsSearchUniqueColHeaderEnum",
  "Unidentified fields Message": "You have unidentified fields do you want to proceed further.",
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
  "UniqueBidEnumTapeSearch": "TsSearchBidEnumTape",
  "Unidentified Fields Error Message": "You have unidentified fields.",
  "UniqueRuleNameSearch": "TsSearchUniqueRuleName"
}; // Profile: "Bid_Maps", row: 0

  await correspondentPortalPage.Cross_button_in_Bid_Map.click();
  await page.waitForLoadState('networkidle');
  await statusInactive2Page.SearchFilter_Fields.click();
  await statusInactive2Page.SearchFilter_Fields.fill(testData["UniqueColHeader/Enum"]);
  await page.waitForLoadState('networkidle');
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await expect(correspondentPortalPage.Enum).toBeVisible();
  await expect(enumPage.enum_Header_Rule).toContainText("enum:");
  await expect(bidMapsPage.Enum_SearchFIlter_Text).toContainText(testData["UniqueColHeader/Enum"]);
  await correspondentPortalPage.Enum.hover();
  await correspondentPortalPage.Show_All_Enum_SearchField.click();
  await page.waitForLoadState('networkidle');
  await statusInactivePage.BidMap_list_Screen.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await mapHeadersButtonPage.Map_Headers_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await expect(page.getByText(vars["UniqueBidMapName"])).toBeVisible();
  await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
  await expect(page.getByText(testData["Unidentified fields Message"])).toBeVisible();
  await correspondentPortalPage.Yes_Proceed_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await expect(page.getByText(testData["UniqueColHeader/Enum"])).toBeVisible();
  await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
  await expect(page.getByText(testData["Unidentified fields Message"])).toBeVisible();
  await correspondentPortalPage.Yes_Proceed_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await saveAndPublishButtonPage.Save_and_Publish_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await expect(bidmapPage.First_Bid_Map_Name).toContainText(vars["UniqueBidMapName"]);
  await chaseFieldNamePage.Select_all_for_Checkbox.click();
  await p1MoreButtonPage.Export_Selected_Dropdown.click();
  await stepGroups.stepGroup_Verification_of_ExportList_from_UI_to_Excel(page, vars);
}
