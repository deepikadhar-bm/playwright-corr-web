import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidmapPage } from '../../pages/correspondant/bidmap';
import { BidmapsPage } from '../../pages/correspondant/bidmaps';
import { BidMapsPage } from '../../pages/correspondant/bid-maps';
import { ChaseFieldNamePage } from '../../pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { P1MoreButtonPage } from '../../pages/correspondant/p-1-more-button';
import { RulecheckbidMapPage } from '../../pages/correspondant/rulecheckbid-map';
import { ShowAllPage } from '../../pages/correspondant/show-all';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { StatusInactive2Page } from '../../pages/correspondant/status-inactive--2';
import { runPrereq_1371 } from './prereq-1371';

export async function runPrereq_1053(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1371(page, vars);

  const bidmapPage = new BidmapPage(page);
  const bidmapsPage = new BidmapsPage(page);
  const bidMapsPage = new BidMapsPage(page);
  const chaseFieldNamePage = new ChaseFieldNamePage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const p1MoreButtonPage = new P1MoreButtonPage(page);
  const rulecheckbidMapPage = new RulecheckbidMapPage(page);
  const showAllPage = new ShowAllPage(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactive2Page = new StatusInactive2Page(page);



  // [DISABLED] Click on Cross button in Bid Map
  // await correspondentPortalPage.Cross_button_in_Bid_Map.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await page.waitForLoadState('networkidle');
  await statusInactive2Page.SearchFilter_Fields.clear();
  await statusInactive2Page.SearchFilter_Fields.click();
  vars["UniqueBidMapName"] = vars["SearchFieldInputMap"];
  await statusInactive2Page.SearchFilter_Fields.fill(vars["UniqueBidMapName"]);
  await page.keyboard.press('Enter');
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await page.waitForLoadState('networkidle');
  await showAllPage.Show_All_2.waitFor({ state: 'visible' });
  await expect(correspondentPortalPage.BidMapTitle).toBeVisible();
  await expect(rulecheckbidMapPage.Rule_Check_Bid_Map).toContainText("map:");
  await expect(bidMapsPage.BidMap_Search_and_Filter_MapName_Text).toContainText(vars["UniqueBidMapName"]);
  await showAllPage.Show_All_2.hover();
  await correspondentPortalPage.Show_All1.click();
  await page.waitForLoadState('networkidle');
  await expect(bidmapPage.First_Bid_Map_Name).toContainText(vars["UniqueBidMapName"]);
  await bidmapsPage.Required_Bid_Map_CheckBox.click();
  // [DISABLED] Click on Select_all_for_Checkbox
  // await chaseFieldNamePage.Select_all_for_Checkbox.click();
  await p1MoreButtonPage.Export_Selected_Dropdown.click();
  await stepGroups.stepGroup_Verification_of_ExportList_from_UI_to_Excel(page, vars);
}
