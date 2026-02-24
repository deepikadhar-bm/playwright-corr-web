// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestCreationPage } from '../../../src/pages/correspondant/bid-request-creation';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import * as excelHelper from '../../../src/helpers/excel-helpers';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestCreationPage: BidRequestCreationPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestCreationPage = new BidRequestCreationPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
  });

  test('REG_TS15_TC01_Upload a bid with execution type as standard and verify the values present in the accordian table', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
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
      await stepGroups.stepGroup_Modifying_batches_with_5_min_prior(page, vars);
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
    vars["CurrentEstHourMin"] = String(vars["CurrentEstTime"]).substring(0, String(vars["CurrentEstTime"]).length - 3);
    vars["CurrentEstTimeUnit"] = String(vars["CurrentEstTime"]).substring(6);
    await bidRequestDetailsPage.BidRequestedDate_Label.click();
    await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, 'test-data', "Bid_file_success_error.xlsx"));
    vars["LoanNumberFromExcel"] = excelHelper.readCell(path.resolve(__dirname, 'test-data', "Bid_file_success_error.xlsx,Bid_file_success_error.xlsx"), "2", "1");
    await expect(correspondentPortalPage.UploadBid_Button).toBeVisible();
    await correspondentPortalPage.UploadBid_Button.click();
    await bidRequestDetailsPage.Bid_Upload_Progress_Header.waitFor({ state: 'visible' });
    await expect(bidRequestDetailsPage.Bid_Upload_Progress_Header).toContainText("Bid Upload Progress");
    await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
    await expect(bidRequestPage.Continue_ButtonUpload_Pop_up).toBeVisible();
    await expect(bidRequestPage.Rows_above_Loan_Field_validation).toContainText("Success");
    await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
    await expect(bidRequestDetailsPage.Execution_Type_from_Details_table1).toContainText("Standard Flow Loans");
    vars["TotalLoanAmountsCountTable1"] = String(await bidRequestDetailsPage.Total_Loan_Amount_Count_Table1.count());
    vars["count"] = "1";
    vars["TotalLoanAmountFromRows"] = "0";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalLoanAmountsCountTable1"]))) {
      vars["IndividualLoanAmount"] = await bidRequestDetailsPage.Individual_Loan_Amount.textContent() || '';
      vars["TotalLoanAmountFromRows"] = (parseFloat(String(vars["IndividualLoanAmount"])) + parseFloat(String(vars["TotalLoanAmountFromRows"]))).toFixed(0);
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    vars["BidValueFromTableHeader1"] = await bidRequestDetailsPage.Bid_Value_From_Table_Header1.textContent() || '';
    vars["amount1"] = String(vars["BidValueFromTableHeader1"]).split(",")["1"] || '';
    vars["amount2"] = String(vars["BidValueFromTableHeader1"]).split(",")["2"] || '';
    vars["BidValueFromTableHeader1"] = String(vars["amount1"]) + String(vars["amount2"]);
    vars["TotalLoanAmountFromRows"] = String("$") + String(vars["TotalLoanAmountFromRows"]);
    expect(String(vars["BidValueFromTableHeader1"])).toBe(vars["TotalLoanAmountFromRows"]);
    vars["TotalLoansCountRows"] = String(await bidRequestDetailsPage.Total_Loans_Count_From_Rows_table_1.count());
    if (true) /* Element Success Loans Header 1 is visible */ {
      vars["SuccessLoansCountRows"] = String(await bidRequestDetailsPage.Success_Loans_Count_From_Rows_table1.count());
    } else {
      vars["SuccessLoansCountRows"] = "0";
    }
    if (true) /* Element Errored Loans Count from Rows is visible */ {
      vars["ErroredLoansCountRows"] = String(await bidRequestDetailsPage.Errored_Loans_Count_from_Rows_table_1.count());
    } else {
      vars["ErroredLoansCountRows"] = "0";
    }
    await expect(bidRequestDetailsPage.Total_loans_TableHeader_1).toContainText(vars["TotalLoansCountRows"]);
    await expect(bidRequestDetailsPage.Success_Loans_Header_1).toContainText(vars["SuccessLoansCountRows"]);
    await expect(bidRequestDetailsPage.Errored_Loans_Header1).toContainText(vars["ErroredLoansCountRows"]);
    vars["TotalColumnCountExcel"] = String(excelHelper.getColumnCount("Bid_file_success_error.xlsx,Bid_file_success_error.xlsx", "0"));
    vars["count"] = "1";
    vars["ColumnCountExcel"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalColumnCountExcel"]))) {
      vars["ColumnHeaderExcel"] = excelHelper.readCell(path.resolve(__dirname, 'test-data', "Bid_file_success_error.xlsx,Bid_file_success_error.xlsx"), "1", vars["ColumnCountExcel"]);
      if (String("Correspondent Loan Number , Borrower Last Name , Original Loan Amount , Product Code").includes(String(vars["ColumnHeaderExcel"]))) {
        await bidRequestDetailsPage.Bid_Request_Details_Text.click();
        if (String(vars["ColumnHeaderExcel"]).includes(String("Correspondent Loan Number"))) {
          vars["ColumnHeaderUI"] = "Corr. Loan#";
        } else if (String(vars["ColumnHeaderExcel"]).includes(String("Borrower Last Name"))) {
          vars["ColumnHeaderUI"] = "Last Name";
        } else if (String(vars["ColumnHeaderExcel"]).includes(String("Original Loan Amount"))) {
          vars["ColumnHeaderUI"] = "Loan Amount";
        } else {
          vars["ColumnHeaderUI"] = "Program";
        }
        vars["RowsCountTable"] = String(await bidRequestDetailsPage.Rows_Count_Table_1.count());
        vars["RowCountExcel"] = "2";
        while (parseFloat(String(vars["RowsCountTable"])) >= parseFloat(String("1"))) {
          vars["CellDataTable"] = await bidRequestDetailsPage.Individual_Cell_Data_Table.textContent() || '';
          vars["CellDataExcel"] = excelHelper.readCell(path.resolve(__dirname, 'test-data', "Bid_file_success_error.xlsx,Bid_file_success_error.xlsx"), vars["RowCountExcel"], vars["ColumnCountExcel"]);
          if (String(vars["ColumnHeaderUI"]) === String("Loan Amount")) {
            vars["CellDataExcel"] = parseFloat(String(vars["CellDataExcel"])).toFixed(0);
            vars["CellDataTable"] = String(vars["CellDataTable"]).trim();
            vars["amount1"] = String(vars["CellDataTable"]).split(",")["1"] || '';
            vars["amount2"] = String(vars["CellDataTable"]).split(",")["2"] || '';
            vars["CellDataTable"] = String(vars["amount1"]) + String(vars["amount2"]);
            vars["CellDataExcel"] = String("$") + String(vars["CellDataExcel"]);
            expect(String(vars["CellDataExcel"])).toBe(vars["CellDataTable"]);
          } else {
            expect(String(vars["CellDataTable"])).toBe(vars["CellDataExcel"]);
          }
          vars["RowCountExcel"] = (parseFloat(String("1")) + parseFloat(String(vars["RowCountExcel"]))).toFixed(0);
          vars["RowsCountTable"] = (parseFloat(String(vars["RowsCountTable"])) - parseFloat(String("1"))).toFixed(0);
        }
      }
      vars["ColumnCountExcel"] = (parseFloat(String("1")) + parseFloat(String(vars["ColumnCountExcel"]))).toFixed(0);
      if (String(vars["ColumnHeaderExcel"]).includes(String("Product Code"))) {
        break;
      }
    }
  });
});
