// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestListPage } from '../../../src/pages/correspondant/bid-request-list';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as excelHelper from '../../../src/helpers/excel-helpers';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestListPage: BidRequestListPage;
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestListPage = new BidRequestListPage(page);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS13_TC01_Create a bid request by selecting next business date and verify the uploaded should be current date, but the requested date should be the next buisness day\\\'s date. and also verify other', async ({ page }) => {
    const testData: Record<string, string> = {
  "Eligibility Check(Error Column)": "Minimum Loan Amount $5,000",
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
  "Ccode for freedom": "A4187",
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
    await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
    await stepGroups.stepGroup_Uploading_Bid_Request_For_Next_Buisiness_day(page, vars);
    if (true) /* Element Second Enabled Time is visible */ {
      await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
      // [DISABLED] Scroll to the element Enabled Date into view
      // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
      // [DISABLED] Click on Enabled Date
      // await bidRequestPage.Enabled_Time.click();
    } else {
      await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
      // [DISABLED] Modifying The Batch Intervals For Next bussiness day with one hour prior
      // await stepGroups.stepGroup_Modifying_The_Batch_Intervals_For_Next_bussiness_day_with_on(page, vars);
      await stepGroups.stepGroup_Modifying_Batch_Intervals_For_next_bussiness_day(page, vars);
      await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
      await stepGroups.stepGroup_Uploading_Bid_Request_For_Next_Buisiness_day(page, vars);
      await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
      // [DISABLED] Scroll to the element Enabled Date into view
      // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
      // [DISABLED] Click on Enabled Date
      // await bidRequestPage.Enabled_Time.click();
    }
    await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, 'test-data', "Eligibility_check.xlsx"));
    vars["LoanNumberFromExcel"] = excelHelper.readCell(path.resolve(__dirname, 'test-data', "Eligibility_check.xlsx,Eligibility_check.xlsx"), "2", "1");
    await expect(correspondentPortalPage.UploadBid_Button).toBeVisible();
    await correspondentPortalPage.UploadBid_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
    await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
    await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
    // [DISABLED] Store text from the element Errors Column into a variable ErrorColumnData
    // vars["ErrorColumnData"] = await bidRequestDetailsPage.Errors_Column.textContent() || '';
    if (true) /* Verify if Eligibility Check(Error Column) contains ErrorColu */ {
    } else {
      // [DISABLED] Mouseover the element Errors Column
      // await bidRequestDetailsPage.Errors_Column.hover();
      // [DISABLED] Verify that the current page displays an element Error Column Popup1 and With Scrollable TRUE
      // await expect(bidRequestDetailsPage.Error_Column_Popup1).toBeVisible();
      // [DISABLED] Verify that the element Error Column Popup1 displays text contains Eligibility Check(Error Column) and With Scrollable TRUE
      // await expect(bidRequestDetailsPage.Error_Column_Popup1).toContainText(testData["Eligibility Check(Error Column)"]);
    }
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["NextBusinessDate"] = await bidRequestPage.Qued_for_date_from_details.textContent() || '';
    vars["NextBusinessDate"] = String(vars["NextBusinessDate"]).substring(11);
    // [DISABLED] Split string NextBusinessDate using : and store the 1 into a NextBusinessDate
    // vars["NextBusinessDate"] = String('').split(":")["1"] || '';
    // [DISABLED] Add minute minutes to the input-datetime with input-datetime-format , convert to output-datetime-format format, and store it in a runtime variable variable-name
    // vars["variable-name"] = (() => {
    //   const d = new Date('2000-01-01 ' + String("input-datetime"));
    //   d.setMinutes(d.getMinutes() + parseInt(String("minute")));
    //   return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: output-datetime-format
    // })();
    vars["NextBusinessDate"] = String(vars["NextBusinessDate"]).replace(/ET/g, '');
    vars["NextBusinessDate"] = String(vars["NextBusinessDate"]).trim();
    vars[""] = (() => {
      const d = new Date(String(''));
      d.setMinutes(d.getMinutes() + parseInt(String('')));
      return d.toLocaleString('en-US');
    })();
    vars["NextBusinessDate"] = (() => {
      const d = new Date(String(vars["NextBusinessDate"]));
      const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
      return "MM/dd/yyyy".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
    })();
    vars["CCodeValuesFromDetails"] = await correspondentPortalPage.CCode_Valuebid_request_details.textContent() || '';
    vars["CompanyValueFromDetails"] = await bidRequestDetailsPage.Company_ValueBid_Request_Details.textContent() || '';
    vars["RequestIDDetails"] = await bidRequestDetailsPage.Request_Id_From_Details.textContent() || '';
    vars["RequestIDDetails"] = String(vars["RequestIDDetails"]).trim();
    vars["BidStatusFromDetails"] = await bidRequestDetailsPage.Statusbid_request_details.textContent() || '';
    vars["BidValueFromDetails"] = await bidRequestDetailsPage.Bid_Value_parsed_row.textContent() || '';
    vars["ExecutionTypeFromDetailsTable1"] = await bidRequestDetailsPage.Execution_Type_from_Details_table1.textContent() || '';
    vars["ExecutionTypeFromDetailsTable2"] = await bidRequestDetailsPage.Execution_Type_from_detailstable2.textContent() || '';
    vars["TotalLoansDetails"] = await bidRequestDetailsPage.Total_Loans_From_Details.textContent() || '';
    vars["ErroredLoansDetails"] = await bidRequestDetailsPage.Errored_Loans_From_Details.textContent() || '';
    await correspondentPortalPage.Bid_Requests_Side_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(bidRequestDetailsPage.Ccode_From_List).toContainText(vars["CCodeValuesFromDetails"]);
    await expect(bidRequestListPage.Request_Id_From_list).toContainText(vars["RequestIDDetails"]);
    await expect(bidRequestListPage.Company_Name_From_List).toContainText(vars["CompanyValueFromDetails"]);
    await expect(bidRequestDetailsPage.Bid_Value_From_list).toContainText(vars["BidValueFromDetails"]);
    vars["LoansErrorsCount"] = await bidRequestsPage.LoansErrorStatus_From_List.textContent() || '';
    vars["TotalLoansList"] = String(vars["LoansErrorsCount"]).split("/")["1"] || '';
    vars["ErroredLoanList"] = String(vars["LoansErrorsCount"]).split("/")["2"] || '';
    expect(String(vars["TotalLoansDetails"])).toBe(vars["TotalLoansList"]);
    expect(String(vars["ErroredLoansDetails"])).toBe(vars["ErroredLoanList"]);
    vars["ExecutionTypeList"] = await bidRequestListPage.Execution_type_from_List.textContent() || '';
    vars["ExecutionType1List"] = String(vars["ExecutionTypeList"]).split(",")["1"] || '';
    vars["ExecutionType2List"] = String(vars["ExecutionTypeList"]).split(",")["2"] || '';
    expect(String(vars["ExecutionTypeFromDetailsTable1"])).toBe(vars["ExecutionType1List"]);
    expect(String(vars["ExecutionTypeFromDetailsTable2"])).toBe(vars["ExecutionType2List"]);
    await expect(bidRequestListPage.BidStatus_From_List).toContainText(vars["BidStatusFromDetails"]);
    vars["TodaysDate"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
      const fmt = "MM/dd/yyyy";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    // [DISABLED] Getting Next Bussiness day by handling weekend
    // await stepGroups.stepGroup_Getting_Next_Bussiness_day_by_handling_weekend(page, vars);
    await expect(bidRequestListPage.Requested_date_from_List).toContainText(vars["NextBusinessDate"]);
    await expect(bidRequestListPage.Uploaded_date_from_list).toContainText(vars["TodaysDate"]);
  });
});
