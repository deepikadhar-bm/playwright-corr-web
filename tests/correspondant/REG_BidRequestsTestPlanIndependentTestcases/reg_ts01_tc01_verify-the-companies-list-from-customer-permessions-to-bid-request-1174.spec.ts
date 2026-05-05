// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { AddHeaderPage } from '../../../src/pages/correspondant/add-header';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { CustomerPermissionPage } from '../../../src/pages/correspondant/customer-permission';
import { P15ActivePage } from '../../../src/pages/correspondant/p-15-active';
import { SelectDropdownPage } from '../../../src/pages/correspondant/select-dropdown';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive4Page } from '../../../src/pages/correspondant/status-inactive--4';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { UploadNewBidRequestButtonPage } from '../../../src/pages/correspondant/upload-new-bid-request-button';
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';
import { CrossBarInBidRequestPage } from '@pages/correspondant/cross-bar-in-bid-request';

const TC_ID = 'REG_TS01_TC01';
const TC_TITLE = 'Verify the Companies list from customer permessions to Bid request screen';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let addHeaderPage: AddHeaderPage;
  let bidRequestPage: BidRequestPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let customerPermissionPage: CustomerPermissionPage;
  let p15ActivePage: P15ActivePage;
  let selectDropdownPage: SelectDropdownPage;
  let spinnerPage: SpinnerPage;
  let statusInactive4Page: StatusInactive4Page;
  let statusInactivePage: StatusInactivePage;
  let uploadNewBidRequestButtonPage: UploadNewBidRequestButtonPage;
  let crossBarInBidRequestPage: CrossBarInBidRequestPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    addHeaderPage = new AddHeaderPage(page);
    bidRequestPage = new BidRequestPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    customerPermissionPage = new CustomerPermissionPage(page);
    p15ActivePage = new P15ActivePage(page);
    selectDropdownPage = new SelectDropdownPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive4Page = new StatusInactive4Page(page);
    statusInactivePage = new StatusInactivePage(page);
    uploadNewBidRequestButtonPage = new UploadNewBidRequestButtonPage(page);
    crossBarInBidRequestPage = new CrossBarInBidRequestPage(page);
  });

  test('REG_TS01_TC01_Verify the Companies list from customer permessions to Bid request screen', async ({ page }) => {
  //   const testData: Record<string, string> = {
  // "All Company Name": "",
  

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Login and navigate to Customer Permissions ────────────────────────
      log.step('Logging in to Correspondent Portal and navigating to Customer Permissions');
      try {
        const credentials = ENV.getCredentials('internal');
                vars["Username"] = credentials.username;
                vars["Password"] = credentials.password;
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["count"] = "1";
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await customerPermissionPage.CustomerPermission_Menu.click();
        log.info('Navigated to Customer Permissions successfully');

        log.stepPass('Login and navigation to Customer Permissions successful');
      } catch (e) {
        await log.stepFail(page, 'Login or navigation to Customer Permissions failed');
        throw e;
      }

      // ── Collect all company names from Customer Permissions ───────────────
      log.step('Collecting all company names from Customer Permissions');
      try {
        vars["TotalCompaniesCount(CustomerPermission)"] = String(await statusInactivePage.Company_Names.count());
        log.info(`Total companies count in Customer Permissions: ${vars["TotalCompaniesCount(CustomerPermission)"]}`);

        for (let dataIdx = 1; dataIdx <= parseInt(vars["TotalCompaniesCount(CustomerPermission)"]); dataIdx++) {
          vars["IndividualCompanyInPermissions"] = await chaseFieldNamePage.Individual_Company_in_Customer_permission(vars["count"]).textContent() || '';
           testDataManager.updatePartialProfileDataByDataIndex(
            'Company names from Customer permissions',
            { 'All Company Name': vars["IndividualCompanyInPermissions"] },
            dataIdx
          );
            log.info(`Company name from Customer permissions at index ${dataIdx}: ${vars["IndividualCompanyInPermissions"]}`);
          // Write to test data profile: "All Company Name" = vars["IndividualCompanyInPermissions"]
          vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
        }

        log.stepPass('All company names collected from Customer Permissions successfully');
      } catch (e) {
        await log.stepFail(page, 'Collecting company names from Customer Permissions failed');
        throw e;
      }

      // ── Navigate to Bid Requests and open company dropdown ────────────────
      log.step('Navigating to Bid Requests and opening company dropdown');
      try {
        await page.waitForLoadState('load');
        await correspondentPortalPage.Bid_Requests.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await selectDropdownPage.Select_Company_In_BidRequest.click();
        log.info('Bid Request company dropdown opened');

        log.stepPass('Navigation to Bid Requests and opening company dropdown successful');
      } catch (e) {
        await log.stepFail(page, 'Navigation to Bid Requests or opening company dropdown failed');
        throw e;
      }

      // ── Verify each company name appears in Bid Request dropdown ──────────
      log.step('Verifying each company name from Customer Permissions appears in Bid Request dropdown');
      try {
        for (let dataIdx = 1; dataIdx <= parseInt(vars["TotalCompaniesCount(CustomerPermission)"]); dataIdx++) {
          //vars["IndividualCompanyname"] = String(testData["All Company Name"]).split("-")["1"] || '';
          const profileName = 'Company names from Customer permissions';
                const profile = testDataManager.getProfileByName(profileName);
                if (profile && profile.data) {
                  const CompanyName = profile.data[dataIdx - 1]['All Company Name'];
                  vars["IndividualCompanyname"] = CompanyName;
                  log.info(`Loaded batch time: ${vars["IndividualCompanyname"]}`);
                }
          vars["IndividualCompanyname"] = String(vars["IndividualCompanyname"]).trim();
          await expect(addHeaderPage.Individual_Company_NameBidrequest_Dropdown(vars["IndividualCompanyname"]).first()).toContainText(vars["IndividualCompanyname"]);
          log.info(`Company name verified in dropdown at index ${dataIdx}: ${vars["IndividualCompanyname"]}`);
        }

        log.stepPass('All company names verified in Bid Request dropdown successfully');
      } catch (e) {
        await log.stepFail(page, 'Verifying company names in Bid Request dropdown failed');
        throw e;
      }

      // ── Verify search, clear, and default count behaviour ─────────────────
      log.step('Verifying search input, clear action, and default company count in dropdown');
      try {
        await expect(bidRequestPage.Bid_Mapping_IdSearch_Input_box).toBeVisible();
        vars["AllCompaniesCountInDropdown"] = String(await chaseFieldNamePage.Company_Names_In_DropdownBidRequest.count());
        log.info(`Total companies count in Bid Request dropdown: ${vars["AllCompaniesCountInDropdown"]}`);

        vars["FirstCompanyname"] = await chaseFieldNamePage.Selecting_first_company_in_the_Dropdown.textContent() || '';
        console.log(`First company name in dropdown: ${vars["FirstCompanyname"]}`);
        //{ const _m = String(vars["FirstCompanyname"]).match(/.{3,4}/); if (_m) vars["FirstCompanyname"] = _m[0]; } 
        vars ["FirstFourCharsOfCompanyName"] = String(vars["FirstCompanyname"]).substring(0, 4).trim();
        console.log(`First four characters of first company name: ${vars["FirstFourCharsOfCompanyName"]}`);
        await bidRequestPage.Bid_Mapping_IdSearch_Input_box.fill(vars["FirstFourCharsOfCompanyName"]);
        await expect(p15ActivePage.Searched_Company_name(vars["FirstCompanyname"])).toBeVisible();
        log.info(`Searched for company name: ${vars["FirstCompanyname"]}`);

        vars["CompanyCountAfterSearch"] = String(await chaseFieldNamePage.Company_Names_In_DropdownBidRequest.count());
        log.info(`Company count after search: ${vars["CompanyCountAfterSearch"]}`);

       // await correspondentPortalPage.Cross_In_Search_Field.click();
                await crossBarInBidRequestPage.ClearSearch_Action.click();

        await expect(bidRequestPage.Bid_Mapping_IdSearch_Input_box).toHaveValue('');
        vars["DefaultCompanyCount"] = String(await chaseFieldNamePage.Company_Names_In_DropdownBidRequest.count());
        log.info(`Default company count after clearing search: ${vars["DefaultCompanyCount"]}`);

        expect(String(vars["AllCompaniesCountInDropdown"])).toBe(vars["DefaultCompanyCount"]);

        log.stepPass('Search, clear, and default company count verification successful');
      } catch (e) {
        await log.stepFail(page, 'Search, clear, or default company count verification failed');
        throw e;
      }

      // ── Verify first company name after re-filling search ─────────────────
      log.step('Verifying first company name is shown after re-filling search input');
      try {
        for (let dataIdx = 1; dataIdx <= 1; dataIdx++) {
          //vars["FirstCompanyname"] = String(testData["All Company Name"]).trim();
          const profileName = 'Company names from Customer permissions';
                const profile = testDataManager.getProfileByName(profileName);
                if (profile && profile.data) {
                  const CompanyName = profile.data[dataIdx - 1]['All Company Name'];
                  vars["FirstCompanyname"] = CompanyName;
                  log.info(`Loaded company name: ${vars["FirstCompanyname"]}`);
                }
          vars["FirstCompanyname"] = String(vars["FirstCompanyname"]).trim();
          await bidRequestPage.Bid_Mapping_IdSearch_Input_box.fill(vars["FirstCompanyname"]);
          await expect(statusInactive4Page.Entered_Company_name(vars["FirstCompanyname"]).first()).toBeVisible();
          log.info(`First company name verified after re-fill: ${vars["FirstCompanyname"]}`);
        }

        log.stepPass('First company name verified after re-filling search input successfully');
      } catch (e) {
        await log.stepFail(page, 'Verifying first company name after re-filling search input failed');
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