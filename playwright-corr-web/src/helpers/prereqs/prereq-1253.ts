import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../step-groups';
import { BidRequestCreationPage } from '../../pages/correspondant/bid-request-creation';
import { BidRequestDetailsPage } from '../../pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../pages/correspondant/bid-request';
import { ChaseFieldNamePage } from '../../pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { StatusInactivePage } from '../../pages/correspondant/status-inactive-';
import * as excelHelper from '../excel-helpers';

export async function runPrereq_1253(page: Page, vars: Record<string, string>): Promise<void> {
  const bidRequestCreationPage = new BidRequestCreationPage(page);
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const bidRequestPage = new BidRequestPage(page);
  const chaseFieldNamePage = new ChaseFieldNamePage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const statusInactivePage = new StatusInactivePage(page);


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
  await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
  vars["BufferTime"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
  await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
  await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
  if (true) /* Element Second Enabled Time is visible */ {
    await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
    // [DISABLED] Scroll to the element Enabled Time New into view
    // await bidRequestCreationPage.Enabled_Time_New.scrollIntoViewIfNeeded();
    // [DISABLED] Click on Enabled Time New
    // await bidRequestCreationPage.Enabled_Time_New.click();
  } else {
    await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
    await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
    // [DISABLED] Modifying The Batch Intervals For one Hour Prior.
    // await stepGroups.stepGroup_Modifying_The_Batch_Intervals_For_one_Hour_Prior(page, vars);
    await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
    await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
    await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
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
  await bidRequestDetailsPage.BidRequestedDate_Label.click();
  await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, 'test-data', "Bid_file_success_error_newfile.xlsx"));
  vars["LoanNumberFromExcel"] = excelHelper.readCell(path.resolve(__dirname, 'test-data', "Bid_file_success_error_newfile.xlsx,Bid_file_success_error_newfile.xlsx"), "2", "1");
  vars["SelectedCompanyName"] = await bidRequestCreationPage.Selected_Company_from_Dropdown.textContent() || '';
  vars["SelectedLockTerm"] = await correspondentPortalPage.StandardExceutionType_Dropdown.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
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
  await expect(bidRequestDetailsPage.Expected_Execution_Type_Parsed_Row).toBeVisible();
  vars["BidValueTableHeader"] = await bidRequestDetailsPage.Bid_Value_From_Table_Header1.textContent() || '';
  vars["ExpectedBidValueParsedRow"] = (parseFloat(String(vars["BidValueTableHeader"])) / parseFloat(String("1000"))).toFixed(2);
  await expect(bidRequestDetailsPage.Bid_Value_parsed_row).toContainText(vars["ExpectedBidValueParsedRow"]);
  vars["LoansTableHeader"] = await bidRequestDetailsPage.LoansDataTableHeader.textContent() || '';
  vars["LoansTableHeader"] = String(vars["LoansTableHeader"]).trim();
  vars["LoansDataParsedRow"] = await bidRequestDetailsPage.LoansDataParsedRow.textContent() || '';
  vars["LoansDataParsedRow"] = String(vars["LoansDataParsedRow"]).trim();
  expect(String(vars["LoansDataParsedRow"])).toBe(vars["LoansTableHeader"]);
  await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText(vars["CurrentESTDate"]);
  vars["CurrentEstPlusOneMin"] = (() => {
    const d = new Date('2000-01-01 ' + String(vars["CurrentEstTime"]));
    d.setMinutes(d.getMinutes() + parseInt(String("1")));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
  })();
  vars["CurrentEstUnitAfterAddition"] = String(vars["CurrentEstPlusOneMin"]).substring(6);
  vars["CurrentEstHourMinAfterAddition"] = String(vars["CurrentEstPlusOneMin"]).substring(0, String(vars["CurrentEstPlusOneMin"]).length - 3);
  vars["CurrentEstTimeUnit"] = String(vars["CurrentEstTime"]).substring(6);
  vars["CurrentEstHourMin"] = String(vars["CurrentEstTime"]).substring(0, String(vars["CurrentEstTime"]).length - 3);
  if (true) /* Verify that the element Footer Submission Date displays text */ {
    await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText(vars["CurrentEstTimeUnit"]);
  } else {
    await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText(vars["CurrentEstHourMinAfterAddition"]);
    await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText(vars["CurrentEstUnitAfterAddition"]);
  }
  await expect(bidRequestDetailsPage.Footer_Queued_For_Date).toContainText(vars["CurrentESTDate"]);
  vars[""] = (() => {
    const d = new Date('2000-01-01 ' + String(''));
    d.setMinutes(d.getMinutes() - parseInt(String('')));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  })();
  await expect(bidRequestDetailsPage.Footer_Queued_For_Date).toContainText(vars["SelectedBatchTimeWithoutBuffer"]);
  await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText("ET");
  await expect(bidRequestDetailsPage.Footer_Queued_For_Date).toContainText("ET");
}
