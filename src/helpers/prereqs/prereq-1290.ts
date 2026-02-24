import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { ApplyFiltersButtonPage } from '../../pages/correspondant/apply-filters-button';
import { BidRequestDetailsPage } from '../../pages/correspondant/bid-request-details';
import { BidRequestListPage } from '../../pages/correspondant/bid-request-list';
import { BidrequestPage } from '../../pages/correspondant/bidrequest';
import { BidRequestPage } from '../../pages/correspondant/bid-request';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { StatusInactivePage } from '../../pages/correspondant/status-inactive-';

export async function runPrereq_1290(page: Page, vars: Record<string, string>): Promise<void> {
  const applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const bidRequestListPage = new BidRequestListPage(page);
  const bidrequestPage = new BidrequestPage(page);
  const bidRequestPage = new BidRequestPage(page);
  const bidRequestsPage = new BidRequestsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactivePage = new StatusInactivePage(page);


  await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
  await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
  await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
  vars["BufferTime"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
  await correspondentPortalPage.Bid_Requests_Side_Menu.click();
  await page.waitForLoadState('networkidle');
  await priceOfferedPage.Filter_Dropdown1.click();
  await bidRequestsPage.Company_Dropdown_Input_field.click();
  await bidRequestListPage.Required_Company_Checkbox_filter.check();
  await correspondentPortalPage.Apply_Selected_1_button_in_Rule.click();
  vars["StatusToBeSelected"] = "Upload Expired";
  await correspondentPortalPage.Select_Bid_Request_Status_Dropdown1.click();
  await bidRequestPage.Status_checkbox_Filter.check();
  await expect(correspondentPortalPage.Apply_Selected_1_button_in_Rule).toBeVisible();
  await bidRequestDetailsPage.Apply_Selected_Button_2_filter.click();
  await applyFiltersButtonPage.Apply_Filters_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await expect(correspondentPortalPage.Status).toContainText(vars["StatusToBeSelected"]);
  vars["ExecutionType"] = "Standard";
  await stepGroups.stepGroup_Traversing_to_the_next_screens_until_the_bid_is_visible(page, vars);
  await bidrequestPage.Filtered_Status_BidRequest_ID.click();
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
  vars["ExecutionTypeHeaderBeforeSubmit"] = await bidRequestDetailsPage.Execution_Type_from_Details_table1.textContent() || '';
  vars["BidValueHeaderBeforeSubmit"] = await bidRequestDetailsPage.Bid_Value_From_Table_Header1.textContent() || '';
  vars["TotalloansHeaderBeforeSubmit"] = await bidRequestDetailsPage.Total_loans_TableHeader_1.textContent() || '';
  vars["SuccessLoansHeaderBeforeSubmit"] = await bidRequestDetailsPage.Success_Loans_Header_1.textContent() || '';
  vars["ErrorredLoansHeaderBeforeSubmit"] = await bidRequestDetailsPage.Errored_Loans_Header1.textContent() || '';
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
}
