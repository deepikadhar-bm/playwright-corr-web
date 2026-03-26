
// [POM-APPLIED]
import { test,expect} from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ActionruleheaderPage } from '../../../src/pages/correspondant/actionruleheader';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CompanybidmapPage } from '../../../src/pages/correspondant/companybidmap';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { FirstPagePage } from '../../../src/pages/correspondant/first-page';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { MapHeaderPage } from '../../../src/pages/correspondant/map-header';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { MapNameFieldInBidMapsPage } from '../../../src/pages/correspondant/map-name-field-in-bid-maps';
import { NewMapPage } from '../../../src/pages/correspondant/new-map';
import { P1MoreButtonPage } from '../../../src/pages/correspondant/p-1-more-button';
import { SaveDraftExitButtonPage } from '../../../src/pages/correspondant/save-draft-exit-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments'
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = "REG_TS14_TC01";
const TC_TITLE = "Verify that when the user performs the \\\"Save Draft and Exit\\\" action on each screen, a draft version is saved, and the user is redirected to the bid map list screen"

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let actionruleheaderPage: ActionruleheaderPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let companybidmapPage: CompanybidmapPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let firstPagePage: FirstPagePage;
  let headerMappingPage: HeaderMappingPage;
  let mapHeaderPage: MapHeaderPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let mapNameFieldInBidMapsPage: MapNameFieldInBidMapsPage;
  let newMapPage: NewMapPage;
  let p1MoreButtonPage: P1MoreButtonPage;
  let saveDraftExitButtonPage: SaveDraftExitButtonPage;
  let spinnerPage: SpinnerPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    actionruleheaderPage = new ActionruleheaderPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    companybidmapPage = new CompanybidmapPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    firstPagePage = new FirstPagePage(page);
    headerMappingPage = new HeaderMappingPage(page);
    mapHeaderPage = new MapHeaderPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    mapNameFieldInBidMapsPage = new MapNameFieldInBidMapsPage(page);
    newMapPage = new NewMapPage(page);
    p1MoreButtonPage = new P1MoreButtonPage(page);
    saveDraftExitButtonPage = new SaveDraftExitButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {
      log.step("Step 1: Prepare data and login");
      try {
        if (profile && profile.data) {
          vars["Company name 1"] = profile.data[0]["CompanyName1"];
          vars["CustomHeader"] = profile.data[0]["CustomHeader"];
          vars["ChaseFieldNames"] = profile.data[0]["ChaseFieldNames"];
          vars["Chase_Field_Name"] = profile.data[0]["Chase_Field_Name"];
          vars["Username"] = credentials.username;
          vars["Password"] = credentials.password;
          log.info(`Company: ${vars["Company name 1"]}`);
        }
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        vars["Companyname"] = vars["Company name 1"];
        await stepGroups.stepGroup_Creating_New_BidMap_Upto_Upload_File(page, vars);
        vars["SelectedCompanyName"] = await newMapPage.Individual_Selected_Company.textContent() || '';
        // vars["ExecutionType"] = await mapHeaderPage.Execution_Type_Dropdown_New.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        vars["UploadedFileName"] = await firstPagePage.Uploaded_File_Name.textContent() || '';
        log.info(`SelectedCompanyName: ${vars["SelectedCompanyName"]}`);
        log.info(`UploadedFileName: ${vars["UploadedFileName"]}`);
        log.stepPass("Step 1 passed");
      } catch (error) {
        log.stepFail(page, "Step 1 failed");
        throw error;
      }

      log.step("Step 2: Save draft from first screen and validate");
      try {
        await page.pause();
        await saveDraftExitButtonPage.Save_Draft_Exit_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await mapNameFieldInBidMapsPage.get_Bid_Map_Name_Field_In_Row(vars["CreateNewMap"]).click();
        await mapHeadersButtonPage.Map_Headers_Button.waitFor({ state: 'visible' });
        await expect(companybidmapPage.New_Map_Name).toHaveValue(vars["CreateNewMap"]);
        await expect(newMapPage.Individual_Selected_Company).toContainText(vars["SelectedCompanyName"]);
        vars["ExecutionType"] = await mapHeaderPage.Execution_Type_Dropdown_New.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        log.info(`ExecutionType: ${vars["ExecutionType"]}`);
        await expect(mapHeaderPage.Execution_Type_Dropdown_New).toHaveValue(vars["ExecutionType"]);
        await expect(p1MoreButtonPage.Uploaded_FileName).toContainText(vars["UploadedFileName"]);
        log.stepPass("Step 2 passed");
      } catch (error) {
        log.stepFail(page, "Step 2 failed");
        throw error;
      }

      log.step("Step 3: Perform header mapping actions and save draft");
      try {
        await mapHeadersButtonPage.Map_Headers_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Enumeration_Mapping_Button1.waitFor({ state: 'visible' });
        await stepGroups.stepGroup_Creating_New_Header_In_Header_Mapping_Screen(page, vars);
        await stepGroups.stepGroup_Editing_Header_Mapping(page, vars);
        vars["DeletedHeader[HeaderMapping]"] = await headerMappingPage.Deleting_Header.textContent() || '';
        log.info(`DeletedHeader: ${vars["DeletedHeader[HeaderMapping]"]}`);
        await stepGroups.stepGroup_Delete_a_Header_In_Header_Mapping(page, vars);
        await headerMappingPage.First_Header_Checkbox.check();
        vars["FirstHeaderName"] = await headerMappingPage.First_Header_Bid_Sample_Name.textContent() || '';
        await actionruleheaderPage.Second_Header_Checkbox.check();
        vars["SecondHeaderName"] = await headerMappingPage.Second_Header_Bid_Sample_Name.textContent() || '';
        log.info(`FirstHeaderName: ${vars["FirstHeaderName"]}`);
        log.info(`SecondHeaderName: ${vars["SecondHeaderName"]}`);
        await expect(saveDraftExitButtonPage.Save_Draft_Exit_Button).toBeVisible();
        await saveDraftExitButtonPage.Save_Draft_Exit_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass("Step 3 passed");
      } catch (error) {
        log.stepFail(page, "Step 3 failed");
        throw error;
      }

      log.step("Step 4: Reopen and validate header mapping persistence");
      try {
        await expect(mapNameFieldInBidMapsPage.get_Bid_Map_Name_Field_In_Row(vars["CreateNewMap"])).toBeVisible();
        await mapNameFieldInBidMapsPage.get_Bid_Map_Name_Field_In_Row(vars["CreateNewMap"]).click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await mapHeadersButtonPage.Map_Headers_Button.waitFor({ state: 'visible' });
        await mapHeadersButtonPage.Map_Headers_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.waitFor({ state: 'visible' });
        await expect(headerMappingPage.Custom_Header).toBeVisible();
        await expect(headerMappingPage.Custom_Header).toContainText(vars["customheadername"]);
        vars["CustomHeaderChaseValue"] = await headerMappingPage.Custom_Header_Chase_Value.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        log.info(`CustomHeaderChaseValue: ${vars["CustomHeaderChaseValue"]}`);
        expect(String(vars["clmfieldname"])).toBe(vars["CustomHeaderChaseValue"]);
        await expect(headerMappingPage.get_Updated_BidSample_Name(vars["UpdatedBidSampleName[HeaderMapping]"])).toContainText(vars["UpdatedBidSampleName[HeaderMapping]"]);
        vars["ChaseFieldNameHeaderMapping"] = await headerMappingPage.get_Updated_Element_In_Header_Mapping(vars["UpdatedBidSampleName[HeaderMapping]"]).getAttribute('title') || '';
        expect(String(vars["ChaseFieldNameHeaderMapping"])).toBe(vars["UpdatedChaseFieldNameHeaderMapping"]);
        await expect(headerMappingPage.get_Deleted_Header_In_HeaderMaping(vars["DeletedHeader[HeaderMapping]"])).not.toBeVisible();
        await expect(headerMappingPage.get_Header_1(vars["FirstHeaderName"])).toBeChecked();
        await expect(chaseFieldNamePage.get_Header_2(vars["SecondHeaderName"])).toBeChecked();
        log.stepPass("Step 4 passed");
      } catch (error) {
        log.stepFail(page, "Step 4 failed");
        throw error;
      }

      log.step("Step 5: Modify checkbox state and verify after save draft");
      try {
        await headerMappingPage.get_Header_1(vars["FirstHeaderName"]).uncheck();
        await expect(headerMappingPage.get_Header_1(vars["FirstHeaderName"])).not.toBeChecked();
        await saveDraftExitButtonPage.Save_Draft_Exit_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await mapNameFieldInBidMapsPage.get_Bid_Map_Name_Field_In_Row(vars["CreateNewMap"]).click();
        await expect(page.getByText(vars["CreateNewMap"])).toBeVisible();
        await mapHeadersButtonPage.Map_Headers_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(headerMappingPage.get_Header_1(vars["FirstHeaderName"])).not.toBeChecked();
        await expect(chaseFieldNamePage.get_Header_2(vars["SecondHeaderName"])).toBeChecked();
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