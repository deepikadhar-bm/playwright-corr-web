import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidRequestDetailsPage } from '../../pages/correspondant/bid-request-details';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { StatusInactivePage } from '../../pages/correspondant/status-inactive-';
import { runPrereq_1319 } from './prereq-1319';

export async function runPrereq_1312(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1319(page, vars);

  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactivePage = new StatusInactivePage(page);



  await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
  vars["BufferTime"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
  await correspondentPortalPage.Bid_Requests_Side_Menu.click();
  await page.waitForLoadState('networkidle');
  await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["RequestIDDetails"]);
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  vars["StatusToBeSelected"] = "Price Offered";
  await expect(correspondentPortalPage.Status).toContainText(vars["StatusToBeSelected"]);
  await correspondentPortalPage.First_Bid_Request_ID.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  vars["CCodeBeforeResubmit"] = await correspondentPortalPage.CCode_Valuebid_request_details.textContent() || '';
  vars["CompanyBeforeResubmit"] = await bidRequestDetailsPage.Company_ValueBid_Request_Details.textContent() || '';
  vars["RequestIDBeforeResubmit"] = await bidRequestDetailsPage.Request_Id_From_Details.textContent() || '';
  vars["RequestIDBeforeResubmit"] = String(vars["RequestIDBeforeResubmit"]).trim();
  vars["StatusBeforeResubmit"] = await bidRequestDetailsPage.Statusbid_request_details.textContent() || '';
  vars["BidValueBeforeResubmit"] = await bidRequestDetailsPage.Bid_Value_parsed_row.textContent() || '';
  vars["ExecutionBeforeResubmit"] = await bidRequestDetailsPage.Execution_Type_Parsed_Row.textContent() || '';
  vars["ParsedTotalLoansBeforeSubmit"] = await bidRequestDetailsPage.Parsed_Total_Loans.textContent() || '';
  vars["ParsedSuccessLoansBeforeSubmit"] = await bidRequestDetailsPage.Parsed_Success_Loans.textContent() || '';
  vars["ParsedErroredLoansBeforeSubmit"] = await bidRequestDetailsPage.Parsed_Errored_loans.textContent() || '';
  vars["ExecutionTypeHeaderBeforeSubmitTable1"] = await bidRequestDetailsPage.Execution_Type_from_Details_table1.textContent() || '';
  vars["BidValueHeaderBeforeSubmitTable1"] = await bidRequestDetailsPage.Bid_Value_From_Table_Header1.textContent() || '';
  vars["TotalloansHeaderBeforeSubmitTable1"] = await bidRequestDetailsPage.Total_loans_TableHeader_1.textContent() || '';
  vars["SuccessLoansHeaderBeforeSubmitTable1"] = await bidRequestDetailsPage.Success_Loans_Header_1.textContent() || '';
  vars["ErrorredLoansHeaderBeforeSubmitTable1"] = await bidRequestDetailsPage.Errored_Loans_Header1.textContent() || '';
  vars["TotalRowsCount"] = String(await bidRequestDetailsPage.Rows_Count_Table_1.count());
  vars["RowsCount"] = "1";
  while (parseFloat(String(vars["RowsCount"])) <= parseFloat(String(vars["TotalRowsCount"]))) {
    vars["ColumnCount"] = "1";
    while (parseFloat(String(vars["ColumnCount"])) <= parseFloat(String("7"))) {
      await bidRequestDetailsPage.Bid_Request_Details_Text.click();
      vars["CellData"] = await bidRequestDetailsPage.Individual_Cell_Data.textContent() || '';
      for (let dataIdx = parseInt(vars["RowsCount"]); dataIdx <= parseInt(vars["RowsCount"]); dataIdx++) {
        if (String(vars["ColumnCount"]) === String("1")) {
          // Write to test data profile: "Loan Number" = vars["CellData"]
        } else if (String(vars["ColumnCount"]) === String("2")) {
          // Write to test data profile: "Last Name" = vars["CellData"]
        } else if (String(vars["ColumnCount"]) === String("3")) {
          // Write to test data profile: "LoanAmount" = vars["CellData"]
        } else if (String(vars["ColumnCount"]) === String("4")) {
          // Write to test data profile: "Program" = vars["CellData"]
        } else if (String(vars["ColumnCount"]) === String("5")) {
          // Write to test data profile: "Loan Status" = vars["CellData"]
        } else if (String(vars["ColumnCount"]) === String("6")) {
          if (String(vars["CellData"]).includes(String("+"))) {
            await bidRequestDetailsPage.Footer_Queued_For_Date.click();
            await bidRequestDetailsPage.Individual_Cell_Data.hover();
            vars["CellDataPopup"] = await bidRequestDetailsPage.Tool_Tip_Text.textContent() || '';
            vars["CellData"] = String(vars["CellDataPopup"]) + "," + String(vars["CellData"]);
          }
          // Write to test data profile: "Errors" = vars["CellData"]
        } else {
          // Write to test data profile: "Error Description" = vars["CellData"]
        }
        if (true) /* Element Individual PQ Button is enabled */ {
          // Write to test data profile: "PQ Status" = "PQ Enabled"
        } else {
          // Write to test data profile: "PQ Status" = "PQ Disabled"
        }
        if (true) /* Element Individual PS Button is enabled */ {
          // Write to test data profile: "PS Status" = "PS Enabled"
        } else {
          // Write to test data profile: "PS Status" = "PS Disabled"
        }
        vars["ColumnCount"] = (parseFloat(String("1")) + parseFloat(String(vars["ColumnCount"]))).toFixed(0);
      }
    }
    vars["RowsCount"] = (parseFloat(String("1")) + parseFloat(String(vars["RowsCount"]))).toFixed(0);
  }
  await bidRequestDetailsPage.First_loan_Number_In_table.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  vars["RequestIdPopupBeforeSubmitTable1"] = await bidRequestDetailsPage.Bid_Request_ID_On_Loan_Details_Popup.textContent() || '';
  vars["LoanNumberPopUpBeforeSubmitTable1"] = await bidRequestDetailsPage.Bid_Loan_Number_Loan_Details_Pop_up.textContent() || '';
  vars["ErrorsCheckPopupBeforeSubmitTable1"] = await bidRequestDetailsPage.Errors_Check_On_Laon_Details_Popup.textContent() || '';
  vars["ChaseFieldCountPopup"] = String(await bidRequestDetailsPage.ChaseFields_Count_Popup_Loan_Details.count());
  vars["count"] = "1";
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["ChaseFieldCountPopup"]))) {
    await bidRequestDetailsPage.Bid_Request_ID_On_Loan_Details_Popup.click();
    vars["ChaseFieldNameBeforeSubmit"] = await bidRequestDetailsPage.Individual_Chase_Field_Name_Popup.textContent() || '';
    vars["ChaseValuePopupBeforeSubmit"] = await bidRequestDetailsPage.Individual_Chase_Value_Popup.textContent() || '';
    if (String(vars["ChaseValuePopupBeforeSubmit"]) === String("Key_blank")) {
      vars["ChaseValuePopupBeforeSubmit"] = "Null";
    }
    for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseInt(vars["count"]); dataIdx++) {
      // Write to test data profile: "ChaseFieldNameBeforeSubmit" = vars["ChaseFieldNameBeforeSubmit"]
      // Write to test data profile: "ChaseValueBeforeSubmit" = vars["ChaseValuePopupBeforeSubmit"]
    }
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
}
