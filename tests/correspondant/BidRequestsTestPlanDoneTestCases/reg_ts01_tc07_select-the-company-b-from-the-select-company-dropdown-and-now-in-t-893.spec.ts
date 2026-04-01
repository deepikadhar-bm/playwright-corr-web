// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestCreationPage } from '../../../src/pages/correspondant/bid-request-creation';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SelectDropdownPage } from '../../../src/pages/correspondant/select-dropdown';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { UploadNewBidRequestButtonPage } from '../../../src/pages/correspondant/upload-new-bid-request-button';
import { runPrereq_892 } from '../../../src/helpers/prereqs/PreReqBidRequests/prereq-892';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';

const TC_ID = 'REG_TS01_TC07';
const TC_TITLE = 'Select the Company B\\\" from the \\\'Select company\\\" dropdown and now in the \\\"Bid mapping id\\\" dropdown verify that the associated bid map names are being displayed here. [ Verify atleast';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestCreationPage: BidRequestCreationPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let selectDropdownPage: SelectDropdownPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;
  let uploadNewBidRequestButtonPage: UploadNewBidRequestButtonPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_892(page, vars);
    bidRequestCreationPage = new BidRequestCreationPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    selectDropdownPage = new SelectDropdownPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
    uploadNewBidRequestButtonPage = new UploadNewBidRequestButtonPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
  });

  test(`${TC_ID}_${TC_TITLE}`, async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Step 1: Load Credentials and Test Data ────────────────────────────
      log.step('Loading credentials and test data');
      try {
        const credentials = ENV.getCredentials('internal');
                vars["Username"] = credentials.username;
                vars["Password"] = credentials.password;
            const profileName = 'Bid_Maps'; // TDP sheet name
                const profile = testDataManager.getProfileByName(profileName);
                if (profile && profile.data) {
                  const CompanyName2 = profile.data[0]['CompanyName2'];
                  vars["CompanyName2"] = CompanyName2;
                }
        log.stepPass(`Credentials and test data loaded successfully - Company: ${vars["CompanyName2"]}`);
      } catch (e) {
        await log.stepFail(page, 'Loading credentials and test data failed');
        throw e;
      }

      // ── Step 2: Navigate to Bid Requests ──────────────────────────────────
      log.step('Navigating to Bid Requests');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Bid_Requests.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button).toBeVisible();
        log.stepPass('Navigated to Bid Requests successfully');
      } catch (e) {
        await log.stepFail(page, 'Navigating to Bid Requests failed');
        throw e;
      }

      // ── Step 3: Navigate to Upload New Bid Request ────────────────────────
      log.step('Navigating to Upload New Bid Request');
      try {
        await uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Upload New Bid Request successfully');
      } catch (e) {
        await log.stepFail(page, 'Navigating to Upload New Bid Request failed');
        throw e;
      }

      // ── Step 4: Select Company in Bid Request ─────────────────────────────
      log.step('Selecting company in Upload Bid Request screen');
      try {
        await selectDropdownPage.Select_Company_In_BidRequest.click();
        await bidRequestCreationPage.Select_Company_Search_Input.fill(vars["CompanyName2"]);
        await statusInactivePage.Select_Company_Name(vars["CompanyName2"]).click();
        await expect(statusInactivePage.Select_Company_Name(vars["CompanyName2"])).toContainText(vars["CompanyName2"]);
        log.stepPass(`Company selected and verified - Company: ${vars["CompanyName2"]}`);
      } catch (e) {
        await log.stepFail(page, `Selecting company in Upload Bid Request screen failed - Company: ${vars["CompanyName2"]}`);
        throw e;
      }

      // ── Step 5: Search and Verify Bid Map in Dropdown ─────────────────────
      log.step('Searching and verifying associated Bid Map in dropdown');
      try {
        await correspondentPortalPage.Bid_Mapping_ID_Dropdown_2.click();
        await correspondentPortalPage.Search_boxBid_mapping_id.fill(vars["CreatedBidMap"]);
        await page.waitForLoadState('load');
        await bidRequestDetailsPage.Searched_Data_in_List(vars["CreatedBidMap"]).waitFor({ state: 'visible' });
        //await expect(correspondentPortalPage.Search_boxBid_mapping_id).toHaveAttribute('title', vars["CreatedBidMap"]);
        log.stepPass(`Bid Map verified in dropdown - Bid Map: ${vars["CreatedBidMap"]}`);
      } catch (e) {
        await log.stepFail(page, `Searching or verifying Bid Map in dropdown failed - Bid Map: ${vars["CreatedBidMap"]}`);
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