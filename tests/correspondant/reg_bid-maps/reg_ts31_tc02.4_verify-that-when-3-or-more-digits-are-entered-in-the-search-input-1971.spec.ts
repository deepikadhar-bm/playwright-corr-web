import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { BidMapsPage } from '../../../src/pages/correspondant/bid-maps';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { EnumPage } from '../../../src/pages/correspondant/enum';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { P1MoreButtonPage } from '../../../src/pages/correspondant/p-1-more-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { runPrereq_1056 } from '../../../src/helpers/prereqs/prereq-1056';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS31_TC02.4';
const TC_TITLE = 'Verify that when 3 or more digits are entered in the search input, bid map records are displayed in the popup, showing matching keywords within the categories of Enum .[Column Header E';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let bidmapPage: BidmapPage;
  let bidMapsPage: BidMapsPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let enumPage: EnumPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let p1MoreButtonPage: P1MoreButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactivePage: StatusInactivePage;
  let REG_TS31_TC02_3_4testFailed=false;

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    await runPrereq_1056(page, vars);
    bidmapPage = new BidmapPage(page);
    bidMapsPage = new BidMapsPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    enumPage = new EnumPage(page);
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
        vars['UniqueColHeader/Enum'] = profile.data[0]['UniqueColHeader/Enum'];
        vars['Unidentified fields Message'] = profile.data[0]['Unidentified fields Message'];
        log.info('UniqueColHeader/Enum: ' + vars['UniqueColHeader/Enum']);
        log.info('Unidentified fields Message: ' + vars['Unidentified fields Message']);
      }

      log.step('Clear current search and search for Bid Map using unique column header enum value');
      try {
        await correspondentPortalPage.Cross_button_in_Bid_Map.click();
        await statusInactive2Page.SearchFilter_Fields.click();
        await statusInactive2Page.SearchFilter_Fields.type(vars['UniqueColHeader/Enum']);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Search cleared and Bid Map searched using unique column header enum value successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to clear search or search using unique column header enum value');
        throw e;
      }

      log.step('Verify enum search result popup shows correct enum and text');
      try {
        await expect(correspondentPortalPage.Enum).toBeVisible();
        await expect(enumPage.enum_Header_Rule).toContainText('enum:');
        await expect(bidMapsPage.Enum_SearchFIlter_Text).toContainText(vars['UniqueColHeader/Enum']);
        log.stepPass('Enum search result popup verified with correct enum and text successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify enum search result popup');
        throw e;
      }

      log.step('Show all enum results and navigate to Bid Map Header Mapping');
      try {
        await correspondentPortalPage.Enum.hover();
        await correspondentPortalPage.Show_All_Enum_SearchField.click();
        await statusInactivePage.BidMap_list_Screen.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await mapHeadersButtonPage.Map_Headers_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars['UniqueBidMapName']).first()).toBeVisible();
        log.info('UniqueBidMapName: ' + vars['UniqueBidMapName']);
        log.stepPass('All enum results shown and navigated to Bid Map Header Mapping successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to show all enum results or navigate to Bid Map Header Mapping');
        throw e;
      }

      log.step('Navigate to Enumeration Mapping and verify unique enum value');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(page.getByText(vars['Unidentified fields Message'])).toBeVisible();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars['UniqueColHeader/Enum'], { exact: true }).last()).toBeVisible();
        log.stepPass('Navigated to Enumeration Mapping and unique enum value verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Enumeration Mapping or verify unique enum value');
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
        await chaseFieldNamePage.Select_all_for_Checkbox.click();
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
      REG_TS31_TC02_3_4testFailed=true;
      log.tcEnd('FAIL');
      throw e;
    }
  });
   test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, REG_TS31_TC02_3_4testFailed);
    if (REG_TS31_TC02_3_4testFailed) {
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