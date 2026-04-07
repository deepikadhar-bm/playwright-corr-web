import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../../step-groups';
import { ApplyFiltersButtonPage } from '../../../pages/correspondant/apply-filters-button';
import { BatchinbulkbatchtimingPage } from '../../../pages/correspondant/batchinbulkbatchtiming';
import { BidRequestDetailsPage } from '../../../pages/correspondant/bid-request-details';
import { BidRequestListPage } from '../../../pages/correspondant/bid-request-list';
import { BidRequestPage } from '../../../pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../pages/correspondant/correspondent-portal';
import { P15Active2Page } from '../../../pages/correspondant/p-15-active-2';
import { PriceOfferedPage } from '../../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../../pages/correspondant/spinner';
import { StatusInactivePage } from '../../../pages/correspondant/status-inactive-';
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../../log-helper';
import { ENV } from '@config/environments';


export async function runPrereq_1303(page: Page, vars: Record<string, string>): Promise<void> {
  const applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
  const batchinbulkbatchtimingPage = new BatchinbulkbatchtimingPage(page);
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const bidRequestListPage = new BidRequestListPage(page);
  const bidRequestPage = new BidRequestPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const p15Active2Page = new P15Active2Page(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactivePage = new StatusInactivePage(page);

  const TC_ID = 'PREREQ-1303';
  const TC_TITLE = 'Setup batch timing with next business day ON, store buffered batch times in test data, navigate to bid requests and resubmit for pricing.';

  try {
    log.tcStart(TC_ID, TC_TITLE);

    // ── Step 1: Login & Navigate to Bulk Batch Timing ────────────────────
    log.step('Login and navigation to Correspondent Portal and Bulk Batch Timing');
    try {
       const credentials = ENV.getCredentials('internal');
      vars["Username"] = credentials.username;
      vars["Password"] = credentials.password;
       const profile2 = testDataManager.getProfileByName("Administration_Bulk Batch Timing");
      if (profile2 && profile2.data) {
        const TimeInterval = profile2.data[0]['Time Interval'];
        vars["Time Interval"] = TimeInterval;
        log.info(`Loaded Time Interval: ${vars["Time Interval"]}`);

        const NoOfBatches = profile2.data[0]['NO of Batches'];
        vars["NO of Batches"] = NoOfBatches;
        log.info(`Loaded NO of Batches: ${vars["NO of Batches"]}`);
      }

      const profile1 = testDataManager.getProfileByName("Bid Requests");
      if (profile1 && profile1.data) {
        const CompanyName = profile1.data[0]['Company Name'];
        vars["CompanyName"] = CompanyName;
        log.info(`Loaded Company Name: ${vars["CompanyName"]}`);


      }
      await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
      await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
      await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
      await stepGroups.stepGroup_Modifying_The_Batch_Intervals_For_Next_bussiness_day_with_on(page, vars);
      log.info('Batch intervals modified for next business day with ON');

      log.stepPass('Login, navigation, and batch interval modification successful');
    } catch (e) {
      await log.stepFail(page, 'Login/navigation or batch modification failed');
      throw e;
    }

    // ── Step 2: Capture Buffer Time & Store Buffered Batch Timings ────────
    log.step('Capturing buffer time and computing/storing buffered batch timings');
    try {
      vars["BufferTime"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
      log.info(`BufferTime: ${vars["BufferTime"]}`);

      vars["count"] = "1";
      vars["TotalExtractedBatch"] = String(await batchinbulkbatchtimingPage.Extracted_Batch_Timing.count());
      log.info(`TotalExtractedBatch: ${vars["TotalExtractedBatch"]}`);

      for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseFloat(String(vars["TotalExtractedBatch"])); dataIdx++) {
        vars["EachBatchTiming"] = await batchinbulkbatchtimingPage.Extracted_Batch_Timing2(vars["count"]).textContent() || '';
        vars["EachBatchTiming"] = (() => {
          const d = new Date('2000-01-01 ' + String(vars["EachBatchTiming"]));
          d.setMinutes(d.getMinutes() + parseInt(String(vars["BufferTime"])));
          return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
        })();
        log.info(`dataIdx ${dataIdx} — EachBatchTiming (buffered): ${vars["EachBatchTiming"]}`);

        testDataManager.updatePartialProfileDataByDataIndex(
          'Bid Requests',
          { 'Stored_Text1': vars["EachBatchTiming"] },
          dataIdx
        );
        log.info(`Stored_Text1 updated in test data at index ${dataIdx}: ${vars["EachBatchTiming"]}`);

        vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
      }

      log.stepPass('Buffer time captured and all buffered batch timings stored successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to capture buffer time or store buffered batch timings');
      throw e;
    }

    // ── Step 3: Navigate to Bid Requests & Apply Filters ─────────────────
    log.step('Navigating to Bid Requests and applying filters');
    try {
      await page.reload();
      log.info('Page reloaded successfully');

      await correspondentPortalPage.Bid_Requestsside_bar_menu.waitFor({ state: 'visible' });
      await correspondentPortalPage.Bid_Requestsside_bar_menu.click();
      log.info('Clicked Bid Requests sidebar menu');

      await priceOfferedPage.Filter_Dropdown1.click();
      log.info('Opened filter dropdown 1');

      await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
      log.info('Opened company code dropdown');

      await bidRequestListPage.Required_Company_Checkbox_filter(vars["CompanyName"]).check();
      log.info(`Checked company filter: ${vars["CompanyName"]}`);

      await p15Active2Page.Apply_Selected_Button.first().click();
      log.info('Clicked Apply Selected for company filter');

      await correspondentPortalPage.Select_Bid_Request_Status.click();
      log.info('Opened Bid Request Status dropdown');

      await expect(bidRequestPage.Upload_Expired).toBeVisible();
      log.info('"Upload Expired" option is visible');

      await bidRequestPage.Upload_Expired.check();
      log.info('Checked "Upload Expired" status filter');

      await bidRequestDetailsPage.Apply_Selected_Button_2_filter.click();
      log.info('Clicked Apply Selected for status filter');

      await expect(applyFiltersButtonPage.Apply_Filters_Button).toBeVisible();
      await applyFiltersButtonPage.Apply_Filters_Button.click();
      log.info('Clicked Apply Filters button');

      await spinnerPage.Spinner.waitFor({ state: 'hidden' });

      log.stepPass('Filters applied successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to navigate to Bid Requests or apply filters');
      throw e;
    }

    // ── Step 4: Open Bid Request & Resubmit for Pricing ──────────────────
    log.step('Opening first Bid Request and clicking resubmit to verify dropdown values');
    try {
      await expect(correspondentPortalPage.First_Bid_Request_ID.first()).toBeVisible();
      log.info('First Bid Request ID is visible in the list');

      await correspondentPortalPage.First_Bid_Request_ID.first().click();
      log.info('Clicked first Bid Request ID');

      await correspondentPortalPage.ReSubmit_For_Pricing.click();
      log.info('Clicked ReSubmit For Pricing');

      log.stepPass('Bid Request opened and clicked on resubmit button to verify the dropdown values successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to open Bid Request or resubmit for pricing');
      throw e;
    }

    log.tcEnd('PASS');

  } catch (e) {
    await log.captureOnFailure(page, TC_ID, e);
    log.tcEnd('FAIL');
    throw e;
  }
}