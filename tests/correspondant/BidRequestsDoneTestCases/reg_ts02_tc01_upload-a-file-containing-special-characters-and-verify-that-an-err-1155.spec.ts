// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive4Page } from '../../../src/pages/correspondant/status-inactive--4';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { testDataManager } from 'testdata/TestDataManager';

const TC_ID = 'REG_TS02_TC01';
const TC_TITLE = 'Upload a file containing special characters and verify that an error popup is displayed';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;
  let statusInactive4Page: StatusInactive4Page;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive4Page = new StatusInactive4Page(page);
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
          const SpecialCharacter_ErrorHeader = profile.data[0]['SpecialCharacter_ErrorHeader'];
          vars["SpecialCharacter_ErrorHeader"] = SpecialCharacter_ErrorHeader;
          const SpecialCharacter_ErrorMessage = profile.data[0]['SpecialCharacter_ErrorMessage'];
          vars["SpecialCharacter_ErrorMessage"] = SpecialCharacter_ErrorMessage;
          const DeletingMessage_for_File = profile.data[0]['DeletingMessage for File'];
          vars["DeletingMessage for File"] = DeletingMessage_for_File;
          const MissingHeaders_ErrorHeader = profile.data[0]['MissingHeaders_ErrorHeader'];
          vars["MissingHeaders_ErrorHeader"] = MissingHeaders_ErrorHeader;
          const DuplicateLoans_HeaderMessage = profile.data[0]['DuplicateLoans_HeaderMessage'];
          vars["DuplicateLoans_HeaderMessage"] = DuplicateLoans_HeaderMessage;
          const DuplicateLoans_ErrorMessage = profile.data[0]['DuplicateLoans_ErrorMessage'];
          vars["DuplicateLoans_ErrorMessage"] = DuplicateLoans_ErrorMessage;
          const CompanyName = profile.data[0]['Company Name'];
          vars["CompanyName"] = CompanyName;
          const BidMappingID = profile.data[0]['BidMappingID'];
          vars["BidMappingID"] = BidMappingID;
          const profile2 = testDataManager.getProfileByName("Administration_Bulk Batch Timing");
          if (profile2 && profile2.data) {
            const TimeInterval = profile2.data[0]['Time Interval'];  // row 0, column name
            vars["Time Interval"] = TimeInterval;
            const NoOfBatches = profile2.data[0]['NO of Batches'];
            vars["NO of Batches"] = NoOfBatches;                  // store in vars
          }
        }
        log.info(vars["Company Name"] && vars["BidMappingID"] ? 'Bid map id, company name loaded successfully' : 'Failed to load Bid map id, company name');
        log.stepPass('Credentials and test data loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Loading credentials and test data failed');
        throw e;
      }

      const CorrPortalElem = new CorrPortalPage(page);

      // ── Step 2: Login and Initial Setup ──────────────────────────────────
      log.step('Logging in and preparing environment');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
        //await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);

        await CorrPortalElem.BidRequests_Menu.click();
        await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText("Bid Requests").first()).toBeVisible();

        log.stepPass('Login and navigation successful');
      } catch (e) {
        await log.stepFail(page, 'Login or initial navigation failed');
        throw e;
      }

      // ── Step 3: Upload Bid Request Setup ─────────────────────────────────
      log.step('Uploading bid request and selecting batch time');
      try {
        await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);

        if (await CorrPortalElem.Second_Enabled_Time.isVisible()) /* Element Second Enabled Time is visible */ {
          log.info('Second Enabled Time is visible, selecting batch time accordingly');
          await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
          vars["SelectedEnabledTime"] = await correspondentPortalPage.Pricing_Return_Time.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
          // [DISABLED] Store text from the element Enabled Time into a variable EnabledTime
          // vars["EnabledTime"] = await bidRequestPage.Enabled_Time.textContent() || '';
          // [DISABLED] Select option by text EnabledTime in the Pricing_Return_Time list
          // await correspondentPortalPage.Pricing_Return_Time.selectOption({ label: vars["EnabledTime"] });
        } else {
          log.info('Second Enabled Time is not visible, modifying batch timing and navigating back to upload bid request');
          await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
          //await stepGroups.stepGroup_Modifying_The_Batch_Intervals_For_one_Hour_Prior(page, vars);
          await stepGroups.stepGroup_Modifying_batches_with_5_min_prior(page, vars);
          //await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);

          await CorrPortalElem.BidRequests_Menu.click();
          await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
          await expect(page.getByText("Bid Requests").first()).toBeVisible();

          await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
          await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
          vars["SelectedEnabledTime"] = await correspondentPortalPage.Pricing_Return_Time.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });

          // [DISABLED] Scroll to the element Enabled Time into view
          // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
          // [DISABLED] Store text from the element Enabled Time into a variable EnabledTime
          // vars["EnabledTime"] = await bidRequestPage.Enabled_Time.textContent() || '';
          // [DISABLED] Select option by text EnabledTime in the Pricing_Return_Time list
          // await correspondentPortalPage.Pricing_Return_Time.selectOption({ label: vars["EnabledTime"] });
          // [DISABLED] Store the text of the selected option from Pricing_Return_Time list into a variable SelectedEnabledTime
          // vars["SelectedEnabledTime"] = await correspondentPortalPage.Pricing_Return_Time.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        }

        // [DISABLED] Store text from the element Enabled_PricingReturnTime into a variable PricingReturnTime
        // vars["PricingReturnTime"] = await statusInactive4Page.Enabled_PricingReturnTime.textContent() || '';
        // [DISABLED] Click on Pricing_Return_Time
        // await correspondentPortalPage.Pricing_Return_Time.click();
        // [DISABLED] Scroll up to the element Enabled_PricingReturnTime into view
        // await statusInactive4Page.Enabled_PricingReturnTime.scrollIntoViewIfNeeded();
        // [DISABLED] Click on Enabled_PricingReturnTime
        // await statusInactive4Page.Enabled_PricingReturnTime.click();
        // [DISABLED] Remove the no of ( 1,1 ) positions of given string SelectedEnabledTime and store into runtime variable SelectedEnabledTime
        // vars["SelectedEnabledTime"] = String(vars["SelectedEnabledTime"]).substring(1, String(vars["SelectedEnabledTime"]).length - 1);

        vars["SelectedEnabledTime"] = String(vars["SelectedEnabledTime"]).trim();
        await expect(correspondentPortalPage.Pricing_Return_Time).toHaveValue(vars["SelectedEnabledTime"]);

        log.stepPass('Batch time selected successfully');
      } catch (e) {
        await log.stepFail(page, 'Batch time selection failed');
        throw e;
      }

      // ── Step 4: Upload File and Validate Errors ──────────────────────────
      log.step('Uploading file and validating error messages');
      try {
        await expect(page.getByText("Drag and drop files here or click to browse. Allowed formats: .xls,.xlsx,.csv,.txt")).toBeVisible();

        await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, '../../../uploads', "Bid_Special_character_space.xlsx"));
        await expect(correspondentPortalPage.UploadBid_Button).toBeVisible();
        await correspondentPortalPage.UploadBid_Button.click();

        await spinnerPage.Spinner.waitFor({ state: 'hidden' });

        await expect(page.getByText("Bid Upload Progress")).toBeVisible();
        await expect(page.getByText(vars["SpecialCharacter_ErrorHeader"])).toBeVisible();
        await expect(page.getByText(vars["SpecialCharacter_ErrorMessage"])).toBeVisible();

        await correspondentPortalPage.Okay_Close_Button.click();
        await correspondentPortalPage.Delete_Button_BidRequest.click();

        await expect(page.getByText(vars["DeletingMessage for File"])).toBeVisible();
        await correspondentPortalPage.Yes_proceed_Button_BidRequest.click();

        log.stepPass('Error messages validated successfully');
      } catch (e) {
        await log.stepFail(page, 'File upload or validation failed');
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