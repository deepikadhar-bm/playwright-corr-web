// [POM-APPLIED]
import { test, expect, Page } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { AppraisedvalueselectamDivDivPage } from '../../../src/pages/correspondant/appraisedvalueselectam-div-div';
import { BidMapPage } from '../../../src/pages/correspondant/bid-map';
import { ClickOnAddRuleOrImportRulePage } from '../../../src/pages/correspondant/click-on-add-rule-or-import-rule';
import { CorrespondentPortal18Page } from '../../../src/pages/correspondant/correspondent-portal-18';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { HeadingCreateNewMapPage } from '../../../src/pages/correspondant/heading-create-new-map';
import { HeadingMappingsPage } from '../../../src/pages/correspondant/heading-mappings';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { P2142530YrFreddieMacFixedDropdownPage } from '../../../src/pages/correspondant/p-2142530-yr-freddie-mac-fixed-dropdown';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { testDataManager } from 'testdata/TestDataManager';
import { uploadFile } from '../../../src/helpers/file-helpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { ENV } from '@config/environments'
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';



const TC_ID = "REG_TS03_TC02";
const TC_TITLE = "Verify that when the smart map option is turned Off, uploading a bid file and navigating to the header screen will automatically select the corresponding Chase field name based on the bid file.";

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let appraisedvalueselectamDivDivPage: AppraisedvalueselectamDivDivPage;
  let bidMapPage: BidMapPage;
  let clickOnAddRuleOrImportRulePage: ClickOnAddRuleOrImportRulePage;
  let correspondentPortal18Page: CorrespondentPortal18Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let headerMappingPage: HeaderMappingPage;
  let headingCreateNewMapPage: HeadingCreateNewMapPage;
  let headingMappingsPage: HeadingMappingsPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let p2142530YrFreddieMacFixedDropdownPage: P2142530YrFreddieMacFixedDropdownPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;
  let helpers: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    appraisedvalueselectamDivDivPage = new AppraisedvalueselectamDivDivPage(page);
    bidMapPage = new BidMapPage(page);
    clickOnAddRuleOrImportRulePage = new ClickOnAddRuleOrImportRulePage(page);
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    headingCreateNewMapPage = new HeadingCreateNewMapPage(page);
    headingMappingsPage = new HeadingMappingsPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    p2142530YrFreddieMacFixedDropdownPage = new P2142530YrFreddieMacFixedDropdownPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
    helpers = new AddonHelpers(page, vars);
  });

  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);
  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      if (profile && profile.data) {
        const uploadText = profile.data[0]['Upload File Text Verification'];
        const executionType = profile.data[0]['Execution Type'];
        const chaseFieldName = profile.data[0]['Chase Field Name'];
        vars["Upload File Text Verification"] = uploadText;
        vars["Execution Type"] = executionType;
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        vars["Chase Field Name"] = chaseFieldName;
      }

      log.step("Step 1: Login to CORR Portal and turn Smart Mapper OFF");
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Smart_Mapper_from_On_to_Off(page, vars);
        await expect(headingMappingsPage.Mappings).toBeVisible();
        log.stepPass("Step 1 passed: Logged in and Smart Mapper turned OFF successfully.");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Unable to login or turn Smart Mapper OFF.");
        throw error;
      }

      log.step("Step 2: Create new Bid Map and upload Bid file");
      try {
        await correspondentPortalPage.Add_New_Mapping_Button.click();
        await expect(headingCreateNewMapPage.Create_New_Map).toBeVisible();
        helpers.getCurrentTimestamp(appconstants.DATE_FORMAT_SLASH, 'CurrentDate', appconstants.ASIA_KOLKATA); /* format: dd/MM/yyyy/HH:mm:ss */;
        helpers.concatenate(appconstants.Testsigma_, vars['CurrentDate'], 'Create New Map');
        await correspondentPortalPage.Create_New_Map_Field.fill(vars["Create New Map"]);
        await correspondentPortalPage.Create_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(p2142530YrFreddieMacFixedDropdownPage.Bid_Maps_Name).toContainText(vars["Create New Map"]);

        await correspondentPortalPage.Select_Companys_Dropdown.click();
        await bidMapPage.Required_Company_Checkbox_Bidmap_Company_dropdown.click();
        await correspondentPortalPage.Apply_Selected.click();

        await expect(correspondentPortalPage.Upload_File).toHaveValue('');
        await expect(page.getByText(vars["Upload File Text Verification"])).toBeVisible();
        await uploadFile(page, correspondentPortalPage.Upload_File, "Bid_Maps_File.xlsx");
        log.stepPass("Step 2 passed: Bid Map created, company selected, and file uploaded successfully.");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Unable to create Bid Map, select company, or upload file.");
        throw error;
      }

      log.step("Step 3: Map headers, verify default selections, and set Chase field name");
      try {
        await mapHeadersButtonPage.Map_Headers_Button.click();
        await correspondentPortalPage.Heading_Save_and_Move_to_Next_Page1.waitFor({ state: 'visible' });
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars["Create New Map"])).toBeVisible();
        await headerMappingPage.Header_Mapping.waitFor({ state: 'visible' });
        await appraisedvalueselectamDivDivPage.All_Select_in_header.first().waitFor({ state: "visible" });
        await helpers.verifySelectedOptionInMultipleDropdowns(appraisedvalueselectamDivDivPage.All_Select_in_header, undefined, "contains", "Select");
        vars["UnidentifiedHeadersCount"] = String(await headerMappingPage.Unidentified_Headers.count());
        await correspondentPortalPage.Select_Dropdown_in_Headers_Mapping.selectOption({ label: vars["Chase Field Name"] });
        await expect(correspondentPortalPage.Select_Dropdown_in_Headers_Mapping).toContainText(vars["Chase Field Name"]);
        log.stepPass("Step 3 passed: Header mapping completed and Chase field selection verified/updated.");
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Unable to map headers or set/verify Chase field name.");
        throw error;
      }

      log.step("Step 4: Proceed through Enumeration Mapping and Rules & Actions");
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(statusInactivePage.You_have_unidentified_Fields_This_action_will_save_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Select_Dropdown_in_Enumeration_Mapping).toBeVisible();

        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
        await correspondentPortal18Page.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(clickOnAddRuleOrImportRulePage.Click_on_Add_Rule_Or_Import_Rule).toBeVisible();

        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        log.stepPass("Step 4 passed: Enumeration Mapping and Rules & Actions flow completed successfully.");
      } catch (error) {
        log.stepFail(page, "Step 4 failed: Unable to complete Enumeration Mapping / Rules & Actions flow.");
        throw error;
      }

      log.tcEnd('PASS');
    } catch (error) {
      log.captureOnFailure(page, TC_ID, error);
      log.tcEnd('FAIL');
      throw error;
    }
  });
});
