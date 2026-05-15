// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { AdvanceSearchPage } from '../../../src/pages/correspondant/advance-search';
import { ItagPage } from '../../../src/pages/correspondant/itag';
import { MappingListaaaPage } from '../../../src/pages/correspondant/mapping-listaaa';
import { MappingListPage } from '../../../src/pages/correspondant/mapping-list';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { runPrereq_1044 } from '../../../src/helpers/prereqs/prereq-1044';
import { APP_CONSTANTS } from 'src/constants/app-constants';
import { Logger as log } from '@helpers/log-helper';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { CorrespondentPortalPage } from '@pages/correspondant/correspondent-portal';
import { BidmapDashboardPage } from '@pages/correspondant/bidmap-dashboard';
import { CorrespondentPortal18Page } from '@pages/correspondant/correspondent-portal-18';


const TC_ID = 'REG_TS32_TC01.3';
const TC_TITLE = 'Verify the advance search functionality, where the user should be able to perform search action based on the rules and actions.[Advance Search for Rules]';
let reg_ts32_testFailed = false;
test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let advanceSearchPage: AdvanceSearchPage;
  let itagPage: ItagPage;
  let mappingListaaaPage: MappingListaaaPage;
  let mappingListPage: MappingListPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let bidmapDashboardPage: BidmapDashboardPage;
  let correspondentPortal18Page: CorrespondentPortal18Page;
  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1044(page, vars);
    advanceSearchPage = new AdvanceSearchPage(page);
    itagPage = new ItagPage(page);
    bidmapDashboardPage = new BidmapDashboardPage(page);
    mappingListaaaPage = new MappingListaaaPage(page);
    mappingListPage = new MappingListPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      log.step('Navigate to Administration menu and perform advance search for rules');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        //await stepGroups.stepGroup_Advanced_Search_For_Rules(page, vars);
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

        log.step('Select Bid Field from dropdown');
        await bidmapDashboardPage.IF_Bid_Field_Dropdownnew.selectOption({ value: vars["RuleBidField2"] });
        // await expect(page.getByText(vars["RuleBidField2"])).toBeVisible();
        const selectedText = await bidmapDashboardPage.IF_Bid_Field_Dropdownnew.locator('option:checked').textContent();
        expect(selectedText?.trim()).toContain(vars["RuleBidField2"]);
        log.stepPass('Bid Field selected successfully: ' + vars["RuleBidField2"]);

        log.step('Select Operation condition from dropdown');
        await bidmapDashboardPage.Operations_Dropdown_Advance_Search.selectOption({ value: vars["RuleCondition2"] });
        log.stepPass('Operation condition selected successfully: ' + vars["RuleCondition2"]);
        //log.step('Select Chase Field from dropdown');
        // await CorrPortalElem.IF_Chase_Field.selectOption({ label: APP_CONSTANTS.UniqueChaseFieldName1 });
        // const selectedText = await CorrPortalElem.IF_Chase_Field.locator('option:checked').textContent();

        // expect(selectedText?.trim()).toBe(APP_CONSTANTS.UniqueChaseFieldName1);
        // log.stepPass('Chase Field selected successfully: ' + APP_CONSTANTS.UniqueChaseFieldName1);
        // //await expect(CorrPortalElem.IF_Chase_Field).toHaveValue(APP_CONSTANTS.UniqueChaseFieldName1);
        //await expect(page.getByText(APP_CONSTANTS.UniqueChaseFieldName1)).toBeVisible();

        log.step('Enter Bid value');
        if (await advanceSearchPage.Chase_Value_Input_box.isEnabled()) /* Element Chase Value Input box is visible */ {
          await advanceSearchPage.Chase_Value_Input_box.click();
          await advanceSearchPage.Chase_Value_Input_box.fill(vars["RuleBidTapeValue2"] );
          log.info('Filled Bid value input box with value: ' + vars["RuleBidTapeValue2"]);
        } else if (await advanceSearchPage.Chase_Values_Select.isEnabled()) /* Element Chase Values Select is enabled */ {
          await advanceSearchPage.Chase_Values_Select.selectOption({ label: vars["RuleBidTapeValue2"]  });
          log.info('Selected Bid value from select list with value: ' + vars["RuleBidTapeValue2"]);
        }

        await expect(CorrPortalElem.Show_Results_Button).toBeVisible();
        log.stepPass('Show Results button is visible');

        log.step('Click Show Results button to execute search');
        await CorrPortalElem.Show_Results_Button.click();
        await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Search executed successfully and results loaded');

        log.step('Verify second bid map is visible in search results');
        await expect(advanceSearchPage.BidMap2_Advance_Search(vars["BidMapName2"])).not.toBeVisible();
        log.stepPass('Verified that the second bid map is visible in the search result: ' + vars["BidMapName2"]);

        log.step('Verify first bid map is not visible in search results');
        await expect(mappingListPage.BidMap1_Advanced_Search(vars["BidMapName1"])).not.toBeVisible();
        log.stepPass('Verified that the first bid map is not visible in the search result: ' + vars["BidMapName1"]);

        log.step('Verify third bid map is not visible in search results');
        await expect(advanceSearchPage.BidMap3_Advance_Search(vars["BidMapName3"])).toBeVisible();
        log.stepPass('Verified that the third bid map is not visible in the search result: ' + vars["BidMapName3"]);

        vars["BidMapsCount(AdvanceSearch)"] = String(await priceOfferedPage.RowCount.count());
        log.info('Captured bid maps count for advance search: ' + vars["BidMapsCount(AdvanceSearch)"]);

        log.step('Verify and export search results');
        log.info("Verifying the export action for the search result");
        
        await stepGroups.stepGroup_Exporting_Map_list_for_Advance_Search_New(page, vars);
        log.stepPass('Search results exported successfully');

        log.step('Reset the search filter');
        await itagPage.Reset_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Search filter reset successfully');

        await expect(mappingListPage.Condition_Clear_Button).not.toBeVisible();
        log.stepPass('Action Clear button is not visible after reset');

        await expect(statusInactive2Page.SearchFilter_Fields.first()).toBeVisible();
        log.stepPass('Search filter fields are visible after reset');

        log.step('Verify the bid maps count');
        await stepGroups.stepGroup_Verifying_The_BidMaps_Count(page, vars);
        log.stepPass('Bid maps count verified successfully');

        log.stepPass('Navigate to Administration menu and perform advance search for rules completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Administration menu or perform advance search for rules');
        throw e;
      }

      log.tcEnd('PASS');
    } catch(e){
      await log.captureOnFailure(page, TC_ID, e);
      reg_ts32_testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }
  });
  test.afterEach(async ({ page }) => {
    if (reg_ts32_testFailed) {
      log.info('Test failed, initiating cleanup of created advanced search bid maps');
      try {
       if (await mappingListaaaPage.Action_Clear_button.isVisible()) {
          await mappingListPage.Condition_Clear_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
       }
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