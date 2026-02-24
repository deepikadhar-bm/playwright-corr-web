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

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let advanceSearchPage: AdvanceSearchPage;
  let itagPage: ItagPage;
  let mappingListaaaPage: MappingListaaaPage;
  let mappingListPage: MappingListPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1044(page, vars);
    advanceSearchPage = new AdvanceSearchPage(page);
    itagPage = new ItagPage(page);
    mappingListaaaPage = new MappingListaaaPage(page);
    mappingListPage = new MappingListPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
  });

  test('REG_TS32_TC01.3_Verify the advance search functionality, where the user should be able to perform search action based on the rules and actions.[Advance Search for Rules]', async ({ page }) => {

    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Advanced_Search_For_Rules(page, vars);
    await expect(advanceSearchPage.BidMap2_Advance_Search).toBeVisible();
    await expect(mappingListPage.BidMap1_Advanced_Search).toBeVisible();
    await expect(advanceSearchPage.BidMap3_Advance_Search).toBeVisible();
    vars["BidMapsCount(AdvanceSearch)"] = String(await priceOfferedPage.RowCount.count());
    await stepGroups.stepGroup_Exporting_Map_list_for_Advance_Search_New(page, vars);
    await itagPage.Reset_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(mappingListaaaPage.Action_Clear_button).toBeVisible();
    await expect(statusInactive2Page.SearchFilter_Fields).toBeVisible();
    await stepGroups.stepGroup_Verifying_The_BidMaps_Count(page, vars);
  });
});
