import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidmapPage } from '../../pages/correspondant/bidmap';
import { BidmapsPage } from '../../pages/correspondant/bidmaps';
import { ChaseFieldNamePage } from '../../pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { HeadingBidmapPage } from '../../pages/correspondant/heading-bidmap';
import { P1MoreButtonPage } from '../../pages/correspondant/p-1-more-button';
import { SaveAndPublishButtonPage } from '../../pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { StatusInactive2Page } from '../../pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../pages/correspondant/status-inactive-';
import { runPrereq_1971 } from './prereq-1971';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'PREREQ_1057(REG_TS31_TC02.5)';
const TC_TITLE = 'Verify that when 3 or more digits are entered in the search input, bid map records are displayed in the popup, showing matching keywords within the categories of Rule Name.[';

export async function runPrereq_1057(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1971(page, vars);

  const bidmapPage = new BidmapPage(page);
  const bidmapsPage = new BidmapsPage(page);
  const chaseFieldNamePage = new ChaseFieldNamePage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const headingBidmapPage = new HeadingBidmapPage(page);
  const p1MoreButtonPage = new P1MoreButtonPage(page);
  const saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactive2Page = new StatusInactive2Page(page);
  const statusInactivePage = new StatusInactivePage(page);
  let REG_TS31_TC02_5_testFailed=false;

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);
  log.tcStart(TC_ID, TC_TITLE);

  try {

    log.step('Load test data from profile');
    try {
      if (profile && profile.data) {
        vars['UniqueRuleNameSearch'] = profile.data[0]['UniqueRuleNameSearch'];
        log.info('UniqueRuleNameSearch: ' + vars['UniqueRuleNameSearch']);
      }
      log.stepPass('Test data loaded from profile successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to load test data from profile');
      throw e;
    }

    log.step('Clear current search and search for Bid Map using unique rule name');
    try {
      await correspondentPortalPage.Cross_button_in_Bid_Map.click();
      await statusInactive2Page.SearchFilter_Fields.click();
      await statusInactive2Page.SearchFilter_Fields.type(vars['UniqueRuleNameSearch']);
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Search cleared and Bid Map searched using unique rule name successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to clear search or search using unique rule name');
      throw e;
    }

    log.step('Verify rule name search result popup shows correct rule name key and value');
    try {
      await correspondentPortalPage.RuleName_SearchField.waitFor({ state: 'visible' });
      await expect(bidmapsPage.RuleName_SearchFilter_KeyText).toContainText('name:');
      await expect(bidmapsPage.RuleName_Search_Filter_ValueText.first()).toContainText(vars['UniqueRuleNameSearch']);
      log.stepPass('Rule name search result popup verified with correct key and value successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to verify rule name search result popup');
      throw e;
    }

    log.step('Show all rule name results and navigate to Bid Map');
    try {
      await correspondentPortalPage.RuleName_SearchField.hover();
      await correspondentPortalPage.Show_All_for_RuleName_SearchField.click();
      await statusInactivePage.BidMap_list_Screen.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('All rule name results shown and navigated to Bid Map successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to show all rule name results or navigate to Bid Map');
      throw e;
    }

    log.step('Navigate to Rules and Actions and verify unique rule name');
    try {
      await headingBidmapPage.Rules_and_ActionsPage_link.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(correspondentPortalPage.Enter_a_Rule_Name_Field).toHaveValue(vars['UniqueRuleNameSearch']);
      log.info('UniqueRuleNameSearch verified in Rules and Actions: ' + vars['UniqueRuleNameSearch']);
      log.stepPass('Navigated to Rules and Actions and unique rule name verified successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to navigate to Rules and Actions or verify unique rule name');
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

    log.step('Select all Bid Maps and open Export Selected dropdown');
    try {
      await chaseFieldNamePage.Select_all_for_Checkbox.check();
      await expect(chaseFieldNamePage.Select_all_for_Checkbox).toBeChecked();
      await expect(p1MoreButtonPage.Export_Selected_Dropdown).toBeEnabled();
      await p1MoreButtonPage.Export_Selected_Dropdown.click();
      log.stepPass('All Bid Maps selected and Export Selected dropdown opened successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to select all Bid Maps or open Export Selected dropdown');
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
    REG_TS31_TC02_5_testFailed=true;
    log.tcEnd('FAIL');
    throw e;
  }
  finally {
    log.afterTestSteps(TC_ID, REG_TS31_TC02_5_testFailed);
    if (REG_TS31_TC02_5_testFailed) {
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