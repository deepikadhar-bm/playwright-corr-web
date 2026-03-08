// [POM-APPLIED]
import { test, expect, Page } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { HeadingCreateNewMapPage } from '../../../src/pages/correspondant/heading-create-new-map';
import { HeadingMappingsPage } from '../../../src/pages/correspondant/heading-mappings';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { P2142530YrFreddieMacFixedDropdownPage } from '../../../src/pages/correspondant/p-2142530-yr-freddie-mac-fixed-dropdown';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { ThisActionWillSaveTheChangesAndMoveToNextPagePage } from '../../../src/pages/correspondant/this-action-will-save-the-changes-and-move-to-next-page';
import { testDataManager } from 'testdata/TestDataManager';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { uploadFile } from '../../../src/helpers/file-helpers';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = "REG_TS01_TC01";
const TC_TITLE = "Verify that the user can select the required clients/execution type and upload a file with the necessary headers for map creation."

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let headerMappingPage: HeaderMappingPage;
  let headingCreateNewMapPage: HeadingCreateNewMapPage;
  let headingMappingsPage: HeadingMappingsPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let p2142530YrFreddieMacFixedDropdownPage: P2142530YrFreddieMacFixedDropdownPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;
  let thisActionWillSaveTheChangesAndMoveToNextPagePage: ThisActionWillSaveTheChangesAndMoveToNextPagePage;
  let helpers: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    headingCreateNewMapPage = new HeadingCreateNewMapPage(page);
    headingMappingsPage = new HeadingMappingsPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    p2142530YrFreddieMacFixedDropdownPage = new P2142530YrFreddieMacFixedDropdownPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
    thisActionWillSaveTheChangesAndMoveToNextPagePage = new ThisActionWillSaveTheChangesAndMoveToNextPagePage(page);
    helpers = new AddonHelpers(page, vars);
  });

  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);
  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      if (profile && profile.data){
        const uploadText = profile.data[0]['Upload File Text Verification'];
        vars["Upload File Text Verification"] = uploadText;
      }

      log.step("Step 1: Login to CORR Portal and verify dashboard");
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Heading_Dashboard).toBeVisible();
        log.stepPass("Step 1 passed: Logged in to CORR Portal successfully and dashboard is visible");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Failed to login to CORR Portal");
        throw error;
      }

      log.step("Step 2: Navigate to Customer Permission and Bid Maps menu");
      try {
        await stepGroups.stepGroup_Navigation_to_Customer_Permission(page, vars);
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.Bid_Maps_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(headingMappingsPage.Mappings).toBeVisible();
        log.stepPass("Step 2 passed: Navigated to Bid Maps menu successfully");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Failed to navigate to Bid Maps menu");
        throw error;
      }

      log.step("Step 3: Create new Bid Map with timestamp");
      try {
        await correspondentPortalPage.Add_New_Mapping_Button.click();
        await expect(headingCreateNewMapPage.Create_New_Map).toBeVisible();
        helpers.getCurrentTimestamp('dd/MM/yyyy/HH:mm:ss', 'CurrentDate');
        helpers.concatenate('Testsigma_', vars['CurrentDate'], 'Create New Map');
        await correspondentPortalPage.Create_New_Map_Field.pressSequentially(vars["Create New Map"]);
        await correspondentPortalPage.Create_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.waitForTimeout(5000);
        helpers.verifyElementContainsTextIgnoreCase(p2142530YrFreddieMacFixedDropdownPage.Bid_Maps_Name, vars["Create New Map"]);
        log.stepPass("Step 3 passed: New Bid Map created successfully with name: " + vars["Create New Map"]);
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Failed to create new Bid Map");
        throw error;
      }

      log.step("Step 4: Select company from dropdown");
      try {
        await correspondentPortalPage.Select_Companys_Dropdown.click();
        await statusInactivePage.Second_Selected_Company_Checkbox(vars["Companyname"]).first().click();
        await correspondentPortalPage.Apply_Selected.click();
        log.stepPass("Step 4 passed: Company selected successfully");
      } catch (error) {
        log.stepFail(page, "Step 4 failed: Failed to select company");
        throw error;
      }

      log.step("Step 5: Verify upload file field and upload Bid Maps file");
      try {
        await expect(correspondentPortalPage.Upload_File).toHaveValue('');                           
        await expect(page.getByText(vars["Upload File Text Verification"])).toBeVisible();
        await uploadFile(page, correspondentPortalPage.Upload_File, "Bid_Maps_File.xlsx");
        log.stepPass("Step 5 passed: File uploaded successfully");
      } catch (error) {
        log.stepFail(page, "Step 5 failed: Failed to upload file");
        throw error;
      }
      
      log.step("Step 6: Map headers and proceed to next page");
      try {
        await mapHeadersButtonPage.Map_Headers_Button.click();
        await correspondentPortalPage.Heading_Save_and_Move_to_Next_Page1.waitFor({ state: 'visible' });
        await expect(thisActionWillSaveTheChangesAndMoveToNextPagePage.This_action_will_save_the_changes_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars["Create New Map"])).toBeVisible();
        await headerMappingPage.Header_Mapping.waitFor({ state: 'visible' });
        log.stepPass("Step 6 passed: Headers mapped and navigated to next page successfully");
      } catch (error) {
        log.stepFail(page, "Step 6 failed: Failed to map headers and proceed to next page");
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