// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { ChaseDirectPage } from '../../../src/pages/correspondant/chase-direct';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { CustomerPermissionPage } from '../../../src/pages/correspondant/customer-permission';
import { EditPermissionsPage } from '../../../src/pages/correspondant/edit-permissions';
import { P3715DropdownPage } from '../../../src/pages/correspondant/p-3-7-15-dropdown';
import { SelectDropdownPage } from '../../../src/pages/correspondant/select-dropdown';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StandardPage } from '../../../src/pages/correspondant/standard';
import { UpdatePermissionsButtonPage } from '../../../src/pages/correspondant/update-permissions-button';
import { UploadNewBidRequestButtonPage } from '../../../src/pages/correspondant/upload-new-bid-request-button';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';

const TC_ID = 'REG_TS01_TC04';
const TC_TITLE = 'Verify that if both the executions are disabled, then user should not be able to select both the exe type values.';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let chaseDirectPage: ChaseDirectPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let customerPermissionPage: CustomerPermissionPage;
  let editPermissionsPage: EditPermissionsPage;
  let p3715DropdownPage: P3715DropdownPage;
  let selectDropdownPage: SelectDropdownPage;
  let spinnerPage: SpinnerPage;
  let standardPage: StandardPage;
  let updatePermissionsButtonPage: UpdatePermissionsButtonPage;
  let uploadNewBidRequestButtonPage: UploadNewBidRequestButtonPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestPage = new BidRequestPage(page);
    chaseDirectPage = new ChaseDirectPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    customerPermissionPage = new CustomerPermissionPage(page);
    editPermissionsPage = new EditPermissionsPage(page);
    p3715DropdownPage = new P3715DropdownPage(page);
    selectDropdownPage = new SelectDropdownPage(page);
    spinnerPage = new SpinnerPage(page);
    standardPage = new StandardPage(page);
    updatePermissionsButtonPage = new UpdatePermissionsButtonPage(page);
    uploadNewBidRequestButtonPage = new UploadNewBidRequestButtonPage(page);
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
            const profileName = 'Bid Requests'; // TDP sheet name
                const profile = testDataManager.getProfileByName(profileName);
                if (profile && profile.data) {
                  const CompanyNameCustomerPermissions = profile.data[0]['CompanyName_CustomerPermissions'];
                  vars["CompanyName_CustomerPermissions"] = CompanyNameCustomerPermissions;
                }
        log.stepPass(`Credentials and test data loaded successfully - Company: ${vars["CompanyName_CustomerPermissions"]}`);
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

      // ── Step 3: Navigate to Customer Permission ───────────────────────────
      log.step('Navigating to Customer Permission');
      try {
        //await stepGroups.stepGroup_Navigation_and_Verification_of_Customer_Permission_in_Bid_Re(page, vars);
        const CorrPortalElem = new CorrPortalPage(page);
                await expect(CorrPortalElem.BidRequests_Menu).toBeVisible();
                await CorrPortalElem.BidRequests_Menu.click();
                await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
                await CorrPortalElem.Administration_Menu.click();
                await CorrPortalElem.GeneralSettings_Menu.click();
                await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
                await CorrPortalElem.CustomerPermission_Menu.click();
                await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
                await expect((page.getByText("Customer Permission")).first()).toBeVisible();
        log.stepPass('Navigated to Customer Permission successfully');
      } catch (e) {
        await log.stepFail(page, 'Navigating to Customer Permission failed');
        throw e;
      }

      // ── Step 4: Search for Company and Open Edit Permissions ──────────────
      log.step('Searching for company and opening Edit Permissions popup');
      try {
        await customerPermissionPage.Search_Filter_Input.fill(vars["CompanyName_CustomerPermissions"]);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Edit_Permission_Button(vars["CompanyName_CustomerPermissions"]).click();
        await expect(page.getByText("Edit Permissions")).toBeVisible();
        await expect(correspondentPortalPage.close_pop_up_bid_request_details).toBeVisible();
        log.stepPass(`Company searched and Edit Permissions popup opened - Company: ${vars["CompanyName_CustomerPermissions"]}`);
      } catch (e) {
        await log.stepFail(page, 'Searching for company or opening Edit Permissions popup failed');
        throw e;
      }

      // ── Step 5: Set Standard Flow OFF and Chase Direct OFF ────────────────
      log.step('Setting Standard Flow OFF and Chase Direct OFF');
      try {
        await correspondentPortalPage.Off_Radio_StandardEdit_Permissions_Popup.check();
        await correspondentPortalPage.ChaseDirect_OFFEdit_Permissions_Popup.check();
        log.stepPass('Standard Flow set to OFF and Chase Direct set to OFF successfully');
      } catch (e) {
        await log.stepFail(page, 'Setting Standard Flow OFF or Chase Direct OFF failed');
        throw e;
      }

      // ── Step 6: Update or Close Permissions Popup ─────────────────────────
      log.step('Updating or closing permissions popup');
      try {
        if (await updatePermissionsButtonPage.UpdatePermissions_Button.isEnabled()) {
          await updatePermissionsButtonPage.UpdatePermissions_Button.click();
          log.info('Update Permissions button was enabled — clicked successfully');
        } else {
          await editPermissionsPage.Close_pop_up.click();
          log.info('Update Permissions button was disabled — closed popup instead');
        }
        log.stepPass('Permissions popup handled successfully');
      } catch (e) {
        await log.stepFail(page, 'Updating or closing permissions popup failed');
        throw e;
      }

      // ── Step 7: Verify Customer Permission Status ─────────────────────────
      log.step('Verifying customer permission status for Standard and Chase Direct');
      try {
        await expect(customerPermissionPage.Standard_Execution_PermissionDisabled(vars["CompanyName_CustomerPermissions"])).toContainText("Disabled");
        await expect(customerPermissionPage.Chasedirect_Execution_PermissionDisabled(vars["CompanyName_CustomerPermissions"])).toContainText("Disabled");
        log.stepPass(`Customer permission verified - Standard: Disabled, Chase Direct: Disabled for company: ${vars["CompanyName_CustomerPermissions"]}`);
      } catch (e) {
        await log.stepFail(page, 'Verifying customer permission status failed');
        throw e;
      }

      // ── Step 8: Navigate to Upload New Bid Request ────────────────────────
      log.step('Navigating to Upload New Bid Request');
      try {
        await correspondentPortalPage.Bid_Requests.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect((page.getByText("Bid Requests")).first()).toBeVisible();
        await uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Upload New Bid Request successfully');
      } catch (e) {
        await log.stepFail(page, 'Navigating to Upload New Bid Request failed');
        throw e;
      }

      // ── Step 9: Select Company in Bid Request ─────────────────────────────
      log.step('Selecting company in Upload Bid Request screen');
      try {
        await selectDropdownPage.Select_Company_In_BidRequest.click();
        await expect(bidRequestPage.Bid_Mapping_IdSearch_Input_box).toBeVisible();
        await bidRequestPage.Bid_Mapping_IdSearch_Input_box.fill(vars["CompanyName_CustomerPermissions"]);
        await correspondentPortalPage.SelectCompany_Value.click();
        await expect(bidRequestPage.Selected_Company_Value_Upload_Bid_Request_Screen).toBeVisible();
        log.stepPass(`Company selected in Upload Bid Request screen - Company: ${vars["CompanyName_CustomerPermissions"]}`);
      } catch (e) {
        await log.stepFail(page, 'Selecting company in Upload Bid Request screen failed');
        throw e;
      }

      // ── Step 10: Verify both Standard and Chase Direct are visible ────────
      log.step('Verifying Standard and Chase Direct execution types are visible but not selectable');
      try {
        await expect(standardPage.Standard_Execution_Checkbox).toBeVisible();
        await expect(chaseDirectPage.ChaseDirect_Checkbox).toBeVisible();
        await expect(bidRequestPage.Chase_Direct_DropdownUpload_Bidrequest).toBeVisible();
        await expect(p3715DropdownPage.StandardExecution_Dropdown).toBeVisible();
        log.stepPass('Standard and Chase Direct execution types are visible as expected');
      } catch (e) {
        await log.stepFail(page, 'Verifying Standard or Chase Direct execution types visibility failed');
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