import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { BidmapsPage } from '../../../src/pages/correspondant/bidmaps';
import { BidMapsPage } from '../../../src/pages/correspondant/bid-maps';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { P1MoreButtonPage } from '../../../src/pages/correspondant/p-1-more-button';
import { RulecheckbidMapPage } from '../../../src/pages/correspondant/rulecheckbid-map';
import { ShowAllPage } from '../../../src/pages/correspondant/show-all';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { runPrereq_1371 } from '../../../src/helpers/prereqs/prereq-1371';
import { Logger as log } from '@helpers/log-helper';


const TC_ID = 'REG_TS31_TC02.2';
const TC_TITLE = 'Verify that when 3 or more digits are entered in the search input, bid map records are displayed in the popup, showing matching keywords within the categories of bid map name.';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let bidmapPage: BidmapPage;
  let bidmapsPage: BidmapsPage;
  let bidMapsPage: BidMapsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let p1MoreButtonPage: P1MoreButtonPage;
  let rulecheckbidMapPage: RulecheckbidMapPage;
  let showAllPage: ShowAllPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;

  test.beforeEach(async ({ page }) => {
    await runPrereq_1371(page, vars);
    bidmapPage = new BidmapPage(page);
    bidmapsPage = new BidmapsPage(page);
    bidMapsPage = new BidMapsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    p1MoreButtonPage = new P1MoreButtonPage(page);
    rulecheckbidMapPage = new RulecheckbidMapPage(page);
    showAllPage = new ShowAllPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Wait for spinner and search for Bid Map using unique name');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await statusInactive2Page.SearchFilter_Fields.click();
        await statusInactive2Page.SearchFilter_Fields.clear();
        await statusInactive2Page.SearchFilter_Fields.click();
        vars['UniqueBidMapName'] = vars['SearchFieldInputMap'];
        log.info('UniqueBidMapName: ' + vars['UniqueBidMapName']);
        await statusInactive2Page.SearchFilter_Fields.type(vars['UniqueBidMapName']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Spinner hidden and Bid Map search performed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to search for Bid Map using unique name');
        throw e;
      }

      log.step('Verify search results popup shows Bid Map name and rule check');
      try {
        await showAllPage.Show_All_2.waitFor({ state: 'visible' });
        await expect(correspondentPortalPage.BidMapTitle).toBeVisible();
        await expect(rulecheckbidMapPage.Rule_Check_Bid_Map).toContainText('map:');
        await expect(bidMapsPage.BidMap_Search_and_Filter_MapName_Text).toContainText(vars['UniqueBidMapName']);
        log.stepPass('Search results popup verified with Bid Map name and rule check successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify search results popup');
        throw e;
      }

      log.step('Show all results and verify Bid Map name in list');
      try {
        await showAllPage.Show_All_2.hover();
        await correspondentPortalPage.Show_All1.click();
        await expect(bidmapPage.First_Bid_Map_Name.first()).toContainText(vars['UniqueBidMapName']);
        log.stepPass('All results shown and Bid Map name verified in list successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to show all results or verify Bid Map name in list');
        throw e;
      }

      log.step('Select required Bid Map checkbox and open Export Selected dropdown');
      try {
        await bidmapsPage.Required_Bid_Map_CheckBox(vars['UniqueBidMapName']).click();
        await expect(p1MoreButtonPage.Export_Selected_Dropdown).toBeEnabled();
        await p1MoreButtonPage.Export_Selected_Dropdown.click();
        log.stepPass('Required Bid Map checkbox selected and Export Selected dropdown opened successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to select Bid Map checkbox or open Export Selected dropdown');
        throw e;
      }

      log.step('Verify export list from UI to Excel');
      try {
        await stepGroups.stepGroup_Verification_of_ExportList_from_UI_to_Excel(page, vars);
        log.stepPass('Export list verified from UI to Excel successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify export list from UI to Excel');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});