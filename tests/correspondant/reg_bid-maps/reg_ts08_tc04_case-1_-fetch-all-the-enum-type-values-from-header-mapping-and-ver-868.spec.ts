import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { CorrespondentPortal16Page } from '../../../src/pages/correspondant/correspondent-portal-16';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { EnumerationMappingPage } from '../../../src/pages/correspondant/enumeration-mapping';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { ThisActionWillSaveTheChangesAndMoveToNextPagePage } from '../../../src/pages/correspondant/this-action-will-save-the-changes-and-move-to-next-page';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';
import { uploadFile } from '../../../src/helpers/file-helpers';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS08_TC04_CASE-1';
const TC_TITLE = 'Fetch all the enum type values from Header Mapping and verify that it should be present in Enumeration Mapping.';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let bidmapPage: BidmapPage;
  let correspondentPortal16Page: CorrespondentPortal16Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let enumerationMappingPage: EnumerationMappingPage;
  let headerMappingPage: HeaderMappingPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;
  let thisActionWillSaveTheChangesAndMoveToNextPagePage: ThisActionWillSaveTheChangesAndMoveToNextPagePage;
  let Methods: AddonHelpers;

  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    bidmapPage = new BidmapPage(page);
    correspondentPortal16Page = new CorrespondentPortal16Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    enumerationMappingPage = new EnumerationMappingPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
    thisActionWillSaveTheChangesAndMoveToNextPagePage = new ThisActionWillSaveTheChangesAndMoveToNextPagePage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Login to CORR portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login successful');
      } catch (e) {
        await log.stepFail(page, 'Login failed');
        throw e;
      }

      log.step('Enable Smart Mapper and create new Bid Map');
      try {
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        await stepGroups.stepGroup_Creation_Of_New_Map(page, vars);
        log.stepPass('Smart Mapper enabled and new Bid Map created');
      } catch (e) {
        await log.stepFail(page, 'Failed to enable Smart Mapper or create new Bid Map');
        throw e;
      }

      log.step('Upload file and navigate to Header Mapping');
      try {
        // await correspondentPortalPage.Execution_Type_Dropdown.selectOption({ value: appconstants.EXECUTION_TYPE_STANDARD });
        // await expect(correspondentPortalPage.Execution_Type_Dropdown.locator('option:checked')).toHaveText(appconstants.EXECUTION_TYPE_STANDARD);
        // await headerMappingPage.File_Input.setInputFiles(path.resolve(__dirname, 'test-data', "Bid Maps File.xlsx"));
        await uploadFile(page, correspondentPortalPage.Upload_File, fileconstants.Bid_Maps_File);
        await correspondentPortal16Page.File_Field.hover();
        await mapHeadersButtonPage.Map_Headers_Button.click();
        await expect(thisActionWillSaveTheChangesAndMoveToNextPagePage.This_action_will_save_the_changes_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.waitForTimeout(3000);
        log.stepPass('File uploaded and navigated to Header Mapping screen');
      } catch (e) {
        await log.stepFail(page, 'Failed to upload file or navigate to Header Mapping');
        throw e;
      }

      log.step('Fetch enum type values from Header Mapping');
      try {
        await stepGroups.stepGroup_Fetching_the_data_based_on_Enum_value_in_Header_Mapping_and_(page, vars);
        log.stepPass('Enum type values fetched from Header Mapping');
      } catch (e) {
        await log.stepFail(page, 'Failed to fetch enum type values from Header Mapping');
        throw e;
      }

      log.step('Navigate to Enumeration Mapping and handle proceed dialog');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
        if (await bidmapPage.Yes_Proceed_Button_Text.isVisible()) {
          log.info('Yes Proceed Button is visible — clicking to proceed');
          await bidmapPage.Yes_Proceed_Button_Text.click();
        } else {
          log.info('Yes Proceed Button not visible — clicking Proceed with Saving');
          await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        }
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Enumeration Mapping screen');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Enumeration Mapping screen');
        throw e;
      }

      log.step('Verify enum values from Header Mapping are present in Enumeration Mapping');
      try {
        await stepGroups.stepGroup_Verification_of_Chase_Enum_Values_From_Header_Mapping_To_Cha(page, vars);
        vars["Chase Enum Namescount2"] = String(await enumerationMappingPage.Chase_Enum_Names.count());
        log.info('Chase Enum Names count: ' + vars["Chase Enum Namescount2"]);
        const profileName = 'Bid sample name and Chase Value from header mapping';
        const profile = testDataManager.getProfileByName(profileName);
        const dataList = profile?.data as Record<string, any>[];
        for (let i = 0; i < Number(vars["Chase Enum Namescount2"]); i++) {
          log.info('Verifying row dataIdx: ' + i);
          vars['BidSampleField'] = dataList[i]['Bid Sample Field'];
          vars['Chasevaluename'] = dataList[i]['Chase value name'];
          await expect(statusInactivePage.Checking_both_chase_field_to_bid_sample_field_is_mapping(vars['Chasevaluename'], vars['BidSampleField'])).toBeVisible();
        }
        log.stepPass('All enum values from Header Mapping verified in Enumeration Mapping. Count: ' + vars["Chase Enum Namescount2"]);
      } catch (e) {
        await log.stepFail(page, 'Enum value verification failed in Enumeration Mapping');
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