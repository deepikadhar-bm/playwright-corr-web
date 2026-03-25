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

  test('REG_TS07_TC02_Upload a reducer flow file with invalid geo codes; status should show warning in the popup and success in bid request details.', async ({ page }) => {
    const credentials = ENV.getCredentials('internal');
    vars["Username"] = credentials.username;
    vars["Password"] = credentials.password;
    log.info(`Credentials loaded for user: ${vars["Username"]}`);

    const profileName = 'Bid Requests';
    const profile = testDataManager.getProfileByName(profileName);
    if (profile && profile.data) {
      const GeoCodingReducerFlow_ErrorsColumn = profile.data[0]['Geo Coding Reducer flow(Errors Column)'];
      vars["Geo Coding Reducer flow(Errors Column)"] = GeoCodingReducerFlow_ErrorsColumn;
      log.info(`Loaded Errors Column: ${vars["Geo Coding Reducer flow(Errors Column)"]}`);

      const GeoCodingReducerFlow_ErrorDescription = profile.data[0]['Geo Coding Reducer flow(Error Description))'];
      vars["Geo Coding Reducer flow(Error Description))"] = GeoCodingReducerFlow_ErrorDescription;
      log.info(`Loaded Error Description: ${vars["Geo Coding Reducer flow(Error Description))"]}`);

      const GeoCodingReducerFlow_LoanStatus = profile.data[0]['Geo Coding Reducer flow(Loan Status)'];
      vars["Geo Coding Reducer flow(Loan Status)"] = GeoCodingReducerFlow_LoanStatus;
      log.info(`Loaded Loan Status: ${vars["Geo Coding Reducer flow(Loan Status)"]}`);

      const CompanyName = profile.data[0]['Company Name'];
      vars["CompanyName"] = CompanyName;
      log.info(`Loaded Company Name: ${vars["CompanyName"]}`);

      const BidMappingID = profile.data[0]['BidMappingID'];
      vars["BidMappingID"] = BidMappingID;
      log.info(`Loaded BidMappingID: ${vars["BidMappingID"]}`);
    }

    const profile2 = testDataManager.getProfileByName("Administration_Bulk Batch Timing");
    if (profile2 && profile2.data) {
      const TimeInterval = profile2.data[0]['Time Interval'];
      vars["Time Interval"] = TimeInterval;
      log.info(`Loaded Time Interval: ${vars["Time Interval"]}`);

      const NoOfBatches = profile2.data[0]['NO of Batches'];
      vars["NO of Batches"] = NoOfBatches;
      log.info(`Loaded NO of Batches: ${vars["NO of Batches"]}`);
    }

    const CorrPortalElem = new CorrPortalPage(page);

    log.info(`Logging in to CORR Portal with user: ${vars["Username"]}`);
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    log.info(`Login successful`);

    log.info(`Deleting early config report if present`);
    await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
    log.info(`Early config report deletion step completed`);

    log.info(`Navigating to Bid Requests menu`);
    await CorrPortalElem.BidRequests_Menu.click();
    await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText("Bid Requests").first()).toBeVisible();
    log.info(`Bid Requests page loaded successfully`);

    log.info(`Uploading Bid Request`);
    await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
    log.info(`Bid Request upload step completed`);

    let isVisible = false;
    try {
      await page.locator('app-single-select-dropdown#pricingReturnTimeDropdown').waitFor({ state: 'visible', timeout: 10000 });
      const count = await CorrPortalElem.Second_Enabled_Time.count();
      log.info(`Second_Enabled_Time element count: ${count}`);
      isVisible = count > 0;
    } catch {
      isVisible = false;
    }
    log.info(`Is the second enabled batch time visible? ${isVisible}`);

    if (isVisible) {
      log.info(`Second enabled batch time is visible, selecting it directly`);
      await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
      log.info('Bid Request uploaded and enabled batch time selected successfully without modifying batch intervals');
    } else {
      log.info(`Second enabled batch time not visible, navigating to Bulk Batch Timing to modify batches`);
      await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
      log.info(`Modifying batches with 5 min prior`);
      await stepGroups.stepGroup_Modifying_batches_with_5_min_prior(page, vars);
      log.info(`Batch modification done, navigating back to Bid Requests`);
      await CorrPortalElem.BidRequests_Menu.click();
      await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
      await expect(page.getByText("Bid Requests").first()).toBeVisible();
      log.info(`Bid Requests page reloaded successfully`);
      log.info(`Re-uploading Bid Request after batch modification`);
      await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
      await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
      log.info('Bid Request uploaded and enabled batch time selected successfully after modifying batch intervals');
    }

    log.info(`Setting upload file: GEO_scenario_1.2_Reducer (4).xlsx`);
    await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, '../../../uploads', "GEO_scenario_1.2_Reducer (4).xlsx"));
    log.info(`File set successfully`);

    vars["LoanNumberFromExcel"] = String(
      excelHelper.readCell({
        filePath: path.resolve(__dirname, '../../../uploads', "GEO_scenario_1.2_Reducer (4).xlsx"),
        columnHeader: "Correspondent Loan Number",
        rowIndex: 0,
      }) ?? ''
    );
    log.info(`Loan Number read from Excel: ${vars["LoanNumberFromExcel"]}`);

    await expect(correspondentPortalPage.UploadBid_Button).toBeVisible();
    log.info(`Upload Bid button is visible, clicking it`);
    await correspondentPortalPage.UploadBid_Button.click();

    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestDetailsPage.Bid_Upload_Progress_Header.waitFor({ state: 'visible' });
    await expect(bidRequestDetailsPage.Bid_Upload_Progress_Header).toContainText("Bid Upload Progress");
    log.info(`Bid Upload Progress popup appeared successfully`);

    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
    await expect(bidRequestPage.Continue_ButtonUpload_Pop_up).toBeVisible();
    log.info(`Continue button is visible on upload popup`);

    await uploadProgressPopUpPage.Geo_Coding_Status_On_Pop_up.waitFor({ state: 'visible' });
    await expect(uploadProgressPopUpPage.Geo_Coding_Status_On_Pop_up).toContainText("Warning");
    log.info(`Geo Coding status on popup shows Warning as expected`);

    const rows = await bidRequestPage.Rows_above_Loan_Field_validation.all();
    log.info(`Total rows above loan field validation: ${rows.length}`);

    for (const row of rows) {
      await expect(row).toContainText("Success");
      log.info(`Row validation successful: ${await row.textContent()}`);
    }

    const rows1 = await bidrequestPage.Rows_Below_Loan_Field.all();
    log.info(`Total rows above loan field validation: ${rows1.length}`);
    vars["RowsCountBelowLoanField"] = String(rows1.length);
    log.info(`Total rows below loan field validation: ${vars["RowsCountBelowLoanField"]}`);

    vars["count"] = "1";
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["RowsCountBelowLoanField"]))) {
      vars["StatusBelowLoanField"] = (await bidrequestPage.Individual_RowUpload_progress_popup(vars["count"]).textContent() || '').trim();
      expect(["Success", "Warning"]).toContain(vars["StatusBelowLoanField"]);
      log.info(`Row ${vars["count"]} status validation done : ${vars["StatusBelowLoanField"]}`);
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }

    log.info(`All rows below loan field validated successfully, clicking Continue`);
    await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    log.info(`Navigated to Bid Request Details page`);

    await bidRequestDetailsPage.Errors_Column.waitFor({ state: 'visible' });
    await expect(bidRequestDetailsPage.Errors_Column).toContainText(vars["Geo Coding Reducer flow(Errors Column)"]);
    log.info(`Errors column validation successful: ${vars["Geo Coding Reducer flow(Errors Column)"]}`);

    await bidRequestPage.Error_Description_ColumnBid_request_details.waitFor({ state: 'visible' });
    await expect(bidRequestPage.Error_Description_ColumnBid_request_details).toContainText(vars["Geo Coding Reducer flow(Error Description))"]); 
    log.info(`Error description column validation successful: ${vars["Geo Coding Reducer flow(Error Description))"]}`);

    await bidRequestDetailsPage.Loan_Status_Column.waitFor({ state: 'visible' });
    await expect(bidRequestDetailsPage.Loan_Status_Column).toContainText(vars["Geo Coding Reducer flow(Loan Status)"]);
    log.info(`Loan status column validation successful: ${vars["Geo Coding Reducer flow(Loan Status)"]}`);

    await bidRequestDetailsPage.Loan_Number_Column.waitFor({ state: 'visible' });
    await expect(bidRequestDetailsPage.Loan_Number_Column).toContainText(vars["LoanNumberFromExcel"]);
    log.info(`Loan number column validation successful from Excel to UI: ${vars["LoanNumberFromExcel"]}`);

    await expect(bidRequestDetailsPage.PQ_button).toBeEnabled();
    log.info(`PQ button is enabled`);

    await expect(bidRequestDetailsPage.PS_button).toBeEnabled();
    log.info(`PS button is enabled`);

    log.info(`Test REG_TS07_TC02 completed successfully`);
  });
});