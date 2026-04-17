// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestCreationPage } from '../../../src/pages/correspondant/bid-request-creation';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { readCellByColAndRowIndex } from '../../../src/helpers/excel-helpers';
import { SpinnerPage } from '@pages/correspondant';
import { testDataManager } from 'testdata/TestDataManager';
test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestCreationPage: BidRequestCreationPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestCreationPage = new BidRequestCreationPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS15_TC03_Upload a bid with both execution types standard and chase and verify the values present in the accordian table', async ({ page }) => {
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
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
    await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
    await stepGroups.stepGroup_Uploading_Bid_Request_By_Selecting_both_standard_and_chase_t(page, vars);
    // ── Check second enabled batch time visibility and select batch time ──
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
        log.info('Enabled Time is NOT visible, navigating to Bulk Batch Timing and modifying batches');
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        await stepGroups.stepGroup_Modifying_batches_with_5_min_prior(page, vars);
        await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);

        await stepGroups.stepGroup_Uploading_Bid_Request_By_Selecting_both_standard_and_chase_t(page, vars);

        await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
        // [DISABLED] Scroll to the element Enabled Date into view
        // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
        // [DISABLED] Click on Enabled Date
        // await bidRequestPage.Enabled_Time.click();
      }

      log.stepPass('Batch time visibility check and selection successful');
    } catch (e) {
      await log.stepFail(page, 'Batch time visibility check or selection failed');
      throw e;
    }
    vars["CurrentESTDate"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "America/New_York" };
      const fmt = "MM/dd/yyyy";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year || '').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2, '0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month || '0'))).replace(/d(?!d)/g, String(parseInt(p.day || '0'))).replace(/h(?!h)/g, String(parseInt(p.hour || '0')));
    })();
    vars["CurrentEstTime"] = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).format(new Date());

    vars["CurrentEstHourMin"] = String(vars["CurrentEstTime"]).substring(0, String(vars["CurrentEstTime"]).length - 3);
    vars["CurrentEstTimeUnit"] = String(vars["CurrentEstTime"]).substring(6);
    // ── Upload bid request file and verify upload progress ────────────────
    log.step('Uploading bid request file and verifying upload progress');
    try {
      await bidRequestDetailsPage.BidRequestedDate_Label.click();
      await correspondentPortalPage.Upload_File.setInputFiles(path.resolve(__dirname, '../../../uploads', "Bid_file_success_error (4).xlsx"));
      //vars["LoanNumberFromExcel"] = excelHelper.readCell(path.resolve(__dirname, 'test-data', "Bid_file_success_error.xlsx,Bid_file_success_error.xlsx"), "2", "1");
      vars["LoanNumberFromExcel"] = String(
        excelHelper.readCell({
          filePath: path.resolve(__dirname, '../../../uploads', "Bid_file_success_error (4).xlsx"),
          columnHeader: "Correspondent Loan Number",
          rowIndex: 0,

        }) ?? ''
      );
      log.info(`Loan Number from Excel: ${vars["LoanNumberFromExcel"]}`);
      await expect(correspondentPortalPage.UploadBid_Button).toBeVisible();
      await correspondentPortalPage.UploadBid_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await bidRequestDetailsPage.Bid_Upload_Progress_Header.waitFor({ state: 'visible' });
      await expect(bidRequestDetailsPage.Bid_Upload_Progress_Header).toContainText("Bid Upload Progress");
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
      await expect(bidRequestPage.Continue_ButtonUpload_Pop_up).toBeVisible();
      // await expect(bidRequestPage.Rows_above_Loan_Field_validation).toContainText("Success");
      const rows = await bidRequestPage.Rows_above_Loan_Field_validation.all();
      log.info(`Total rows above loan field validation: ${rows.length}`);

      for (const row of rows) {
        await expect(row).toContainText("Success");
        log.info(`Row validation successful: ${await row.textContent()}`);
      }
      await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await page.waitForLoadState('load');
      await page.waitForTimeout(5000);
      log.info('Bid file uploaded and upload progress verified successfully');

      log.stepPass('Bid request file upload and progress verification successful');
    } catch (e) {
      await log.stepFail(page, 'Bid request file upload or progress verification failed');
      throw e;
    }

    // ── Verify execution type and loan amount totals ───────────────────────
    log.step('Verifying execution type and computing loan amount totals from table rows');
    try {
      await expect(bidRequestDetailsPage.Execution_Type_from_Details_table1).toContainText(appconstants.StandardExecutionTableHeader);
      log.info(`Execution type verified: ${appconstants.StandardExecutionTableHeader}`);

      vars["TotalLoanAmountsCountTable1"] = String(await bidRequestDetailsPage.Total_Loan_Amount_Count_Table1.count());
      log.info(`Total Loan Amounts Count in Table 1: ${vars["TotalLoanAmountsCountTable1"]}`);

      vars["count"] = "1";
      vars["TotalLoanAmountFromRows"] = "0";
      // while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalLoanAmountsCountTable1"]))) {
      //   vars["IndividualLoanAmount"] = await bidRequestDetailsPage.Individual_Loan_Amount(vars["count"]).textContent() || '';
      //   log.info(`Loan Amount from row ${vars["count"]}: ${vars["IndividualLoanAmount"]}`);
      //   vars["TotalLoanAmountFromRows"] = (parseFloat(String(vars["IndividualLoanAmount"])) + parseFloat(String(vars["TotalLoanAmountFromRows"]))).toFixed(0);

      //   log.info(`Total Loan Amount from row ${vars["count"]}: ${vars["TotalLoanAmountFromRows"]}`);
      //   vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
      // }
      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalLoanAmountsCountTable1"]))) {
        vars["IndividualLoanAmount"] = await bidRequestDetailsPage.Individual_Loan_Amount(vars["count"]).textContent() || '';
        log.info(`Loan Amount from row ${vars["count"]}: ${vars["IndividualLoanAmount"]}`);

        // Strip "$" and "," before parsing to avoid NaN
        const cleanedAmount = String(vars["IndividualLoanAmount"]).trim().replace(/\$|,/g, '');

        vars["TotalLoanAmountFromRows"] = (parseFloat(cleanedAmount) + parseFloat(String(vars["TotalLoanAmountFromRows"]))).toFixed(0);
        log.info(`Total Loan Amount from row ${vars["count"]}: ${vars["TotalLoanAmountFromRows"]}`);
        vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
      }
      log.info(`Total Loan Amount computed from rows: ${vars["TotalLoanAmountFromRows"]}`);

      vars["BidValueFromTableHeader1"] = await bidRequestDetailsPage.Bid_Value_From_Table_Header1.first().textContent() || '';
      vars["amount1"] = String(vars["BidValueFromTableHeader1"]).split(",")["0"] || '';
      vars["amount2"] = String(vars["BidValueFromTableHeader1"]).split(",")["1"] || '';
      vars["BidValueFromTableHeader1"] = String(vars["amount1"]) + String(vars["amount2"]);
      vars["TotalLoanAmountFromRows"] = String("$") + String(vars["TotalLoanAmountFromRows"]);
      log.info(`Bid Value from Table Header 1: ${vars["BidValueFromTableHeader1"]}, Total Loan Amount from Rows: ${vars["TotalLoanAmountFromRows"]}`);
      expect(String(vars["BidValueFromTableHeader1"])).toBe(vars["TotalLoanAmountFromRows"]);

      log.stepPass('Execution type and loan amount totals verification successful');
    } catch (e) {
      await log.stepFail(page, 'Execution type or loan amount totals verification failed');
      throw e;
    }

    // ── Verify loans count (total, success, errored) in table header ───────
    log.step('Verifying total, success, and errored loans count in table header');
    try {
      vars["TotalLoansCountRows"] = String(await bidRequestDetailsPage.Total_Loans_Count_From_Rows_table_1.count());
      log.info(`Total Loans Count from Rows: ${vars["TotalLoansCountRows"]}`);

      if (await bidRequestDetailsPage.Success_Loans_Header_1.isVisible()) /* Element Success Loans Header 1 is visible */ {
        vars["SuccessLoansCountRows"] = String(await bidRequestDetailsPage.Success_Loans_Count_From_Rows_table1.count());
        log.info(`Success Loans Count from Rows: ${vars["SuccessLoansCountRows"]}`);
      } else {
        vars["SuccessLoansCountRows"] = "0";
        log.info('Success Loans Header not visible, setting count to 0');
      }
      if (await bidRequestDetailsPage.Errored_Loans_Header1.first().isVisible()) /* Element Errored Loans Count from Rows is visible */ {
        vars["ErroredLoansCountRows"] = String(await bidRequestDetailsPage.Errored_Loans_Count_from_Rows_table_1.count());
        log.info(`Errored Loans Count from Rows: ${vars["ErroredLoansCountRows"]}`);
      } else {
        vars["ErroredLoansCountRows"] = "0";
        log.info('Errored Loans Header not visible, setting count to 0');
      }
      await expect(bidRequestDetailsPage.Total_loans_TableHeader_1).toContainText(vars["TotalLoansCountRows"]);
      await expect(bidRequestDetailsPage.Success_Loans_Header_1).toContainText(vars["SuccessLoansCountRows"]);
      await expect(bidRequestDetailsPage.Errored_Loans_Header1).toContainText(vars["ErroredLoansCountRows"]);
      log.info('Total, Success, and Errored loans count assertions passed');

      log.stepPass('Total, success, and errored loans count verification in table header successful');
    } catch (e) {
      await log.stepFail(page, 'Total, success, or errored loans count verification failed');
      throw e;
    }

    // ── Verify column data from Excel matches table data ──────────────────
    log.step('Verifying column data from Excel matches table data');
    try {
      vars["TotalColumnCountExcel"] = String(excelHelper.getColumnCount(path.resolve(__dirname, '../../../uploads', "Bid_file_success_error (4).xlsx"), "0"));
      log.info(`Total Column Count from Excel: ${vars["TotalColumnCountExcel"]}`);

      vars["count"] = "1";
      vars["ColumnCountExcel"] = "0";
      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalColumnCountExcel"]))) {
        //vars["ColumnHeaderExcel"] = excelHelper.readCell(path.resolve(__dirname, 'test-data', "Bid_file_success_error.xlsx,Bid_file_success_error.xlsx"), "1", vars["ColumnCountExcel"]);
        vars["ColumnHeaderExcel"] = readCellByColAndRowIndex(path.resolve(__dirname, '../../../uploads', "Bid_file_success_error (4).xlsx"), 0, 0, vars["ColumnCountExcel"]);
        log.info(`Column Header from Excel at index ${vars["ColumnCountExcel"]}: ${vars["ColumnHeaderExcel"]}`);

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
          log.info(`Mapped Excel column "${vars["ColumnHeaderExcel"]}" to UI column header "${vars["ColumnHeaderUI"]}"`);

          vars["RowsCountTable"] = String(await bidRequestDetailsPage.Rows_Count_Table_1.count());
          log.info(`Rows count in table for column "${vars["ColumnHeaderUI"]}": ${vars["RowsCountTable"]}`);

          vars["RowCountExcel"] = "1";
          while (parseFloat(String(vars["RowsCountTable"])) >= parseFloat(String("1"))) {
            vars["CellDataTable"] = await bidRequestDetailsPage.Individual_Cell_Data_Table(vars["ColumnHeaderUI"], vars["RowsCountTable"]).textContent() || '';
            vars["CellDataExcel"] = excelHelper.readCellByColAndRowIndex(path.resolve(__dirname, '../../../uploads', "Bid_file_success_error (4).xlsx"), 0, vars["RowCountExcel"], vars["ColumnCountExcel"]);
            if (String(vars["ColumnHeaderUI"]) === String("Loan Amount")) {
              vars["CellDataExcel"] = parseFloat(String(vars["CellDataExcel"])).toFixed(0);
              vars["CellDataTable"] = String(vars["CellDataTable"]).trim();
              vars["amount1"] = String(vars["CellDataTable"]).split(",")["0"] || '';
              vars["amount2"] = String(vars["CellDataTable"]).split(",")["1"] || '';
              vars["CellDataTable"] = String(vars["amount1"]) + String(vars["amount2"]);
              vars["CellDataExcel"] = String("$") + String(vars["CellDataExcel"]);
              log.info(`Loan Amount - Excel: ${vars["CellDataExcel"]}, Table: ${vars["CellDataTable"]}`);
              expect(String(vars["CellDataExcel"])).toBe(vars["CellDataTable"]);
            } else {
              log.info(`Column "${vars["ColumnHeaderUI"]}" Row ${vars["RowCountExcel"]} - Excel: ${vars["CellDataExcel"]}, Table: ${vars["CellDataTable"]}`);
              expect(String(vars["CellDataTable"])).toContain(vars["CellDataExcel"]);
            }
            vars["RowCountExcel"] = (parseFloat(String("1")) + parseFloat(String(vars["RowCountExcel"]))).toFixed(0);
            vars["RowsCountTable"] = (parseFloat(String(vars["RowsCountTable"])) - parseFloat(String("1"))).toFixed(0);
          }
        }
        vars["ColumnCountExcel"] = (parseFloat(String("1")) + parseFloat(String(vars["ColumnCountExcel"]))).toFixed(0);
        if (String(vars["ColumnHeaderExcel"]).includes(String("Product Code"))) {
          log.info('Reached "Product Code" column, breaking column iteration loop');
          break;
        }
      }

      log.stepPass('Column data from Excel matches table data verification successful');
    } catch (e) {
      await log.stepFail(page, 'Column data from Excel vs table data verification failed');
      throw e;
    }

    //  vars["TotalColumnCountExcel"] = String(excelHelper.getColumnCount("Bid_file_success_error.xlsx,Bid_file_success_error.xlsx", "0"));
    //   vars["count"] = "1";
    //   vars["ColumnCountExcel"] = "1";
    //   while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalColumnCountExcel"]))) {
    //     await bidRequestDetailsPage.Bid_Request_Details_Text.click();
    //     vars["ColumnHeaderExcel"] = excelHelper.readCell(path.resolve(__dirname, 'test-data', "Bid_file_success_error.xlsx,Bid_file_success_error.xlsx"), "1", vars["ColumnCountExcel"]);
    //     if (String("Correspondent Loan Number , Borrower Last Name , Original Loan Amount , Product Code").includes(String(vars["ColumnHeaderExcel"]))) {
    //       if (String(vars["ColumnHeaderExcel"]).includes(String("Correspondent Loan Number"))) {
    //         vars["ColumnHeaderUI"] = "Corr. Loan#";
    //       } else if (String(vars["ColumnHeaderExcel"]).includes(String("Borrower Last Name"))) {
    //         vars["ColumnHeaderUI"] = "Last Name";
    //       } else if (String(vars["ColumnHeaderExcel"]).includes(String("Original Loan Amount"))) {
    //         vars["ColumnHeaderUI"] = "Loan Amount";
    //       } else {
    //         vars["ColumnHeaderUI"] = "Program";
    //       }
    //       vars["RowsCountTable"] = String(await bidRequestDetailsPage.Rows_Count_Table_1.count());
    //       vars["RowCountExcel"] = "2";
    //       while (parseFloat(String(vars["RowsCountTable"])) >= parseFloat(String("1"))) {
    //         await bidRequestDetailsPage.Bid_Request_Details_Text.click();
    //         vars["CellDataTable"] = await bidRequestDetailsPage.Individual_Cell_Data_Table.textContent() || '';
    //         vars["CellDataExcel"] = excelHelper.readCell(path.resolve(__dirname, 'test-data', "Bid_file_success_error.xlsx,Bid_file_success_error.xlsx"), vars["RowCountExcel"], vars["ColumnCountExcel"]);
    //         if (String(vars["ColumnHeaderUI"]) === String("Loan Amount")) {
    //           vars["CellDataExcel"] = parseFloat(String(vars["CellDataExcel"])).toFixed(0);
    //           vars["CellDataTable"] = String(vars["CellDataTable"]).trim();
    //           vars["amount1"] = String(vars["CellDataTable"]).split(",")["1"] || '';
    //           vars["amount2"] = String(vars["CellDataTable"]).split(",")["2"] || '';
    //           vars["CellDataTable"] = String(vars["amount1"]) + String(vars["amount2"]);
    //           vars["CellDataExcel"] = String("$") + String(vars["CellDataExcel"]);
    //           expect(String(vars["CellDataTable"])).toBe(vars["CellDataExcel"]);
    //         } else {
    //           expect(String(vars["CellDataTable"])).toBe(vars["CellDataExcel"]);
    //         }
    //         vars["RowCountExcel"] = (parseFloat(String("1")) + parseFloat(String(vars["RowCountExcel"]))).toFixed(0);
    //         vars["RowsCountTable"] = (parseFloat(String(vars["RowsCountTable"])) - parseFloat(String("1"))).toFixed(0);
    //       }
    //     }
    //     vars["ColumnCountExcel"] = (parseFloat(String("1")) + parseFloat(String(vars["ColumnCountExcel"]))).toFixed(0);
    //     if (String(vars["ColumnHeaderExcel"]).includes(String("Product Code"))) {
    //       break;
    //     }
    //}
    await bidRequestDetailsPage.Bid_Request_Details_Text.click();
    await stepGroups.stepGroup_Verifying_the_second_accordian_table_from_excel_to_UI_In_bid(page, vars);
  });
});
