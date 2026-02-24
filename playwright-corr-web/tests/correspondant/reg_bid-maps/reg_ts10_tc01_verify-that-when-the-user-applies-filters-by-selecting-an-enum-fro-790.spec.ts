// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { EnumerationMappingPage } from '../../../src/pages/correspondant/enumeration-mapping';
import { EnumFilterPage } from '../../../src/pages/correspondant/enum-filter';
import { FilterEnumerationsDropdownPage } from '../../../src/pages/correspondant/filter-enumerations-dropdown';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { P1MoreButtonPage } from '../../../src/pages/correspondant/p-1-more-button';
import { P3715DropdownPage } from '../../../src/pages/correspondant/p-3-7-15-dropdown';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let enumerationMappingPage: EnumerationMappingPage;
  let enumFilterPage: EnumFilterPage;
  let filterEnumerationsDropdownPage: FilterEnumerationsDropdownPage;
  let headerMappingPage: HeaderMappingPage;
  let p1MoreButtonPage: P1MoreButtonPage;
  let p3715DropdownPage: P3715DropdownPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    enumerationMappingPage = new EnumerationMappingPage(page);
    enumFilterPage = new EnumFilterPage(page);
    filterEnumerationsDropdownPage = new FilterEnumerationsDropdownPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    p1MoreButtonPage = new P1MoreButtonPage(page);
    p3715DropdownPage = new P3715DropdownPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS10_TC01_Verify that when the user applies filters by selecting an enum from the dropdown, only those corresponding enum records should be displayed, and the values will be displayed based on the', async ({ page }) => {
    const testData: Record<string, string> = {
  "Unidentified Enumerations": "Show Unidentified Enumerations",
  "Show All Enumerations": "Show All Enumerations",
  "Unused Enumerations": "Show Unused Enumerations",
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
  "Unidentified Fields Error Message": "You have unidentified fields.",
  "UniqueRuleNameSearch": "TsSearchUniqueRuleName"
}; // Profile: "Bid_Maps", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
    await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
    await stepGroups.stepGroup_Fetching_Enum_From_Header_Mapping_Screen_and_Verifying_the_S(page, vars);
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
    await correspondentPortalPage.Yes_Proceed_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(rulesAndActionsButtonPage.Rules_and_Actions_Button).toBeVisible();
    vars["count"] = "1";
    // [DISABLED] Store the count of elements identified by locator UnIdentified Fields into a variable Unidentified Count
    // vars["Unidentified Count"] = String(await enumerationMappingPage.UnIdentified_Fields.count());
    await correspondentPortalPage.Dropdown_Show_All_Enumerations_Show_Unidentified_Enum.selectOption({ label: testData["Unidentified Enumerations"] });
    vars["BidSampleCount"] = String(await enumerationMappingPage.Bid_Enum_names.count());
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["BidSampleCount"]))) {
      vars["IndividualBidSample"] = await enumerationMappingPage.Individual_Bid_Sample.textContent() || '';
      vars["UnidentifiedChaseValueCount"] = String(await enumerationMappingPage.Correspondent_Unidentified_Chase_Value.count());
      expect(String(vars["UnidentifiedChaseValueCount"])).toBe("1");
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    // [DISABLED] Verify that the selected option from multiple dropdown UnIdentified Fields , located using the same xpath , contains the Select .
    // expect(await enumerationMappingPage.UnIdentified_Fields.textContent() || '').toContain(String("Select"));
    while (true) /* Verify if count <= Unidentified Count */ {
      // [DISABLED] Store the text of the selected option from Individual Unidentified Field list into a variable Filledfields
      // vars["Filledfields"] = await enumerationMappingPage.Individual_Unidentified_Field.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
      // [DISABLED] Verify that the Individual Unidentified Field list has option with text Select selected and With Scrollable FALSE
      // await expect(enumerationMappingPage.Individual_Unidentified_Field).toHaveValue("Select");
      // [DISABLED] Perform addition on 1 and count and store the result inside a count considering 0 decimal places
      // vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    // [DISABLED] Select option using value Show All Enumerations in the Dropdown: Show All Enumerations Show Unidentified Enum list
    // await correspondentPortalPage.Dropdown_Show_All_Enumerations_Show_Unidentified_Enum.selectOption({ label: testData["Show All Enumerations"] });
    // [DISABLED] Store Number :: Random Number[Integer] in Number
    // vars["Number"] = String(Math.floor(Math.random() * (4 - 1 + 1)) + 1);
    // [DISABLED] Select option by index 1 in the Attachment Type for Unidentified list
    // await p1MoreButtonPage.Attachment_Type_for_Unidentified.selectOption({ index: parseInt("1") });
    // [DISABLED] Store 1 in count
    // vars["count"] = "1";
    // [DISABLED] Store the count of elements identified by locator Attachment Type in Enumeration Mapping into a variable AttachmentType in EnumerationMapping All field
    // vars["AttachmentType in EnumerationMapping All field"] = String(await p3715DropdownPage.Attachment_Type_in_Enumeration_Mapping.count());
    // [DISABLED] Select option using value Unidentified Enumerations in the Dropdown: Show All Enumerations Show Unidentified Enum list
    // await correspondentPortalPage.Dropdown_Show_All_Enumerations_Show_Unidentified_Enum.selectOption({ label: testData["Unidentified Enumerations"] });
    while (true) /* Verify if count <= AttachmentType in EnumerationMapping All  */ {
      // [DISABLED] Store the text of the selected option from Attachment Type for Unidentified list into a variable Filledfields
      // vars["Filledfields"] = await p1MoreButtonPage.Attachment_Type_for_Unidentified.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
      if (true) /* Verify if Filledfields == Select */ {
        // [DISABLED] Verify that the Attachment Type for Unidentified list has option with text Select selected and With Scrollable FALSE
        // await expect(p1MoreButtonPage.Attachment_Type_for_Unidentified).toHaveValue("Select");
      } else if (true) /* Verify if Filledfields != Select */ {
        // [DISABLED] Store the text of the selected option from Attachment Type for Unidentified list into a variable ChaseValue
        // vars["ChaseValue"] = await p1MoreButtonPage.Attachment_Type_for_Unidentified.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        // [DISABLED] Verify that the Attachment Type for Unidentified list has option with text ChaseValue selected and With Scrollable FALSE
        // await expect(p1MoreButtonPage.Attachment_Type_for_Unidentified).toHaveValue(vars["ChaseValue"]);
      }
      // [DISABLED] Perform addition on 1 and count and store the result inside a count considering 0 decimal places
      // vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    // [DISABLED] Store the count of elements identified by locator Attachment Type field have selected Count into a variable Attachment Type field have select option Count
    // vars["Attachment Type field have select option Count"] = String(await p1MoreButtonPage.Attachment_Type_field_have_selected_Count.count());
    // [DISABLED] Verify if Attachment Type field have select option Count != AttachmentType in EnumerationMapping All field
    // expect(String(vars["Attachment Type field have select option Count"])).toBe(vars["AttachmentType in EnumerationMapping All field"]);
    vars["BidFieldName"] = await enumFilterPage.Bid_Field_Name_Text.textContent() || '';
    await enumFilterPage.First_Checkbox_Element.check();
    await enumerationMappingPage.Status_Filter_DropdownEnumeration.selectOption({ label: testData["Unused Enumerations"] });
    await expect(page.getByText(vars["BidFieldName"])).not.toBeVisible();
    await correspondentPortalPage.Select_Clients_Dropdown_2.click();
    await correspondentPortalPage.Filter_Enumeration.check();
    await expect(correspondentPortalPage.Apply_Selected).toBeVisible();
    await correspondentPortalPage.Filter_Enumeration.uncheck();
    await expect(correspondentPortalPage.Apply_Selected).toBeVisible();
    vars["CountOfBidFields"] = String(await filterEnumerationsDropdownPage.Count_Of_BidFields_In_Dropdown.count());
    vars["FirstBidField"] = await filterEnumerationsDropdownPage.First_check_box_text.textContent() || '';
    await filterEnumerationsDropdownPage.Search_Box.fill(vars["FirstBidField"]);
    await expect(filterEnumerationsDropdownPage.Bid_field_Searched_for).toBeVisible();
    await filterEnumerationsDropdownPage.Cancel_Search_Button.click();
    await expect(filterEnumerationsDropdownPage.Search_Box).toHaveValue('');
    await expect(filterEnumerationsDropdownPage.Count_Of_BidFields_In_Dropdown).toHaveCount(parseInt(vars["CountOfBidFields"]));
    vars["checkbox count"] = String(await filterEnumerationsDropdownPage.Count_Of_BidFields_In_Dropdown.count());
    await filterEnumerationsDropdownPage.First_BidField_Checkbox.check();
    await page.waitForTimeout(2000);
    await filterEnumerationsDropdownPage.First_BidField_Checkbox.check();
    await filterEnumerationsDropdownPage.Show_Selected_Filter.click();
    await expect(filterEnumerationsDropdownPage.Show_Selected_Filter).toBeVisible();
    await expect(filterEnumerationsDropdownPage.Selected_BidFields).toBeVisible();
    vars["SelectedBidInFilterEnum"] = String(await filterEnumerationsDropdownPage.Selected_BidFields.count());
    expect(String(vars["SelectedBidInFilterEnum"])).toBe("2");
    await headerMappingPage.First_Checked_Bid.uncheck();
    await page.waitForTimeout(2000);
    await headerMappingPage.First_Checked_Bid.uncheck();
    await filterEnumerationsDropdownPage.Show_ALL_Filter.click();
    await expect(filterEnumerationsDropdownPage.Show_ALL_Filter).toBeVisible();
    await expect(page.getByText("Select All")).toBeVisible();
    vars["count"] = String(await filterEnumerationsDropdownPage.Count_of_Bids_Checkbox.count());
    expect(String(vars["checkbox count"])).toBe(vars["count"]);
    await filterEnumerationsDropdownPage.First_BidField_Checkbox_2.check();
    vars["FirstBidFieldName"] = await filterEnumerationsDropdownPage.First_check_box_text.textContent() || '';
    vars["FirstBidFieldName"] = String(vars["FirstBidFieldName"]).split("/")["1"] || '';
    await filterEnumerationsDropdownPage.Second_Checkbox_filter_enum.check();
    vars["SecondBidFieldName"] = await filterEnumerationsDropdownPage.Second_Bidfield_Checkbox_Text.textContent() || '';
    vars["SecondBidFieldName"] = String(vars["SecondBidFieldName"]).split("/")["1"] || '';
    await correspondentPortalPage.Apply_Selected.click();
    await expect(filterEnumerationsDropdownPage.Filtered_BidFields).toBeVisible();
    vars["count1"] = String(await filterEnumerationsDropdownPage.Filtered_BidFields.count());
    expect(String(vars["count1"])).toBe("2");
    await expect(enumerationMappingPage.First_selected_Bid).toContainText(vars["FirstBidFieldName"]);
    await expect(enumerationMappingPage.Second_Selected_Bid).toContainText(vars["SecondBidFieldName"]);
  });
});
