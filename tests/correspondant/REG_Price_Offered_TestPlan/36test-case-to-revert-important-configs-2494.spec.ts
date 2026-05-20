// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestConfigPage } from '../../../src/pages/correspondant/bid-request-config';
import { CompanyConfigPage } from '../../../src/pages/correspondant/company-config';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EarlyConfigPage } from '../../../src/pages/correspondant/early-config';
import { MarketThresholdPage } from '../../../src/pages/correspondant/market-threshold';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';
import { APP_CONSTANTS } from 'src/constants/app-constants';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let bidRequestConfigPage: BidRequestConfigPage;
  let companyConfigPage: CompanyConfigPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let earlyConfigPage: EarlyConfigPage;
  let marketThresholdPage: MarketThresholdPage;
  let okButtonPage: OkButtonPage;
  let spinnerPage: SpinnerPage;
  

  test.beforeEach(async ({ page }) => {
    
    log.info('Initializing test setup');
    vars = {};
    bidRequestConfigPage = new BidRequestConfigPage(page);
    companyConfigPage = new CompanyConfigPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    earlyConfigPage = new EarlyConfigPage(page);
    marketThresholdPage = new MarketThresholdPage(page);
    okButtonPage = new OkButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    log.info('All page objects initialized');
  });

  test('Test Case To Revert Important Configs', async ({ page }) => {
    log.step('Starting test case: Revert Important Configs');
    const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
    log.step('Logging in to CORR Portal');
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    log.info('Successfully logged in to CORR Portal');
    log.stepPass('Login completed');

    log.step('Navigating to Bid Request Config');
    await stepGroups.stepGroup_Navigating_To_Bid_Request_Config(page, vars);
    log.info('Successfully navigated to Bid Request Config');
    log.stepPass('Navigation completed');

    log.step('Checking Real Time Off Radio Button');
    await bidRequestConfigPage.Real_Time_Off_Radio_Button.check();
    log.info('Real Time Off Radio Button checked');

    log.step('Checking Deferred On Radio Button');
    await earlyConfigPage.Deffered_On_Radio_Button.check();
    log.info('Deferred On Radio Button checked');

    if (await bidRequestConfigPage.Newly_Added_Dropdown_InputPOS.isVisible()) /* Element Newly Added Dropdown Input(POS) is visible */ {
      log.info('Newly Added Dropdown Input(POS) is visible');
      await expect(bidRequestConfigPage.Newly_Added_Dropdown_InputPOS).toBeVisible();
      log.info('Newly Added Dropdown Input(POS) visibility assertion passed');
      
      log.step('Clicking Delete Button for POS');
      await bidRequestConfigPage.Delete_Button_pos.click();
      log.info('Delete Button for POS clicked successfully');
    } else {
      log.info('Newly Added Dropdown Input(POS) is not visible, skipping delete operation');
    }

    if (await bidRequestConfigPage.Save_Changes_Button.isEnabled()) /* Element Save Changes Button is enabled */ {
      log.info('Save Changes Button is enabled');
      
      log.step('Clicking Save Changes Button');
      await bidRequestConfigPage.Save_Changes_Button.click();
      log.info('Save Changes Button clicked successfully');
    } else {
      log.info('Save Changes Button is not enabled, skipping save operation');
    }

    log.step('Navigating to Market Thresholds');
    await correspondentPortalPage.Market_Thresholds.click();
    log.info('Market Thresholds link clicked');
    
    log.step('Waiting for spinner to hide');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    log.info('Spinner has hidden');

    log.step('Removing unwanted Market Threshold records');
    let recordCount = 0;
    while (await marketThresholdPage.Unwanted_Market_Threshold_Record.isVisible()) {
      recordCount++;
      log.info(`Processing unwanted market threshold record #${recordCount}`);
      
      log.step(`Deleting record #${recordCount}`);
      await marketThresholdPage.Delete_Unwanted_Record_Button.click();
      log.info(`Delete Button clicked for record #${recordCount}`);
      
      await correspondentPortalPage.Yes_Go_ahead_Buttondelete.click();
      log.info(`Deletion confirmed for record #${recordCount}`);
      
      await page.waitForTimeout(3000);
      log.info('Waited 3 seconds for page update');
      
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.info('Spinner hidden after deletion');
    }
    log.info(`All ${recordCount} unwanted market threshold records have been deleted`);

    log.step('Verifying all unwanted records are removed');
    await expect(marketThresholdPage.Unwanted_Market_Threshold_Record).not.toBeVisible();
    log.info('Verified: No unwanted market threshold records are visible');

    log.step('Navigating to Company Config (General Settings)');
    await correspondentPortalPage.Company_ConfigGenral_settings.click();
    log.info('Company Config General Settings link clicked');
    
    log.step('Waiting for Company Name Input to be visible');
    await companyConfigPage.Company_Name_InputCompany_Config.waitFor({ state: 'visible' });
    log.info('Company Name Input is now visible');

    log.step('Retrieving current Company Name value');
    vars["ConfigCompanyName"] = await companyConfigPage.Company_Name_InputCompany_Config.inputValue() || '';
   // vars["CompanyName"] = APP_CONSTANTS.CompanyNameConfig;

    log.info(`Current Company Name: ${vars["ConfigCompanyName"]}`);

    if (String(vars["ConfigCompanyName"]) !== APP_CONSTANTS.CompanyNameConfig) {
      log.info(`Company Name is "${vars["ConfigCompanyName"]}", updating to "Chase"`);
      await companyConfigPage.Company_Name_InputCompany_Config.clear();
      log.info('Cleared existing Company Name input');
      log.step('Entering "Chase" as Company Name');
      await companyConfigPage.Company_Name_InputCompany_Config.pressSequentially(APP_CONSTANTS.CompanyNameConfig);
      log.info('Pressed "Chase" sequentially into Company Name Input');
      
      await correspondentPortalPage.Save_Settings.waitFor({ state: 'visible' });
      log.info('Save Settings button is visible');
      
      log.step('Clicking Save Settings button');
      await correspondentPortalPage.Save_Settings.click();
      log.info('Save Settings button clicked');
      
      log.step('Clicking OK button to confirm changes');
      await okButtonPage.Ok_Button.click();
      log.info('OK button clicked to confirm changes');
    } else {
      log.info('Company Name is already set to "Chase", no update needed');
    }

    log.stepPass('Test case completed successfully');
  });
});