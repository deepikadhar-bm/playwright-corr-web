// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortal4Page } from '../../../src/pages/correspondant/correspondent-portal-4';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { NameCantBeEmptyPage } from '../../../src/pages/correspondant/name-cant-be-empty';
import { runPrereq_775 } from '../../../src/helpers/prereqs/prereq-775';
import { ENV } from '@config/environments'
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = "REG_TS04_TC02";
const TC_TITLE = "Verify that the user is able to perform all Edit operations in the header mapping.";

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let correspondentPortal4Page: CorrespondentPortal4Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let headerMappingPage: HeaderMappingPage;
  let nameCantBeEmptyPage: NameCantBeEmptyPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_775(page, vars);
    correspondentPortal4Page = new CorrespondentPortal4Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    nameCantBeEmptyPage = new NameCantBeEmptyPage(page);
  });


  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);
  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      if (profile && profile.data) {
        const chaseFieldName = profile.data[0]['Chase Field Name'];
        vars["Chase Field Name"] = chaseFieldName;
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
      }

      log.step("Step 1: Run prereq and reach Header Mapping page");
      try {
        // prereq runs in beforeEach, validate we can proceed
        await expect(correspondentPortalPage.Edit_icon_in_Header_Mapping).toBeVisible();
        log.stepPass("Step 1 passed: Prerequisite completed and Header Mapping edit icon is visible.");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Prerequisite did not land on Header Mapping page.");
        throw error;
      }

      log.step("Step 2: Start editing header mapping and verify required name validation");
      try {
        await correspondentPortalPage.Edit_icon_in_Header_Mapping.click();
        await expect(correspondentPortalPage.Update_Header).toBeVisible();
        await correspondentPortal4Page.Custom_Header.clear();
        await correspondentPortalPage.Update_Header_Button.click();
        await expect(nameCantBeEmptyPage.Name_cant_be_empty).toBeVisible();
        log.stepPass("Step 2 passed: Edit modal opened and 'Name cant be empty' validation displayed.");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Unable to open edit flow or validate name required message.");
        throw error;
      }

      log.step("Step 3: Update header name and Chase field, then save");
      try {
        await correspondentPortal4Page.Custom_Header.fill(vars["Chase Field Name"]);
        await correspondentPortalPage.Chase_Field_Name.selectOption({ index: parseInt("11") });
        await correspondentPortalPage.Update_Header_Button.click();
        await expect(headerMappingPage.Chase_Field_Name_Text_Field.last()).toBeVisible();
        log.stepPass("Step 3 passed: Header updated successfully and mapping is visible.");
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Unable to update header mapping or verify saved changes.");
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
