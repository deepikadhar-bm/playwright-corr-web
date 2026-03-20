// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ActionruleheaderPage } from '../../../src/pages/correspondant/actionruleheader';
import { BidMapsPage } from '../../../src/pages/correspondant/bid-maps';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { EnumerationMappingPage } from '../../../src/pages/correspondant/enumeration-mapping';
import { EnumertionPage } from '../../../src/pages/correspondant/enumertion';
import { CorrPortalPage } from '../../../src/pages/correspondant/CorrPortalPage';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { testDataManager } from 'testdata/TestDataManager';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { uploadFile } from '../../../src/helpers/file-helpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments'

const TC_ID = "REG_TS13_TC02";
const TC_TITLE = "Enumeration Mapping - Verify save draft preserves data across screens"

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let actionruleheaderPage: ActionruleheaderPage;
  let bidMapsPage: BidMapsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let enumerationMappingPage: EnumerationMappingPage;
  let enumertionPage: EnumertionPage;
  let headerMappingPage: HeaderMappingPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let spinnerPage: SpinnerPage;
  let corrPortalPage: CorrPortalPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    actionruleheaderPage = new ActionruleheaderPage(page);
    bidMapsPage = new BidMapsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    enumerationMappingPage = new EnumerationMappingPage(page);
    enumertionPage = new EnumertionPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    corrPortalPage = new CorrPortalPage(page);
  });

  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {
      log.step("Step 1: Login and navigate to Enumeration Mapping");
      try {
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        log.info(`Username set`);
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars, "DeepikaAugBidQA_(3)_(1)_(1)_(2).xlsx");
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(rulesAndActionsButtonPage.Rules_and_Actions_Button).toBeVisible();
        log.stepPass("Step 1 passed");
      } catch (error) {
        log.stepFail(page, "Step 1 failed");
        throw error;
      }

      log.step("Step 2: Perform add/edit/delete operations in Enumeration Mapping");
      try {
        await stepGroups.stepGroup_Adding_Field_In_Enumeration_Mapping(page, vars);
        vars["NewFieldChaseValue"] = await enumerationMappingPage.Added_Chase_Value_Dropdown.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        log.info(`NewFieldChaseValue: ${vars["NewFieldChaseValue"]}`);
        await stepGroups.stepGroup_Editing_In_Enumeration_Mapping_Screen(page, vars);
        await stepGroups.stepGroup_Delete_In_Enumeration_Mapping(page, vars);
        log.stepPass("Step 2 passed");
      } catch (error) {
        log.stepFail(page, "Step 2 failed");
        throw error;
      }

      log.step("Step 3: Select headers and capture values");
      try {
        await headerMappingPage.First_Header_Checkbox.check();
        await expect(headerMappingPage.First_Header_Checkbox).toBeVisible();
        vars["FirstBidSampleName"] = await enumerationMappingPage.First_Bid_Sample_Name_In_Enumeration.textContent() || '';
        log.info(`FirstBidSampleName: ${vars["FirstBidSampleName"]}`);
        await actionruleheaderPage.Second_Header_Checkbox.check();
        await expect(actionruleheaderPage.Second_Header_Checkbox).toBeVisible();
        vars["SecondBidSampleName"] = await enumerationMappingPage.Second_Bid_Sample_Name_In_Enumeration.textContent() || '';
        log.info(`SecondBidSampleName: ${vars["SecondBidSampleName"]}`);
        log.stepPass("Step 3 passed");
      } catch (error) {
        log.stepFail(page, "Step 3 failed");
        throw error;
      }

      log.step("Step 4: Save draft and validate persistence");
      try {
        await correspondentPortalPage.Save_Draft_Button1.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["NewFieldChaseValueAfterSaveDraftExit"] = await correspondentPortalPage.New_Field_Chase_Dropdown.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        log.info(`NewFieldChaseValueAfterSaveDraftExit: ${vars["NewFieldChaseValueAfterSaveDraftExit"]}`);
        expect(String(vars["NewFieldChaseValue"])).toBe(vars["NewFieldChaseValueAfterSaveDraftExit"]);
        await expect(bidMapsPage.get_Edited_Chase_Value_After_Save_new(vars["EditedChaseFieldName"])).toHaveValue(vars["EditedChaseValue"]);
        await expect(enumerationMappingPage.get_Deleted_Field_In_Enumeration(vars["BidTapeValueforBeforeDeleted"])).not.toBeVisible();
        await expect(enumertionPage.get_Bid_Sample_Name_1(vars["FirstBidSampleName"])).toBeChecked();
        await expect(enumerationMappingPage.get_Bid_Sample_Name_2(vars["SecondBidSampleName"])).toBeChecked();
        log.stepPass("Step 4 passed");
      } catch (error) {
        log.stepFail(page, "Step 4 failed");
        throw error;
      }

      log.step("Step 5: Modify selection and verify after save draft");
      try {
        await enumertionPage.get_Bid_Sample_Name_1(vars["FirstBidSampleName"]).uncheck();
        await expect(enumertionPage.get_Bid_Sample_Name_1(vars["FirstBidSampleName"])).not.toBeChecked();
        await correspondentPortalPage.Save_Draft_Button1.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(enumertionPage.get_Bid_Sample_Name_1(vars["FirstBidSampleName"])).not.toBeChecked();
        await expect(enumerationMappingPage.get_Bid_Sample_Name_2(vars["SecondBidSampleName"])).toBeChecked();
        log.stepPass("Step 5 passed");
      } catch (error) {
        log.stepFail(page, "Step 5 failed");
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