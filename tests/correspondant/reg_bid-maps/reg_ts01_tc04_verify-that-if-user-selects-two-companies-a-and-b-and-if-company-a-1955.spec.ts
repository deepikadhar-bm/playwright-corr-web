// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ActionsPage } from '../../../src/pages/correspondant/actions';
import { AdvanceSearchPage } from '../../../src/pages/correspondant/advance-search';
import { Amix4MosnaCovdaA4189CheckboxPage } from '../../../src/pages/correspondant/amix4-mosna-covda-a4189-checkbox';
import { BidMapsCompanyDropdownPage } from '../../../src/pages/correspondant/bid-maps-company-dropdown';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CheckboxPage } from '../../../src/pages/correspondant/checkbox';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { HeadingCreateNewMapPage } from '../../../src/pages/correspondant/heading-create-new-map';
import { HomeSweetMortgageCheckboxPage } from '../../../src/pages/correspondant/home-sweet-mortgage-checkbox';
import { NewMapNameInputPage } from '../../../src/pages/correspondant/new-map-name-input';
import { P15ActivePage } from '../../../src/pages/correspondant/p-15-active';
import { P1MoreButtonPage } from '../../../src/pages/correspondant/p-1-more-button';
import { P2142530YrFreddieMacFixedDropdownPage } from '../../../src/pages/correspondant/p-2142530-yr-freddie-mac-fixed-dropdown';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let actionsPage: ActionsPage;
  let advanceSearchPage: AdvanceSearchPage;
  let amix4MosnaCovdaA4189CheckboxPage: Amix4MosnaCovdaA4189CheckboxPage;
  let bidMapsCompanyDropdownPage: BidMapsCompanyDropdownPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let checkboxPage: CheckboxPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let headingCreateNewMapPage: HeadingCreateNewMapPage;
  let homeSweetMortgageCheckboxPage: HomeSweetMortgageCheckboxPage;
  let newMapNameInputPage: NewMapNameInputPage;
  let p15ActivePage: P15ActivePage;
  let p1MoreButtonPage: P1MoreButtonPage;
  let p2142530YrFreddieMacFixedDropdownPage: P2142530YrFreddieMacFixedDropdownPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    actionsPage = new ActionsPage(page);
    advanceSearchPage = new AdvanceSearchPage(page);
    amix4MosnaCovdaA4189CheckboxPage = new Amix4MosnaCovdaA4189CheckboxPage(page);
    bidMapsCompanyDropdownPage = new BidMapsCompanyDropdownPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    checkboxPage = new CheckboxPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    headingCreateNewMapPage = new HeadingCreateNewMapPage(page);
    homeSweetMortgageCheckboxPage = new HomeSweetMortgageCheckboxPage(page);
    newMapNameInputPage = new NewMapNameInputPage(page);
    p15ActivePage = new P15ActivePage(page);
    p1MoreButtonPage = new P1MoreButtonPage(page);
    p2142530YrFreddieMacFixedDropdownPage = new P2142530YrFreddieMacFixedDropdownPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test('REG_TS01_TC04_Verify that if user selects two companies \\\"A and B\\\" and if company a has both exe type and company b has only chase exe type, then user should be able to view only chase exe type in th', async ({ page }) => {
    const testData: Record<string, string> = {
  "Execution Type": "CHASE_DIRECT",
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
  "Unidentified Fields Error Message": "You have unidentified fields.",
  "UniqueRuleNameSearch": "TsSearchUniqueRuleName"
}; // Profile: "Bid_Maps", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    // [DISABLED] Navigation to Customer Permission
    // await stepGroups.stepGroup_Navigation_to_Customer_Permission(page, vars);
    await stepGroups.stepGroup_Navigate_to_Customer_Permission_to_Fetch_First_Company_Name(page, vars);
    await stepGroups.stepGroup_Store_Company_Names_from_Company_Permissions(page, vars);
    await stepGroups.stepGroup_Store_More_Company_Name(page, vars);
    await stepGroups.stepGroup_Standard_and_Chase_Direct_ON_for_Company(page, vars);
    await stepGroups.stepGroup_Store_More_Company_Name(page, vars);
    await stepGroups.stepGroup_Only_Chase_Direct_On_for_Company(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.Bid_Maps_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Add_New_Mapping_Button.click();
    await expect(headingCreateNewMapPage.Create_New_Map).toBeVisible();
    vars["Create New Map"] = new Date().toLocaleDateString('en-US') /* format: dd/MM/yyyy/HH:mm:ss */;
    vars["Create New Map"] = "Testsigma_" + vars["Create New Map"];
    await correspondentPortalPage.Create_New_Map_Field.fill(vars["Create New Map"]);
    vars["BidMap"] = await correspondentPortalPage.Create_New_Map_Field.inputValue() || '';
    await correspondentPortalPage.Create_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(p2142530YrFreddieMacFixedDropdownPage.Bid_Maps_Name).toContainText(vars["Create New Map"]);
    await correspondentPortalPage.Select_Companys_Dropdown.click();
    await stepGroups.stepGroup_Enter_Company_Name_in_New_Map_Filter(page, vars);
    await stepGroups.stepGroup_Enter_Company_Name_in_New_Map_Filter(page, vars);
    await expect(correspondentPortalPage.Apply_Selected_for_Bid_Maps).toContainText("2");
    await correspondentPortalPage.Apply_Selected.click();
    vars["CompanyNamePartial"] = String(vars["FirstCompanyName"]).substring(0, String(vars["FirstCompanyName"]).length - 4);
    await expect(actionsPage.CompanyName_Below_Dropdown).toContainText(vars["FirstCompanyName"]);
    vars["CompanyNamePartial"] = String(vars["SecondCompanyName"]).substring(0, String(vars["SecondCompanyName"]).length - 10);
    await expect(actionsPage.CompanyName_Below_Dropdown).toContainText(vars["SecondCompanyName"]);
    await correspondentPortalPage.Dropdown_selection_2.click();
    await expect(correspondentPortalPage.Dropdown_selection_2).toHaveValue("STANDARD");
    await bidMapsCompanyDropdownPage.Remove_second_Selected_Company_buttonBid_Map_Creation.click();
    await statusInactivePage.Selected1_Dropdown.click();
    await correspondentPortalPage.Search_Text_Field.fill(vars["SecondCompanyName"]);
    await expect(correspondentPortalPage.Check_box).toBeVisible();
    await statusInactivePage.Selected1_Dropdown.click();
    await bidMapsCompanyDropdownPage.Remove_First_Selected_Company_ButtonBid_map_creation.click();
    await correspondentPortalPage.Select_Companys_Dropdown.click();
    await stepGroups.stepGroup_Enter_Company_Name_in_New_Map_Filter(page, vars);
    await stepGroups.stepGroup_Enter_Company_Name_in_New_Map_Filter(page, vars);
    await correspondentPortalPage.Apply_Selected.click();
    await correspondentPortalPage.Dropdown_selection_2.click();
    await expect(correspondentPortalPage.Dropdown_selection_2.locator('option', { hasText: "CHASE_DIRECT" })).toBeVisible();
    await correspondentPortalPage.Cross_button_in_Bid_Map.click();
    await correspondentPortalPage.Cross_button_in_Bid_Map.click();
    await correspondentPortalPage.Select_Companys_Dropdown.click();
    await stepGroups.stepGroup_Enter_Company_Name_in_New_Map_Filter(page, vars);
    await expect(correspondentPortalPage.Apply_Selected).toContainText("1");
    await correspondentPortalPage.Apply_Selected.click();
    await correspondentPortalPage.Dropdown_selection_2.click();
    await correspondentPortalPage.Dropdown_selection_2.hover();
    await correspondentPortalPage.Dropdown_selection_2.click();
    await correspondentPortalPage.Dropdown_selection_2.hover();
    await correspondentPortalPage.Dropdown_selection_2.selectOption({ label: testData["Execution Type"] });
    await expect(correspondentPortalPage.Dropdown_selection_2).toHaveValue(testData["Execution Type"]);
    await correspondentPortalPage.Cross_button_in_Bid_Map.click();
    await correspondentPortalPage.Select_Companys_Dropdown.click();
    await stepGroups.stepGroup_Enter_Company_Name_in_New_Map_Filter(page, vars);
    await stepGroups.stepGroup_Enter_Company_Name_in_New_Map_Filter(page, vars);
    await correspondentPortalPage.Search_Text_Field.clear();
    await checkboxPage.checkbox2.check();
    vars["ThirdCompanyName"] = await correspondentPortalPage.Third_Company_Name.textContent() || '';
    await homeSweetMortgageCheckboxPage.FourthCompany_Checkbox.check();
    vars["FourthCompanyName"] = await correspondentPortalPage.Fourth_Company_Name.textContent() || '';
    await statusInactive2Page.Import_Rule_Checkbox.check();
    vars["FifthCompanyName"] = await correspondentPortalPage.Fifth_Company_Name.textContent() || '';
    await amix4MosnaCovdaA4189CheckboxPage.SixthCompany_Checkbox.check();
    vars["SixthCompanyName"] = await correspondentPortalPage.Sixth_Company_Name.textContent() || '';
    await expect(correspondentPortalPage.Apply_Selected).toContainText("6");
    await correspondentPortalPage.Apply_Selected.click();
    vars["ExpectedThirdCompanyName"] = await statusInactivePage.Below_Dropdown_First_company.textContent() || '';
    expect(String(vars["ExpectedThirdCompanyName"])).toBe(vars["ThirdCompanyName"]);
    await expect(advanceSearchPage.Below_Dropdown_Second_Company).toContainText(vars["FourthCompanyName"]);
    vars["ExpectedFifthCompanyName"] = String(vars["FifthCompanyName"]).trim();
    vars["FifthCompanyName1"] = await p15ActivePage.Below_Dropdown_Third_Company.textContent() || '';
    vars["FifthCompanyName1"] = String(vars["FifthCompanyName1"]).trim();
    expect(String(vars["FifthCompanyName1"])).toBe(vars["ExpectedFifthCompanyName"]);
    await correspondentPortalPage._2_more_Button.click();
    vars["lastcompany"] = await statusInactive2Page.Below_Dropdown_Fourth_Company.textContent() || '';
    expect(String(vars["lastcompany"])).toBe(vars["SixthCompanyName"]);
    await chaseFieldNamePage.Ok_Button_Bid_Request.click();
    await page.waitForLoadState('networkidle');
    // [DISABLED] Verify that the current page does not displays text FirstCompanyName
    // await expect(page.getByText(vars["FirstCompanyName"])).not.toBeVisible();
    await expect(page.getByText(vars["SecondCompanyName"])).not.toBeVisible();
    await expect(correspondentPortalPage.More_companies).toContainText("2");
    await correspondentPortalPage.More_companies.hover();
    await expect(correspondentPortalPage.Dropdown_selection_2).toHaveValue('');
    await p1MoreButtonPage._1_more_Button.click();
    await page.waitForLoadState('networkidle');
    vars["Added On"] = new Date().toLocaleDateString('en-US') /* format: MM/dd/yyyy hh:mm a */;
    vars["Added On Bid Map"] = await correspondentPortalPage.Added_On.textContent() || '';
    expect(String(vars["Added On"])).toBe(vars["Added On Bid Map"]);
    await correspondentPortalPage.close_pop_up_bid_request_details.click();
    await page.waitForLoadState('networkidle');
    await correspondentPortalPage.Save_Draft_Button1.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(newMapNameInputPage.New_Map_Name_Input).toBeEditable();
    await newMapNameInputPage.New_Map_Name_Input.fill(Array.from({length: 5}, () => "ab".charAt(Math.floor(Math.random() * 2))).join(''));
    vars["EditedFileName"] = await newMapNameInputPage.New_Map_Name_Input.inputValue() || '';
    await expect(newMapNameInputPage.New_Map_Name_Input).toHaveValue(vars["EditedFileName"]);
    await actionsPage.Save_Draft_Exit.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText(vars["EditedFileName"])).toBeVisible();
  });
});
