import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { ColumnheaderrulePage } from '../../../src/pages/correspondant/columnheaderrule';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { P1MoreButtonPage } from '../../../src/pages/correspondant/p-1-more-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { runPrereq_1053 } from '../../../src/helpers/prereqs/prereq-1053';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS31_TC02.3';
const TC_TITLE = 'Verify that when 3 or more digits are entered in the search input, bid map records are displayed in the popup, showing matching keywords within the categories of Enum .[Column Header]';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let bidmapPage: BidmapPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let columnheaderrulePage: ColumnheaderrulePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let p1MoreButtonPage: P1MoreButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactivePage: StatusInactivePage;

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    await runPrereq_1053(page, vars);
    bidmapPage = new BidmapPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    columnheaderrulePage = new ColumnheaderrulePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    p1MoreButtonPage = new P1MoreButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
        if (profile && profile.data) {
          vars['UniqueColumnHeaderSearch'] = profile.data[0]['UniqueColumnHeaderSearch'];
          vars['Unidentified fields Message'] = profile.data[0]['Unidentified fields Message'];
          log.info('UniqueColumnHeaderSearch: ' + vars['UniqueColumnHeaderSearch']);
          log.info('Unidentified fields Message: ' + vars['Unidentified fields Message']);
        }

      log.step('Clear current search and search for Bid Map using unique column header');
      try {
        await correspondentPortalPage.Cross_button_in_Bid_Map.click();
        await statusInactive2Page.SearchFilter_Fields.click();
        await statusInactive2Page.SearchFilter_Fields.type(vars['UniqueColumnHeaderSearch']);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info('UniqueBidMapName: ' + vars['UniqueBidMapName']);
        log.stepPass('Search cleared and Bid Map searched using unique column header successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to clear search or search using unique column header');
        throw e;
      }

      log.step('Verify column header search result and show all column header results');
      try {
        await expect(statusInactivePage.Column_Header_In_SeachField).toBeVisible();
        await expect(columnheaderrulePage.column_Header_Rule).toContainText('col:');
        await statusInactivePage.Column_Header_In_SeachField.hover();
        await correspondentPortalPage.Show_All_ColumnHeader.click();
        log.stepPass('Column header search result verified and all column header results shown successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify column header search result or show all column header results');
        throw e;
      }

      log.step('Navigate to Bid Map and open Header Mapping');
      try {
        await statusInactivePage.BidMap_list_Screen.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await mapHeadersButtonPage.Map_Headers_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars['UniqueBidMapName'])).toBeVisible();
        await expect(page.getByText(vars['UniqueColumnHeaderSearch'])).toBeVisible();
        log.stepPass('Navigated to Bid Map and Header Mapping opened successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bid Map or open Header Mapping');
        throw e;
      }

      log.step('Navigate to Enumeration Mapping and proceed with unidentified fields');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(page.getByText(vars['Unidentified fields Message'])).toBeVisible();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Enumeration Mapping and proceeded with unidentified fields successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Enumeration Mapping or proceed with unidentified fields');
        throw e;
      }

      log.step('Navigate to Rules and Actions and proceed with unidentified fields');
      try {
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await expect(page.getByText(vars['Unidentified fields Message'])).toBeVisible();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Rules and Actions and proceeded with unidentified fields successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Rules and Actions or proceed with unidentified fields');
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
      log.tcEnd('FAIL');
      throw e;
    }
  });
});