// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidrequestPage } from '../../../src/pages/correspondant/bidrequest';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { UploadProgressPopUpPage } from '../../../src/pages/correspondant/upload-progress-pop-up';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { testDataManager } from 'testdata/TestDataManager';
import { SpinnerPage } from '@pages/correspondant';

const TC_ID = 'REG_TS07_TC01';
const TC_TITLE = 'Upload happy flow file with valid geo codes and verify success in popup and details';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidrequestPage: BidrequestPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let uploadProgressPopUpPage: UploadProgressPopUpPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidrequestPage = new BidrequestPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    uploadProgressPopUpPage = new UploadProgressPopUpPage(page);
    spinnerPage = new SpinnerPage(page);
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

        const profileName = 'Bid Requests';
        const profile = testDataManager.getProfileByName(profileName);
        if (profile && profile.data) {
          const GeoCodingHappyFlow_ErrorsColumn = profile.data[0]['Geo Coding happy flow (Errors Column)'];
          vars["Geo Coding happy flow (Errors Column)"] = GeoCodingHappyFlow_ErrorsColumn;
          const GeoCodingHappyFlow_ErrorDescription = profile.data[0]['Geo Coding happy flow(Error Description)'];
          vars["Geo Coding happy flow(Error Description)"] = GeoCodingHappyFlow_ErrorDescription;
          const GeoCodingHappyFlow_LoanStatus = profile.data[0]['Geo Coding happy flow(Loan Status)'];
          vars["Geo Coding happy flow(Loan Status)"] = GeoCodingHappyFlow_LoanStatus;
          const CompanyName = profile.data[0]['Company Name'];
          vars["CompanyName"] = CompanyName;
          const BidMappingID = profile.data[0]['BidMappingID'];
          vars["BidMappingID"] = BidMappingID;
        }

        const profile2 = testDataManager.getProfileByName("Administration_Bulk Batch Timing");
        if (profile2 && profile2.data) {
          const TimeInterval = profile2.data[0]['Time Interval'];
          vars["Time Interval"] = TimeInterval;
          const NoOfBatches = profile2.data[0]['NO of Batches'];
          vars["NO of Batches"] = NoOfBatches;
        }

        log.stepPass('Credentials and test data loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Loading credentials and test data failed');
        throw e;
      }

      const CorrPortalElem = new CorrPortalPage(page);

      // ── Step 2: Login and Navigation ─────────────────────────────────────
      log.step('Login and navigation to Bid Requests');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
        //await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);

        await CorrPortalElem.BidRequests_Menu.click();
        await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText("Bid Requests").first()).toBeVisible();

        await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
        //await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);

        log.stepPass('Login and navigation successful');
      } catch (e) {
        await log.stepFail(page, 'Login or navigation failed');
        throw e;
      }

      // ── Step 3: Batch Time Handling ──────────────────────────────────────
      log.step('Handling batch time selection');
      try {
        //await CorrPortalElem.Enabled_Time.waitFor({ state: 'visible' });
      
        if (await CorrPortalElem.Second_Enabled_Time.isVisible()) /* Element Second Enabled Time is visible */ {
          await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
          // [DISABLED] Scroll to the element Enabled Date into view
          // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
          // [DISABLED] Click on Enabled Date
          // await bidRequestPage.Enabled_Time.click();
        } else {
          await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
          await stepGroups.stepGroup_Modifying_batches_with_5_min_prior(page, vars);
          //await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);

          await CorrPortalElem.BidRequests_Menu.click();
          await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
          await expect(page.getByText("Bid Requests").first()).toBeVisible();

          await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
          //await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
          await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);

          // [DISABLED] Scroll to the element Enabled Date into view
          // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
          // [DISABLED] Click on Enabled Date
          // await bidRequestPage.Enabled_Time.click();
        }

        log.stepPass('Batch time handled successfully');
      } catch (e) {
        await log.stepFail(page, 'Batch time handling failed');
        throw e;
      }

      // ── Step 4: Upload File and Validate Success ─────────────────────────
      log.step('Uploading file and validating success');
      try {
        await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, '../../../uploads', "GEO_scenario_1.1_happy_flow (3).xlsx"));

        //vars["LoanNumberFromExcel"] = excelHelper.readCell(path.resolve(__dirname, '../../../uploads', "GEO_scenario_1.1_happy_flow.xlsx"), "2", "1");
        vars["LoanNumberFromExcel"] = String(
          excelHelper.readCell({
            filePath: path.resolve(__dirname, '../../../uploads', "GEO_scenario_1.1_happy_flow (3).xlsx"),
            columnHeader: "Correspondent Loan Number",
            rowIndex: 0,

          }) ?? ''
        );

        await expect(correspondentPortalPage.UploadBid_Button).toBeVisible();
        await correspondentPortalPage.UploadBid_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await bidRequestDetailsPage.Bid_Upload_Progress_Header.waitFor({ state: 'visible' });
        await expect(bidRequestDetailsPage.Bid_Upload_Progress_Header).toContainText("Bid Upload Progress");
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
        await expect(bidRequestPage.Continue_ButtonUpload_Pop_up).toBeVisible();
        //await expect(bidRequestPage.Rows_above_Loan_Field_validation).toContainText("Success");
        await expect(uploadProgressPopUpPage.Geo_Coding_Status_On_Pop_up).toContainText("Success");
        //await bidRequestPage.Rows_above_Loan_Field_validation.all().waitFor({ state: 'visible' });
        const rows = await bidRequestPage.Rows_above_Loan_Field_validation.all();
        log.info(`Total rows above loan field validation: ${rows.length}`);

        for (const row of rows) {
          await expect(row).toContainText("Success");
          log.info(`Row validation successful: ${await row.textContent()}`);
        }
        //await expect(uploadProgressPopUpPage.Geo_Coding_Status_On_Pop_up).toContainText("Success");
        const rows1 = await bidrequestPage.Rows_Below_Loan_Field.all();
        log.info(`Total rows above loan field validation: ${rows1.length}`);
        vars["RowsCountBelowLoanField"] = String(rows1.length);
        log.info(`Total rows below loan field validation: ${vars["RowsCountBelowLoanField"]}`);
        vars["count"] = "1";

        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["RowsCountBelowLoanField"]))) {
          vars["StatusBelowLoanField"] = (await bidrequestPage.Individual_RowUpload_progress_popup(vars["count"]).textContent() || '').trim();
          expect(["Success", "Warning"]).toContain(vars["StatusBelowLoanField"]);
          log.info(`Row ${vars["count"]} status validation done : ${vars["StatusBelowLoanField"]}`);
          vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
        }

        await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
        await expect(bidRequestDetailsPage.Errors_Column).toContainText(vars["Geo Coding happy flow (Errors Column)"]);
        log.info(`Errors column validation successful: ${vars["Geo Coding happy flow (Errors Column)"]}`);
        await expect(bidRequestPage.Error_Description_ColumnBid_request_details).toContainText(vars["Geo Coding happy flow(Error Description)"]);
        log.info(`Error description column validation successful: ${vars["Geo Coding happy flow(Error Description)"]}`);
        await expect(bidRequestDetailsPage.Loan_Status_Column).toContainText(vars["Geo Coding happy flow(Loan Status)"]);
        log.info(`Loan status column validation successful: ${vars["Geo Coding happy flow(Loan Status)"]}`);
        await expect(bidRequestDetailsPage.Loan_Number_Column).toContainText(vars["LoanNumberFromExcel"]);
        log.info(`Loan number column validation successful from Excel to UI: ${vars["LoanNumberFromExcel"]}`);
        await expect(bidRequestDetailsPage.PQ_button).toBeEnabled();
        await expect(bidRequestDetailsPage.PS_button).toBeEnabled();

        log.stepPass('File upload and validation successful');
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