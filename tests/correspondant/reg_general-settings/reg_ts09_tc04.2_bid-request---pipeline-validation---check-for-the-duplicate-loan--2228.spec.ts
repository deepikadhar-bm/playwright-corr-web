// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestConfigPage } from '../../../src/pages/correspondant/bid-request-config';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_2234 } from '../../../src/helpers/prereqs/prereq-2234';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let bidRequestConfigPage: BidRequestConfigPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_2234(page, vars);
    bidRequestConfigPage = new BidRequestConfigPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS09_TC04.2_Bid Request - Pipeline Validation - Check for the Duplicate Loan Check, - by enable and disable upload the loan for verification.', async ({ page }) => {

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestPage.Bid_Request_Config_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["LightGrayColor"] = "rgba(204, 204, 204, 1)";
    vars["BrightBlueColor"] = "rgba(33, 150, 243, 1)";
    vars[""] = await bidRequestConfigPage.Loan_Duplicate_Toggle.evaluate((el) => window.getComputedStyle(el as HTMLElement).backgroundColor);
    if (String(vars["ToggleColor"]) === String(vars["LightGrayColor"])) {
      await bidRequestConfigPage.Loan_Duplicate_Toggle.click();
    }
    await expect(bidRequestConfigPage.Loan_Duplicate_Toggle).toHaveCSS('border', vars["BrightBlueColor"]);
    // [DISABLED] Wait for 5 seconds
    // await page.waitForTimeout(5000);
    // [DISABLED] Get background color of element Loan Duplicate Toggle and store into ldf
    // vars[""] = await bidRequestConfigPage.Loan_Duplicate_Toggle.evaluate((el) => window.getComputedStyle(el as HTMLElement).backgroundColor);
    // [DISABLED] Get background color of Loan Duplicate Toggle and convert to color name and store into xcf
    // vars[""] = await bidRequestConfigPage.Loan_Duplicate_Toggle.evaluate((el) => window.getComputedStyle(el as HTMLElement).backgroundColor);
    // [DISABLED] Wait until the element Save Changes Button is enabled
    // await correspondentPortalPage.Save_Changes_Button.waitFor({ state: 'visible' });
    if (true) /* Element Save Changes Button is enabled */ {
      await bidRequestConfigPage.Save_Changes_Button.click();
    }
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    // [DISABLED] Click on Save Changes Button
    // await bidRequestConfigPage.Save_Changes_Button.click();
    // [DISABLED] Wait until the element Spinner is not visible
    // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
    await stepGroups.stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
    await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
    await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
    await stepGroups.stepGroup_Upload_Bid_Request_from_batch_time_selection_to_continue_but(page, vars);
    // [DISABLED] Store the count of elements identified by locator Rows Count Table 1 into a variable RowsCount
    // vars["RowsCount"] = String(await bidRequestDetailsPage.Rows_Count_Table_1.count());
    // [DISABLED] Mouseover the element First error data
    // await bidRequestDetailsPage.First_error_data.hover();
    // [DISABLED] Store the count of elements identified by locator Not Approved for Conventional Error Description into a variable ConventionalErrorCount
    // vars["ConventionalErrorCount"] = String(await bidRequestDetailsPage.Not_Approved_for_Conventional_Error_Description.count());
    // [DISABLED] Verify if RowsCount == ConventionalErrorCount
    // expect(String(vars["RowsCount"])).toBe(vars["ConventionalErrorCount"]);
    await stepGroups.stepGroup_Navigating_To_Bid_Request_Config(page, vars);
    await bidRequestConfigPage.Loan_Duplicate_Toggle.click();
    await page.waitForLoadState('networkidle');
    await expect(bidRequestConfigPage.Loan_Duplicate_Toggle).toHaveCSS('border', vars["LightGrayColor"]);
    await bidRequestConfigPage.Save_Changes_Button.waitFor({ state: 'visible' });
    await bidRequestConfigPage.Save_Changes_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
    await stepGroups.stepGroup_Uploading_Bid_Request(page, vars);
    await stepGroups.stepGroup_Upload_Bid_Request_from_batch_time_selection_to_continue_but(page, vars);
    // [DISABLED] Select option using value Conventional in the Conventional Dropdown(Bid Request Config) list
    // await correspondentPortalPage.Pricing_Return_Time.selectOption({ label: "Conventional" });
    // [DISABLED] Pick the current date MM/d/yyyy : h:mm a by location UTC and store into a variable ExpectedModifiedTime
    // vars["ExpectedModifiedTime"] = (() => {
    //   const d = new Date();
    //   const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
    //   const fmt = "MM/d/yyyy : h:mm a";
    //   // Map Java date format to Intl parts
    //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    //   const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    // })();
    // [DISABLED] Adjust UTC Time by Subtracting Minutes hh:mm a 1 into HourMinMinus1
    // vars[""] = (() => {
    //   const d = new Date('2000-01-01 ' + String(''));
    //   d.setMinutes(d.getMinutes() - parseInt(String('')));
    //   return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    // })();
    // [DISABLED] Verify that the Conventional Dropdown(Bid Request Config) list has option with value Conventional selected and With Scrollable FALSE
    // await expect(correspondentPortalPage.Pricing_Return_Time).toHaveValue("Conventional");
    await stepGroups.stepGroup_Navigating_To_Bid_Request_Config(page, vars);
    await bidRequestConfigPage.Loan_Duplicate_Toggle.click();
    await page.waitForLoadState('networkidle');
    await expect(bidRequestConfigPage.Loan_Duplicate_Toggle).toHaveCSS('border', vars["BrightBlueColor"]);
    await bidRequestConfigPage.Save_Changes_Button.waitFor({ state: 'visible' });
    await bidRequestConfigPage.Save_Changes_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  });
});
