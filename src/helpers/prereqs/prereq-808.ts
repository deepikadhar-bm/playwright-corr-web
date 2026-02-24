import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { CcodePage } from '../../pages/correspondant/ccode';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { CreatedByPage } from '../../pages/correspondant/created-by';
import { EnumerationMappingButtonPage } from '../../pages/correspondant/enumeration-mapping-button';
import { HeadingSelectRulesPage } from '../../pages/correspondant/heading-select-rules';
import { LastModifiedByPage } from '../../pages/correspondant/last-modified-by';
import { LastModifiedPage } from '../../pages/correspondant/last-modified';
import { MapNamePage } from '../../pages/correspondant/map-name';
import { ProceedWithSavingButtonPage } from '../../pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { StatusInactivePage } from '../../pages/correspondant/status-inactive-';

export async function runPrereq_808(page: Page, vars: Record<string, string>): Promise<void> {
  const ccodePage = new CcodePage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const createdByPage = new CreatedByPage(page);
  const enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
  const headingSelectRulesPage = new HeadingSelectRulesPage(page);
  const lastModifiedByPage = new LastModifiedByPage(page);
  const lastModifiedPage = new LastModifiedPage(page);
  const mapNamePage = new MapNamePage(page);
  const proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
  const rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
  const saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactivePage = new StatusInactivePage(page);


  const testData: Record<string, string> = {
  "ChaseFieldNames": "Aus List",
  "Search Map Input": "Deepika Aug1",
  "UniqueColHeader/Enum": "TsSearchUniqueColHeaderEnum",
  "Save and Move to Next Page": "Save and Move to Next Page",
  "CSS Attribute": "2px solid rgb(227, 82, 5)",
  "Used Headers": "Show Used Headers",
  "2-4 Unit": "2-4 Unit",
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
  await expect(enumerationMappingButtonPage.Enumeration_Mapping_Button).toBeVisible();
  await correspondentPortalPage.Edit_icon_in_Header_Mapping.click();
  await expect(correspondentPortalPage.Update_Header).toBeVisible();
  await correspondentPortalPage.Chase_Field_Name.click();
  await correspondentPortalPage.Chase_Field_Name.selectOption({ label: testData["ChaseFieldNames"] });
  await correspondentPortalPage.Update_Header_Button.click();
  await page.waitForLoadState('networkidle');
  await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
  await expect(correspondentPortalPage.Heading_Save_and_Move_to_Next_Page1).toBeVisible();
  await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await expect(rulesAndActionsButtonPage.Rules_and_Actions_Button).toBeVisible();
  await correspondentPortalPage.Delete_icon_in_Enumeration_Mappings.click();
  await expect(correspondentPortalPage.Delete_Enumeration_Pair).toBeVisible();
  await correspondentPortalPage.Yes_Go_ahead_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
  if (true) /* Element You have unidentified Fields.This action will save a */ {
    await expect(statusInactivePage.You_have_unidentified_Fields_This_action_will_save_and_Move_to_Next_Page).toBeVisible();
    await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
  }
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await expect(saveAndPublishButtonPage.Save_and_Publish_Button).toBeVisible();
  await correspondentPortalPage.Import_Rule_Button.click();
  await expect(headingSelectRulesPage.Select_Rules).toBeVisible();
  await correspondentPortalPage.Search_Map_Input.fill(testData["Search Map Input"]);
  await correspondentPortalPage.Search_Map_Input_Dropdown.click();
  await correspondentPortalPage.Import_Rule_Checkbox.check();
  await correspondentPortalPage.Apply_Selected_Button_in_Import_Rule.click();
  await expect(correspondentPortalPage.Add_Conditions).toBeVisible();
  await saveAndPublishButtonPage.Save_and_Publish_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  vars["CCode"] = await ccodePage.CCode.textContent() || '';
  await expect(page.getByText(vars["CCode"])).toBeVisible();
  vars["MapName"] = await mapNamePage.Map_Name.textContent() || '';
  await expect(page.getByText(vars["MapName"])).toBeVisible();
  vars["CompanyName"] = await correspondentPortalPage.Company_Name.textContent() || '';
  await expect(correspondentPortalPage.Company_Name).toContainText(vars["CompanyName"]);
  vars["Status"] = await correspondentPortalPage.Status.textContent() || '';
  await expect(page.getByText(vars["Status"])).toBeVisible();
  vars["Version"] = await correspondentPortalPage.Version.textContent() || '';
  await expect(page.getByText(vars["Version"])).toBeVisible();
  vars["LastModified"] = await lastModifiedPage.Last_Modified.textContent() || '';
  await expect(page.getByText(vars["LastModified"])).toBeVisible();
  vars["CreatedOn"] = await correspondentPortalPage.Created_On.textContent() || '';
  await expect(page.getByText(vars["CreatedOn"])).toBeVisible();
  vars["Created By"] = await createdByPage.Created_By.textContent() || '';
  await expect(page.getByText(vars["Created By"])).toBeVisible();
  vars["LastModifiedBy"] = await lastModifiedByPage.Last_Modified_By.textContent() || '';
  await expect(page.getByText(vars["LastModifiedBy"])).toBeVisible();
}
