import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { ContinueEditingButtonPage } from '../../../src/pages/correspondant/continue-editing-button';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { EnumerationMappingPage } from '../../../src/pages/correspondant/enumeration-mapping';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { MapHeaderPage } from '../../../src/pages/correspondant/map-header';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { NewMapPage } from '../../../src/pages/correspondant/new-map';
import { P15Active2Page } from '../../../src/pages/correspondant/p-15-active-2';
import { P1MoreButtonPage } from '../../../src/pages/correspondant/p-1-more-button';
import { P2142530YrFreddieMacFixedDropdownPage } from '../../../src/pages/correspondant/p-2142530-yr-freddie-mac-fixed-dropdown';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { runPrereq_814 } from '../../../src/helpers/prereqs/prereq-814';
import { Logger as log } from '@helpers/log-helper';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS26_TC02';
const TC_TITLE = 'Verify that if there are multiple versions in a bid, then user should be able to restore the required active map version.';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let chaseFieldNamePage: ChaseFieldNamePage;
  let continueEditingButtonPage: ContinueEditingButtonPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let enumerationMappingPage: EnumerationMappingPage;
  let headerMappingPage: HeaderMappingPage;
  let mapHeaderPage: MapHeaderPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let newMapPage: NewMapPage;
  let p15Active2Page: P15Active2Page;
  let p1MoreButtonPage: P1MoreButtonPage;
  let p2142530YrFreddieMacFixedDropdownPage: P2142530YrFreddieMacFixedDropdownPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactivePage: StatusInactivePage;
  let Methods: AddonHelpers;

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_814(page, vars);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    continueEditingButtonPage = new ContinueEditingButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    enumerationMappingPage = new EnumerationMappingPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    mapHeaderPage = new MapHeaderPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    newMapPage = new NewMapPage(page);
    p15Active2Page = new P15Active2Page(page);
    p1MoreButtonPage = new P1MoreButtonPage(page);
    p2142530YrFreddieMacFixedDropdownPage = new P2142530YrFreddieMacFixedDropdownPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactivePage = new StatusInactivePage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      if (profile && profile.data) {
        vars['Unidentified Fields Error Message'] = profile.data[0]['Unidentified Fields Error Message'];

      }

      log.step('Handle Continue Editing dialog and verify version and map name');
      try {
        if (await continueEditingButtonPage.Continue_Editing_Button.isVisible()) {
          await continueEditingButtonPage.Continue_Editing_Button.click();
        }
        await correspondentPortalPage.Version.waitFor({ state: 'visible' });
        vars['Version'] = await correspondentPortalPage.Version.textContent() || '';
        Methods.trimtestdata(vars['Version'], 'Version');
        log.info('Version: ' + vars['Version']);
        await expect(page.getByText(vars['Version']).first()).toBeVisible();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars['Create New Map'])).toBeVisible();
        log.stepPass('Continue Editing handled and version and map name verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to handle Continue Editing dialog or verify version');
        throw e;
      }

      log.step('Open Download Map dropdown and capture active version and created on details');
      try {
        await statusInactive2Page.Download_Map_Button.evaluate((el: HTMLElement) => el.click());
        await expect(page.getByText(vars['Version']).first()).toBeVisible();
        await statusInactive2Page.Download_Map.hover();
        vars['DownloadMapName'] = await statusInactive2Page.Download_Map.textContent() || '';
        log.info('DownloadMapName: ' + vars['DownloadMapName']);
        await expect(page.getByText(vars['DownloadMapName'])).toBeVisible();
        vars['ActiveVersion'] = await p2142530YrFreddieMacFixedDropdownPage.Version_Number.textContent() || '';
        Methods.trimtestdata(vars['ActiveVersion'], 'ActiveVersion');
        log.info('ActiveVersion: ' + vars['ActiveVersion']);
        await expect(page.getByText(vars['ActiveVersion'])).toBeVisible();
        vars['CreatedOn'] = await statusInactive2Page.Cretaed_On.textContent() || '';
        Methods.trimtestdata(vars['CreatedOn'], 'CreatedOn');
        log.info('CreatedOn: ' + vars['CreatedOn']);
        await expect(correspondentPortalPage.Restore_this_version_Button).toBeVisible();
        await expect(page.getByText(vars['CreatedOn'])).toBeVisible();
        log.stepPass('Download Map dropdown opened and active version details captured successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to open Download Map dropdown or capture version details');
        throw e;
      }

      log.step('Restore version and verify version number');
      try {
        await correspondentPortalPage.Restore_this_version_Button.click();
        vars['VersionNumber'] = await p2142530YrFreddieMacFixedDropdownPage.Version_Number.textContent() || '';
        Methods.trimtestdata(vars['VersionNumber'], 'VersionNumber');
        log.info('VersionNumber after restore: ' + vars['VersionNumber']);
        await expect(page.getByText(vars['VersionNumber'])).toBeVisible();
        await chaseFieldNamePage.Ok_Button_Bid_Request.click();
        await expect(page.getByText(vars['Version']).first()).toBeVisible();
        log.stepPass('Version restored and version number verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to restore version or verify version number');
        throw e;
      }

      log.step('Navigate to Bid Map list screen and verify map details');
      try {
        await statusInactive2Page.Bid_Map_In_List_Screen(vars['CreateNewMap']).click();
        await expect(newMapPage.Individual_Selected_Company).toContainText(vars['SelectedCompanyName']);
        log.info('SelectedCompanyName: ' + vars['SelectedCompanyName']);
        await expect(page.getByText(vars['Create New Map'])).toBeVisible();
        await expect(p1MoreButtonPage.Uploaded_FileName).toContainText(vars['UploadedFileName']);
        log.info('UploadedFileName: ' + vars['UploadedFileName']);
        await expect(mapHeaderPage.Execution_Type_Dropdown_New).toHaveValue(vars['ExecutionType']);
        log.info('ExecutionType: ' + vars['ExecutionType']);
        await expect(mapHeaderPage.Execution_Type_Dropdown_New).not.toHaveValue(vars['ExecutionVersion2']);
        log.info('ExecutionVersion2: ' + vars['ExecutionVersion2']);
        log.stepPass('Bid Map list screen navigated and map details verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bid Map list screen or verify map details');
        throw e;
      }

      log.step('Navigate to Header Mapping and verify restored header values');
      try {
        await mapHeadersButtonPage.Map_Headers_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(headerMappingPage.Custom_Header).not.toBeVisible();
        vars['EditedChaseFieldNameVersion3'] = await headerMappingPage.get_Updated_Element_In_Header_Mapping(vars['UpdatedBidSampleNameHeaderMapping']).getAttribute('title') || '';
        log.info('EditedChaseFieldNameVersion3: ' + vars['EditedChaseFieldNameVersion3']);
        log.info('EditedChaseFieldNameVersion2: ' + vars['EditedChaseFieldNameVersion2']);
        expect(Methods.verifyString(vars['EditedChaseFieldNameVersion3'], 'notEquals', vars['EditedChaseFieldNameVersion2']));
        await expect((headerMappingPage.get_Deleted_Header_In_HeaderMaping(vars['DeletedHeaderHeaderMapping']))).toBeVisible();
        await expect(chaseFieldNamePage.get_Header_2(vars['SecondHeaderName'])).not.toBeChecked();
        await stepGroups.stepGroup_Verification_Of_BidSampleNames_In_Header_Mapping_From_TDP(page, vars);
        log.stepPass('Header Mapping navigated and restored header values verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Header Mapping or verify restored header values');
        throw e;
      }

      log.step('Navigate to Enumeration Mapping and verify restored enum values');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(statusInactivePage.You_have_unidentified_Fields_This_action_will_save_and_Move_to_Next_Page).toBeVisible();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['Bid Tape Value for After Deleted'] = await p15Active2Page.Bid_Tape_Value.textContent() || '';
        log.info('BidTapeValueforBeforeDeleted: ' + vars['BidTapeValueforBeforeDeleted']);
        log.info('Bid Tape Value for After Deleted: ' + vars['Bid Tape Value for After Deleted']);
        expect(Methods.verifyString(vars['BidTapeValueforBeforeDeleted'], 'notEquals', vars['Bid Tape Value for After Deleted']));
        vars['ChaseValueRestored'] = await enumerationMappingPage.To_be_edited_Chase_Value_ListEnum(vars['ChaseFieldNameTobeEdited']).evaluate(el => {
          const s = el as HTMLSelectElement;
          return s.options[s.selectedIndex]?.text || '';
        });
        Methods.trimWhitespace(vars['ChaseValueRestored'], 'ChaseValueRestored');
        Methods.trimWhitespace(vars['EditedChaseValueVersion2'], 'EditedChaseValueVersion2');
        log.info('ChaseValueRestored: ' + vars['ChaseValueRestored']);
        log.info('EditedChaseValueVersion2: ' + vars['EditedChaseValueVersion2']);
        expect(Methods.verifyString(vars['ChaseValueRestored'], 'notEquals', vars['EditedChaseValueVersion2']));
        await expect(enumerationMappingPage.get_Deleted_Field_In_Enumeration(vars['BidTapeValueforBeforeDeleted'])).toBeVisible();
        log.info('Verifying the bidsample to bidtape mapping in Enumpage from tdp');
        await stepGroups.stepGroup_Verifying_the_bidsample_to_bidtape_mapping_in_Enumpage_from_(page, vars);
        log.info('Verifying the Mapping of ChaseField and ChaseValues in Enum');
        await stepGroups.stepGroup_Verifying_the_Mapping_of_ChaseField_and_ChaseValues_in_Enum_(page, vars);
        log.stepPass('Enumeration Mapping navigated and restored enum values verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Enumeration Mapping or verify restored enum values');
        throw e;
      }

      log.step('Navigate to Rules and Actions and verify restored rule values');
      try {
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await expect(page.getByText(vars['Unidentified Fields Error Message'])).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['EditedBidField[RulesAndActions]'] = vars["EditedRuleBidField[RulesAndActions]"];
        vars['EditedBidTape[RulesAndActions]'] = vars["EditedRuleBidTape[RulesAndActions]"];
        await expect(rulesAndActionsButtonPage.Condition_BidField_1).not.toHaveText(vars['EditedBidField[RulesAndActions]']);
        await expect(rulesAndActionsButtonPage.Condition_BidTape1).not.toHaveText(vars['EditedBidTape[RulesAndActions]']);
        vars['First Rule Name']=vars['Rule Name'];
        await expect(correspondentPortalPage.Enter_a_Rule_Name_Field).toHaveValue(vars['First Rule Name']);
        await expect(page.getByText(vars['SecondRuleName'])).not.toBeVisible();
        await expect(page.getByText(vars['ThirdRuleName'])).not.toBeVisible();
        log.info('First Rule Name: ' + vars['First Rule Name']);
        log.info('SecondRuleName: ' + vars['SecondRuleName']);
        log.info('ThirdRuleName: ' + vars['ThirdRuleName']);
        await stepGroups.stepGroup_Verification_of_Rules_and_Action_Values_Before_EditingActive(page, vars);
        log.stepPass('Rules and Actions navigated and restored rule values verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Rules and Actions or verify restored rule values');
        throw e;
      }

      log.step('Save and Publish restored version');
      try {
        await saveAndPublishButtonPage.Save_and_Publish_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Restored version saved and published successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to save and publish restored version');
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