// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1306 } from '../../../src/helpers/prereqs/prereq-1306';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1306(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS22_TC04_01.1_Perform the resubmit for pricing action for a bid with the Chase execution type, and validate all the values in the resubmitted record . (Target: Submit today, status :Expired)', async ({ page }) => {

    await bidRequestDetailsPage.First_loan_Number_In_table.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["RequestIdPopupBeforeSubmit"] = await bidRequestDetailsPage.Bid_Request_ID_On_Loan_Details_Popup.textContent() || '';
    vars["LoanNumberPopUpBeforeSubmit"] = await bidRequestDetailsPage.Bid_Loan_Number_Loan_Details_Pop_up.textContent() || '';
    vars["ErrorsCheckPopupBeforeSubmit"] = await bidRequestDetailsPage.Errors_Check_On_Laon_Details_Popup.textContent() || '';
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
    await correspondentPortalPage.Close_Buttonemail_config.click();
    vars["FooterSubmssionBeforeSubmit"] = await bidRequestDetailsPage.Footer_Submission_Date.textContent() || '';
    vars["FooterQueuedBeforeSubmit"] = await bidRequestDetailsPage.Footer_Queued_For_Date.textContent() || '';
    await correspondentPortalPage.ReSubmit_For_Pricing_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(bidRequestDetailsPage.bidRequestDate_Today_Radio_Button).toBeVisible();
    await correspondentPortalPage.Dropdown_selection_2.click();
    await page.waitForTimeout(5000);
    if (true) /* Element Enabled Time is visible */ {
      await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page, vars);
      // [DISABLED] Scroll to the element Enabled Time into view
      // await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
      // [DISABLED] Click on Enabled Time
      // await bidRequestPage.Enabled_Time.click();
    } else {
      await correspondentPortalPage.close_pop_up_bid_request_details.click();
      await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
      await stepGroups.stepGroup_Modifying_The_Batch_Intervals_For_Next_bussiness_day_with_on(page, vars);
      await correspondentPortalPage.Bid_Requests_Side_Menu.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["RequestIDBeforeResubmit"]);
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(correspondentPortalPage.First_Bid_Request_ID).toContainText(vars["RequestIDBeforeResubmit"]);
      await correspondentPortalPage.First_Bid_Request_ID.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await correspondentPortalPage.ReSubmit_For_Pricing_Button.click();
      await expect(bidRequestDetailsPage.bidRequestDate_Today_Radio_Button).toBeVisible();
      await correspondentPortalPage.Dropdown_selection_2.click();
      await page.waitForTimeout(5000);
      await bidRequestPage.Enabled_Time.click();
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
    vars["SelectedBatchTime"] = await correspondentPortalPage.Dropdown_selection_2.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    await bidRequestDetailsPage.Submit_Button_On_pop_up.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
    await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
    await stepGroups.stepGroup_Verify_that_the_Bid_Upload_Progress_Popup_has_All_statuses_w(page, vars);
    await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  });
});
