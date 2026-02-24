// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestConfigPage } from '../../../src/pages/correspondant/bid-request-config';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestConfigPage: BidRequestConfigPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestConfigPage = new BidRequestConfigPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS09_TC07_Bid Request - Making Changes in the POS Validation, and Verifying the details, by Uploading the Bid in the Bid request.  ', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestPage.Bid_Request_Config_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["PosConventionalTextBeforeEdit"] = await correspondentPortalPage.POS_Validation_Delegated_Conventional_Mandatory.inputValue() || '';
    vars["PosConventionalTextBeforeEdit"] = String(vars["PosConventionalTextBeforeEdit"]).trim();
    vars["UpdatedText"] = "Delegated Conventional Mandatory Testing";
    await correspondentPortalPage.POS_Validation_Delegated_Conventional_Mandatory.fill(String(vars["UpdatedText"]));
    await correspondentPortalPage.Save_Changes_Button.waitFor({ state: 'visible' });
    await bidRequestConfigPage.Save_Changes_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
    await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
    await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
    await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
    await stepGroups.stepGroup_Upload_Bid_Process_from_Batch_time_Selection_to_Bid_Upload_P(page, vars);
    vars["RowsCount"] = String(await bidRequestDetailsPage.Rows_Count_Table_1.count());
    await bidRequestDetailsPage.First_error_data.hover();
    vars["ConventionalErrorCount"] = String(await bidRequestDetailsPage.Not_Approved_for_Conventional_Error_Description.count());
    expect(String(vars["RowsCount"])).toBe(vars["ConventionalErrorCount"]);
    await stepGroups.stepGroup_Navigating_To_Bid_Request_Config(page, vars);
    await correspondentPortalPage.POS_Validation_Delegated_Conventional_Mandatory.fill(String(vars["PosConventionalTextBeforeEdit"]));
    await bidRequestConfigPage.Save_Changes_Button.waitFor({ state: 'visible' });
    await bidRequestConfigPage.Save_Changes_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortalPage.POS_Validation_Delegated_Conventional_Mandatory).toHaveValue(vars["PosConventionalTextBeforeEdit"]);
  });
});
