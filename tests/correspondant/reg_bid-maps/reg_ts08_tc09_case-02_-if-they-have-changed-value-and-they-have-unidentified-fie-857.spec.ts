import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ActionruleheaderPage } from '../../../src/pages/correspondant/actionruleheader';
import { BackButtonPage } from '../../../src/pages/correspondant/back-button';
import { CorrespondentPortal18Page } from '../../../src/pages/correspondant/correspondent-portal-18';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { EnumerationMappingPage } from '../../../src/pages/correspondant/enumeration-mapping';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';


const TC_ID = 'REG_TS08_TC09_CASE-02';
const TC_TITLE = 'If they have changed value and they have unidentified fields also — message should be "You have unidentified fields do you still want to proceed."';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let actionruleheaderPage: ActionruleheaderPage;
  let backButtonPage: BackButtonPage;
  let correspondentPortal18Page: CorrespondentPortal18Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let enumerationMappingPage: EnumerationMappingPage;
  let headerMappingPage: HeaderMappingPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  const credentials = ENV.getCredentials('internal');

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    actionruleheaderPage = new ActionruleheaderPage(page);
    backButtonPage = new BackButtonPage(page);
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    enumerationMappingPage = new EnumerationMappingPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    if (profile && profile.data) {
      vars["Unidentified Fields Error Message"] = profile.data[0]['Unidentified Fields Error Message'];
      vars["Unidentified fields Message"] = profile.data[0]['Unidentified fields Message'];
      vars["Rule Name"] = profile.data[0]['Rule Name'];
      vars["Condition Bid Field"] = profile.data[0]['Condition Bid Field'];
      vars["Operation1"] = profile.data[0]['Operation1'];
      vars["Operation2"] = profile.data[0]['Operation2'];
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

      log.step('Navigate to Enumeration Mapping and proceed past unidentified fields');
      try {
        await page.waitForTimeout(3000);
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
        await correspondentPortal18Page.Yes_Proceed_Button.click();
        log.stepPass('Navigated to Enumeration Mapping and proceeded past unidentified fields dialog');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Enumeration Mapping or proceed past unidentified fields');
        throw e;
      }

      log.step('Add field in Enumeration Mapping and verify unidentified fields message on navigation');
      try {
        await stepGroups.stepGroup_Add_Field_in_Enumeration_Mapping(page, vars);
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars["Unidentified Fields Error Message"])).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars["BidTapeValue"])).toBeVisible();
        log.stepPass('Field added and unidentified fields message verified after Add. BidTapeValue: ' + vars["BidTapeValue"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to add field or verify unidentified fields message after Add');
        throw e;
      }

      log.step('Edit field in Enumeration Mapping and verify unidentified fields message on navigation');
      try {
        await stepGroups.stepGroup_Edition_In_Enumeration_Mapping(page, vars);
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars["Unidentified Fields Error Message"])).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Chase_Values_Dropdown.locator('option:checked')).toHaveText(vars["EditedChaseValue[Enumeration Mapping]"]);
        log.stepPass('Field edited and unidentified fields message verified after Edit. EditedChaseValue: ' + vars["EditedChaseValue[Enumeration Mapping]"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to edit field or verify unidentified fields message after Edit');
        throw e;
      }

      log.step('Delete field in Enumeration Mapping and verify unidentified fields message on navigation');
      try {
        await stepGroups.stepGroup_Delete_In_Enumeration_Mapping(page, vars);
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await expect(page.getByText(vars["Unidentified Fields Error Message"])).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(enumerationMappingPage.get_Deleted_Field_In_Enumeration(vars['BidTapeValueforBeforeDeleted'])).not.toBeVisible();
        log.stepPass('Field deleted and unidentified fields message verified after Delete. BidTapeValueforBeforeDeleted: ' + vars["BidTapeValueforBeforeDeleted"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to delete field or verify unidentified fields message after Delete');
        throw e;
      }

      log.step('Check headers and verify unidentified fields message when navigating to Rules and Actions');
      try {
        await correspondentPortalPage.Enable_or_disable_field_Amortization_Type_Checkbox.check();
        await actionruleheaderPage.Second_Header_Checkbox.check();
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await expect(page.getByText(vars["Unidentified Fields Error Message"])).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Checked headers and unidentified fields message verified on Rules and Actions navigation (checked state)');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify unidentified fields message with checked headers');
        throw e;
      }

      log.step('Uncheck headers and verify unidentified fields message when navigating to Rules and Actions');
      try {
        await headerMappingPage.First_Header_Checkbox.uncheck();
        await actionruleheaderPage.Second_Header_Checkbox.uncheck();
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await expect(page.getByText(vars["Unidentified Fields Error Message"])).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Unchecked headers and unidentified fields message verified on Rules and Actions navigation (unchecked state)');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify unidentified fields message with unchecked headers');
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