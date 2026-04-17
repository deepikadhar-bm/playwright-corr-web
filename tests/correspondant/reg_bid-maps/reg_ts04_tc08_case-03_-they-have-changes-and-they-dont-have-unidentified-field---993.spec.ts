import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyButtonForFilters2Page } from '../../../src/pages/correspondant/apply-button-for-filters-2';
import { BackButtonPage } from '../../../src/pages/correspondant/back-button';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { P1morePage } from '../../../src/pages/correspondant/p-1more';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ThisActionWillSaveTheChangesAndMoveToNextPagePage } from '../../../src/pages/correspondant/this-action-will-save-the-changes-and-move-to-next-page';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';


const TC_ID = 'REG_TS04_TC08_CASE-03';
const TC_TITLE = 'They have changes and they don\'t have unidentified field - Message should be "Note : This action will save the changes and Move to Next Page".';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let applyButtonForFilters2Page: ApplyButtonForFilters2Page;
  let backButtonPage: BackButtonPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let p1morePage: P1morePage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let spinnerPage: SpinnerPage;
  let thisActionWillSaveTheChangesAndMoveToNextPagePage: ThisActionWillSaveTheChangesAndMoveToNextPagePage;

  const credentials = ENV.getCredentials('internal');

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    applyButtonForFilters2Page = new ApplyButtonForFilters2Page(page);
    backButtonPage = new BackButtonPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    p1morePage = new P1morePage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    thisActionWillSaveTheChangesAndMoveToNextPagePage = new ThisActionWillSaveTheChangesAndMoveToNextPagePage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    if (profile && profile.data) {
      vars["Custom Header"] = profile.data[0]['Custom Header'];
      vars["ChaseFieldNames"]=profile.data[0]['ChaseFieldNames'];
      vars["Chase Field Name"]=profile.data[0]['Chase Field Name'];
    }

    try {

      log.step('Login to CORR Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to CORR Portal successful');
      } catch (e) {
        await log.stepFail(page, 'Login to CORR Portal failed');
        throw e;
      }

      log.step('Enable Smart Mapper and create Bid Map up to Header Mapping');
      try {
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        const fileName = fileconstants.BID_QA_FILE_COMMON;
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars, fileName);
        log.stepPass('Smart Mapper enabled and Bid Map created up to Header Mapping successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to enable Smart Mapper or create Bid Map up to Header Mapping');
        throw e;
      }

      log.step('Delete unmapped fields and create a new header in Header Mapping');
      try {
        await stepGroups.stepGroup_Deleting_the_UnMapped_fields_in_Header_Mapping(page, vars);
        await stepGroups.stepGroup_Create_New_Header_In_Header_Mapping(page, vars);
        log.stepPass('Unmapped fields deleted and new header created successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to delete unmapped fields or create new header');
        throw e;
      }

      log.step('Click Enumeration Mapping, verify save message and proceed');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(thisActionWillSaveTheChangesAndMoveToNextPagePage.This_action_will_save_the_changes_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(p1morePage.Custom_Header_In_Enumeration_Mapping).toContainText(vars["Custom Header"]);
        log.stepPass('Save message verified and Custom Header visible in Enumeration Mapping');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify save message or Custom Header in Enumeration Mapping');
        throw e;
      }

      log.step('Navigate back and edit Header Mapping, then verify save message and proceed');
      try {
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Edit_in_Header_Mapping(page, vars);
        await expect(applyButtonForFilters2Page.This_action_will_save_the_changes_and_Move_to_Next_Page_Success_Message).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Header Mapping edited and save message verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to edit Header Mapping or verify save message');
        throw e;
      }

      log.step('Navigate back and delete Header Mapping, then verify deletion via Enumeration Mapping');
      try {
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['Element_Name2']='Delete_icon_Header_Mapping';
        vars['Element_Name3']='Bid_Sample_Field_Name_For_Header_Mapping';
        await stepGroups.stepGroup_Deleting_the_Header_Mapping(page, vars);
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(thisActionWillSaveTheChangesAndMoveToNextPagePage.This_action_will_save_the_changes_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars["DeleteHeaderMapping"])).not.toBeVisible();
        log.stepPass('Header Mapping deleted and deletion verified in Enumeration Mapping');
      } catch (e) {
        await log.stepFail(page, 'Failed to delete Header Mapping or verify deletion');
        throw e;
      }

      log.step('Navigate back and check checkbox in Header Mapping, then verify save message and proceed');
      try {
        vars["Element_Name"]='This_action_will_save_the_changes_and_Move_to_Next_Page';
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Checking_the_CheckBox_in_Header_Mapping(page, vars);
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(thisActionWillSaveTheChangesAndMoveToNextPagePage.This_action_will_save_the_changes_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Checkbox checked and save message verified in Enumeration Mapping');
      } catch (e) {
        await log.stepFail(page, 'Failed during checkbox check flow');
        throw e;
      }

      log.step('Navigate back and uncheck checkbox in Header Mapping, then verify save message and proceed');
      try {
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Unchecking_the_CheckBox_in_Header_Mapping(page, vars);
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(thisActionWillSaveTheChangesAndMoveToNextPagePage.This_action_will_save_the_changes_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Checkbox unchecked and save message verified in Enumeration Mapping');
      } catch (e) {
        await log.stepFail(page, 'Failed during checkbox uncheck flow');
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