import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidRequestDetailsPage } from '../../pages/correspondant/bid-request-details';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { runPrereq_1406 } from './prereq-1406';

export async function runPrereq_1307(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1406(page, vars);

  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);



  await expect(correspondentPortalPage.CCode_Valuebid_request_details).toContainText(vars["CCodeBeforeResubmit"]);
  await expect(bidRequestDetailsPage.Company_ValueBid_Request_Details).toContainText(vars["CompanyBeforeResubmit"]);
  await expect(bidRequestDetailsPage.Request_Id_From_Details).not.toContainText(vars["RequestIDBeforeResubmit"]);
  await expect(bidRequestDetailsPage.Statusbid_request_details).toContainText("Ready for Pricing");
  await expect(bidRequestDetailsPage.Bid_Value_parsed_row).toContainText(vars["BidValueBeforeResubmit"]);
  await expect(bidRequestDetailsPage.Execution_Type_Parsed_Row).toContainText(vars["ExecutionBeforeResubmit"]);
  await expect(bidRequestDetailsPage.Parsed_Total_Loans).toContainText(vars["ParsedTotalLoansBeforeSubmit"]);
  await expect(bidRequestDetailsPage.Parsed_Success_Loans).toContainText(vars["ParsedSuccessLoansBeforeSubmit"]);
  await expect(bidRequestDetailsPage.Parsed_Errored_loans).toContainText(vars["ParsedErroredLoansBeforeSubmit"]);
  await expect(bidRequestDetailsPage.Execution_Type_from_Details_table1).toContainText(vars["ExecutionTypeHeaderBeforeSubmit"]);
  await expect(bidRequestDetailsPage.Bid_Value_From_Table_Header1).toContainText(vars["BidValueHeaderBeforeSubmit"]);
  await expect(bidRequestDetailsPage.Total_loans_TableHeader_1).toContainText(vars["TotalloansHeaderBeforeSubmit"]);
  await expect(bidRequestDetailsPage.Success_Loans_Header_1).toContainText(vars["SuccessLoansHeaderBeforeSubmit"]);
  await expect(bidRequestDetailsPage.Errored_Loans_Header1).toContainText(vars["ErrorredLoansHeaderBeforeSubmit"]);
  await stepGroups.stepGroup_Verifying_the_table_data_in_bid_request_details_from_tdp(page, vars);
}
