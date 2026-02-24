// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { BidMapPage } from '../../../src/pages/correspondant/bid-map';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { DeleteIdPage } from '../../../src/pages/correspondant/delete-id';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { MappingListPage } from '../../../src/pages/correspondant/mapping-list';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SaveDraftExitButtonPage } from '../../../src/pages/correspondant/save-draft-exit-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import * as excelHelper from '../../../src/helpers/excel-helpers';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidmapPage: BidmapPage;
  let bidMapPage: BidMapPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let deleteIdPage: DeleteIdPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let mappingListPage: MappingListPage;
  let priceOfferedPage: PriceOfferedPage;
  let saveDraftExitButtonPage: SaveDraftExitButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidmapPage = new BidmapPage(page);
    bidMapPage = new BidMapPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    deleteIdPage = new DeleteIdPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    mappingListPage = new MappingListPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    saveDraftExitButtonPage = new SaveDraftExitButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test('REG_TS31_TC01_Verify that when 3 or more digits are entered in the search input, bid map records are displayed in the popup, showing matching keywords within the categories of bid map name, column hea', async ({ page }) => {
    // Set up download handler
    page.on('download', async (download) => {
      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      await download.saveAs(filePath);
      vars['_lastDownloadPath'] = filePath;
    });

    const testData: Record<string, string> = {
  "Company Name": "Freedom - A4187",
  "Search Functionality BidMaps": "Testsigma_Emard_Quitzon_SeachField"
}; // Profile: "Search Functionality BidMaps", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
    vars["Companyname"] = testData["Company Name"];
    vars["count"] = "1";
    vars["RandomName"] = ['Smith','Johnson','Williams','Brown','Jones','Davis','Miller','Wilson'][Math.floor(Math.random() * 8)];
    while (parseFloat(String(vars["count"])) <= parseFloat(String("5"))) {
      await stepGroups.stepGroup_Creating_New_Bid_Map(page, vars);
      await correspondentPortalPage.Select_Companys_Dropdown.click();
      await statusInactivePage.Second_Selected_Company_Checkbox.click();
      await correspondentPortalPage.Apply_Selected.click();
      await saveDraftExitButtonPage.Save_Draft_Exit_Button.click();
      vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
    }
    // [DISABLED] Create_NewMap
    // await stepGroups.stepGroup_Create_NewMap(page, vars);
    vars["CommonKeyword"] = vars["Common KeyWord"];
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.Bid_Maps_Menu.waitFor({ state: 'visible' });
    await correspondentPortalPage.Bid_Maps_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await statusInactive2Page.SearchFilter_Fields.waitFor({ state: 'visible' });
    await statusInactive2Page.SearchFilter_Fields.fill(vars["Common KeyWord"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await statusInactive2Page.SearchFilter_Fields.click();
    await correspondentPortalPage.BidMapTitle.waitFor({ state: 'visible' });
    await bidmapPage.KeyWord_Related_Bid_Maps.waitFor({ state: 'visible' });
    await correspondentPortalPage.BidMapTitle.hover();
    await deleteIdPage.Click_on_Show_All.click();
    await page.waitForLoadState('networkidle');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["BidMaps Count on Mappings Page"] = String(await bidMapPage.BidMaps_Count_on_Mappings_Page.count());
    await correspondentPortalPage.Check_box.check();
    await expect(correspondentPortalPage.Check_box).toBeVisible();
    await mappingListPage.Export_Selected_Button.waitFor({ state: 'visible' });
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
    // [DISABLED] Wait until the element Spinner is not visible
    // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    // [DISABLED] Store 1 in split2
    // vars["split2"] = "1";
    while (true) /* Verify if split2 <= columnCount */ {
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
    // [DISABLED] Add New Header 
    // await stepGroups.stepGroup_Add_New_Header(page, vars);
    // [DISABLED] Store 1 in split3
    // vars["split3"] = "1";
    while (true) /* Verify if split3 <= columnCount */ {
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
    // [DISABLED] Click on Enumeration Mapping Button
    // await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    // [DISABLED] Store 1 in split4
    // vars["split4"] = "1";
    while (true) /* Verify if split4 <= columnCount */ {
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
    }
  });
});
