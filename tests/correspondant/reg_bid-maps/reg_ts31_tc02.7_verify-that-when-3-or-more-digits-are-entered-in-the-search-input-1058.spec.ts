import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ActionruleheaderPage } from '../../../src/pages/correspondant/actionruleheader';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { BidmapsPage } from '../../../src/pages/correspondant/bidmaps';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { HeadingBidmapPage } from '../../../src/pages/correspondant/heading-bidmap';
import { P1MoreButtonPage } from '../../../src/pages/correspondant/p-1-more-button';
import { RulesAndActionsPage } from '../../../src/pages/correspondant/rules-and-actions';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { runPrereq_1061 } from '../../../src/helpers/prereqs/prereq-1061';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS31_TC02.7';
const TC_TITLE = 'Verify that when 3 or more digits are entered in the search input, bid map records are displayed in the popup, showing matching keywords within the categories of Actions.';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let actionruleheaderPage: ActionruleheaderPage;
  let bidmapPage: BidmapPage;
  let bidmapsPage: BidmapsPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let headingBidmapPage: HeadingBidmapPage;
  let p1MoreButtonPage: P1MoreButtonPage;
  let rulesAndActionsPage: RulesAndActionsPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactivePage: StatusInactivePage;
  let REG_TS31_TC02_7testFailed = false;

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    await runPrereq_1061(page, vars);
    actionruleheaderPage = new ActionruleheaderPage(page);
    bidmapPage = new BidmapPage(page);
    bidmapsPage = new BidmapsPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    headingBidmapPage = new HeadingBidmapPage(page);
    p1MoreButtonPage = new P1MoreButtonPage(page);
    rulesAndActionsPage = new RulesAndActionsPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      if (profile && profile.data) {
        vars['UniqueChaseValueSearch'] = profile.data[0]['UniqueChaseValueSearch'];
        log.info('UniqueChaseValueSearch: ' + vars['UniqueChaseValueSearch']);
      }

      log.step('Clear current search and search for Bid Map using unique chase value');
      try {
        await correspondentPortalPage.Cross_button_in_Bid_Map.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await statusInactive2Page.SearchFilter_Fields.click();
        await statusInactive2Page.SearchFilter_Fields.type(vars['UniqueChaseValueSearch']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Search cleared and Bid Map searched using unique chase value successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to clear search or search using unique chase value');
        throw e;
      }

      log.step('Verify actions search result popup shows correct key and value');
      try {
        await correspondentPortalPage.Action_in_SearchFilter.waitFor({ state: 'visible' });
        await expect(actionruleheaderPage.action_Rule_Header.first()).toContainText('act:');
        await expect(bidmapsPage.Action_SearchFilter_Value_Text.first()).toContainText(vars['UniqueChaseValueSearch']);
        log.stepPass('Actions search result popup verified with correct key and value successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify actions search result popup');
        throw e;
      }

      log.step('Show all actions results and navigate to Bid Map');
      try {
        await correspondentPortalPage.Action_in_SearchFilter.hover();
        await correspondentPortalPage.Show_All_For_Actions_SearchFilter.click();
        await statusInactivePage.BidMap_list_Screen.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars['UniqueBidMapName']).first()).toBeVisible();
        log.info('UniqueBidMapName: ' + vars['UniqueBidMapName']);
        log.stepPass('All actions results shown and navigated to Bid Map successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to show all actions results or navigate to Bid Map');
        throw e;
      }

      log.step('Navigate to Rules and Actions and verify chase value');
      try {
        await headingBidmapPage.Rules_and_ActionsPage_link.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(rulesAndActionsPage.Chase_Value_Rules_Actions.first()).toContainText(vars['UniqueChaseValueSearch']);
        log.info('UniqueChaseValueSearch verified: ' + vars['UniqueChaseValueSearch']);
        log.stepPass('Navigated to Rules and Actions and chase value verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Rules and Actions or verify chase value');
        throw e;
      }

      log.step('Save and publish Bid Map and verify Bid Map name in list');
      try {
        await saveAndPublishButtonPage.Save_and_Publish_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(bidmapPage.First_Bid_Map_Name.first()).toContainText(vars['UniqueBidMapName']);
        log.info('UniqueBidMapName verified in list: ' + vars['UniqueBidMapName']);
        log.stepPass('Bid Map saved and published and Bid Map name verified in list successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to save and publish Bid Map or verify Bid Map name in list');
        throw e;
      }

      log.step('Select all Bid Maps, verify checkbox and Export Selected button, then open dropdown');
      try {
        await chaseFieldNamePage.Select_all_for_Checkbox.check();
        await expect(chaseFieldNamePage.Select_all_for_Checkbox).toBeChecked();
        await expect(p1MoreButtonPage.Export_Selected_Dropdown).toBeEnabled();
        await p1MoreButtonPage.Export_Selected_Dropdown.click();
        log.stepPass('All Bid Maps selected, checkbox and Export Selected button verified, dropdown opened successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to select all Bid Maps or verify Export Selected button');
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

      log.step('Navigate to Administration Menu and Bid Maps, then delete all advanced search Bid Maps');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.Bid_Maps_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Deleting_All_Advanced_Search_Bid_Maps(page, vars);
        log.stepPass('Navigated to Bid Maps and deleted all advanced search Bid Maps successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bid Maps or delete advanced search Bid Maps');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      REG_TS31_TC02_7testFailed = true;
      throw e;
    }
  });
  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, REG_TS31_TC02_7testFailed);
    if (REG_TS31_TC02_7testFailed) {
      try {
        log.step('Executing after-test steps: Deleting the created maps');
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.Bid_Maps_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Deleting_All_Advanced_Search_Bid_Maps(page, vars);
        log.stepPass('After-test steps executed successfully. All maps deleted');
      } catch (e) {
        await log.stepFail(page, 'Failed to Delete maps');
        throw e;
      }
    }
  });
});