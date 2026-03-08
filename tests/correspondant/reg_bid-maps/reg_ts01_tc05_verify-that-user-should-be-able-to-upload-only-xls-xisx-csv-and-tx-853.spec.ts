// [POM-APPLIED]
import { test, expect, Page } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { Deepikaaugbidqa1csvButtonDivPage } from '../../../src/pages/correspondant/deepikaaugbidqa1csv-button-div';
import { FileFormatNotAllowedDeepikaaugbidqa1pdfPage } from '../../../src/pages/correspondant/file-format-not-allowed-deepikaaugbidqa1pdf';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { HeadingCreateNewMapPage } from '../../../src/pages/correspondant/heading-create-new-map';
import { P2142530YrFreddieMacFixedDropdownPage } from '../../../src/pages/correspondant/p-2142530-yr-freddie-mac-fixed-dropdown';
import { SelectAllCheckboxPage } from '../../../src/pages/correspondant/select-all-checkbox';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';
import { uploadFile } from '../../../src/helpers/file-helpers';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = "REG_TS01_TC05";
const TC_TITLE = "Verify that user should be able to upload only xls, xlsx, csv and txt files and we should not allow the user to upload any other file if tried uploading then it should display the error";

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let deepikaaugbidqa1csvButtonDivPage: Deepikaaugbidqa1csvButtonDivPage;
  let fileFormatNotAllowedDeepikaaugbidqa1pdfPage: FileFormatNotAllowedDeepikaaugbidqa1pdfPage;
  let headerMappingPage: HeaderMappingPage;
  let headingCreateNewMapPage: HeadingCreateNewMapPage;
  let p2142530YrFreddieMacFixedDropdownPage: P2142530YrFreddieMacFixedDropdownPage;
  let selectAllCheckboxPage: SelectAllCheckboxPage;
  let spinnerPage: SpinnerPage;
  let helpers: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    deepikaaugbidqa1csvButtonDivPage = new Deepikaaugbidqa1csvButtonDivPage(page);
    fileFormatNotAllowedDeepikaaugbidqa1pdfPage = new FileFormatNotAllowedDeepikaaugbidqa1pdfPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    headingCreateNewMapPage = new HeadingCreateNewMapPage(page);
    p2142530YrFreddieMacFixedDropdownPage = new P2142530YrFreddieMacFixedDropdownPage(page);
    selectAllCheckboxPage = new SelectAllCheckboxPage(page);
    spinnerPage = new SpinnerPage(page);
    helpers = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      log.step("Step 1: Login to CORR Portal");
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass("Step 1 passed: Logged in to CORR Portal successfully");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Failed to login to CORR Portal");
        throw error;
      }


      log.step("Step 2: Navigate to Administration menu and select Bid Maps");
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.Bid_Maps_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
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
        await correspondentPortalPage.Create_New_Map_Field.fill(vars["Create New Map"]);
        vars["BidMap"] = await correspondentPortalPage.Create_New_Map_Field.inputValue() || '';
        await correspondentPortalPage.Create_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(p2142530YrFreddieMacFixedDropdownPage.Bid_Maps_Name).toContainText(vars["Create New Map"]);
        log.stepPass("Step 3 passed: New Bid Map created successfully with name: " + vars["Create New Map"]);
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Failed to create new Bid Map");
        throw error;
      }

      log.step("Step 4: Select all companies from dropdown");
      try {
        await correspondentPortalPage.Select_Companys_Dropdown.click();
        await expect(correspondentPortalPage.Apply_Selected).toBeVisible();
        vars["CompanyCount"] = String(await correspondentPortalPage.Companies_In_Dropdown.count());
        await selectAllCheckboxPage.Select_All_Checkbox.check();
        await expect(correspondentPortalPage.Apply_Selected_for_Bid_Maps).toContainText(vars["CompanyCount"]);
        await correspondentPortalPage.Apply_Selected.click();
        await expect(correspondentPortalPage.Dropdown_selection_2).toHaveValue('');
        log.stepPass("Step 4 passed: All companies selected successfully");
      } catch (error) {
        log.stepFail(page, "Step 4 failed: Failed to select all companies");
        throw error;
      }

      log.step("Step 5: Upload and delete XLSX file");
      try {
        await uploadFile(page, correspondentPortalPage.Upload_File, "Bid_Maps_File.xlsx");
        await expect(deepikaaugbidqa1csvButtonDivPage.Delete_Button_in_Bid_Maps).toBeVisible();
        await deepikaaugbidqa1csvButtonDivPage.Delete_Button_in_Bid_Maps.click();
        await expect(correspondentPortalPage.close_pop_up_bid_request_details).toBeVisible();
        await expect(correspondentPortalPage.Are_you_sure_you_want_to_delete_fixed_from_enumeration).toBeVisible();
        await expect(correspondentPortalPage.Yes_Proceed_Button).toBeVisible();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        log.stepPass("Step 5 passed: XLSX file uploaded and deleted successfully");
      } catch (error) {
        log.stepFail(page, "Step 5 failed: Failed to upload or delete XLSX file");
        throw error;
      }

      log.step("Step 6: Upload and delete CSV file with cancel and confirm actions");
      try {
        await uploadFile(page, correspondentPortalPage.Upload_File, "Bid_Maps_File_CSV.csv");
        await expect(deepikaaugbidqa1csvButtonDivPage.Delete_Button_in_Bid_Maps).toBeVisible();
        await deepikaaugbidqa1csvButtonDivPage.Delete_Button_in_Bid_Maps.click();
        await expect(correspondentPortalPage.Are_you_sure_you_want_to_delete_fixed_from_enumeration).toBeVisible();
        await correspondentPortalPage.close_pop_up_bid_request_details.click();
        await deepikaaugbidqa1csvButtonDivPage.Delete_Button_in_Bid_Maps.click();
        await expect(correspondentPortalPage.Are_you_sure_you_want_to_delete_fixed_from_enumeration).toBeVisible();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        log.stepPass("Step 6 passed: CSV file uploaded and deleted successfully");
      } catch (error) {
        log.stepFail(page, "Step 6 failed: Failed to upload or delete CSV file");
        throw error;
      }

      log.step("Step 7: Upload and delete XLS file");
      try {
        await uploadFile(page, correspondentPortalPage.Upload_File, "Bid_Maps_File_XLS.xls");
        await expect(deepikaaugbidqa1csvButtonDivPage.Delete_Button_in_Bid_Maps).toBeVisible();
        await deepikaaugbidqa1csvButtonDivPage.Delete_Button_in_Bid_Maps.click();
        await expect(correspondentPortalPage.Are_you_sure_you_want_to_delete_fixed_from_enumeration).toBeVisible();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        log.stepPass("Step 7 passed: XLS file uploaded and deleted successfully");
      } catch (error) {
        log.stepFail(page, "Step 7 failed: Failed to upload or delete XLS file");
        throw error;
      }

      log.step("Step 8: Upload and delete TXT file");
      try {
        await uploadFile(page, correspondentPortalPage.Upload_File, "Bid_Maps_File_Txt.txt");
        await expect(deepikaaugbidqa1csvButtonDivPage.Delete_Button_in_Bid_Maps).toBeVisible();
        await deepikaaugbidqa1csvButtonDivPage.Delete_Button_in_Bid_Maps.click();
        await expect(correspondentPortalPage.Are_you_sure_you_want_to_delete_fixed_from_enumeration).toBeVisible();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        log.stepPass("Step 8 passed: TXT file uploaded and deleted successfully");
      } catch (error) {
        log.stepFail(page, "Step 8 failed: Failed to upload or delete TXT file");
        throw error;
      }
      
      log.step("Step 9: Upload PDF file and verify error message");
      try {
        await correspondentPortalPage.Upload_File.setInputFiles(path.join(process.cwd(), 'uploads', 'Bid_Maps_File_Pdf.pdf'));
        await expect(fileFormatNotAllowedDeepikaaugbidqa1pdfPage.Error_Message_in_Creation_Of_Bid_Maps).toBeVisible();
        log.stepPass("Step 9 passed: PDF file upload rejected and error message displayed successfully");
      } catch (error) {
        log.stepFail(page, "Step 9 failed: Failed to verify PDF upload rejection or error message");
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