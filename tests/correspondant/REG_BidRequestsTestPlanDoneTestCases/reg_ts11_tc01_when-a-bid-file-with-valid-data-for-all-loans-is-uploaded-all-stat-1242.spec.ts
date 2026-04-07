// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { UploadProgressPopUpPage } from '../../../src/pages/correspondant/upload-progress-pop-up';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { testDataManager } from 'testdata/TestDataManager';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let uploadProgressPopUpPage: UploadProgressPopUpPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    uploadProgressPopUpPage = new UploadProgressPopUpPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS11_TC01_When a bid file with valid data for all loans is uploaded, all statuses should display as success, and no loans should be marked as error. and all the loan status should be success.', async ({ page }) => {

    // Load credentials
    const credentials = ENV.getCredentials('internal');
    vars["Username"] = credentials.username;
    vars["Password"] = credentials.password;
    log.info(`Credentials loaded for user: ${vars["Username"]}`);

    const CorrPortalElem = new CorrPortalPage(page);

    // Load test data - profile 1
    const profileName = 'Bid Requests';
    const profile = testDataManager.getProfileByName(profileName);
    if (profile && profile.data) {
      const BidValidFile_LoanStatus = profile.data[0]['Bid Valid File(Loan Status)'];
      vars["Bid Valid File(Loan Status)"] = BidValidFile_LoanStatus;
      log.info(`Loaded loan status: ${vars["Bid Valid File(Loan Status)"]}`);

      const EligibilityCheck_ErrorDescription = profile.data[0]['Bid Valid File(Error Description)'];
      vars["Bid Valid File(Error Description)"] = EligibilityCheck_ErrorDescription;
      log.info(`Loaded Error Description: ${vars["Bid Valid File(Error Description)"]}`);

      const BidValidFile_ErrorColumn = profile.data[0]['Bid Valid File(Error Column)'];
      vars["Bid Valid File(Error Column)"] = BidValidFile_ErrorColumn;
      log.info(`Loaded Error Column: ${vars["Bid Valid File(Error Column)"]}`);

      const CompanyName = profile.data[0]['Company Name'];
      vars["CompanyName"] = CompanyName;
      log.info(`Loaded Company Name: ${vars["CompanyName"]}`);

      const BidMappingID = profile.data[0]['BidMappingID'];
      vars["BidMappingID"] = BidMappingID;
      log.info(`Loaded BidMappingID: ${vars["BidMappingID"]}`);
    }

    // Load test data - profile 2
    const profile2 = testDataManager.getProfileByName("Administration_Bulk Batch Timing");
    if (profile2 && profile2.data) {
      const TimeInterval = profile2.data[0]['Time Interval'];
      vars["Time Interval"] = TimeInterval;
      log.info(`Loaded Time Interval: ${vars["Time Interval"]}`);

      const NoOfBatches = profile2.data[0]['NO of Batches'];
      vars["NO of Batches"] = NoOfBatches;
      log.info(`Loaded NO of Batches: ${vars["NO of Batches"]}`);
    }

    // "Bid Valid File(Loan Status)": "Success",
    // "Bid Valid File(Error Column)": "No errors",
    // "Bid Valid File(Error Description)": "No Errors",

    // Login and initial navigation
    log.info(`Logging in to Correspondent Portal`);
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    log.info(`Login successful`);

    log.info(`Deleting early config report if present`);
    await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
    log.info(`Early config report deletion step completed`);

    // Navigate to Bid Requests menu
    log.info(`Clicking Bid Requests menu`);
    await CorrPortalElem.BidRequests_Menu.click();
    log.info(`Waiting for spinner to hide after Bid Requests menu click`);
    await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText("Bid Requests").first()).toBeVisible();
    log.info(`Bid Requests page is visible`);

    // Upload initial bid request
    log.info(`Uploading initial Bid Request via step group`);
    await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
    log.info(`Initial Bid Request upload step completed`);

    // Check if second enabled batch time is visible
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

    // Upload valid bid file
    log.info(`Uploading valid bid file: BidSuccesloans_popup_UI (3).xlsx`);
    await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, '../../../uploads', "BidSuccesloans_popup_UI (3).xlsx"));
    log.info(`Valid bid file upload input set successfully`);

    vars["LoanNumberFromExcel"] = String(
      excelHelper.readCell({
        filePath: path.resolve(__dirname, '../../../uploads', "BidSuccesloans_popup_UI (3).xlsx"),
        columnHeader: "Correspondent Loan Number",
        rowIndex: 0,
      }) ?? ''
    );
    log.info(`Loan Number read from Excel: ${vars["LoanNumberFromExcel"]}`);

    // Click Upload Bid button
    log.info(`Verifying Upload Bid button is visible and enabled`);
    await expect(correspondentPortalPage.UploadBid_Button).toBeVisible();
    await expect(correspondentPortalPage.UploadBid_Button).toBeEnabled();
    log.info(`Clicking Upload Bid button`);
    await correspondentPortalPage.UploadBid_Button.click();
    log.info(`Upload Bid button clicked`);

    // Wait for upload progress
    log.info(`Waiting for spinner to hide after upload click`);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    log.info(`Waiting for Bid Upload Progress text to appear`);
    await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
    log.info(`Bid Upload Progress is visible`);
    log.info(`Waiting for spinner to hide on progress screen`);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });

    // Verify Continue button
    log.info(`Waiting for Continue button to be visible`);
    await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
    log.info(`Continue button is visible`);
    await expect(bidRequestPage.Continue_ButtonUpload_Pop_up).toBeEnabled;

    // Validate rows above loan field validation
    const rows = await bidRequestPage.Rows_above_Loan_Field_validation.all();
    log.info(`Total rows above loan field validation: ${rows.length}`);
    for (const row of rows) {
      await expect(row).toContainText("Success");
      log.info(`Row above loan field validation verified as 'Success': ${await row.textContent()}`);
    }

    // Validate all individual statuses on popup
    vars["count"] = "1";
    vars["AllStatusCountPopup"] = String(await priceOfferedPage.Price_Offered_Status_Column_Data.count());
    log.info(`Total individual status rows on popup: ${vars["AllStatusCountPopup"]}`);
    log.info(`Starting individual status validation for all ${vars["AllStatusCountPopup"]} rows on popup`);
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["AllStatusCountPopup"]))) {
      await expect(uploadProgressPopUpPage.Individual_Status_On_Popup(vars["count"])).toContainText("Success");
      log.info(`Popup row ${vars["count"]} status validated as 'Success'`);
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    log.info(`All individual status rows on popup validated as 'Success'`);

    // Click Continue and wait for page load
    log.info(`Clicking Continue button`);
    await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
    log.info(`Continue button clicked`);
    log.info(`Waiting for spinner to hide after Continue click`);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    log.info(`Waiting for page load state`);
    await page.waitForLoadState('load');
    log.info(`Waiting 5 seconds for page to stabilize`);
    await page.waitForTimeout(5000);
    log.info(`Page stabilized after Continue`);

    // Validate loan numbers in table against Excel
    vars["RowsCountTable"] = String(await bidRequestDetailsPage.Rows_Count_Table_1.count());
    vars["RowCountExcel"] = "0";
    log.info(`Total rows in bid request details table: ${vars["RowsCountTable"]}`);
    log.info(`Starting loan number comparison between UI table and Excel`);
    while (parseFloat(String(vars["RowsCountTable"])) >= parseFloat(String("1"))) {
      vars["LoanNumberUI"] = (await bidRequestDetailsPage.Loan_Number_DataCommon(vars["RowsCountTable"]).textContent() || '').trim();
      log.info(`Loan Number read from UI: '${vars["LoanNumberUI"]}'`);
      vars["LoanNumberExcel"] = String(
        excelHelper.readCell({
          filePath: path.resolve(__dirname, '../../../uploads', "BidSuccesloans_popup_UI (3).xlsx"),
          columnHeader: "Correspondent Loan Number",
          rowIndex: parseInt(vars["RowCountExcel"]),
        }) ?? ''
      );
      log.info(`Loan Number read from Excel (row ${vars["RowCountExcel"]}): '${vars["LoanNumberExcel"]}'`);
      expect(String(vars["LoanNumberUI"])).toContain(vars["LoanNumberExcel"]);
      log.info(`Loan Number match validated — UI: '${vars["LoanNumberUI"]}' contains Excel: '${vars["LoanNumberExcel"]}'`);
      vars["RowCountExcel"] = (parseFloat(String("1")) + parseFloat(String(vars["RowCountExcel"]))).toFixed(0);
      vars["RowsCountTable"] = (parseFloat(String(vars["RowsCountTable"])) - parseFloat(String("1"))).toFixed(0);
    }
    log.info(`All loan number comparisons between UI and Excel passed`);


    // Validate final columns
    const loanStatusRows = await bidRequestDetailsPage.Loan_Status_ColumnCommon.all();
    log.info(`Total Loan Status rows to validate: ${loanStatusRows.length}`);
    for (const row of loanStatusRows) {
      await expect(row).toContainText(vars["Bid Valid File(Loan Status)"]);
      log.info(`Loan Status row validated: '${await row.textContent()}'`);
    }

    const errorColumnRows = await bidRequestDetailsPage.Error_Column_Data_Common.all();
    log.info(`Total Error Column rows to validate: ${errorColumnRows.length}`);
    for (const row of errorColumnRows) {
      await expect(row).toContainText(vars["Bid Valid File(Error Column)"]);
      log.info(`Error Column row validated: '${await row.textContent()}'`);
    }

    const errorDescriptionRows = await bidRequestDetailsPage.Error_Description_Column_DataCommon.all();
    log.info(`Total Error Description rows to validate: ${errorDescriptionRows.length}`);
    for (const row of errorDescriptionRows) {
      await expect(row).toContainText(vars["Bid Valid File(Error Description)"]);
      log.info(`Error Description row validated: '${await row.textContent()}'`);
    }
  });
});