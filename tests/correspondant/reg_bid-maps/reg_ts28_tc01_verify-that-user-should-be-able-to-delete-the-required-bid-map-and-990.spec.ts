// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { CorrespondentPortal3Page } from '../../../src/pages/correspondant/correspondent-portal-3';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { DeleteIdPage } from '../../../src/pages/correspondant/delete-id';
import { DeleteMapPage } from '../../../src/pages/correspondant/delete-map';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { MapnamePage } from '../../../src/pages/correspondant/mapname';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { ShowAllPage } from '../../../src/pages/correspondant/show-all';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { ThisActionWillSaveTheChangesAndMoveToNextPagePage } from '../../../src/pages/correspondant/this-action-will-save-the-changes-and-move-to-next-page';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../../../src/helpers/log-helper';
import { uploadFile } from '../../../src/helpers/file-helpers';

const TC_ID = "REG_TS28_TC01";
const TC_TITLE = "Verify that user should be able to delete the required bid map and create a new one using the same name.";

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let bidmapPage: BidmapPage;
  let correspondentPortal3Page: CorrespondentPortal3Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let deleteIdPage: DeleteIdPage;
  let deleteMapPage: DeleteMapPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let mapnamePage: MapnamePage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let showAllPage: ShowAllPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let thisActionWillSaveTheChangesAndMoveToNextPagePage: ThisActionWillSaveTheChangesAndMoveToNextPagePage;

  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidmapPage = new BidmapPage(page);
    correspondentPortal3Page = new CorrespondentPortal3Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    deleteIdPage = new DeleteIdPage(page);
    deleteMapPage = new DeleteMapPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    mapnamePage = new MapnamePage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    showAllPage = new ShowAllPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    thisActionWillSaveTheChangesAndMoveToNextPagePage = new ThisActionWillSaveTheChangesAndMoveToNextPagePage(page);
  });

  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      log.step("Step 1: Load test data and login to CORR portal");
      try {
        if (profile && profile.data) {
          vars["Save and Move to Next Page"] = profile.data[0]['Save and Move to Next Page'];
          vars["Unidentified fields Message"] = profile.data[0]['Unidentified fields Message'];
        }

        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;

        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        log.stepPass("Step 1 passed: Logged in and Smart Mapper enabled.");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Unable to load data or login.");
        throw error;
      }
      log.step("Step 2: Navigate to Bid Maps and create a new Bid Map up to header mapping");
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.Bid_Maps_Menu.click();
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
        log.stepPass("Step 2 passed: Bid Map created up to header mapping.");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Unable to create Bid Map.");
        throw error;
      }
      log.step("Step 3: Handle unidentified fields popup and proceed to Rules and Actions");
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(page.getByText(vars["Save and Move to Next Page"])).toBeVisible();
        await expect(page.getByText(vars["Unidentified fields Message"])).toBeVisible();
        await bidmapPage.Yes_Proceed_Button_Text.click();
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await expect(page.getByText(vars["Save and Move to Next Page"])).toBeVisible();
        await expect(page.getByText(vars["Unidentified fields Message"])).toBeVisible();
        await bidmapPage.Yes_Proceed_Button_Text.click();
        log.stepPass("Step 3 passed: Unidentified fields popup handled.");
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Unable to handle unidentified fields popup.");
        throw error;
      }

      log.step("Step 4: Import rule and publish the Bid Map");
      try {
        await stepGroups.stepGroup_Import_Rule_In_Rules_and_Actions(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await saveAndPublishButtonPage.Save_and_Publish_Button.click();
        log.stepPass("Step 4 passed: Rule imported and map published.");
      } catch (error) {
        log.stepFail(page, "Step 4 failed: Unable to import rule or publish map.");
        throw error;
      }

      log.step("Step 5: Search for created map and delete it");
      try {
        await page.reload();
        await statusInactive2Page.SearchFilter_Fields.click();
        await statusInactive2Page.SearchFilter_Fields.pressSequentially(vars["CreateNewMap"]);
        await page.getByText(vars["CreateNewMap"]).last().hover();
        await showAllPage.Show_All_2.hover();
        await deleteIdPage.Click_on_Show_All.click();
        await deleteMapPage.Delete_Option.click();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText("No result")).toBeVisible();
        log.stepPass("Step 5 passed: Map deleted successfully.");
      } catch (error) {
        log.stepFail(page, "Step 5 failed: Unable to delete the Bid Map.");
        throw error;
      }

      log.step("Step 6: Create a new map using the same deleted map name");
      try {
        await correspondentPortalPage.Add_New_Mapping_Button.click();
        await mapnamePage.mapNamefiled.fill(vars["CreateNewMap"]);
        vars["BidMap"] = await mapnamePage.mapNamefiled.inputValue() || '';
        await correspondentPortalPage.Create_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortal3Page.Create_New_Map_Field).toHaveValue(vars["BidMap"]);
        log.stepPass("Step 6 passed: New map created with the same deleted name.");
      } catch (error) {
        log.stepFail(page, "Step 6 failed: Unable to recreate map with same name.");
        throw error;
      }

      log.step("Step 7: Upload file and proceed to header mapping");
      try {
        await correspondentPortalPage.Select_Companys_Dropdown.click();
        await statusInactive2Page.Select_Required_Company_Name.click();
        await correspondentPortalPage.Apply_Selected.click();
        await expect(correspondentPortalPage.Upload_File).toHaveValue('');
        await uploadFile(page, correspondentPortalPage.Upload_File, "Bid_Maps_File.xlsx");
        await mapHeadersButtonPage.Map_Headers_Button.click();
        await expect(thisActionWillSaveTheChangesAndMoveToNextPagePage.This_action_will_save_the_changes_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass("Step 7 passed: File uploaded and header mapping reached.");
      } catch (error) {
        log.stepFail(page, "Step 7 failed: Unable to upload file or proceed.");
        throw error;
      }

      log.tcEnd('PASS');

    } catch (error) {
      await log.captureOnFailure(page, TC_ID, error);
      log.tcEnd('FAIL');
      throw error;
    }
  });
});