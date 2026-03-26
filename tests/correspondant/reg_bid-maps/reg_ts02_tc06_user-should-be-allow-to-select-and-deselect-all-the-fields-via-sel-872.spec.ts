// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { AmortizationTypePage } from '../../../src/pages/correspondant/amortization-type';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { P24UnitDropdownPage } from '../../../src/pages/correspondant/p-24-unit-dropdown';
import { ENV } from '@config/environments'
import { Logger as log } from '../../../src/helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = "REG_TS02_TC06";
const TC_TITLE = "User should be allow to select and deselect all the Fields via \"Select all\" checkbox."

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let amortizationTypePage: AmortizationTypePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let p24UnitDropdownPage: P24UnitDropdownPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    amortizationTypePage = new AmortizationTypePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    p24UnitDropdownPage = new P24UnitDropdownPage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      vars["Username"] = credentials.username;
      vars["Password"] = credentials.password;

      log.step("Step 1: Login to CORR Portal");
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass("Step 1 passed: Logged in to CORR Portal successfully");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Failed to login to CORR Portal");
        throw error;
      }

      log.step("Step 2: Create Bid Map up to Header Mapping page");
      try {
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars,"DeepikaAugBidQA_(3)_(1)_(1)_(2).xlsx");
        log.stepPass("Step 2 passed: Navigated to Header Mapping page successfully");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Failed to create Bid Map up to Header Mapping");
        throw error;
      }

      log.step("Step 3: Select all fields using Select All checkbox");
      try {
        await expect(correspondentPortalPage.Select_All_Checkbox).toBeEnabled();
        await correspondentPortalPage.Select_All_Checkbox.check();
        log.stepPass("Step 3 passed: Select All checkbox selected successfully");
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Failed to select Select All checkbox");
        throw error;
      }

      log.step("Step 4: Verify all header fields are selected");
      try {
        vars["BidSampleFieldName"] = String(await p24UnitDropdownPage.Bid_Sample_Field_Name_in_Header_Mapping.count());
        vars["Count"] = appconstants.TWO;

        while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["BidSampleFieldName"]))) {
          await expect(amortizationTypePage.get_All_Header_Checkbox_In_Bid_Map(vars["Count"])).toBeVisible();
          vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
        }

        log.stepPass("Step 4 passed: All fields are selected successfully");
      } catch (error) {
        log.stepFail(page, "Step 4 failed: Not all fields are selected");
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