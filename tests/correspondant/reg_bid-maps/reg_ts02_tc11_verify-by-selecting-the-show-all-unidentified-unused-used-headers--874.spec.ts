import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ActionruleheaderPage } from '../../../src/pages/correspondant/actionruleheader';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { P24UnitDropdownPage } from '../../../src/pages/correspondant/p-24-unit-dropdown';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments'
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';

const TC_ID = 'REG_TS02_TC11';
const TC_TITLE = 'Verify by selecting the "show all / Unidentified / unused / used headers" dropdown options should display those respective values and Verify the count of unidentified headers';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let actionruleheaderPage: ActionruleheaderPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let headerMappingPage: HeaderMappingPage;
  let p24UnitDropdownPage: P24UnitDropdownPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    actionruleheaderPage = new ActionruleheaderPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    p24UnitDropdownPage = new P24UnitDropdownPage(page);
    vars["Username"] = credentials.username;
    vars["Password"] = credentials.password;
  });

  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Loading test data from profile and resolving file path');
      try {
        if (profile && profile.data) {
          const cssAttribute = profile.data[0]['CSS Attribute'];
          vars["CSS Attribute"] = cssAttribute;
          vars["Header Mapping"] = profile.data[0]['Header Mapping'];
          vars["Used Headers"] = profile.data[0]['Used Headers'];
          vars["Unidentified Headers"] = profile.data[0]['Unidentified Headers'];
          vars["Unused Headers"] = profile.data[0]['Unused Headers'];
          vars["filePath"] = path.resolve(__dirname, '../../../uploads', fileconstants.BID_QA_FILE_COMMON);
        }
        log.info('CSS Attribute: ' + vars["CSS Attribute"]);
        log.info('Header Mapping: ' + vars["Header Mapping"]);
        log.info('Used Headers: ' + vars["Used Headers"]);
        log.info('Unidentified Headers: ' + vars["Unidentified Headers"]);
        log.info('Unused Headers: ' + vars["Unused Headers"]);
        log.info('filePath: ' + vars["filePath"]);
        log.stepPass('Test data loaded and file path resolved');
      } catch (e) {
        await log.stepFail(page, 'Failed to load test data from profile');
        throw e;
      }

      log.step('Logging in to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Successfully logged in to Correspondent Portal');
      } catch (e) {
        await log.stepFail(page, 'Failed to log in to Correspondent Portal');
        throw e;
      }

      log.step('Enabling Smart Mapper and creating Bid Map up to Header Mapping with Standard');
      try {
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping_with_Standard(page, vars, fileconstants.BID_QA_FILE_COMMON);
        vars["Total exl"] = await excelHelper.readEntireColumnByColIndex(vars["filePath"], appconstants.FOUR);
        log.info('Total excel column data captured');
        log.stepPass('Smart Mapper enabled and Bid Map created up to Header Mapping');
      } catch (e) {
        await log.stepFail(page, 'Failed to enable Smart Mapper or create Bid Map');
        throw e;
      }

      log.step('Checking first and second header checkboxes and capturing bid names');
      try {
        await headerMappingPage.First_Header_Checkbox.check();
        await expect(headerMappingPage.First_Header_Checkbox).toBeVisible();
        vars["FirstCheckedBidName"] = await headerMappingPage.First_Header_Bid_Sample_Name.textContent() || '';
        log.info('FirstCheckedBidName: ' + vars["FirstCheckedBidName"]);

        await actionruleheaderPage.Second_Header_Checkbox.check();
        await expect(actionruleheaderPage.Second_Header_Checkbox).toBeVisible();
        vars["SecondCheckedBidName"] = await headerMappingPage.Second_Header_Bid_Sample_Name.textContent() || '';
        log.info('SecondCheckedBidName: ' + vars["SecondCheckedBidName"]);

        vars["UncheckedHeadersCount"] = String(await headerMappingPage.Unchecked_Headers.count());
        log.info('UncheckedHeadersCount: ' + vars["UncheckedHeadersCount"]);
        log.stepPass('First and second header checkboxes checked and bid names captured');
      } catch (e) {
        await log.stepFail(page, 'Failed to check header checkboxes or capture bid names');
        throw e;
      }

      log.step('Selecting Header Mapping dropdown option and verifying bid sample count matches excel');
      try {
        await expect(correspondentPortalPage.Header_Mapping_Dropdown).toBeVisible();
        log.info('element Header_Mapping_Dropdown is visible');

        await correspondentPortalPage.Show_All_Headers_field.selectOption({ label: vars["Header Mapping"] });
        vars["BidSampleCountFromUI"] = String(await p24UnitDropdownPage.Bid_Sample_Field_Name_in_Header_Mapping.count());
        log.info('BidSampleCountFromUI: ' + vars["BidSampleCountFromUI"]);

        vars["BidSampleCountFromExcel"] = String(excelHelper.getNonEmptyCellCountPerRow(vars["filePath"], 0));
        vars["BidSampleCountFromExcel"] = (parseFloat(String(vars["BidSampleCountFromExcel"])) - parseFloat(String(appconstants.ONE))).toFixed(0);
        log.info('BidSampleCountFromExcel: ' + vars["BidSampleCountFromExcel"]);

        expect(String(vars["BidSampleCountFromUI"])).toBe(vars["BidSampleCountFromExcel"]);
        log.stepPass('Bid sample count from UI matches excel count: ' + vars["BidSampleCountFromUI"]);
      } catch (e) {
        await log.stepFail(page, 'Bid sample count mismatch between UI and excel');
        throw e;
      }

      log.step('Verifying Show Unidentified and Show Unused Headers dropdown options');
      try {
        await stepGroups.stepGroup_Show_Unidentified_Headers(page, vars);
        log.info('Show Unidentified Headers step group completed');
        await stepGroups.stepGroup_Show_Unused_Headers(page, vars);
        log.info('Show Unused Headers step group completed');
        log.stepPass('Unidentified and Unused Headers dropdown options verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Unidentified or Unused Headers dropdown options');
        throw e;
      }

      log.step('Selecting Used Headers option and verifying checked headers are displayed with correct count');
      try {
        await correspondentPortalPage.Header_Mapping_Dropdown.selectOption({ value: vars["Used Headers"] });
        await expect(headerMappingPage.Checked_header_1(vars["FirstCheckedBidName"])).toBeVisible();
        log.info('element Checked_header_1 is visible with bid name: ' + vars["FirstCheckedBidName"]);

        await expect(headerMappingPage.Checked_header_2(vars["SecondCheckedBidName"])).toBeVisible();
        log.info('element Checked_header_2 is visible with bid name: ' + vars["SecondCheckedBidName"]);

        await expect(headerMappingPage.Headers_In_HeadersMapping).toHaveCount(parseInt(appconstants.TWO));
        log.info('element Headers_In_HeadersMapping has count: 2');
        log.stepPass('Used Headers verified — both checked headers visible and total count is 2');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Used Headers display or count');
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