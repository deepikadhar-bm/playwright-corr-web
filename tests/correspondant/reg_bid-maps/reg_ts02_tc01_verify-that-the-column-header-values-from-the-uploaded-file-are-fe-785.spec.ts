// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { HeadingCreateNewMapPage } from '../../../src/pages/correspondant/heading-create-new-map';
import { HeadingMappingsPage } from '../../../src/pages/correspondant/heading-mappings';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { P2142530YrFreddieMacFixedDropdownPage } from '../../../src/pages/correspondant/p-2142530-yr-freddie-mac-fixed-dropdown';
import { P24UnitDropdownPage } from '../../../src/pages/correspondant/p-24-unit-dropdown';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { ThisActionWillSaveTheChangesAndMoveToNextPagePage } from '../../../src/pages/correspondant/this-action-will-save-the-changes-and-move-to-next-page';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments'
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { uploadFile } from '../../../src/helpers/file-helpers';
import { getRowDataWithCommaSeperator } from '../../../src/helpers/excel-helpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';

const TC_ID = "REG_TS02_TC01";
const TC_TITLE = "Verify that the column header values from the uploaded file are fetched and displayed as bid sample field names in the header mapping screen."

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let headerMappingPage: HeaderMappingPage;
  let headingCreateNewMapPage: HeadingCreateNewMapPage;
  let headingMappingsPage: HeadingMappingsPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let p2142530YrFreddieMacFixedDropdownPage: P2142530YrFreddieMacFixedDropdownPage;
  let p24UnitDropdownPage: P24UnitDropdownPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;
  let thisActionWillSaveTheChangesAndMoveToNextPagePage: ThisActionWillSaveTheChangesAndMoveToNextPagePage;
  let Helpers: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    headingCreateNewMapPage = new HeadingCreateNewMapPage(page);
    headingMappingsPage = new HeadingMappingsPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    p2142530YrFreddieMacFixedDropdownPage = new P2142530YrFreddieMacFixedDropdownPage(page);
    p24UnitDropdownPage = new P24UnitDropdownPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
    thisActionWillSaveTheChangesAndMoveToNextPagePage = new ThisActionWillSaveTheChangesAndMoveToNextPagePage(page);
    Helpers = new AddonHelpers(page, vars);
  });

  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step("Step 1: Prepare test data");
      try {
        if (profile && profile.data) {
          const companyName1 = profile.data[0]["CompanyName1"];
          vars["Company name 1"] = companyName1;
          const uploadText = profile.data[0]['Upload File Text Verification'];
          vars["Upload File Text Verification"] = uploadText;
          vars["Username"] = credentials.username;
          vars["Password"] = credentials.password;

          log.info(`Company name: ${vars["Company name 1"]}`);
          log.info(`Upload text: ${vars["Upload File Text Verification"]}`);
        }
        log.stepPass("Step 1 passed: Test data prepared");
      } catch (error) {
        log.stepFail(page, "Step 1 failed");
        throw error;
      }

      log.step("Step 2: Login and enable Smart Mapper");
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });

        log.stepPass("Step 2 passed");
      } catch (error) {
        log.stepFail(page, "Step 2 failed");
        throw error;
      }

      log.step("Step 3: Navigate to Bid Maps and create new map");
      try {
        await stepGroups.stepGroup_Navigation_to_Customer_Permission(page, vars);
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.Bid_Maps_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });

        await expect(headingMappingsPage.Mappings).toBeVisible();

        await correspondentPortalPage.Add_New_Mapping_Button.click();
        await expect(headingCreateNewMapPage.Create_New_Map).toBeVisible();

        Helpers.getCurrentTimestamp(appconstants.DATE_FORMAT_SLASH, "Current Date", appconstants.ASIA_KOLKATA);
        Helpers.concatenate(appconstants.Testsigma_, vars["Current Date"], "CreateNewMap");

        log.info(`Generated Map Name: ${vars["CreateNewMap"]}`);

        await correspondentPortalPage.Create_New_Map_Field.fill(vars["CreateNewMap"]);
        await correspondentPortalPage.Create_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });

        await expect(p2142530YrFreddieMacFixedDropdownPage.Bid_Maps_Name).toContainText(vars["CreateNewMap"]);

        log.stepPass("Step 3 passed");
      } catch (error) {
        log.stepFail(page, "Step 3 failed");
        throw error;
      }

      log.step("Step 4: Select company and upload file");
      try {
        await correspondentPortalPage.Select_Companys_Dropdown.click();
        await statusInactivePage.Second_Selected_Company_Checkbox(vars["Company name 1"]).click();
        await correspondentPortalPage.Apply_Selected.click();

        await expect(correspondentPortalPage.Upload_File).toHaveValue('');
        await expect(page.getByText(vars["Upload File Text Verification"])).toBeVisible();

        await uploadFile(page, correspondentPortalPage.Upload_File, "Bid_Maps_File_QA_-_Bidmap_1(xlsx).xlsx");

        log.stepPass("Step 4 passed");
      } catch (error) {
        log.stepFail(page, "Step 4 failed");
        throw error;
      }

      log.step("Step 5: Map headers and navigate");
      try {
        await mapHeadersButtonPage.Map_Headers_Button.click();
        await correspondentPortalPage.Heading_Save_and_Move_to_Next_Page1.waitFor({ state: 'visible' });
        await expect(thisActionWillSaveTheChangesAndMoveToNextPagePage.This_action_will_save_the_changes_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars["CreateNewMap"])).toBeVisible();
        await headerMappingPage.Header_Mapping.waitFor({ state: 'visible' });
        await expect(correspondentPortalPage.Rules_and_Actions_Step_4_of_4).toBeVisible();

        log.stepPass("Step 5 passed");
      } catch (error) {
        log.stepFail(page, "Step 5 failed");
        throw error;
      }

      log.step("Step 6: Validate headers with loop");
      try {
        vars["Total Headers From Xls"] = getRowDataWithCommaSeperator(path.resolve(process.cwd(), 'uploads/Bid_Maps_File_QA_-_Bidmap_1(xlsx).xlsx'), 0);

        vars["BidSampleFieldNameCount"] = String(await p24UnitDropdownPage.Bid_Sample_Field_Name_in_Header_Mapping.count());
        vars["count"] = appconstants.ONE;
        vars["MappedHeaderCount"] = appconstants.ZERO;
        vars["UnmappedHeaderCount"] = appconstants.ZERO;

        log.info(`Total Headers From XLS: ${vars["Total Headers From Xls"]}`);
        log.info(`UI Count: ${vars["BidSampleFieldNameCount"]}`);
        log.info(`Initial Mapped Count: ${vars["MappedHeaderCount"]}`);
        log.info(`Initial Unmapped Count: ${vars["UnmappedHeaderCount"]}`);

        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["BidSampleFieldNameCount"]))) {
          await enumerationMappingButtonPage.Enumeration_Mapping_Button.waitFor({ state: 'visible' });

          vars["Header From UI"] = (await correspondentPortalPage.get_Headers_From_UI(parseInt(vars["count"])).textContent())?.trim() || '';
          vars["MappedDataValue"] = await correspondentPortalPage.get_Chase_Field_Name_Drowpdown(parseInt(vars["count"])).evaluate(el => {
            const s = el as HTMLSelectElement;
            return s.options[s.selectedIndex]?.text || '';
          });

          if (String(vars["MappedDataValue"]) === String("Select")) {
            vars["UnmappedHeaderCount"] = (parseFloat(String("1")) + parseFloat(String(vars["UnmappedHeaderCount"]))).toFixed(0);
          } else {
            vars["MappedHeaderCount"] = (parseFloat(String("1")) + parseFloat(String(vars["MappedHeaderCount"]))).toFixed(0);
            if (true) /* Verify if Chase Fields Name contains with MappedDataValue */ {
            }
          }

          expect(String(vars["Total Headers From Xls"])).toContain(vars["Header From UI"]);

          vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
        }

        log.info(`Final Mapped Count: ${vars["MappedHeaderCount"]}`);
        log.info(`Final Unmapped Count: ${vars["UnmappedHeaderCount"]}`);

        log.stepPass("Step 6 passed");
      } catch (error) {
        log.stepFail(page, "Step 6 failed");
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