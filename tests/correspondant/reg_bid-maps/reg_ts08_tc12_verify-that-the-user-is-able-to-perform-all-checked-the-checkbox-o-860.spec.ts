import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BackButtonPage } from '../../../src/pages/correspondant/back-button';
import { CorrespondentPortal18Page } from '../../../src/pages/correspondant/correspondent-portal-18';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';


const TC_ID = 'REG_TS08_TC12';
const TC_TITLE = 'Verify that the user is able to perform all Checked the checkbox operations in the Enumeration mapping.';


test.describe('REG_Bid Maps', () => {

  let vars: Record<string, string> = {};
  let backButtonPage: BackButtonPage;
  let correspondentPortal18Page: CorrespondentPortal18Page;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let spinnerPage: SpinnerPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    backButtonPage = new BackButtonPage(page);
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    spinnerPage = new SpinnerPage(page);
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
        const fileName =fileconstants.BID_QA_FILE_COMMON;
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars,fileName);
        log.stepPass('Smart Mapper enabled and Bid Map created up to Header Mapping successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to enable Smart Mapper or create Bid Map');
        throw e;
      }

      log.step('Store all Enum TDP values and check all Enum fields in Header Mapping screen');
      try {
        await stepGroups.stepGroup_Storing_All_Enum_TDP_Values_into_a_Variable(page, vars);
        await stepGroups.stepGroup_Checking_All_Enum_Fields_In_Header_Mapping_Screen(page, vars);
        log.stepPass('Enum TDP values stored and all Enum fields checked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to store Enum TDP values or check Enum fields');
        throw e;
      }

      log.step('Click Enumeration Mapping and proceed with saving');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        if (await proceedWithSavingButtonPage.Proceed_with_Saving_Button.isVisible()) {
          await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        }
        if (await correspondentPortal18Page.Yes_Proceed_Button.isVisible()) {
          await correspondentPortal18Page.Yes_Proceed_Button.click();
        }
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Enumeration Mapping saved successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to save Enumeration Mapping');
        throw e;
      }

      log.step('Verify checked Enum fields in Enumeration screen');
      try {
        await stepGroups.stepGroup_Verification_Of_Checked_Enum_Fields_In_Enumeration(page, vars);
        log.stepPass('Checked Enum fields verified successfully in Enumeration screen');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify checked Enum fields in Enumeration screen');
        throw e;
      }

      log.step('Navigate back and uncheck all Enum fields in Header Mapping screen');
      try {
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.waitFor({ state: 'visible' });
        await stepGroups.stepGroup_Unchecking_All_Enum_Fields_In_Header_Mapping_Screen(page, vars);
        log.stepPass('Navigated back and all Enum fields unchecked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate back or uncheck Enum fields');
        throw e;
      }

      log.step('Click Enumeration Mapping, proceed with saving and verify unchecked Enum fields');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        if (await proceedWithSavingButtonPage.Proceed_with_Saving_Button.isVisible()) {
          await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        }
        if (await correspondentPortal18Page.Yes_Proceed_Button.isVisible()) {
          await correspondentPortal18Page.Yes_Proceed_Button.click();
        }
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Verification_Of_Unchecked_Enum_Fields_In_Enumeration(page, vars);
        log.stepPass('Unchecked Enum fields verified successfully in Enumeration screen');
      } catch (e) {
        await log.stepFail(page, 'Failed to save or verify unchecked Enum fields');
        throw e;
      }

      log.step('Click Rules and Actions and proceed with saving');
      try {
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        if (await proceedWithSavingButtonPage.Proceed_with_Saving_Button.isVisible()) {
          await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        }
        if (await correspondentPortal18Page.Yes_Proceed_Button.isVisible()) {
          await correspondentPortal18Page.Yes_Proceed_Button.click();
        }
        log.stepPass('Rules and Actions saved successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to save Rules and Actions');
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