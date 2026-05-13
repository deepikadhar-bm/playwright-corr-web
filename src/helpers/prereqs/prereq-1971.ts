import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidmapPage } from '../../pages/correspondant/bidmap';
import { BidMapsPage } from '../../pages/correspondant/bid-maps';
import { ChaseFieldNamePage } from '../../pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../pages/correspondant/enumeration-mapping-button';
import { EnumPage } from '../../pages/correspondant/enum';
import { MapHeadersButtonPage } from '../../pages/correspondant/map-headers-button';
import { P1MoreButtonPage } from '../../pages/correspondant/p-1-more-button';
import { RulesAndActionsButtonPage } from '../../pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { StatusInactive2Page } from '../../pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../pages/correspondant/status-inactive-';
import { runPrereq_1056 } from './prereq-1056';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'PREREQ_1971(REG_TS31_TC02.4)';
const TC_TITLE = 'Verify that when 3 or more digits are entered in the search input, bid map records are displayed in the popup, showing matching keywords within the categories of Enum .[Column Header E';

export async function runPrereq_1971(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1056(page, vars);

  const bidmapPage = new BidmapPage(page);
  const bidMapsPage = new BidMapsPage(page);
  const chaseFieldNamePage = new ChaseFieldNamePage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
  const enumPage = new EnumPage(page);
  const mapHeadersButtonPage = new MapHeadersButtonPage(page);
  const p1MoreButtonPage = new P1MoreButtonPage(page);
  const rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
  const saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactive2Page = new StatusInactive2Page(page);
  const statusInactivePage = new StatusInactivePage(page);
  let REG_TS31_TC02_4_testFailed=false;

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

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
    REG_TS31_TC02_4_testFailed=true;
    log.tcEnd('FAIL');
    throw e;
  }
   finally {
    log.afterTestSteps(TC_ID, REG_TS31_TC02_4_testFailed);
    if (REG_TS31_TC02_4_testFailed) {
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