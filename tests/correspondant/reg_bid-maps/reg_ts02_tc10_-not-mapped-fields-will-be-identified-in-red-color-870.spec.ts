// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments'
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = "REG_TS02_TC10";
const TC_TITLE = "Not mapped fields will be identified in Red color."

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
  });

  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      log.step("Step 1: Prepare test data and login");
      try {
        if (profile && profile.data) {
          const cssAttribute = profile.data[0]['CSS Attribute'];
          vars["CSS Attribute"] = cssAttribute;
          vars["Username"] = credentials.username;
          vars["Password"] = credentials.password;
          log.info(`CSS Attribute: ${vars["CSS Attribute"]}`);
        }

        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars,"DeepikaAugBidQA_(3)_(1)_(1)_(2).xlsx");

        log.stepPass("Step 1 passed: Logged in and navigated to Header Mapping");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Setup/Login failed");
        throw error;
      }

      log.step("Step 2: Verify Enumeration Mapping button visibility");
      try {
        await expect(enumerationMappingButtonPage.Enumeration_Mapping_Button).toBeVisible();
        log.stepPass("Step 2 passed: Enumeration Mapping button is visible");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Enumeration Mapping button not visible");
        throw error;
      }

      log.step("Step 3: Validate unmapped fields are highlighted in red");
      try {
        // Debug pause (kept as per original test)
        vars["HeaderMapping"] = String(await correspondentPortalPage.Amortization_Term.count());
        vars["Count"] = appconstants.TWO;
        log.info(`Total HeaderMapping count: ${vars["HeaderMapping"]}`);
        log.info(`Starting validation from Count: ${vars["Count"]}`);
        while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["HeaderMapping"]))) {
          await expect(correspondentPortalPage.Amortization_Term.nth(Number(vars["Count"]) - 2)).toHaveCSS('border-color', 'rgb(227, 82, 5)');
          vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
        }

        log.stepPass("Step 3 passed: All unmapped fields are highlighted in red");
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Unmapped fields color validation failed");
        throw error;
      }
      log.tcEnd('PASS');
    } catch (error) {
      log.captureOnFailure(page, TC_ID, error);
      log.tcEnd('FAIL');
      throw error;
    }
  });
});