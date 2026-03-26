// [POM-APPLIED]
import { test, expect, Page } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ActionruleheaderPage } from '../../../src/pages/correspondant/actionruleheader';
import { CorrespondentPortal10Page } from '../../../src/pages/correspondant/correspondent-portal-10';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { NameCantBeEmptyPage } from '../../../src/pages/correspondant/name-cant-be-empty';
import { P15ActivePage } from '../../../src/pages/correspondant/p-15-active';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments'
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = "REG_TS02_TC02";
const TC_TITLE = "Verify that the user is able to Update the Bid Sample Field Name and CLM Field Name."

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let actionruleheaderPage: ActionruleheaderPage;
  let correspondentPortal10Page: CorrespondentPortal10Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let nameCantBeEmptyPage: NameCantBeEmptyPage;
  let p15ActivePage: P15ActivePage;
  let statusInactive2Page: StatusInactive2Page;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    actionruleheaderPage = new ActionruleheaderPage(page);
    correspondentPortal10Page = new CorrespondentPortal10Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    nameCantBeEmptyPage = new NameCantBeEmptyPage(page);
    p15ActivePage = new P15ActivePage(page);
    statusInactive2Page = new StatusInactive2Page(page);
  });

  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step("Step 1: Prepare test data and login");
      try {
        if (profile && profile.data) {
          const chaseFieldName = profile.data[0]['ChaseFieldName'];
          const emptyChaseFieldName = profile.data[0]["EmptyChaseFieldName"];

          vars["ChaseFieldName"] = chaseFieldName;
          vars["EmptyChaseFieldName"] = emptyChaseFieldName;
          vars["Username"] = credentials.username;
          vars["Password"] = credentials.password;

          log.info(`ChaseFieldName: ${vars["ChaseFieldName"]}`);
          log.info(`EmptyChaseFieldName: ${vars["EmptyChaseFieldName"]}`);
        }

        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars,"DeepikaAugBidQA_(3)_(1)_(1)_(2).xlsx");

        log.stepPass("Step 1 passed: Logged in and navigated to Header Mapping");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Setup/Login failed");
        throw error;
      }

      log.step("Step 2: Validate empty header update error");
      try {
        await correspondentPortalPage.Edit_icon_in_Header_Mapping.click();
        await expect(correspondentPortalPage.Custom_Header_Field).toBeVisible();

        await correspondentPortalPage.Custom_Header_Field.clear();
        await correspondentPortalPage.Update_Header_Button.click();
        await expect(nameCantBeEmptyPage.Name_cant_be_empty).toBeVisible();

        await correspondentPortalPage.close_pop_up_bid_request_details.click();

        await correspondentPortalPage.Edit_icon_in_Header_Mapping.click();
        await expect(correspondentPortalPage.Custom_Header_Field).toBeVisible();

        await correspondentPortalPage.Custom_Header_Field.clear();
        await correspondentPortalPage.Update_Header_Button.click();
        await expect(nameCantBeEmptyPage.Name_cant_be_empty).toBeVisible();

        log.stepPass("Step 2 passed: Empty header validation working");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Empty header validation failed");
        throw error;
      }

      log.step("Step 3: Update header with valid data");
      try {
        vars["CustomHeader"] = Array.from({ length: 5 }, () => "abc".charAt(Math.floor(Math.random() * 3))).join('');
        log.info(`Generated CustomHeader: ${vars["CustomHeader"]}`);

        await correspondentPortalPage.Custom_Header_Field.pressSequentially(vars["CustomHeader"]);
        await correspondentPortalPage.Chase_Field_Name.selectOption({ label: vars["ChaseFieldName"] });

        await expect(page.getByText(vars["ChaseFieldName"]).nth(1)).toBeVisible();

        await correspondentPortalPage.Update_Header_Button.click();
        await expect(page.getByText(vars["CustomHeader"])).toBeVisible();

        log.stepPass("Step 3 passed: Header updated successfully");
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Header update failed");
        throw error;
      }

      log.step("Step 4: Validate Chase field mapping");
      try {
        await correspondentPortalPage.Chase_Values_Dropdown.click();
        await correspondentPortalPage.Chase_Values_Dropdown.selectOption({ label: vars["ChaseFieldName"] });

        await expect(page.getByText(vars["ChaseFieldName"]).nth(1)).toBeVisible();

        if (await correspondentPortalPage.Header_Data_Mapping_Field.isVisible()) {
          await correspondentPortalPage.Option_in_Chase_Field_Name.click();

          vars["UpdatedChaseFieldName"] = await correspondentPortalPage.Option_in_Chase_Field_Name.textContent() || '';
          log.info(`UpdatedChaseFieldName: ${vars["UpdatedChaseFieldName"]}`);
          await expect(statusInactive2Page.Custom_Header_Section).toContainText(vars["UpdatedChaseFieldName"]);
          vars["UpdatedchaseField"] = String(vars["UpdatedChaseFieldName"]).substring(1,String(vars["UpdatedChaseFieldName"]).length - 1);
          log.info(`Processed UpdatedchaseField: ${vars["UpdatedchaseField"]}`);
          await expect(actionruleheaderPage.New_Bid_Sample_Field_Name_contains).toHaveValue(vars["UpdatedchaseField"]);
        }

        log.stepPass("Step 4 passed: Chase field mapping validated");
      } catch (error) {
        log.stepFail(page, "Step 4 failed: Chase field validation failed");
        throw error;
      }

      log.step("Step 5: Validate empty Chase field selection");
      try {
        await p15ActivePage.Select_Chase_Field_Name.selectOption({ value: vars["EmptyChaseFieldName"] });
        await expect(p15ActivePage.Select_Chase_Field_Name).toContainText(vars["EmptyChaseFieldName"]);

        log.stepPass("Step 5 passed: Empty Chase field handled correctly");
      } catch (error) {
        log.stepFail(page, "Step 5 failed: Empty Chase field validation failed");
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