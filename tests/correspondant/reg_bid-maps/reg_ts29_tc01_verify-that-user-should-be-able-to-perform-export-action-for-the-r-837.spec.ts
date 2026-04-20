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
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS29_TC01';
const TC_TITLE = 'Verify that user should be able to perform export action for the required bids i.e exporting the list and the map details file.';

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
  let Methods: AddonHelpers;

  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    vars['DownloadDir'] = path.join(process.cwd(), 'downloads');
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
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Login to CORR portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login successful');
      } catch (e) {
        await log.stepFail(page, 'Login failed');
        throw e;
      }

      log.step('Navigate to Bid Maps and open Header Mapping');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.Bid_Maps_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await statusInactivePage.BidMap_list_Screen.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await newMapPage.Map_Headers_Button_New.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Bid Maps and opened Header Mapping');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bid Maps or open Header Mapping');
        throw e;
      }

      log.step('Delete header and navigate through Enumeration Mapping to Exit');
      try {
        await statusInactivePage.Delete_Button_Header_Mapping.click();
        await correspondentPortal18Page.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(statusInactivePage.You_have_unidentified_Fields_This_action_will_save_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await exitButtonPage.Exit_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Header deleted, Enumeration Mapping processed, and exited to list screen');
      } catch (e) {
        await log.stepFail(page, 'Failed to delete header or navigate through Enumeration Mapping');
        throw e;
      }

      log.step('Select Bid Map checkbox and export list');
      try {
        await correspondentPortalPage. CCode_Checkbox.check();
        await expect(p1MoreButtonPage.Export_Selected_Dropdown).toBeEnabled();
        await p1MoreButtonPage.Export_Selected_Dropdown.click();
        Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'TimeStamp', appconstants.ASIA_KOLKATA);
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          correspondentPortalPage.Export_List.click()
        ]);
        vars['SavedFileName'] = vars['TimeStamp'] + '_' + download.suggestedFilename();
        vars['FilePathExportList'] = path.join(vars['DownloadDir'], vars['SavedFileName']);
        await download.saveAs(vars['FilePathExportList']);
        log.stepPass('Export list downloaded. FileName: ' + vars['SavedFileName']);
      } catch (e) {
        await log.stepFail(page, 'Failed to select Bid Map or export list');
        throw e;
      }

      log.step('Read exported file and capture Bid Mapping headers and values');
      try {
        vars["Bid Mapping"] = excelHelper.readEntireRow(vars['FilePathExportList'], "0", "0", 'Bid Mapping');
        vars["Bid Mapping Values"] = excelHelper.readEntireRow(vars['FilePathExportList'], "0", "1", 'Bid Mapping Values');
        vars["MapNameFromUI"] = await bidRequestsPage.MapNameFromUI.first().textContent() || '';
        Methods.trimtestdata(vars["MapNameFromUI"], "MapNameFromUI");
        log.stepPass('Exported file read. Map Name from UI: ' + vars["MapNameFromUI"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to read exported file or capture Bid Mapping data');
        throw e;
      }

      log.step('Verify exported file column headers and row data against UI');
      try {
        vars["split"] = appconstants.ONE;
        vars["split1"] = appconstants.SPLIT_COUNT_SIX;
        vars["columnCount"] = appconstants.NINE;
        while (parseFloat(String(vars["split"])) <= parseFloat(String(vars["columnCount"]))) {
          log.info('Iteration split: ' + vars["split"] + ' columnCount: ' + vars["columnCount"]);
          if (String(vars["split"]) === String("6")) {
            if (String(vars["Bid Mapping Values"]).includes(String("ACTIVE, DRAFT"))) {
              vars["split"] = appconstants.FIVE;
              await correspondentPortalPage.Heading_Mappings.click();
              Methods.splitBySpecialChar(vars["Bid Mapping"],',',vars["split"],'TableHeadersFromFile');
              Methods.trimtestdata(vars["TableHeadersFromFile"], "TableHeadersFromFile");
              vars["split"] = appconstants.SPLIT_COUNT_SIX;
              Methods.splitBySpecialChar(vars["Bid Mapping Values"],',',vars["split"],'RowDataFromBidMap');
              Methods.trimtestdata(vars["RowDataFromBidMap"], "RowDataFromBidMap");
            }
          } else {
            await correspondentPortalPage.Heading_Mappings.click();
            if (String(vars["split"]) === String("10")) {
              vars["split"] = (parseFloat(String(vars["split"])) - parseFloat(String("1"))).toFixed(0);
              Methods.splitBySpecialChar(vars["Bid Mapping"],',',vars["split"],'TableHeadersFromFile');
              Methods.trimtestdata(vars["TableHeadersFromFile"], "TableHeadersFromFile");
              vars["split"] = (parseFloat(String(vars["split"])) + parseFloat(String("1"))).toFixed(0);
              if (String(vars["TableHeadersFromFile"]) === String("Last Modified By")) {
                vars["split"] = (parseFloat(String(vars["split"])) - parseFloat(String("1"))).toFixed(0);
              }
            }
            if (String(vars["split"]) === String("11")) {
              vars["split"] = appconstants.TEN;
              Methods.splitBySpecialChar(vars["Bid Mapping Values"],',',vars["split"],'RowDataFromBidMap');
              Methods.trimtestdata(vars["RowDataFromBidMap"], "RowDataFromBidMap");
              vars["split"] = appconstants.NINE;
              Methods.splitBySpecialChar(vars["Bid Mapping"],',',vars["split"],'TableHeadersFromFile');
              Methods.trimtestdata(vars["TableHeadersFromFile"], "TableHeadersFromFile");
              vars["split"] = appconstants.ELEVEN;
            } else {
              Methods.splitBySpecialChar(vars["Bid Mapping"],',',vars["split"],'TableHeadersFromFile');
              Methods.trimtestdata(vars["TableHeadersFromFile"], "TableHeadersFromFile");
            }
            if (String(vars["split"]) === String("7")) {
              await correspondentPortalPage.Heading_Mappings.click();
              if (String(vars["Bid Mapping Values"]).includes(String("ACTIVE, DRAFT"))) {
                vars["split"] = appconstants.SPLIT_COUNT_SIX;
                Methods.splitBySpecialChar(vars["Bid Mapping"],',',vars["split"],'TableHeadersFromFile');
                Methods.trimtestdata(vars["TableHeadersFromFile"], "TableHeadersFromFile");
                vars["split"] = "7";
                Methods.splitBySpecialChar(vars["Bid Mapping Values"],',',vars["split"],'RowDataFromBidMap');
                Methods.trimtestdata(vars["RowDataFromBidMap"], "RowDataFromBidMap");
              }
            }
            if (String(vars["split"]) === String("8")) {
              if (String(vars["Bid Mapping Values"]).includes(String("ACTIVE, DRAFT"))) {
                vars["split"] = "7";
                Methods.splitBySpecialChar(vars["Bid Mapping"],',',vars["split"],'TableHeadersFromFile');
                Methods.trimtestdata(vars["TableHeadersFromFile"], "TableHeadersFromFile");
                vars["split"] = "8";
                Methods.splitBySpecialChar(vars["Bid Mapping Values"],',',vars["split"],'RowDataFromBidMap');
                Methods.trimtestdata(vars["RowDataFromBidMap"], "RowDataFromBidMap");
              }
            } else {
              if (String(vars["split"]) !== String("11")) {
                Methods.splitBySpecialChar(vars["Bid Mapping Values"],',',vars["split"],'RowDataFromBidMap');
                Methods.trimtestdata(vars["RowDataFromBidMap"], "RowDataFromBidMap");
              }
            }
          }
          if (String(vars["split"]) === String("9")) {
            if (String(vars["Bid Mapping Values"]).includes(String("ACTIVE, DRAFT"))) {
              vars["split"] = "8";
              Methods.splitBySpecialChar(vars["Bid Mapping"],',',vars["split"],'TableHeadersFromFile');
              Methods.trimtestdata(vars["TableHeadersFromFile"], "TableHeadersFromFile");
              vars["split"] = appconstants.NINE;
              Methods.splitBySpecialChar(vars["Bid Mapping Values"],',',vars["split"],'RowDataFromBidMap');
              Methods.trimtestdata(vars["RowDataFromBidMap"], "RowDataFromBidMap");
              if (String(vars["Bid Mapping Values"]).includes(String("ACTIVE, DRAFT"))) {
                vars["split"] = appconstants.TEN;
                vars["columnCount"] = appconstants.ELEVEN;
              }
            }
          } else {
            if (String(vars["split"]) !== String("11")) {
              Methods.splitBySpecialChar(vars["Bid Mapping Values"],',',vars["split"],'RowDataFromBidMap');
              Methods.trimtestdata(vars["RowDataFromBidMap"], "RowDataFromBidMap");
            }
          }
          if (String(vars["TableHeadersFromFile"]) === String("Ccode")) {
            vars["TableHeadersFromFile"] = "CCode";
          }
          log.info('Column: ' + vars["TableHeadersFromFile"] + ' | Value: ' + vars["RowDataFromBidMap"]);
          Methods.performArithmetic(vars["split"], 'ADDITION', '1', 'split', 0);
        }
        log.stepPass('Exported file column headers and row data verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Exported file column header or row data verification failed at split: ' + vars["split"]);
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});