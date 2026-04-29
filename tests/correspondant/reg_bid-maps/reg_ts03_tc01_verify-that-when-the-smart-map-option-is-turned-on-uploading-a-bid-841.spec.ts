import { test, expect } from '@playwright/test';
import path from 'path';
import { uploadFile } from '../../../src/helpers/file-helpers';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidMapPage } from '../../../src/pages/correspondant/bid-map';
import { CompanyPage } from '../../../src/pages/correspondant/company';
import { CorrespondentPortal18Page } from '../../../src/pages/correspondant/correspondent-portal-18';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { HeadingCreateNewMapPage } from '../../../src/pages/correspondant/heading-create-new-map';
import { HeadingMappingsPage } from '../../../src/pages/correspondant/heading-mappings';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';
import { testDataManager } from 'testdata/TestDataManager';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { AddonHelpers } from '@helpers/AddonHelpers';


const TC_ID = 'REG_TS03_TC01';
const TC_TITLE = 'Verify that when the smart map option is turned on, uploading a bid file and navigating to the header screen will automatically select the corresponding Chase field name based on the bid';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let bidMapPage: BidMapPage;
  let companyPage: CompanyPage;
  let correspondentPortal18Page: CorrespondentPortal18Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let headerMappingPage: HeaderMappingPage;
  let headingCreateNewMapPage: HeadingCreateNewMapPage;
  let headingMappingsPage: HeadingMappingsPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    bidMapPage = new BidMapPage(page);
    companyPage = new CompanyPage(page);
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    headingCreateNewMapPage = new HeadingCreateNewMapPage(page);
    headingMappingsPage = new HeadingMappingsPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    if (profile && profile.data) {
      vars["Upload File Text Verification"] = profile.data[0]['Upload File Text Verification'];
    }
    try {

      log.step('Login to CORR Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Login to CORR Portal successful');
      } catch (e) {
        await log.stepFail(page, 'Login to CORR Portal failed');
        throw e;
      }

      log.step('Enable Smart Mapper (Off to On)');
      try {
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        await expect(headingMappingsPage.Mappings).toBeVisible();
        log.stepPass('Smart Mapper enabled successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to enable Smart Mapper');
        throw e;
      }

      log.step('Create a new Bid Map');
      try {
        await correspondentPortalPage.Add_New_Mapping_Button.click();
        await expect(headingCreateNewMapPage.Create_New_Map).toBeVisible();
        Methods.getCurrentTimestamp(appconstants.DATE_FORMAT_SLASH, 'Create New Map', appconstants.UTC);
        Methods.concatenate(appconstants.Testsigma_, vars["Create New Map"], 'Create New Map');
        await correspondentPortalPage.Create_New_Map_Field.fill(vars["Create New Map"]);
        await correspondentPortalPage.Create_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars["Create New Map"])).toBeVisible();
        log.stepPass('New Bid Map created successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to create new Bid Map');
        throw e;
      }

      log.step('Select company and upload bid file');
      try {
        await correspondentPortalPage.Select_Companys_Dropdown.click();
        await bidMapPage.Required_Company_Checkbox_Bidmap_Company_dropdown.click();
        await correspondentPortalPage.Apply_Selected.click();
        await expect(correspondentPortalPage.Upload_File).toHaveValue('');
        await expect(page.getByText(vars["Upload File Text Verification"])).toBeVisible();
        // await stepGroups.stepGroup_Rename_File(page, vars);
        const fileName1 = path.join(process.cwd(), 'uploads', fileconstants.BID_QA_FILE_COMMON);
        excelHelper.readEntireRow(fileName1, 0, 0, 'Total Headers From Xls');
        const fileName2 = fileconstants.Bid_Maps_File;
        await uploadFile(page, correspondentPortalPage.Upload_File, fileName2);
        log.stepPass('Company selected and bid file uploaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to select company or upload bid file');
        throw e;
      }

      log.step('Navigate to Header Mapping screen');
      try {
        await correspondentPortalPage.Execution_Type_Dropdown.selectOption({ value: appconstants.EXECUTION_TYPE_STANDARD });
        await expect(correspondentPortalPage.Execution_Type_Dropdown.locator('option:checked')).toHaveText(appconstants.EXECUTION_TYPE_STANDARD);
        await mapHeadersButtonPage.Map_Headers_Button.click();
        await correspondentPortalPage.Heading_Save_and_Move_to_Next_Page1.waitFor({ state: 'visible' });
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars["Create New Map"])).toBeVisible();
        await headerMappingPage.Header_Mapping.waitFor({ state: 'visible' });
        log.stepPass('Navigated to Header Mapping screen successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Header Mapping screen');
        throw e;
      }

      log.step('Verify Smart Map auto-selection of Chase field names');
      try {
        await headerMappingPage.All_Fields_in_header_map.first().waitFor({ state: 'visible' });
        vars["FieldCount"] = String(await headerMappingPage.All_Fields_in_header_map.count());
        vars["count"] = appconstants.ONE;
        vars["PerfectMatchCount"] = appconstants.ZERO;
        vars["PartialMatchCount"] = appconstants.ZERO;
        vars["IncorrectMatchCount"] = appconstants.ZERO;
        vars["UnMappedHeaderCount"] = appconstants.ZERO;
        log.info('Field Count: ' + vars["FieldCount"]);
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["FieldCount"]))) {
          log.info('Iteration: ' + vars["count"]);
          vars["Individual BidSample Name"] = await headerMappingPage.Individual_BidSample_Name1(vars['count']).textContent() || '';
          await correspondentPortalPage.Rules_and_Actions_Step_4_of_4.click();
          vars["IndividualChaseValue"] = await headerMappingPage.Individual_ChaseValue_OF_Bid(vars['count']).evaluate(el => {
            const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || '';
          });

          if (String(vars["Individual BidSample Name"]) === String(vars["IndividualChaseValue"])) {
            Methods.performArithmetic(vars["PerfectMatchCount"], 'ADDITION', '1', 'PerfectMatchCount', 0);
          } else if (String(vars["Individual BidSample Name"]).includes(String(vars["IndividualChaseValue"]))) {
            Methods.performArithmetic(vars["PartialMatchCount"], 'ADDITION', '1', 'PartialMatchCount', 0);
          } else if (String(vars["IndividualChaseValue"]) === String("Select")) {
            Methods.performArithmetic(vars["UnMappedHeaderCount"], 'ADDITION', '1', 'UnMappedHeaderCount', 0);
          } else {
            Methods.performArithmetic(vars["IncorrectMatchCount"], 'ADDITION', '1', 'IncorrectMatchCount', 0);
          }
          vars["count"] = (parseFloat("1") + parseFloat(String(vars["count"]))).toFixed(0);
        }

        await correspondentPortalPage.First_Checkbox_Bid_Request.check();
        await correspondentPortalPage.First_Checkbox_Bid_Request.uncheck();

        vars["PerfectMatch"] = vars["PerfectMatchCount"];
        vars["PartialMatch"] = vars["PartialMatchCount"];
        vars["UnmappedHeaders"] = vars["UnMappedHeaderCount"];
        vars["IncorrectMatch"] = vars["IncorrectMatchCount"];

        if (String(vars["PerfectMatchCount"]) >= String(appconstants.ONE)) {
          expect(Methods.verifyComparison(vars["PerfectMatchCount"], '>=', appconstants.ONE));
        } else {
          expect(Methods.verifyComparison(vars["PartialMatchCount"], '>=', appconstants.ONE));
        }
        log.stepPass('Smart Map auto-selection verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Smart Map auto-selection');
        throw e;
      }

      log.step('Click Enumeration Mapping and proceed');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        if (await proceedWithSavingButtonPage.Proceed_with_Saving_Button.isVisible()) {
          await correspondentPortalPage.Yes_Proceed_Button.click();
        }
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Enumeration Mapping saved successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to save Enumeration Mapping');
        throw e;
      }

      log.step('Click Rules and Actions and proceed');
      try {
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
        if (await correspondentPortal18Page.Yes_Proceed_Button.isVisible()) {
          await correspondentPortal18Page.Yes_Proceed_Button.click();
        }
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Rules and Actions saved successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to save Rules and Actions');
        throw e;
      }

      log.step('Save and Publish, then verify status');
      try {
        await saveAndPublishButtonPage.Save_and_Publish_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Status).toContainText("ACTIVE");
        vars["Version"] = await correspondentPortalPage.Version.textContent() || '';
        await expect(page.getByText(vars["Version"]).first()).toBeVisible();
        vars["Company"] = await companyPage.Company.first().textContent() || '';
        await expect(page.getByText(vars["Company"]).first()).toBeVisible();
        log.stepPass('Bid Map published successfully and status verified as ACTIVE');
      } catch (e) {
        await log.stepFail(page, 'Failed to save/publish or verify status');
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