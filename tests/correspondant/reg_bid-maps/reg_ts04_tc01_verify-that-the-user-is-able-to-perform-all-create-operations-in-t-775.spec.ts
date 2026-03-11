// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { NameCantBeEmptyPage } from '../../../src/pages/correspondant/name-cant-be-empty';
import { ENV } from '@config/environments'
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = "REG_TS04_TC01";
const TC_TITLE = "Verify that the user is able to perform all Create operations in the header mapping.";

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let headerMappingPage: HeaderMappingPage;
  let nameCantBeEmptyPage: NameCantBeEmptyPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    nameCantBeEmptyPage = new NameCantBeEmptyPage(page);
  });


  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);
  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      if (profile && profile.data) {
        const customHeader = profile.data[0]['Custom Header'];
        vars["Custom Header"] = customHeader;
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
      }

      log.step("Step 1: Login to CORR Portal and navigate to Header Mapping");
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
        await expect(correspondentPortalPage.Rules_and_Actions_Step_4_of_4).toBeVisible();
        log.stepPass("Step 1 passed: Logged in and navigated to Rules and Actions step.");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Unable to login or navigate up to Header Mapping.");
        throw error;
      }

      log.step("Step 2: Add new header and validate required name message");
      try {
        await correspondentPortalPage.Add_New_Header_Button.click();
        await expect(correspondentPortalPage.Add_Header).toBeVisible();
        await correspondentPortalPage.Insert_Header_Button.click();
        await expect(nameCantBeEmptyPage.Name_cant_be_empty).toBeVisible();
        await correspondentPortalPage.Custom_Header_Field.pressSequentially(vars["Custom Header"]);
        await expect(nameCantBeEmptyPage.Name_cant_be_empty).toBeHidden();
        log.stepPass("Step 2 passed: New header flow opened and name validation handled.");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Unable to add new header or validate name required message.");
        throw error;
      }

      log.step("Step 3: Select Chase field name and insert header mapping");
      try {
        await correspondentPortalPage.Chase_Field_Name.click();
        await correspondentPortalPage.Chase_Field_Name.selectOption({ index: parseInt("10") });
        await correspondentPortalPage.Insert_Header_Button.click();
        await expect(correspondentPortalPage.New_Header_Mapping).toBeVisible();
        vars["Header Value"] = await headerMappingPage.getHeaderValueInMapping(vars["Custom Header"]).getAttribute('title') || '';
        await expect(enumerationMappingButtonPage.Enumeration_Mapping_Button).toBeVisible();
        log.stepPass("Step 3 passed: Header inserted and mapping is visible.");
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Unable to select chase field, insert header, or verify mapping.");
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
