// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidSampleFieldNamePage } from '../../../src/pages/correspondant/bid-sample-field-name';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortal18Page } from '../../../src/pages/correspondant/correspondent-portal-18';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { CreateNewMapPage } from '../../../src/pages/correspondant/create-new-map';
import { DeleteDraftButtonPage } from '../../../src/pages/correspondant/delete-draft-button';
import { DeleteDraftPage } from '../../../src/pages/correspondant/delete-draft';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { EnumerationMappingPage } from '../../../src/pages/correspondant/enumeration-mapping';
import { HeaderamappingPage } from '../../../src/pages/correspondant/headeramapping';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { MapHeaderPage } from '../../../src/pages/correspondant/map-header';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { MapNameFieldInBidMapsPage } from '../../../src/pages/correspondant/map-name-field-in-bid-maps';
import { MapNamePage } from '../../../src/pages/correspondant/map-name';
import { NewMapNameInputPage } from '../../../src/pages/correspondant/new-map-name-input';
import { NewMapPage } from '../../../src/pages/correspondant/new-map';
import { P1MoreButtonPage } from '../../../src/pages/correspondant/p-1-more-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ViewActiveVersionButtonPage } from '../../../src/pages/correspondant/view-active-version-button';
import { ViewDraftButtonPage } from '../../../src/pages/correspondant/view-draft-button';
import { testDataManager } from 'testdata/TestDataManager';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { uploadFile } from '../../../src/helpers/file-helpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments'
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';

const TC_ID = "REG_TS16_TC01";
const TC_TITLE = "(New Bidmap & Header Mapping)If the status is active draft, then verify that user should be able to switch the view between active draft and should be able to delete the defat version if not required 1"

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let bidSampleFieldNamePage: BidSampleFieldNamePage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortal18Page: CorrespondentPortal18Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let createNewMapPage: CreateNewMapPage;
  let deleteDraftButtonPage: DeleteDraftButtonPage;
  let deleteDraftPage: DeleteDraftPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let enumerationMappingPage: EnumerationMappingPage;
  let headeramappingPage: HeaderamappingPage;
  let headerMappingPage: HeaderMappingPage;
  let mapHeaderPage: MapHeaderPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let mapNameFieldInBidMapsPage: MapNameFieldInBidMapsPage;
  let mapNamePage: MapNamePage;
  let newMapNameInputPage: NewMapNameInputPage;
  let newMapPage: NewMapPage;
  let p1MoreButtonPage: P1MoreButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let spinnerPage: SpinnerPage;
  let viewActiveVersionButtonPage: ViewActiveVersionButtonPage;
  let viewDraftButtonPage: ViewDraftButtonPage;
  let helpers: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidSampleFieldNamePage = new BidSampleFieldNamePage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    createNewMapPage = new CreateNewMapPage(page);
    deleteDraftButtonPage = new DeleteDraftButtonPage(page);
    deleteDraftPage = new DeleteDraftPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    enumerationMappingPage = new EnumerationMappingPage(page);
    headeramappingPage = new HeaderamappingPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    mapHeaderPage = new MapHeaderPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    mapNameFieldInBidMapsPage = new MapNameFieldInBidMapsPage(page);
    mapNamePage = new MapNamePage(page);
    newMapNameInputPage = new NewMapNameInputPage(page);
    newMapPage = new NewMapPage(page);
    p1MoreButtonPage = new P1MoreButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    viewActiveVersionButtonPage = new ViewActiveVersionButtonPage(page);
    viewDraftButtonPage = new ViewDraftButtonPage(page);
    helpers = new AddonHelpers(page, vars);
  });

  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);
  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {
      log.step("Step 1: Prepare data and login");
      try {
        if (profile && profile.data) {
          vars["Company name 1"] = profile.data[0]['CompanyName1'];
          vars["CustomHeader"] = profile.data[0]['CustomHeader'];
          vars["ChaseFieldNames"] = profile.data[0]["ChaseFieldNames"];
          vars["Chase_Field_Name"] = profile.data[0]["Chase_Field_Name"];
          vars["Username"] = credentials.username;
          vars["Password"] = credentials.password;
          log.info(`Company: ${vars["Company name 1"]}`);
        }
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        await stepGroups.stepGroup_Navigating_to_Customer_Permission_For_the_Chase_Direct_Compa(page, vars);
        await stepGroups.stepGroup_EditActions_In_CustomerPermission(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.Bid_Maps_Menu.click();
        await stepGroups.stepGroup_Creating_Of_Bid_Maps_with_Standard(page, vars);
        // [DISABLED] Creation Of Bid Map_Upto_Header Mapping
        // await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
        log.stepPass("Step 1 passed");
      } catch (error) {
        log.stepFail(page, "Step 1 failed");
        throw error;
      }

      log.step("Step 2: Publish initial version");
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await correspondentPortal18Page.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await correspondentPortal18Page.Yes_Proceed_Button.click();
        await saveAndPublishButtonPage.Save_and_Publish_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await mapNameFieldInBidMapsPage.get_Bid_Map_Name_Field_In_Row(vars["Create New Map"]).click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass("Step 2 passed");
      } catch (error) {
        log.stepFail(page, "Step 2 failed");
        throw error;
      }

      log.step("Step 3: Save draft and switch to active version");
      try {
        await correspondentPortalPage.Dropdown_selection_2.selectOption({ index: parseInt("2") });
        vars["EditedExecutionType"] = await mapHeaderPage.Execution_Type_Dropdown_New.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        log.info(`EditedExecutionType: ${vars["EditedExecutionType"]}`);
        await expect(correspondentPortalPage.Save_Draft_Button1).toBeVisible();
        await correspondentPortalPage.Save_Draft_Button1.click();
        await expect(viewActiveVersionButtonPage.View_Active_Version_Button).toBeVisible();
        await viewActiveVersionButtonPage.View_Active_Version_Button.click();
        // await expect(correspondentPortalPage.Save_Draft_Button1).not.toBeVisible();
        await expect(correspondentPortalPage.Save_Draft_Button1).not.toBeEnabled();

        // [DISABLED] Click on Administration_Menu
        // await correspondentPortalPage.Administration_Menu.click();
        // [DISABLED] Click on Bid Maps_Menu
        // await correspondentPortalPage.Bid_Maps_Menu.click();
        // [DISABLED] Click on Bid Map Name Field In Row
        // await mapNameFieldInBidMapsPage.Bid_Map_Name_Field_In_Row.click();
        // [DISABLED] Wait until the element Spinner is not visible
        // await spinnerPage.Spinner.waitFor({ state: 'hidden' });

        await expect(correspondentPortalPage.Dropdown_selection_2).toBeVisible();
        await expect(newMapNameInputPage.New_Map_Name_Input).toBeVisible();
        // [DISABLED] Verify that the element New Map Name Input has value EditedMapName and With Scrollable FALSE
        // await expect(newMapNameInputPage.New_Map_Name_Input).toHaveValue(vars["EditedMapName"]);
        // [DISABLED] Verify that the element Individual Selected Company displays text SelectedCompanyName and With Scrollable FALSE
        // await expect(newMapPage.Individual_Selected_Company).toContainText(vars["SelectedCompanyName"]);
        // [DISABLED] Verify that the element Execution Type Dropdown New display value ExecutionType and With Scrollable FALSE
        // await expect(mapHeaderPage.Execution_Type_Dropdown_New).toHaveValue(vars["ExecutionType"]);
        // [DISABLED] Verify that the element Map File Name displays text UploadedFileName and With Scrollable FALSE
        // await expect(p1MoreButtonPage.Uploaded_FileName).toContainText(vars["UploadedFileName"]);
        // [DISABLED] Verify that the element View Active Version Button is not displayed and With Scrollable FALSE
        // await expect(viewActiveVersionButtonPage.View_Active_Version_Button).toBeVisible();
        // [DISABLED] Verify if Execution Type == Chase_Direct
        // expect(String(testData["Execution Type"])).toBe(vars["Chase_Direct"]);
        // [DISABLED] Wait until the element Spinner is not visible
        // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        // await expect(correspondentPortalPage.Disabled_Company_Name).toHaveAttribute('title', "disabled");
        await expect(correspondentPortalPage.Disabled_Company_Name).toHaveClass(/disabled/);
        await expect(createNewMapPage.Upload_File_Input_Box).not.toBeVisible();
        // [DISABLED] Verify that the text EditedMapName is not displayed in the element New Map Name Input and With Scrollable FALSE
        // await expect(newMapNameInputPage.New_Map_Name_Input).not.toContainText(vars["EditedMapName"]);
        // await expect(mapHeaderPage.Execution_Type_Dropdown_New).not.toContainText(vars["EditedExecutionType"]);
        await expect(mapHeaderPage.Execution_Type_Dropdown_New.locator('option:checked')).not.toHaveText(vars["EditedExecutionType"]);
        log.stepPass("Step 3 passed");
      } catch (error) {
        log.stepFail(page, "Step 3 failed");
        throw error;
      }

      log.step("Step 4: Switch to draft, delete draft and validate ACTIVE");
      try {
        await viewDraftButtonPage.View_Draft_Button.click();
        await expect(correspondentPortalPage.Dropdown_selection_2).toBeVisible();
        await expect(newMapNameInputPage.New_Map_Name_Input).toBeVisible();
        await expect(mapHeadersButtonPage.Map_Headers_Button).toBeVisible();
        await deleteDraftButtonPage.Delete_Draft_Button.click();
        await expect(deleteDraftPage.Text_In_Delete_Draft).toBeVisible();
        await deleteDraftPage.Yes_proceed_On_Delete_Draft.click();
        await mapNamePage.get_Active_Map_Name(vars["Create New Map"]).waitFor({ state: 'visible' });
        await expect(mapNamePage.get_Active_Map_Name(vars["Create New Map"])).toContainText("ACTIVE");
        await mapNameFieldInBidMapsPage.get_Bid_Map_Name_Field_In_Row(vars["Create New Map"]).click();
        // [DISABLED] Select option by index 2 in the Dropdown_selection list
        // await correspondentPortalPage.Dropdown_selection_2.selectOption({ index: parseInt("2") });
        // [DISABLED] Store the text of the selected option from Execution Type Dropdown New list into a variable DropDown Value
        // vars["DropDown Value"] = await mapHeaderPage.Execution_Type_Dropdown_New.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        // [DISABLED] Verify that the element Save Draft Button is enabled and With Scrollable FALSE
        // await expect(correspondentPortalPage.Save_Draft_Button1).toBeVisible();
        // [DISABLED] Click on Save Draft Button
        // await correspondentPortalPage.Save_Draft_Button1.click();
        // [DISABLED] Verify that the element View Active Version Button is displayed and With Scrollable FALSE
        // await expect(viewActiveVersionButtonPage.View_Active_Version_Button).toBeVisible();
        log.stepPass("Step 4 passed");
      } catch (error) {
        log.stepFail(page, "Step 4 failed");
        throw error;
      }

      log.step("Step 5: Perform header mapping changes and validate version switch");
      try {
        await mapHeadersButtonPage.Map_Headers_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Creating_New_Header_In_Header_Mapping_Screen(page, vars);
        await expect(headerMappingPage.Custom_Header).toBeVisible();
        await stepGroups.stepGroup_Editing_Header_Mapping(page, vars);
        vars["ChaseFieldNameHeaderMapping"] = await headerMappingPage.get_Updated_Element_In_Header_Mapping(vars["UpdatedBidSampleName[HeaderMapping]"]).getAttribute('title') || '';
        expect(String(vars["ChaseFieldNameHeaderMapping"])).toBe(vars["UpdatedChaseFieldNameHeaderMapping"]);
        // [DISABLED] Verify that the element Updated BidSample Name displays text UpdatedBidSampleNameHeaderMapping and With Scrollable FALSE
        // await expect(headerMappingPage.Updated_BidSample_Name).toContainText(vars["UpdatedBidSampleNameHeaderMapping"]);
        vars["DeletedHeader[HeaderMapping]"] = await headerMappingPage.Deleting_Header.textContent() || '';
        await stepGroups.stepGroup_Delete_a_Header_In_Header_Mapping(page, vars);
        // await expect(headerMappingPage.Deleted_Header_In_HeaderMaping).toBeVisible();
        await expect(headerMappingPage.get_Deleted_Header_In_HeaderMaping(vars["DeletedHeader[HeaderMapping]"])).not.toBeVisible();
        await headerMappingPage.First_Header_Checkbox.check();
        await expect(headerMappingPage.First_Header_Checkbox).toBeChecked();
        // [DISABLED] Verify that the element Header 2 is checked and With Scrollable FALSE
        // await expect(chaseFieldNamePage.Header_2).toBeVisible();
        // [DISABLED] Uncheck the checkbox Header 2
        // await chaseFieldNamePage.Header_2.uncheck();
        // [DISABLED] Verify that the element Bid Sample Field Name is not displayed and With Scrollable FALSE
        // await expect(bidSampleFieldNamePage.Bid_Sample_Field_Name).toBeVisible();
        // [DISABLED] Verify that the element Bid Sample Field Name on Enumeration Mapping is displayed and With Scrollable FALSE
        // await expect(enumerationMappingPage.Bid_Sample_Field_Name_on_Enumeration_Mapping).toBeVisible();
        // [DISABLED] Verify that the element Chase Field Name Enumeration Mapping is displayed and With Scrollable FALSE
        // await expect(enumerationMappingPage.Chase_Field_Name_Enumeration_Mapping).toBeVisible();
        await correspondentPortalPage.Save_Draft_Button1.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["fieldscount"] = String(await headerMappingPage.BidMapFieldSet.count());
        log.info(`fieldscount: ${vars["fieldscount"]}`);
        await expect(viewActiveVersionButtonPage.View_Active_Version_Button).toBeVisible();
        await viewActiveVersionButtonPage.View_Active_Version_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(headeramappingPage.Disabled_Headers).toHaveCount(parseInt(vars["fieldscount"]));
        // [DISABLED] Verify that the element Disabled Header Mapping Page is present and With Scrollable FALSE
        // await expect(headeramappingPage.Disabled_Headers).toBeVisible();
        await expect(headerMappingPage.Custom_Header).not.toBeVisible();
        // await expect(headerMappingPage.Deleted_Header_In_HeaderMaping).toBeVisible();
        await expect(headerMappingPage.get_Deleted_Header_In_HeaderMaping(vars["DeletedHeader[HeaderMapping]"])).toBeVisible();

        // [DISABLED] Verify that the text UpdatedBidSampleNameHeaderMapping is not displayed in the element Updated BidSample Name and With Scrollable FALSE
        // await expect(headerMappingPage.Updated_BidSample_Name).not.toContainText(vars["UpdatedBidSampleNameHeaderMapping"]);
        vars["ChaseFieldNameHeaderMapping"] = await headerMappingPage.get_Updated_Element_In_Header_Mapping(vars["UpdatedBidSampleName[HeaderMapping]"]).getAttribute('title') || '';
        expect(String(vars["ChaseFieldNameHeaderMapping"])).not.toBe(vars["UpdatedChaseFieldNameHeaderMapping"]);
        await expect(headerMappingPage.First_Header_Checkbox).not.toBeChecked();
        // [DISABLED] Verify that the element Bid Sample Field Name on Enumeration Mapping is enabled and With Scrollable FALSE
        // await expect(enumerationMappingPage.Bid_Sample_Field_Name_on_Enumeration_Mapping).toBeVisible();
        // [DISABLED] Verify that the element Chase Field Name Enumeration Mapping is disabled and With Scrollable FALSE
        // await expect(enumerationMappingPage.Chase_Field_Name_Enumeration_Mapping).toBeVisible();
        await viewDraftButtonPage.View_Draft_Button.click();
        // [DISABLED] Verify that the count of elements identified by locator Disabled Headers is 0 and With Scrollable FALSE
        // await expect(headeramappingPage.Disabled_Headers).toHaveCount(parseInt("0"));
        await expect(headeramappingPage.Disabled_Headers).not.toBeVisible();
        await deleteDraftButtonPage.Delete_Draft_Button.click();
        await expect(deleteDraftPage.Text_In_Delete_Draft).toBeVisible();
        await deleteDraftPage.Yes_proceed_On_Delete_Draft.click();
        await mapNamePage.get_Active_Map_Name(vars["Create New Map"]).waitFor({ state: 'visible' });
        await expect(mapNamePage.get_Active_Map_Name(vars["Create New Map"])).toContainText("ACTIVE");
        log.stepPass("Step 5 passed");
      } catch (error) {
        log.stepFail(page, "Step 5 failed");
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