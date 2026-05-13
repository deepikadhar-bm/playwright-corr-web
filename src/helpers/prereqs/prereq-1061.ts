import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidmapPage } from '../../pages/correspondant/bidmap';
import { BidmapsPage } from '../../pages/correspondant/bidmaps';
import { BidMapsPage } from '../../pages/correspondant/bid-maps';
import { ChaseFieldNamePage } from '../../pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { HeadingBidmapPage } from '../../pages/correspondant/heading-bidmap';
import { P1MoreButtonPage } from '../../pages/correspondant/p-1-more-button';
import { RulesAndActionsPage } from '../../pages/correspondant/rules-and-actions';
import { SaveAndPublishButtonPage } from '../../pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { StatusInactive2Page } from '../../pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../pages/correspondant/status-inactive-';
import { WhenBidFieldPage } from '../../pages/correspondant/when-bid-field';
import { runPrereq_1057 } from './prereq-1057';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'PREREQ_1061(REG_TS31_TC02.6)';
const TC_TITLE = 'Verify that when 3 or more digits are entered in the search input, bid map records are displayed in the popup, showing matching keywords within the categories of Conditions.';

export async function runPrereq_1061(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1057(page, vars);

  const bidmapPage = new BidmapPage(page);
  const bidmapsPage = new BidmapsPage(page);
  const bidMapsPage = new BidMapsPage(page);
  const chaseFieldNamePage = new ChaseFieldNamePage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const headingBidmapPage = new HeadingBidmapPage(page);
  const p1MoreButtonPage = new P1MoreButtonPage(page);
  const rulesAndActionsPage = new RulesAndActionsPage(page);
  const saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactive2Page = new StatusInactive2Page(page);
  const statusInactivePage = new StatusInactivePage(page);
  const whenBidFieldPage = new WhenBidFieldPage(page);
  let REG_TS31_TC02_6_testFailed = false;

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

  log.tcStart(TC_ID, TC_TITLE);

  try {

    log.step('Load test data from profile');
    try {
      if (profile && profile.data) {
        vars['UniqueWhenBidFieldSearch'] = profile.data[0]['UniqueWhenBidFieldSearch'];
        vars['UniqueBidEnumTapeSearch'] = profile.data[0]['UniqueBidEnumTapeSearch'];
        log.info('UniqueWhenBidFieldSearch: ' + vars['UniqueWhenBidFieldSearch']);
        log.info('UniqueBidEnumTapeSearch: ' + vars['UniqueBidEnumTapeSearch']);
      }
      log.stepPass('Test data loaded from profile successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to load test data from profile');
      throw e;
    }

    log.step('Clear current search and search for Bid Map using unique when bid field');
    try {
      await correspondentPortalPage.Cross_button_in_Bid_Map.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await statusInactive2Page.SearchFilter_Fields.click();
      await statusInactive2Page.SearchFilter_Fields.type(vars['UniqueWhenBidFieldSearch']);
      await page.keyboard.press('Enter');
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Search cleared and Bid Map searched using unique when bid field successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to clear search or search using unique when bid field');
      throw e;
    }

    log.step('Verify conditions search result popup shows correct key and value');
    try {
      await bidMapsPage.Rules_and_Conditions_In_Search_field.waitFor({ state: 'visible' });
      await expect(bidmapsPage.Rules_Conditions_SearchFilter_Key_Text).toContainText('con:');
      await expect(bidmapsPage.Rules_Conditions_SearchFilter_Value_Text.first()).toContainText(vars['UniqueWhenBidFieldSearch']);
      log.stepPass('Conditions search result popup verified with correct key and value successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to verify conditions search result popup');
      throw e;
    }

    log.step('Show all conditions results and navigate to Bid Map');
    try {
      await bidMapsPage.Rules_and_Conditions_In_Search_field.hover();
      await bidMapsPage.Show_All_RuleCodition_SearchField.click();
      await statusInactivePage.BidMap_list_Screen.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(page.getByText(vars['UniqueBidMapName']).first()).toBeVisible();
      log.info('UniqueBidMapName: ' + vars['UniqueBidMapName']);
      log.stepPass('All conditions results shown and navigated to Bid Map successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to show all conditions results or navigate to Bid Map');
      throw e;
    }

    log.step('Navigate to Rules and Actions and verify when bid field and enum tape value');
    try {
      await headingBidmapPage.Rules_and_ActionsPage_link.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(whenBidFieldPage.When_Bid_Field_Dropdown).toContainText(vars['UniqueWhenBidFieldSearch']);
      await expect(rulesAndActionsPage.Bid_Enumerated_Tape_Value_Dropdown).toContainText(vars['UniqueBidEnumTapeSearch']);
      log.info('UniqueWhenBidFieldSearch verified: ' + vars['UniqueWhenBidFieldSearch']);
      log.info('UniqueBidEnumTapeSearch verified: ' + vars['UniqueBidEnumTapeSearch']);
      log.stepPass('Navigated to Rules and Actions and when bid field and enum tape value verified successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to navigate to Rules and Actions or verify when bid field and enum tape value');
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

    log.tcEnd('PASS');

  } catch (e) {
    await log.captureOnFailure(page, TC_ID, e);
    REG_TS31_TC02_6_testFailed = true;
    log.tcEnd('FAIL');
    throw e;
  }
  finally {
    log.afterTestSteps(TC_ID, REG_TS31_TC02_6_testFailed);
    if (REG_TS31_TC02_6_testFailed) {
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
  }
}