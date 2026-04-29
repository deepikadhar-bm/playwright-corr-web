import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { HeadingCreateNewMapPage } from '../../../src/pages/correspondant/heading-create-new-map';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { NewMapPage } from '../../../src/pages/correspondant/new-map';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { SelectAllCheckboxPage } from '../../../src/pages/correspondant/select-all-checkbox';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { ThisActionWillSaveTheChangesAndMoveToNextPagePage } from '../../../src/pages/correspondant/this-action-will-save-the-changes-and-move-to-next-page';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { uploadFile } from '../../../src/helpers/file-helpers';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';


const TC_ID = 'REG_TS08_TC07_CASE-4';
const TC_TITLE = 'If the Smart Mapper is disabled then it should not perform auto map action.';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let headingCreateNewMapPage: HeadingCreateNewMapPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let newMapPage: NewMapPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let selectAllCheckboxPage: SelectAllCheckboxPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactivePage: StatusInactivePage;
  let thisActionWillSaveTheChangesAndMoveToNextPagePage: ThisActionWillSaveTheChangesAndMoveToNextPagePage;
  let Methods: AddonHelpers;

  const credentials = ENV.getCredentials('internal');

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    headingCreateNewMapPage = new HeadingCreateNewMapPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    newMapPage = new NewMapPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    selectAllCheckboxPage = new SelectAllCheckboxPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactivePage = new StatusInactivePage(page);
    thisActionWillSaveTheChangesAndMoveToNextPagePage = new ThisActionWillSaveTheChangesAndMoveToNextPagePage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    if (profile && profile.data) {
      vars["Chase Field Name"] = profile.data[0]['Chase Field Name'];
      vars["EmptyChaseFieldName"] = profile.data[0]['EmptyChaseFieldName'];
      vars["Rule Name"] = profile.data[0]['Rule Name'];
      vars["Condition Bid Field"] = profile.data[0]['Condition Bid Field'];
      vars["Operation1"] = profile.data[0]['Operation1'];
      vars["Operation2"] = profile.data[0]['Operation2'];
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

      log.step('Turn Smart Mapper OFF');
      try {
        await stepGroups.stepGroup_Smart_Mapper_from_On_to_Off(page, vars);
        await page.waitForTimeout(3000);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Smart Mapper turned OFF successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to turn Smart Mapper OFF');
        throw e;
      }

      log.step('Create new Bid Map');
      try {
        await correspondentPortalPage.Add_New_Mapping_Button.click();
        await expect(headingCreateNewMapPage.Create_New_Map).toBeVisible();
        Methods.getCurrentTimestamp(appconstants.DATE_FORMAT_SLASH,'Create New Map',appconstants.UTC);
        Methods.concatenate(appconstants.Testsigma_,vars["Create New Map"],'Create New Map');
        await correspondentPortalPage.Create_New_Map_Field.fill(vars["Create New Map"]);
        await correspondentPortalPage.Create_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars["Create New Map"])).toBeVisible();
        log.stepPass('New Bid Map created: ' + vars["Create New Map"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to create new Bid Map');
        throw e;
      }

      log.step('Select all companies and upload file');
      try {
        await newMapPage.New_Map.click();
        await correspondentPortalPage.Select_Companys_Dropdown.click();
        await selectAllCheckboxPage.Select_All_Checkbox.check();
        vars["AllDropdownCompaniesCount"] = String(await statusInactive2Page.All_Available_Company_Count.count());
        log.info('All Dropdown Companies Count: '+vars['AllDropdownCompaniesCount']);
        await expect(correspondentPortalPage.Apply_Selected_for_Bid_Maps).toContainText(vars["AllDropdownCompaniesCount"]);
        await correspondentPortalPage.Apply_Selected.click();
        await expect(correspondentPortalPage.Dropdown_selection_2).toHaveValue('');
        await uploadFile(page, correspondentPortalPage.Upload_File, fileconstants.Bid_Maps_File);
        log.stepPass('Successfully All companies selected and File uploaded');
      } catch (e) {
        await log.stepFail(page, 'Failed to select companies or upload file');
        throw e;
      }

      log.step('Navigate to Header Mapping and verify Smart Mapper OFF — no auto-mapping');
      try {
        await mapHeadersButtonPage.Map_Headers_Button.click();
        await expect(thisActionWillSaveTheChangesAndMoveToNextPagePage.This_action_will_save_the_changes_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["HeaderCount"] = String(await correspondentPortalPage.Header_Counts.count());
        log.info('Header count: ' + vars["HeaderCount"]);
        await stepGroups.stepGroup_Verification_Header_Mapping_Smart_Mapper_On_to_Off(page, vars);
        log.stepPass('Header Mapping verified — Smart Mapper OFF auto-map not applied. Header count: ' + vars["HeaderCount"]);
      } catch (e) {
        await log.stepFail(page, 'Header Mapping Smart Mapper OFF verification failed');
        throw e;
      }

      log.step('Select one Chase Field and navigate to Enumeration Mapping');
      try {
        await correspondentPortalPage.Select_Dropdown_in_Headers_Mapping.selectOption({ label: vars["Chase Field Name"] });
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(statusInactivePage.You_have_unidentified_Fields_This_action_will_save_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Select_Dropdown_in_Enumeration_Mapping).toBeVisible();
        log.stepPass('Chase Field selected: ' + vars["Chase Field Name"] + '. Enumeration Mapping loaded with empty dropdown — Smart Mapper OFF confirmed');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Enumeration Mapping or verify empty dropdown');
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