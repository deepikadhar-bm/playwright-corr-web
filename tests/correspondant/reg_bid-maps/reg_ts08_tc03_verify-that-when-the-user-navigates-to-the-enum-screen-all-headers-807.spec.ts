import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { LoginPage } from '../../../src/pages/correspondant/login';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';
import path from 'path';
import * as excelHelper from '../../../src/helpers/excel-helpers';


const TC_ID = 'REG_TS08_TC03';
const TC_TITLE = 'Verify that when the user navigates to the enum screen, all headers of type enum are fetched, and if the uploaded file contains any values, then the corresponding matched records should';


test.describe('REG_Bid Maps', () => {

  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let loginPage: LoginPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    loginPage = new LoginPage(page);
    Methods = new AddonHelpers(page, vars);
    vars["filePath"] = path.resolve(__dirname, '../../../uploads', fileconstants.BID_QA_FILE_COMMON);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Login to CORR Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to CORR Portal successful');
      } catch (e) {
        await log.stepFail(page, 'Login to CORR Portal failed');
        throw e;
      }

      log.step('Enable Smart Mapper and create Bid Map up to Header Mapping');
      try {
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars, fileconstants.BID_QA_FILE_COMMON);
        log.stepPass('Smart Mapper enabled and Bid Map created up to Header Mapping');
      } catch (e) {
        await log.stepFail(page, 'Failed to enable Smart Mapper or create Bid Map');
        throw e;
      }

      log.step('Navigate to Enumeration Mapping and proceed');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        log.stepPass('Navigated to Enumeration Mapping successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Enumeration Mapping');
        throw e;
      }

      log.step('Read files and verify enum values match uploaded file data');
      try {
        vars["Total exl"] = await excelHelper.readEntireColumnByColIndex(vars["filePath"], appconstants.THREE);
        vars['names'] = vars['Total exl'];
        log.info('Expected enum value (names): ' + vars['names']);
        vars['number'] = appconstants.ONE;
        vars['ImpoundCountUI'] = String(await loginPage.ImpoundUI.count());
        log.info('Impound Count UI: ' + vars['ImpoundCountUI']);
        while (parseFloat(String(vars['number'])) <= parseFloat(String(vars['ImpoundCountUI']))) {
          vars['Impound Type'] = await loginPage.Impound(vars['number']).innerText() || '';
          Methods.trimtestdata(vars['Impound Type'], 'Impound Type');
          log.info('Iteration ' + vars['number'] + ' — Impound Type: ' + vars['Impound Type']);
          Methods.verifyString(vars['names'], 'contains', vars['Impound Type']);
          Methods.performArithmetic('1', 'ADDITION', vars['number'], 'number', 0);
        }
        log.stepPass('All enum values verified successfully against uploaded file data');
      } catch (e) {
        await log.stepFail(page, 'Enum value verification failed at iteration: ' + vars['number']);
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