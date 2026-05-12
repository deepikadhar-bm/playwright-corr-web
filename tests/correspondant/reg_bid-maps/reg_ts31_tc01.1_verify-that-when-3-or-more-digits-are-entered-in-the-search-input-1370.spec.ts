import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidMapPage } from '../../../src/pages/correspondant/bid-map';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { MappingListPage } from '../../../src/pages/correspondant/mapping-list';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_830 } from '../../../src/helpers/prereqs/prereq-830';
import { testDataManager } from 'testdata/TestDataManager';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS31_TC01.1';
const TC_TITLE = 'Verify that when 3 or more digits are entered in the search input, bid map records are displayed in the popup, showing matching keywords within the categories of bid map name, column h';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let bidMapPage: BidMapPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let mappingListPage: MappingListPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  let REG_TS31_TC01_1_testFailed = false;

  const profileName = 'Search Functionality BidMaps';
  const profile = testDataManager.getProfileByName(profileName);
  const dataList = profile?.data as Record<string, any>[];

  test.beforeEach(async ({ page }) => {
    await runPrereq_830(page, vars);
    vars['DownloadDir'] = path.join(process.cwd(), 'downloads');
    bidMapPage = new BidMapPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    mappingListPage = new MappingListPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Load test data from profile');
      try {
        if (profile && profile.data) {
          vars['updatedValueFromTDP'] = profile.data[0]['Search Functionality BidMaps'];
          log.info('updatedValueFromTDP: ' + vars['updatedValueFromTDP']);
        }
        log.stepPass('Test data loaded from profile successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to load test data from profile');
        throw e;
      }

      log.step('Wait for spinner and verify Bid Map checkbox is checked');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        if (!(await correspondentPortalPage.Check_box.isChecked())) {
          await correspondentPortalPage.Check_box.check();
        }
        await expect(correspondentPortalPage.Check_box).toBeChecked();
        log.stepPass('Spinner hidden and Bid Map checkbox verified as checked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Bid Map checkbox is checked');
        throw e;
      }

      log.step('Export selected Bid Map list and save the downloaded file');
      try {
        await mappingListPage.Export_Selected_Button.waitFor({ state: 'visible' });
        await mappingListPage.Export_Selected_Button.click();
        await expect(correspondentPortalPage.Export_List).toBeVisible();
        Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'TimeStamp', appconstants.ASIA_KOLKATA);
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          correspondentPortalPage.Export_List.click()
        ]);
        vars['SavedFileName'] = vars['TimeStamp'] + '_' + download.suggestedFilename();
        vars['FilePathExportList'] = path.join(vars['DownloadDir'], vars['SavedFileName']);
        await download.saveAs(vars['FilePathExportList']);
        log.info('SavedFileName: ' + vars['SavedFileName']);
        log.info('FilePathExportList: ' + vars['FilePathExportList']);
        log.stepPass('Export list downloaded and saved successfully. FileName: ' + vars['SavedFileName']);
      } catch (e) {
        await log.stepFail(page, 'Failed to export selected Bid Map list or save downloaded file');
        throw e;
      }

      log.step('Verify Bid Maps count on Mappings Page is 5');
      try {
        log.info('BidMaps Count on Mappings Page: ' + vars['BidMaps Count on Mappings Page']);
        expect(Methods.verifyComparison(vars['BidMaps Count on Mappings Page'], '==', appconstants.FIVE));
        log.stepPass('Bid Maps count verified as 5 successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Bid Maps count on Mappings Page');
        throw e;
      }

      log.step('Verify each newly created Bid Map is visible on the page');
      try {
        vars['mapCount'] = appconstants.ONE;
        vars['Count'] = appconstants.ZERO;
        while (parseFloat(String(vars['mapCount'])) <= parseFloat(String(appconstants.FIVE))) {
          log.info('Map iteration: ' + vars['mapCount']);
          await correspondentPortalPage.Show_20.click();
          vars['SearchFunctionalityBidMaps'] = dataList[Number(vars['Count'])]['Search Functionality BidMaps'];
          log.info('Search Functionality BidMaps: ' + vars['SearchFunctionalityBidMaps']);
          await expect(bidMapPage.Newly_Created_BidMap(vars['SearchFunctionalityBidMaps'])).toBeVisible();
          Methods.performArithmetic(vars['mapCount'], 'ADDITION', appconstants.ONE, 'mapCount', 0);
          Methods.performArithmetic(vars['Count'], 'ADDITION', appconstants.ONE, 'Count', 0);
        }
        log.stepPass('All 5 newly created Bid Maps verified as visible successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify newly created Bid Maps visibility');
        throw e;
      }

      log.step('Select all Bid Maps and export selected list');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        if (!(await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.isChecked())) {
          await correspondentPortalPage.Check_box.check();
        }
        await mappingListPage.Export_Selected_Button.waitFor({ state: 'visible' });
        await expect(mappingListPage.Export_Selected_Button).toBeEnabled();
        await await mappingListPage.Export_Selected_Button.click();
        if (!(await correspondentPortalPage.Export_List.isVisible())) {
          await mappingListPage.Export_Selected_Button.click();
        }
        await correspondentPortalPage.Export_List.waitFor({ state: 'visible' });
        Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'TimeStamp2', appconstants.ASIA_KOLKATA);
        const [download2] = await Promise.all([
          page.waitForEvent('download'),
          correspondentPortalPage.Export_List.click()
        ]);
        vars['SavedFileName2'] = vars['TimeStamp2'] + '_' + download2.suggestedFilename();
        vars['FilePathExportList2'] = path.join(vars['DownloadDir'], vars['SavedFileName2']);
        await download2.saveAs(vars['FilePathExportList2']);
        log.info('SavedFileName2: ' + vars['SavedFileName2']);
        log.info('FilePathExportList2: ' + vars['FilePathExportList2']);
        log.stepPass('All Bid Maps selected and export list downloaded successfully. FileName: ' + vars['SavedFileName2']);
      } catch (e) {
        await log.stepFail(page, 'Failed to select all Bid Maps or export selected list');
        throw e;
      }

      log.step('Verify new export list for advance search');
      try {
        await stepGroups.stepGroup_New_Export_List_Advance_Search(page, vars);
        log.stepPass('New export list for advance search verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify new export list for advance search');
        throw e;
      }

      log.step('Delete all advanced search Bid Maps');
      try {
        await stepGroups.stepGroup_Deleting_All_Advanced_Search_Bid_Maps(page, vars);
        log.stepPass('All advanced search Bid Maps deleted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to delete all advanced search Bid Maps');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      REG_TS31_TC01_1_testFailed = true;
      throw e;
    }
  });
  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, REG_TS31_TC01_1_testFailed);
    if (REG_TS31_TC01_1_testFailed) {
      try {
        log.step('Executing after-test steps: Deleting the created maps');
        await stepGroups.stepGroup_Deleting_All_Advanced_Search_Bid_Maps(page, vars);
        log.stepPass('After-test steps executed successfully. All maps deleted');
      } catch (e) {
        await log.stepFail(page, 'Failed to Delete maps');
        throw e;
      }
    }
  });
});