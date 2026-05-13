import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { CorrespondentPortal18Page } from '../../pages/correspondant/correspondent-portal-18';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../pages/correspondant/enumeration-mapping-button';
import { HeaderMappingPage } from '../../pages/correspondant/header-mapping';
import { ProceedWithSavingButtonPage } from '../../pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'PREREQ_1371(REG_TS31_TC02)';
const TC_TITLE = 'Verify that when 3 or more digits are entered in the search input, bid map records are displayed in the popup, showing matching keywords within the categories of bid map name, column hea';

export async function runPrereq_1371(page: Page, vars: Record<string, string>): Promise<void> {
  const correspondentPortal18Page = new CorrespondentPortal18Page(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
  const headerMappingPage = new HeaderMappingPage(page);
  const proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
  const rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
  const saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
  const spinnerPage = new SpinnerPage(page);
  let REG_TS31_TC02_testFailed = false;

  const credentials = ENV.getCredentials('internal');
  vars['Username'] = credentials.username;
  vars['Password'] = credentials.password;

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

  log.tcStart(TC_ID, TC_TITLE);

  try {
    if (profile && profile.data) {
      vars['UniqueColumnHeaderSearch'] = profile.data[0]['UniqueColumnHeaderSearch'];
      vars["CustomHeader"] = profile.data[0]['UniqueColHeader/Enum'];
      vars["ChaseFieldNames"] = profile.data[0]['Chase_Field_Name'];
      vars["Rule Name"] = profile.data[0]['UniqueRuleNameSearch'];
      vars["BidField"] = profile.data[0]['UniqueWhenBidFieldSearch'];
      vars["Operation1"] = profile.data[0]['Operation1'];
      vars["BidEnumeratedTapeValue"] = profile.data[0]['UniqueBidEnumTapeSearch'];
      vars['Companyname'] = profile.data[0]['UniqueBidEnumTapeSearch'];
      vars["Companyname"] = profile.data[0]["CompanyName1"];
      vars['UniqueChaseValueSearch'] = profile.data[0]["UniqueChaseValueSearch"];
    }

    log.step('Login to CORR Portal and enable Smart Mapper');
    try {
      await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
      await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
      log.stepPass('Login to CORR Portal and Smart Mapper enabled successfully');
    } catch (e) {
      await log.stepFail(page, 'Login to CORR Portal or enabling Smart Mapper failed');
      throw e;
    }

    log.step('Create new Bid Map');
    try {
      await stepGroups.stepGroup_Create_NewMap(page, vars);
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('New Bid Map created successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to create new Bid Map');
      throw e;
    }

    log.step('Add new header and edit column header with unique search value');
    try {
      await stepGroups.stepGroup_Add_New_Header(page, vars);
      await headerMappingPage.Required_Edit_Header_Button_Not_an_Enum.first().click();
      await expect(correspondentPortalPage.Update_Header).toBeVisible();
      await headerMappingPage.Custom_Header_On_Pop_Up.click();
      await headerMappingPage.Custom_Header_On_Pop_Up.clear();
      await headerMappingPage.Custom_Header_On_Pop_Up.type(vars['UniqueColumnHeaderSearch']);
      await headerMappingPage.Update_Header_Button_Bid_maps_popup.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('New header added and column header updated with unique search value successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to add new header or update column header');
      throw e;
    }

    log.step('Navigate to Enumeration Mapping and proceed');
    try {
      await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
      await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Navigated to Enumeration Mapping and proceeded successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to navigate to Enumeration Mapping or proceed');
      throw e;
    }

    log.step('Navigate to Rules and Actions and proceed with unidentified fields');
    try {
      await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
      await correspondentPortal18Page.Yes_Proceed_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Navigated to Rules and Actions and proceeded with unidentified fields successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to navigate to Rules and Actions or proceed with unidentified fields');
      throw e;
    }

    log.step('Add rules and actions and save and publish Bid Map');
    try {
      await stepGroups.stepGroup_Add_Rule_For_Add_Condition_In_Rules_and_Actions(page, vars);
      await stepGroups.stepGroup_Add_Actions_In_Rules_and_Actions(page, vars);
      await saveAndPublishButtonPage.Save_and_Publish_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Rules and actions added and Bid Map saved and published successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to add rules and actions or save and publish Bid Map');
      throw e;
    }

    log.tcEnd('PASS');

  } catch (e) {
    await log.captureOnFailure(page, TC_ID, e);
    REG_TS31_TC02_testFailed = true;
    log.tcEnd('FAIL');
    throw e;
  }
  finally {
    log.afterTestSteps(TC_ID, REG_TS31_TC02_testFailed);
    if (REG_TS31_TC02_testFailed) {
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