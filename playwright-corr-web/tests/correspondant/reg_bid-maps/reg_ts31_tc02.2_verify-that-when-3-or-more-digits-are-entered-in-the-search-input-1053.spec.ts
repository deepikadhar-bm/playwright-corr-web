// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { BidmapsPage } from '../../../src/pages/correspondant/bidmaps';
import { BidMapsPage } from '../../../src/pages/correspondant/bid-maps';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { P1MoreButtonPage } from '../../../src/pages/correspondant/p-1-more-button';
import { RulecheckbidMapPage } from '../../../src/pages/correspondant/rulecheckbid-map';
import { ShowAllPage } from '../../../src/pages/correspondant/show-all';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { runPrereq_1371 } from '../../../src/helpers/prereqs/prereq-1371';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidmapPage: BidmapPage;
  let bidmapsPage: BidmapsPage;
  let bidMapsPage: BidMapsPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let p1MoreButtonPage: P1MoreButtonPage;
  let rulecheckbidMapPage: RulecheckbidMapPage;
  let showAllPage: ShowAllPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1371(page, vars);
    bidmapPage = new BidmapPage(page);
    bidmapsPage = new BidmapsPage(page);
    bidMapsPage = new BidMapsPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    p1MoreButtonPage = new P1MoreButtonPage(page);
    rulecheckbidMapPage = new RulecheckbidMapPage(page);
    showAllPage = new ShowAllPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
  });

  test('REG_TS31_TC02.2_Verify that when 3 or more digits are entered in the search input, bid map records are displayed in the popup, showing matching keywords within the categories of bid map name.', async ({ page }) => {

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
  });
});
