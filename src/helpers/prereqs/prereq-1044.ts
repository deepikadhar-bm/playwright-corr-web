import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { AdvanceSearchPage } from '../../pages/correspondant/advance-search';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { ItagPage } from '../../pages/correspondant/itag';
import { MappingListPage } from '../../pages/correspondant/mapping-list';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { StatusInactive2Page } from '../../pages/correspondant/status-inactive--2';
import { runPrereq_911 } from './prereq-911';

export async function runPrereq_1044(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_911(page, vars);

  const advanceSearchPage = new AdvanceSearchPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const itagPage = new ItagPage(page);
  const mappingListPage = new MappingListPage(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactive2Page = new StatusInactive2Page(page);



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
}
