// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { AdvanceSearchPage } from '../../../src/pages/correspondant/advance-search';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { ItagPage } from '../../../src/pages/correspondant/itag';
import { MappingListPage } from '../../../src/pages/correspondant/mapping-list';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { runPrereq_911 } from '../../../src/helpers/prereqs/prereq-911';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { APP_CONSTANTS } from 'src/constants/app-constants';
import { Logger as log } from '@helpers/log-helper';
import { CorrespondentPortal18Page } from '../../../src/pages/correspondant/correspondent-portal-18';
import { MappingListaaaPage } from '../../../src/pages/correspondant/mapping-listaaa';

const TC_ID = 'REG_TS32_TC01.2';
const TC_TITLE = 'Verify the advance search functionality, where the user should be able to perform search action based on the rules and actions.[Advance Search for Actions]';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let advanceSearchPage: AdvanceSearchPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let itagPage: ItagPage;
  let mappingListPage: MappingListPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let correspondentPortal18Page: CorrespondentPortal18Page;
  let mappingListaaaPage: MappingListaaaPage;
  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_911(page, vars);
    advanceSearchPage = new AdvanceSearchPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    itagPage = new ItagPage(page);
    mappingListPage = new MappingListPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
    mappingListaaaPage = new MappingListaaaPage(page);
  });
  let reg_ts32_testFailed = false;
  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    
    try {
      log.step('Navigate to Administration menu and perform advance search for actions');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        // await stepGroups.stepGroup_Advance_Search_For_Actions(page, vars);
        const CorrPortalElem = new CorrPortalPage(page);
        
        log.step('Click on search filter input field');
        await CorrPortalElem.SearchFilter_Input_Field.click();
        
        log.step('Click on Try Advanced Search and Filter option');
        await CorrPortalElem.Try_Advanced_Search_and_Filter_option_Button.click();
        await expect(CorrPortalElem.Advanced_Search_Filter).toBeVisible();
        log.stepPass('Advanced Search Filter is visible');
        
        await expect(CorrPortalElem.Actions).toBeVisible();
        log.stepPass('Actions section is visible');
        
        log.step('Select Chase Field from dropdown');
        await CorrPortalElem.IF_Chase_Field.selectOption({ label: APP_CONSTANTS.UniqueChaseFieldName1 });
        const selectedText = await CorrPortalElem.IF_Chase_Field.locator('option:checked').textContent();
        
        expect(selectedText?.trim()).toBe(APP_CONSTANTS.UniqueChaseFieldName1);
        log.stepPass('Chase Field selected successfully: ' + APP_CONSTANTS.UniqueChaseFieldName1);
        //await expect(CorrPortalElem.IF_Chase_Field).toHaveValue(APP_CONSTANTS.UniqueChaseFieldName1);
        //await expect(page.getByText(APP_CONSTANTS.UniqueChaseFieldName1)).toBeVisible();
        
        log.step('Enter Chase Field value');
        if (await CorrPortalElem.Chase_Field_Input_box.isEnabled()) /* Element Chase Field Input box is enabled */ {
          await CorrPortalElem.Chase_Field_Input_box.fill(APP_CONSTANTS.UniqueChaseValue1);
          log.info('Filled Chase Field Input box with value: ' + APP_CONSTANTS.UniqueChaseValue1);
        } else if (await CorrPortalElem.Chase_Field_Select_list.isEnabled()) /* Element Chase Field Select list is enabled */ {
          await CorrPortalElem.Chase_Field_Select_list.selectOption({ label: APP_CONSTANTS.UniqueChaseValue1 });
          log.info('Selected Chase Field Select list with value: ' + APP_CONSTANTS.UniqueChaseValue1);
        }
        
        await expect(CorrPortalElem.Show_Results_Button).toBeVisible();
        log.stepPass('Show Results button is visible');
        
        log.step('Click Show Results button to execute search');
        await CorrPortalElem.Show_Results_Button.click();
        await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Search executed successfully and results loaded');
        
        log.step('Verify first bid map is visible in search results');
        await expect(mappingListPage.BidMap1_Advanced_Search(vars["BidMapName1"])).toBeVisible();
        log.stepPass('Verified that the first bid map is visible in the search result: ' + vars["BidMapName1"]);
        
        log.step('Verify second bid map is visible in search results');
        await expect(advanceSearchPage.BidMap2_Advance_Search(vars["BidMapName2"])).toBeVisible();
        log.stepPass('Verified that the second bid map is visible in the search result: ' + vars["BidMapName2"]);
        
        log.step('Verify third bid map is not visible in search results');
        await expect(advanceSearchPage.BidMap3_Advance_Search(vars["BidMapName3"])).not.toBeVisible();
        log.stepPass('Verified that the third bid map is not visible in the search result: ' + vars["BidMapName3"]);
        
        log.step('Verify and export search results');
        log.info("Verifying the export action for the search result");
        await stepGroups.stepGroup_Exporting_Map_list_for_Advance_Search_New(page, vars);
        log.stepPass('Search results exported successfully');
        
        log.step('Reset the search filter');
        await itagPage.Reset_Button.click();
        await itagPage.Reset_Button.waitFor({ state: 'hidden' });
        log.stepPass('Search filter reset successfully');
        
        await expect(statusInactive2Page.SearchFilter_Fields).toBeVisible();
        log.stepPass('Search filter fields are visible after reset');
        
        log.stepPass('Navigate to Administration menu and perform advance search for actions completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Administration menu or perform advance search for actions');
        throw e;
      }
      
      log.tcEnd('PASS');
    } catch(e){
      reg_ts32_testFailed = true;
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
  
  test.afterEach(async ({ page }) => {
    if (reg_ts32_testFailed) {
      log.info('Test failed, initiating cleanup of created advanced search bid maps');
      try {
       // if (await mappingListaaaPage.Action_Clear_button.isVisible()) {
          await mappingListaaaPage.Action_Clear_button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
       // }
        const CorrPortalElem = new CorrPortalPage(page);
        await CorrPortalElem.Administration_Menu.click();
        await CorrPortalElem.Bid_Maps_Menu.click();
        await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
        await expect(CorrPortalElem.Mappings).toBeVisible();
        const count = await CorrPortalElem.Advanced_Search_Bid_maps_Delete_Button_1.count();
        vars["Advanced_Search_Bid_maps_Count"] = String(count);
        log.info(`Found ${vars["Advanced_Search_Bid_maps_Count"]} advanced search bid maps to delete`);
        let iteration = 0;
        while (await CorrPortalElem.Advanced_Search_Bid_maps_Delete_Button_1.count() > 0) {
          iteration++;
          log.info(`Iteration ${iteration}`);
          log.info(`Attempting to delete advanced search bid map. Remaining count before deletion: ${await CorrPortalElem.Advanced_Search_Bid_maps_Delete_Button_1.count()}`);
        
          const deleteButton = CorrPortalElem.Advanced_Search_Bid_maps_Delete_Button_1.first();

          await deleteButton.waitFor({ state: 'visible' });

          await deleteButton.click();
          log.info(`Clicked delete button for one advanced search bid map`);

          // Confirm delete
          await correspondentPortal18Page.Yes_Proceed_Button.waitFor({ state: 'visible' });
          await correspondentPortal18Page.Yes_Proceed_Button.click();
          log.info(`Clicked on Yes Proceed button to confirm deletion of advanced search bid map`);
          await correspondentPortal18Page.Yes_Proceed_Button.waitFor({ state: 'hidden' });
          await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
        }
        const count1 = await CorrPortalElem.Advanced_Search_Bid_maps_Delete_Button_1.count();
        if (count1 === 0) {
          log.info('All advanced search bid maps deleted successfully');
        }
        else {
          log.info(`Some advanced search bid maps could not be deleted. Remaining count: ${count1}`);
        }
      } catch (e) {
        log.stepFail(page, 'Failed to delete the created advanced search bid maps in cleanup');
      }
    }
    else {
      log.info('No cleanup needed as test passed');
    }
  });
});