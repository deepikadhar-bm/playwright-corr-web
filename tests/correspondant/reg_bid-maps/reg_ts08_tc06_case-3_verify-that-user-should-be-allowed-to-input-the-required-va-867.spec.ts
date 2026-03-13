// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BackButtonPage } from '../../../src/pages/correspondant/back-button';
import { CorrespondentPortal16Page } from '../../../src/pages/correspondant/correspondent-portal-16';
import { CorrespondentPortal7Page } from '../../../src/pages/correspondant/correspondent-portal-7';
import { CorrespondentPortal8Page } from '../../../src/pages/correspondant/correspondent-portal-8';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { P1MoreButtonPage } from '../../../src/pages/correspondant/p-1-more-button';
import { P1morePage } from '../../../src/pages/correspondant/p-1more';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { ThisActionWillSaveTheChangesAndMoveToNextPagePage } from '../../../src/pages/correspondant/this-action-will-save-the-changes-and-move-to-next-page';
import { uploadFile } from '../../../src/helpers/file-helpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';

const TC_ID = "REG_TS08_TC06_CASE-3";
const TC_TITLE = "Verify that user should be allowed to input the required value for the chase value in the dropdown (for now verify for product code value, loan term).";

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let backButtonPage: BackButtonPage;
  let correspondentPortal16Page: CorrespondentPortal16Page;
  let correspondentPortal7Page: CorrespondentPortal7Page;
  let correspondentPortal8Page: CorrespondentPortal8Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let headerMappingPage: HeaderMappingPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let p1MoreButtonPage: P1MoreButtonPage;
  let p1morePage: P1morePage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactivePage: StatusInactivePage;
  let thisActionWillSaveTheChangesAndMoveToNextPagePage: ThisActionWillSaveTheChangesAndMoveToNextPagePage;

  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    backButtonPage = new BackButtonPage(page);
    correspondentPortal16Page = new CorrespondentPortal16Page(page);
    correspondentPortal7Page = new CorrespondentPortal7Page(page);
    correspondentPortal8Page = new CorrespondentPortal8Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    p1MoreButtonPage = new P1MoreButtonPage(page);
    p1morePage = new P1morePage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactivePage = new StatusInactivePage(page);
    thisActionWillSaveTheChangesAndMoveToNextPagePage = new ThisActionWillSaveTheChangesAndMoveToNextPagePage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step("Step 1: Login to CORR Portal, enable Smart Mapper, and create a new Bid Map");
      try {
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        await stepGroups.stepGroup_Creation_Of_New_Map(page, vars);
        log.stepPass("Step 1 passed: Successfully logged in, Smart Mapper enabled, and new map creation started.");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Unable to login, enable Smart Mapper, or start new map creation.");
        throw error;
      }

      log.step("Step 2: Upload Bid Map file and proceed to header mapping");
      try {
        await uploadFile(page, correspondentPortalPage.Upload_File, "Bid_Maps_File.xlsx");
        await correspondentPortal16Page.File_Field.hover();
        await mapHeadersButtonPage.Map_Headers_Button.click();
        await expect(thisActionWillSaveTheChangesAndMoveToNextPagePage.This_action_will_save_the_changes_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass("Step 2 passed: File uploaded and header mapping initiated successfully.");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Unable to upload file or proceed with header mapping.");
        throw error;
      }

      log.step("Step 3: Navigate to Enumeration Mapping and proceed past unidentified fields popup");
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass("Step 3 passed: Enumeration Mapping opened and unidentified fields popup handled.");
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Unable to open Enumeration Mapping or handle unidentified fields popup.");
        throw error;
      }

      log.step("Step 4: Select Product Name Chase Value in Enumeration Mapping");
      try {
        await correspondentPortalPage.Product_Name_Dropdown.click();
        await expect(correspondentPortal7Page.Search_Field_in_Enumeration_Mapping).toBeVisible();
        await correspondentPortal7Page.Search_Field_in_Enumeration_Mapping.fill("Hii");
        await correspondentPortal7Page.Select_Button_in_Enumeration_Mapping.click();
        await expect(p1MoreButtonPage.Product_Name_in_Enumeration_Mapping).toContainText("Hii");
        log.stepPass("Step 4 passed: Product Name Chase Value selected successfully.");
      } catch (error) {
        log.stepFail(page, "Step 4 failed: Unable to input or verify Product Name Chase Value.");
        throw error;
      }

      log.step("Step 5: Navigate to Rules and Actions and proceed with saving");
      try {
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await expect(statusInactivePage.You_have_unidentified_Fields_This_action_will_save_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass("Step 5 passed: Navigated through Rules and Actions and returned to previous page.");
      } catch (error) {
        log.stepFail(page, "Step 5 failed: Unable to navigate through Rules and Actions or return.");
        throw error;
      }

      log.step("Step 6: Input Loan Term Chase Value and verify persistence");
      try {
        await statusInactive2Page.Loan_Term_Dropdown.click();
        await expect(statusInactive2Page.Loan_Term_Search_TextField).toBeVisible();
        await statusInactive2Page.Loan_Term_Search_TextField.fill("hey");
        await p1morePage.Loan_Term_Select.click();
        await expect(p1morePage.Loan_Term_Chase_Value).toContainText("hey");
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await expect(statusInactivePage.You_have_unidentified_Fields_This_action_will_save_and_Move_to_Next_Page).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(p1morePage.Loan_Term_Chase_Value).toBeVisible();
        log.stepPass("Step 6 passed: Loan Term Chase Value entered and verified successfully.");
      } catch (error) {
        log.stepFail(page, "Step 6 failed: Unable to input or verify Loan Term Chase Value.");
        throw error;
      }

      log.tcEnd('PASS');

    } catch (error) {
      await log.captureOnFailure(page, TC_ID, error);
      log.tcEnd('FAIL');
      throw error;
    }
  });
});