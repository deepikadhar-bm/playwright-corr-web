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
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { testDataManager } from 'testdata/TestDataManager';
import { SpinnerPage } from '@pages/correspondant';

const TC_ID = 'REG_TS14_TC01';
const TC_TITLE = 'Verify the data present in bid detail screen by selecting standard execution type';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestCreationPage: BidRequestCreationPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let statusInactivePage: StatusInactivePage;
  let spinnerPage: SpinnerPage;

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

  test(`${TC_ID}_${TC_TITLE}`, async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      // ── Load credentials ──────────────────────────────────────────────────
      log.step('Loading credentials and test data');
      try {
        // "Ccode for freedom": "A4187",
        // Load test data - profile 1
        const credentials = ENV.getCredentials('internal');
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;

        const profileName = 'Bid Requests';
        const profile = testDataManager.getProfileByName(profileName);
        if (profile && profile.data) {
          const CompanyName = profile.data[0]['Company Name'];
          vars["CompanyName"] = CompanyName;
          log.info(`Loaded Company Name: ${vars["CompanyName"]}`);

          const BidMappingID = profile.data[0]['BidMappingID'];
          vars["BidMappingID"] = BidMappingID;
          log.info(`Loaded BidMappingID: ${vars["BidMappingID"]}`);

          const CcodeForFreedom = profile.data[0]['Ccode for freedom'];
          vars["Ccode for freedom"] = CcodeForFreedom;
          log.info(`Loaded Ccode for freedom: ${vars["Ccode for freedom"]}`);
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

        log.stepPass('Credentials and test data loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Loading credentials and test data failed');
        throw e;
      }

      // ── Login, navigate and upload bid request ────────────────────────────
      log.step('Logging in, navigating to Bulk Batch Timing and uploading Bid Request');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        vars["BufferTime"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
        log.info(`BufferTime: ${vars["BufferTime"]}`);

        //await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
        const CorrPortalElem = new CorrPortalPage(page);
        await CorrPortalElem.BidRequests_Menu.click();
        await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText("Bid Requests").first()).toBeVisible();
        await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);

        log.stepPass('Login, navigation and bid request upload successful');
      } catch (e) {
        await log.stepFail(page, 'Login, navigation or bid request upload failed');
        throw e;
      }

      // ── Check second enabled batch time and select / configure accordingly ─
      log.step('Checking second enabled batch time visibility and selecting batch time');
      try {
        let isVisible = false;
        try {
          await page.locator('app-single-select-dropdown#pricingReturnTimeDropdown').waitFor({ state: 'visible', timeout: 10000 });
          const count = await new CorrPortalPage(page).Second_Enabled_Time.count();
          log.info(`Second_Enabled_Time element count: ${count}`);
          isVisible = count > 0;
        } catch {
          isVisible = false;
        }
        log.info(`Is the second enabled batch time visible? ${isVisible}`);

        if (isVisible) /* Element Second Enabled Time is visible */ {
          log.info('Enabled Time is Visible');
          await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
          // [DISABLED] Scroll to the element Enabled Time New into view
          // await bidRequestCreationPage.Enabled_Time_New.scrollIntoViewIfNeeded();
          // [DISABLED] Click on Enabled Time New
          // await bidRequestCreationPage.Enabled_Time_New.click();
        } else {
          log.info('Enabled Time is not visible, modifying the batches');
          await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
          await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
          // [DISABLED] Modifying The Batch Intervals For one Hour Prior.
          // await stepGroups.stepGroup_Modifying_The_Batch_Intervals_For_one_Hour_Prior(page, vars);
          //await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
          const CorrPortalElem = new CorrPortalPage(page);
          await CorrPortalElem.BidRequests_Menu.click();
          await CorrPortalElem.Spinner.waitFor({ state: 'hidden' });
          await expect(page.getByText("Bid Requests").first()).toBeVisible();
          await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
          await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
          // [DISABLED] Scroll to the element Enabled Date into view
          // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
          // [DISABLED] Click on Enabled Date
          // await bidRequestPage.Enabled_Time.click();
        }

        log.stepPass('Batch time selected successfully');
      } catch (e) {
        await log.stepFail(page, 'Checking or selecting batch time failed');
        throw e;
      }

      // ── Capture EST date and time variables ───────────────────────────────
      log.step('Capturing current EST date and time variables');
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
        log.info(`CurrentESTDate: ${vars["CurrentESTDate"]}`);

        
        vars["CurrentEstTime"] = (() => {
          const d = new Date();

          return new Intl.DateTimeFormat('en-US', {
            timeZone: "America/New_York",
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
            .format(d)
            .replace(/\s?(AM|PM)$/i, (m) => m.toUpperCase()); // ensure AM/PM uppercase
        })();

        log.info(`CurrentEstTime: ${vars["CurrentEstTime"]}`);



        log.stepPass('EST date and time variables captured successfully');
      } catch (e) {
        await log.stepFail(page, 'Capturing EST date and time variables failed');
        throw e;
      }

      // ── Upload bid request file and proceed through upload popup ──────────
      log.step('Uploading bid request file and proceeding through upload popup');
      try {
        await bidRequestDetailsPage.BidRequestedDate_Label.click();
        await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, '../../../uploads', "Bid_file_success_error_newfile1.xlsx"));

        vars["LoanNumberFromExcel"] = String(
          excelHelper.readCell({
            filePath: path.resolve(__dirname, '../../../uploads', "Bid_file_success_error_newfile1.xlsx"),
            columnHeader: "Correspondent Loan Number",
            rowIndex: 0,
          }) ?? ''
        );
        log.info(`LoanNumberFromExcel: ${vars["LoanNumberFromExcel"]}`);

        vars["SelectedCompanyName"] = await bidRequestCreationPage.Selected_Company_from_Dropdown.textContent() || '';
        log.info(`SelectedCompanyName: ${vars["SelectedCompanyName"]}`);

        vars["SelectedLockTerm"] = await correspondentPortalPage.StandardExceutionType_Dropdown.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        log.info(`SelectedLockTerm: ${vars["SelectedLockTerm"]}`);

        vars["SelectedBidMappingId"] = await chaseFieldNamePage.Bid_Mapping_ID_Dropdown(vars["BidMappingID"]).textContent() || '';
        log.info(`SelectedBidMappingId: ${vars["SelectedBidMappingId"]}`);

        vars["SelectedBatchTime"] = await correspondentPortalPage.Pricing_Return_Time.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
        log.info(`SelectedBatchTime: ${vars["SelectedBatchTime"]}`);

        await expect(correspondentPortalPage.UploadBid_Button).toBeVisible();
        await correspondentPortalPage.UploadBid_Button.click();
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
        //await expect(bidRequestPage.Rows_above_Loan_Field_validation).toContainText("Success");
        const rows = await bidRequestPage.Rows_above_Loan_Field_validation.all();
        log.info(`Total rows above loan field validation: ${rows.length}`);

        for (const row of rows) {
          await expect(row).toContainText("Success");
          log.info(`Row validation successful: ${await row.textContent()}`);
        }
        await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
        log.info(`Waiting for spinner to hide after Continue click`);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.info(`Waiting for page load state`);
        await page.waitForLoadState('load');
        log.info(`Waiting 5 seconds for page to stabilize`);
        await page.waitForTimeout(3000);
        log.info(`Page stabilized after Continue`);
        log.stepPass('File uploaded and upload popup dismissed successfully');
      } catch (e) {
        await log.stepFail(page, 'Uploading bid request file or proceeding through upload popup failed');
        throw e;
      }

      // ── Verify bid request details ────────────────────────────────────────
      log.step('Verifying bid request details');
      try {
        await expect(bidRequestDetailsPage.Loan_Number_Column).toContainText(vars["LoanNumberFromExcel"]);
        log.info(`Loan Number verified: ${vars["LoanNumberFromExcel"]}`);

        await expect(correspondentPortalPage.CCode_Valuebid_request_details).toContainText(vars["Ccode for freedom"]);
        log.info(`CCode verified: ${vars["Ccode for freedom"]}`);

        await expect(bidRequestDetailsPage.Company_ValueBid_Request_Details).toContainText(vars["SelectedCompanyName"]);
        log.info(`Company Name verified: ${vars["SelectedCompanyName"]}`);

        vars["RequestIdDetails"] = await bidRequestDetailsPage.Request_Id_From_Details.textContent() || '';
        vars["RequestIdDetails"] = String(vars["RequestIdDetails"]).trim();
        log.info(`RequestIdDetails: ${vars["RequestIdDetails"]}`);

        vars["RequestIdCount"] = String(vars["RequestIdDetails"]).length.toString();
        log.info(`RequestIdCount: ${vars["RequestIdCount"]}`);
        expect(String(vars["RequestIdCount"])).toBe("12");

        if (await bidRequestDetailsPage.Statusbid_request_details.textContent().then(text => text?.includes("Ready for Pricing"))) {
          await expect(bidRequestDetailsPage.Statusbid_request_details).toContainText("Ready for Pricing");
          log.info('Bid status verified: Ready for Pricing');
        } else {
          await expect(bidRequestDetailsPage.Statusbid_request_details).toContainText("Processing Failed");
          log.info('Bid status verified: Processing Failed');
        }

        await expect(bidRequestDetailsPage.Expected_Execution_Type_Parsed_Row(vars["SelectedLockTerm"])).toBeVisible();
        log.info(`Execution Type verified: ${vars["SelectedLockTerm"]}`);

        vars["BidValueTableHeader"] = await bidRequestDetailsPage.Bid_Value_From_Table_Header1.textContent() || '';
        log.info(`BidValueTableHeader: ${vars["BidValueTableHeader"]}`);
        vars["ExpectedBidValueParsedRow"] = (parseFloat(String(vars["BidValueTableHeader"]).replace(/[$,]/g, '')) / parseFloat(String("1000"))).toFixed(2);
        //vars["ExpectedBidValueParsedRow"] = (parseFloat(String(vars["BidValueTableHeader"])) / parseFloat(String("1000"))).toFixed(2);
        log.info(`ExpectedBidValueParsedRow: ${vars["ExpectedBidValueParsedRow"]}`);
        await expect(bidRequestDetailsPage.Bid_Value_parsed_row).toContainText(vars["ExpectedBidValueParsedRow"]);

        vars["LoansTableHeader"] = await bidRequestDetailsPage.LoansDataTableHeader.textContent() || '';
        vars["LoansTableHeader"] = String(vars["LoansTableHeader"]).trim();
        log.info(`LoansTableHeader: ${vars["LoansTableHeader"]}`);

        vars["LoansDataParsedRow"] = await bidRequestDetailsPage.LoansDataParsedRow.textContent() || '';
        vars["LoansDataParsedRow"] = String(vars["LoansDataParsedRow"]).trim();
        log.info(`LoansDataParsedRow: ${vars["LoansDataParsedRow"]}`);
        expect(String(vars["LoansDataParsedRow"])).toBe(vars["LoansTableHeader"]);

        log.stepPass('Bid request details verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Verifying bid request details failed');
        throw e;
      }

      // ── Verify footer submission date ─────────────────────────────────────
      log.step('Verifying footer submission date');
      try {
        await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText(vars["CurrentESTDate"]);
        log.info(`Footer Submission Date contains CurrentESTDate: ${vars["CurrentESTDate"]}`);

        vars["CurrentEstPlusOneMin"] = (() => {
          const d = new Date('2000-01-01 ' + String(vars["CurrentEstTime"]));
          d.setMinutes(d.getMinutes() + parseInt(String("1")));
          return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
        })();
        log.info(`CurrentEstPlusOneMin: ${vars["CurrentEstPlusOneMin"]}`);

        vars["CurrentEstUnitAfterAddition"] = String(vars["CurrentEstPlusOneMin"]).substring(6);
        log.info(`CurrentEstUnitAfterAddition: ${vars["CurrentEstUnitAfterAddition"]}`);

        vars["CurrentEstHourMinAfterAddition"] = String(vars["CurrentEstPlusOneMin"]).substring(0, String(vars["CurrentEstPlusOneMin"]).length - 3);
        log.info(`CurrentEstHourMinAfterAddition: ${vars["CurrentEstHourMinAfterAddition"]}`);

        vars["CurrentEstTimeUnit"] = String(vars["CurrentEstTime"]).substring(6);
        log.info(`CurrentEstTimeUnit: ${vars["CurrentEstTimeUnit"]}`);

        vars["CurrentEstHourMin"] = String(vars["CurrentEstTime"]).substring(0, String(vars["CurrentEstTime"]).length - 3);
        log.info(`CurrentEstHourMin: ${vars["CurrentEstHourMin"]}`);

        //await bidRequestDetailsPage.Footer_Submission_Date.waitFor({ state: 'visible', timeout: 5000 });
        await bidRequestDetailsPage.Footer_Submission_Date.waitFor({ state: 'visible', timeout: 5000 });
        const footerText = await bidRequestDetailsPage.Footer_Submission_Date.textContent();
        log.info(`Footer Submission Date text: ${footerText}`);

        if (footerText?.includes(vars["CurrentEstHourMin"]))
          /* Verify that the element Footer Submission Date displays text */ {
          log.info(`Footer contains CurrentEstHourMin: ${vars["CurrentEstHourMin"]}, verifying CurrentEstTimeUnit`);
          await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText(vars["CurrentEstTimeUnit"]);
          log.info(`Footer Submission Date verified with CurrentEstTimeUnit: ${vars["CurrentEstTimeUnit"]}`);
        } else {
          log.info(`Footer does not contain CurrentEstHourMin, verifying with +1 min values`);
          await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText(vars["CurrentEstHourMinAfterAddition"]);
          await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText(vars["CurrentEstUnitAfterAddition"]);
          log.info(`Footer Submission Date verified with CurrentEstHourMinAfterAddition: ${vars["CurrentEstHourMinAfterAddition"]} and CurrentEstUnitAfterAddition: ${vars["CurrentEstUnitAfterAddition"]}`);
        }

        log.stepPass('Footer submission date verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Verifying footer submission date failed');
        throw e;
      }

      // ── Verify footer queued for date and batch time without buffer ────────
      log.step('Verifying footer queued for date and batch time without buffer');
      vars["FooterQueuedForDateText"] = await bidRequestDetailsPage.Footer_Queued_For_Date.textContent() || '';
      log.info(`Footer Queued For Date text: ${vars["FooterQueuedForDateText"]}`);
      try {
        await expect(bidRequestDetailsPage.Footer_Queued_For_Date).toContainText(vars["CurrentESTDate"]);
        log.info(`Footer Queued For Date contains CurrentESTDate: ${vars["CurrentESTDate"]}`);

        vars["SelectedBatchTimeWithoutBuffer"] = (() => {
          const d = new Date('2000-01-01 ' + String(vars["SelectedBatchTime"]));
          d.setMinutes(d.getMinutes() - parseInt(String(vars["BufferTime"])));
          return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        })();
        log.info(`SelectedBatchTimeWithoutBuffer: ${vars["SelectedBatchTimeWithoutBuffer"]}`);

        await expect(bidRequestDetailsPage.Footer_Queued_For_Date).toContainText(vars["SelectedBatchTimeWithoutBuffer"]);
        log.info(`Footer Queued For Date verified with SelectedBatchTimeWithoutBuffer: ${vars["SelectedBatchTimeWithoutBuffer"]}`);

        await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText("ET");
        log.info(`ET text verified for Footer_Queued_For_Date: ${vars["FooterQueuedForDateText"]}`);
        await expect(bidRequestDetailsPage.Footer_Queued_For_Date).toContainText("ET");
        log.info(`ET text verified for Footer_Queued_For_Date: ${vars["FooterQueuedForDateText"]}}`);
        log.info('Footer ET timezone verified for both Submission Date and Queued For Date');

        log.stepPass('Footer queued for date and batch time verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Verifying footer queued for date or batch time failed');
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