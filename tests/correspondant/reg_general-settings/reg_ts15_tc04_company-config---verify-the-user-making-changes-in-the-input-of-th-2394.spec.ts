import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CompanyConfigPage } from '../../../src/pages/correspondant/company-config';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS15_TC04';
const TC_TITLE = 'Company Config - Verify the User making changes in the input of the Name, and Check whether it is get Reflected in the other Modules or Not. => Bid Maps., Commitment Timer.';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let bidmapPage: BidmapPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let companyConfigPage: CompanyConfigPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let headerMappingPage: HeaderMappingPage;
  let okButtonPage: OkButtonPage;
  let spinnerPage: SpinnerPage;
  let REG_TS15_TC04testFailed = false;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    bidmapPage = new BidmapPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    companyConfigPage = new CompanyConfigPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    okButtonPage = new OkButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
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

      log.step('Navigate to Company Config and capture current company name');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await correspondentPortalPage.Company_ConfigGenral_settings.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['CompanyNameBeforeEdit'] = await companyConfigPage.Company_Name_InputCompany_Config.inputValue() || '';
        log.info('CompanyNameBeforeEdit: ' + vars['CompanyNameBeforeEdit']);
        log.stepPass('Navigated to Company Config and current company name captured successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Company Config or capture current company name');
        throw e;
      }

      log.step('Update company name to Chase_Testing and save');
      try {
        await companyConfigPage.Company_Name_InputCompany_Config.click();
        await companyConfigPage.Company_Name_InputCompany_Config.clear();
        await companyConfigPage.Company_Name_InputCompany_Config.type(appconstants.CHASE_TESTING);
        Methods.concatenateWithSpace(appconstants.CHASE_TESTING, 'Field Name', 'ExpectedChaseFieldName');
        log.info('ExpectedChaseFieldName: ' + vars['ExpectedChaseFieldName']);
        await correspondentPortalPage.Save_Settings.waitFor({ state: 'visible' });
        await expect(correspondentPortalPage.Save_Settings).toBeEnabled();
        await correspondentPortalPage.Save_Settings.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await okButtonPage.Ok_Button.click();
        log.stepPass('Company name updated to Chase_Testing and saved successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to update company name to Chase_Testing or save');
        throw e;
      }

      log.step('Navigate to Bid Maps and verify Chase field name is reflected in Header Mapping');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.Bid_Maps_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await bidmapPage.First_Bid_Map_Name.first().click();
        await headerMappingPage.Header_Mapping.waitFor({ state: 'visible' });
        await headerMappingPage.Header_Mapping.click();
        vars['ChaseFieldNameAfterEdit'] = await chaseFieldNamePage.Chase_Field_NameMapping_Creation.first().textContent() || '';
        log.info('ExpectedChaseFieldName: ' + vars['ExpectedChaseFieldName']);
        log.info('ChaseFieldNameAfterEdit: ' + vars['ChaseFieldNameAfterEdit']);
        expect(String(vars['ExpectedChaseFieldName'])).toBe(vars['ChaseFieldNameAfterEdit']);
        log.stepPass('Chase field name verified in Header Mapping successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bid Maps or verify Chase field name in Header Mapping');
        throw e;
      }

      log.step('Navigate to Company Config and restore original company name');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await correspondentPortalPage.Company_ConfigGenral_settings.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await companyConfigPage.Company_Name_InputCompany_Config.fill(String(vars['CompanyNameBeforeEdit']));
        await correspondentPortalPage.Save_Settings.waitFor({ state: 'visible' });
        await expect(correspondentPortalPage.Save_Settings).toBeEnabled();
        await correspondentPortalPage.Save_Settings.click();
        await page.getByText('Company config updated successfully!').waitFor({ state: 'visible' });
        await okButtonPage.Ok_Button.click();
        log.stepPass('Original company name restored and saved successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to restore original company name or save');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      REG_TS15_TC04testFailed = true;
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });

  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, REG_TS15_TC04testFailed);

    try {
      log.step('Executing after-test steps: Restore original company name');

      if (REG_TS15_TC04testFailed) {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await correspondentPortalPage.Company_ConfigGenral_settings.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await companyConfigPage.Company_Name_InputCompany_Config.fill(String(vars['CompanyNameBeforeEdit']));
        await expect(correspondentPortalPage.Save_Settings).toBeEnabled();
        await correspondentPortalPage.Save_Settings.click();
        await page.getByText('Company config updated successfully!').waitFor({ state: 'visible' });
        await okButtonPage.Ok_Button.click();
      }

      log.stepPass('After-test steps executed successfully. Original company name restored');

    } catch (e) {
      await log.stepFail(page, 'Failed to restore original company name in after-test steps');
    }
  });
});