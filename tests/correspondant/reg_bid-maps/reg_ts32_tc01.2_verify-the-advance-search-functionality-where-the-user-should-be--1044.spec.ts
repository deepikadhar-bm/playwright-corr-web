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

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let advanceSearchPage: AdvanceSearchPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let itagPage: ItagPage;
  let mappingListPage: MappingListPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_911(page, vars);
    advanceSearchPage = new AdvanceSearchPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    itagPage = new ItagPage(page);
    mappingListPage = new MappingListPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
  });

  test('REG_TS32_TC01.2_Verify the advance search functionality, where the user should be able to perform search action based on the rules and actions.[Advance Search for Actions]', async ({ page }) => {

    await correspondentPortalPage.Administration_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Advance_Search_For_Actions(page, vars);
    await expect(mappingListPage.BidMap1_Advanced_Search).toBeVisible();
    await expect(advanceSearchPage.BidMap2_Advance_Search).toBeVisible();
    await expect(advanceSearchPage.BidMap3_Advance_Search).toBeVisible();
    await stepGroups.stepGroup_Exporting_Map_list_for_Advance_Search_New(page, vars);
    await itagPage.Reset_Button.click();
    await itagPage.Reset_Button.waitFor({ state: 'hidden' });
    await expect(statusInactive2Page.SearchFilter_Fields).toBeVisible();
  });
});
