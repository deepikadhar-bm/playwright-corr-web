// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CancelButtonPage } from '../../../src/pages/correspondant/cancel-button';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1253 } from '../../../src/helpers/prereqs/prereq-1253';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let bidRequestsPage: BidRequestsPage;
  let cancelButtonPage: CancelButtonPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let okButtonPage: OkButtonPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1253(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    cancelButtonPage = new CancelButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    okButtonPage = new OkButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS24_TC02_02_Verify that submit for pricing button should be disabled for the status and the Queued For Time text Should be Red In colour for passed time.', async ({ page }) => {

    vars["BidRequestID1"] = await bidRequestDetailsPage.Bid_Request_Details_Text.textContent() || '';
    await bidRequestDetailsPage.Submit_for_PricingEnabled.click();
    await expect(page.getByText("Submit for Pricing\r")).toBeVisible();
    await bidRequestDetailsPage.Yes_Submit_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    if (await okButtonPage.Ok_Button.isVisible()) {
      await okButtonPage.Ok_Button.click();
    }
    if (await cancelButtonPage.Cancel_Button.isVisible()) {
      await cancelButtonPage.Cancel_Button.click();
    }
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["TrimmedBidRequestID1"] = String(vars["BidRequestID1"]).trim();
    // [DISABLED] Enter TrimmedBidRequestID1 in the Search by Bid Request ID Field field
    // await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["TrimmedBidRequestID1"]);
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(String(vars["TrimmedBidRequestID1"]));
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.First_Bid_Request_ID.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["Status"] = await bidRequestDetailsPage.Statusbid_request_details.inputValue() || '';
    // [DISABLED] Verify that the element Bid Status From Details displays text Queued for Next Batch and With Scrollable FALSE
    // await expect(bidRequestDetailsPage.Statusbid_request_details).toContainText("Queued for Next Batch\r");
    vars["ExtractedQueuedForTime"] = await bidRequestDetailsPage.Queued_Forbid_request_details_text_dark.textContent() || '';
    vars["ExtractedQueuedForTime(only time)"] = String('').split("")["3"] || '';
    vars["ExtractedQueuedForTime(extracted hour minutes)"] = vars["ExtractedQueuedForTime(only time)"];
    vars["ExtractedQueuedForTime(only am pm)"] = String('').split("")["4"] || '';
    vars["ExtractedQueuedForTime(extracted am pm)"] = vars["ExtractedQueuedForTime(only am pm)"];
    vars[""] = String(vars["ExtractedQueuedForTime(extracted hour minutes)"]) + ' ' + String(vars["ExtractedQueuedForTime(extracted am pm)"]);
    vars["CurrentDateExtracted(EST)"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
      const fmt = "hh:mm a ";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    vars["WaitTime"] = Math.abs(new Date('2000-01-01 ' + String(vars["CurrentDateExtracted(EST)"])).getTime() - new Date('2000-01-01 ' + String(vars["ExtractedQueuedForTime( time with am pm)"])).getTime()) / 60000 + '';
    if (true) /* Element Queued For(bid request details text dark) has attrib */ {
      if (String(vars["WaitTime"]) > String("4")) {
        await page.waitForTimeout(240000);
        await page.reload();
        vars["WaitTime"] = (parseFloat(String(vars["WaitTime"])) - parseFloat(String("4"))).toFixed(0);
        vars["WaitTime"] = (parseFloat(String("60")) * parseFloat(String(vars["WaitTime"]))).toFixed(0);
      } else {
        vars["WaitTime"] = (parseFloat(String(vars["WaitTime"])) * parseFloat(String("60"))).toFixed(0);
      }
      await page.waitForTimeout(parseInt(vars["WaitTime"]) * 1000);
      await page.reload();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(bidRequestsPage.Queued_Forbid_request_details_text_danger).toHaveAttribute('title', "text-danger");
      await expect(bidRequestDetailsPage.Submit_For_Pricingdisabled).toBeDisabled();
    } else {
      await expect(bidRequestsPage.Queued_Forbid_request_details_text_danger).toHaveAttribute('title', "text-danger");
      await expect(bidRequestDetailsPage.Submit_For_Pricingdisabled).toBeDisabled();
    }
    await correspondentPortalPage.Bid_Requestsside_bar_menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
    // [DISABLED] Enter TrimmedBidRequestID1 in the Search by Bid Request ID Field field
    // await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["TrimmedBidRequestID1"]);
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(String(vars["TrimmedBidRequestID1"]));
    vars[""] = String(vars["ExtractedQueuedForTime( time with am pm)"]) + ' ' + String("ET");
    vars["ExtractedQueuedForTime( time with am pm ET)"] = String('') + String('');
    vars["FinalExpectedStatus(bid requests)"] = String(vars["FinalExpectedStatus(bid requests)"]).trim();
    vars["FinalActualStatus(bid requests)"] = await bidRequestPage.First_Status_In_Column.textContent() || '';
    vars["FinalActualStatus(bid requests)"] = String(vars["FinalActualStatus(bid requests)"]).trim();
    expect(String(vars["FinalActualStatus(bid requests)"]).toLowerCase()).toContain(String(vars["FinalExpectedStatus(bid requests)"]).toLowerCase());
  });
});
