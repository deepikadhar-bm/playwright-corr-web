import { test, expect } from '@playwright/test';
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
import { NewMapPage } from '../../../src/pages/correspondant/new-map';
import { P1MoreButtonPage } from '../../../src/pages/correspondant/p-1-more-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';
import { AddonHelpers } from '@helpers/AddonHelpers';


const TC_ID = 'REG_TS13_TC01';
const TC_TITLE = 'Verify that when the user performs the "Save Draft" action on each screen, a draft version is saved.[New Bid Map & Header Mapping]';

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
  let newMapPage: NewMapPage;
  let p1MoreButtonPage: P1MoreButtonPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  const credentials = ENV.getCredentials('internal');

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    actionruleheaderPage = new ActionruleheaderPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    companybidmapPage = new CompanybidmapPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    firstPagePage = new FirstPagePage(page);
    headerMappingPage = new HeaderMappingPage(page);
    mapHeaderPage = new MapHeaderPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    newMapPage = new NewMapPage(page);
    p1MoreButtonPage = new P1MoreButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    if (profile && profile.data) {
      vars["Company name 1"] = profile.data[0]['CompanyName1'];
      vars["New Rule Name"] = profile.data[0]['New Rule Name'];
      vars["Rule Name"] = profile.data[0]['Rule Name'];
      vars["Duplicated Rule Name"] = profile.data[0]['Duplicated Rule Name'];
      vars["Condition Bid Field"] = profile.data[0]['Condition Bid Field'];
      vars["Operation1"] = profile.data[0]['Operation1'];
      vars["Operation2"] = profile.data[0]['Operation2'];
      vars['ChaseFieldNames']=profile.data[0]['ChaseFieldNames'];
      vars["CustomHeader"]=profile.data[0]['Custom Header'];
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

      log.step('Enable Smart Mapper and create new Bid Map up to file upload');
      try {
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        vars["Companyname"] = vars["Company name 1"];
        await stepGroups.stepGroup_Creating_New_BidMap_Upto_Upload_File(page, vars);
        vars["EditedMapName"] = vars["CreateNewMap"];
        vars["SelectedCompanyName"] = await newMapPage.Individual_Selected_Company.textContent() || '';
        vars["ExecutionType"] = await mapHeaderPage.Execution_Type_Dropdown_New.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        vars["UploadedFileName"] = await firstPagePage.Uploaded_File_Name.textContent() || '';
        log.stepPass('Smart Mapper enabled and Bid Map created up to file upload. Map: ' + vars["EditedMapName"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to enable Smart Mapper or create Bid Map');
        throw e;
      }

      log.step('Save Draft on New Map screen and verify saved values');
      try {
        await correspondentPortalPage.Save_Draft_Button1.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await mapHeadersButtonPage.Map_Headers_Button.waitFor({ state: 'visible' });
        await expect(companybidmapPage.New_Map_Name1).toHaveValue(vars["CreateNewMap"]);
          // await expect(newMapPage.Individual_Selected_Company.locator('option:checked')).toHaveText(vars["SelectedCompanyName"]);
          await expect(newMapPage.Individual_Selected_Company).toContainText(vars["SelectedCompanyName"]);
        await expect(mapHeaderPage.Execution_Type_Dropdown_New.locator('option:checked')).toHaveText(vars["ExecutionType"]);
        await expect(p1MoreButtonPage.Uploaded_FileName).toContainText(vars["UploadedFileName"]);
        log.stepPass('Draft saved and verified: Map Name, Company, Execution Type, and File Name match');
      } catch (e) {
        await log.stepFail(page, 'Draft verification failed on New Map screen');
        throw e;
      }

      log.step('Edit New Map fields after Save Draft and navigate to Header Mapping');
      try {
        await stepGroups.stepGroup_Editing_In_New_Map_After_Save_draft(page, vars);
        vars["CreateNewMap"] = vars["EditedMapName"];
        await mapHeadersButtonPage.Map_Headers_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Enumeration_Mapping_Button1.waitFor({ state: 'visible' });
        log.stepPass('New Map edited and navigated to Header Mapping screen');
      } catch (e) {
        await log.stepFail(page, 'Failed to edit New Map or navigate to Header Mapping');
        throw e;
      }

      log.step('Create new header, edit header mapping, and delete a header');
      try {
        vars['Chase_Field_Name']=vars['ChaseFieldNames'];
        await stepGroups.stepGroup_Creating_New_Header_In_Header_Mapping_Screen(page, vars);
         if (profile && profile.data) {
        vars['Chase_Field_Name']=profile.data[0]['Chase_Field_Name'];
         }
        await stepGroups.stepGroup_Editing_Header_Mapping(page, vars);
        vars["UpdatedBidSampleNameHeaderMapping"]=vars['UpdatedBidSampleName[HeaderMapping]'];
        vars["DeletedHeaderHeaderMapping"] = await headerMappingPage.Deleting_Header.textContent() || '';
        await stepGroups.stepGroup_Delete_a_Header_In_Header_Mapping(page, vars);
        log.stepPass('Header created, edited, and deleted. Deleted header: ' + vars["DeletedHeaderHeaderMapping"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to create, edit, or delete header in Header Mapping');
        throw e;
      }

      log.step('Select headers and Save Draft on Header Mapping screen');
      try {
        await headerMappingPage.First_Header_Checkbox.check();
        vars["FirstHeaderName"] = await headerMappingPage.First_Header_Bid_Sample_Name.textContent() || '';
        await actionruleheaderPage.Second_Header_Checkbox.check();
        vars["SecondHeaderName"] = await headerMappingPage.Second_Header_Bid_Sample_Name.textContent() || '';
        await expect(correspondentPortalPage.Save_Draft_Button1).toBeVisible();
        await correspondentPortalPage.Save_Draft_Button1.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.waitFor({ state: 'visible' });
        log.stepPass('Headers selected and Draft saved. First: ' + vars["FirstHeaderName"] + ', Second: ' + vars["SecondHeaderName"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to select headers or Save Draft on Header Mapping screen');
        throw e;
      }

      log.step('Verify Header Mapping draft values are preserved');
      try {
        await expect(headerMappingPage.Custom_Header).toBeVisible();
        await expect(headerMappingPage.Custom_Header).toContainText(vars["customheadername"]);
        vars["CustomHeaderChaseValue"] = await headerMappingPage.Custom_Header_Chase_Value.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        // expect(String(vars["clmfieldname"])).toBe(vars["CustomHeaderChaseValue"]);
        Methods.verifyString(vars['clmfieldname'],'equals',vars["CustomHeaderChaseValue"]);
        await expect(headerMappingPage.get_Updated_BidSample_Name(vars['UpdatedBidSampleNameHeaderMapping'])).toContainText(vars["UpdatedBidSampleNameHeaderMapping"]);
        vars["ChaseFieldNameHeaderMapping"] = await headerMappingPage.get_Updated_Element_In_Header_Mapping(vars['UpdatedBidSampleNameHeaderMapping']).getAttribute('title') || '';
        Methods.verifyString(vars['ChaseFieldNameHeaderMapping'],'equals',vars["UpdatedChaseFieldNameHeaderMapping"]);
        await expect(headerMappingPage.get_Deleted_Header_In_HeaderMaping(vars['DeletedHeaderHeaderMapping'])).not.toBeVisible();
        await expect(headerMappingPage.get_Header_1(vars['FirstHeaderName'])).toBeChecked();
        await expect(chaseFieldNamePage.get_Header_2(vars['SecondHeaderName'])).toBeChecked();
        log.stepPass('Header Mapping draft verified: Custom Header, Chase Value, BidSample Name, and Chase Field Name match');
      } catch (e) {
        await log.stepFail(page, 'Header Mapping draft verification failed');
        throw e;
      }

      log.step('Uncheck first header, Save Draft, and verify headers remain visible');
      try {
        await headerMappingPage.get_Header_1(vars['FirstHeaderName']).uncheck();
        await expect(headerMappingPage.get_Header_1(vars['FirstHeaderName'])).not.toBeChecked();
        await correspondentPortalPage.Save_Draft_Button1.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(headerMappingPage.get_Header_1(vars['FirstHeaderName'])).not.toBeChecked();
        await expect(chaseFieldNamePage.get_Header_2(vars['SecondHeaderName'])).toBeChecked();
        log.stepPass('Header unchecked, Draft saved, and headers are still visible');
      } catch (e) {
        await log.stepFail(page, 'Failed to uncheck header or verify headers after Save Draft');
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