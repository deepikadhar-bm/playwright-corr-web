// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidrequestPage } from '../../../src/pages/correspondant/bidrequest';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortal18Page } from '../../../src/pages/correspondant/correspondent-portal-18';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { MapHeadersButtonPage } from '../../../src/pages/correspondant/map-headers-button';
import { P15ActivePage } from '../../../src/pages/correspondant/p-15-active';
import { P1morePage } from '../../../src/pages/correspondant/p-1more';
import { P2142530YrFreddieMacFixedDropdownPage } from '../../../src/pages/correspondant/p-2142530-yr-freddie-mac-fixed-dropdown';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SelectDropdownPage } from '../../../src/pages/correspondant/select-dropdown';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { ThisActionWillSaveTheChangesAndMoveToNextPagePage } from '../../../src/pages/correspondant/this-action-will-save-the-changes-and-move-to-next-page';
import { UploadNewBidRequestButtonPage } from '../../../src/pages/correspondant/upload-new-bid-request-button';
import { runPrereq_893 } from '../../../src/helpers/prereqs/prereq-893';
import { Logger as log } from '../../../src/helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';

const TC_ID = 'REG_TS01_TC08';
const TC_TITLE = 'Select the Company B\\\" from the \\\'Select company\\\" dropdown and now in the \\\"Bid mapping id\\\" dropdown verify that the bid map names that are not associated with this company should not ';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidrequestPage: BidrequestPage;
  let bidRequestPage: BidRequestPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortal18Page: CorrespondentPortal18Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let mapHeadersButtonPage: MapHeadersButtonPage;
  let p15ActivePage: P15ActivePage;
  let p1morePage: P1morePage;
  let p2142530YrFreddieMacFixedDropdownPage: P2142530YrFreddieMacFixedDropdownPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let selectDropdownPage: SelectDropdownPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;
  let thisActionWillSaveTheChangesAndMoveToNextPagePage: ThisActionWillSaveTheChangesAndMoveToNextPagePage;
  let uploadNewBidRequestButtonPage: UploadNewBidRequestButtonPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_893(page, vars);
    bidrequestPage = new BidrequestPage(page);
    bidRequestPage = new BidRequestPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    mapHeadersButtonPage = new MapHeadersButtonPage(page);
    p15ActivePage = new P15ActivePage(page);
    p1morePage = new P1morePage(page);
    p2142530YrFreddieMacFixedDropdownPage = new P2142530YrFreddieMacFixedDropdownPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    selectDropdownPage = new SelectDropdownPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
    thisActionWillSaveTheChangesAndMoveToNextPagePage = new ThisActionWillSaveTheChangesAndMoveToNextPagePage(page);
    uploadNewBidRequestButtonPage = new UploadNewBidRequestButtonPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
  });

  test(`${TC_ID}_${TC_TITLE}`, async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Step 1: Navigate to Bid Requests ──────────────────────────────────
      log.step('Navigating to Bid Requests');
      try {
        // [DISABLED] Login to CORR Portal
        // await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        // [DISABLED] Create Bid Map
        // await stepGroups.stepGroup_Create_Bid_Map(page, vars);
        // [DISABLED] Wait until the element Spinner is not visible
        // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        // [DISABLED] Click on Select Company/s Dropdown
        // await correspondentPortalPage.Select_Companys_Dropdown.click();
        // [DISABLED] Enter Company Name in the Search_Text field
        // await bidRequestPage.Bid_Mapping_IdSearch_Input_box.fill(testData["Company Name"]);
        // [DISABLED] Click on Select Company Names
        // await p15ActivePage.Select_Company_Names.click();
        // [DISABLED] Click on Apply Selected
        // await correspondentPortalPage.Apply_Selected.click();
        // [DISABLED] Click on Select Company/s Dropdown
        // await correspondentPortalPage.Select_Companys_Dropdown.click();
        // [DISABLED] Enter Company Name. in the Search_Text field
        // await bidRequestPage.Bid_Mapping_IdSearch_Input_box.fill(testData["Company Name."]);
        // [DISABLED] Click on Select_Company_Name
        // await statusInactivePage.Select_Company_Name.click();
        // [DISABLED] Verify that the element Apply selected  Number displays text 2 and With Scrollable FALSE
        // await expect(correspondentPortalPage.Apply_Selected_for_Bid_Maps).toContainText("2");
        // [DISABLED] Click on Apply Selected
        // await correspondentPortalPage.Apply_Selected.click();
        // [DISABLED] Upload file DeepikaAugBidQA.xlsx,DeepikaAugBidQA.xlsx using the element Upload File
        // await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, 'test-data', "DeepikaAugBidQA.xlsx"));
        // [DISABLED] Click on Map Headers Button
        // await mapHeadersButtonPage.Map_Headers_Button.click();
        // [DISABLED] Verify that the element This action will save the changes and Move to Next Page is displayed and With Scrollable FALSE
        // await expect(thisActionWillSaveTheChangesAndMoveToNextPagePage.This_action_will_save_the_changes_and_Move_to_Next_Page).toBeVisible();
        // [DISABLED] Click on Proceed with Saving Button
        // await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        // [DISABLED] Wait until the element Spinner is not visible
        // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        // [DISABLED] Click on Enumeration Mapping Button
        // await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        // [DISABLED] Verify that the element You have unidentified fields do you want to proceed Further. is displayed and With Scrollable FALSE
        // await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
        // [DISABLED] Click on Yes, Proceed Button.
        // await correspondentPortal18Page.Yes_Proceed_Button.click();
        // [DISABLED] Wait until the element Spinner is not visible
        // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        // [DISABLED] Click on Rules and Actions Button
        // await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        // [DISABLED] Verify that the element You have unidentified fields do you want to proceed Further. is displayed and With Scrollable FALSE
        // await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
        // [DISABLED] Click on Yes, Proceed Button.
        // await correspondentPortal18Page.Yes_Proceed_Button.click();
        // [DISABLED] Wait until the element Spinner is not visible
        // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        // [DISABLED] Click on Save and Publish Button
        // await saveAndPublishButtonPage.Save_and_Publish_Button.click();
        // [DISABLED] Wait until the element Spinner is not visible
        // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        // [DISABLED] Click on +1more
        // await p1morePage._1more.click();
        // [DISABLED] Verify that the current page displays text Create Bid Map
        // await expect(page.getByText(vars["Create Bid Map"])).toBeVisible();
        // [DISABLED] Verify that the element Company1 displays text Company Name and With Scrollable FALSE
        // await expect(statusInactivePage.Company1).toContainText(testData["Company Name"]);
        // [DISABLED] Verify that the element Company2 displays text Company Name. and With Scrollable FALSE
        // await expect(correspondentPortalPage.Company2).toContainText(testData["Company Name."]);
        // [DISABLED] Click on Close Button
        // await chaseFieldNamePage.Ok_Button_Bid_Request.click();
        // [DISABLED] Wait until the current page is loaded completely
        // await page.waitForLoadState('networkidle');
        await correspondentPortalPage.Bid_Requests.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button).toBeVisible();
        log.stepPass('Navigated to Bid Requests successfully');
      } catch (e) {
        await log.stepFail(page, 'Navigating to Bid Requests failed');
        throw e;
      }

      // ── Step 2: Navigate to Upload New Bid Request ────────────────────────
      log.step('Navigating to Upload New Bid Request');
      try {
        await uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Upload New Bid Request successfully');
      } catch (e) {
        await log.stepFail(page, 'Navigating to Upload New Bid Request failed');
        throw e;
      }

      // ── Step 3: Select Third Company from Dropdown ────────────────────────
      log.step('Selecting third company from dropdown and verifying selection');
      try {
        vars["Company3"] = (await bidRequestPage.New_Company_In_Dropdown(vars["CompanyName1"], vars["CompanyName2"]).textContent() || '').trim();
        await selectDropdownPage.Select_Company_In_BidRequest.click();
        await bidRequestPage.New_Company_In_Dropdown(vars["CompanyName1"], vars["CompanyName2"]).click();
        vars["3rdcompany"] = (await bidrequestPage.Company_SelectedSelect_Company_Dropdwn.first().textContent() || '').trim();
        expect(String(vars["3rdcompany"])).toBe(vars["Company3"]);
        log.stepPass(`Third company selected and verified - Company: ${vars["Company3"]}`);
      } catch (e) {
        await log.stepFail(page, `Selecting or verifying third company failed - Company: ${vars["Company3"]}`);
        throw e;
      }

      // ── Step 4: Search Bid Map and Verify it is Not Visible ───────────────
      log.step('Searching Bid Map and verifying it is not visible for unassociated company');
      try {
        await correspondentPortalPage.Bid_Mapping_ID_Dropdown_2.click();
        await correspondentPortalPage.Search_boxBid_mapping_id.fill(vars["CreatedBidMap"]);
        await page.waitForLoadState('load');
        await expect(bidRequestDetailsPage.Searched_Data_in_List(vars["CreatedBidMap"])).not.toBeVisible();
        log.stepPass(`Bid Map correctly not visible for unassociated company - Bid Map: ${vars["CreatedBidMap"]}`);
      } catch (e) {
        await log.stepFail(page, `Verifying Bid Map not visible failed - Bid Map: ${vars["CreatedBidMap"]}`);
        throw e;
      }

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }

  });
});