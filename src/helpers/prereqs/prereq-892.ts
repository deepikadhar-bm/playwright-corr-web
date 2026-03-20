import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../step-groups';
import { BidRequestCreationPage } from '../../pages/correspondant/bid-request-creation';
import { BidRequestDetailsPage } from '../../pages/correspondant/bid-request-details';
import { CorrespondentPortal18Page } from '../../pages/correspondant/correspondent-portal-18';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../pages/correspondant/enumeration-mapping-button';
import { MapHeadersButtonPage } from '../../pages/correspondant/map-headers-button';
import { P15ActivePage } from '../../pages/correspondant/p-15-active';
import { ProceedWithSavingButtonPage } from '../../pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../pages/correspondant/save-and-publish-button';
import { SelectDropdownPage } from '../../pages/correspondant/select-dropdown';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { StatusInactivePage } from '../../pages/correspondant/status-inactive-';
import { ThisActionWillSaveTheChangesAndMoveToNextPagePage } from '../../pages/correspondant/this-action-will-save-the-changes-and-move-to-next-page';
import { UploadNewBidRequestButtonPage } from '../../pages/correspondant/upload-new-bid-request-button';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
export async function runPrereq_892(page: Page, vars: Record<string, string>): Promise<void> {
  const bidRequestCreationPage = new BidRequestCreationPage(page);
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const correspondentPortal18Page = new CorrespondentPortal18Page(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
  const mapHeadersButtonPage = new MapHeadersButtonPage(page);
  const p15ActivePage = new P15ActivePage(page);
  const proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
  const rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
  const saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
  const selectDropdownPage = new SelectDropdownPage(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactivePage = new StatusInactivePage(page);
  const thisActionWillSaveTheChangesAndMoveToNextPagePage = new ThisActionWillSaveTheChangesAndMoveToNextPagePage(page);
  const uploadNewBidRequestButtonPage = new UploadNewBidRequestButtonPage(page);


  //log.tcStart(TC_ID, TC_TITLE);
  log.info('Running Prerequisite: PREREQ-892 - Create Bid Map with Company A as Active and Company B as Inactive and verify the same in Bid Request creation page');
  const TC_ID = 'PREREQ-892';
  const TC_TITLE = 'Create Bid Map with Company A as Active and Company B as Inactive and verify the same in Bid Request creation page';
      try {
        log.tcStart(TC_ID, TC_TITLE);
        // ── Step 1: Load Credentials and Test Data ────────────────────────────
        log.step('Loading credentials and test data');
        try {
          //   const testData: Record<string, string> = {
          // "CompanyName1": "Freedom",
          // "CompanyName2": "Wik1C BeuLD MoJbr CoEmy LLpoJ  - A2964",
          //   };
          const credentials = ENV.getCredentials('internal');
          vars["Username"] = credentials.username;
          vars["Password"] = credentials.password;
          const profileName = 'Bid_Maps'; // TDP sheet name
          const profile = testDataManager.getProfileByName(profileName);
          if (profile && profile.data) {
            const CompanyName1 = profile.data[0]['CompanyName1'];
            vars["CompanyName1"] = CompanyName1;
            const CompanyName2 = profile.data[0]['CompanyName2'];
            vars["CompanyName2"] = CompanyName2;
          }
          log.stepPass(`Credentials and test data loaded successfully - Company 1: ${vars["CompanyName1"]}, Company 2: ${vars["CompanyName2"]}`);
        } catch (e) {
          await log.stepFail(page, 'Loading credentials and test data failed');
          throw e;
        }
  
        // ── Step 2: Login to Correspondent Portal ─────────────────────────────
        log.step('Login to Correspondent Portal');
        try {
          await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
          log.stepPass('Login to Correspondent Portal successful');
        } catch (e) {
          await log.stepFail(page, 'Login to Correspondent Portal failed');
          throw e;
        }
  
        // ── Step 3: Create Bid Maps and Select Companies ──────────────────────
        log.step('Creating Bid Maps and selecting companies');
        try {
          await stepGroups.stepGroup_Create_Bid_MapsCompanies_verification(page, vars);
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await correspondentPortalPage.Select_Companys_Dropdown.click();
          await correspondentPortalPage.Search_Text_Field.fill(vars["CompanyName1"]);
          await p15ActivePage.Select_Company_Names(vars["CompanyName1"]).click();
          await correspondentPortalPage.Apply_Selected.click();
          await correspondentPortalPage.Select_Companys_Dropdown.click();
          await correspondentPortalPage.Search_Text_Field.fill(vars["CompanyName2"]);
          await statusInactivePage.Select_Company_Name(vars["CompanyName2"]).click();
          await expect(correspondentPortalPage.Apply_Selected_for_Bid_Maps).toContainText("2");
          await correspondentPortalPage.Apply_Selected.click();
          log.stepPass(`Bid Maps created and both companies selected - Company 1: ${vars["CompanyName1"]}, Company 2: ${vars["CompanyName2"]}`);
        } catch (e) {
          await log.stepFail(page, 'Creating Bid Maps or selecting companies failed');
          throw e;
        }
  
        // ── Step 4: Upload File and Map Headers ───────────────────────────────
        log.step('Uploading file and mapping headers');
        try {
          //await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, 'test-data', "DeepikaAugBidQA.xlsx"));
          await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, '../../../uploads', "DeepikaAugBidQA_(3)_(1)_(1)_(2).xlsx"));
          await mapHeadersButtonPage.Map_Headers_Button.click();
          await expect(thisActionWillSaveTheChangesAndMoveToNextPagePage.This_action_will_save_the_changes_and_Move_to_Next_Page).toBeVisible();
          await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.stepPass('File uploaded and headers mapped successfully');
        } catch (e) {
          await log.stepFail(page, 'Uploading file or mapping headers failed');
          throw e;
        }
  
        // ── Step 5: Proceed through Enumeration Mapping ───────────────────────
        log.step('Proceeding through Enumeration Mapping');
        try {
          await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
          await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
          await correspondentPortal18Page.Yes_Proceed_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.stepPass('Enumeration Mapping proceeded successfully');
        } catch (e) {
          await log.stepFail(page, 'Proceeding through Enumeration Mapping failed');
          throw e;
        }
  
        // ── Step 6: Proceed through Rules and Actions ─────────────────────────
        log.step('Proceeding through Rules and Actions');
        try {
          await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          // [DISABLED] Wait until the element You have unidentified fields do you want to proceed Further. is visible
          // await correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further.waitFor({ state: 'visible' });
          // [DISABLED] Verify that the element You have unidentified fields do you want to proceed Further. displays text You have unidentified fields do you want to proceed further. and With Scrollable FALSE
          // await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toContainText("You have unidentified fields do you want to proceed further.");
          await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
          await correspondentPortal18Page.Yes_Proceed_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.stepPass('Rules and Actions proceeded successfully');
        } catch (e) {
          await log.stepFail(page, 'Proceeding through Rules and Actions failed');
          throw e;
        }
  
        // ── Step 7: Save and Publish ──────────────────────────────────────────
        log.step('Saving and publishing');
        try {
          await saveAndPublishButtonPage.Save_and_Publish_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.stepPass('Saved and published successfully');
        } catch (e) {
          await log.stepFail(page, 'Saving and publishing failed');
          throw e;
        }
  
        // ── Step 8: Navigate to Upload New Bid Request ────────────────────────
        log.step('Navigating to Upload New Bid Request');
        try {
          await correspondentPortalPage.Bid_Requests.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await expect(uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button).toBeVisible();
          await uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          log.stepPass('Navigated to Upload New Bid Request successfully');
        } catch (e) {
          await log.stepFail(page, 'Navigating to Upload New Bid Request failed');
          throw e;
        }
  
        // ── Step 9: Select Company and Verify Bid Map in Dropdown ────────────
        log.step('Selecting company and verifying associated Bid Map in dropdown');
        try {
          await selectDropdownPage.Select_Company_In_BidRequest.click();
          await bidRequestCreationPage.Select_Company_Search_Input.fill(vars["CompanyName1"]);
          await statusInactivePage.Required_Company_In_List(vars["CompanyName1"]).click();
          await expect((page.getByText(vars["CompanyName1"])).first()).toBeVisible();
          await correspondentPortalPage.Bid_Mapping_ID_Dropdown_2.click();
          await correspondentPortalPage.Search_boxBid_mapping_id.fill(vars["CreatedBidMap"]);
          await bidRequestDetailsPage.Searched_Data_in_List(vars["CreatedBidMap"]).waitFor({ state: 'visible' });
          // [DISABLED] Wait until the current page is loaded completely
          // await page.waitForLoadState('networkidle');
          // [DISABLED] Verify that the element Searched Data in List has value CreatedBidMap for title and With Scrollable FALSE
          // await expect(bidRequestDetailsPage.Searched_Data_in_List).toHaveAttribute('title', vars["CreatedBidMap"]);
          log.stepPass(`Company selected and Bid Map verified in dropdown - Company: ${vars["CompanyName1"]}, Bid Map: ${vars["CreatedBidMap"]}`);
        } catch (e) {
          await log.stepFail(page, `Selecting company or verifying Bid Map in dropdown failed - Company: ${vars["CompanyName1"]}, Bid Map: ${vars["CreatedBidMap"]}`);
          throw e;
        }
  
        // ─── TC End: PASS ─────────────────────────────────────────────────────
        log.tcEnd('PASS');
  
      } catch (e) {
        // ─── TC End: FAIL ─────────────────────────────────────────────────────
        await log.captureOnFailure(page, TC_ID, e);
        log.tcEnd('FAIL');
        throw e;
      } // await expect(bidRequestDetailsPage.Searched_Data_in_List).toHaveAttribute('title', vars["CreatedBidMap"]);
}
