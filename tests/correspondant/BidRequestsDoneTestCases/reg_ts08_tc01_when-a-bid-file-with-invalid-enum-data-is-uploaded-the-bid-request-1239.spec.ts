// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidrequestPage } from '../../../src/pages/correspondant/bidrequest';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
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
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidrequestPage = new BidrequestPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS08_TC01_When a bid file with invalid Enum data is uploaded, the \\\'Bid Request Enumeration Mapping Validation\\\' check status should show a warning, and the corresponding loans on the details scre', async ({ page }) => {

    const credentials = ENV.getCredentials('internal');
    vars["Username"] = credentials.username;
    vars["Password"] = credentials.password;
    log.info(`Credentials loaded for user: ${vars["Username"]}`);

    const profileName = 'Bid Requests';
    const profile = testDataManager.getProfileByName(profileName);
    if (profile && profile.data) {
      const BidEnumCheck_ErrorsColumn = profile.data[0]['Bid Enum Check(Errors Column)'];
      vars["Bid Enum Check(Errors Column)"] = BidEnumCheck_ErrorsColumn;
      log.info(`Loaded Errors Column: ${vars["Bid Enum Check(Errors Column)"]}`);

      const BidEnumCheck_ErrorDescription = profile.data[0]['Bid Enum Check(Error Description)'];
      vars["Bid Enum Check(Error Description)"] = BidEnumCheck_ErrorDescription;
      log.info(`Loaded Error Description: ${vars["Bid Enum Check(Error Description)"]}`);

      const BidEnumCheck_LoanStatus = profile.data[0]['Bid Enum Check(Loan Status)'];
      vars["Bid Enum Check(Loan Status)"] = BidEnumCheck_LoanStatus;
      log.info(`Loaded Loan Status: ${vars["Bid Enum Check(Loan Status)"]}`);

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
await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
    //await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
    await CorrPortalElem.BidRequests_Menu.click();
          await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
          await expect(page.getByText("Bid Requests").first()).toBeVisible();
    await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
    // if (true) /* Element Second Enabled Time is visible */ {
    //   await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
    //   // [DISABLED] Scroll to the element Enabled Date into view
    //   // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
    //   // [DISABLED] Click on Enabled Date
    //   // await bidRequestPage.Enabled_Time.click();
    // } else {
    //   await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
    //   await stepGroups.stepGroup_Modifying_batches_with_5_min_prior(page, vars);
    //   await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
    //   await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
    //   await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
    //   // [DISABLED] Scroll to the element Enabled Date into view
    //   // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
    //   // [DISABLED] Click on Enabled Date
    //   // await bidRequestPage.Enabled_Time.click();
    // }
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
    
    // Upload bid file
    log.info(`Uploading bid file: Bid_Enum_Check_UploadProgress (2).xlsx`);
    await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, '../../../uploads', "Bid_Enum_Check_UploadProgress (2).xlsx"));
    log.info(`Bid file upload input set successfully`);

    vars["LoanNumberFromExcel"] = String(
      excelHelper.readCell({
        filePath: path.resolve(__dirname, '../../../uploads', "Bid_Enum_Check_UploadProgress (2).xlsx"),
        columnHeader: "Correspondent Loan Number",
        rowIndex: 0,
      }) ?? ''
    );
    log.info(`Loan Number read from Excel: ${vars["LoanNumberFromExcel"]}`);

    // Click Upload Bid button and wait for progress header
    // log.info(`Verifying Upload Bid button is visible`);
    // await expect(correspondentPortalPage.UploadBid_Button).toBeVisible();
    // log.info(`Clicking Upload Bid button`);
    // await correspondentPortalPage.UploadBid_Button.click();

    // log.info(`Waiting for spinner to hide after upload click`);
    // await spinnerPage.Spinner.waitFor({ state: 'hidden' });

    // log.info(`Waiting for Bid Upload Progress header to appear`);
    // await bidRequestDetailsPage.Bid_Upload_Progress_Header.waitFor({ state: 'visible' });
    // await expect(bidRequestDetailsPage.Bid_Upload_Progress_Header).toContainText("Bid Upload Progress");
    // log.info(`Bid Upload Progress header verified`);

    // log.info(`Waiting for spinner to hide on progress screen`);
    // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
await expect(correspondentPortalPage.UploadBid_Button).toBeVisible();
      await expect(correspondentPortalPage.UploadBid_Button).toBeEnabled();
      await correspondentPortalPage.UploadBid_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
        //await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
        //await expect(bidRequestPage.Continue_ButtonUpload_Pop_up).toBeVisible();
    // Verify Continue button state
    // log.info(`Waiting for Continue button to be visible`);
    // await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
    // await expect(bidRequestPage.Continue_ButtonUpload_Pop_up).toBeVisible();
    // log.info(`Continue button is visible`);
    //await expect(bidRequestPage.Continue_ButtonUpload_Pop_up).toBeEnabled();
    //log.info(`Continue button is enabled`);

    // Verify Bid Enum Check shows Warning on popup
    await expect(bidRequestDetailsPage.Bid_Enum_Check_Validation_On_Popup).toContainText("Warning");
    log.info(`Bid Enum Check Validation on popup shows 'Warning' as expected`);

    // Validate rows above loan field validation
    const rows = await bidRequestPage.Rows_above_Loan_Field_validation.all();
    log.info(`Total rows above loan field validation: ${rows.length}`);
    for (const row of rows) {
      await expect(row).toContainText("Success");
      log.info(`Row above loan field validation verified as 'Success': ${await row.textContent()}`);
    }

    // Validate rows below loan field validation
    const rows1 = await bidrequestPage.Rows_Below_Loan_Field.all();
    log.info(`Total rows below loan field validation: ${rows1.length}`);
    vars["RowsCountBelowLoanField"] = String(rows1.length);
    log.info(`Rows count below loan field validation set to: ${vars["RowsCountBelowLoanField"]}`);

    vars["RowsCountBelowLoanField"] = String(await bidrequestPage.Rows_Below_Loan_Field.count());
    log.info(`Rows count below loan field (re-fetched via count): ${vars["RowsCountBelowLoanField"]}`);

    vars["count"] = "1";
    log.info(`Starting row-by-row status validation for ${vars["RowsCountBelowLoanField"]} rows below loan field`);
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["RowsCountBelowLoanField"]))) {
      vars["StatusBelowLoanField"] = (await bidrequestPage.Individual_RowUpload_progress_popup(vars["count"]).textContent() || '').trim();
      expect(["Success", "Warning"]).toContain(vars["StatusBelowLoanField"]);
      log.info(`Row ${vars["count"]} status validated: ${vars["StatusBelowLoanField"]}`);
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    log.info(`All rows below loan field validation passed`);

    // Click Continue
    //await page.waitForTimeout(5000);
      await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await page.waitForLoadState('load');
      await page.waitForTimeout(5000);

    // Validate Errors Column
    vars["ErrorColumnData"] = await bidRequestDetailsPage.Errors_Column.textContent() || '';
    log.info(`Errors Column text content read: '${vars["ErrorColumnData"]}'`);

    if (String(vars["Bid Enum Check(Errors Column)"]).includes(String(vars["ErrorColumnData"]))) {
      log.info(`Error column text is fully visible — asserting directly`);
      await expect(bidRequestDetailsPage.Errors_Column).toContainText(vars["Bid Enum Check(Errors Column)"]);
      log.info(`Errors Column validated directly: ${vars["Bid Enum Check(Errors Column)"]}`);
    } else {
      log.info(`Error column text is truncated — hovering to reveal popup`);
      await bidRequestDetailsPage.Errors_Column.hover();
      await expect(bidRequestDetailsPage.Error_Column_popup).toBeVisible();
      log.info(`Error Column popup is visible`);
      await expect(bidRequestDetailsPage.Error_Column_popup).toContainText(vars["Bid Enum Check(Errors Column)"]);
      log.info(`Error Column popup validated: ${vars["Bid Enum Check(Errors Column)"]}`);
    }

    // Validate remaining columns and buttons
    await expect(bidRequestPage.Error_Description_ColumnBid_request_details).toContainText(vars["Bid Enum Check(Error Description)"]);
    log.info(`Error Description column validated: ${vars["Bid Enum Check(Error Description)"]}`);

    await expect(bidRequestDetailsPage.Loan_Status_Column).toContainText(vars["Bid Enum Check(Loan Status)"]);
    log.info(`Loan Status column validated: ${vars["Bid Enum Check(Loan Status)"]}`);

    await expect(bidRequestDetailsPage.Loan_Number_Column).toContainText(vars["LoanNumberFromExcel"]);
    log.info(`Loan Number column validated: ${vars["LoanNumberFromExcel"]}`);

    await expect(bidRequestDetailsPage.PQ_button).toBeDisabled();
    log.info(`PQ button is Disabled`);

    await expect(bidRequestDetailsPage.PS_button).toBeDisabled();
    log.info(`PS button is Disabled`);
  });
});