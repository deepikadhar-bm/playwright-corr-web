// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortal18Page } from '../../../src/pages/correspondant/correspondent-portal-18';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { ExitButtonPage } from '../../../src/pages/correspondant/exit-button';
import { NewMapPage } from '../../../src/pages/correspondant/new-map';
import { P1MoreButtonPage } from '../../../src/pages/correspondant/p-1-more-button';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import * as excelHelper from '../../../src/helpers/excel-helpers';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortal18Page: CorrespondentPortal18Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let exitButtonPage: ExitButtonPage;
  let newMapPage: NewMapPage;
  let p1MoreButtonPage: P1MoreButtonPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    exitButtonPage = new ExitButtonPage(page);
    newMapPage = new NewMapPage(page);
    p1MoreButtonPage = new P1MoreButtonPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test('REG_TS29_TC01_Verify that user should be able to perform export action for the required bids i.e exporting the list and the map details file.', async ({ page }) => {
    // Set up download handler
    page.on('download', async (download) => {
      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      await download.saveAs(filePath);
      vars['_lastDownloadPath'] = filePath;
    });

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.Bid_Maps_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await statusInactivePage.BidMap_list_Screen.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await newMapPage.Map_Headers_Button_New.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await statusInactivePage.Delete_Button_Header_Mapping.click();
    await correspondentPortal18Page.Yes_Proceed_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await expect(statusInactivePage.You_have_unidentified_Fields_This_action_will_save_and_Move_to_Next_Page).toBeVisible();
    await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await exitButtonPage.Exit_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.First_Checkbox_Bid_Request.click();
    await expect(p1MoreButtonPage.Export_Selected_Dropdown).toBeVisible();
    await p1MoreButtonPage.Export_Selected_Dropdown.click();
    await correspondentPortalPage.Export_List.click();
    vars["Bid Mapping"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "0", "0");
    vars["Bid Mapping Values"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "1", "0");
    vars["MapNameFromUI"] = await bidRequestsPage.MapNameFromUI.textContent() || '';
    vars["split"] = "1";
    vars["split1"] = "6";
    vars["columnCount"] = "9";
    while (parseFloat(String(vars["split"])) <= parseFloat(String(vars["columnCount"]))) {
      if (String(vars["split"]) === String("6")) {
        if (String(vars["Bid Mapping Values"]).includes(String("ACTIVE, DRAFT"))) {
          vars["split"] = "5";
          await correspondentPortalPage.Heading_Mappings.click();
          // [DISABLED] Store 10 in columnCount
          // vars["columnCount"] = "10";
          vars["TableHeadersFromFile"] = String(vars["Bid Mapping"]).split(",")[parseInt(String(vars["split"]))] || '';
          vars["TableHeadersFromFile"] = String(vars["TableHeadersFromFile"]).trim();
          vars["split"] = "6";
          vars["RowDataFromBidMap"] = String(vars["Bid Mapping Values"]).split(",")[parseInt(String(vars["split"]))] || '';
          vars["RowDataFromBidMap"] = String(vars["RowDataFromBidMap"]).trim();
        }
      } else {
        await correspondentPortalPage.Heading_Mappings.click();
        if (String(vars["split"]) === String("10")) {
          vars["split"] = (parseFloat(String(vars["split"])) - parseFloat(String("1"))).toFixed(0);
          vars["TableHeadersFromFile"] = String(vars["Bid Mapping"]).split(",")[parseInt(String(vars["split"]))] || '';
          vars["TableHeadersFromFile"] = String(vars["TableHeadersFromFile"]).trim();
          vars["split"] = (parseFloat(String(vars["split"])) + parseFloat(String("1"))).toFixed(0);
          if (String(vars["TableHeadersFromFile"]) === String("Last Modified By")) {
            vars["split"] = (parseFloat(String(vars["split"])) - parseFloat(String("1"))).toFixed(0);
          }
        }
        if (String(vars["split"]) === String("11")) {
          vars["split"] = "10";
          vars["RowDataFromBidMap"] = String(vars["Bid Mapping Values"]).split(",")[parseInt(String(vars["split"]))] || '';
          vars["RowDataFromBidMap"] = String(vars["RowDataFromBidMap"]).trim();
          vars["split"] = "9";
          vars["TableHeadersFromFile"] = String(vars["Bid Mapping"]).split(",")[parseInt(String(vars["split"]))] || '';
          vars["TableHeadersFromFile"] = String(vars["TableHeadersFromFile"]).trim();
          vars["split"] = "11";
        } else {
          vars["TableHeadersFromFile"] = String(vars["Bid Mapping"]).split(",")[parseInt(String(vars["split"]))] || '';
          vars["TableHeadersFromFile"] = String(vars["TableHeadersFromFile"]).trim();
        }
        if (String(vars["split"]) === String("7")) {
          await correspondentPortalPage.Heading_Mappings.click();
          if (String(vars["Bid Mapping Values"]).includes(String("ACTIVE, DRAFT"))) {
            vars["split"] = "6";
            vars["TableHeadersFromFile"] = String(vars["Bid Mapping"]).split(",")[parseInt(String(vars["split"]))] || '';
            vars["TableHeadersFromFile"] = String(vars["TableHeadersFromFile"]).trim();
            vars["split"] = "7";
            vars["RowDataFromBidMap"] = String(vars["Bid Mapping Values"]).split(",")[parseInt(String(vars["split"]))] || '';
            vars["RowDataFromBidMap"] = String(vars["RowDataFromBidMap"]).trim();
          }
        }
        if (String(vars["split"]) === String("8")) {
          if (String(vars["Bid Mapping Values"]).includes(String("ACTIVE, DRAFT"))) {
            vars["split"] = "7";
            vars["TableHeadersFromFile"] = String(vars["Bid Mapping"]).split(",")[parseInt(String(vars["split"]))] || '';
            vars["TableHeadersFromFile"] = String(vars["TableHeadersFromFile"]).trim();
            vars["split"] = "8";
            vars["RowDataFromBidMap"] = String(vars["Bid Mapping Values"]).split(",")[parseInt(String(vars["split"]))] || '';
            vars["RowDataFromBidMap"] = String(vars["RowDataFromBidMap"]).trim();
            // [DISABLED] Perform subtraction on split and 1 and store the result inside a split considering 0 decimal places
            // vars["split"] = (parseFloat(String(vars["split"])) - parseFloat(String("1"))).toFixed(0);
          }
        } else {
          if (String(vars["split"]) === String("11")) {
          } else {
            vars["RowDataFromBidMap"] = String(vars["Bid Mapping Values"]).split(",")[parseInt(String(vars["split"]))] || '';
            vars["RowDataFromBidMap"] = String(vars["RowDataFromBidMap"]).trim();
          }
        }
      }
      if (String(vars["split"]) === String("9")) {
        if (String(vars["Bid Mapping Values"]).includes(String("ACTIVE, DRAFT"))) {
          vars["split"] = "8";
          vars["TableHeadersFromFile"] = String(vars["Bid Mapping"]).split(",")[parseInt(String(vars["split"]))] || '';
          vars["TableHeadersFromFile"] = String(vars["TableHeadersFromFile"]).trim();
          vars["split"] = "9";
          vars["RowDataFromBidMap"] = String(vars["Bid Mapping Values"]).split(",")[parseInt(String(vars["split"]))] || '';
          vars["RowDataFromBidMap"] = String(vars["RowDataFromBidMap"]).trim();
          if (String(vars["Bid Mapping Values"]).includes(String("ACTIVE, DRAFT"))) {
            vars["split"] = "10";
            vars["columnCount"] = "11";
          }
          // [DISABLED] Perform subtraction on split and 1 and store the result inside a split considering 0 decimal places
          // vars["split"] = (parseFloat(String(vars["split"])) - parseFloat(String("1"))).toFixed(0);
        }
      } else {
        if (String(vars["split"]) === String("11")) {
        } else {
          vars["RowDataFromBidMap"] = String(vars["Bid Mapping Values"]).split(",")[parseInt(String(vars["split"]))] || '';
          vars["RowDataFromBidMap"] = String(vars["RowDataFromBidMap"]).trim();
        }
      }
      if (String(vars["TableHeadersFromFile"]) === String("Ccode")) {
        vars["TableHeadersFromFile"] = "CCode";
      }
    }
  });
});
