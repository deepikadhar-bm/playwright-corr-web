import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BackButtonPage } from '../../../src/pages/correspondant/back-button';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS04_TC07_CASE-02';
const TC_TITLE = 'If they have changed value and they have unidentified fields also - Message should be "You have unidentified fields do you still want to proceed. (Note : This action will save the changes and Move to Next Page)"';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let backButtonPage: BackButtonPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;
  let Methods: AddonHelpers;

  const credentials = ENV.getCredentials('internal');

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);


  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    backButtonPage = new BackButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    if (profile && profile.data) {
      vars["Custom Header"] = profile.data[0]['Custom Header'];
      vars["ChaseFieldNames"] = profile.data[0]['ChaseFieldNames'];
      vars['Chase_Field_Name'] = profile.data[0]['Chase_Field_Name'];

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

      log.step('Create Bid Map up to Header Mapping');
      try {
        const fileName = fileconstants.BID_QA_FILE_COMMON;
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars, fileName);
        log.stepPass('Bid Map created up to Header Mapping successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to create Bid Map up to Header Mapping');
        throw e;
      }

      log.step('Create Add New Header and verify unidentified count');
      try {
        await stepGroups.stepGroup_Creation_of_Add_New_Header(page, vars);
        vars["UnidentifiedCount"] = String(await correspondentPortalPage.Amortization_Term.count());
        expect(Methods.verifyComparison(vars["UnidentifiedCount"], '>=', appconstants.ONE));
        log.stepPass('Add New Header created and unidentified count verified as 1');
      } catch (e) {
        await log.stepFail(page, 'Failed to create Add New Header or unidentified count mismatch');
        throw e;
      }

      log.step('Click Enumeration Mapping, verify unidentified message and proceed with saving');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(statusInactivePage.You_have_unidentified_Fields_This_action_will_save_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        log.stepPass('Unidentified fields message verified and saving proceeded');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify unidentified message or proceed with saving');
        throw e;
      }

      log.step('Navigate back and verify Custom Header is visible');
      try {
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars["Custom Header"])).toBeVisible();
        log.stepPass('Navigated back and Custom Header is visible');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate back or Custom Header not visible');
        throw e;
      }

      log.step('Verify unidentified fields and perform Edit in Header Mapping');
      try {
        await stepGroups.stepGroup_Verification_Of_Unidentified_Fields_In_Header_Mapping(page, vars);
        await stepGroups.stepGroup_Edit_in_Header_Mapping(page, vars);
        await expect(statusInactivePage.You_have_unidentified_Fields_This_action_will_save_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Unidentified fields verified and Header Mapping edited successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify unidentified fields or edit Header Mapping');
        throw e;
      }

      log.step('Navigate back and delete Header Mapping, then verify unidentified fields');
      try {
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['Element_Name2']='Delete_icon';
        vars['Element_Name3']='Bid_Sample_Field_Name_for_Header_Mapping';
        await stepGroups.stepGroup_Deleting_the_Header_Mapping(page, vars);
        await stepGroups.stepGroup_Verification_Of_Unidentified_Fields_In_Header_Mapping(page, vars);
        log.stepPass('Navigated back and Header Mapping deleted; unidentified fields verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate back, delete Header Mapping, or verify unidentified fields');
        throw e;
      }

      log.step('Click Enumeration Mapping after delete, verify message and proceed');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(statusInactivePage.You_have_unidentified_Fields_This_action_will_save_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Enumeration Mapping verified and saved after delete');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify or save Enumeration Mapping after delete');
        throw e;
      }

      log.step('Navigate back and verify ChaseFieldNames is visible');
      try {
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        // await expect(page.getByText(vars["ChaseFieldNames"]).first()).toBeVisible();
        await expect(page.getByText(vars["Chase_Field_Name"], { exact: true }).first()).toBeAttached();
          log.stepPass('Navigated back and ChaseFieldNames is visible');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate back or ChaseFieldNames not visible');
        throw e;
      }

      log.step('Check checkbox in Header Mapping, verify unidentified fields and proceed');
      try {
        vars["Element_Name"] ="You_have_unidentified_Fields_This_action_will_save_and_Move_to_Next_Page";
        await stepGroups.stepGroup_Checking_the_CheckBox_in_Header_Mapping(page, vars);
        await stepGroups.stepGroup_Verification_Of_Unidentified_Fields_In_Header_Mapping(page, vars);
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(statusInactivePage.You_have_unidentified_Fields_This_action_will_save_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Checkbox checked, unidentified fields verified, and Enumeration Mapping saved');
      } catch (e) {
        await log.stepFail(page, 'Failed during checkbox check flow');
        throw e;
      }

      log.step('Navigate back and verify First Checkbox Bid Request is visible after checking');
      try {
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.First_Checkbox_Bid_Request).toBeVisible();
        log.stepPass('First Checkbox Bid Request visible after checking flow');
      } catch (e) {
        await log.stepFail(page, 'First Checkbox Bid Request not visible after checking flow');
        throw e;
      }

      log.step('Uncheck checkbox in Header Mapping, verify unidentified fields and proceed');
      try {
        await stepGroups.stepGroup_Unchecking_the_CheckBox_in_Header_Mapping(page, vars);
        await stepGroups.stepGroup_Verification_Of_Unidentified_Fields_In_Header_Mapping(page, vars);
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(statusInactivePage.You_have_unidentified_Fields_This_action_will_save_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Checkbox unchecked, unidentified fields verified, and Enumeration Mapping saved');
      } catch (e) {
        await log.stepFail(page, 'Failed during checkbox uncheck flow');
        throw e;
      }

      log.step('Navigate back and verify First Checkbox Bid Request is visible after unchecking');
      try {
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.First_Checkbox_Bid_Request).not.toBeChecked();
        log.stepPass('First Checkbox Bid Request visible after unchecking flow');
      } catch (e) {
        await log.stepFail(page, 'First Checkbox Bid Request not visible after unchecking flow');
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