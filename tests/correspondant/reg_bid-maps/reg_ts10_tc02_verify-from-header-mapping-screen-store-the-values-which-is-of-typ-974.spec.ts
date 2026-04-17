import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';


const TC_ID = 'REG_TS10_TC02';
const TC_TITLE = 'Verify from Header Mapping screen, store the values which is of type enum and verify that the stored values are displayed in the Enumeration Mapping screen.';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let bidmapPage: BidmapPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let headerMappingPage: HeaderMappingPage;
  let spinnerPage: SpinnerPage;


  const credentials = ENV.getCredentials('internal');

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    bidmapPage = new BidmapPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    if (profile && profile.data) {
      vars["Rule Name"] = profile.data[0]['Rule Name'];
      vars["Condition Bid Field"] = profile.data[0]['Condition Bid Field'];
      vars["Operation1"] = profile.data[0]['Operation1'];
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

      log.step('Enable Smart Mapper and create Bid Map up to Header Mapping');
      try {
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        const fileName = fileconstants.BID_QA_FILE_COMMON;
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars, fileName);
        log.stepPass('Smart Mapper enabled and Bid Map created up to Header Mapping');
      } catch (e) {
        await log.stepFail(page, 'Failed to enable Smart Mapper or create Bid Map');
        throw e;
      }

      log.step('Store all Enum TDP values and fetch mapped enum values from Header Mapping');
      try {
        await stepGroups.stepGroup_Storing_All_Enum_TDP_Values_into_a_Variable(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.waitForTimeout(5000);
        vars["count"] = appconstants.ONE;
        vars["MappedChaseFieldCount"] = String(await headerMappingPage.MappedChaseFieldName.count());
        log.info('Mapped Chase Field Count: '+vars["MappedChaseFieldCount"]);
        await stepGroups.stepGroup_Fetching_Mapped_Enum_Values_From_Header_Mapping_and_Verifyin(page, vars);
        log.stepPass('Enum TDP values stored and mapped enum values fetched. Mapped Chase Field Count: ' + vars["MappedChaseFieldCount"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to store Enum TDP values or fetch mapped enum values');
        throw e;
      }

      log.step('Navigate to Enumeration Mapping and verify Rules and Actions step is visible');
      try {
        await correspondentPortalPage.Enumeration_Mapping_Button1.click();
        if (await bidmapPage.Yes_Proceed_Button_Text.isVisible()) {
          log.info('Yes Proceed Button is visible — clicking to proceed');
          await bidmapPage.Yes_Proceed_Button_Text.click();
        } else {
          log.info('Yes Proceed Button is not visible — proceeding without click');
        }
        await expect(correspondentPortalPage.Rules_and_Actions_Step_4_of_4).toBeVisible();
        log.stepPass('Navigated to Enumeration Mapping and Rules and Actions Step 4 of 4 is visible');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Enumeration Mapping or verify Rules and Actions step');
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