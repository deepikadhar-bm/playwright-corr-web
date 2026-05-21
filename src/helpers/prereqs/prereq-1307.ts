import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidRequestDetailsPage } from '../../pages/correspondant/bid-request-details';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { runPrereq_1406 } from './prereq-1406';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'PREREQ_1307(REG_TS22_TC04_02)';
const TC_TITLE = 'Perform the resubmit for pricing action for a bid with the Chase execution type, and validate all the values in the resubmitted record . (Target: Submit today, status :Expired)';

export async function runPrereq_1307(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1406(page, vars);

  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);


 log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Verify resubmitted bid request header fields match pre-resubmit values');
      try {
        await expect(correspondentPortalPage.CCode_Valuebid_request_details).toContainText(vars['CCodeBeforeResubmit']);
        await expect(bidRequestDetailsPage.Company_ValueBid_Request_Details).toContainText(vars['CompanyBeforeResubmit']);
        await expect(bidRequestDetailsPage.Request_Id_From_Details).not.toContainText(vars['RequestIDBeforeResubmit']);
        await expect(bidRequestDetailsPage.Statusbid_request_details).toContainText(appconstants.READY_FOR_PRICING_TEXT);
        await expect(bidRequestDetailsPage.Bid_Value_parsed_row).toContainText(vars['BidValueBeforeResubmit']);
        await expect(bidRequestDetailsPage.Execution_Type_Parsed_Row).toContainText(vars['ExecutionBeforeResubmit']);
        await expect(bidRequestDetailsPage.Parsed_Total_Loans).toContainText(vars['ParsedTotalLoansBeforeSubmit']);
        await expect(bidRequestDetailsPage.Parsed_Success_Loans).toContainText(vars['ParsedSuccessLoansBeforeSubmit']);
        await expect(bidRequestDetailsPage.Parsed_Errored_loans).toContainText(vars['ParsedErroredLoansBeforeSubmit']);
        log.info('CCodeBeforeResubmit: ' + vars['CCodeBeforeResubmit']);
        log.info('CompanyBeforeResubmit: ' + vars['CompanyBeforeResubmit']);
        log.info('RequestIDBeforeResubmit (should not match): ' + vars['RequestIDBeforeResubmit']);
        log.info('ExecutionBeforeResubmit: ' + vars['ExecutionBeforeResubmit']);
        log.stepPass('Resubmitted bid request header fields verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Resubmitted bid request header field verification failed');
        throw e;
      }

      log.step('Verify resubmitted bid request table header fields match pre-resubmit values');
      try {
        await expect(bidRequestDetailsPage.Execution_Type_from_Details_table1).toContainText(vars['ExecutionTypeHeaderBeforeSubmit']);
        await expect(bidRequestDetailsPage.Bid_Value_From_Table_Header1).toContainText(vars['BidValueHeaderBeforeSubmit']);
        await expect(bidRequestDetailsPage.Total_loans_TableHeader_1).toContainText(vars['TotalloansHeaderBeforeSubmit']);
        await expect(bidRequestDetailsPage.Success_Loans_Header_1).toContainText(vars['SuccessLoansHeaderBeforeSubmit']);
        await expect(bidRequestDetailsPage.Errored_Loans_Header1).toContainText(vars['ErrorredLoansHeaderBeforeSubmit']);
        log.info('ExecutionTypeHeaderBeforeSubmit: ' + vars['ExecutionTypeHeaderBeforeSubmit']);
        log.info('BidValueHeaderBeforeSubmit: ' + vars['BidValueHeaderBeforeSubmit']);
        log.info('TotalloansHeaderBeforeSubmit: ' + vars['TotalloansHeaderBeforeSubmit']);
        log.info('SuccessLoansHeaderBeforeSubmit: ' + vars['SuccessLoansHeaderBeforeSubmit']);
        log.info('ErrorredLoansHeaderBeforeSubmit: ' + vars['ErrorredLoansHeaderBeforeSubmit']);
        log.stepPass('Resubmitted bid request table header fields verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Resubmitted bid request table header field verification failed');
        throw e;
      }

      log.step('Verify table data in bid request details from test data profile');
      try {
        await stepGroups.stepGroup_Verifying_the_table_data_in_bid_request_details_from_tdp(page, vars);
        log.stepPass('Table data verified successfully against test data profile');
      } catch (e) {
        await log.stepFail(page, 'Table data verification failed against test data profile');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
}
