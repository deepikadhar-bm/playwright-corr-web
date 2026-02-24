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

  test('REG_TS12_TC01_Create a bid request by selecting today\\\'s date and verify the requested date and the uploaded data should be current date and also verify other fields.', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
    await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
    await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
    if (true) /* Element Second Enabled Time is visible */ {
      await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
      // [DISABLED] Scroll to the element Enabled Date into view
      // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
      // [DISABLED] Click on Enabled Date
      // await bidRequestPage.Enabled_Time.click();
    } else {
      await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
      await stepGroups.stepGroup_Modifying_batches_with_5_min_prior(page, vars);
      await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
      await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
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
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["CCodeValuesFromDetails"] = await correspondentPortalPage.CCode_Valuebid_request_details.textContent() || '';
    vars["CompanyValueFromDetails"] = await bidRequestDetailsPage.Company_ValueBid_Request_Details.textContent() || '';
    vars["RequestIDDetails"] = await bidRequestDetailsPage.Request_Id_From_Details.textContent() || '';
    vars["RequestIDDetails"] = String(vars["RequestIDDetails"]).trim();
    vars["BidStatusFromDetails"] = await bidRequestDetailsPage.Statusbid_request_details.textContent() || '';
    vars["BidValueFromDetails"] = await bidRequestDetailsPage.Bid_Value_parsed_row.textContent() || '';
    vars["ExecutionTypeFromDetails"] = await bidRequestDetailsPage.Execution_Type_From_Details.textContent() || '';
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
    expect(String(vars["ExecutionTypeFromDetails"])).toBe(vars["ExecutionTypeList"]);
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
    await expect(bidRequestListPage.Requested_date_from_List).toContainText(vars["TodaysDate"]);
    await expect(bidRequestListPage.Uploaded_date_from_list).toContainText(vars["TodaysDate"]);
  });
});
