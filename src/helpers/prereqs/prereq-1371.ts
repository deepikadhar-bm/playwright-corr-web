import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../step-groups';
import { ActionruleheaderPage } from '../../pages/correspondant/actionruleheader';
import { BidmapPage } from '../../pages/correspondant/bidmap';
import { BidMapPage } from '../../pages/correspondant/bid-map';
import { CcodePage } from '../../pages/correspondant/ccode';
import { ColumnheaderrulePage } from '../../pages/correspondant/columnheaderrule';
import { CorrespondentPortal18Page } from '../../pages/correspondant/correspondent-portal-18';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { DeleteIdPage } from '../../pages/correspondant/delete-id';
import { EnumerationMappingButtonPage } from '../../pages/correspondant/enumeration-mapping-button';
import { EnumPage } from '../../pages/correspondant/enum';
import { HeaderMappingPage } from '../../pages/correspondant/header-mapping';
import { MappingListPage } from '../../pages/correspondant/mapping-list';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { ProceedWithSavingButtonPage } from '../../pages/correspondant/proceed-with-saving-button';
import { RulecheckbidMapPage } from '../../pages/correspondant/rulecheckbid-map';
import { RulesAndActionsButtonPage } from '../../pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { StatusInactive2Page } from '../../pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../pages/correspondant/status-inactive-';
import * as excelHelper from '../excel-helpers';

export async function runPrereq_1371(page: Page, vars: Record<string, string>): Promise<void> {
  const actionruleheaderPage = new ActionruleheaderPage(page);
  const bidmapPage = new BidmapPage(page);
  const bidMapPage = new BidMapPage(page);
  const ccodePage = new CcodePage(page);
  const columnheaderrulePage = new ColumnheaderrulePage(page);
  const correspondentPortal18Page = new CorrespondentPortal18Page(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const deleteIdPage = new DeleteIdPage(page);
  const enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
  const enumPage = new EnumPage(page);
  const headerMappingPage = new HeaderMappingPage(page);
  const mappingListPage = new MappingListPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
  const rulecheckbidMapPage = new RulecheckbidMapPage(page);
  const rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
  const saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactive2Page = new StatusInactive2Page(page);
  const statusInactivePage = new StatusInactivePage(page);


  // Set up download handler
  page.on('download', async (download) => {
    const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
    await download.saveAs(filePath);
    vars['_lastDownloadPath'] = filePath;
  });

  const testData: Record<string, string> = {
  "Search Functionality BidMaps": "",
  "UniqueColumnHeaderSearch": "TsSearchUniqueColumnHeader",
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
  // [DISABLED] Store 1 in count
  // vars["count"] = "1";
  // [DISABLED] Store Name :: Lastname in RandomName
  // vars["RandomName"] = ['Smith','Johnson','Williams','Brown','Jones','Davis','Miller','Wilson'][Math.floor(Math.random() * 8)];
  while (true) /* Verify if count <= 5 */ {
    // [DISABLED] Creating New Bid Map
    // await stepGroups.stepGroup_Creating_New_Bid_Map(page, vars);
    // [DISABLED] Perform addition on count and 1 and store the result inside a count considering 0 decimal places
    // vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
  }
  await stepGroups.stepGroup_Create_NewMap(page, vars);
  vars["CommonKeyword"] = vars["SearchFieldInputMap"];
  // [DISABLED] Click on Administration_Menu
  // await correspondentPortalPage.Administration_Menu.click();
  // [DISABLED] Wait until the element Bid Maps_Menu is visible
  // await correspondentPortalPage.Bid_Maps_Menu.waitFor({ state: 'visible' });
  // [DISABLED] Click on Bid Maps_Menu
  // await correspondentPortalPage.Bid_Maps_Menu.click();
  // [DISABLED] Wait until the element Spinner is not visible
  // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  // [DISABLED] Wait until the element Search/Filter Input Field is visible
  // await statusInactive2Page.SearchFilter_Fields.waitFor({ state: 'visible' });
  // [DISABLED] Enter Common KeyWord in the Search/Filter Input Field field
  // await statusInactive2Page.SearchFilter_Fields.fill(vars["Common KeyWord"]);
  // [DISABLED] Wait until the element Spinner is not visible
  // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  // [DISABLED] Click on Search/Filter Input Field
  // await statusInactive2Page.SearchFilter_Fields.click();
  // [DISABLED] Wait until the element BidMapTitle is visible
  // await correspondentPortalPage.BidMapTitle.waitFor({ state: 'visible' });
  // [DISABLED] Wait until the element KeyWord Related Bid Maps is visible
  // await bidmapPage.KeyWord_Related_Bid_Maps.waitFor({ state: 'visible' });
  // [DISABLED] Mouseover the element BidMapTitle
  // await correspondentPortalPage.BidMapTitle.hover();
  // [DISABLED] Click on Show All Option
  // await deleteIdPage.Click_on_Show_All.click();
  // [DISABLED] Wait until the current page is loaded completely
  // await page.waitForLoadState('networkidle');
  // [DISABLED] Wait until the element Spinner is not visible
  // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  // [DISABLED] Store the count of elements identified by locator BidMaps Count on Mappings Page into a variable BidMaps Count on Mappings Page
  // vars["BidMaps Count on Mappings Page"] = String(await bidMapPage.BidMaps_Count_on_Mappings_Page.count());
  // [DISABLED] Check the checkbox selectAllCheckbox
  // await correspondentPortalPage.Check_box.check();
  // [DISABLED] Verify that the element selectAllCheckbox is checked and With Scrollable FALSE
  // await expect(correspondentPortalPage.Check_box).toBeVisible();
  // [DISABLED] Wait until the element Export Selected Button is enabled
  // await mappingListPage.Export_Selected_Button.waitFor({ state: 'visible' });
  // [DISABLED] Click on Export Selected Button
  // await mappingListPage.Export_Selected_Button.click();
  // [DISABLED] Verify that the element Export List is present and With Scrollable FALSE
  // await expect(correspondentPortalPage.Export_List).toBeVisible();
  // [DISABLED] Click on Export List
  // await correspondentPortalPage.Export_List.click();
  // [DISABLED] Wait until all files are download in all browsers
  // await page.waitForTimeout(3000); // Wait for download to complete
  // [DISABLED] Wait for 120 seconds
  // await page.waitForTimeout(120000);
  // [DISABLED] Store Search Functionality BidMaps in updatedValueFromTDP
  // vars["updatedValueFromTDP"] = testData["Search Functionality BidMaps"];
  // [DISABLED] Verify if BidMaps Count on Mappings Page == 5
  // expect(String(vars["BidMaps Count on Mappings Page"])).toBe("5");
  // [DISABLED] Store 1 in mapCount
  // vars["mapCount"] = "1";
  while (true) /* Verify if mapCount <= 5 */ {
    // [DISABLED] Click on Show 20
    // await correspondentPortalPage.Show_20.click();
    for (let i = 0; i < 1; i++) /* Loop over data set in Search Functionality BidMaps from inde */ {
      while (true) /* Verify if Search Functionality BidMaps != BidMap Name */ {
        // [DISABLED] Wait for 10 seconds
        // await page.waitForTimeout(10000);
      }
      // [DISABLED] Wait for 90 seconds
      // await page.waitForTimeout(90000);
      // [DISABLED] Verify that the element Newly Created BidMap is present and With Scrollable FALSE
      // await expect(bidMapPage.Newly_Created_BidMap).toBeVisible();
      // [DISABLED] Perform addition on mapCount and 1 and store the result inside a mapCount considering 0 decimal places
      // vars["mapCount"] = (parseFloat(String(vars["mapCount"])) + parseFloat(String("1"))).toFixed(0);
    }
  }
  // [DISABLED] Check the checkbox Select All Checkbox For BidMap
  // await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
  // [DISABLED] Wait until the element Export Selected Button is enabled
  // await mappingListPage.Export_Selected_Button.waitFor({ state: 'visible' });
  // [DISABLED] Click on Export Selected Button
  // await mappingListPage.Export_Selected_Button.click();
  // [DISABLED] Wait until all files are download in all browsers
  // await page.waitForTimeout(3000); // Wait for download to complete
  // [DISABLED] New Export List (Advance Search )
  // await stepGroups.stepGroup_New_Export_List_Advance_Search(page, vars);
  // [DISABLED] Excel: Read the entire Row of the latest Excel file (.xlsx) using the Row 0 and store it in a variable named Bid Map Header
  // vars["Bid Map Header"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "0", "0");
  // [DISABLED] Excel: Read the entire Row of the latest Excel file (.xlsx) using the Row 1 and store it in a variable named 1st Row Value
  // vars["1st Row Value"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "1", "0");
  // [DISABLED] Excel: Read the entire Row of the latest Excel file (.xlsx) using the Row 2 and store it in a variable named 2nd Row Value
  // vars["2nd Row Value"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "2", "0");
  // [DISABLED] Excel: Read the entire Row of the latest Excel file (.xlsx) using the Row 3 and store it in a variable named 3rd Row Value
  // vars["3rd Row Value"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "3", "0");
  // [DISABLED] Excel: Read the entire Row of the latest Excel file (.xlsx) using the Row 4 and store it in a variable named 4th Row Value
  // vars["4th Row Value"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "4", "0");
  // [DISABLED] Excel: Read the entire Row of the latest Excel file (.xlsx) using the Row 5 and store it in a variable named 5th Row Value
  // vars["5th Row Value"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "5", "0");
  // [DISABLED] Store key_blank in space
  // vars["space"] = "key_blank";
  // [DISABLED] Store 1 in split1
  // vars["split1"] = "1";
  // [DISABLED] Store 9 in columnCount
  // vars["columnCount"] = "9";
  while (true) /* Verify if split1 <= columnCount */ {
    // [DISABLED] Click on Show 20
    // await correspondentPortalPage.Show_20.click();
    // [DISABLED] Split the Bid Map Header with the , and store the value from the split1 in the HeaderValue
    // vars["HeaderValue"] = String(vars["Bid Map Header"]).split(",")[parseInt(String(vars["split1"]))] || '';
    // [DISABLED] Trim the data HeaderValue and store into a runtime variable HeaderValue
    // vars["HeaderValue"] = String(vars["HeaderValue"]).trim();
    // [DISABLED] Split the 1st Row Value with the , and store the value from the split1 in the Row Value
    // vars["Row Value"] = String(vars["1st Row Value"]).split(",")[parseInt(String(vars["split1"]))] || '';
    // [DISABLED] Trim the data Row Value and store into a runtime variable Row Value
    // vars["Row Value"] = String(vars["Row Value"]).trim();
    if (true) /* Verify if Row Value == N/A */ {
      // [DISABLED] Store - in Row Value
      // vars["Row Value"] = "-";
    }
    // [DISABLED] Verify that the element Mapping_of_Header_and_1 stBidMap_Data is present and With Scrollable FALSE
    // await expect(bidMapPage.Mapping_of_Header_and_1_stBidMap_Data).toBeVisible();
    // [DISABLED] Perform addition on split1 and 1 and store the result inside a split1 considering 0 decimal places
    // vars["split1"] = (parseFloat(String(vars["split1"])) + parseFloat(String("1"))).toFixed(0);
  }
  // [DISABLED] Store 1 in split2
  // vars["split2"] = "1";
  while (true) /* Verify if split2 <= columnCount */ {
    // [DISABLED] Click on Show 20
    // await correspondentPortalPage.Show_20.click();
    // [DISABLED] Split the Bid Map Header with the , and store the value from the split2 in the HeaderValue
    // vars["HeaderValue"] = String(vars["Bid Map Header"]).split(",")[parseInt(String(vars["split2"]))] || '';
    // [DISABLED] Trim the data HeaderValue and store into a runtime variable HeaderValue
    // vars["HeaderValue"] = String(vars["HeaderValue"]).trim();
    // [DISABLED] Split the 2nd Row Value with the , and store the value from the split2 in the Row Value
    // vars["Row Value"] = String(vars["2nd Row Value"]).split(",")[parseInt(String(vars["split2"]))] || '';
    // [DISABLED] Trim the data Row Value and store into a runtime variable Row Value
    // vars["Row Value"] = String(vars["Row Value"]).trim();
    if (true) /* Verify if Row Value == N/A */ {
      // [DISABLED] Store - in Row Value
      // vars["Row Value"] = "-";
    }
    // [DISABLED] Verify that the element Mapping_of_Header_and_ 2nd_BidMap is present and With Scrollable FALSE
    // await expect(bidMapPage.Mapping_of_Header_and_2nd_BidMap).toBeVisible();
    // [DISABLED] Perform addition on split2 and 1 and store the result inside a split2 considering 0 decimal places
    // vars["split2"] = (parseFloat(String(vars["split2"])) + parseFloat(String("1"))).toFixed(0);
  }
  // [DISABLED] Store 1 in split3
  // vars["split3"] = "1";
  while (true) /* Verify if split3 <= columnCount */ {
    // [DISABLED] Click on Show 20
    // await correspondentPortalPage.Show_20.click();
    // [DISABLED] Split the Bid Map Header with the , and store the value from the split3 in the HeaderValue
    // vars["HeaderValue"] = String(vars["Bid Map Header"]).split(",")[parseInt(String(vars["split3"]))] || '';
    // [DISABLED] Trim the data HeaderValue and store into a runtime variable HeaderValue
    // vars["HeaderValue"] = String(vars["HeaderValue"]).trim();
    // [DISABLED] Split the 3rd Row Value with the , and store the value from the split3 in the Row Value
    // vars["Row Value"] = String(vars["3rd Row Value"]).split(",")[parseInt(String(vars["split3"]))] || '';
    // [DISABLED] Trim the data Row Value and store into a runtime variable Row Value
    // vars["Row Value"] = String(vars["Row Value"]).trim();
    if (true) /* Verify if Row Value == N/A */ {
      // [DISABLED] Store - in Row Value
      // vars["Row Value"] = "-";
    }
    // [DISABLED] Verify that the element Mapping_of_Header_and_3rd_BidMap_Data is present and With Scrollable FALSE
    // await expect(bidMapPage.Mapping_of_Header_and_2nd_BidMap).toBeVisible();
    // [DISABLED] Perform addition on split3 and 1 and store the result inside a split3 considering 0 decimal places
    // vars["split3"] = (parseFloat(String(vars["split3"])) + parseFloat(String("1"))).toFixed(0);
  }
  // [DISABLED] Store 1 in split4
  // vars["split4"] = "1";
  while (true) /* Verify if split4 <= columnCount */ {
    // [DISABLED] Click on Show 20
    // await correspondentPortalPage.Show_20.click();
    // [DISABLED] Split the Bid Map Header with the , and store the value from the split4 in the HeaderValue
    // vars["HeaderValue"] = String(vars["Bid Map Header"]).split(",")[parseInt(String(vars["split4"]))] || '';
    // [DISABLED] Trim the data HeaderValue and store into a runtime variable HeaderValue
    // vars["HeaderValue"] = String(vars["HeaderValue"]).trim();
    // [DISABLED] Split the 4th Row Value with the , and store the value from the split4 in the Row Value
    // vars["Row Value"] = String(vars["4th Row Value"]).split(",")[parseInt(String(vars["split4"]))] || '';
    // [DISABLED] Trim the data Row Value and store into a runtime variable Row Value
    // vars["Row Value"] = String(vars["Row Value"]).trim();
    if (true) /* Verify if Row Value == N/A */ {
      // [DISABLED] Store - in Row Value
      // vars["Row Value"] = "-";
    }
    // [DISABLED] Verify that the element Mapping_of_Header_and_4th_BidMap_Data is present and With Scrollable FALSE
    // await expect(bidMapPage.Mapping_of_Header_and_2nd_BidMap).toBeVisible();
    // [DISABLED] Perform addition on split4 and 1 and store the result inside a split4 considering 0 decimal places
    // vars["split4"] = (parseFloat(String(vars["split4"])) + parseFloat(String("1"))).toFixed(0);
  }
  // [DISABLED] Store 1 in split5
  // vars["split5"] = "1";
  while (true) /* Verify if split5 <= columnCount */ {
    // [DISABLED] Click on Show 20
    // await correspondentPortalPage.Show_20.click();
    // [DISABLED] Split the Bid Map Header with the , and store the value from the split5 in the HeaderValue
    // vars["HeaderValue"] = String(vars["Bid Map Header"]).split(",")[parseInt(String(vars["split5"]))] || '';
    // [DISABLED] Trim the data HeaderValue and store into a runtime variable HeaderValue
    // vars["HeaderValue"] = String(vars["HeaderValue"]).trim();
    // [DISABLED] Split the 5th Row Value with the , and store the value from the split5 in the Row Value
    // vars["Row Value"] = String(vars["5th Row Value"]).split(",")[parseInt(String(vars["split5"]))] || '';
    // [DISABLED] Trim the data Row Value and store into a runtime variable Row Value
    // vars["Row Value"] = String(vars["Row Value"]).trim();
    if (true) /* Verify if Row Value == N/A */ {
      // [DISABLED] Store - in Row Value
      // vars["Row Value"] = "-";
    }
    // [DISABLED] Verify that the element Mapping_of_Header_and_5th_BidMap_Data is present and With Scrollable FALSE
    // await expect(bidMapPage.Mapping_of_Header_and_2nd_BidMap).toBeVisible();
    // [DISABLED] Perform addition on split5 and 1 and store the result inside a split5 considering 0 decimal places
    // vars["split5"] = (parseFloat(String(vars["split5"])) + parseFloat(String("1"))).toFixed(0);
  }
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await stepGroups.stepGroup_Add_New_Header(page, vars);
  await headerMappingPage.Required_Edit_Header_Button_Not_an_Enum.click();
  await expect(correspondentPortalPage.Update_Header).toBeVisible();
  await headerMappingPage.Custom_Header_On_Pop_Up.clear();
  await headerMappingPage.Custom_Header_On_Pop_Up.fill(testData["UniqueColumnHeaderSearch"]);
  await headerMappingPage.Update_Header_Button_Bid_maps_popup.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  // [DISABLED] Edit in Header Mapping
  // await stepGroups.stepGroup_Edit_in_Header_Mapping(page, vars);
  await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
  // [DISABLED] Verify that the element You have unidentified Fields.This action will save and Move to Next Page is displayed and With Scrollable FALSE
  // await expect(statusInactivePage.You_have_unidentified_Fields_This_action_will_save_and_Move_to_Next_Page).toBeVisible();
  await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
  await correspondentPortal18Page.Yes_Proceed_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await stepGroups.stepGroup_Add_Rule_For_Add_Condition_In_Rules_and_Actions(page, vars);
  await stepGroups.stepGroup_Add_Actions_In_Rules_and_Actions(page, vars);
  await saveAndPublishButtonPage.Save_and_Publish_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  // [DISABLED] Click on Search/Filter Input
  // await statusInactive2Page.SearchFilter_Fields.click();
  // [DISABLED] Enter SearchFieldInputMap in the Search/Filter Input field
  // await statusInactive2Page.SearchFilter_Fields.fill(vars["SearchFieldInputMap"]);
  // [DISABLED] Wait until the element Spinner is not visible
  // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  // [DISABLED] Wait until the current page is loaded completely
  // await page.waitForLoadState('networkidle');
  // [DISABLED] Verify that the element BidMap is present and With Scrollable FALSE
  // await expect(correspondentPortalPage.BidMapTitle).toBeVisible();
  // [DISABLED] Verify that the element Rule_Check_Bid Map displays text map: and With Scrollable FALSE
  // await expect(rulecheckbidMapPage.Rule_Check_Bid_Map).toContainText("map:");
  // [DISABLED] Mouseover the element BidMap
  // await correspondentPortalPage.BidMapTitle.hover();
  // [DISABLED] Store text from the element CCode into a variable CCode
  // vars["CCode"] = await ccodePage.CCode.textContent() || '';
  // [DISABLED] Verify that the current page displays text CCode
  // await expect(page.getByText(vars["CCode"])).toBeVisible();
  // [DISABLED] Verify that the element Enum is present and With Scrollable FALSE
  // await expect(correspondentPortalPage.Enum).toBeVisible();
  // [DISABLED] Verify that the element enum_Header_Rule displays text enum: and With Scrollable FALSE
  // await expect(enumPage.enum_Header_Rule).toContainText("enum:");
  // [DISABLED] Wait until the current page is loaded completely
  // await page.waitForLoadState('networkidle');
  // [DISABLED] Mouseover the element Enum
  // await correspondentPortalPage.Enum.hover();
  // [DISABLED] Wait until the element Spinner is not visible
  // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  // [DISABLED] Store text from the element CCode into a variable CCode
  // vars["CCode"] = await ccodePage.CCode.textContent() || '';
  // [DISABLED] Verify that the current page displays text CCode
  // await expect(page.getByText(vars["CCode"])).toBeVisible();
  // [DISABLED] Verify that the element Action is present and With Scrollable FALSE
  // await expect(correspondentPortalPage.Action_in_SearchFilter).toBeVisible();
  // [DISABLED] Mouseover the element Action
  // await correspondentPortalPage.Action_in_SearchFilter.hover();
  // [DISABLED] Verify that the element action_Rule_Header displays text act: and With Scrollable FALSE
  // await expect(actionruleheaderPage.action_Rule_Header).toContainText("act:");
  // [DISABLED] Store text from the element CCode into a variable CCode
  // vars["CCode"] = await ccodePage.CCode.textContent() || '';
  // [DISABLED] Verify that the element CCode displays text contains CCode and With Scrollable FALSE
  // await expect(ccodePage.CCode).toContainText(vars["CCode"]);
  // [DISABLED] Verify that the current page displays text CCode
  // await expect(page.getByText(vars["CCode"])).toBeVisible();
  // [DISABLED] Clear the text displayed in the Search/Filter Input field
  // await statusInactive2Page.SearchFilter_Fields.clear();
  // [DISABLED] Enter SearchFieldInputMap in the Search/Filter Input(All Map List Page) field
  // await statusInactive2Page.SearchFilter_Fields.fill(vars["SearchFieldInputMap"]);
  // [DISABLED] Wait until the element Spinner is not visible
  // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  // [DISABLED] Verify that the element Column Header is present and With Scrollable FALSE
  // await expect(statusInactivePage.Column_Header_In_SeachField).toBeVisible();
  // [DISABLED] Verify that the element column_Header_Rule displays text col: and With Scrollable FALSE
  // await expect(columnheaderrulePage.column_Header_Rule).toContainText("col:");
  // [DISABLED] Mouseover the element Column Header
  // await statusInactivePage.Column_Header_In_SeachField.hover();
  // [DISABLED] Wait until the element Spinner is not visible
  // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  // [DISABLED] Click on Show All_ColumnHeader
  // await correspondentPortalPage.Show_All_ColumnHeader.click();
  // [DISABLED] Wait until the element Spinner is not visible
  // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  // [DISABLED] Store text from the element CCode into a variable CCode
  // vars["CCode"] = await ccodePage.CCode.textContent() || '';
  // [DISABLED] Verify that the element CCode displays text contains CCode and With Scrollable FALSE
  // await expect(ccodePage.CCode).toContainText(vars["CCode"]);
  // [DISABLED] Store SearchFieldInputMap in CommonKeyword
  // vars["CommonKeyword"] = vars["SearchFieldInputMap"];
}
