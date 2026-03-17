// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortal18Page } from '../../../src/pages/correspondant/correspondent-portal-18';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { NoButtonPage } from '../../../src/pages/correspondant/no-button';
import { P24UnitDropdownPage } from '../../../src/pages/correspondant/p-24-unit-dropdown';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments'

const TC_ID = "REG_TS02_TC03";
const TC_TITLE = "Delete Should trigger a confirmation pop up. Upon Delete, On click on 'X' / 'No' The pop up should close. Upon Delete, On click on 'Yes, Proceed' should delete the Mapping."

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortal18Page: CorrespondentPortal18Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let headerMappingPage: HeaderMappingPage;
  let noButtonPage: NoButtonPage;
  let p24UnitDropdownPage: P24UnitDropdownPage;
  let statusInactivePage: StatusInactivePage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    noButtonPage = new NoButtonPage(page);
    p24UnitDropdownPage = new P24UnitDropdownPage(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      log.step("Step 1: Login and navigate to Header Mapping");
      try {
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        log.info(`Username set`);
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
        log.stepPass("Step 1 passed: Navigated to Header Mapping page");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Login/Navigation failed");
        throw error;
      }

      log.step("Step 2: Capture header mapping value to delete");
      try {
        await expect(enumerationMappingButtonPage.Enumeration_Mapping_Button).toBeVisible();
        vars["DeleteHeaderMapping"] = await headerMappingPage.Deleting_Header.textContent() || '';
        log.info(`DeleteHeaderMapping: ${vars["DeleteHeaderMapping"]}`);
        log.stepPass("Step 2 passed: Header mapping captured");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Unable to capture header mapping");
        throw error;
      }

      log.step("Step 3: Validate popup close on 'X'");
      try {
        await correspondentPortalPage.Delete_icon.click();
        vars["DeleteHederMapping"] = await statusInactivePage.getDelete_Message(vars["DeleteHeaderMapping"]).textContent() || '';
        log.info(`Delete Popup Message: ${vars["DeleteHederMapping"]}`);
        await expect(page.getByText(vars["DeleteHederMapping"])).toBeVisible();
        await expect(statusInactivePage.getDelete_Message(vars["DeleteHeaderMapping"])).toBeVisible();
        await correspondentPortalPage.close_pop_up_bid_request_details.click();
        await expect(statusInactivePage.getDelete_Message(vars["DeleteHeaderMapping"])).not.toBeVisible();
        log.stepPass("Step 3 passed: Popup closed successfully using 'X'");
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Popup did not close using 'X'");
        throw error;
      }

      log.step("Step 4: Validate popup close on 'No'");
      try {
        await correspondentPortalPage.Delete_icon.click();
        await expect(statusInactivePage.getDelete_Message(vars["DeleteHeaderMapping"])).toBeVisible();

        await noButtonPage.No_Button.click();
        await expect(statusInactivePage.getDelete_Message(vars["DeleteHeaderMapping"])).not.toBeVisible();

        log.stepPass("Step 4 passed: Popup closed successfully using 'No'");
      } catch (error) {
        log.stepFail(page, "Step 4 failed: Popup did not close using 'No'");
        throw error;
      }

      log.step("Step 5: Validate delete on 'Yes, Proceed'");
      try {
        await correspondentPortalPage.Delete_icon.click();
        await expect(statusInactivePage.getDelete_Message(vars["DeleteHeaderMapping"])).toBeVisible();
        await expect(correspondentPortal18Page.Yes_Proceed_Button).toBeVisible();
        await correspondentPortal18Page.Yes_Proceed_Button.click();
        await expect(p24UnitDropdownPage.get_Header_Mapping(vars["DeleteHeaderMapping"])).not.toBeVisible();
        log.stepPass("Step 5 passed: Header mapping deleted successfully");
      } catch (error) {
        log.stepFail(page, "Step 5 failed: Delete action failed");
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