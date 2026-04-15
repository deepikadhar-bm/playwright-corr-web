// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestCreationPage } from '../../../src/pages/correspondant/bid-request-creation';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';


test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestCreationPage: BidRequestCreationPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let statusInactivePage: StatusInactivePage;
  let spinnerPage: SpinnerPage;
  let reg_ts14_tc03_testFailed = false;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestCreationPage = new BidRequestCreationPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    statusInactivePage = new StatusInactivePage(page);
    spinnerPage = new SpinnerPage(page);
  });

  const TC_ID = 'REG_TS14_TC03';
  const TC_TITLE = 'Verify the data present in bid detail screen by selecting both standard and chase execution type';

  test('REG_TS14_TC03_Verify the data present in bid detail screen by selecting both standard and chase execution type', async ({ page }) => {
    try {
      log.tcStart(TC_ID, TC_TITLE);

      //   const testData: Record<string, string> = {
      // "Ccode for freedom": "A4187",
      const CorrPortalElem = new CorrPortalPage(page);
      log.step('Initializing page objects and loading test data');
      try {
        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        log.info(`Credentials loaded - Username: ${vars["Username"]}`);

        const profile2 = testDataManager.getProfileByName("Administration_Bulk Batch Timing");
        if (profile2 && profile2.data) {
          const TimeInterval = profile2.data[0]['Time Interval'];
          vars["Time Interval"] = TimeInterval;
          log.info(`Loaded Time Interval: ${vars["Time Interval"]}`);

          const NoOfBatches = profile2.data[0]['NO of Batches'];
          vars["NO of Batches"] = NoOfBatches;
          log.info(`Loaded NO of Batches: ${vars["NO of Batches"]}`);
        } else {
          log.warn('Administration_Bulk Batch Timing profile not found');
        }

        const profile1 = testDataManager.getProfileByName("Bid Requests");
        if (profile1 && profile1.data) {
          const CompanyName = profile1.data[0]['Company Name'];
          vars["CompanyName"] = CompanyName;
          log.info(`Loaded Company Name: ${vars["CompanyName"]}`);

          const BidMappingID = profile1.data[0]['BidMappingID'];
          vars["BidMappingID"] = BidMappingID;
          log.info(`Loaded Bid Mapping ID: ${vars["BidMappingID"]}`);

          const Ccodeforfreedom = profile1.data[0]['Ccode for freedom'];
          vars["Ccode for freedom"] = Ccodeforfreedom;
          log.info(`Loaded Ccode for freedom: ${vars["Ccode for freedom"]}`);
        } else {
          log.warn('Bid Requests profile not found');
        }

        log.stepPass('Test data loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to initialize page objects or load test data');
        throw e;
      }

      // ── Step 1: Login to Portal ─────────────────────────────────────────
      log.step('Logging into Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.info('Successfully logged into Correspondent Portal');
        log.stepPass('Login successful');
      } catch (e) {
        await log.stepFail(page, 'Failed to login to Correspondent Portal');
        throw e;
      }

      // ── Step 2: Delete Early Config Report ──────────────────────────────
      log.step('Deleting Early Config Report if Present');
      try {
        await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
        log.info('Early Config Report deletion completed');
        log.stepPass('Early Config Report deleted if present');
      } catch (e) {
        await log.stepFail(page, 'Failed to delete Early Config Report');
        throw e;
      }

      // [DISABLED] Navigating to Bulk Batch Timing
      // await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
      // [DISABLED] Store the value displayed in the text box Pricing_Return_Time_Buffer field into a variable BufferTime
      // vars["BufferTime"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';

      // ── Step 3: Navigate to Upload New Bid Request ──────────────────────
      log.step('Navigating to Upload New Bid Request');
      try {
        await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
        log.info('Successfully navigated to Upload New Bid Request');
        log.stepPass('Navigation successful');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Upload New Bid Request');
        throw e;
      }

      // ── Step 4: Upload Bid Request with Standard and Chase Execution Types ───
      log.step('Uploading Bid Request by selecting both Standard and Chase execution types');
      try {
        await stepGroups.stepGroup_Uploading_Bid_Request_By_Selecting_both_standard_and_chase_t(page, vars);
        log.info('Successfully uploaded Bid Request with Standard and Chase execution types');
        log.stepPass('Bid Request upload successful');
      } catch (e) {
        await log.stepFail(page, 'Failed to upload Bid Request with Standard and Chase execution types');
        throw e;
      }

      // [DISABLED] Uploading Bid Request
      // await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);

      // ── Step 5: Check for Enabled Batch Time ────────────────────────────
      log.step('Checking for enabled batch time');
      try {
        if (await CorrPortalElem.Second_Enabled_Time.count() > 0) /* Element Second Enabled Time is visible */ {
          log.info('Second Enabled Time element is visible');
          await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
          log.info('Successfully selected second enabled batch time');
          log.stepPass('Batch time selection successful');
          // [DISABLED] Scroll to the element Enabled Time New into view
          // await bidRequestCreationPage.Enabled_Time_New.scrollIntoViewIfNeeded();
          // [DISABLED] Click on Enabled Time New
          // await bidRequestCreationPage.Enabled_Time_New.click();
        } else {
          log.info('Second Enabled Time element not visible, navigating to Bulk Batch Timing');
          await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
          log.info('Navigated to Bulk Batch Timing');

          await stepGroups.stepGroup_Modifying_Batch_Intervals_For_next_bussiness_day(page, vars);
          log.info('Modified Batch Intervals for next business day');

          await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
          log.info('Re-navigated to Upload New Bid Request');

          await stepGroups.stepGroup_Uploading_Bid_Request_By_Selecting_both_standard_and_chase_t(page, vars);
          log.info('Re-uploaded Bid Request with Standard and Chase execution types');

          await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
          log.info('Selected second enabled batch time after modification');
          log.stepPass('Batch time handling completed');
          // [DISABLED] Uploading Bid Request
          // await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
          // [DISABLED] Scroll to the element Enabled Date into view
          // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
          // [DISABLED] Click on Enabled Date
          // await bidRequestPage.Enabled_Time.click();
        }
      } catch (e) {
        await log.stepFail(page, 'Failed during batch time handling');
        throw e;
      }

      // ── Step 6: Calculate Current EST Date and Time ──────────────────────
      log.step('Calculating current EST date and time');
      try {
        vars["CurrentESTDate"] = (() => {
          const d = new Date();
          const opts: Intl.DateTimeFormatOptions = { timeZone: "America/New_York" };
          const fmt = "MM/dd/yyyy";
          // Map Java date format to Intl parts
          const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
          const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
          return fmt.replace('yyyy', p.year || '').replace('yy', (p.year || '').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2, '0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month || '0'))).replace(/d(?!d)/g, String(parseInt(p.day || '0'))).replace(/h(?!h)/g, String(parseInt(p.hour || '0')));
        })();
        log.info(`Current EST Date calculated: ${vars["CurrentESTDate"]}`);

        const d = new Date();
        vars["CurrentEstTime"] = d.toLocaleString('en-US', {
          timeZone: 'America/New_York',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        log.info(`Current EST Time: "${vars["CurrentEstTime"]}"`);

        vars["CurrentEstHourMin"] = String(vars["CurrentEstTime"]).substring(0, String(vars["CurrentEstTime"]).length - 3);
        log.info(`Current EST Hour:Min extracted: ${vars["CurrentEstHourMin"]}`);

        vars["CurrentEstTimeUnit"] = String(vars["CurrentEstTime"]).substring(6);
        log.info(`Current EST Time Unit extracted: ${vars["CurrentEstTimeUnit"]}`);

        log.stepPass('EST date and time calculated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to calculate EST date and time');
        throw e;
      }

      // ── Step 7: Upload File and Extract Data ────────────────────────────
      log.step('Uploading file and extracting test data');
      try {
        log.info('Clicking on BidRequestedDate_Label');
        await bidRequestDetailsPage.BidRequestedDate_Label.click();
        log.info('Setting input file for upload');
        await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, '../../../uploads', "Bid_Valid_file (2).xlsx"));
        log.info('File set successfully');

        //vars["LoanNumberFromExcel"] = excelHelper.readCell(path.resolve(__dirname, 'test-data', "Bid_Valid_file.xlsx,Bid_Valid_file.xlsx"), "2", "1");
        vars["LoanNumberFromExcel"] = String(
          excelHelper.readCell({
            filePath: path.resolve(__dirname, '../../../uploads', "Bid_Valid_file (2).xlsx"),
            columnHeader: "Correspondent Loan Number",
            rowIndex: 0,

          }) ?? ''
        );
        log.info(`Loan Number from Excel extracted: ${vars["LoanNumberFromExcel"]}`);

        vars["SelectedCompanyName"] = await bidRequestCreationPage.Selected_Company_from_Dropdown.textContent() || '';
        log.info(`Selected Company Name: ${vars["SelectedCompanyName"]}`);

        vars["SelectedLockTermStandard"] = await correspondentPortalPage.StandardExceutionType_Dropdown.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        log.info(`Selected Lock Term Standard: ${vars["SelectedLockTermStandard"]}`);

        vars["SelectedLockTermChase"] = await bidRequestPage.Chase_Direct_DropdownUpload_Bidrequest.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        log.info(`Selected Lock Term Chase: ${vars["SelectedLockTermChase"]}`);

        vars["SelectedBidMappingId"] = await chaseFieldNamePage.Bid_Mapping_ID_Dropdown(vars["BidMappingID"]).textContent() || '';
        log.info(`Selected Bid Mapping ID: ${vars["SelectedBidMappingId"]}`);

        vars["SelectedBatchTime"] = await correspondentPortalPage.Pricing_Return_Time.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        log.info(`Selected Batch Time: ${vars["SelectedBatchTime"]}`);

        log.stepPass('File uploaded and test data extracted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to upload file and extract test data');
        throw e;
      }

      // ── Step 8: Submit Bid Upload ──────────────────────────────────────
      log.step('Submitting Bid Upload');
      try {
        await expect(correspondentPortalPage.UploadBid_Button).toBeVisible();
        await expect(correspondentPortalPage.UploadBid_Button).toBeEnabled();
        await correspondentPortalPage.UploadBid_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
        await page.waitForTimeout(5000);

        log.info('Verifying Continue_ButtonUpload_Pop_up is visible');
        await expect(bidRequestPage.Continue_ButtonUpload_Pop_up).toBeVisible();
        log.info('Button verified');

        log.info('Verifying Rows_above_Loan_Field_validation contains "Success"');
        //await expect(bidRequestPage.Rows_above_Loan_Field_validation).toContainText("Success");
        const rows = await bidRequestPage.Rows_above_Loan_Field_validation.all();
        log.info(`Total rows above loan field validation: ${rows.length}`);

        for (const row of rows) {
          await expect(row).toContainText("Success");
          log.info(`Row validation successful: ${await row.textContent()}`);
        }
        log.info('Validation message verified');

        log.info('Clicking Continue_ButtonUpload_Pop_up');
        await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.waitForLoadState('load');
        await page.waitForTimeout(5000);
        log.stepPass('Bid Request file uploaded successfully');

        log.stepPass('Bid upload submitted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to submit bid upload');
        throw e;
      }

      // ── Step 9: Verify Bid Request Details ─────────────────────────────
      log.step('Verifying bid request details');
      try {
        log.info(`Verifying Loan_Number_Column contains ${vars["LoanNumberFromExcel"]}`);
        await expect(bidRequestDetailsPage.Loan_Number_Column).toContainText(vars["LoanNumberFromExcel"]);
        log.info('Loan number verified');

        log.info(`Verifying CCode_Valuebid_request_details contains ${vars["Ccode for freedom"]}`);
        await expect(correspondentPortalPage.CCode_Valuebid_request_details).toContainText(vars["Ccode for freedom"]);
        log.info('CCode verified');

        log.info(`Verifying Company_ValueBid_Request_Details contains ${vars["SelectedCompanyName"]}`);
        await expect(bidRequestDetailsPage.Company_ValueBid_Request_Details).toContainText(vars["SelectedCompanyName"]);
        log.info('Company name verified');

        log.stepPass('Bid request details verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify bid request details');
        throw e;
      }

      // ── Step 10: Extract and Validate Request ID ────────────────────────
      log.step('Extracting and validating Request ID');
      try {
        vars["RequestIdDetails"] = await bidRequestDetailsPage.Request_Id_From_Details.textContent() || '';
        vars["RequestIdDetails"] = String(vars["RequestIdDetails"]).trim();
        log.info(`Request ID extracted: ${vars["RequestIdDetails"]}`);

        vars["RequestIdCount"] = String(vars["RequestIdDetails"]).length.toString();
        log.info(`Request ID length: ${vars["RequestIdCount"]}`);

        expect(String(vars["RequestIdCount"])).toBe("12");
        log.info('Request ID length validated as 12 characters');

        log.stepPass('Request ID validated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to validate Request ID');
        throw e;
      }

      // ── Step 11: Check Bid Status ──────────────────────────────────────
      log.step('Checking bid request status');
      try {
        let BidStatus = await bidRequestDetailsPage.Statusbid_request_details.textContent() || '';
        BidStatus = String(BidStatus).trim();
        log.info(`Bid Status: ${BidStatus}`);

        if (BidStatus.includes("Ready for Pricing")) /* Verify that the element Bid Status From Details displays text */ {
          log.info('Bid Status is "Ready for Pricing"');
        } else {
          log.info('Bid Status is not "Ready for Pricing", verifying "Processing Failed"');
          await expect(bidRequestDetailsPage.Statusbid_request_details).toContainText("Processing Failed");
          log.info('Bid Status verified as "Processing Failed"');
        }

        log.stepPass('Bid status checked successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to check bid status');
        throw e;
      }

      // ── Step 12: Extract and Validate Execution Type ────────────────────
      log.step('Extracting and validating execution type details');
      try {
        vars["ExecutionTypeDetails"] = await bidRequestDetailsPage.Execution_Type_Parsed_Row.textContent() || '';
        vars["ExecutionTypeDetails"] = String(vars["ExecutionTypeDetails"]).trim();
        log.info(`Execution Type Details: ${vars["ExecutionTypeDetails"]}`);

        vars["OnlyExecution1"] = String(vars["ExecutionTypeDetails"]).substring(0, String(vars["ExecutionTypeDetails"]).length - 11);
        log.info(`Extracted first execution type: ${vars["OnlyExecution1"]}`);
        expect(String(vars["OnlyExecution1"])).toContain("SF");
        log.info('First execution type verified as SF');

        vars["LocktermFromDetails1"] = String(vars["ExecutionTypeDetails"]).substring(3, String(vars["ExecutionTypeDetails"]).length - 8);
        log.info(`Extracted first lock term: ${vars["LocktermFromDetails1"]}`);
        expect(String(vars["LocktermFromDetails1"])).toContain(vars["SelectedLockTermStandard"]);
        log.info(`First lock term verified as ${vars["SelectedLockTermStandard"]}`);

        vars["OnlyExecution2"] = String(vars["ExecutionTypeDetails"]).substring(7, String(vars["ExecutionTypeDetails"]).length - 4);
        log.info(`Extracted second execution type: ${vars["OnlyExecution2"]}`);
        expect(String(vars["OnlyExecution2"])).toContain("CD");
        log.info('Second execution type verified as CD');

        vars["LocktermFromDetails2"] = String(vars["ExecutionTypeDetails"]).substring(10, String(vars["ExecutionTypeDetails"]).length - 1);
        log.info(`Extracted second lock term: ${vars["LocktermFromDetails2"]}`);
        expect(String(vars["LocktermFromDetails2"])).toContain(vars["SelectedLockTermChase"]);
        log.info(`Second lock term verified as ${vars["SelectedLockTermChase"]}`);

        log.stepPass('Execution type details validated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to validate execution type details');
        throw e;
      }

      // ── Step 13: Extract and Calculate Bid Values ──────────────────────
      log.step('Extracting and calculating bid values');
      try {
        vars["BidValueTableHeader1"] = await bidRequestDetailsPage.Bid_Value_From_Table_Header1.first().textContent() || '';
        log.info(`Bid Value Table Header 1: ${vars["BidValueTableHeader1"]}`);

        vars["BidValueTableHeader2"] = await bidRequestDetailsPage.Bid_Value_from_Table_Header_2.first().textContent() || '';
        log.info(`Bid Value Table Header 2: ${vars["BidValueTableHeader2"]}`);

        vars["ExpectedParsedBidValue"] = (parseFloat(String(vars["BidValueTableHeader1"])) + parseFloat(String(vars["BidValueTableHeader2"]))).toFixed(0);
        log.info(`Sum of Bid Values: ${vars["ExpectedParsedBidValue"]}`);

        vars["ExpectedParsedBidValue"] = (parseFloat(String(vars["ExpectedParsedBidValue"])) / parseFloat(String("1000000"))).toFixed(2);
        log.info(`Expected Parsed Bid Value (in millions): ${vars["ExpectedParsedBidValue"]}`);

        log.stepPass('Bid values extracted and calculated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to extract and calculate bid values');
        throw e;
      }

      // ── Step 14: Extract and Calculate Total Loans ─────────────────────
      log.step('Extracting and calculating total loans');
      try {
        vars["TotalLoansHeader1"] = await bidRequestDetailsPage.Total_loans_TableHeader_1.first().textContent() || '';
        log.info(`Total Loans Header 1: ${vars["TotalLoansHeader1"]}`);

        vars["TotalLoansHeader2"] = await bidRequestDetailsPage.Total_loans_Table_header_2.first().textContent() || '';
        log.info(`Total Loans Header 2: ${vars["TotalLoansHeader2"]}`);

        vars["ExpectedParsedTotalLoans"] = (parseFloat(String(vars["TotalLoansHeader1"])) + parseFloat(String(vars["TotalLoansHeader2"]))).toFixed(0);
        log.info(`Expected Parsed Total Loans: ${vars["ExpectedParsedTotalLoans"]}`);

        log.stepPass('Total loans extracted and calculated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to extract and calculate total loans');
        throw e;
      }

      // ── Step 15: Extract and Calculate Success Loans ────────────────────
      log.step('Extracting and calculating success loans');
      try {
        vars["SuccessLoansHeader1"] = await bidRequestDetailsPage.Success_Loans_Header_1.first().textContent() || '';
        log.info(`Success Loans Header 1: ${vars["SuccessLoansHeader1"]}`);

        vars["SuccessLoansHeader2"] = await bidRequestDetailsPage.Success_Loans_Header_2.first().textContent() || '';
        log.info(`Success Loans Header 2: ${vars["SuccessLoansHeader2"]}`);

        vars["ExpectedParsedSuccessLoans"] = (parseFloat(String(vars["SuccessLoansHeader1"])) + parseFloat(String(vars["SuccessLoansHeader2"]))).toFixed(0);
        log.info(`Expected Parsed Success Loans: ${vars["ExpectedParsedSuccessLoans"]}`);

        log.stepPass('Success loans extracted and calculated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to extract and calculate success loans');
        throw e;
      }

      // ── Step 16: Extract and Calculate Errored Loans ────────────────────
      log.step('Extracting and calculating errored loans');
      try {
        vars["ErroredLoansHeader1"] = await bidRequestDetailsPage.Errored_Loans_Header1.first().textContent() || '';
        log.info(`Errored Loans Header 1: ${vars["ErroredLoansHeader1"]}`);

        vars["ErroredLoansHeader2"] = await bidRequestDetailsPage.Errored_Loans_Header_2.first().textContent() || '';
        log.info(`Errored Loans Header 2: ${vars["ErroredLoansHeader2"]}`);

        vars["ExpectedParsedErroredLoans"] = (parseFloat(String(vars["ErroredLoansHeader1"])) + parseFloat(String(vars["ErroredLoansHeader2"]))).toFixed(0);
        log.info(`Expected Parsed Errored Loans: ${vars["ExpectedParsedErroredLoans"]}`);

        log.stepPass('Errored loans extracted and calculated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to extract and calculate errored loans');
        throw e;
      }

      // ── Step 17: Verify Parsed Loan Data ───────────────────────────────
      log.step('Verifying parsed loan data in UI');
      try {
        log.info(`Verifying Parsed_Total_Loans contains ${vars["ExpectedParsedTotalLoans"]}`);
        await expect(bidRequestDetailsPage.Parsed_Total_Loans).toContainText(vars["ExpectedParsedTotalLoans"]);
        log.info('Total loans verified');

        log.info(`Verifying Parsed_Success_Loans contains ${vars["ExpectedParsedSuccessLoans"]}`);
        await expect(bidRequestDetailsPage.Parsed_Success_Loans).toContainText(vars["ExpectedParsedSuccessLoans"]);
        log.info('Success loans verified');

        log.info(`Verifying Parsed_Errored_loans contains ${vars["ExpectedParsedErroredLoans"]}`);
        await expect(bidRequestDetailsPage.Parsed_Errored_loans).toContainText(vars["ExpectedParsedErroredLoans"]);
        log.info('Errored loans verified');

        log.stepPass('Parsed loan data verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify parsed loan data');
        throw e;
      }

      // [DISABLED] Verify that the element Bid Value parsed row displays text contains ExpectedParsedBidValue and With Scrollable TRUE
      // await expect(bidRequestDetailsPage.Bid_Value_parsed_row).toContainText(vars["ExpectedParsedBidValue"]);
      // [DISABLED] Store text from the element LoansDataTableHeader into a variable LoansTableHeader
      // vars["LoansTableHeader"] = await bidRequestDetailsPage.LoansDataTableHeader.textContent() || '';
      // [DISABLED] Trim white space from LoansTableHeader and store it in a runtime LoansTableHeader
      // vars["LoansTableHeader"] = String(vars["LoansTableHeader"]).trim();
      // [DISABLED] Store text from the element LoansDataParsedRow into a variable LoansDataParsedRow
      // vars["LoansDataParsedRow"] = await bidRequestDetailsPage.LoansDataParsedRow.textContent() || '';
      // [DISABLED] Trim white space from LoansDataParsedRow and store it in a runtime LoansDataParsedRow
      // vars["LoansDataParsedRow"] = String(vars["LoansDataParsedRow"]).trim();
      // [DISABLED] Verify if LoansDataParsedRow contains LoansTableHeader
      // expect(String(vars["LoansDataParsedRow"])).toBe(vars["LoansTableHeader"]);
      // [DISABLED] Verify that the element Footer Submission Date displays text contains CurrentESTDate and With Scrollable TRUE
      // await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText(vars["CurrentESTDate"]);
      // [DISABLED] Verify that the element Footer Submission Date displays text contains CurrentEstHourMin and With Scrollable TRUE
      // await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText(vars["CurrentEstHourMin"]);
      // [DISABLED] Verify that the element Footer Submission Date displays text contains CurrentEstTimeUnit and With Scrollable TRUE
      // await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText(vars["CurrentEstTimeUnit"]);
      // [DISABLED] Verify that the element Footer Queued For Date displays text contains CurrentESTDate and With Scrollable TRUE
      // await expect(bidRequestDetailsPage.Footer_Queued_For_Date).toContainText(vars["CurrentESTDate"]);
      // [DISABLED] Adjust EST by Subtracting Minutes hh:mm a BufferTime into SelectedBatchTime
      // vars[""] = (() => {
      //   const d = new Date('2000-01-01 ' + String(''));
      //   d.setMinutes(d.getMinutes() - parseInt(String('')));
      //   return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      // })();
      // [DISABLED] Verify that the element Footer Queued For Date displays text contains SelectedBatchTime and With Scrollable TRUE
      // await expect(bidRequestDetailsPage.Footer_Queued_For_Date).toContainText(vars["SelectedBatchTime"]);

      log.tcEnd('PASS');
    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      reg_ts14_tc03_testFailed = true;
      throw e;
    }
  });


});
