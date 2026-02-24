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

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestCreationPage: BidRequestCreationPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestCreationPage = new BidRequestCreationPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test('REG_TS14_TC03_Verify the data present in bid detail screen by selecting both standard and chase execution type', async ({ page }) => {
    const testData: Record<string, string> = {
  "Ccode for freedom": "A4187",
  "Execution Type Header": "Exe.Type",
  "Resubmit Pricing Error Standard1": "( nmlsId = 2767 )",
  "Company Name.": "Wik1C BeuLD MoJbr CoEmy LLpoJ  - A2964",
  "BidMappingID": "Deepika Aug1",
  "Geo Coding Reducer flow(Errors Column)": "Geo Coding error",
  "Bid Valid File(Error Description)": "No Errors",
  "Company Name New": "American Pacific  - A4257",
  "Email Success Message": "Email sent successfuly",
  "Loan Field Validation(Number)": "Deepika_June_invaliddatafield",
  "Bid Valid File(Loan Status)": "Success",
  "Bid Request ID Header": "BidRequestID",
  "Resubmit Pricing Error Chase Direct": "Execution type 'Chase Direct' not permitted for client",
  "Geo Coding happy flow(Error Description)": "No Errors",
  "Bid Enum Check(Loan Status)": "Error",
  "Pos Check(Errors Column)": "No eligibility results",
  "Eligibility Check(LoanStatus)": "Error",
  "Geo Coding Reducer flow(Error Description))": "Geocode unknown",
  "Selected Company Count": "2",
  "Geo Coding happy flow(Loan Status)": "Success",
  "Geo Coding happy flow (Errors Column)": "No errors",
  "Resubmit Pricing Error Standard": "Execution type 'Standard' not permitted for client",
  "MissingHeaders_ErrorMessage1": "Bid tape is missing values for following headers: Loan Purpose.",
  "Price Offered": "Price Offered",
  "Geo Coding Failed flow(Errors))": "Geo Coding error",
  "MissingHeaders_ErrorMessage2": "Please verify the correct Map ID is selected or tape is formatted correctly.",
  "Geo Coding Reducer flow(Loan Status)": "Success",
  "Eligibility Check(Error Description)": "Minimum loan amount $5,000",
  "Stored_Text1": "10:10 AM",
  "Status Name": "Committed",
  "Bid Valid File(Error Column)": "No errors",
  "CompanyName3": "American Pacific - A4257",
  "Assigned Companies1": "Wik1C BeuLD MoJbr CoEmy LLpoJ",
  "SpecialCharacter_ErrorHeader": "EXTRA_SPACE_FOUND",
  "Geo Coding Failed flow(Loan Status)": "Error",
  "Pos Check(Loan Status)": "Error",
  "Loan Field Validation(Status)": "Error",
  "Eligibility Check(Error Column)": "Minimum Loan Amount $5,000",
  "Loan Field Validation(Error description)": "Loan value cannot be blank or zero for 'loan purpose'",
  "Last One Month": "Last One Month",
  "Resubmit Pricing Error Standard and Chase": "Execution type 'Standard' not permitted for client",
  "Reason For Cancellation": "To be Cancelled",
  "Reason For Deletion": "To be deleted",
  "Loan Field Validation(Error)": "Invalid Loan Data",
  "DeletingMessage for File": "You have selected to delete this file. Do you want to proceed?",
  "Resubmit Pricing Error Standard and Chase1": "( nmlsId = 2767 )",
  "Creating Batch Success Message": "Batch timing has been created successfull",
  "Bid Enum Check(Errors Column)": "Secondary Residence, Investment (NOO)]. Path: search.criteria.propertyUse is missing value",
  "Status Count 1": "3",
  "Display_Text1": "Delete Batch Time",
  "CompanyName(CustomerPermissions)": "Freedom - A4187",
  "New Company Name": "Home Sweet Mortgage",
  "CCode Header": "Ccode",
  "FileRow": "4",
  "SpecialCharacter_ErrorMessage": "Found extra space(s) in row 3 for 'Correspondent Loan Number'. Please modify and retry upload.",
  "Display_Text2": "Delete Batch",
  "Email Message Verification": "Do you want to resend Bid Offer email?",
  "BidMappingIDNew": "Default Map Internal",
  "Geo Coding Failed flow(Error Description)": "Geocode unknown, no eligibility results: cannot find zip detail information for : 09999",
  "Pos Check(Error Description)": "Not approved for [nonagency], no eligibility results",
  "MissingHeaders_ErrorHeader": "Missing Headers",
  "Search Field Company Name": "Wik1C",
  "DuplicateLoans_HeaderMessage": "Duplicate Loans",
  "Company Name": "Freedom - A4187",
  "Stored_Text": "09:19 AM",
  "Resubmit Pricing Error Chase Direct1": "( nmlsId = 2767 )",
  "DuplicateLoans_ErrorMessage": "Duplicate loan numbers contained in this file: Deepika_June_02_02, Deepika_June_02_04. Please remove these from the file and retry upload.",
  "Missing Headers(Error Message)": "Bid tape is missing values for following headers: Loan Purpose. Please verify the correct Map ID is selected or tape is formatted correctly.",
  "Bid Enum Check(Error Description)": "enum field occupancy type is missing value or value is not in valid list [primary residence, secondary residence, investment (noo)]. path: search.criteria.propertyuse is missing value"
}; // Profile: "Bid Requests", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
    // [DISABLED] Navigating to Bulk Batch Timing
    // await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
    // [DISABLED] Store the value displayed in the text box Pricing_Return_Time_Buffer field into a variable BufferTime
    // vars["BufferTime"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
    await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
    await stepGroups.stepGroup_Uploading_Bid_Request_By_Selecting_both_standard_and_chase_t(page, vars);
    // [DISABLED] Uploading Bid Request
    // await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
    if (true) /* Element Second Enabled Time is visible */ {
      await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
      // [DISABLED] Scroll to the element Enabled Time New into view
      // await bidRequestCreationPage.Enabled_Time_New.scrollIntoViewIfNeeded();
      // [DISABLED] Click on Enabled Time New
      // await bidRequestCreationPage.Enabled_Time_New.click();
    } else {
      await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
      await stepGroups.stepGroup_Modifying_Batch_Intervals_For_next_bussiness_day(page, vars);
      await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
      await stepGroups.stepGroup_Uploading_Bid_Request_By_Selecting_both_standard_and_chase_t(page, vars);
      await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
      // [DISABLED] Uploading Bid Request
      // await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
      // [DISABLED] Scroll to the element Enabled Date into view
      // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
      // [DISABLED] Click on Enabled Date
      // await bidRequestPage.Enabled_Time.click();
    }
    vars["CurrentESTDate"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
      const fmt = "MM/dd/yyyy";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    vars["CurrentEstTime"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
      const fmt = "hh:mm a";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    vars["CurrentEstHourMin"] = String(vars["CurrentEstTime"]).substring(0, String(vars["CurrentEstTime"]).length - 3);
    vars["CurrentEstTimeUnit"] = String(vars["CurrentEstTime"]).substring(6);
    await bidRequestDetailsPage.BidRequestedDate_Label.click();
    await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, 'test-data', "Bid_Valid_file.xlsx"));
    vars["LoanNumberFromExcel"] = excelHelper.readCell(path.resolve(__dirname, 'test-data', "Bid_Valid_file.xlsx,Bid_Valid_file.xlsx"), "2", "1");
    vars["SelectedCompanyName"] = await bidRequestCreationPage.Selected_Company_from_Dropdown.textContent() || '';
    vars["SelectedLockTermStandard"] = await correspondentPortalPage.StandardExceutionType_Dropdown.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    vars["SelectedLockTermChase"] = await bidRequestPage.Chase_Direct_DropdownUpload_Bidrequest.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    vars["SelectedBidMappingId"] = await chaseFieldNamePage.Bid_Mapping_ID_Dropdown.textContent() || '';
    vars["SelectedBatchTime"] = await correspondentPortalPage.Pricing_Return_Time.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    await expect(correspondentPortalPage.UploadBid_Button).toBeVisible();
    await correspondentPortalPage.UploadBid_Button.click();
    await bidRequestDetailsPage.Bid_Upload_Progress_Header.waitFor({ state: 'visible' });
    await expect(bidRequestDetailsPage.Bid_Upload_Progress_Header).toContainText("Bid Upload Progress");
    await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
    await expect(bidRequestPage.Continue_ButtonUpload_Pop_up).toBeVisible();
    await expect(bidRequestPage.Rows_above_Loan_Field_validation).toContainText("Success");
    await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
    await expect(bidRequestDetailsPage.Loan_Number_Column).toContainText(vars["LoanNumberFromExcel"]);
    await expect(correspondentPortalPage.CCode_Valuebid_request_details).toContainText(testData["Ccode for freedom"]);
    await expect(bidRequestDetailsPage.Company_ValueBid_Request_Details).toContainText(vars["SelectedCompanyName"]);
    vars["RequestIdDetails"] = await bidRequestDetailsPage.Request_Id_From_Details.textContent() || '';
    vars["RequestIdDetails"] = String(vars["RequestIdDetails"]).trim();
    vars[""] = String('').length.toString();
    expect(String(vars["RequestIdCount"])).toBe("12");
    if (true) /* Verify that the element Bid Status From Details displays tex */ {
    } else {
      await expect(bidRequestDetailsPage.Statusbid_request_details).toContainText("Processing Failed");
    }
    vars["ExecutionTypeDetails"] = await bidRequestDetailsPage.Execution_Type_Parsed_Row.textContent() || '';
    vars["ExecutionTypeDetails"] = String(vars["ExecutionTypeDetails"]).trim();
    vars["OnlyExecution1"] = String(vars["ExecutionTypeDetails"]).substring(0, String(vars["ExecutionTypeDetails"]).length - 11);
    expect(String(vars["OnlyExecution1"])).toBe("SF");
    vars["LocktermFromDetails1"] = String(vars["ExecutionTypeDetails"]).substring(3, String(vars["ExecutionTypeDetails"]).length - 8);
    expect(String(vars["LocktermFromDetails1"])).toBe(vars["SelectedLockTermStandard"]);
    vars["OnlyExecution2"] = String(vars["ExecutionTypeDetails"]).substring(7, String(vars["ExecutionTypeDetails"]).length - 4);
    expect(String(vars["OnlyExecution2"])).toBe("CD");
    vars["LocktermFromDetails2"] = String(vars["ExecutionTypeDetails"]).substring(10, String(vars["ExecutionTypeDetails"]).length - 1);
    expect(String(vars["LocktermFromDetails2"])).toBe(vars["SelectedLockTermChase"]);
    vars["BidValueTableHeader1"] = await bidRequestDetailsPage.Bid_Value_From_Table_Header1.textContent() || '';
    vars["BidValueTableHeader2"] = await bidRequestDetailsPage.Bid_Value_from_Table_Header_2.textContent() || '';
    vars["ExpectedParsedBidValue"] = (parseFloat(String(vars["BidValueTableHeader1"])) + parseFloat(String(vars["BidValueTableHeader2"]))).toFixed(0);
    vars["ExpectedParsedBidValue"] = (parseFloat(String(vars["ExpectedParsedBidValue"])) / parseFloat(String("1000000"))).toFixed(2);
    vars["TotalLoansHeader1"] = await bidRequestDetailsPage.Total_loans_TableHeader_1.textContent() || '';
    vars["TotalLoansHeader2"] = await bidRequestDetailsPage.Total_loans_Table_header_2.textContent() || '';
    vars["ExpectedParsedTotalLoans"] = (parseFloat(String(vars["TotalLoansHeader1"])) + parseFloat(String(vars["TotalLoansHeader2"]))).toFixed(0);
    vars["SuccessLoansHeader1"] = await bidRequestDetailsPage.Success_Loans_Header_1.textContent() || '';
    vars["SuccessLoansHeader2"] = await bidRequestDetailsPage.Success_Loans_Header_2.textContent() || '';
    vars["ExpectedParsedSuccessLoans"] = (parseFloat(String(vars["SuccessLoansHeader1"])) + parseFloat(String(vars["SuccessLoansHeader2"]))).toFixed(0);
    vars["ErroredLoansHeader1"] = await bidRequestDetailsPage.Errored_Loans_Header1.textContent() || '';
    vars["ErroredLoansHeader2"] = await bidRequestDetailsPage.Errored_Loans_Header_2.textContent() || '';
    vars["ExpectedParsedErroredLoans"] = (parseFloat(String(vars["ErroredLoansHeader1"])) + parseFloat(String(vars["ErroredLoansHeader2"]))).toFixed(0);
    await expect(bidRequestDetailsPage.Parsed_Total_Loans).toContainText(vars["ExpectedParsedTotalLoans"]);
    await expect(bidRequestDetailsPage.Parsed_Success_Loans).toContainText(vars["ExpectedParsedSuccessLoans"]);
    await expect(bidRequestDetailsPage.Parsed_Errored_loans).toContainText(vars["ExpectedParsedErroredLoans"]);
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
  });
});
