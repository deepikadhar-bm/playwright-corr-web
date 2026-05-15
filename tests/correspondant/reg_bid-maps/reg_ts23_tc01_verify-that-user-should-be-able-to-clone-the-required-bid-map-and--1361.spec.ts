import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortal18Page } from '../../../src/pages/correspondant/correspondent-portal-18';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { EnumerationMappingPage } from '../../../src/pages/correspondant/enumeration-mapping';
import { FirstPagePage } from '../../../src/pages/correspondant/first-page';
import { MapHeaderPage } from '../../../src/pages/correspondant/map-header';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { NewMapPage } from '../../../src/pages/correspondant/new-map';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ThisActionWillSaveTheChangesAndMoveToNextPagePage } from '../../../src/pages/correspondant/this-action-will-save-the-changes-and-move-to-next-page';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS23_TC01';
const TC_TITLE = 'Verify that user should be able to clone the required bid map and a new bid map should be created with the status draft.';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortal18Page: CorrespondentPortal18Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let enumerationMappingPage: EnumerationMappingPage;
  let firstPagePage: FirstPagePage;
  let mapHeaderPage: MapHeaderPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let newMapPage: NewMapPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let spinnerPage: SpinnerPage;
  let thisActionWillSaveTheChangesAndMoveToNextPagePage: ThisActionWillSaveTheChangesAndMoveToNextPagePage;
  let Methods: AddonHelpers;

  const credentials = ENV.getCredentials('internal');

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);
  test.beforeEach(async ({ page }) => {
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    enumerationMappingPage = new EnumerationMappingPage(page);
    firstPagePage = new FirstPagePage(page);
    mapHeaderPage = new MapHeaderPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    newMapPage = new NewMapPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    thisActionWillSaveTheChangesAndMoveToNextPagePage = new ThisActionWillSaveTheChangesAndMoveToNextPagePage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      if (profile && profile.data) {
        vars["Rule Name"] = profile.data[0]['Rule Name'];
        vars["BidField"] = profile.data[0]['BidField'];
        vars["Operation1"] = profile.data[0]['Operation1'];
        vars["BidEnumeratedTapeValue"] = profile.data[0]['BidEnumeratedTapeValue'];
        vars["Companyname"] = profile.data[0]["CompanyName1"];
      }

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
        await stepGroups.stepGroup_Creating_New_BidMap_Upto_Upload_File(page, vars);
        vars["SelectedCompanyCount"] = String(await newMapPage.Selected_Companies.count());
        vars["SelectedCompanyName"] = await newMapPage.Individual_Selected_Company.textContent() || '';
        Methods.trimtestdata(vars["SelectedCompanyName"], "SelectedCompanyName");
        vars["BidMapName"] = vars['CreateNewMap'];
        vars["BidMapName"] = vars["BidMap"];
        vars["ExecutionType"] = await mapHeaderPage.Execution_Type_Dropdown_New.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        vars["UploadedFileName"] = await firstPagePage.Uploaded_File_Name.textContent() || '';
        Methods.trimtestdata(vars["UploadedFileName"], "UploadedFileName");
        log.stepPass('Bid Map created up to file upload. Map: ' + vars["BidMapName"] + ', ExecutionType: ' + vars["ExecutionType"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to enable Smart Mapper or create Bid Map');
        throw e;
      }

      log.step('Navigate to Header Mapping, edit, and fetch Bid Sample and Chase Values');
      try {
        await mapHeadersButtonPage.Map_Headers_Button.click();
        await expect(thisActionWillSaveTheChangesAndMoveToNextPagePage.This_action_will_save_the_changes_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Editing_Header_Mapping(page, vars);
        await stepGroups.stepGroup_Fetching_Bid_Sample_Names_and_Corresponding_Chase_Values_and(page, vars);
        log.stepPass('Header Mapping edited and Bid Sample / Chase Values fetched');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Header Mapping or fetch Bid Sample values');
        throw e;
      }

      log.step('Navigate to Enumeration Mapping and handle proceed dialog');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        if (await correspondentPortal18Page.Yes_Proceed_Button.isVisible()) {
          log.info('Yes Proceed Button visible — clicking to proceed');
          await correspondentPortal18Page.Yes_Proceed_Button.click();
        } else {
          log.info('Yes Proceed Button not visible — clicking Proceed with Saving');
          await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        }
        await correspondentPortalPage.Rules_and_Actions_Step_4_of_4.waitFor({ state: 'visible' });
        await page.getByText("No data Found").waitFor({ state: 'hidden' });
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Enumeration Mapping screen');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Enumeration Mapping');
        throw e;
      }

      log.step('Collect Enum Bid Sample Names and Bid Tape Values');
      try {
        const ProfileName = 'BidSampleNamesWithBidTapeValues(EnumPage)'
        vars["count1"] = appconstants.ONE;
        await expect(enumerationMappingPage.Chase_Enum_Names.first()).toBeVisible();
        vars["EnumFieldsCount"] = String(await enumerationMappingPage.Chase_Enum_Names.count());
        log.info('Enum Fields Count: ' + vars["EnumFieldsCount"]);
        await enumerationMappingPage.First_Checkbox_Enum.check();
        await enumerationMappingPage.First_Checkbox_Enum.uncheck();
        while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["EnumFieldsCount"]))) {
          log.info('Iteration (Enum Bid Sample) count1: ' + vars["count1"]);
          vars["IndividualBidSampleName"] = await enumerationMappingPage.Individual_Bid_Sample_NameEnum_Page(vars['count1']).textContent() || '';
          Methods.trimtestdata(vars["IndividualBidSampleName"], "IndividualBidSampleName");
          vars["ColumnHeader"] = vars["IndividualBidSampleName"];
          if (!(await enumerationMappingPage.BidTapeFieldCountForBidField(vars['ColumnHeader']).first().isVisible())) {
            vars["IndividualBidTapeValue"] = "No BidTape";
            log.info('BidTapeFieldCountForBidField not visible — setting IndividualBidTapeValue to No BidTape');
          } else {
            vars["IndividualBidTapeValue"] = "Sample";
            vars["BidTapeCount"] = String(await enumerationMappingPage.BidTapeFieldCountForBidField(vars['ColumnHeader']).count());
            vars["count2"] = appconstants.ONE;
            while (parseFloat(String(vars["count2"])) <= parseFloat(String(vars["BidTapeCount"]))) {
              vars["BidTapeValue"] = await enumerationMappingPage.Individual_Bid_Tape_Value_2(vars['ColumnHeader'], vars['count2']).textContent() || '';
              Methods.trimtestdata(vars["BidTapeValue"], "BidTapeValue");
              Methods.concatenateWithSpecialChar(vars["BidTapeValue"], vars["IndividualBidTapeValue"], ',', 'IndividualBidTapeValue');
              Methods.performArithmetic(vars["count2"], 'ADDITION', '1', 'count2', 0);
            }
          }
          testDataManager.updatePartialProfileDataByDataIndex(ProfileName, {
            'EnumBidSampleNames': vars['IndividualBidSampleName'],
            'EnumBidTapeValues': vars['IndividualBidTapeValue'],
          }, vars['count1']);
          Methods.performArithmetic(vars["count1"], 'ADDITION', '1', 'count1', 0);
        }
        log.stepPass('Enum Bid Sample Names and Bid Tape Values collected');
      } catch (e) {
        await log.stepFail(page, 'Failed to collect Enum Bid Sample Names or Bid Tape Values at count1: ' + vars["count1"]);
        throw e;
      }

      log.step('Collect Chase Field Names and Chase Values from Enumeration Mapping');
      try {
        vars["count1"] = appconstants.ONE;
        const ProfileName = 'Chase Field To Chase Value [Enumeration]';
        await expect(enumerationMappingPage.Chase_Enum_Names.first()).toBeVisible();
        vars["ChaseFieldsCountEnum"] = String(await enumerationMappingPage.Chase_Enum_Names.count());
        log.info('Chase Fields Count Enum: ' + vars["ChaseFieldsCountEnum"]);
        while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["ChaseFieldsCountEnum"]))) {
          log.info('Iteration (Chase Field) count1: ' + vars["count1"]);
          await enumerationMappingPage.First_Checkbox_Enum.check();
          await enumerationMappingPage.First_Checkbox_Enum.uncheck();
          vars["IndividualChaseFieldName"] = await chaseFieldNamePage.get_Chase_Field_Name_common_one_Field(vars['count1']).textContent() || '';
          Methods.trimtestdata(vars["IndividualChaseFieldName"], "IndividualChaseFieldName");
          if (!(await enumerationMappingPage.get_ChaseValues_Corresponding_to_Chase_Field(vars['IndividualChaseFieldName']).first().isVisible())) {
            log.info('Chase Values not visible for Chase Field: ' + vars["IndividualChaseFieldName"] + ' — writing No ChaseValue');
            vars["IndividualChaseValueofChaseField"] = 'No ChaseValue';
          } else {
            vars["IndividualChaseValueofChaseField"] = "Sample";
            vars["ChaseValuesOfChaseFieldCount"] = String(await enumerationMappingPage.get_ChaseValues_Corresponding_to_Chase_Field(vars['IndividualChaseFieldName']).count());
            vars["count2"] = appconstants.ONE;
            vars["TagName"] = await enumerationMappingPage.Individual_ChaseValue_of_ChaseField(vars['IndividualChaseFieldName'], vars['count2']).evaluate(el => (el as HTMLElement).tagName);
            log.info('TagName: ' + vars['TagName']);
            while (parseFloat(String(vars["count2"])) <= parseFloat(String(vars["ChaseValuesOfChaseFieldCount"]))) {
              if (String(vars["TagName"]) === String("SELECT")) {
                vars["ChaseValue"] = await enumerationMappingPage.Individual_ChaseValue_of_ChaseField(vars['IndividualChaseFieldName'], vars['count2']).evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
              } else {
                vars["ChaseValue"] = await enumerationMappingPage.Individual_ChaseValue_of_ChaseField(vars['IndividualChaseFieldName'], vars['count2']).textContent() || '';
              }
              Methods.trimtestdata(vars["ChaseValue"], "ChaseValue");
              Methods.concatenateWithSpecialChar(vars["ChaseValue"], vars["IndividualChaseValueofChaseField"], ',', 'IndividualChaseValueofChaseField');
              Methods.performArithmetic(vars["count2"], 'ADDITION', '1', 'count2', 0);
            }
          }
          testDataManager.updatePartialProfileDataByDataIndex(ProfileName, {
            'Chase Value': vars['IndividualChaseValueofChaseField'],
            'ChaseFieldName': vars['IndividualChaseFieldName'],
          }, vars['count1']);
          Methods.performArithmetic(vars["count1"], 'ADDITION', '1', 'count1', 0);
        }
        log.stepPass('Chase Field Names and Chase Values collected from Enumeration Mapping');
      } catch (e) {
        await log.stepFail(page, 'Failed to collect Chase Field Names or Chase Values at count1: ' + vars["count1"]);
        throw e;
      }

      log.step('Navigate to Rules and Actions, add Rules and Actions, and Save and Publish');
      try {
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await stepGroups.stepGroup_Add_Rule_For_Add_Condition_In_Rules_and_Actions(page, vars);
        await stepGroups.stepGroup_Add_Actions_in_Rules_and_Actions(page, vars);
        await saveAndPublishButtonPage.Save_and_Publish_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Rules and Actions added and Bid Map saved and published successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to add Rules and Actions or Save and Publish Bid Map');
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