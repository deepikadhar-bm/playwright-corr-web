// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CcodePage } from '../../../src/pages/correspondant/ccode';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { CreatedByPage } from '../../../src/pages/correspondant/created-by';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { HeadingSelectRulesPage } from '../../../src/pages/correspondant/heading-select-rules';
import { LastModifiedByPage } from '../../../src/pages/correspondant/last-modified-by';
import { LastModifiedPage } from '../../../src/pages/correspondant/last-modified';
import { MapNamePage } from '../../../src/pages/correspondant/map-name';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID    = 'REG_TS17_TC01';
const TC_TITLE = 'If a new record is created then verify the data present in the list should be displayed properly.';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let ccodePage: CcodePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let createdByPage: CreatedByPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let headingSelectRulesPage: HeadingSelectRulesPage;
  let lastModifiedByPage: LastModifiedByPage;
  let lastModifiedPage: LastModifiedPage;
  let mapNamePage: MapNamePage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    ccodePage = new CcodePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    createdByPage = new CreatedByPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    headingSelectRulesPage = new HeadingSelectRulesPage(page);
    lastModifiedByPage = new LastModifiedByPage(page);
    lastModifiedPage = new LastModifiedPage(page);
    mapNamePage = new MapNamePage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Step 1: Load Credentials and Test Data ───────────────────────────
      log.step('Loading credentials and test data');
      try {
        const crederntials = ENV.getCredentials('internal');
        vars["Username"] = crederntials.username;
        vars["Password"] = crederntials.password;
        // console.log("Test Data: ", testData);
        const profileName = "Bid_Maps";
        const profile = testDataManager.getProfileByName(profileName);
        if (profile && profile.data) {
          const ChaseFieldNames = profile.data[0]['ChaseFieldNames'];
          vars["ChaseFieldNames"] = ChaseFieldNames;
          const SearchMapInput = profile.data[0]['Search Map Input'];
          vars["Search Map Input"] = SearchMapInput;
          const Search_Map = profile.data[0]['Search_Map'];
          vars["Search_Map"] = Search_Map;
        }
        log.stepPass('Credentials and test data loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Loading credentials and test data failed');
        throw e;
      }

      // ── Step 2: Login to Correspondent Portal ────────────────────────────
      log.step('Login to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to Correspondent Portal successful');
      } catch (e) {
        await log.stepFail(page, 'Login to Correspondent Portal failed');
        throw e;
      }

      // ── Step 3: Enable Smart Mapper ──────────────────────────────────────
      log.step('Enabling Smart Mapper from Off to On');
      try {
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        log.stepPass('Smart Mapper enabled successfully');
      } catch (e) {
        await log.stepFail(page, 'Enabling Smart Mapper failed');
        throw e;
      }

      // ── Step 4: Create Bid Map up to Header Mapping ──────────────────────
      log.step('Creating Bid Map up to Header Mapping step');
      try {
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
        await expect(enumerationMappingButtonPage.Enumeration_Mapping_Button).toBeVisible();
        log.stepPass('Bid Map created up to Header Mapping — Enumeration Mapping Button is visible');
      } catch (e) {
        await log.stepFail(page, 'Creating Bid Map up to Header Mapping failed');
        throw e;
      }

      // ── Step 5: Edit Header Mapping and select Chase Field Name ──────────
      log.step('Editing Header Mapping and selecting Chase Field Name: ' + vars["ChaseFieldNames"]);
      try {
        await correspondentPortalPage.Edit_icon_in_Header_Mapping.click();
        await expect(correspondentPortalPage.Update_Header).toBeVisible();
        await correspondentPortalPage.Chase_Field_Name.click();
        await correspondentPortalPage.Chase_Field_Name.selectOption({ label: vars["ChaseFieldNames"] });
        await correspondentPortalPage.Update_Header_Button.click();
        await page.waitForLoadState('load');
        log.stepPass('Header Mapping edited and Chase Field Name selected successfully');
      } catch (e) {
        await log.stepFail(page, 'Editing Header Mapping or selecting Chase Field Name failed');
        throw e;
      }

      // ── Step 6: Navigate to Enumeration Mapping and Proceed with Saving ──
      log.step('Clicking Enumeration Mapping button and proceeding with saving');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(correspondentPortalPage.Heading_Save_and_Move_to_Next_Page1).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(rulesAndActionsButtonPage.Rules_and_Actions_Button).toBeVisible();
        log.stepPass('Enumeration Mapping navigated and Proceed with Saving completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Navigating Enumeration Mapping or Proceeding with Saving failed');
        throw e;
      }

      // ── Step 7: Delete Enumeration Pair ──────────────────────────────────
      log.step('Deleting Enumeration Pair');
      try {
        await correspondentPortalPage.Delete_icon_in_Enumeration_Mappings.click();
        await expect(correspondentPortalPage.Delete_Enumeration_Pair).toBeVisible();
        await correspondentPortalPage.Yes_Go_ahead_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Enumeration Pair deleted successfully');
      } catch (e) {
        await log.stepFail(page, 'Deleting Enumeration Pair failed');
        throw e;
      }

      // ── Step 8: Navigate to Rules and Actions ────────────────────────────
      log.step('Clicking Rules and Actions button and handling unidentified fields warning if present');
      try {
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        if (true) /* Element You have unidentified Fields.This action will save a */ {
          await expect(statusInactivePage.You_have_unidentified_Fields_This_action_will_save_and_Move_to_Next_Page).toBeVisible();
          await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        }
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(saveAndPublishButtonPage.Save_and_Publish_Button).toBeVisible();
        log.stepPass('Rules and Actions navigated and Save and Publish Button is visible');
      } catch (e) {
        await log.stepFail(page, 'Navigating to Rules and Actions failed');
        throw e;
      }
      // ── Step 9: Import Rule ───────────────────────────────────────────────
      log.step('Importing Rule by searching and selecting from Import Rule panel');
      try {
        await correspondentPortalPage.Import_Rule_Button.click();
        await expect(headingSelectRulesPage.Select_Rules).toBeVisible();
        await correspondentPortalPage.Search_Map_Input.fill(vars["Search Map Input"]);
        await correspondentPortalPage.Search_Map_Input_Dropdown.click();
        await correspondentPortalPage.Import_Rule_Checkbox.check();
        await correspondentPortalPage.Apply_Selected_Button_in_Import_Rule.click();
        await expect(correspondentPortalPage.Add_Conditions).toBeVisible();
        log.stepPass('Rule imported successfully');
      } catch (e) {
        await log.stepFail(page, 'Importing Rule failed');
        throw e;
      }
      // ── Step 10: Save and Publish ─────────────────────────────────────────
      log.step('Clicking Save and Publish button');
      try {
        await saveAndPublishButtonPage.Save_and_Publish_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Save and Publish completed successfully');
      } catch (e) {
        await log.stepFail(page, 'Save and Publish failed');
        throw e;
      }
      // ── Step 11: Verify list data is displayed properly ───────────────────
      log.step('Verifying all record fields are displayed properly in the list');
      try {
        vars["CCode"] = await ccodePage.CCode.first().textContent() || '';
        await expect(page.getByText(vars["CCode"]).first()).toBeVisible();
        vars["MapName"] = await mapNamePage.Map_Name.first().textContent() || '';
        await expect(page.getByText(vars["MapName"]).first()).toBeVisible();
        vars["CompanyName"] = await correspondentPortalPage.Company_Name.first().textContent() || '';
        await expect(correspondentPortalPage.Company_Name.first()).toContainText(vars["CompanyName"]);
        vars["Status"] = await correspondentPortalPage.Status.first().textContent() || '';
        await expect(page.getByText(vars["Status"]).first()).toBeVisible();
        vars["Version"] = await correspondentPortalPage.Version.first().textContent() || '';
        await expect(page.getByText(vars["Version"]).first()).toBeVisible();
        vars["LastModified"] = await lastModifiedPage.Last_Modified.first().textContent() || '';
        await expect(page.getByText(vars["LastModified"]).first()).toBeVisible();
        vars["CreatedOn"] = await correspondentPortalPage.Created_On.first().textContent() || '';
        await expect(page.getByText(vars["CreatedOn"]).first()).toBeVisible();
        vars["Created By"] = await createdByPage.Created_By.first().textContent() || '';
        await expect(page.getByText(vars["Created By"]).first()).toBeVisible();
        vars["LastModifiedBy"] = await lastModifiedByPage.Last_Modified_By.first().textContent() || '';
        await expect(page.getByText(vars["LastModifiedBy"]).first()).toBeVisible();
        log.stepPass('All record fields verified successfully in the list');
      } catch (e) {
        await log.stepFail(page, 'Verifying record fields in the list failed');
        throw e;
      }

      // ─── TC End: PASS ────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }

  });
});