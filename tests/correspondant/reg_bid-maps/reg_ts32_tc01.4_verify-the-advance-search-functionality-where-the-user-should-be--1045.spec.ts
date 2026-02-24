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

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_911(page, vars);
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
  });

  test('REG_TS32_TC01.4_Verify the advance search functionality, where the user should be able to perform search action based on the rules and actions.[Advance Search for both Rules and Actions]', async ({ page }) => {

    // Set up download handler
    page.on('download', async (download) => {
      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      await download.saveAs(filePath);
      vars['_lastDownloadPath'] = filePath;
    });

    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.Bid_Maps_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await statusInactive2Page.SearchFilter_Fields.click();
    await correspondentPortalPage.Try_Advanced_Search_and_Filter_option_Button.click();
    await expect(correspondentPortalPage.Advanced_SearchFilter).toBeVisible();
    await bidmapDashboardPage.IF_Bid_Field_Dropdownnew.selectOption({ label: vars["RuleBidField1"] });
    await expect(page.getByText(vars["RuleBidField1"])).toBeVisible();
    await bidmapDashboardPage.Operations_Dropdown_Advance_Search.selectOption({ label: vars["RuleOperator1"] });
    if (true) /* Element Chase Value Input box is visible */ {
      await advanceSearchPage.Chase_Value_Input_box.click();
      await advanceSearchPage.Chase_Value_Input_box.fill(vars["RuleChaseValue1"]);
    } else if (true) /* Element Chase Values Select is enabled */ {
      await advanceSearchPage.Chase_Values_Select.selectOption({ label: vars["RuleChaseValue1"] });
    }
    await expect(actionsPage.Actions).toBeVisible();
    await advanceSearchPage.IF_Chase_Field.selectOption({ label: vars["ActionChaseField3"] });
    await expect(page.getByText(vars["ActionChaseField3"])).toBeVisible();
    if (true) /* Element Chase Field Input box is enabled */ {
      await advanceSearchPage.Chase_Field_Input_box.fill(vars["ActionChaseValue3"]);
    } else if (true) /* Element Chase Field Select list is enabled */ {
      await advanceSearchPage.Chase_Field_Select_list.selectOption({ label: vars["ActionChaseValue3"] });
    }
    await expect(showResultsButtonPage.Show_Results_Button).toBeVisible();
    await showResultsButtonPage.Show_Results_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(advanceSearchPage.BidMap3_Advance_Search).toBeVisible();
    await expect(advanceSearchPage.BidMap2_Advance_Search).toBeVisible();
    await expect(mappingListPage.BidMap1_Advanced_Search).toBeVisible();
    await correspondentPortalPage.Select_All_Checkbox.check();
    await expect(correspondentPortalPage.Select_All_Checkbox).toBeVisible();
    await chaseFieldNamePage.Export_Selected.waitFor({ state: 'visible' });
    await page.waitForTimeout(5000);
    await chaseFieldNamePage.Export_Selected.click();
    await correspondentPortalPage.Export_List.waitFor({ state: 'visible' });
    await correspondentPortalPage.Export_List.click();
    vars[""] = vars['_lastDownloadPath'] ? require('path').basename(vars['_lastDownloadPath']) : '';
    await stepGroups.stepGroup_New_Export_List_Advance_Search(page, vars);
    await mappingListaaaPage.Action_Clear_button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(advanceSearchPage.BidMap3_Advance_Search).toBeVisible();
    await expect(mappingListPage.BidMap1_Advanced_Search).toBeVisible();
    await expect(advanceSearchPage.BidMap2_Advance_Search).toBeVisible();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["BidMapsCount(AdvanceSearch)"] = String(await priceOfferedPage.RowCount.count());
    await mappingListPage.Condition_Clear_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(mappingListPage.Condition_Clear_Button).toBeVisible();
    await expect(statusInactive2Page.SearchFilter_Fields).toBeVisible();
    vars["BidMapsCount(AllMapsList)"] = String(await priceOfferedPage.RowCount.count());
    expect(String(vars["BidMapsCount(AdvanceSearch)"])).toBe(vars["BidMapsCount(AllMapsList)"]);
    while (await bidMapsPage.Advanced_Search_Bid_maps_Delete_Button_1.isVisible()) {
      await bidMapsPage.Advanced_Search_Bid_maps_Delete_Button_1.click();
      await correspondentPortalPage.Yes_Proceed_Button.click();
    }
  });
});
