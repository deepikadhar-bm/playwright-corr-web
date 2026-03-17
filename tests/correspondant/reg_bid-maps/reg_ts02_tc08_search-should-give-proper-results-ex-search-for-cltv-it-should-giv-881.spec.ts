// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CltvPage } from '../../../src/pages/correspondant/cltv';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments'
import { testDataManager } from 'testdata/TestDataManager';

const TC_ID = "REG_TS02_TC08";
const TC_TITLE = "Search should give proper results. Search for CLTV, clear results, and validate empty/no results behavior"

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let cltvPage: CltvPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    cltvPage = new CltvPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
  });

  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step("Step 1: Prepare test data and login");
      try {
        if (profile && profile.data) {
          const bidFields = profile.data[0]['BidFields'];
          const emptyChaseFieldName = profile.data[0]["EmptyChaseFieldName"];

          vars["BidFields"] = bidFields;
          vars["EmptyChaseFieldName"] = emptyChaseFieldName;
          vars["Username"] = credentials.username;
          vars["Password"] = credentials.password;

          log.info(`BidFields: ${vars["BidFields"]}`);
          log.info(`EmptyChaseFieldName: ${vars["EmptyChaseFieldName"]}`);
        }

        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);

        log.stepPass("Step 1 passed: Logged in and navigated to Header Mapping");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Setup/Login failed");
        throw error;
      }

      log.step("Step 2: Validate search field initial state");
      try {
        await expect(correspondentPortalPage.Search_Text_Field).toBeVisible();
        await expect(correspondentPortalPage.Search_Text_Field).toHaveValue('');

        log.stepPass("Step 2 passed: Search field is visible and empty");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Search field validation failed");
        throw error;
      }

      log.step("Step 3: Perform random search and validate results");
      try {
        const randomSearch = Array.from({ length: 5 }, () => "abc".charAt(Math.floor(Math.random() * 3))).join('');
        vars["RandomSearch"] = randomSearch;

        log.info(`Random search value: ${vars["RandomSearch"]}`);

        await correspondentPortalPage.Search_Text_Field.click();
        await correspondentPortalPage.Search_Text_Field.fill(vars["RandomSearch"]);

        await expect(correspondentPortalPage.HeaderData_HeaderMapping).toBeVisible();

        log.stepPass("Step 3 passed: Random search executed successfully");
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Random search failed");
        throw error;
      }

      log.step("Step 4: Search for specific Bid Field (CLTV)");
      try {
        await correspondentPortalPage.Search_Text_Field.clear();
        await correspondentPortalPage.Search_Text_Field.fill(vars["BidFields"]);

        log.info(`Searching for BidField: ${vars["BidFields"]}`);

        await expect(cltvPage.CLTV).toBeVisible();

        log.stepPass("Step 4 passed: CLTV search returned correct result");
      } catch (error) {
        log.stepFail(page, "Step 4 failed: CLTV search failed");
        throw error;
      }

      log.step("Step 5: Clear search and validate full results");
      try {
        await correspondentPortalPage.Search_Text_Field.clear();

        await stepGroups.stepGroup_Verification_for_the_Header_Mapping(page, vars);

        log.stepPass("Step 5 passed: Clearing search restores all results");
      } catch (error) {
        log.stepFail(page, "Step 5 failed: Clear search validation failed");
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