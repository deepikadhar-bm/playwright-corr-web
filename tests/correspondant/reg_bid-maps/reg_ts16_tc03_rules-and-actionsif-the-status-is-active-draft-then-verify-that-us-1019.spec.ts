import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { DeleteDraftButtonPage } from '../../../src/pages/correspondant/delete-draft-button';
import { DeleteDraftPage } from '../../../src/pages/correspondant/delete-draft';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { HeaderamappingPage } from '../../../src/pages/correspondant/headeramapping';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { MapNameFieldInBidMapsPage } from '../../../src/pages/correspondant/map-name-field-in-bid-maps';
import { MapNamePage } from '../../../src/pages/correspondant/map-name';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { ViewActiveVersionButtonPage } from '../../../src/pages/correspondant/view-active-version-button';
import { EnumerationMappingPage } from '../../../src/pages/correspondant/enumeration-mapping';
import { ViewDraftButtonPage } from '../../../src/pages/correspondant/view-draft-button';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';
import { AddonHelpers } from '@helpers/AddonHelpers';


const TC_ID = 'REG_TS16_TC03';
const TC_TITLE = 'If the status is active draft, then verify that user should be able to switch the view between active draft and should be able to delete the draft version if not required.[Rules and Actions]';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let deleteDraftButtonPage: DeleteDraftButtonPage;
  let deleteDraftPage: DeleteDraftPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let headeramappingPage: HeaderamappingPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let mapNameFieldInBidMapsPage: MapNameFieldInBidMapsPage;
  let mapNamePage: MapNamePage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let viewActiveVersionButtonPage: ViewActiveVersionButtonPage;
  let viewDraftButtonPage: ViewDraftButtonPage;
  let Methods : AddonHelpers;
  let enumerationMappingPage:EnumerationMappingPage;

  const credentials = ENV.getCredentials('internal');

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    deleteDraftButtonPage = new DeleteDraftButtonPage(page);
    deleteDraftPage = new DeleteDraftPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    headeramappingPage = new HeaderamappingPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    mapNameFieldInBidMapsPage = new MapNameFieldInBidMapsPage(page);
    mapNamePage = new MapNamePage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    viewActiveVersionButtonPage = new ViewActiveVersionButtonPage(page);
    viewDraftButtonPage = new ViewDraftButtonPage(page);
    enumerationMappingPage=new EnumerationMappingPage(page);
    Methods = new AddonHelpers(page,vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    if (profile && profile.data) {
      vars["New Rule Name"] = profile.data[0]['New Rule Name'];
      vars["Duplicated Rule Name"] = profile.data[0]['Duplicated Rule Name'];
      vars["Rule Name"] = profile.data[0]['Rule Name'];
      vars["BidEnumeratedTapeValue"] = profile.data[0]['BidEnumeratedTapeValue'];
      vars["BidFields"] = profile.data[0]['BidFields'];
      vars["Bid Enumerated Tape Value"] = profile.data[0]['Bid Enumerated Tape Value'];
      vars["Condition Bid Field"] = profile.data[0]['Condition Bid Field'];
      vars["Operation1"] = profile.data[0]['Operation1'];
      vars["Operation2"] = profile.data[0]['Operation2'];
      vars["Operator 2 Symbol"]=profile.data[0]['Operator 2 Symbol'];
    }

    try {

      log.step('Login to CORR portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login successful');
      } catch (e) {
        await log.stepFail(page, 'Login failed');
        throw e;
      }

      log.step('Enable Smart Mapper and create Bid Map up to Header Mapping');
      try {
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        const fileName = fileconstants.BID_QA_FILE_COMMON;
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars, fileName);
        log.stepPass('Smart Mapper enabled and Bid Map created up to Header Mapping');
      } catch (e) {
        await log.stepFail(page, 'Failed to enable Smart Mapper or create Bid Map');
        throw e;
      }

      log.step('Navigate through Enumeration Mapping and Rules and Actions');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await correspondentPortalPage.Yes_Proceed_Button.waitFor({ state: 'visible' });
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Rules and Actions screen');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Rules and Actions screen');
        throw e;
      }

      log.step('Add Rules and Actions in Rules and Actions screen');
      try {
        await stepGroups.stepGroup_Adding_Rules_In_Rules_and_Actions_Screen(page, vars);
        await stepGroups.stepGroup_Add_Actions_in_Rules_and_Actions(page, vars);
        log.stepPass('Rules and Actions added successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to add Rules and Actions');
        throw e;
      }

      log.step('Duplicate rule and Save and Publish the Bid Map');
      try {
        await stepGroups.stepGroup_Duplicating_Rule_In_Enumeration_Mapping(page, vars);
        await saveAndPublishButtonPage.Save_and_Publish_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Rule duplicated and Bid Map saved and published successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to duplicate rule or Save and Publish the Bid Map');
        throw e;
      }

      log.step('Navigate back to Bid Map and proceed to Rules and Actions for editing');
      try {
        await mapNameFieldInBidMapsPage.get_Bid_Map_Name_Field_In_Row(vars['CreateNewMap']).click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await mapHeadersButtonPage.Map_Headers_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await correspondentPortalPage.Yes_Proceed_Button.waitFor({ state: 'visible' });
        await correspondentPortalPage.Yes_Proceed_Button.evaluate(el => (el as HTMLElement).click());
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await correspondentPortalPage.Yes_Proceed_Button.waitFor({ state: 'visible' });
        await correspondentPortalPage.Yes_Proceed_Button.evaluate(el => (el as HTMLElement).click());
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated back to Rules and Actions screen for editing');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate back to Rules and Actions screen');
        throw e;
      }

      log.step('Edit all fields in the rule and delete the duplicated rule');
      try {
        await stepGroups.stepGroup_Editing_All_Fields_In_a_Rule(page, vars);
        await stepGroups.stepGroup_Deleting_the_Rule_in_Rules_and_Actions_Page(page, vars);
        await expect(page.getByText(vars["Duplicated Rule Name"])).not.toBeVisible();
        log.stepPass('Rule edited and duplicated rule deleted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to edit rule or delete duplicated rule');
        throw e;
      }

      log.step('Duplicate rule again and save as draft');
      try {
        await stepGroups.stepGroup_Duplicating_Rule_In_Enumeration_Mapping(page, vars);
        await chaseFieldNamePage.Save_Draft.click();
        await viewActiveVersionButtonPage.View_Active_Version_Button.waitFor({ state: 'visible' });
        log.stepPass('Rule duplicated and saved as draft successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to duplicate rule or save as draft');
        throw e;
      }

      log.step('Switch to Active Version and verify changes are not reflected');
      try {
        await viewActiveVersionButtonPage.View_Active_Version_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(headeramappingPage.Disabled_Headers).toBeVisible();
        await stepGroups.stepGroup_Verifying_that_Changes_Are_Not_Updated_In_Active_VersionRule(page, vars);
        await stepGroups.stepGroup_Verification_of_Rules_and_Action_Values_Before_EditingActive(page, vars);
        log.stepPass('Active Version verified: draft changes are not reflected');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Active Version');
        throw e;
      }

      log.step('Verify Duplicated Rule Name in Active Version');
      try {
        await expect(statusInactive2Page.Rule_Name).toHaveValue(vars["Duplicated Rule Name"]);
        vars["Rulename"] = await statusInactive2Page.Rule_Name.inputValue() || '';
        expect(Methods.verifyString(vars["Rulename"],'notEquals',vars["New Rule Name"]));
        log.stepPass('Duplicated Rule Name verified in Active Version: ' + vars["Rulename"]);
      } catch (e) {
        await log.stepFail(page, 'Duplicated Rule Name verification failed in Active Version');
        throw e;
      }

      log.step('Switch to Draft View and verify draft controls are visible');
      try {
        await viewDraftButtonPage.View_Draft_Button.click();
        await expect(enumerationMappingPage.Disabled_Fields_Page).toBeHidden();
        await expect(viewActiveVersionButtonPage.View_Active_Version_Button).toBeVisible();
        await expect(deleteDraftButtonPage.Delete_Draft_Button).toBeVisible();
        log.stepPass('Draft View loaded: Active Version and Delete Draft buttons are visible');
      } catch (e) {
        await log.stepFail(page, 'Failed to switch to Draft View or verify draft controls');
        throw e;
      }

      log.step('Delete the draft version and verify redirect to active Bid Map');
      try {
        await deleteDraftButtonPage.Delete_Draft_Button.click();
        await expect(deleteDraftPage.Text_In_Delete_Draft).toBeVisible();
        await expect(deleteDraftPage.Yes_proceed_On_Delete_Draft).toBeVisible();
        await deleteDraftPage.Yes_proceed_On_Delete_Draft.click();
        await expect(mapNamePage.get_Active_Map_Name(vars['CreateNewMap'])).toContainText("ACTIVE");
        log.stepPass('Draft deleted and Bid Map is now ACTIVE');
      } catch (e) {
        await log.stepFail(page, 'Failed to delete draft or verify ACTIVE status');
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