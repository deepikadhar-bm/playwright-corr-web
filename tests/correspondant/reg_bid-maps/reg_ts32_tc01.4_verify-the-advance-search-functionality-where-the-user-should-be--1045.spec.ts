// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ActionsPage } from '../../../src/pages/correspondant/actions';
import { AdvanceSearchPage } from '../../../src/pages/correspondant/advance-search';
import { BidmapDashboardPage } from '../../../src/pages/correspondant/bidmap-dashboard';
import { BidMapsPage } from '../../../src/pages/correspondant/bid-maps';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { MappingListaaaPage } from '../../../src/pages/correspondant/mapping-listaaa';
import { MappingListPage } from '../../../src/pages/correspondant/mapping-list';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { ShowResultsButtonPage } from '../../../src/pages/correspondant/show-results-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { runPrereq_911 } from '../../../src/helpers/prereqs/prereq-911';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS } from 'src/constants/app-constants';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { CorrespondentPortal18Page } from '@pages/correspondant/correspondent-portal-18';

let reg_ts32_testFailed = false;

const TC_ID = 'REG_TS32_TC01.4';
const TC_TITLE = 'Verify the advance search functionality, where the user should be able to perform search action based on the rules and actions.[Advance Search for both Rules and Actions]';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let actionsPage: ActionsPage;
  let advanceSearchPage: AdvanceSearchPage;
  let bidmapDashboardPage: BidmapDashboardPage;
  let bidMapsPage: BidMapsPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let mappingListaaaPage: MappingListaaaPage;
  let mappingListPage: MappingListPage;
  let priceOfferedPage: PriceOfferedPage;
  let showResultsButtonPage: ShowResultsButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let correspondentPortal18Page: CorrespondentPortal18Page;

  test.beforeEach(async ({ page }) => {
    log.info('========== TEST SETUP: beforeEach ==========');
    vars = {};
    log.info('Initializing test variables');
    
    try {
      log.info('Running prerequisite REG_911');
      await runPrereq_911(page, vars);
      log.stepPass('Prerequisite REG_911 executed successfully');
    } catch (e) {
      log.stepFail(page, 'Failed to execute prerequisite REG_911');
      throw e;
    }

    log.info('Initializing page objects');
    try {
      actionsPage = new ActionsPage(page);
      advanceSearchPage = new AdvanceSearchPage(page);      
      bidmapDashboardPage = new BidmapDashboardPage(page);
      bidMapsPage = new BidMapsPage(page);
      chaseFieldNamePage = new ChaseFieldNamePage(page);
      correspondentPortalPage = new CorrespondentPortalPage(page);
      mappingListaaaPage = new MappingListaaaPage(page);
      mappingListPage = new MappingListPage(page);
      priceOfferedPage = new PriceOfferedPage(page);
      showResultsButtonPage = new ShowResultsButtonPage(page);
      spinnerPage = new SpinnerPage(page);
      statusInactive2Page = new StatusInactive2Page(page);
      correspondentPortal18Page = new CorrespondentPortal18Page(page);
      log.stepPass('All page objects initialized successfully');
    } catch (e) {
      log.stepFail(page, 'Failed to initialize page objects');
      throw e;
    }

    log.info('========== TEST SETUP COMPLETED ==========\n');
  });

  test('REG_TS32_TC01.4_Verify the advance search functionality, where the user should be able to perform search action based on the rules and actions.[Advance Search for both Rules and Actions]', async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      const CorrPortalElem = new CorrPortalPage(page);
      log.info('CorrPortalPage instance created');

      // Set up download handler
      log.info('Setting up download handler');
      page.on('download', async (download) => {
        const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
        log.info(`File download initiated: ${download.suggestedFilename()}`);
        await download.saveAs(filePath);
        vars['_lastDownloadPath'] = filePath;
        log.info(`File saved at: ${filePath}`);
      });
      log.stepPass('Download handler configured');

      // Navigate to Administration > Bid Maps
      log.step('Navigate to Administration Menu');
      await correspondentPortalPage.Administration_Menu.click();
      log.info('Clicked on Administration menu');

      log.step('Navigate to Bid Maps Menu');
      await correspondentPortalPage.Bid_Maps_Menu.click();
      log.info('Clicked on Bid Maps menu');

      log.step('Wait for page to load');
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Page loaded successfully');

      // Open Advanced Search
      log.step('Open search filter');
      await statusInactive2Page.SearchFilter_Fields.click();
      log.info('Clicked on SearchFilter_Fields');

      log.step('Click Try Advanced Search and Filter option');
      await correspondentPortalPage.Try_Advanced_Search_and_Filter_option_Button.click();
      log.info('Clicked on Try Advanced Search and Filter button');

      await expect(correspondentPortalPage.Advanced_SearchFilter).toBeVisible();
      log.stepPass('Advanced Search Filter dialog is visible');

      // Select Bid Field from dropdown
      log.step('Select Bid Field from IF_Bid_Field_Dropdownnew');
      log.info(`Attempting to select Bid Field: ${vars["RuleBidField3"]}`);
      await bidmapDashboardPage.IF_Bid_Field_Dropdownnew.selectOption({ value: vars["RuleBidField3"] });
      log.info(`Selected value: ${vars["RuleBidField3"]}`);

      const selectedText = await bidmapDashboardPage.IF_Bid_Field_Dropdownnew.locator('option:checked').textContent();
      log.info(`Verified selected text: ${selectedText?.trim()}`);
      expect(selectedText?.trim()).toContain(vars["RuleBidField3"]);
      log.stepPass('Chase Field selected successfully: ' + vars["RuleBidField3"]);

      // Select Operation condition
      log.step('Select Operation condition from dropdown');
      log.info(`Attempting to select condition: ${vars["RuleCondition3"]}`);
      await bidmapDashboardPage.Operations_Dropdown_Advance_Search.selectOption({ value: vars["RuleCondition3"] });
      log.stepPass('Operation condition selected: ' + vars["RuleCondition3"]);

      // Enter Chase Value
      log.step('Enter Chase Value');
      if (await advanceSearchPage.Chase_Value_Input_box.isEnabled()) {
        log.info('Chase_Value_Input_box is enabled, filling with value');
        await advanceSearchPage.Chase_Value_Input_box.click();
        await advanceSearchPage.Chase_Value_Input_box.fill(vars["RuleBidTapeValue3"]);
        log.stepPass('Filled Chase Value Input box with: ' + vars["RuleBidTapeValue3"]);
      } else if (await advanceSearchPage.Chase_Values_Select.isEnabled()) {
        log.info('Chase_Values_Select is enabled, selecting value');
        await advanceSearchPage.Chase_Values_Select.selectOption({ label: vars["RuleBidTapeValue3"] });
        log.stepPass('Selected Chase Value from Select list: ' + vars["RuleBidTapeValue3"]);
      } else {
        log.stepFail(page, 'Neither Chase_Value_Input_box nor Chase_Values_Select is enabled');
        throw new Error('No valid input element found for Chase Value');
      }

      // Verify Actions section
      await expect(actionsPage.Actions).toBeVisible();
      log.stepPass('Actions section is visible');

      // Select IF Chase Field
      log.step('Select IF Chase Field');
      log.info(`Attempting to select Chase Field: ${APP_CONSTANTS.UniqueChaseFieldName3}`);
      await CorrPortalElem.IF_Chase_Field.selectOption({ label: APP_CONSTANTS.UniqueChaseFieldName3 });
      log.info(`Selected Chase Field: ${APP_CONSTANTS.UniqueChaseFieldName3}`);

      const selectedText1 = await CorrPortalElem.IF_Chase_Field.locator('option:checked').textContent();
      log.info(`Verified selected Chase Field text: ${selectedText1?.trim()}`);
      expect(selectedText1?.trim()).toBe(APP_CONSTANTS.UniqueChaseFieldName3);
      log.stepPass('Chase Field selected successfully: ' + APP_CONSTANTS.UniqueChaseFieldName3);

      // Enter Chase Field value
      log.step('Enter Chase Field value');
      if (await CorrPortalElem.Chase_Field_Input_box.isEnabled()) {
        log.info('Chase_Field_Input_box is enabled, filling with value');
        await CorrPortalElem.Chase_Field_Input_box.fill(APP_CONSTANTS.UniqueChaseValue3);
        log.stepPass('Filled Chase Field Input box with value: ' + APP_CONSTANTS.UniqueChaseValue3);
      } else if (await CorrPortalElem.Chase_Field_Select_list.isEnabled()) {
        log.info('Chase_Field_Select_list is enabled, selecting value');
        await CorrPortalElem.Chase_Field_Select_list.selectOption({ label: APP_CONSTANTS.UniqueChaseValue3 });
        log.stepPass('Selected Chase Field Select list with value: ' + APP_CONSTANTS.UniqueChaseValue3);
      } else {
        log.stepFail(page, 'Neither Chase_Field_Input_box nor Chase_Field_Select_list is enabled');
        throw new Error('No valid input element found for Chase Field value');
      }

      // Execute search
      log.step('Click Show Results Button to execute search');
      await expect(showResultsButtonPage.Show_Results_Button).toBeVisible();
      log.info('Show Results button is visible');
      
      await showResultsButtonPage.Show_Results_Button.click();
      log.info('Clicked Show Results button');

      log.step('Wait for search results to load');
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Search results loaded successfully');

      // Verify search results
      log.step('Verify search results');
      log.info(`Verifying BidMap3 is visible: ${vars["BidMapName3"]}`);
      await expect(advanceSearchPage.BidMap3_Advance_Search(vars["BidMapName3"])).toBeVisible();
      log.info('✓ BidMap3 is visible');

      log.info(`Verifying BidMap2 is not visible: ${vars["BidMapName2"]}`);
      await expect(advanceSearchPage.BidMap2_Advance_Search(vars["BidMapName2"])).not.toBeVisible();
      log.info('✓ BidMap2 is not visible');

      log.info(`Verifying BidMap1 is not visible: ${vars["BidMapName1"]}`);
      await expect(mappingListPage.BidMap1_Advanced_Search(vars["BidMapName1"])).not.toBeVisible();
      log.info('✓ BidMap1 is not visible');
      log.stepPass('All search result verifications passed');

      // Export search results
      log.step('Export search results');
      log.info('Calling stepGroup_Exporting_Map_list_for_Advance_Search_New');
      await stepGroups.stepGroup_Exporting_Map_list_for_Advance_Search_New(page, vars);
      log.stepPass('Search results exported successfully');

      // Clear Action filter
      log.step('Clear Action filter');
      log.info('Clicking on Action_Clear_button');
      await mappingListaaaPage.Action_Clear_button.click();
      log.info('Action_Clear_button clicked');

      log.step('Wait for page to load after clearing');
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Page loaded after clearing filter');

      // Verify results after clearing
      log.step('Verify results after clearing Action filter');
      log.info(`Verifying BidMap3 is still visible: ${vars["BidMapName3"]}`);
      await expect(advanceSearchPage.BidMap3_Advance_Search(vars["BidMapName3"])).toBeVisible();
      log.info('✓ BidMap3 is visible');

      log.info(`Verifying BidMap1 is now visible: ${vars["BidMapName1"]}`);
      await expect(mappingListPage.BidMap1_Advanced_Search(vars["BidMapName1"])).toBeVisible();
      log.info('✓ BidMap1 is visible');

      log.info(`Verifying BidMap2 is still not visible: ${vars["BidMapName2"]}`);
      await expect(advanceSearchPage.BidMap2_Advance_Search(vars["BidMapName2"])).not.toBeVisible();
      log.info('✓ BidMap2 is not visible');
      log.stepPass('All post-clear verifications passed');

      // Get count after clearing action
      log.step('Get BidMaps count after clearing Action filter');
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      vars["BidMapsCount(AdvanceSearch)"] = String(await priceOfferedPage.RowCount.count());
      log.info(`BidMaps count (after clearing action): ${vars["BidMapsCount(AdvanceSearch)"]}`);

      // Clear Condition filter
      log.step('Clear Condition filter');
      log.info('Clicking on Condition_Clear_Button');
      await mappingListPage.Condition_Clear_Button.click();
      log.info('Condition_Clear_Button clicked');

      log.step('Wait for page to load after clearing Condition');
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Page loaded after clearing Condition filter');

      // Verify Condition_Clear_Button is hidden
      await expect(mappingListPage.Condition_Clear_Button).not.toBeVisible();
      log.info('Condition_Clear_Button is not visible');

      await expect(statusInactive2Page.SearchFilter_Fields.first()).toBeVisible();
      log.info('SearchFilter_Fields is visible');

      // Get total count
      log.step('Get total BidMaps count (all maps)');
      vars["BidMapsCount(AllMapsList)"] = String(await priceOfferedPage.RowCount.count());
      log.info(`BidMaps count (all maps): ${vars["BidMapsCount(AllMapsList)"]}`);

      // Compare counts
      log.step('Verify advanced search count is less than total count');
      const advanceSearchCount = parseInt(vars["BidMapsCount(AdvanceSearch)"]);
      const allMapsCount = parseInt(vars["BidMapsCount(AllMapsList)"]);
      log.info(`Comparing: AdvanceSearch (${advanceSearchCount}) < AllMaps (${allMapsCount})`);
      expect(advanceSearchCount).toBeLessThan(allMapsCount);
      log.stepPass('Advanced search count is correctly less than total count');

      // Cleanup: Delete created advanced search bid maps
      log.step('Cleanup: Delete created advanced search bid maps');
      try {
        log.info('Starting cleanup process');

        if (await mappingListaaaPage.Action_Clear_button.isVisible()) {
          log.info('Action_Clear_button is visible, clearing it');
          await mappingListPage.Condition_Clear_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.info('Cleared filters');
        }

        const CorrPortalElem = new CorrPortalPage(page);
        log.info('Navigating to Bid Maps to delete created maps');
        
        await CorrPortalElem.Administration_Menu.click();
        log.info('Clicked Administration_Menu');
        
        await CorrPortalElem.Bid_Maps_Menu.click();
        log.info('Clicked Bid_Maps_Menu');
        
        await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
        log.info('Spinner hidden');
        
        await expect(CorrPortalElem.Mappings).toBeVisible();
        log.info('Mappings section is visible');

        const count = await CorrPortalElem.Advanced_Search_Bid_maps_Delete_Button_1.count();
        vars["Advanced_Search_Bid_maps_Count"] = String(count);
        log.info(`Found ${vars["Advanced_Search_Bid_maps_Count"]} advanced search bid maps to delete`);

        let iteration = 0;
        while (await CorrPortalElem.Advanced_Search_Bid_maps_Delete_Button_1.count() > 0) {
          iteration++;
          log.info(`========== DELETION ITERATION ${iteration} ==========`);

          const remainingCount = await CorrPortalElem.Advanced_Search_Bid_maps_Delete_Button_1.count();
          log.info(`Remaining advanced search bid maps: ${remainingCount}`);

          const deleteButton = CorrPortalElem.Advanced_Search_Bid_maps_Delete_Button_1.first();
          await deleteButton.waitFor({ state: 'visible' });
          log.info('Delete button is visible');

          await deleteButton.click();
          log.info('Clicked delete button');

          // Confirm delete
          await correspondentPortal18Page.Yes_Proceed_Button.waitFor({ state: 'visible' });
          log.info('Yes/Proceed button is visible');
          
          await correspondentPortal18Page.Yes_Proceed_Button.click();
          log.info('Clicked Yes/Proceed button to confirm deletion');
          
          await correspondentPortal18Page.Yes_Proceed_Button.waitFor({ state: 'hidden' });
          log.info('Yes/Proceed button is hidden');
          
          await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
          log.info('Spinner hidden after deletion');
          
          log.info(`========== ITERATION ${iteration} COMPLETED ==========\n`);
        }

        const finalCount = await CorrPortalElem.Advanced_Search_Bid_maps_Delete_Button_1.count();
        if (finalCount === 0) {
          log.stepPass('All advanced search bid maps deleted successfully');
        } else {
          log.stepFail(page, `Some advanced search bid maps could not be deleted. Remaining count: ${finalCount}`);
        }
      } catch (e) {
        log.stepFail(page, 'Failed to delete the created advanced search bid maps during cleanup');
        
      }

      log.tcEnd('PASS');
    } catch (e) {
      await log.stepFail(page, TC_ID);
      reg_ts32_testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }
  });

  test.afterEach(async ({ page }) => {
    log.info('========== TEST TEARDOWN: afterEach ==========');

    if (reg_ts32_testFailed) {
      log.warn('Test failed, initiating cleanup of created advanced search bid maps');
      try {
        log.info('Checking if filters need to be cleared');
        if (await mappingListaaaPage.Action_Clear_button.isVisible()) {
          log.info('Clearing filters');
          await mappingListPage.Condition_Clear_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.info('Filters cleared');
        }

        const CorrPortalElem = new CorrPortalPage(page);
        log.info('Navigating to Bid Maps for cleanup');
        
        await CorrPortalElem.Administration_Menu.click();
        log.info('Clicked Administration_Menu');
        
        await CorrPortalElem.Bid_Maps_Menu.click();
        log.info('Clicked Bid_Maps_Menu');
        
        await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
        log.info('Page loaded');
        
        await expect(CorrPortalElem.Mappings).toBeVisible();
        log.info('Mappings section is visible');

        const count = await CorrPortalElem.Advanced_Search_Bid_maps_Delete_Button_1.count();
        vars["Advanced_Search_Bid_maps_Count"] = String(count);
        log.info(`Found ${vars["Advanced_Search_Bid_maps_Count"]} advanced search bid maps to delete in cleanup`);

        let iteration = 0;
        while (await CorrPortalElem.Advanced_Search_Bid_maps_Delete_Button_1.count() > 0) {
          iteration++;
          log.info(`========== CLEANUP DELETION ITERATION ${iteration} ==========`);

          const remainingCount = await CorrPortalElem.Advanced_Search_Bid_maps_Delete_Button_1.count();
          log.info(`Remaining advanced search bid maps: ${remainingCount}`);

          const deleteButton = CorrPortalElem.Advanced_Search_Bid_maps_Delete_Button_1.first();
          await deleteButton.waitFor({ state: 'visible' });
          log.info('Delete button is visible');

          await deleteButton.click();
          log.info('Clicked delete button');

          // Confirm delete
          await correspondentPortal18Page.Yes_Proceed_Button.waitFor({ state: 'visible' });
          log.info('Yes/Proceed button is visible');
          
          await correspondentPortal18Page.Yes_Proceed_Button.click();
          log.info('Clicked Yes/Proceed button to confirm deletion');
          
          await correspondentPortal18Page.Yes_Proceed_Button.waitFor({ state: 'hidden' });
          log.info('Yes/Proceed button is hidden');
          
          await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
          log.info('Spinner hidden after deletion');
          
          log.info(`========== CLEANUP ITERATION ${iteration} COMPLETED ==========\n`);
        }

        const finalCount = await CorrPortalElem.Advanced_Search_Bid_maps_Delete_Button_1.count();
        if (finalCount === 0) {
          log.info('All advanced search bid maps deleted successfully in cleanup');
        } else {
          log.warn(`Some advanced search bid maps could not be deleted. Remaining count: ${finalCount}`);
        }
      } catch (e) {
        log.stepFail(page, TC_ID);
        log.info('Failed to delete the created advanced search bid maps in cleanup');
      }
    } else {
      log.info('No cleanup needed as test passed successfully');
    }

    log.info('========== TEST TEARDOWN COMPLETED ==========\n');
  });
});