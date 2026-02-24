// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestConfigPage } from '../../../src/pages/correspondant/bid-request-config';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_General Settings', () => {
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

  test('REG_TS09_TC03_Bid Request - Add POS Validation, the Validation is for Checking the Bid Uploaded, and for the Verification)', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestPage.Bid_Request_Config_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Add_POS_Validation_Button.click();
    await expect(bidRequestConfigPage.Newly_Added_Inputpos).toBeVisible();
    await bidRequestConfigPage.Newly_Added_Dropdown_InputPOS.selectOption({ label: "Choice" });
    await expect(bidRequestConfigPage.Newly_Added_Dropdown_InputPOS).toHaveValue("Choice");
    await bidRequestConfigPage.Newly_Added_Inputpos.fill("Text");
    await bidRequestConfigPage.Delete_Button_pos.click();
    await expect(bidRequestConfigPage.Newly_Added_Dropdown_InputPOS).toBeVisible();
    // [DISABLED] Select option using value Choice in the Conventional Dropdown(Bid Request Config) list
    // await correspondentPortalPage.Pricing_Return_Time.selectOption({ label: "Choice" });
    // [DISABLED] Verify that the Conventional Dropdown(Bid Request Config) list has option with value Choice selected and With Scrollable FALSE
    // await expect(correspondentPortalPage.Pricing_Return_Time).toHaveValue("Choice");
    // [DISABLED] Wait until the element Save Changes Button is enabled
    // await correspondentPortalPage.Save_Changes_Button.waitFor({ state: 'visible' });
    // [DISABLED] Click on Save Changes Button
    // await bidRequestConfigPage.Save_Changes_Button.click();
    // [DISABLED] Wait until the element Spinner is not visible
    // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    // [DISABLED] Navigating to Bulk Batch Timing
    // await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
    // [DISABLED] Modifying The batch Intervals with current est time
    // await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
    // [DISABLED] Navigating to Upload New Bid Request
    // await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
    // [DISABLED] Uploading Bid Request
    // await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
    // [DISABLED] Upload Bid Request from batch time selection to continue button
    // await stepGroups.stepGroup_Upload_Bid_Request_from_batch_time_selection_to_continue_but(page, vars);
    // [DISABLED] Store the count of elements identified by locator Rows Count Table 1 into a variable RowsCount
    // vars["RowsCount"] = String(await bidRequestDetailsPage.Rows_Count_Table_1.count());
    // [DISABLED] Mouseover the element First error data
    // await bidRequestDetailsPage.First_error_data.hover();
    // [DISABLED] Store the count of elements identified by locator Not Approved for Conventional Error Data into a variable ConventionalErrorCount
    // vars["ConventionalErrorCount"] = String(await bidRequestDetailsPage.Not_Approved_for_Conventional_Error_Description.count());
    // [DISABLED] Verify if RowsCount == ConventionalErrorCount
    // expect(String(vars["RowsCount"])).toBe(vars["ConventionalErrorCount"]);
    // [DISABLED] Navigating To Bid Request Config
    // await stepGroups.stepGroup_Navigating_To_Bid_Request_Config(page, vars);
    // [DISABLED] Select option using value Conventional in the Conventional Dropdown(Bid Request Config) list
    // await correspondentPortalPage.Pricing_Return_Time.selectOption({ label: "Conventional" });
    // [DISABLED] Wait until the element Save Changes Button is enabled
    // await bidRequestConfigPage.Save_Changes_Button.waitFor({ state: 'visible' });
    // [DISABLED] Click on Save Changes Button
    // await bidRequestConfigPage.Save_Changes_Button.click();
    // [DISABLED] Wait until the element Spinner is not visible
    // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    // [DISABLED] Verify that the Conventional Dropdown(Bid Request Config) list has option with value Conventional selected and With Scrollable FALSE
    // await expect(correspondentPortalPage.Pricing_Return_Time).toHaveValue("Conventional");
  });
});
