import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { HeadingSelectRulesPage } from '../../../src/pages/correspondant/heading-select-rules';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';


const TC_ID = 'REG_TS15_TC01';
const TC_TITLE = 'Verify that when a user performs Save and Publish then a new active version should be created.';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let headingSelectRulesPage: HeadingSelectRulesPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let spinnerPage: SpinnerPage;

  const credentials = ENV.getCredentials('internal');

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    headingSelectRulesPage = new HeadingSelectRulesPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    if (profile && profile.data) {
      vars["ChaseFieldNames"] = profile.data[0]['ChaseFieldNames'];
      vars["Search Map Input"] = profile.data[0]['Search Map Input'];
      vars["Rule Name"] = profile.data[0]['Rule Name'];
      vars["New Rule Name"] = profile.data[0]['New Rule Name'];
      vars["Duplicated Rule Name"] = profile.data[0]['Duplicated Rule Name'];
      vars["Condition Bid Field"] = profile.data[0]['Condition Bid Field'];
      vars["Operation1"] = profile.data[0]['Operation1'];
      vars["Operation2"] = profile.data[0]['Operation2'];
      vars['ChaseFieldNames']=profile.data[0]['ChaseFieldNames'];
      vars["Search Map Input"]=profile.data[0]['Search Map Input'];
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

      log.step('Create Bid Map up to Header Mapping');
      try {
        const fileName = fileconstants.BID_QA_FILE_COMMON;
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars, fileName);
        log.stepPass('Bid Map created up to Header Mapping');
      } catch (e) {
        await log.stepFail(page, 'Failed to create Bid Map up to Header Mapping');
        throw e;
      }

      log.step('Edit header mapping and navigate to Enumeration Mapping');
      try {
        await expect(enumerationMappingButtonPage.Enumeration_Mapping_Button).toBeEnabled();
        await correspondentPortalPage.Edit_icon_in_Header_Mapping.click();
        await expect(correspondentPortalPage.Update_Header).toBeVisible();
        await correspondentPortalPage.Chase_Field_Name.selectOption({ label: vars["ChaseFieldNames"] });
        await correspondentPortalPage.Update_Header_Button.click();
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Heading_Save_and_Move_to_Next_Page1.waitFor({ state: 'visible' });
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Header edited and navigated to Enumeration Mapping');
      } catch (e) {
        await log.stepFail(page, 'Failed to edit header or navigate to Enumeration Mapping');
        throw e;
      }

      log.step('Delete enumeration pair and navigate to Rules and Actions');
      try {
        await expect(rulesAndActionsButtonPage.Rules_and_Actions_Button).toBeEnabled();
        await correspondentPortalPage.Delete_icon_in_Enumeration_Mappings.click();
        await expect(correspondentPortalPage.Delete_Enumeration_Pair).toBeVisible();
        await correspondentPortalPage.Yes_Go_ahead_Button.click();
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await expect(correspondentPortalPage.Heading_Save_and_Move_to_Next_Page1).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Enumeration pair deleted and navigated to Rules and Actions');
      } catch (e) {
        await log.stepFail(page, 'Failed to delete enumeration pair or navigate to Rules and Actions');
        throw e;
      }

      log.step('Import rule and Save and Publish the Bid Map');
      try {
        await expect(saveAndPublishButtonPage.Save_and_Publish_Button).toBeEnabled();
        await correspondentPortalPage.Import_Rule_Button.click();
        await expect(headingSelectRulesPage.Select_Rules).toBeVisible();
        await correspondentPortalPage.Search_Map_Input.type(vars["Search Map Input"]);
        await correspondentPortalPage.Search_Map_Input_Dropdown.click();
        await correspondentPortalPage.Import_Rule_Checkbox.check();
        await correspondentPortalPage.Apply_Selected_Button_in_Import_Rule.click();
        await page.waitForTimeout(3000);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await saveAndPublishButtonPage.Save_and_Publish_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Rule imported and Bid Map saved and published successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to import rule or Save and Publish the Bid Map');
        throw e;
      }

      log.step('Verify new active version is created');
      try {
        await expect(correspondentPortalPage.Status).toContainText("ACTIVE");
        vars["Version"] = await correspondentPortalPage.Version.textContent() || '';
        await expect(page.getByText(vars["Version"]).first()).toBeVisible();
        await expect(page.getByText(vars["CreateNewMap"])).toBeVisible();
        log.stepPass('Active version verified. Version: ' + vars["Version"] + ', Map: ' + vars["CreateNewMap"]);
      } catch (e) {
        await log.stepFail(page, 'Active version verification failed');
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